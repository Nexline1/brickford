"""Brickford local server — serves the career-path folder so the platform
can also read the founding markdown documents. Zero dependencies.

Binds to all interfaces so the platform is reachable from a phone on the
same Wi-Fi network at http://<this-PC's-LAN-IP>:8137/platform/.
"""
import http.server
import os
import socket
import socketserver
import sys
import threading
import webbrowser

PORT = 8137
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # career-path/


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stdout.write("[brickford] " + (fmt % args) + "\n")
        sys.stdout.flush()


class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


def lan_ip():
    """Best-effort LAN address (no traffic is actually sent)."""
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        return s.getsockname()[0]
    except OSError:
        return None
    finally:
        s.close()


def main():
    url = f"http://localhost:{PORT}/platform/"
    if "--no-browser" not in sys.argv:
        threading.Timer(0.8, lambda: webbrowser.open(url)).start()
    with ReusableTCPServer(("0.0.0.0", PORT), Handler) as httpd:
        print("Brickford is open.")
        print(f"  This PC:  {url}")
        ip = lan_ip()
        if ip:
            print(f"  Phone (same Wi-Fi):  http://{ip}:{PORT}/platform/")
            print("  (If Windows asks about firewall access for Python, click Allow.)")
        print("  Ctrl+C to close.")
        sys.stdout.flush()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
