import 'dart:js_interop';
import 'dart:js_interop_unsafe';

/// window.history.go(delta).
void historyGo(int delta) {
  (globalContext['history'] as JSObject).callMethod('go'.toJS, delta.toJS);
}
