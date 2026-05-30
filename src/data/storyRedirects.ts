/** 旧「故事馆」URL → 讲次 ID（如 /stories/broken-window） */
export const storySlugToLectureId: Record<string, string> = {
  'pow-camp': '001',
  'manure-case': '002',
  'broken-window': '003',
  'pencil-story': '007',
  'charity-business': '008',
  'coase-theorem': '020',
  'spring-festival-tickets': '039',
  'lighthouse': '057',
  'lemon-market': '079',
  'marriage-economics': '087',
};

/** 旧链接打开后默认进入对话阅读 */
const DIALOGUE_SLUGS = new Set(Object.keys(storySlugToLectureId));

export function getLegacyStoryTarget(storyId: string): string | null {
  const lectureId = storySlugToLectureId[storyId];
  if (!lectureId) return null;
  const view = DIALOGUE_SLUGS.has(storyId) ? '?view=dialogue' : '';
  return `/lectures/${lectureId}${view}`;
}
