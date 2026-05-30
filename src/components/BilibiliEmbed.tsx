import type { BilibiliMedia } from '../types';

interface Props {
  media: BilibiliMedia;
}

export function BilibiliEmbed({ media }: Props) {
  const page = media.page ?? 1;
  const src = `https://player.bilibili.com/player.html?bvid=${media.bvid}&page=${page}&high_quality=1&danmaku=0`;
  const watchUrl = `https://www.bilibili.com/video/${media.bvid}${page > 1 ? `?p=${page}` : ''}`;

  return (
    <div className="bilibili-embed">
      <iframe
        src={src}
        title={media.title}
        loading="lazy"
        allowFullScreen
        sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts allow-popups allow-popups-to-escape-sandbox"
      />
      <p className="video-label">
        {media.title}
        {' · '}
        <a href={watchUrl} target="_blank" rel="noopener noreferrer">
          在哔哩哔哩打开
        </a>
      </p>
    </div>
  );
}
