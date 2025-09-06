import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NewHome } from "./pages/NewHome";
import { VedaReader } from "./components/VedaReader";
import NotFound from "./pages/NotFound";
import { Library } from "./pages/Library";
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
import { Donation } from "./pages/Donation";
import { Blog } from "./pages/Blog";
import { Lectures } from "./pages/audio/Lectures";
import { Music } from "./pages/audio/Music";
import { Audiobooks } from "./pages/audio/Audiobooks";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="veda-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<NewHome />} />
          <Route path="/verses" element={<VedaReader />} />
          <Route path="/verses/:bookId" element={<VedaReader />} />
          <Route path="/library" element={<Library />} />
          <Route path="/audiobooks" element={<Audio />} />
          <Route path="/audio/audiobooks" element={<Audiobooks />} />
          <Route path="/audio/lectures" element={<Lectures />} />
          <Route path="/audio/music" element={<Music />} />
          <Route path="/audiobooks/bhagavad-gita" element={<BhagavadGita />} />
          <Route path="/audiobooks/srimad-bhagavatam" element={<SrimadBhagavatam />} />
          <Route path="/audiobooks/sri-isopanishad" element={<SriIsopanishad />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/audio/podcasts" element={<Podcasts />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/donation" element={<Donation />} />
          <Route path="/payment/card" element={<CardPayment />} />
          <Route path="/payment/bank" element={<BankTransfer />} />
          <Route path="/payment/other" element={<OtherMethods />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </ThemeProvider>
  </QueryClientProvider>
);

export default App;
