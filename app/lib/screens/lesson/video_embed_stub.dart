import 'package:flutter/material.dart';

class VideoEmbed extends StatelessWidget {
  const VideoEmbed({super.key, required this.src, this.videoId});
  final String src;
  final String? videoId;

  @override
  Widget build(BuildContext context) {
    final id = videoId;
    return AspectRatio(
      aspectRatio: 16 / 9,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: id == null
            ? const ColoredBox(color: Colors.black)
            : Image.network('https://img.youtube.com/vi/$id/hqdefault.jpg', fit: BoxFit.cover,
                errorBuilder: (_, _, _) => const ColoredBox(color: Colors.black)),
      ),
    );
  }
}
