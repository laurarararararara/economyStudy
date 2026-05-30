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
