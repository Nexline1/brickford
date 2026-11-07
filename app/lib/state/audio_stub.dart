// No microphone off the web until the Android stage: the hand form, as the web
// app's "no getUserMedia" case.
import 'recorder.dart';

class _None implements AudioBackend {
  @override
  bool get micSupported => false;
  @override
  bool get storeSupported => false;
  @override
  Future<MicSession?> openMic() async => null;
  @override
  Future<List<StoredClip>> list() async => const [];
  @override
  Future<String> add({required String date, required int seconds, required String kind, required String title, required RecordedAudio audio}) async => throw UnsupportedError('no clip store');
  @override
  Future<void> rename(String key, String title) async {}
  @override
  Future<void> delete(String key) async {}
  @override
  ClipPlayer player(StoredClip clip, void Function() onChange) => throw UnsupportedError('no player');
  @override
  void download(StoredClip clip) {}
  @override
  void releaseUrls() {}
}

AudioBackend createAudioBackend() => _None();
