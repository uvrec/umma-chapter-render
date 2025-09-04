import { Header } from "@/components/Header";
import { MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 mb-6">
            <MessageCircle className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Контакти</h1>
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
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Написати повідомлення</h3>
              
              <form className="space-y-4">
                <Input placeholder="Ваше ім'я" />
                <Input type="email" placeholder="Email" />
                <Textarea placeholder="Повідомлення" rows={4} />
                <Button className="w-full">Надіслати</Button>
              </form>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};