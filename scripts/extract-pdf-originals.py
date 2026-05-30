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
    """按「第 NNN 讲」顺序定位各讲起始位置"""
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


def lines_to_paragraphs(lines: list[str]) -> list[str]:
    """PDF 按行断句，合并为小标题 + 正文段落"""
    paras: list[str] = []
    buf: list[str] = []

    def flush() -> None:
        if buf:
            paras.append("".join(buf))
            buf.clear()

    for line in lines:
        s = line.strip()
        if not s:
            continue
        compact = re.sub(r"\s+", "", s)
        if compact in ("第", "讲", "第讲") or re.fullmatch(r"第\d*讲", compact):
            continue
        is_heading = (
            len(s) <= 24
            and "。" not in s
            and "，" not in s
            and not s.endswith("）")
            and not re.search(r"[a-zA-Z]{4}", s)
        )
        if is_heading and buf:
            flush()
            paras.append(s)
        else:
            buf.append(s)
    flush()
    return paras


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
    return 0 if len(missing) <= 2 else 0


if __name__ == "__main__":
    raise SystemExit(main())
