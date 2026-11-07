import 'dart:js_interop';
import 'dart:js_interop_unsafe';

bool navigatorOffline() {
  final nav = globalContext.getProperty<JSObject?>('navigator'.toJS);
  if (nav == null) return false;
  final on = nav.getProperty<JSAny?>('onLine'.toJS);
  return on != null && (on as JSBoolean).toDart == false;
}

void listenOnline(void Function() onOnline, void Function() onOffline) {
  globalContext.callMethod('addEventListener'.toJS, 'online'.toJS, onOnline.toJS);
  globalContext.callMethod('addEventListener'.toJS, 'offline'.toJS, onOffline.toJS);
}
