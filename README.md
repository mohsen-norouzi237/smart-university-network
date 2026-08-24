# Smart University Network — Cisco Packet Tracer

> Design and implementation of a redundant, multi-building **smart university network** in Cisco Packet Tracer, including core network services, a custom **Network Management Console**, and a bonus **IoT Data Center Disaster Recovery** system.

[فارسی / Persian README](README.fa.md)

---

## Overview

This project simulates the full network infrastructure of a university campus with four main buildings:

- **Academic Building**
- **Administrative Building**
- **Library**
- **Data Center**

The four buildings are connected through **four routers** running **OSPF** in a **ring topology** (`R0 – R1 – R2 – R3 – R0`) so that if any single link fails, traffic automatically re-routes through the alternate path.

On top of the network, a custom **University Network Management Console** (written with the Packet Tracer scripting engine) monitors the health of the core services in real time.

A separate **bonus module** implements a smart IoT-based Disaster Recovery system for the Data Center.

![Network topology](docs/images/01-network-topology.png)

---

## Features

### Network infrastructure
- **4 routers (Cisco ISR 2911)** in a redundant ring, routed with **OSPF (area 0)**.
- **4+ independent LANs**, one per building, with correct IP addressing.
- `/30` point-to-point links between routers and a `/24` network for the Data Center.
- **Link-failure redundancy** verified with continuous ping + `tracert` + `show ip route`.

### Core network services (Data Center)
- **DHCP Server** with per-LAN pools and `ip helper-address` relay on each router.
- **DNS Server** resolving `www.university.local`, `mail.university.local`, `ftp.university.local`.
- **Web Server** serving a custom “Smart University” homepage.
- **Mail Server** (SMTP/POP3) with user accounts under the `university.com` domain.
- **File / FTP Server** for uploading and downloading course files.
- **Wireless access** for a smartphone in the Library via an Access Point (WPA2-PSK + DHCP).

### University Network Management Console
A network monitoring tool built with the Packet Tracer scripting engine, provided in two flavors:
- **CLI console** (`network-console.py`) — a text menu that checks each service and prints an `Online / Offline` report and an overall status summary.
- **GUI dashboards** — modern HTML/JS dashboards (“NOC Dashboard” and “Network Operations”) that poll the services and show live status cards.

![Network Operations dashboard](docs/images/07-noc-dashboard-online.png)

### Bonus — IoT Data Center Disaster Recovery
An IoT controller (`disaster-recovery-controller.py`) that reacts to emergencies in the Data Center:
- Reads a **temperature sensor** and a **smoke sensor**.
- When temperature ≥ **45°C** *and* smoke is detected, it enters a **critical state**: turns on the **alarm**, switches the LED from **green to red**, starts the **fan**, **opens the door**, and shows a warning on the **display**.
- When conditions return to normal, it restores every device to its initial safe state.

<p align="center">
  <img src="docs/images/11-iot-normal.png" width="45%" alt="IoT normal state" />
  <img src="docs/images/12-iot-emergency.png" width="45%" alt="IoT emergency state" />
</p>

---

## Repository structure

```text
.
├─ net.pkt                                  # Cisco Packet Tracer project file
├─ LICENSE
├─ README.md                                # English (this file)
├─ README.fa.md                             # Persian
├─ docs/
│  ├─ report.pdf                            # Full project report (PDF)
│  ├─ report.docx                           # Full project report (Word)
│  └─ images/                               # Screenshots used in the docs
└─ src/
   ├─ management-console/
   │  ├─ network-console.py                 # CLI service-checker console
   │  ├─ laptop-noc-dashboard/              # GUI dashboard app (NOC Dashboard)
   │  └─ network-console-gui/               # GUI dashboard app (Network Operations)
   └─ bonus-disaster-recovery/
      └─ disaster-recovery-controller.py    # IoT emergency controller (bonus)
```

---

## IP addressing (summary)

| Item | Value |
|------|-------|
| Router ring links | `/30` (255.255.255.252) |
| Data Center network | `192.168.4.0/24` |
| Data Center gateway | `192.168.4.1` |
| DHCP Server | `192.168.4.10` |
| DNS Server | `192.168.4.11` |
| Web Server | `192.168.4.12` |
| Mail Server | `192.168.4.13` |
| File / FTP Server | `192.168.4.14` |

Full interface tables, router configs, and the complete addressing plan are in the [project report](docs/report.pdf).

---

## How to run

1. Install **Cisco Packet Tracer** (version 8.x or newer recommended).
2. Open `net.pkt`.
3. Wait a few seconds for OSPF to converge, then verify connectivity with `ping` / `tracert` between buildings.
4. **Management Console:** open the PC/Laptop/SBC device → `Programming` tab to view/run the console scripts, or `Desktop` to open the GUI dashboards.
5. **Bonus (Disaster Recovery):** open the IoT controller board → `Programming` tab, run the script, then raise the temperature and smoke values to trigger the emergency response.

> The scripts under `src/` are copies of the code that runs inside the Packet Tracer devices, kept here for easy reading and review.

---

## Screenshots

| | |
|---|---|
| ![OSPF config](docs/images/02-ospf-config.png) | ![Redundancy test](docs/images/03-redundancy-tracert.png) |
| OSPF configuration | Link-failure redundancy test |
| ![Web server](docs/images/05-web-server.png) | ![DNS records](docs/images/04-dns-records.png) |
| Web Server homepage | DNS records |
| ![CLI console](docs/images/06-console-cli.png) | ![Laptop dashboard](docs/images/09-laptop-dashboard.png) |
| CLI management console | Laptop NOC dashboard |
| ![IoT topology](docs/images/10-iot-topology.png) | ![IoT controller output](docs/images/13-iot-controller-output.png) |
| IoT disaster-recovery layout | IoT controller output |

---

## Tech & concepts

Cisco Packet Tracer · OSPF · Network redundancy · DHCP · DNS · SMTP/POP3 · HTTP · FTP · Wireless (WPA2-PSK) · IoT · Packet Tracer scripting (Python & JavaScript)

---

## Author

**Mohsen Norouzi (محسن نوروزی)**

- GitHub: [@mohsen-norouzi237](https://github.com/mohsen-norouzi237)
- Email: [mnorouzi2018@gmail.com](mailto:mnorouzi2018@gmail.com)
- LinkedIn: [mohsen-norouzi](https://www.linkedin.com/in/mohsen-norouzi-143bb5336/)

> Academic project for the **Computer Networks** course.

## License

Released under the [MIT License](LICENSE).
