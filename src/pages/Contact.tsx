import { useState } from "react";
import { Header } from "@/components/Header";
import { MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useStaticPageMeta } from "@/hooks/useStaticPageMeta";
import { PageMeta } from "@/components/PageMeta";
import { useLanguage } from "@/contexts/LanguageContext";

const contactSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Ім'я обов'язкове")
    .max(100, "Ім'я не може перевищувати 100 символів"),
  email: z.string()
    .trim()
    .email("Невірний формат email")
    .max(255, "Email не може перевищувати 255 символів"),
  message: z.string()
    .trim()
    .min(1, "Повідомлення обов'язкове")
    .max(2000, "Повідомлення не може перевищувати 2000 символів"),
});

const socialLinks = [
  {
    name: "Instagram",
    url: "https://instagram.com/prabhupada.ua/",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    name: "YouTube",
    url: "https://youtube.com/@prabhupada_ua",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    name: "Telegram",
    url: "https://t.me/prabhupada_ua",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 6.728-.896 6.728-.378 1.846-.991 2.165-1.613 2.165-.86 0-1.41-.317-1.928-.317-.518 0-1.373.436-2.062.436-1.203 0-1.91-.912-2.458-2.05L8.9 13.817c-.685-1.415-.528-1.842.282-2.252l8.505-4.334c.847-.43 1.478-.013 1.881.929z"/>
      </svg>
    ),
  },
];

export const Contact = () => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const { data: pageMeta } = useStaticPageMeta("contact");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = contactSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    
    setErrors({});
    
    // Encode data for WhatsApp (example implementation)
    const whatsappMessage = encodeURIComponent(
      `Ім'я: ${result.data.name}\nEmail: ${result.data.email}\nПовідомлення: ${result.data.message}`
    );
    
    toast({
      title: "Форма валідна",
      description: "Функціонал відправки повідомлень буде додано пізніше",
    });
    
    // Reset form
    setFormData({ name: "", email: "", message: "" });
  };

  const title = pageMeta ? (language === "ua" ? pageMeta.title_ua : pageMeta.title_en) : "Контакти";
  
  return (
    <div className="min-h-screen bg-background">
      {pageMeta && (
        <PageMeta
          titleUa={pageMeta.title_ua}
          titleEn={pageMeta.title_en}
          metaDescriptionUa={pageMeta.meta_description_ua}
          metaDescriptionEn={pageMeta.meta_description_en}
          ogImage={pageMeta.og_image}
          seoKeywords={pageMeta.seo_keywords}
          language={language}
        />
      )}
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 mb-6">
            <MessageCircle className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Зв'яжіться з нами</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">contact@example.com</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">+380 (XX) XXX-XX-XX</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Україна</span>
                </div>

                <div className="pt-4">
                  <h4 className="text-sm font-semibold mb-3">Соціальні мережі</h4>
                  <div className="flex gap-3">
                    {socialLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener"
                        referrerPolicy="no-referrer"
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                        aria-label={link.name}
                      >
                        {link.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Написати повідомлення</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input 
                    placeholder="Ваше ім'я" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                </div>
                
                <div>
                  <Input 
                    type="email" 
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                </div>
                
                <div>
                  <Textarea 
                    placeholder="Повідомлення" 
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                  {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
                </div>
                
                <Button type="submit" className="w-full">Надіслати</Button>
              </form>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};