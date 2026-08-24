# ===== University Network Management Console =====
from tcp import *
from http import *
from time import *

# ================== MENU ==================
# Change OPTION below:
#    1 = check all services
#    2 = check a single service 
#    3 = exit
OPTION = 1
SINGLE = 1
CONNECT_WAIT = 2     
DNS_TIMEOUT = 5      
# ==========================================

WEB_IP = "192.168.4.12"
WEB_PORT = 80

# TCP services checked by IP + port 
SERVICES = [
    ("Web Server (HTTP)",  WEB_IP,        WEB_PORT),
    ("Mail Server (SMTP)", "192.168.4.13", 25),
    ("Mail Server (POP3)", "192.168.4.13", 110),
    ("FTP Server",         "192.168.4.14", 21),
]

DNS_NAME = "DNS (name resolution)"
DNS_URL = "http://www.university.local"


_dns_done = False
_dns_ok = False

def _onHTTPDone(status, data):
    global _dns_done, _dns_ok
    _dns_done = True
    if status == 200:
        _dns_ok = True
    else:
        _dns_ok = False

def resolve_by_http():
    global _dns_done, _dns_ok
    _dns_done = False
    _dns_ok = False
    http = HTTPClient()
    http.onDone(_onHTTPDone)
    try:
        http.open(DNS_URL)
    except:
        return False
    waited = 0
    while (not _dns_done) and (waited < DNS_TIMEOUT):
        sleep(0.5)
        waited = waited + 0.5
    try:
        http.stop()
    except:
        pass
    return _dns_ok

def check_service(ip, port):
    client = TCPClient()
    up = False
    try:
        client.connect(ip, port)
        sleep(CONNECT_WAIT)   
        up = client.connected()
    except:
        up = False
    try:
        client.close()
    except:
        pass
    return up

def dns_status():
    if resolve_by_http():
        return "online"
    if check_service(WEB_IP, WEB_PORT):
        return "offline"   
    return "unknown"        

def check_all():
    print("")
    print("========================================")
    print("   University Network - Service Status")
    print("========================================")
    online = 0
    for name, ip, port in SERVICES:
        try:
            if check_service(ip, port):
                online = online + 1
                print("[ OK ]  " + name + " -> Online  (Success)")
            else:
                print("[FAIL]  " + name + " -> Offline (Failed)")
        except:
            print("[ERR ]  " + name + " -> Error checking")
    d = dns_status()
    if d == "online":
        online = online + 1
        print("[ OK ]  " + DNS_NAME + " -> Online  (name resolved)")
    elif d == "offline":
        print("[FAIL]  " + DNS_NAME + " -> Offline (web is up but name failed)")
    else:
        print("[WARN]  " + DNS_NAME + " -> Unknown (web is down, cannot verify DNS)")
    total = len(SERVICES) + 1
    print("----------------------------------------")
    print("Summary: " + str(online) + "/" + str(total) + " services online")
    if online == total:
        print("Overall Status: ALL SYSTEMS OPERATIONAL")
    elif online == 0:
        print("Overall Status: NETWORK DOWN")
    else:
        print("Overall Status: PARTIAL OUTAGE")
    print("========================================")

def check_one(index):
    total = len(SERVICES) + 1
    if index < 1 or index > total:
        print("Invalid service number.")
        return
    if index == total:
        d = dns_status()
        if d == "online":
            print(DNS_NAME + " -> Online (name resolved)")
        elif d == "offline":
            print(DNS_NAME + " -> Offline (web up but name failed)")
        else:
            print(DNS_NAME + " -> Unknown (web down, cannot verify)")
        return
    name, ip, port = SERVICES[index - 1]
    if check_service(ip, port):
        print(name + " -> Online (Success)")
    else:
        print(name + " -> Offline (Failed)")

def show_menu():
    print("===== Network Management Console =====")
    print(" 1) Check ALL services")
    print(" 2) Check a single service")
    print(" 3) Exit")
    print("(Set OPTION at top of code, then Run)")

show_menu()
if OPTION == 1:
    check_all()
elif OPTION == 2:
    check_one(SINGLE)
elif OPTION == 3:
    print("Goodbye!")
else:
    print("Invalid OPTION value.")