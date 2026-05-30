import type { BilibiliMedia, DialogueLine, LectureContent } from '../../types';
import { lectureBilibili } from '../media';

export const XIAO_WANG = '小王';
export const XUE = '薛老师';

export function student(text: string): DialogueLine {
  return { speaker: XIAO_WANG, role: 'student', text };
}

export function teacher(text: string): DialogueLine {
  return { speaker: XUE, role: 'teacher', text };
}

export function line(speaker: string, text: string, role: DialogueLine['role'] = 'other'): DialogueLine {
  return { speaker, role, text };
}

export function narrator(text: string): DialogueLine {
  return { speaker: '旁白', role: 'narrator', text };
}

export function mk(
  id: string,
  title: string,
  body: string,
  takeaway: string,
  keyPoints: string[],
  dialogue: DialogueLine[],
  bilibili?: BilibiliMedia,
  original?: string,
): LectureContent {
  return {
    id,
    title,
    ...(original ? { original } : {}),
    body,
    takeaway,
    keyPoints,
    dialogue,
    bilibili: bilibili ?? lectureBilibili[id],
  };
}

export function qa(
  id: string,
  title: string,
  body: string,
  takeaway: string,
  keyPoints: string[],
  exchanges: [string, string][],
  bilibili?: BilibiliMedia,
  original?: string,
): LectureContent {
  const dialogue: DialogueLine[] = [];
  for (const [q, a] of exchanges) {
    dialogue.push(student(q), teacher(a));
  }
  return mk(id, title, body, takeaway, keyPoints, dialogue, bilibili, original);
}
