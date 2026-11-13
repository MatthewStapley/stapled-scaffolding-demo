#!/bin/sh
# Builds the hero loop from Pexels video 3584628 ("Scaffolding erected on a
# building under construction" by Kapaw, Pexels License).
#
#   sh scripts/make-video.sh
#
# Output (public/video/):
#   facade-wide.mp4   1280x720, landscape screens
#   facade-tall.mp4   540x960, portrait crop for phones
#   facade-wide.webp / facade-tall.webp  posters (first frame of the loop)
#
# The loop is seamless: 12 s taken from 2 s onwards, with its last 2 s
# cross-faded into the clip's first 2 s, so the end frame equals the start.
set -eu
cd "$(dirname "$0")/.."
SRC=scripts/.raw/facade-src.mp4
OUT=public/video
mkdir -p scripts/.raw "$OUT"
[ -f "$SRC" ] || curl -sfL -o "$SRC" "https://videos.pexels.com/video-files/3584628/3584628-hd_1920_1080_30fps.mp4"

# Galvanised grade: little colour, deeper sky, slightly lifted contrast.
GRADE="eq=saturation=0.18:contrast=1.12:brightness=-0.035:gamma=0.94,colorbalance=bs=0.05:bm=0.02"
LOOP="[0:v]trim=2:14,setpts=PTS-STARTPTS,fps=25[a];[0:v]trim=0:2,setpts=PTS-STARTPTS,fps=25[b];[a][b]xfade=transition=fade:duration=2:offset=10"

ffmpeg -v error -y -i "$SRC" -filter_complex "$LOOP,$GRADE,scale=1280:720[v]" -map "[v]" -an \
  -c:v libx264 -preset slow -crf 29 -pix_fmt yuv420p -movflags +faststart "$OUT/facade-wide.mp4"

# Portrait: crop the right-hand stair towers and roofline.
CROP="crop=608:1080:820:0,scale=540:960"
ffmpeg -v error -y -i "$SRC" -filter_complex "$LOOP,$GRADE,$CROP[v]" -map "[v]" -an \
  -c:v libx264 -preset slow -crf 29 -pix_fmt yuv420p -movflags +faststart "$OUT/facade-tall.mp4"

# Posters at higher resolution than the video, from the loop's first frame.
ffmpeg -v error -y -ss 2 -i "$SRC" -frames:v 1 -vf "$GRADE,scale=1920:1080" "scripts/.raw/facade-wide.png"
ffmpeg -v error -y -ss 2 -i "$SRC" -frames:v 1 -vf "$GRADE,crop=608:1080:820:0,scale=810:1440" "scripts/.raw/facade-tall.png"
python3 -c "
from PIL import Image
for n in ('wide','tall'):
    Image.open(f'scripts/.raw/facade-{n}.png').convert('RGB').save(f'$OUT/facade-{n}.webp', 'WEBP', quality=74, method=6)
"
ls -la "$OUT"
