import type { DialogueLine } from '../types';

interface Props {
  lines: DialogueLine[];
}

const roleClass: Record<string, string> = {
  student: 'bubble-student',
  teacher: 'bubble-teacher',
  narrator: 'bubble-narrator',
  other: 'bubble-other',
};

export function DialogueViewer({ lines }: Props) {
  return (
    <div className="dialogue-thread">
      {lines.map((line, i) => {
        const cls = line.role ? roleClass[line.role] ?? 'bubble-other' : 'bubble-other';
        const isNarrator = line.role === 'narrator';
        return (
          <div
            key={i}
            className={`dialogue-row ${isNarrator ? 'is-narrator' : ''} ${line.role === 'teacher' ? 'is-teacher' : ''}`}
          >
            {!isNarrator && <span className="speaker-name">{line.speaker}</span>}
            <div className={`dialogue-bubble ${cls}`}>
              {isNarrator && <span className="narrator-label">旁白</span>}
              <p>{line.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
