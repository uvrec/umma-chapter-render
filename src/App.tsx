import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { queryClient } from "@/lib/queryClient";
import { ErrorBoundary } from "@/components/ErrorBoundary";

import SiteBanners from "@/components/SiteBanners";
import { ChapterVersesList } from "@/pages/ChapterVersesList";

import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";

import { GlobalSettingsPanel } from "@/components/GlobalSettingsPanel";
import { AudioProvider as ModernAudioProvider } from "@/contexts/ModernAudioContext";
import { ModernGlobalPlayer } from "@/components/ModernGlobalPlayer";

import AdminBanners from "@/pages/admin/AdminBanners";
import AdminAudiobooks from "@/pages/admin/AdminAudiobooks";
import LectureImport from "@/pages/admin/LectureImport";
import LetterImport from "@/pages/admin/LetterImport";

import { NewHome } from "./pages/NewHome";
import { IndividualVerse } from "./components/IndividualVerse";
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
import { Glossary } from "./pages/Glossary";
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
import DataMigration from "./pages/admin/DataMigration";
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
import ImportWizard from "./pages/admin/ImportWizard";
import UniversalImportFixed from "./pages/admin/UniversalImportFixed";
import FixVerseLineBreaks from "./pages/admin/FixVerseLineBreaks";
import FixRLSPolicies from "./pages/admin/FixRLSPoliciesNew";
import Pages from "./pages/admin/Pages";
import EditPage from "./pages/admin/EditPage";
import StaticPages from "./pages/admin/StaticPages";
import { NoIRedirect } from "./pages/NoIRedirect";
import MergeNoiChapters from "./pages/admin/MergeNoiChapters";
import { PageView } from "./pages/PageView";
import Highlights from "./pages/admin/Highlights";
import NumCal from "./pages/admin/NumCal";

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
    {/* craft — дефолт; storageKey узгоджений із ThemeProvider/ThemeToggle */}
    <ThemeProvider defaultTheme="craft" storageKey="veda-ui-theme">
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <ModernAudioProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<NewHome />} />

                  {/* Читалка */}
                  <Route path="/verses/:bookId/:verseNumber" element={<IndividualVerse />} />

                  {/* Нові маршрути читання БД */}
                  <Route path="/veda-reader/:bookId" element={<BookOverview />} />
                  <Route path="/veda-reader/:bookId/intro/:slug" element={<IntroChapter />} />
                  <Route path="/veda-reader/:bookId/canto/:cantoNumber" element={<CantoOverview />} />
                  <Route
                    path="/veda-reader/:bookId/canto/:cantoNumber/chapter/:chapterNumber/:verseId"
                    element={<VedaReaderDB />}
                  />

                  {/* Special route for NoI: redirect to explicit chapter 1 */}
                  <Route path="/veda-reader/noi/:verseNumber" element={<NoIRedirect />} />

                  <Route path="/veda-reader/:bookId/:chapterNumber" element={<ChapterVersesList />} />
                  <Route path="/veda-reader/:bookId/:chapterNumber/:verseNumber" element={<VedaReaderDB />} />
                  <Route
                    path="/veda-reader/:bookId/canto/:cantoNumber/chapter/:chapterNumber"
                    element={<ChapterVersesList />}
                  />
                  <Route
                    path="/veda-reader/:bookId/canto/:cantoNumber/chapter/:chapterNumber/:verseNumber"
                    element={<VedaReaderDB />}
                  />

                  {/* Alias/redirects */}
                  <Route path="/veda-reader/bhagavad-gita/*" element={<Navigate to="/veda-reader/gita/1" replace />} />
                  <Route path="/veda-reader/sri-isopanishad/*" element={<Navigate to="/veda-reader/iso/1" replace />} />
                  <Route path="/veda-reader/srimad-bhagavatam/*" element={<Navigate to="/veda-reader/bhagavatam" replace />} />

                  {/* Бібліотека */}
                  <Route path="/library" element={<Library />} />
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
                  <Route path="/glossary-old" element={<Glossary />} />
                  <Route path="/tools/transliteration" element={<TransliterationTool />} />
                  <Route path="/tools/numerology" element={<Numerology />} />
                  <Route path="/tools/learning" element={<ScriptLearning />} />
                  <Route path="/tools/compiler" element={<KnowledgeCompiler />} />
                  <Route path="/tools/synonyms" element={<SynonymsSearch />} />
                  <Route path="/tools/dictionary" element={<SanskritDictionary />} />
                  <Route path="/contact" element={<Contact />} />

                  {/* Платежі */}
                  <Route path="/payment/card" element={<CardPayment />} />
                  <Route path="/payment/bank" element={<BankTransfer />} />

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
                  <Route path="/admin/data-migration" element={<DataMigration />} />
                  <Route path="/admin/import-wizard" element={<ImportWizard />} />
                  <Route path="/admin/universal-import" element={<UniversalImportFixed />} />
                  <Route path="/admin/fix-verse-linebreaks" element={<FixVerseLineBreaks />} />
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
                  <Route path="/admin/numcal" element={<NumCal />} />

                  {/* Сторінки з CMS */}
                  <Route path="/:slug" element={<PageView />} />

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>

                {/* Сучасний глобальний плеєр і панель налаштувань */}
                <ModernGlobalPlayer />
                <GlobalSettingsPanel />
              </BrowserRouter>
            </ModernAudioProvider>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
