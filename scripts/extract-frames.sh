#!/usr/bin/env bash
#
# Extract a scroll-scrubbable frame sequence from a rendered camera-move video.
#
#   ./scripts/extract-frames.sh <video> <sequence-id> [fps] [width]
#
# Example:
#   ./scripts/extract-frames.sh renders/hero-descent.mov hero 30 2560
#
# Writes public/sequence/<id>/<id>_0001.webp ... and prints the frame count to
# copy into lib/sequence.ts.
set -euo pipefail

VIDEO=${1:?usage: extract-frames.sh <video> <sequence-id> [fps] [width]}
ID=${2:?usage: extract-frames.sh <video> <sequence-id> [fps] [width]}
FPS=${3:-30}
WIDTH=${4:-2560}

OUT="public/sequence/$ID"
mkdir -p "$OUT"
rm -f "$OUT/${ID}_"*.webp

ffmpeg -hide_banner -loglevel error -i "$VIDEO" \
  -vf "fps=${FPS},scale=${WIDTH}:-2:flags=lanczos" \
  -c:v libwebp -quality 82 -compression_level 6 -preset picture \
  "$OUT/${ID}_%04d.webp"

COUNT=$(ls -1 "$OUT/${ID}_"*.webp | wc -l | tr -d ' ')
BYTES=$(du -sh "$OUT" | cut -f1)

cat <<SUMMARY

Extracted $COUNT frames -> $OUT ($BYTES total)

Now set in lib/sequence.ts:
  frameCount: $COUNT,
  width: $WIDTH,
SUMMARY
