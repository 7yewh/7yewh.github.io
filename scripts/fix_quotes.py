"""把中文 Markdown 正文里的 ASCII 直引号替换为中文引号 “ ”（跳过 frontmatter 与代码）"""
import re
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent / 'src' / 'content'
files = list(ROOT.rglob('zh/*.md')) + [ROOT / 'about' / 'zh.md']

for p in files:
    s = p.read_text(encoding='utf-8')
    parts = re.split(r'(```.*?```|`[^`]*`|\A---\n.*?\n---\n)', s, flags=re.S)
    out = []
    for i, seg in enumerate(parts):
        if i % 2 == 1:
            out.append(seg)
            continue
        open_next = [True]

        def rep(_m):
            ch = '“' if open_next[0] else '”'
            open_next[0] = not open_next[0]
            return ch

        out.append(re.sub(r'"', rep, seg))
    new = ''.join(out)
    if new != s:
        p.write_text(new, encoding='utf-8')
        print('fixed', p.relative_to(ROOT))
