var services = [
  { key: "WEB",  ip: "192.168.4.12", port: 80, kind: "http" },
  { key: "DNS",  ip: "192.168.4.11", port: 53, kind: "tcp"  },
  { key: "DHCP", ip: "192.168.4.10", port: 67, kind: "tcp"  },
  { key: "MAIL", ip: "192.168.4.13", port: 25, kind: "tcp"  },
  { key: "FTP",  ip: "192.168.4.14", port: 21, "kind": "tcp"  }
];

var status = {};
var pending = {};
var CHECK_INTERVAL = 5;
var TIMEOUT = 3;
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
    if (s.kind === "http") {
      var http = new HTTPClient();
      pending[s.key] = { client: http, start: uptime() };
      http.onDone = function(code, data) {
        if (pending[s.key] && pending[s.key].client === http) {
          delete pending[s.key];
          setStatus(s.key, "UP");
        }
      };
      http.open("http://" + s.ip);
    } else {
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
  
  var time_str = "Uptime " + mins + ":" + secs;
  
  var payload = {
    status_data: status,
    update_time: time_str
  };
  
  GUI.update("status", payload); 
}

function guiEvent(type, args) { 
  if (type === "refresh") runChecks(); 
}