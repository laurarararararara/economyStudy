#!/usr/bin/env python3
"""从本地 PDF 提取各讲原文，生成 src/data/lectures/pdf-originals.json"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
PDF = Path("/Users/tiaotiao/Downloads/薛兆丰经济学讲义.pdf")
BOOK_TS = ROOT / "src/data/book.ts"
OUT = ROOT / "src/data/lectures/pdf-originals.json"

# 行首视为「接上一行」而非新段
CONTINUATION_RE = re.compile(
    r"^([的呢吗吧啊呀成也与及而的在了的]|[\d~\-]|[^\u4e00-\u9fff《「“（—])"
)


def parse_lectures() -> list[tuple[str, int, str]]:
    text = BOOK_TS.read_text(encoding="utf-8")
    pat = re.compile(r"L\(\s*(\d+)\s*,\s*'([^']+)'")
    items = [(int(n), title) for n, title in pat.findall(text)]
    items.sort(key=lambda x: x[0])
    return [(str(n).zfill(3), n, title) for n, title in items]


def extract_pdf_text() -> str:
    reader = PdfReader(str(PDF))
    return "\n".join(page.extract_text() or "" for page in reader.pages)


def find_lecture_markers(full: str, lectures: list[tuple[str, int, str]]) -> list[tuple[int, str, str]]:
    found: list[tuple[int, str, str]] = []
    cursor = 0
    for lid, num, title in lectures:
        pat = rf"第\s*{num:03d}\s*讲"
        m = re.search(pat, full[cursor:])
        if m:
            pos = cursor + m.start()
            found.append((pos, lid, title))
            cursor = pos + len(m.group(0))
            continue
        for cand in [title, title.replace("·", " · "), title.replace("——", " —— ")]:
            p = full.find(cand, cursor)
            if p != -1:
                found.append((p, lid, title))
                cursor = p + len(cand)
                break
        else:
            print(f"WARN missing marker: {lid} #{num} {title}", file=sys.stderr)
    return found


def strip_lecture_header(raw: str, title: str) -> str:
    m = re.search(r"第\s*\d{3}\s*讲\s*[|｜]?\s*", raw)
    if m:
        raw = raw[m.end() :]
    for cand in [title, title.replace("·", " · "), title.replace("——", " —— ")]:
        if cand in raw[:200]:
            raw = raw.replace(cand, "", 1)
            break
    return raw


def ends_sentence(s: str) -> bool:
    s = s.rstrip()
    if not s:
        return True
    return s[-1] in "。！？；…" or s.endswith(("」", "』", "）", "”", "’"))


def opens_fragment(s: str) -> bool:
    """该行像是上一句被 PDF 截断的续行"""
    if not s:
        return False
    if len(s) <= 10:
        return True
    if CONTINUATION_RE.match(s):
        return True
    if s[0] in "，、；：）":
        return True
    return False


def is_section_heading(s: str) -> bool:
    """独立小标题（另起一段）"""
    if len(s) > 32:
        return False
    if "。" in s or "，" in s:
        return False
    if opens_fragment(s):
        return False
    if len(s) <= 5:
        return False
    if re.match(r"^[《「“（—\d\"\"''—\-]", s):
        return False
    if re.search(r"[a-zA-Z]{4}", s):
        return False
    han = len(re.findall(r"[\u4e00-\u9fff]", s))
    return han >= 4


def should_merge_into_buffer(buf: str, line: str) -> bool:
    if not buf:
        return False
    if not ends_sentence(buf):
        return True
    if opens_fragment(line):
        return True
    if buf.endswith(("（", "《", "「", "“", "——", "、", "：", "说", "道")):
        return True
    if line.startswith(("）", "」", "』", "”", "’", "，", "。")) and len(line) < 20:
        return True
    # 单独标点或极短英文片段
    if len(line) <= 3 or re.fullmatch(r"[\d\W]+", line):
        return True
    return False


def lines_to_paragraphs(lines: list[str]) -> list[str]:
    paras: list[str] = []
    buf = ""

    for line in lines:
        s = line.strip()
        if not s:
            continue
        compact = re.sub(r"\s+", "", s)
        if compact in ("第", "讲", "第讲") or re.fullmatch(r"第\d*讲", compact):
            continue

        if not buf:
            buf = s
            continue

        # 小标题始终另起一段（避免「有人的地方就有交易」贴在上一段末尾）
        if is_section_heading(s):
            paras.append(buf)
            buf = s
            continue

        if should_merge_into_buffer(buf, s):
            buf += s
            continue

        if len(s) <= 16 and not is_section_heading(s):
            buf += s
            continue

        paras.append(buf)
        buf = s

    if buf:
        paras.append(buf)

    return merge_orphan_paras(paras)


# 句号后紧贴出现的小标题（PDF 未换行）；限制长度避免吞掉正文
EMBEDDED_TITLE_RE = re.compile(
    r"([。！？])("
    r"[\u4e00-\u9fff]{2,14}交易|"
    r"[\u4e00-\u9fff]{3,16}(?:问题|原理|组织|现象|故事|定律|法则)"
    r")(?=[\u4e00-\u9fff])"
)


def split_embedded_titles(para: str) -> list[str]:
    if not EMBEDDED_TITLE_RE.search(para):
        parts = [para]
    else:
        parts = [p.strip() for p in EMBEDDED_TITLE_RE.sub(r"\1\n\2", para).split("\n") if p.strip()]
    result: list[str] = []
    heading_tail = re.compile(
        r"^([\u4e00-\u9fff]{4,20}(?:交易|问题|原理|组织|定律|法则|现象|故事|说：))(?=[\u4e00-\u9fff]{2,})"
    )
    for p in parts:
        m = heading_tail.match(p)
        if m and len(p) > len(m.group(1)) + 8:
            result.append(m.group(1))
            result.append(p[m.end() :])
        else:
            result.append(p)
    return result


def merge_orphan_paras(paras: list[str]) -> list[str]:
    if not paras:
        return paras
    out: list[str] = [paras[0]]
    for p in paras[1:]:
        prev = out[-1]
        if opens_fragment(p) or (len(p) <= 20 and not is_section_heading(p) and not ends_sentence(prev)):
            out[-1] = prev + p
        else:
            out.append(p)
    return out


def normalize_quotes(text: str) -> str:
    """合并被拆开的引号与破折号"""
    text = re.sub(r"\n+", "", text)
    text = re.sub(r"“\s*”", "", text)
    text = re.sub(r"“\s+", "“", text)
    text = re.sub(r"\s+”", "”", text)
    text = re.sub(r"——\s*——", "——", text)
    return text


def clean_original(raw: str, title: str) -> str:
    raw = strip_lecture_header(raw, title)
    lines = raw.split("\n")
    skip_patterns = (
        re.compile(r"^第\s*\d{3}\s*讲"),
        re.compile(r"^更多新书"),
        re.compile(r"^思考题"),
        re.compile(r"^扫码"),
        re.compile(r"^xueba"),
        re.compile(r"^\|"),
        re.compile(r"^>>"),
    )
    kept: list[str] = []
    for line in lines:
        s = line.strip()
        if not s or any(p.match(s) for p in skip_patterns):
            continue
        if re.fullmatch(r"\d{1,4}", s):
            continue
        kept.append(s)

    paras = lines_to_paragraphs(kept)
    expanded: list[str] = []
    for p in paras:
        expanded.extend(split_embedded_titles(p))
    paras = [normalize_quotes(p) for p in expanded if p.strip()]
    paras = merge_orphan_paras(paras)
    if not paras:
        return ""
    return "\n\n".join(f"　　{p}" for p in paras)


def main() -> int:
    if not PDF.exists():
        print(f"PDF not found: {PDF}", file=sys.stderr)
        return 1

    lectures = parse_lectures()
    full = extract_pdf_text()
    print(f"PDF chars: {len(full)}, lectures: {len(lectures)}")

    markers = find_lecture_markers(full, lectures)
    originals: dict[str, str] = {}

    for i, (pos, lid, title) in enumerate(markers):
        end = markers[i + 1][0] if i + 1 < len(markers) else len(full)
        chunk = full[pos:end]
        cleaned = clean_original(chunk, title)
        if len(cleaned) > 100:
            originals[lid] = cleaned

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(originals, ensure_ascii=False), encoding="utf-8")
    print(f"Wrote {len(originals)} originals -> {OUT} ({OUT.stat().st_size // 1024} KB)")

    missing = [lid for lid, _, _ in lectures if lid not in originals]
    if missing:
        print(f"Missing ({len(missing)}): {', '.join(missing)}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
