import type { LectureContent } from '../../types';
import { ch1Lectures } from './ch1';
import { ch2Lectures } from './ch2';
import { ch3Lectures } from './ch3';
import { ch4Lectures } from './ch4';
import { ch5Lectures } from './ch5';
import { ch6Lectures } from './ch6';
import { ch7Lectures } from './ch7';
import { ch8Lectures } from './ch8';
import { ch9Lectures } from './ch9';
import { ch10Lectures } from './ch10';
import { storyOverrides } from './storyOverrides';

const allLectures: LectureContent[] = [
  ...ch1Lectures,
  ...ch2Lectures,
  ...ch3Lectures,
  ...ch4Lectures,
  ...ch5Lectures,
  ...ch6Lectures,
  ...ch7Lectures,
  ...ch8Lectures,
  ...ch9Lectures,
  ...ch10Lectures,
];

const mergedLectures = allLectures.map((l) => {
  const base = storyOverrides[l.id] ?? l;
  return { ...base, original: base.original?.trim() || base.body };
});

export const lectureMap: Record<string, LectureContent> = Object.fromEntries(
  mergedLectures.map((l) => [l.id, l]),
);

export function getLecture(id: string): LectureContent | undefined {
  return lectureMap[id];
}

export { mergedLectures as allLectures };
