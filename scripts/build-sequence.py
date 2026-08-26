#!/usr/bin/env python3
"""
Build a scroll-scrubbable frame sequence from a rendered camera-move video.

    ./scripts/build-sequence.py <video> <id> [--frames N] [--widths 1920,1080]

Frames are selected at equal intervals of *cumulative motion* rather than equal
time. Apparent motion accelerates as a camera closes on its subject, so even
time sampling spends frames on the slow opening and skips through the fast
ending. Motion-equalised sampling makes a linear scroll read as constant speed.

Writes public/sequence/<id>/ for the widest tier and <id>-sm/ for the rest,
then prints the config to paste into lib/sequence.ts.
"""
import argparse, glob, os, shutil, subprocess, sys, tempfile

def run(cmd):
    subprocess.run(cmd, check=True)

def read_pgm(path):
    d = open(path, 'rb').read()
    i, fields = 0, []
    while len(fields) < 4:
        while d[i:i+1].isspace():
            i += 1
        if d[i:i+1] == b'#':
            while d[i:i+1] != b'\n':
                i += 1
            continue
        j = i
        while not d[j:j+1].isspace():
            j += 1
        fields.append(d[i:j]); i = j
    return d[i+1:]

def motion_curve(video, work):
    """Cumulative mean-absolute frame delta, computed on 160x90 grayscale."""
    run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-i', video,
         '-vf', 'scale=160:90,format=gray', '-vsync', '0',
         os.path.join(work, 'm_%05d.pgm')])
    files = sorted(glob.glob(os.path.join(work, 'm_*.pgm')))
    prev, cum = read_pgm(files[0]), [0.0]
    for f in files[1:]:
        cur = read_pgm(f)
        cum.append(cum[-1] + sum(abs(a-b) for a, b in zip(cur, prev)) / len(cur))
        prev = cur
    return cum

def select_frames(cum, n):
    total, sel = cum[-1], []
    for k in range(n):
        target = total * k / (n - 1)
        idx = min(range(len(cum)), key=lambda i: abs(cum[i] - target))
        if not sel or idx > sel[-1]:
            sel.append(idx)
    return sel

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('video')
    ap.add_argument('id')
    ap.add_argument('--frames', type=int, default=130)
    ap.add_argument('--widths', default='1920,1080')
    ap.add_argument('--quality', type=int, default=66)
    args = ap.parse_args()

    widths = sorted(int(w) for w in args.widths.split(','))
    work = tempfile.mkdtemp()
    try:
        cum = motion_curve(args.video, work)
        sel = select_frames(cum, args.frames)
        print(f'selected {len(sel)} of {len(cum)} source frames', file=sys.stderr)
        expr = '+'.join(rf'eq(n\,{n})' for n in sel)

        tiers = []
        for w in widths:
            tier_id = args.id if w == widths[-1] else f'{args.id}-sm'
            out = os.path.join('public', 'sequence', tier_id)
            shutil.rmtree(out, ignore_errors=True)
            os.makedirs(out)
            run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-i', args.video,
                 '-vf', f"select='{expr}',scale={w}:-2:flags=lanczos", '-vsync', '0',
                 '-c:v', 'libwebp', '-quality', str(args.quality),
                 '-compression_level', '6', '-preset', 'picture',
                 os.path.join(out, f'{tier_id}_%04d.webp')])
            size = sum(os.path.getsize(f) for f in glob.glob(os.path.join(out, '*.webp')))
            tiers.append((tier_id, w, size))
            print(f'  {tier_id}: {w}px  {size/1048576:.1f} MB', file=sys.stderr)

        print('\nPaste into lib/sequence.ts:\n')
        print(f'  frameCount: {len(sel)},')
        print("  ext: 'webp',")
        print('  tiers: [')
        for tier_id, w, _ in tiers:
            print(f"    {{ id: '{tier_id}', width: {w}, height: {round(w*9/16)} }},")
        print('  ],')
    finally:
        shutil.rmtree(work, ignore_errors=True)

if __name__ == '__main__':
    main()
