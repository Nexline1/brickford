// Off the web (the APK, widget tests): the video's own thumbnail with a play
// glyph, or the clean fallback tile, until the Android stage adds a player.
import 'package:flutter/material.dart';

import '../../widgets/blocks.dart';

class VideoEmbed extends StatelessWidget {
  const VideoEmbed({super.key, required this.src, this.videoId, this.code});
  final String src;
  final String? videoId;
  final String? code;

  @override
  Widget build(BuildContext context) {
    return Stack(
      fit: StackFit.expand,
      children: [
        VideoThumb(videoId: videoId, code: code),
        const Center(
          child: Icon(Icons.play_circle_fill_rounded, color: Colors.white, size: 56, semanticLabel: 'video'),
        ),
      ],
    );
  }
}
