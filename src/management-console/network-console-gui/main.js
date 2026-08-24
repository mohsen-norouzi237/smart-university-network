
var services = [
  { key: "WEB",  ip: "192.168.4.12", port: 80, kind: "tcp" },
  { key: "SMTP", ip: "192.168.4.13", port: 25, kind: "tcp" },
  { key: "POP3", ip: "192.168.4.13", port: 110, kind: "tcp" },
  { key: "FTP",  ip: "192.168.4.14", port: 21, kind: "tcp" },
  { key: "DNS",  url: "http://www.university.local", kind: "dns_http" }
];

var status = {};
var pending = {};
var CHECK_INTERVAL = 5;
var TIMEOUT = 4;
var lastRound = -999;
var started = false;

function setup() {
  GUI.setup();
  for (var i = 0; i < services.length; i++) {
    status[services[i].key] = "WAIT";
  }
  pushGUI();
}

function loop() {
  var now = uptime();

  if (!started && now >= 1) { started = true; runChecks(); }
  if (started && now - lastRound >= CHECK_INTERVAL) runChecks();

  for (var k in pending) {
    if (now - pending[k].start >= TIMEOUT) {
      closeClient(pending[k].client);
      delete pending[k];
      setStatus(k, "DOWN");
    }
  }
}

function runChecks() {
  lastRound = uptime();
  for (var i = 0; i < services.length; i++) startCheck(services[i]);
}

function startCheck(s) {
  closePending(s.key);
  try {
    if (s.kind === "tcp") {
      var c = new TCPClient();
      pending[s.key] = { client: c, start: uptime() };
      c.onConnectionChange = function(type) {
        if (pending[s.key] && pending[s.key].client === c) {
          delete pending[s.key];
          setStatus(s.key, "UP");
          closeClient(c);
        }
      };
      c.connect(s.ip, s.port);
      
    } else if (s.kind === "dns_http") {
      var h = new HTTPClient();
      pending[s.key] = { client: h, start: uptime() };
      h.onDone = function(code, data) {
        if (pending[s.key] && pending[s.key].client === h) {
          delete pending[s.key];
          setStatus(s.key, (code === 200) ? "UP" : "DOWN");
        }
      };
      h.open(s.url);
    }
  } catch (e) {
    setStatus(s.key, "DOWN");
  }
}

function closePending(key) {
  if (pending[key]) { closeClient(pending[key].client); delete pending[key]; }
}

function closeClient(cl) {
  try { if (cl.stop)  cl.stop();  } catch (e) {}
  try { if (cl.close) cl.close(); } catch (e) {}
}

function setStatus(key, val) { 
  status[key] = val; 
  pushGUI(); 
}

function pushGUI() { 
  var sim_time = Math.floor(uptime());
  var mins = Math.floor(sim_time / 60);
  var secs = sim_time % 60;
  
  if (mins < 10) mins = "0" + mins;
  if (secs < 10) secs = "0" + secs;
  
 
  var upCount = 0;
  for (var i = 0; i < services.length; i++) {
    if (status[services[i].key] === "UP") upCount++;
  }
  
  var overall = "PARTIAL OUTAGE";
  var overallClass = "wait";
  if (upCount === services.length) { overall = "ALL SYSTEMS OPERATIONAL"; overallClass = "up"; }
  else if (upCount === 0) { overall = "NETWORK DOWN"; overallClass = "down"; }

  var payload = {
    status_data: status,
    update_time: "Uptime " + mins + ":" + secs,
    overall_text: overall,
    overall_class: overallClass,
    online_count: upCount,
    total_count: services.length
  };
  
  GUI.update("status", payload); 
}

function guiEvent(type, args) { 
  if (type === "refresh") runChecks(); 
}