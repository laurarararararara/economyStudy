export type PresentationMode = 'original' | 'text' | 'dialogue' | 'bilibili';

/** 国内可访问的 B 站视频（唯一外链视频来源） */
export interface BilibiliMedia {
  bvid: string;
  /** 分 P 序号，从 1 开始 */
  page?: number;
  title: string;
}

export interface DialogueLine {
  speaker: string;
  role?: 'student' | 'teacher' | 'narrator' | 'other';
  text: string;
}

export interface LectureContent {
  id: string;
  title: string;
  /** 书中该讲正文；未单独填写时与 body 相同 */
  original?: string;
  body: string;
  takeaway: string;
  keyPoints: string[];
  dialogue: DialogueLine[];
  /** 可选：B 站延伸阅读 */
  bilibili?: BilibiliMedia;
}

export interface Lecture {
  id: string;
  number: number;
  title: string;
  hasStory?: boolean;
  storyId?: string;
}

export interface Section {
  id: string;
  title: string;
  lectures: Lecture[];
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  theme: string;
  color: string;
  sections: Section[];
}
