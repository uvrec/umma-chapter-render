import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { queryClient } from "@/lib/queryClient";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";
import { lazy, Suspense } from "react";
import { LoadingFallback } from "@/components/LoadingFallback";

import SiteBanners from "@/components/SiteBanners";
import { ChapterVersesList } from "@/pages/ChapterVersesList";

import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { BooksProvider } from "@/contexts/BooksContext";

import { AudioProvider as ModernAudioProvider } from "@/contexts/ModernAudioContext";
import { ModernGlobalPlayer } from "@/components/ModernGlobalPlayer";

// ============================================================
// LAZY LOADED ADMIN PAGES (завантажуються тільки при потребі)
// ============================================================
const AdminBanners = lazy(() => import("@/pages/admin/AdminBanners"));
const AdminAudiobooks = lazy(() => import("@/pages/admin/AdminAudiobooks"));
const LectureImport = lazy(() => import("@/pages/admin/LectureImport"));
const LetterImport = lazy(() => import("@/pages/admin/LetterImport"));
const LecturesManager = lazy(() => import("@/pages/admin/LecturesManager"));
const LettersManager = lazy(() => import("@/pages/admin/LettersManager"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const NormalizeTexts = lazy(() => import("./pages/admin/NormalizeTexts"));
const Books = lazy(() => import("./pages/admin/Books"));
const ScriptureManager = lazy(() => import("./pages/admin/ScriptureManager"));
const Chapters = lazy(() => import("./pages/admin/Chapters"));
const AddEditBook = lazy(() => import("./pages/admin/AddEditBook"));
const AddEditVerse = lazy(() => import("./pages/admin/AddEditVerse"));
const Cantos = lazy(() => import("./pages/admin/Cantos"));
const AddEditCanto = lazy(() => import("./pages/admin/AddEditCanto"));
const IntroChapters = lazy(() => import("./pages/admin/IntroChapters"));
const AddEditIntroChapter = lazy(() => import("./pages/admin/AddEditIntroChapter"));
const BlogPosts = lazy(() => import("./pages/admin/BlogPosts"));
const AddEditBlogPost = lazy(() => import("./pages/admin/AddEditBlogPost"));
const BlogCategories = lazy(() => import("./pages/admin/BlogCategories"));
const BlogTags = lazy(() => import("./pages/admin/BlogTags"));
const AudioCategories = lazy(() => import("./pages/admin/AudioCategories"));
const AudioPlaylists = lazy(() => import("./pages/admin/AudioPlaylists"));
const AudioPlaylistEdit = lazy(() => import("./pages/admin/AudioPlaylistEdit"));
const UniversalImportFixed = lazy(() => import("./pages/admin/UniversalImportFixed"));
const BBTImport = lazy(() => import("./pages/admin/BBTImportUniversal"));
const FixRLSPolicies = lazy(() => import("./pages/admin/FixRLSPoliciesNew"));
const Pages = lazy(() => import("./pages/admin/Pages"));
const EditPage = lazy(() => import("./pages/admin/EditPage"));
const StaticPages = lazy(() => import("./pages/admin/StaticPages"));
const LRCEditorPage = lazy(() => import("./pages/admin/LRCEditorPage"));
const BookExport = lazy(() => import("./pages/admin/BookExport"));
const MergeNoiChapters = lazy(() => import("./pages/admin/MergeNoiChapters"));
const Highlights = lazy(() => import("./pages/admin/Highlights"));
const NumCal = lazy(() => import("./pages/admin/NumCal"));
const NumerologyStats = lazy(() => import("./pages/admin/NumerologyStats"));
const TypographyAdmin = lazy(() => import("./pages/admin/Typography"));
const CalendarAdmin = lazy(() => import("./pages/admin/CalendarAdmin"));
const SadhanaAdmin = lazy(() => import("./pages/admin/SadhanaAdmin"));

// ============================================================
// LAZY LOADED HEAVY PAGES (великі сторінки)
// ============================================================
const Chat = lazy(() => import("./pages/Chat"));
const LocalChat = lazy(() => import("./pages/LocalChat"));
const KnowledgeCompiler = lazy(() => import("./pages/KnowledgeCompiler"));
const TransliterationTool = lazy(() => import("./pages/TransliterationTool"));
const JyotishCalculator = lazy(() => import("./pages/tools/JyotishCalculator"));
const RagaExplorer = lazy(() => import("./pages/tools/RagaExplorer"));
const VaishnavCalendar = lazy(() => import("./pages/VaishnavCalendar"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const GlossaryDB = lazy(() => import("./pages/GlossaryDB"));
const SynonymsSearch = lazy(() => import("./pages/SynonymsSearch"));
const SanskritDictionary = lazy(() => import("./pages/SanskritDictionary"));
const BengaliDictionary = lazy(() => import("./pages/BengaliDictionary"));
const Numerology = lazy(() => import("./pages/tools/Numerology"));
const ScriptLearning = lazy(() => import("./pages/tools/ScriptLearning"));
const TextNormalization = lazy(() => import("./pages/tools/TextNormalization"));
const FontComparisonTest = lazy(() => import("./pages/tools/FontComparisonTest"));
const TimelinePage = lazy(() => import("./pages/TimelinePage"));
const PrabhupadaTimeline = lazy(() => import("./pages/PrabhupadaTimeline"));
const GVReferences = lazy(() => import("./pages/GVReferences"));
const EkadashiList = lazy(() => import("./pages/EkadashiList"));
const EkadashiDetail = lazy(() => import("./pages/EkadashiDetail"));
const TattvasIndex = lazy(() => import("./pages/TattvasIndex"));
const TattvaPage = lazy(() => import("./pages/TattvaPage"));
const ReadingStatsPage = lazy(() => import("./pages/ReadingStatsPage"));
const BookSearch = lazy(() => import("./pages/BookSearch"));
const Quotes = lazy(() => import("./pages/Quotes"));
const SadhanaTracker = lazy(() => import("./pages/SadhanaTracker"));

// ============================================================
// STATIC IMPORTS (критичні сторінки, завантажуються одразу)
// ============================================================
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
import { PaymentSuccess } from "./pages/payment/PaymentSuccess";
import { Contact } from "./pages/Contact";
import { Blog } from "./pages/Blog";
import { Lectures } from "./pages/audio/Lectures";
import { Music } from "./pages/audio/Music";
import { Audiobooks } from "./pages/audio/Audiobooks";
import { AudiobookView } from "./pages/audio/AudiobookView";
import Auth from "./pages/Auth";
import { VedaReaderDB } from "./components/VedaReaderDB";
import { BookOverview } from "./pages/BookOverview";
import CantoOverview from "./pages/CantoOverview";
import { IntroChapter } from "./pages/IntroChapter";
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
import Install from "./pages/Install";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { PWAUpdatePrompt } from "./components/PWAUpdatePrompt";
import { UnifiedSearch, useUnifiedSearch } from "./components/UnifiedSearch";
import { MobileLayout } from "./components/mobile";
import { ReadingModeExitButton } from "./components/ReadingModeExitButton";
import { useEffect } from "react";
import { loadAdminTypography, applyAdminTypographyToCSS } from "./constants/adminTypography";

// Внутрішній компонент з доступом до hooks
function AppContent() {
  const { open: searchOpen, setOpen: setSearchOpen } = useUnifiedSearch();

  // Ініціалізація застосунку
  useEffect(() => {
    // Очищаємо режими читання при завантаженні застосунку
    // щоб вони не впливали на сторінки поза читачем
    document.documentElement.setAttribute('data-fullscreen-reading', 'false');
    document.documentElement.setAttribute('data-zen-mode', 'false');
    document.documentElement.setAttribute('data-presentation-mode', 'false');

    // Скидаємо localStorage щоб useReaderSettings не відновлював режими на інших сторінках
    try {
      localStorage.setItem('vv_reader_fullscreenMode', 'false');
      localStorage.setItem('vv_reader_zenMode', 'false');
      localStorage.setItem('vv_reader_presentationMode', 'false');
    } catch {
      // localStorage may not be available
    }

    // Завантажуємо та застосовуємо налаштування типографіки з адмінки
    const typographyConfig = loadAdminTypography();
    applyAdminTypographyToCSS(typographyConfig);

    // Слухаємо зміни типографіки (коли адмін змінює налаштування)
    const handleTypographyChange = (e: CustomEvent) => {
      applyAdminTypographyToCSS(e.detail);
    };
    window.addEventListener('vv-admin-typography-changed', handleTypographyChange as EventListener);

    return () => {
      window.removeEventListener('vv-admin-typography-changed', handleTypographyChange as EventListener);
    };
  }, []);

  return (
    <>
      <BrowserRouter>
        <MobileLayout>
        <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* ============================================================
              ROOT → LANGUAGE REDIRECT
              Redirects / to /uk/ or /en/ based on saved preference
              ============================================================ */}
          <Route path="/" element={<LanguageRedirect />} />

          {/* ============================================================
              LANGUAGE-PREFIXED ROUTES (/:lang/...)
              All public routes wrapped with language prefix
              ============================================================ */}
          <Route path="/:lang" element={<LanguageWrapper />}>
            <Route index element={<NewHome />} />

            {/* /lib/ - ОСНОВНІ МАРШРУТИ (короткі URL) */}
            {/* Редіректи для вкладок бібліотеки */}
            <Route path="lib/lectures" element={<Navigate to="../library?tab=lectures" replace />} />
            <Route path="lib/letters" element={<Navigate to="../library?tab=letters" replace />} />
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
            <Route path="tools/font-test" element={<FontComparisonTest />} />
            <Route path="tools/compiler" element={<KnowledgeCompiler />} />
            <Route path="tools/synonyms" element={<SynonymsSearch />} />
            <Route path="tools/dictionary" element={<SanskritDictionary />} />
            <Route path="tools/bengali-dictionary" element={<BengaliDictionary />} />
            <Route path="install" element={<Install />} />
            <Route path="search" element={<BookSearch />} />
            <Route path="chat" element={<Chat />} />
            <Route path="chat/local" element={<LocalChat />} />
            <Route path="quotes" element={<Quotes />} />
            <Route path="tattvas" element={<TattvasIndex />} />
            <Route path="tattva/:slug" element={<TattvaPage />} />
            <Route path="stats" element={<ReadingStatsPage />} />
            <Route path="timeline" element={<TimelinePage />} />
            <Route path="prabhupada/timeline" element={<PrabhupadaTimeline />} />
            <Route path="sadhana" element={<SadhanaTracker />} />

            {/* Вайшнавський календар */}
            <Route path="calendar" element={<VaishnavCalendar />} />
            <Route path="calendar/ekadashi" element={<EkadashiList />} />
            <Route path="calendar/ekadashi/:slug" element={<EkadashiDetail />} />
            <Route path="contact" element={<Contact />} />

            {/* Платежі */}
            <Route path="payment/card" element={<CardPayment />} />
            <Route path="payment/bank" element={<BankTransfer />} />
            <Route path="payment/success" element={<PaymentSuccess />} />

            {/* CMS сторінки - catch-all для невідомих шляхів в межах мови */}
            <Route path=":slug" element={<PageView />} />
          </Route>

          {/* ============================================================
              NON-LOCALIZED ROUTES (без мовного префіксу)
              ============================================================ */}
          {/* Основні читацькі маршрути → редірект на /lib/ */}
          <Route path="/veda-reader/:bookId/canto/:cantoNumber/chapter/:chapterNumber/:verseId" element={<VedaReaderCantoVerseRedirect />} />
          <Route path="/veda-reader/:bookId/canto/:cantoNumber/chapter/:chapterNumber/:verseNumber" element={<VedaReaderCantoVerseRedirect />} />
          <Route path="/veda-reader/:bookId/canto/:cantoNumber/chapter/:chapterNumber" element={<VedaReaderCantoChapterRedirect />} />
          <Route path="/veda-reader/:bookId/canto/:cantoNumber" element={<VedaReaderCantoRedirect />} />
          <Route path="/veda-reader/:bookId/:chapterNumber/:verseNumber" element={<VedaReaderVerseRedirect />} />
          <Route path="/veda-reader/:bookId/:chapterNumber" element={<VedaReaderChapterRedirect />} />

          {/* Special route for NoI: redirect to /lib/ */}
          <Route path="/veda-reader/noi/:verseNumber" element={<NoIRedirect />} />

          {/* Book resources pages - залишаються під /veda-reader/ (не мають числових параметрів) */}
          <Route path="/veda-reader/:bookId/intro/:slug" element={<IntroChapter />} />
          <Route path="/veda-reader/:bookId/author" element={<BookAuthorPage />} />
          <Route path="/veda-reader/:bookId/pronunciation" element={<BookPronunciationPage />} />
          <Route path="/veda-reader/:bookId/glossary" element={<BookGlossaryPage />} />
          <Route path="/veda-reader/:bookId/dedication" element={<BookDedicationPage />} />
          <Route path="/veda-reader/:bookId/disciplic-succession" element={<BookDisciplicSuccessionPage />} />
          <Route path="/veda-reader/:bookId/settings" element={<BookSettingsRoutePage />} />
          <Route path="/veda-reader/:bookId/bookmarks" element={<BookUserContentPage />} />
          <Route path="/veda-reader/:bookId/notes" element={<BookUserContentPage />} />
          <Route path="/veda-reader/:bookId/highlights" element={<BookUserContentPage />} />
          <Route path="/veda-reader/:bookId/galleries" element={<BookGalleriesPage />} />
          <Route path="/veda-reader/:bookId/canto/:cantoNumber/author" element={<BookAuthorPage />} />
          <Route path="/veda-reader/:bookId/canto/:cantoNumber/pronunciation" element={<BookPronunciationPage />} />
          <Route path="/veda-reader/:bookId/canto/:cantoNumber/glossary" element={<BookGlossaryPage />} />
          <Route path="/veda-reader/:bookId/canto/:cantoNumber/dedication" element={<BookDedicationPage />} />
          <Route path="/veda-reader/:bookId/canto/:cantoNumber/disciplic-succession" element={<BookDisciplicSuccessionPage />} />
          <Route path="/veda-reader/:bookId/canto/:cantoNumber/settings" element={<BookSettingsRoutePage />} />
          <Route path="/veda-reader/:bookId/canto/:cantoNumber/bookmarks" element={<BookUserContentPage />} />
          <Route path="/veda-reader/:bookId/canto/:cantoNumber/notes" element={<BookUserContentPage />} />
          <Route path="/veda-reader/:bookId/canto/:cantoNumber/highlights" element={<BookUserContentPage />} />
          <Route path="/veda-reader/:bookId/canto/:cantoNumber/galleries" element={<BookGalleriesPage />} />

          {/* /veda-reader/:bookId → /lib/:bookId (останнє - найменш специфічне) */}
          <Route path="/veda-reader/:bookId" element={<VedaReaderBookRedirect />} />

          {/* Alias/redirects для довгих назв */}
          <Route path="/veda-reader/bhagavad-gita/*" element={<Navigate to="/lib/bg/1" replace />} />
          <Route path="/veda-reader/gita/*" element={<Navigate to="/lib/bg/1" replace />} />
          <Route path="/veda-reader/sri-isopanishad/*" element={<Navigate to="/lib/iso/1" replace />} />
          <Route path="/veda-reader/srimad-bhagavatam/*" element={<Navigate to="/lib/sb" replace />} />
          <Route path="/veda-reader/bhagavatam/*" element={<Navigate to="/lib/sb" replace />} />

          {/* Бібліотека */}
          <Route path="/library" element={<Library />} />
          <Route path="/library/references" element={<GVReferences />} />
          <Route path="/library/lectures" element={<LecturesLibrary />} />
          <Route path="/library/lectures/:slug" element={<LectureView />} />
          <Route path="/library/letters" element={<LettersLibrary />} />
          <Route path="/library/letters/:slug" element={<LetterView />} />
          <Route path="/library/:slug" element={<BookOverview />} />
          <Route path="/library/prabhupada" element={<Navigate to="/library" replace />} />
          <Route path="/library/acharyas" element={<Navigate to="/library" replace />} />

          {/* Аудіо */}
          <Route path="/audio" element={<Audio />} />
          <Route path="/audiobooks" element={<Audiobooks />} />
          <Route path="/audiobooks/:id" element={<AudiobookView />} />
          <Route path="/audio/lectures" element={<Lectures />} />
          <Route path="/audio/music" element={<Music />} />

          {/* Блог/інше */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/audio/podcasts" element={<Podcasts />} />
          <Route path="/glossary" element={<GlossaryDB />} />
          <Route path="/tools/transliteration" element={<TransliterationTool />} />
          <Route path="/tools/numerology" element={<Numerology />} />
          <Route path="/tools/jyotish" element={<JyotishCalculator />} />
          <Route path="/tools/ragas" element={<RagaExplorer />} />
          <Route path="/tools/learning" element={<ScriptLearning />} />
          <Route path="/tools/normalization" element={<TextNormalization />} />
          <Route path="/tools/font-test" element={<FontComparisonTest />} />
          <Route path="/tools/compiler" element={<KnowledgeCompiler />} />
          <Route path="/tools/synonyms" element={<SynonymsSearch />} />
          <Route path="/tools/dictionary" element={<SanskritDictionary />} />
          <Route path="/tools/bengali-dictionary" element={<BengaliDictionary />} />
          <Route path="/install" element={<Install />} />
          <Route path="/search" element={<BookSearch />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/local" element={<LocalChat />} />
          <Route path="/quotes" element={<Quotes />} />
          <Route path="/tattvas" element={<TattvasIndex />} />
          <Route path="/tattva/:slug" element={<TattvaPage />} />
          <Route path="/stats" element={<ReadingStatsPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/prabhupada/timeline" element={<PrabhupadaTimeline />} />
          <Route path="/sadhana" element={<SadhanaTracker />} />

          {/* Вайшнавський календар */}
          <Route path="/calendar" element={<VaishnavCalendar />} />
          <Route path="/calendar/ekadashi" element={<EkadashiList />} />
          <Route path="/calendar/ekadashi/:slug" element={<EkadashiDetail />} />
          <Route path="/contact" element={<Contact />} />

          {/* Платежі */}
          <Route path="/payment/card" element={<CardPayment />} />
          <Route path="/payment/bank" element={<BankTransfer />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />

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
          <Route path="/admin/numerology-stats" element={<NumerologyStats />} />
          <Route path="/admin/typography" element={<TypographyAdmin />} />
          <Route path="/admin/calendar" element={<CalendarAdmin />} />
          <Route path="/admin/sadhana" element={<SadhanaAdmin />} />
          <Route path="/admin/lrc-editor" element={<LRCEditorPage />} />
          <Route path="/admin/book-export" element={<BookExport />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

          {/* 404 */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        </MobileLayout>

        {/* Глобальні компоненти */}
        <OfflineIndicator />
        <PWAUpdatePrompt />
        <ModernGlobalPlayer />
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
