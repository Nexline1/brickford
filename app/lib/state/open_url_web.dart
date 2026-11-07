import 'dart:js_interop';
import 'dart:js_interop_unsafe';

/// window.open(url, "_blank", "noopener"): a new tab, so the app stays where it is.
void openUrl(String url) {
  globalContext.callMethod('open'.toJS, url.toJS, '_blank'.toJS, 'noopener'.toJS);
}
