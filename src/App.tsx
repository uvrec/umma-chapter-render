// src/App.tsx

import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import SiteBanners from "@/components/SiteBanners";

import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AudioProvider, GlobalAudioPlayer } from "@/components/GlobalAudioPlayer";
import "@/components/GlobalAudioPlayer/GlobalAudioPlayer.css";
import { GlobalSettingsPanel } from "@/components/GlobalSettingsPanel";

// Lazy-loaded public pages
const NewHome = lazy(() => import("./pages/NewHome").then(m => ({ default: m.NewHome })));
const VedaReader = lazy(() => import("./pages/VedaReader"));
const VerseView = lazy(() => import("./pages/VerseView"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Library = lazy(() => import("./pages/Library").then(m => ({ default: m.Library })));
const PrabhupadaBooks = lazy(() => import("./pages/library/PrabhupadaBooks").then(m => ({ default: m.PrabhupadaBooks })));
const AcharyasBooks = lazy(() => import("./pages/library/AcharyasBooks").then(m => ({ default: m.AcharyasBooks })));
const Audio = lazy(() => import("./pages/Audio").then(m => ({ default: m.Audio })));
const BhagavadGita = lazy(() => import("./pages/audiobooks/BhagavadGita").then(m => ({ default: m.BhagavadGita })));
const SrimadBhagavatam = lazy(() => import("./pages/audiobooks/SrimadBhagavatam").then(m => ({ default: m.SrimadBhagavatam })));
const SriIsopanishad = lazy(() => import("./pages/audiobooks/SriIsopanishad").then(m => ({ default: m.SriIsopanishad })));
const Podcasts = lazy(() => import("./pages/audio/Podcasts").then(m => ({ default: m.Podcasts })));
const CardPayment = lazy(() => import("./pages/payment/CardPayment").then(m => ({ default: m.CardPayment })));
const BankTransfer = lazy(() => import("./pages/payment/BankTransfer").then(m => ({ default: m.BankTransfer })));
const Glossary = lazy(() => import("./pages/Glossary").then(m => ({ default: m.Glossary })));
const Contact = lazy(() => import("./pages/Contact").then(m => ({ default: m.Contact })));
const Blog = lazy(() => import("./pages/Blog").then(m => ({ default: m.Blog })));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Lectures = lazy(() => import("./pages/audio/Lectures").then(m => ({ default: m.Lectures })));
const Music = lazy(() => import("./pages/audio/Music").then(m => ({ default: m.Music })));
const Audiobooks = lazy(() => import("./pages/audio/Audiobooks").then(m => ({ default: m.Audiobooks })));
const AudiobookView = lazy(() => import("./pages/audio/AudiobookView").then(m => ({ default: m.AudiobookView })));
const Auth = lazy(() => import("./pages/Auth"));
const VedaReaderDB = lazy(() => import("./components/VedaReaderDB").then(m => ({ default: m.VedaReaderDB })));
const GlossaryDB = lazy(() => import("./pages/GlossaryDB"));
const BookOverview = lazy(() => import("./pages/BookOverview").then(m => ({ default: m.BookOverview })));
const CantoOverview = lazy(() => import("./pages/CantoOverview"));
const TransliterationTool = lazy(() => import("./pages/TransliterationTool"));
const IntroChapter = lazy(() => import("./pages/IntroChapter").then(m => ({ default: m.IntroChapter })));
const PageView = lazy(() => import("./pages/PageView").then(m => ({ default: m.PageView })));
const NewPagesHub = lazy(() => import("./pages/NewPagesHub"));

// Lazy-loaded admin pages
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminBanners = lazy(() => import("./pages/admin/AdminBanners"));
const AdminAudiobooks = lazy(() => import("./pages/admin/AdminAudiobooks"));
const Books = lazy(() => import("./pages/admin/Books"));
const Verses = lazy(() => import("./pages/admin/Verses"));
const Chapters = lazy(() => import("./pages/admin/Chapters"));
const AddEditBook = lazy(() => import("./pages/admin/AddEditBook"));
const AddEditVerse = lazy(() => import("./pages/admin/AddEditVerse"));
const DataMigration = lazy(() => import("./pages/admin/DataMigration"));
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
const ImportWizard = lazy(() => import("./pages/admin/ImportWizard"));
const WebImport = lazy(() => import("./pages/admin/WebImport"));
const FixVerseLineBreaks = lazy(() => import("./pages/admin/FixVerseLineBreaks"));
const CleanBengali = lazy(() => import("./pages/admin/CleanBengali"));
const VedabaseImportV2 = lazy(() => import("./pages/admin/VedabaseImportV2"));
const VedabaseImportV3 = lazy(() => import("./pages/admin/VedabaseImportV3"));
const Pages = lazy(() => import("./pages/admin/Pages"));
const EditPage = lazy(() => import("./pages/admin/EditPage"));
const StaticPages = lazy(() => import("./pages/admin/StaticPages"));
const ChapterDetail = lazy(() => import("./pages/admin/ChapterDetail"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="craft" storageKey="veda-ui-theme">
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <AudioProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                {/* глобальні банери сайту */}
                <SiteBanners />

                <Suspense fallback={
                  <div className="flex min-h-screen items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                      <p className="text-muted-foreground">Завантаження...</p>
                    </div>
                  </div>
                }>
                  <Routes>
                  {/* Головна */}
                  <Route path="/" element={<NewHome />} />

                  {/* Читалка */}
                  <Route path="/verses" element={<VedaReader />} />
                  <Route path="/verses/:bookId" element={<VedaReader />} />
                  <Route path="/verses/:bookId/:verseNumber" element={<VerseView />} />

                  {/* Нові маршрути читання БД */}
                  <Route path="/veda-reader/:bookId" element={<BookOverview />} />
                  <Route path="/veda-reader/:bookId/intro/:slug" element={<IntroChapter />} />
                  <Route path="/veda-reader/:bookId/canto/:cantoNumber" element={<CantoOverview />} />
                  <Route
                    path="/veda-reader/:bookId/canto/:cantoNumber/chapter/:chapterNumber"
                    element={<VedaReaderDB />}
                  />
                  <Route path="/veda-reader/:bookId/chapter/:chapterNumber" element={<VedaReaderDB />} />
                  <Route path="/veda-reader/:bookId/:chapterId" element={<VedaReaderDB />} />

                  {/* Бібліотека */}
                  <Route path="/library" element={<Library />} />

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
                  <Route path="/new-pages" element={<NewPagesHub />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  {/* Явний маршрут 404, щоб уникнути перехоплення ":slug" */}
                  <Route path="/404" element={<NotFound />} />
                  <Route path="/audio/podcasts" element={<Podcasts />} />
                  <Route path="/glossary" element={<GlossaryDB />} />
                  <Route path="/glossary-old" element={<Glossary />} />
                  <Route path="/contact" element={<Contact />} />

                  {/* Tools */}
                  <Route path="/tools/transliteration" element={<TransliterationTool />} />

                  {/* Платежі */}
                  <Route path="/payment/card" element={<CardPayment />} />
                  <Route path="/payment/bank" element={<BankTransfer />} />

                  {/* Auth */}
                  <Route path="/auth" element={<Auth />} />

                  {/* Admin */}
                  <Route path="/admin/dashboard" element={<Dashboard />} />
                  <Route path="/admin/audiobooks" element={<AdminAudiobooks />} />

                  {/* УПРАВЛІННЯ БАНЕРАМИ — приймаємо будь-який із трьох шляхів */}
                  <Route path="/admin/banners" element={<AdminBanners />} />
                  <Route path="/admin/sitebanners" element={<AdminBanners />} />
                  <Route path="/admin/site-banners" element={<AdminBanners />} />

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
                  <Route path="/admin/web-import" element={<WebImport />} />
                  <Route path="/admin/import-wizard" element={<ImportWizard />} />
                  <Route path="/admin/vedabase-import-v2" element={<VedabaseImportV2 />} />
                  <Route path="/admin/fix-verse-linebreaks" element={<FixVerseLineBreaks />} />
                  <Route path="/admin/clean-bengali" element={<CleanBengali />} />
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
                  <Route path="/admin/chapters/:id" element={<ChapterDetail />} />
                  <Route path="/admin/import-v3" element={<VedabaseImportV3 />} />

                  {/* Сторінки з CMS */}
                  <Route path="/:slug" element={<PageView />} />

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                </Suspense>

                <GlobalAudioPlayer />
                <GlobalSettingsPanel />
              </BrowserRouter>
            </AudioProvider>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
