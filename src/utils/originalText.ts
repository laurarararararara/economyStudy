/** 将通俗解读扩展为更完整的书稿式「原文」段落（未单独录入 original 时使用） */
export function buildOriginalText(
  title: string,
  body: string,
  takeaway: string,
  keyPoints: string[],
): string {
  const plain = (s: string) => s.replace(/\*\*/g, '');
  const paras = body.split('\n\n').filter(Boolean).map(plain);
  const indent = (p: string) =>
    p
      .split('\n')
      .map((line) => (line.trim() ? `　　${line.trim()}` : ''))
      .join('\n');

  const blocks: string[] = [`　　【${title}】`, ''];

  for (const p of paras) {
    blocks.push(indent(p), '');
  }

  blocks.push(
    indent(
      '经济学所讨论的，从来不是抽象公式本身，而是真实的人在稀缺面前如何行动。资源有限、欲望无穷，于是我们必须选择；有选择，就有代价；有代价，就要比较；比较的结果，往往通过价格与产权制度表现出来。',
    ),
    '',
    indent('本节要点可概括为：'),
    '',
    ...keyPoints.map((k) => `　　· ${k}`),
    '',
    indent(
      `因此，${plain(takeaway)} 这句话并不是道德评判，而是从大量现象中归纳出的规律：我们既要问「人们想得到什么」，更要问「制度与激励最终会把局面带向哪里」。`,
    ),
    '',
    indent(
      '读者不妨带着两个问题重读一遍：第一，眼前「看得见」的好处之外，还有没有被挤掉的「看不见」的机会？第二，若换一种规则或价格，总成本是下降还是上升？能把这两个问题想清楚，才算真正读进了这一讲。',
    ),
    '',
    indent(
      '以下文字依据《薛兆丰经济学讲义》该讲主题整理扩写，供你对照原书阅读；更完整的表述与案例，请以纸质书或正版电子书为准。',
    ),
  );

  return blocks.join('\n');
}
