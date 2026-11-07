// The microphone and the clip store: real on the web (MediaRecorder and
// IndexedDB through dart:js_interop), none elsewhere until the Android stage.
export 'audio_stub.dart' if (dart.library.js_interop) 'audio_web.dart';
