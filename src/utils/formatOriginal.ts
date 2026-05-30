/** 展示前合并被 PDF 误断的残段（如单独成段的「呢？」） */
export function formatOriginalForDisplay(text: string): string {
  const parts = text.split(/\n\n+/);
  const merged: string[] = [];

  for (const part of parts) {
    const body = part.replace(/^　　+/, '').trim();
    if (!body) continue;

    const isOrphan =
      body.length <= 16 &&
      /^[的呢吗吧啊呀成也与及而的在了的]/.test(body) &&
      !/[。！？]$/.test(body);

    if (merged.length > 0 && isOrphan) {
      merged[merged.length - 1] += body;
    } else {
      merged.push(body);
    }
  }

  return merged.map((p) => `　　${p}`).join('\n\n');
}
