// Opens a link in a new tab on the web build; elsewhere nothing to open it in
// until the Android stage adds url_launcher.
export 'open_url_stub.dart' if (dart.library.js_interop) 'open_url_web.dart';
