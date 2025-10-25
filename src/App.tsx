import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import SiteBanners from "@/components/SiteBanners";
import { ChapterVersesList } from "@/pages/ChapterVersesList";

import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AudioProvider, GlobalAudioPlayer } from "@/components/GlobalAudioPlayer";
import "@/components/GlobalAudioPlayer/GlobalAudioPlayer.css";
import { GlobalSettingsPanel } from "@/components/GlobalSettingsPanel";
import { AudioProvider as ModernAudioProvider } from "@/contexts/ModernAudioContext";
import { ModernGlobalPlayer } from "@/components/ModernGlobalPlayer";

import AdminBanners from "@/pages/admin/AdminBanners";
import AdminAudiobooks from "@/pages/admin/AdminAudiobooks";

import { NewHome } from "./pages/NewHome";
import VedaReader from "./pages/VedaReader"; // ← тепер існує
import { IndividualVerse } from "./components/IndividualVerse";
import NotFound from "./pages/NotFound";
import { Library } from "./pages/Library";
import { PrabhupadaBooks } from "./pages/library/PrabhupadaBooks";
import { AcharyasBooks } from "./pages/library/AcharyasBooks";
import { Audio } from "./pages/Audio";
import { BhagavadGita } from "./pages/audiobooks/BhagavadGita";
import { SrimadBhagavatam } from "./pages/audiobooks/SrimadBhagavatam";
import { SriIsopanishad } from "./pages/audiobooks/SriIsopanishad";
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
import Dashboard from "./pages/admin/Dashboard";
import Books from "./pages/admin/Books";
import Verses from "./pages/admin/Verses";
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
import FixVerseLineBreaks from "./pages/admin/FixVerseLineBreaks";
import FixRLSPolicies from "./pages/admin/FixRLSPoliciesNew";
import Pages from "./pages/admin/Pages";
import EditPage from "./pages/admin/EditPage";
import StaticPages from "./pages/admin/StaticPages";
import { PageView } from "./pages/PageView";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* craft — дефолт; storageKey узгоджений із ThemeProvider/ThemeToggle */}
    <ThemeProvider defaultTheme="craft" storageKey="veda-ui-theme">
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <AudioProvider>
              <ModernAudioProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                <Routes>
                  <Route path="/" element={<NewHome />} />

                  {/* Читалка */}
                  <Route path="/verses" element={<VedaReader />} />
                  <Route path="/verses/:bookId" element={<VedaReader />} />
                  <Route path="/verses/:bookId/:verseNumber" element={<IndividualVerse />} />

                  {/* Нові маршрути читання БД */}
                  <Route path="/veda-reader/:bookId" element={<BookOverview />} />
                  <Route path="/veda-reader/:bookId/intro/:slug" element={<IntroChapter />} />
                  <Route path="/veda-reader/:bookId/canto/:cantoNumber" element={<CantoOverview />} />
                  <Route
                    path="/veda-reader/:bookId/canto/:cantoNumber/chapter/:chapterNumber/:verseId"
                    element={<VedaReaderDB />}
                  />
                  <Route path="/veda-reader/:bookId/:chapterId" element={<ChapterVersesList />} />
                  <Route path="/veda-reader/:bookId/:chapterId/:verseNumber" element={<VedaReaderDB />} />
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

                  {/* Бібліотека */}
                  <Route path="/library" element={<Library />} />
                  <Route path="/library/:slug" element={<BookOverview />} />
                  <Route path="/library/prabhupada" element={<Navigate to="/library" replace />} />
                  <Route path="/library/acharyas" element={<Navigate to="/library" replace />} />

                  {/* Аудіо */}
                  <Route path="/audio" element={<Audio />} />
                  <Route path="/audiobooks" element={<Audiobooks />} />
                  <Route path="/audiobooks/:id" element={<AudiobookView />} />
                  <Route path="/audio/lectures" element={<Lectures />} />
                  <Route path="/audio/music" element={<Music />} />
                  <Route path="/audiobooks/bhagavad-gita" element={<BhagavadGita />} />
                  <Route path="/audiobooks/srimad-bhagavatam" element={<SrimadBhagavatam />} />
                  <Route path="/audiobooks/sri-isopanishad" element={<SriIsopanishad />} />

                  {/* Блог/інше */}
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/audio/podcasts" element={<Podcasts />} />
                  <Route path="/glossary" element={<GlossaryDB />} />
                  <Route path="/glossary-old" element={<Glossary />} />
                  <Route path="/tools/transliteration" element={<TransliterationTool />} />
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
                  <Route path="/admin/verses" element={<Verses />} />
                  <Route path="/admin/verses/new" element={<AddEditVerse />} />
                  <Route path="/admin/verses/:id/edit" element={<AddEditVerse />} />
                  <Route path="/admin/data-migration" element={<DataMigration />} />
                  <Route path="/admin/import-wizard" element={<ImportWizard />} />
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
                  <Route path="/admin/pages/:slug/edit" element={<EditPage />} />
                  <Route path="/admin/static-pages" element={<StaticPages />} />

                  {/* Сторінки з CMS */}
                  <Route path="/:slug" element={<PageView />} />

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>

                {/* Глобальний плеєр і єдина панель налаштувань */}
                <GlobalAudioPlayer />
                <ModernGlobalPlayer />
                <GlobalSettingsPanel />
              </BrowserRouter>
              </ModernAudioProvider>
            </AudioProvider>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
