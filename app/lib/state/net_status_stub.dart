/// No navigator.onLine off the web: never "offline" until a request fails.
bool navigatorOffline() => false;

/// Calls [onOnline] when the connection comes back (never, off the web).
void listenOnline(void Function() onOnline, void Function() onOffline) {}
