import json
import psutil
import socket
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio

class StatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.task = asyncio.create_task(self.send_status_loop())

    async def disconnect(self, close_code):
        self.task.cancel()

    async def send_status_loop(self):
        while True:
            battery = psutil.sensors_battery()
            net_stats = psutil.net_if_stats()
            net_addrs = psutil.net_if_addrs()

            wifi = False
            ethernet = False

            for iface, stats in net_stats.items():
                if not stats.isup:
                    continue
                has_ip = any(addr.family == socket.AF_INET for addr in net_addrs.get(iface, []))
                if not has_ip:
                    continue
                name = iface.lower()
                if "wl" in name or "wlan" in name:
                    wifi = True
                elif "en" in name or "eth" in name:
                    ethernet = True

            await self.send(json.dumps({
                "battery": {
                    "percent": battery.percent if battery else None,
                    "plugged": battery.power_plugged if battery else None
                },
                "network": {
                    "wifi": wifi,
                    "ethernet": ethernet,
                    "online": wifi or ethernet
                }
            }))

            await asyncio.sleep(1)
