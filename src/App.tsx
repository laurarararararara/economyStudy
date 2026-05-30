import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ChapterPage } from './pages/ChapterPage';
import { HomePage } from './pages/HomePage';
import { LecturePage } from './pages/LecturePage';
import { StoriesPage } from './pages/StoriesPage';
import { StoryRedirect } from './pages/StoryRedirect';
import './App.css';

/** 旧故事馆直链 → 讲次页（默认打开对话阅读） */
const LEGACY_STORY_ROUTES: [string, string][] = [
  ['broken-window', '/lectures/003?view=dialogue'],
  ['pow-camp', '/lectures/001?view=dialogue'],
  ['pencil-story', '/lectures/007?view=dialogue'],
  ['manure-case', '/lectures/002?view=dialogue'],
  ['charity-business', '/lectures/008?view=dialogue'],
  ['coase-theorem', '/lectures/020?view=dialogue'],
  ['spring-festival-tickets', '/lectures/039?view=dialogue'],
  ['lighthouse', '/lectures/057?view=dialogue'],
  ['lemon-market', '/lectures/079?view=dialogue'],
  ['marriage-economics', '/lectures/087?view=dialogue'],
];

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="chapters/:chapterId" element={<ChapterPage />} />
          <Route path="lectures/:lectureId" element={<LecturePage />} />
          <Route path="stories" element={<StoriesPage />} />
          {LEGACY_STORY_ROUTES.map(([slug, target]) => (
            <Route
              key={slug}
              path={`stories/${slug}`}
              element={<Navigate to={target} replace />}
            />
          ))}
          <Route path="stories/:storyId" element={<StoryRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
