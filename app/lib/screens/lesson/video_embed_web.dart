import 'dart:js_interop';
import 'dart:js_interop_unsafe';
import 'dart:ui_web' as ui_web;

import 'package:flutter/material.dart';

@JS('document.createElement')
external JSObject _createElement(JSString tag);

final _registered = <String>{};

class VideoEmbed extends StatelessWidget {
  const VideoEmbed({super.key, required this.src, this.videoId});
  final String src;
  final String? videoId;

  String _viewType() {
    final type = 'brickford-yt-${src.hashCode}';
    if (_registered.add(type)) {
      ui_web.platformViewRegistry.registerViewFactory(type, (int _) {
        final el = _createElement('iframe'.toJS);
        el.callMethod('setAttribute'.toJS, 'src'.toJS, src.toJS);
        el.callMethod('setAttribute'.toJS, 'title'.toJS, 'YouTube video player'.toJS);
        el.callMethod('setAttribute'.toJS, 'allow'.toJS,
            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'.toJS);
        el.callMethod('setAttribute'.toJS, 'allowfullscreen'.toJS, ''.toJS);
        el.callMethod('setAttribute'.toJS, 'referrerpolicy'.toJS, 'strict-origin-when-cross-origin'.toJS);
        final style = el.getProperty<JSObject>('style'.toJS);
        style.setProperty('border'.toJS, '0'.toJS);
        style.setProperty('width'.toJS, '100%'.toJS);
        style.setProperty('height'.toJS, '100%'.toJS);
        return el;
      });
    }
    return type;
  }

  @override
  Widget build(BuildContext context) {
    return AspectRatio(
      aspectRatio: 16 / 9,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: ColoredBox(color: Colors.black, child: HtmlElementView(viewType: _viewType())),
      ),
    );
  }
}
