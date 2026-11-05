// navigator.onLine and the browser's online/offline events, on the web build;
// elsewhere nothing to ask, so the first request that gets no answer says so
// (app.js's rule for a Wi-Fi with no internet behind it).
export 'net_status_stub.dart' if (dart.library.js_interop) 'net_status_web.dart';
