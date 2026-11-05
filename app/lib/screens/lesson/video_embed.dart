// The lecture's YouTube embed. On the web it is a real <iframe> in an
// HtmlElementView (video_embed_web.dart); elsewhere the video's own
// thumbnail, until the Android stage adds a player.
export 'video_embed_stub.dart' if (dart.library.js_interop) 'video_embed_web.dart';
