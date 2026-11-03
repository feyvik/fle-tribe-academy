"""Stages lesson media for upload: verified YouTube links (content/videos.json) and the PDFs in content/pdfs.

Run from the fle-tribe folder:  python3 -I content/stage_seed.py
Writes public/_seed/ (seed.json + PDFs) for the dev server to serve while an admin uploads them. Delete it afterwards.
"""
import json, pathlib, shutil, urllib.parse, urllib.request

root = pathlib.Path(__file__).resolve().parent.parent
vids = json.load(open(root / 'content' / 'videos.json'))
src = (root / 'src' / 'data' / 'curriculum.ts').read_text()
weeks = json.loads(src.split('export const WEEKS: Week[] = ', 1)[1].strip().rstrip(';'))
titles, expected = {}, set()
for w in weeks:
    for l in w['lessons']:
        titles[l['id']] = l['title']; expected.add(l['id'])
    titles[w['assignment']['id']] = w['assignment']['title']; expected.add(w['assignment']['id'])

rows = []
for key, vid in vids.items():
    url = f"https://www.youtube.com/watch?v={vid}"
    with urllib.request.urlopen("https://www.youtube.com/oembed?format=json&url=" + urllib.parse.quote(url), timeout=15) as r:
        d = json.load(r)  # fails loudly if a video has been removed
    rows.append({"lesson_key": key, "kind": "youtube", "url": url, "title": f'{d["title"]} ({d["author_name"]})'})

seed = root / 'public' / '_seed'
shutil.rmtree(seed, ignore_errors=True); seed.mkdir()
for pdf in sorted((root / 'content' / 'pdfs').glob('*.pdf')):
    key = pdf.stem
    shutil.copy(pdf, seed / pdf.name)
    label = 'Assignment brief' if key.endswith('-fri') else 'Lesson guide'
    rows.append({"lesson_key": key, "kind": "pdf", "url": f"{key}/{key}.pdf", "title": f"{label}: {titles[key]}", "file": f"/_seed/{pdf.name}"})

keys = [r['lesson_key'] for r in rows]
assert len(keys) == len(set(keys)), 'a lesson has both a video and a PDF'
missing = sorted(expected - set(keys)); extra = sorted(set(keys) - expected)
assert not extra, f'media for lessons that do not exist: {extra}'
json.dump(rows, open(seed / 'seed.json', 'w'), indent=1)
print(f"{len(rows)} lessons: {sum(r['kind'] == 'youtube' for r in rows)} videos, {sum(r['kind'] == 'pdf' for r in rows)} PDFs. Missing: {missing or 'none'}")
