import { chapters } from '../data/book';

export interface LectureContext {
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  chapterColor: string;
  sectionTitle: string;
  lectureNumber: number;
  lectureTitle: string;
}

export interface AdjacentLecture {
  id: string;
  number: number;
  title: string;
  chapterId: string;
}

/** 全书 118 讲按目录顺序排列 */
export function getAllLecturesInOrder(): AdjacentLecture[] {
  return chapters.flatMap((ch) =>
    ch.sections.flatMap((sec) =>
      sec.lectures.map((lec) => ({
        id: lec.id,
        number: lec.number,
        title: lec.title,
        chapterId: ch.id,
      })),
    ),
  );
}

export function findAdjacentLectures(lectureId: string): {
  prev: AdjacentLecture | null;
  next: AdjacentLecture | null;
} {
  const ordered = getAllLecturesInOrder();
  const index = ordered.findIndex((l) => l.id === lectureId);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? ordered[index - 1]! : null,
    next: index < ordered.length - 1 ? ordered[index + 1]! : null,
  };
}

export function formatLectureLabel(number: number, title: string): string {
  return `第 ${String(number).padStart(3, '0')} 讲 · ${title}`;
}

export function findLectureContext(lectureId: string): LectureContext | null {
  for (const ch of chapters) {
    for (const sec of ch.sections) {
      const lec = sec.lectures.find((l) => l.id === lectureId);
      if (lec) {
        return {
          chapterId: ch.id,
          chapterNumber: ch.number,
          chapterTitle: ch.title,
          chapterColor: ch.color,
          sectionTitle: sec.title,
          lectureNumber: lec.number,
          lectureTitle: lec.title,
        };
      }
    }
  }
  return null;
}
