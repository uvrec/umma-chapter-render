import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { VedaReader } from "./components/VedaReader";
import NotFound from "./pages/NotFound";
import { Library } from "./pages/Library";
import { Audiobooks } from "./pages/Audiobooks";
import { FudoKazuki } from "./pages/FudoKazuki";
import { Glossary } from "./pages/Glossary";
import { Contact } from "./pages/Contact";
import { Donation } from "./pages/Donation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/verses" element={<VedaReader />} />
          <Route path="/verses/:bookId" element={<VedaReader />} />
          <Route path="/library" element={<Library />} />
          <Route path="/audiobooks" element={<Audiobooks />} />
          <Route path="/fudokazuki" element={<FudoKazuki />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/donation" element={<Donation />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
