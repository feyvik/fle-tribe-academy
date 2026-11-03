"""Builds the branded lesson-guide and assignment-brief PDFs.

Run from the fle-tribe folder:  python3 content/build_pdfs.py
Output goes to content/pdfs/<lesson-key>.pdf. Needs Google Chrome installed (used to print HTML to PDF).
"""
import html
import json
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "content"))
from guides import GUIDES  # noqa: E402

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT = ROOT / "content" / "pdfs"
SRC = ROOT / "content" / "pdf-source"
LOGO = (ROOT / "public" / "brand" / "logo-white.png").as_uri()
DAY_NAMES = {"mon": "Monday", "tue": "Tuesday", "wed": "Wednesday", "thu": "Thursday", "fri": "Friday", "sat": "Saturday"}

curriculum = (ROOT / "src" / "data" / "curriculum.ts").read_text()
WEEKS = json.loads(curriculum.split("export const WEEKS: Week[] = ", 1)[1].strip().rstrip(";"))
BY_ID = {w["id"]: w for w in WEEKS}

CSS = """
@page { size: A4; margin: 14mm 0 14mm; }
@page :first { margin-top: 0; }
* { box-sizing: border-box; }
body { margin: 0; font: 10.5pt/1.55 "Plus Jakarta Sans", "Helvetica Neue", Arial, sans-serif; color: #2a292c;
       -webkit-print-color-adjust: exact; print-color-adjust: exact; }
header { position: relative; background: #3f09c9; color: #fff; padding: 22mm 18mm 12mm; overflow: hidden; }
header .tab { position: absolute; left: 0; top: 0; width: 55mm; height: 4mm; background: #b6ff00; border-radius: 0 0 6mm 0; }
header .tab2 { position: absolute; right: 0; bottom: 0; width: 40mm; height: 3mm; background: #b6ff00; border-radius: 6mm 0 0 0; }
header img { height: 13mm; display: block; margin-bottom: 9mm; }
.eyebrow { font: 600 8pt/1 "JetBrains Mono", Menlo, monospace; letter-spacing: .12em; text-transform: uppercase; color: #b6ff00; }
h1 { font: 800 25pt/1.12 Montserrat, "Helvetica Neue", Arial, sans-serif; margin: 3mm 0 0; letter-spacing: -.01em; }
.lede { margin: 4mm 0 0; font-size: 11.5pt; color: rgba(255,255,255,.85); max-width: 160mm; }
main { padding: 10mm 18mm 4mm; }
h2 { font: 700 13pt/1.25 Montserrat, "Helvetica Neue", Arial, sans-serif; color: #3f09c9; margin: 7mm 0 2mm; break-after: avoid; }
p { margin: 0 0 2.5mm; }
ul, ol { margin: 0 0 3mm; padding-left: 5mm; }
li { margin: 0 0 1.3mm; }
code, pre { font-variant-ligatures: none; font-feature-settings: "liga" 0, "calt" 0; }
code { font: 9pt Menlo, Consolas, "Courier New", monospace; background: #ecebf2; padding: .2mm 1.2mm; border-radius: 1mm; }
pre { font: 8.6pt/1.5 Menlo, Consolas, "Courier New", monospace; background: #1e1d23; color: #ecebf1; padding: 4mm 5mm; border-radius: 2.5mm;
      white-space: pre-wrap; margin: 1mm 0 3mm; break-inside: avoid; }
pre code { background: none; padding: 0; color: inherit; font: inherit; }
.box { border-radius: 3mm; padding: 4mm 6mm 2mm; margin: 6mm 0 0; break-inside: avoid; }
.box h2 { margin-top: 0; }
.research { background: #ebe4fd; }
.done { background: #fde7e6; }
.done h2 { color: #c23a37; }
.review { background: #efffc7; }
.review h2 { color: #2a292c; }
.checklist { list-style: none; padding-left: 0; }
.checklist li { padding-left: 7mm; position: relative; }
.checklist li::before { content: ""; position: absolute; left: 0; top: 1mm; width: 3.4mm; height: 3.4mm; border: .45mm solid #c23a37; border-radius: .8mm; }
.links a { color: #3f09c9; font-weight: 600; text-decoration: none; }
.meta { display: flex; gap: 6mm; margin-top: 5mm; font-size: 9.5pt; color: rgba(255,255,255,.85); }
.meta b { color: #fff; }
footer { margin: 4mm 18mm 0; padding-top: 3mm; border-top: .3mm solid #dcdae6; font-size: 8pt; color: #5f5d68;
         display: flex; justify-content: space-between; break-inside: avoid; }
"""

FONTS = ('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800'
         '&family=Plus+Jakarta+Sans:wght@400;600;700&family=JetBrains+Mono:wght@500;600&display=swap">')


def week_label(w):
    return f"Bonus course · {w['title']}" if w.get("track") == "bonus" else f"Week {w['number']}"


def render_block(block):
    if isinstance(block, list):
        return "<ul>" + "".join(f"<li>{item}</li>" for item in block) + "</ul>"
    if isinstance(block, tuple) and block[0] == "code":
        return f"<pre><code>{html.escape(block[1])}</code></pre>"
    return f"<p>{block}</p>"


def page(title, eyebrow, lede, body, meta=""):
    return f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{html.escape(title)} · FLE TRIBE</title>
{FONTS}<style>{CSS}</style></head><body>
<header><span class="tab"></span><span class="tab2"></span><img src="{LOGO}" alt="FLE TRIBE">
<div class="eyebrow">{eyebrow}</div><h1>{html.escape(title)}</h1>{f'<p class="lede">{lede}</p>' if lede else ''}{meta}</header>
<main>{body}</main>
<footer><span>FLE TRIBE · Frontend Developer Program</span><span>thefletribe.com.ng</span></footer>
</body></html>"""


def guide_html(key):
    week_id, day = key.rsplit("-", 1)
    w = BY_ID[week_id]
    lesson = next(l for l in w["lessons"] if l["day"] == day)
    body = "".join(f"<h2>{html.escape(h)}</h2>" + "".join(render_block(b) for b in blocks) for h, blocks in GUIDES[key])
    body += ('<div class="box research"><h2>Research questions</h2><p>Answer these in the app, in your own words, '
             'to unlock the next lesson.</p><ol>' + "".join(f"<li>{q}</li>" for q in lesson["research"]) + "</ol></div>")
    body += ('<h2>Start your research here</h2><ul class="links">'
             + "".join(f'<li><a href="{r["url"]}">{html.escape(r["label"])}</a>: {html.escape(r["url"])}</li>' for r in lesson["resources"])
             + "</ul>")
    eyebrow = f"{week_label(w)} · {DAY_NAMES[day]} · Lesson guide"
    return page(lesson["title"], eyebrow, f"<b>{'This course' if w.get('track') == 'bonus' else 'This week'}:</b> {html.escape(w['goal'])}", body)


def assignment_html(w):
    a = w["assignment"]
    body = ('<div class="box done"><h2>Done when</h2><ul class="checklist">'
            + "".join(f"<li>{item}</li>" for item in a["doneWhen"]) + "</ul></div>")
    body += (f"<h2>How to submit</h2><p><b>{html.escape(a['submit'])}</b>, by 23:59 on Friday. Submit it in the app on this week's "
             "Friday page: paste the link to your work and add notes for your reviewer (what you built, one thing that broke, "
             "and how you fixed it).</p><p>Complete the task <b>independently</b>. You may research and ask questions, but the work must be your own.</p>")
    body += ("<h2>How it's reviewed</h2><ul><li><b>Works</b>: it does what the brief asks.</li><li><b>Clean</b>: readable, well named, no dead code.</li>"
             "<li><b>Understood</b>: you can explain every line.</li><li><b>Shipped</b>: submitted on time, with a short README.</li></ul>")
    body += ('<div class="box review"><h2>Be ready to discuss on Saturday</h2><ul>'
             + "".join(f"<li>{html.escape(q)}</li>" for q in w["review"]["questions"]) + "</ul></div>")
    meta = f'<div class="meta"><span><b>Due:</b> Friday, 23:59</span><span><b>Submit:</b> {html.escape(a["submit"])}</span></div>'
    return page(a["title"], f"{week_label(w)} · Friday · Assignment brief", html.escape(a["brief"]), body, meta)


def print_pdf(name, document):
    SRC.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)
    src = SRC / f"{name}.html"
    src.write_text(document)
    out = OUT / f"{name}.pdf"
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--virtual-time-budget=6000",
                    f"--print-to-pdf={out}", src.as_uri()], check=True, capture_output=True)
    return out


if __name__ == "__main__":
    only = set(sys.argv[1:])
    jobs = [(k, lambda k=k: guide_html(k)) for k in GUIDES] + [(w["assignment"]["id"], lambda w=w: assignment_html(w)) for w in WEEKS]
    for name, build in jobs:
        if only and name not in only:
            continue
        out = print_pdf(name, build())
        print(f"{name}: {out.stat().st_size // 1024} KB")
