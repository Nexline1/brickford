// Calendar arithmetic on ISO dates ("YYYY-MM-DD"), the way platform/js/app.js
// does it. The web app keeps dates as strings and compares them as strings, so
// this does too: every helper takes and returns an ISO string, and ordering
// is String.compareTo, which is calendar order for this format.
//
// All arithmetic is in UTC, where a day is always 24 hours. app.js mixes local
// (addDaysISO, dowOf) and UTC (daysBetween) Date objects, but for a calendar
// date the answers are the same either way: a weekday, a day count and the
// date n days on do not depend on the zone. tools/verify-app.js holds that.
library;

DateTime _utc(String iso) =>
    DateTime.utc(int.parse(iso.substring(0, 4)), int.parse(iso.substring(5, 7)), int.parse(iso.substring(8, 10)));

String _pad2(int n) => n.toString().padLeft(2, '0');

String isoOf(DateTime d) => '${d.year.toString().padLeft(4, '0')}-${_pad2(d.month)}-${_pad2(d.day)}';

/// The local calendar date of [d] — NOT its UTC date (app.js localISO).
String localISO(DateTime d) => '${d.year.toString().padLeft(4, '0')}-${_pad2(d.month)}-${_pad2(d.day)}';

/// app.js addDaysISO.
String addDaysISO(String iso, int n) {
  final d = _utc(iso);
  return isoOf(DateTime.utc(d.year, d.month, d.day + n));
}

/// app.js daysBetween: whole days from [a] to [b].
int daysBetween(String a, String b) => _utc(b).difference(_utc(a)).inDays;

/// app.js dowOf: 0 = Sunday … 6 = Saturday.
int dowOf(String iso) => _utc(iso).weekday % 7;

bool lt(String a, String b) => a.compareTo(b) < 0;
bool le(String a, String b) => a.compareTo(b) <= 0;
bool gt(String a, String b) => a.compareTo(b) > 0;
bool ge(String a, String b) => a.compareTo(b) >= 0;
