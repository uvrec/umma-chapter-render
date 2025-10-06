import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AudioProvider, GlobalAudioPlayer } from "@/components/GlobalAudioPlayer";
import { GlobalSettingsPanel } from "@/components/GlobalSettingsPanel";
import { NewHome } from "./pages/NewHome";
import { VedaReader } from "./components/VedaReader";
import { IndividualVerse } from "./components/IndividualVerse";
import NotFound from "./pages/NotFound";
import { Library } from "./pages/Library";
import { PrabhupadaBooks } from "./pages/library/PrabhupadaBooks";
import { AllBooks } from "./pages/library/AllBooks";
import { AcharyasBooks } from "./pages/library/AcharyasBooks";
import { Audio } from "./pages/Audio";
import { BhagavadGita } from "./pages/audiobooks/BhagavadGita";
import { SrimadBhagavatam } from "./pages/audiobooks/SrimadBhagavatam";
import { SriIsopanishad } from "./pages/audiobooks/SriIsopanishad";
import { Footer } from "./components/Footer";
import { Podcasts } from "./pages/audio/Podcasts";
import { CardPayment } from "./pages/payment/CardPayment";
import { BankTransfer } from "./pages/payment/BankTransfer";
import { OtherMethods } from "./pages/payment/OtherMethods";
import { Glossary } from "./pages/Glossary";
import { Contact } from "./pages/Contact";
import { Blog } from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import { Lectures } from "./pages/audio/Lectures";
import { Music } from "./pages/audio/Music";
import { Audiobooks } from "./pages/audio/Audiobooks";
import Auth from "./pages/Auth";
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
import Cantos from "./pages/admin/Cantos";
import AddEditCanto from "./pages/admin/AddEditCanto";
import BlogPosts from "./pages/admin/BlogPosts";
import AddEditBlogPost from "./pages/admin/AddEditBlogPost";
import BlogCategories from "./pages/admin/BlogCategories";
import BlogTags from "./pages/admin/BlogTags";
import AudioCategories from "./pages/admin/AudioCategories";
import AudioPlaylists from "./pages/admin/AudioPlaylists";
import AudioPlaylistEdit from "./pages/admin/AudioPlaylistEdit";
import ImportWizard from "./pages/admin/ImportWizard";
import FixVerseLineBreaks from "./pages/admin/FixVerseLineBreaks";
import Pages from "./pages/admin/Pages";
import EditPage from "./pages/admin/EditPage";
import StaticPages from "./pages/admin/StaticPages";
import { PageView } from "./pages/PageView";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="veda-ui-theme">
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <AudioProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
              <Routes>
                <Route path="/" element={<NewHome />} />
                <Route path="/verses" element={<VedaReader />} />
                <Route path="/verses/:bookId" element={<VedaReader />} />
                <Route path="/verses/:bookId/:verseNumber" element={<IndividualVerse />} />
                <Route path="/veda-reader/:bookId" element={<BookOverview />} />
                <Route path="/veda-reader/:bookId/canto/:cantoNumber" element={<CantoOverview />} />
                <Route path="/veda-reader/:bookId/canto/:cantoNumber/chapter/:chapterNumber" element={<VedaReaderDB />} />
                <Route path="/veda-reader/:bookId/:chapterId" element={<VedaReaderDB />} />
                <Route path="/library" element={<Library />} />
                <Route path="/library/prabhupada" element={<PrabhupadaBooks />} />
                <Route path="/library/all" element={<AllBooks />} />
                <Route path="/library/acharyas" element={<AcharyasBooks />} />
                <Route path="/audiobooks" element={<Audio />} />
                <Route path="/audio/audiobooks" element={<Audiobooks />} />
                <Route path="/audio/lectures" element={<Lectures />} />
                <Route path="/audio/music" element={<Music />} />
                <Route path="/audiobooks/bhagavad-gita" element={<BhagavadGita />} />
                <Route path="/audiobooks/srimad-bhagavatam" element={<SrimadBhagavatam />} />
                <Route path="/audiobooks/sri-isopanishad" element={<SriIsopanishad />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/audio/podcasts" element={<Podcasts />} />
                <Route path="/glossary" element={<GlossaryDB />} />
                <Route path="/glossary-old" element={<Glossary />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/payment/card" element={<CardPayment />} />
                <Route path="/payment/bank" element={<BankTransfer />} />
                <Route path="/payment/other" element={<OtherMethods />} />
                <Route path="/auth" element={<Auth />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/books" element={<Books />} />
          <Route path="/admin/books/new" element={<AddEditBook />} />
          <Route path="/admin/books/:id/edit" element={<AddEditBook />} />
          <Route path="/admin/cantos/:bookId" element={<Cantos />} />
          <Route path="/admin/cantos/:bookId/new" element={<AddEditCanto />} />
          <Route path="/admin/cantos/:bookId/:id/edit" element={<AddEditCanto />} />
          <Route path="/admin/chapters/:bookId" element={<Chapters />} />
          <Route path="/admin/chapters/canto/:cantoId" element={<Chapters />} />
          <Route path="/admin/verses" element={<Verses />} />
          <Route path="/admin/verses/new" element={<AddEditVerse />} />
          <Route path="/admin/verses/:id/edit" element={<AddEditVerse />} />
          <Route path="/admin/data-migration" element={<DataMigration />} />
          <Route path="/admin/import-wizard" element={<ImportWizard />} />
          <Route path="/admin/fix-verse-linebreaks" element={<FixVerseLineBreaks />} />
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
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="/:slug" element={<PageView />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
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
