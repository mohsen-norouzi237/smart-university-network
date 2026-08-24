var icons = {
  "WEB": "🌍",
  "SMTP": "✉️",
  "POP3": "📥",
  "FTP": "📁",
  "DNS": "🔍"
};

function update(type, args) {
  if (type === "status") {
    var order = ["WEB", "SMTP", "POP3", "FTP", "DNS"];
    var html = "";
    
    for (var i = 0; i < order.length; i++) {
      var k = order[i];
      var v_raw = (args.status_data[k] !== undefined) ? args.status_data[k] : "WAIT";
      
      var v_display = "Waiting";
      if (v_raw === "UP") v_display = "Online";
      if (v_raw === "DOWN") v_display = "Offline";

      var cls = (v_raw === "UP") ? "up" : ((v_raw === "DOWN") ? "down" : "wait");
      var icon = icons[k] || "🖥️";
      
      html += '<div class="card ' + cls + ' clearfix">' +
                '<div class="service-info">' +
                    '<span class="service-icon">' + icon + '</span> ' +
                    '<span>' + k + ' Service</span>' +
                '</div>' +
                '<div class="status-badge">' + v_display + '</div>' +
              '</div>';
    }
    
    document.getElementById("list").innerHTML = html;
    

    var timeStr = args.update_time;
    if (timeStr.indexOf("Uptime Uptime") > -1) {
       timeStr = timeStr.replace("Uptime Uptime", "Uptime");
    }
    document.getElementById("last-updated").innerText = "Last checked: " + timeStr;
    
    var summaryEl = document.getElementById("summary");
    summaryEl.className = "summary-box " + args.overall_class;
    
    var overallText = "Partial Outage";
    if (args.online_count === args.total_count) overallText = "All Systems Operational";
    else if (args.online_count === 0) overallText = "Major Network Failure";
    
    summaryEl.innerText = args.online_count + " / " + args.total_count + " Online | " + overallText;
  }
}