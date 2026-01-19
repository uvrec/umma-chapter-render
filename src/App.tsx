import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { queryClient } from "@/lib/queryClient";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";

import SiteBanners from "@/components/SiteBanners";
import { ChapterVersesList } from "@/pages/ChapterVersesList";

import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { BooksProvider } from "@/contexts/BooksContext";

import { GlobalSettingsPanel } from "@/components/GlobalSettingsPanel";
import { AudioProvider as ModernAudioProvider } from "@/contexts/ModernAudioContext";
import { ModernGlobalPlayer } from "@/components/ModernGlobalPlayer";

import AdminBanners from "@/pages/admin/AdminBanners";
import AdminAudiobooks from "@/pages/admin/AdminAudiobooks";
import LectureImport from "@/pages/admin/LectureImport";
import LetterImport from "@/pages/admin/LetterImport";
import LecturesManager from "@/pages/admin/LecturesManager";
import LettersManager from "@/pages/admin/LettersManager";

import { NewHome } from "./pages/NewHome";
import NotFound from "./pages/NotFound";
import { Library } from "./pages/Library";
import { PrabhupadaBooks } from "./pages/library/PrabhupadaBooks";
import { AcharyasBooks } from "./pages/library/AcharyasBooks";
import { LecturesLibrary } from "./pages/library/LecturesLibrary";
import { LectureView } from "./pages/library/LectureView";
import { LettersLibrary } from "./pages/library/LettersLibrary";
import { LetterView } from "./pages/library/LetterView";
import { Audio } from "./pages/Audio";
import { Podcasts } from "./pages/audio/Podcasts";
import { CardPayment } from "./pages/payment/CardPayment";
import { BankTransfer } from "./pages/payment/BankTransfer";
// Glossary.tsx removed - using GlossaryDB instead
import { Contact } from "./pages/Contact";
import { Blog } from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import { Lectures } from "./pages/audio/Lectures";
import { Music } from "./pages/audio/Music";
import { Audiobooks } from "./pages/audio/Audiobooks";
import { AudiobookView } from "./pages/audio/AudiobookView";
import Auth from "./pages/Auth";
import TransliterationTool from "./pages/TransliterationTool";
import Numerology from "./pages/tools/Numerology";
import ScriptLearning from "./pages/tools/ScriptLearning";
import TextNormalization from "./pages/tools/TextNormalization";
import JyotishCalculator from "./pages/tools/JyotishCalculator";
import RagaExplorer from "./pages/tools/RagaExplorer";
import KnowledgeCompiler from "./pages/KnowledgeCompiler";
import SynonymsSearch from "./pages/SynonymsSearch";
import SanskritDictionary from "./pages/SanskritDictionary";
import Dashboard from "./pages/admin/Dashboard";
import NormalizeTexts from "./pages/admin/NormalizeTexts";
import Books from "./pages/admin/Books";
import ScriptureManager from "./pages/admin/ScriptureManager";
import Chapters from "./pages/admin/Chapters";
import AddEditBook from "./pages/admin/AddEditBook";
import AddEditVerse from "./pages/admin/AddEditVerse";
import { VedaReaderDB } from "./components/VedaReaderDB";
import GlossaryDB from "./pages/GlossaryDB";
import { BookOverview } from "./pages/BookOverview";
import CantoOverview from "./pages/CantoOverview";
import { IntroChapter } from "./pages/IntroChapter";
import Cantos from "./pages/admin/Cantos";
import AddEditCanto from "./pages/admin/AddEditCanto";
import IntroChapters from "./pages/admin/IntroChapters";
import AddEditIntroChapter from "./pages/admin/AddEditIntroChapter";
import BlogPosts from "./pages/admin/BlogPosts";
import AddEditBlogPost from "./pages/admin/AddEditBlogPost";
import BlogCategories from "./pages/admin/BlogCategories";
import BlogTags from "./pages/admin/BlogTags";
import AudioCategories from "./pages/admin/AudioCategories";
import AudioPlaylists from "./pages/admin/AudioPlaylists";
import AudioPlaylistEdit from "./pages/admin/AudioPlaylistEdit";
import UniversalImportFixed from "./pages/admin/UniversalImportFixed";
import BBTImport from "./pages/admin/BBTImportUniversal";
import FixRLSPolicies from "./pages/admin/FixRLSPoliciesNew";
import Pages from "./pages/admin/Pages";
import EditPage from "./pages/admin/EditPage";
import StaticPages from "./pages/admin/StaticPages";
import LRCEditorPage from "./pages/admin/LRCEditorPage";
import BookExport from "./pages/admin/BookExport";
import { NoIRedirect } from "./pages/NoIRedirect";
import { LibOneParamRouter, LibTwoParamRouter, LibThreeParamRouter } from "./components/LibRouter";
import { LanguageWrapper, LanguageRedirect } from "./components/LanguageWrapper";
import {
  VedaReaderBookRedirect,
  VedaReaderChapterRedirect,
  VedaReaderVerseRedirect,
  VedaReaderCantoRedirect,
  VedaReaderCantoChapterRedirect,
  VedaReaderCantoVerseRedirect,
} from "./components/VedaReaderRedirects";
import MergeNoiChapters from "./pages/admin/MergeNoiChapters";
import { PageView } from "./pages/PageView";
import { BookAuthorPage } from "./pages/book/BookAuthorPage";
import { BookPronunciationPage } from "./pages/book/BookPronunciationPage";
import { BookGlossaryPage } from "./pages/book/BookGlossaryPage";
import { BookDedicationPage } from "./pages/book/BookDedicationPage";
import { BookDisciplicSuccessionPage } from "./pages/book/BookDisciplicSuccessionPage";
import { BookSettingsRoutePage } from "./pages/book/BookSettingsRoutePage";
import { BookUserContentPage } from "./pages/book/BookUserContentPage";
import { BookGalleriesPage } from "./pages/book/BookGalleriesPage";
import { UserContentProvider } from "./contexts/UserContentContext";
import Highlights from "./pages/admin/Highlights";
import NumCal from "./pages/admin/NumCal";
import Install from "./pages/Install";
import BookSearch from "./pages/BookSearch";
import Chat from "./pages/Chat";
import LocalChat from "./pages/LocalChat";
import Quotes from "./pages/Quotes";
import TattvasIndex from "./pages/TattvasIndex";
import TattvaPage from "./pages/TattvaPage";
import ReadingStatsPage from "./pages/ReadingStatsPage";
import GVReferences from "./pages/GVReferences";
import VaishnavCalendar from "./pages/VaishnavCalendar";
import EkadashiList from "./pages/EkadashiList";
import EkadashiDetail from "./pages/EkadashiDetail";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { PWAUpdatePrompt } from "./components/PWAUpdatePrompt";
import { UnifiedSearch, useUnifiedSearch } from "./components/UnifiedSearch";
import { MobileLayout } from "./components/mobile";
import { ReadingModeExitButton } from "./components/ReadingModeExitButton";
import { useEffect } from "react";

// Внутрішній компонент з доступом до hooks
function AppContent() {
  const { open: searchOpen, setOpen: setSearchOpen } = useUnifiedSearch();

  // Очищаємо режими читання при завантаженні застосунку
  // щоб вони не впливали на сторінки поза читачем
  useEffect(() => {
    document.documentElement.setAttribute('data-fullscreen-reading', 'false');
    document.documentElement.setAttribute('data-zen-mode', 'false');
    document.documentElement.setAttribute('data-presentation-mode', 'false');
  }, []);

  return (
    <>
      <BrowserRouter>
        <MobileLayout>
        <Routes>
          {/* ============================================================
              ROOT → LANGUAGE REDIRECT
              Redirects / to /ua/ or /en/ based on saved preference
              ============================================================ */}
          <Route path="/" element={<LanguageRedirect />} />

          {/* ============================================================
              LANGUAGE-PREFIXED ROUTES (/:lang/...)
              All public routes wrapped with language prefix
              ============================================================ */}
          <Route path="/:lang" element={<LanguageWrapper />}>
            <Route index element={<NewHome />} />

            {/* /lib/ - ОСНОВНІ МАРШРУТИ (короткі URL) */}
            <Route path="lib/:bookId/:p1/:p2/:p3" element={<LibThreeParamRouter />} />
            <Route path="lib/:bookId/:p1/:p2" element={<LibTwoParamRouter />} />
            <Route path="lib/:bookId/:p1" element={<LibOneParamRouter />} />
            <Route path="lib/:bookId" element={<BookOverview />} />
            <Route path="lib" element={<Navigate to="library" replace />} />

            {/* /veda-reader/ - РЕДІРЕКТИ на /lib/ (для зворотної сумісності) */}
            <Route path="veda-reader/:bookId/canto/:cantoNumber/chapter/:chapterNumber/:verseId" element={<VedaReaderCantoVerseRedirect />} />
            <Route path="veda-reader/:bookId/canto/:cantoNumber/chapter/:chapterNumber/:verseNumber" element={<VedaReaderCantoVerseRedirect />} />
            <Route path="veda-reader/:bookId/canto/:cantoNumber/chapter/:chapterNumber" element={<VedaReaderCantoChapterRedirect />} />
            <Route path="veda-reader/:bookId/canto/:cantoNumber" element={<VedaReaderCantoRedirect />} />
            <Route path="veda-reader/:bookId/:chapterNumber/:verseNumber" element={<VedaReaderVerseRedirect />} />
            <Route path="veda-reader/:bookId/:chapterNumber" element={<VedaReaderChapterRedirect />} />
            <Route path="veda-reader/noi/:verseNumber" element={<NoIRedirect />} />

            {/* Book resources pages */}
            <Route path="veda-reader/:bookId/intro/:slug" element={<IntroChapter />} />
            <Route path="veda-reader/:bookId/author" element={<BookAuthorPage />} />
            <Route path="veda-reader/:bookId/pronunciation" element={<BookPronunciationPage />} />
            <Route path="veda-reader/:bookId/glossary" element={<BookGlossaryPage />} />
            <Route path="veda-reader/:bookId/dedication" element={<BookDedicationPage />} />
            <Route path="veda-reader/:bookId/disciplic-succession" element={<BookDisciplicSuccessionPage />} />
            <Route path="veda-reader/:bookId/settings" element={<BookSettingsRoutePage />} />
            <Route path="veda-reader/:bookId/bookmarks" element={<BookUserContentPage />} />
            <Route path="veda-reader/:bookId/notes" element={<BookUserContentPage />} />
            <Route path="veda-reader/:bookId/highlights" element={<BookUserContentPage />} />
            <Route path="veda-reader/:bookId/galleries" element={<BookGalleriesPage />} />
            <Route path="veda-reader/:bookId/canto/:cantoNumber/author" element={<BookAuthorPage />} />
            <Route path="veda-reader/:bookId/canto/:cantoNumber/pronunciation" element={<BookPronunciationPage />} />
            <Route path="veda-reader/:bookId/canto/:cantoNumber/glossary" element={<BookGlossaryPage />} />
            <Route path="veda-reader/:bookId/canto/:cantoNumber/dedication" element={<BookDedicationPage />} />
            <Route path="veda-reader/:bookId/canto/:cantoNumber/disciplic-succession" element={<BookDisciplicSuccessionPage />} />
            <Route path="veda-reader/:bookId/canto/:cantoNumber/settings" element={<BookSettingsRoutePage />} />
            <Route path="veda-reader/:bookId/canto/:cantoNumber/bookmarks" element={<BookUserContentPage />} />
            <Route path="veda-reader/:bookId/canto/:cantoNumber/notes" element={<BookUserContentPage />} />
            <Route path="veda-reader/:bookId/canto/:cantoNumber/highlights" element={<BookUserContentPage />} />
            <Route path="veda-reader/:bookId/canto/:cantoNumber/galleries" element={<BookGalleriesPage />} />
            <Route path="veda-reader/:bookId" element={<VedaReaderBookRedirect />} />
            <Route path="veda-reader/bhagavad-gita/*" element={<Navigate to="lib/bg/1" replace />} />
            <Route path="veda-reader/gita/*" element={<Navigate to="lib/bg/1" replace />} />
            <Route path="veda-reader/sri-isopanishad/*" element={<Navigate to="lib/iso/1" replace />} />
            <Route path="veda-reader/srimad-bhagavatam/*" element={<Navigate to="lib/sb" replace />} />
            <Route path="veda-reader/bhagavatam/*" element={<Navigate to="lib/sb" replace />} />

            {/* Бібліотека */}
            <Route path="library" element={<Library />} />
            <Route path="library/references" element={<GVReferences />} />
            <Route path="library/lectures" element={<LecturesLibrary />} />
            <Route path="library/lectures/:slug" element={<LectureView />} />
            <Route path="library/letters" element={<LettersLibrary />} />
            <Route path="library/letters/:slug" element={<LetterView />} />
            <Route path="library/:slug" element={<BookOverview />} />
            <Route path="library/prabhupada" element={<Navigate to="library" replace />} />
            <Route path="library/acharyas" element={<Navigate to="library" replace />} />

            {/* Аудіо */}
            <Route path="audio" element={<Audio />} />
            <Route path="audiobooks" element={<Audiobooks />} />
            <Route path="audiobooks/:id" element={<AudiobookView />} />
            <Route path="audio/lectures" element={<Lectures />} />
            <Route path="audio/music" element={<Music />} />

            {/* Блог/інше */}
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="audio/podcasts" element={<Podcasts />} />
            <Route path="glossary" element={<GlossaryDB />} />
            <Route path="tools/transliteration" element={<TransliterationTool />} />
            <Route path="tools/numerology" element={<Numerology />} />
            <Route path="tools/jyotish" element={<JyotishCalculator />} />
            <Route path="tools/ragas" element={<RagaExplorer />} />
            <Route path="tools/learning" element={<ScriptLearning />} />
            <Route path="tools/normalization" element={<TextNormalization />} />
            <Route path="tools/compiler" element={<KnowledgeCompiler />} />
            <Route path="tools/synonyms" element={<SynonymsSearch />} />
            <Route path="tools/dictionary" element={<SanskritDictionary />} />
            <Route path="install" element={<Install />} />
            <Route path="search" element={<BookSearch />} />
            <Route path="chat" element={<Chat />} />
            <Route path="chat/local" element={<LocalChat />} />
            <Route path="quotes" element={<Quotes />} />
            <Route path="tattvas" element={<TattvasIndex />} />
            <Route path="tattva/:slug" element={<TattvaPage />} />
            <Route path="stats" element={<ReadingStatsPage />} />

            {/* Вайшнавський календар */}
            <Route path="calendar" element={<VaishnavCalendar />} />
            <Route path="calendar/ekadashi" element={<EkadashiList />} />
            <Route path="calendar/ekadashi/:slug" element={<EkadashiDetail />} />
            <Route path="contact" element={<Contact />} />

            {/* Платежі */}
            <Route path="payment/card" element={<CardPayment />} />
            <Route path="payment/bank" element={<BankTransfer />} />

            {/* CMS сторінки - catch-all для невідомих шляхів в межах мови */}
            <Route path=":slug" element={<PageView />} />
          </Route>

          {/* ============================================================
              NON-LOCALIZED ROUTES (без мовного префіксу)
              ============================================================ */}

          {/* Auth */}
          <Route path="/auth" element={<Auth />} />

          {/* Admin */}
          <Route path="/admin/banners" element={<AdminBanners />} />
          <Route path="/admin/audiobooks" element={<AdminAudiobooks />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/normalize-texts" element={<NormalizeTexts />} />
          <Route path="/admin/books" element={<Books />} />
          <Route path="/admin/books/new" element={<AddEditBook />} />
          <Route path="/admin/books/:id/edit" element={<AddEditBook />} />
          <Route path="/admin/cantos/:bookId" element={<Cantos />} />
          <Route path="/admin/cantos/:bookId/new" element={<AddEditCanto />} />
          <Route path="/admin/cantos/:bookId/:id/edit" element={<AddEditCanto />} />
          <Route path="/admin/intro-chapters/:bookId" element={<IntroChapters />} />
          <Route path="/admin/intro-chapters/:bookId/new" element={<AddEditIntroChapter />} />
          <Route path="/admin/intro-chapters/:bookId/:id/edit" element={<AddEditIntroChapter />} />
          <Route path="/admin/chapters/:bookId" element={<Chapters />} />
          <Route path="/admin/chapters/canto/:cantoId" element={<Chapters />} />
          <Route path="/admin/verses/new" element={<AddEditVerse />} />
          <Route path="/admin/verses/:id/edit" element={<AddEditVerse />} />
          <Route path="/admin/scripture" element={<ScriptureManager />} />
          <Route path="/admin/universal-import" element={<UniversalImportFixed />} />
          <Route path="/admin/bbt-import" element={<BBTImport />} />
          <Route path="/admin/fix-rls-policies" element={<FixRLSPolicies />} />
          <Route path="/admin/blog-posts" element={<BlogPosts />} />
          <Route path="/admin/blog-posts/new" element={<AddEditBlogPost />} />
          <Route path="/admin/blog-posts/:id/edit" element={<AddEditBlogPost />} />
          <Route path="/admin/blog-categories" element={<BlogCategories />} />
          <Route path="/admin/blog-tags" element={<BlogTags />} />
          <Route path="/admin/audio-categories" element={<AudioCategories />} />
          <Route path="/admin/audio-playlists" element={<AudioPlaylists />} />
          <Route path="/admin/audio-playlists/:id" element={<AudioPlaylistEdit />} />
          <Route path="/admin/pages" element={<Pages />} />
          <Route path="/admin/pages/new" element={<EditPage />} />
          <Route path="/admin/pages/:slug/edit" element={<EditPage />} />
          <Route path="/admin/static-pages" element={<StaticPages />} />
          <Route path="/admin/merge-noi" element={<MergeNoiChapters />} />
          <Route path="/admin/highlights" element={<Highlights />} />
          <Route path="/admin/lecture-import" element={<LectureImport />} />
          <Route path="/admin/letter-import" element={<LetterImport />} />
          <Route path="/admin/lectures" element={<LecturesManager />} />
          <Route path="/admin/letters" element={<LettersManager />} />
          <Route path="/admin/numcal" element={<NumCal />} />
          <Route path="/admin/lrc-editor" element={<LRCEditorPage />} />
          <Route path="/admin/book-export" element={<BookExport />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

          {/* 404 */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </MobileLayout>

        {/* Глобальні компоненти */}
        <OfflineIndicator />
        <PWAUpdatePrompt />
        <ModernGlobalPlayer />
        <GlobalSettingsPanel showFloatingButton={false} />
        <UnifiedSearch open={searchOpen} onOpenChange={setSearchOpen} />
        <ReadingModeExitButton />
      </BrowserRouter>
    </>
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      {/* craft — дефолт; storageKey узгоджений із ThemeProvider/ThemeToggle */}
      <ThemeProvider defaultTheme="craft" storageKey="veda-ui-theme">
        <LanguageProvider>
          <AuthProvider>
          <BooksProvider>
            <TooltipProvider>
              <ModernAudioProvider>
                <UserContentProvider>
                  <Toaster />
                  <Sonner />
                  <AppContent />
                </UserContentProvider>
              </ModernAudioProvider>
            </TooltipProvider>
          </BooksProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
