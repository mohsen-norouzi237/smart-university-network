var icons = {
  "WEB": "🌍",
  "DNS": "🔍",
  "DHCP": "⚙️",
  "MAIL": "📧",
  "FTP": "📁"
};

function update(type, args) {
  if (type === "status") {
    var order = ["WEB", "DNS", "DHCP", "MAIL", "FTP"];
    var html = "";
    
    for (var i = 0; i < order.length; i++) {
      var k = order[i];
      var v = (args.status_data[k] !== undefined) ? args.status_data[k] : "WAIT";
      var cls = (v === "UP") ? "up" : ((v === "DOWN") ? "down" : "wait");
      var icon = icons[k] || "🖥️";
      
      html += '<div class="card ' + cls + '">' +
                '<div class="service-info">' +
                    '<span>' + icon + '</span>' +
                    '<span>' + k + '</span>' +
                '</div>' +
                '<div class="status-badge">' + v + '</div>' +
              '</div>';
    }
    
    document.getElementById("list").innerHTML = html;
    document.getElementById("last-updated").innerText = "آخرین به‌روزرسانی: " + args.update_time;
  }
}