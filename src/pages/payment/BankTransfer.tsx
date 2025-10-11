import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Banknote, Copy, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export const BankTransfer = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const bankDetails = {
    recipient: "Громадська організація 'Ведичний портал'",
    iban: "UA21 3223 1300 0002 6007 3233 5555 1",
    bank: "МоноБанк",
    mfo: "305299",
    edrpou: "12345678",
    purpose: "Благодійний внесок на розвиток проєкту",
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to="/donation">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад до способів підтримки
            </Button>
          </Link>

          <div className="text-center mb-8">
            <Banknote className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Банківський переказ</h1>
            <p className="text-muted-foreground">Переказ коштів безпосередньо на рахунок організації</p>
          </div>

          <div className="space-y-6">
            {/* Bank Details */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Реквізити для переказу</h2>
              <div className="space-y-4">
                {Object.entries({
                  Отримувач: bankDetails.recipient,
                  IBAN: bankDetails.iban,
                  Банк: bankDetails.bank,
                  МФО: bankDetails.mfo,
                  ЄДРПОУ: bankDetails.edrpou,
                  "Призначення платежу": bankDetails.purpose,
                }).map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between p-3 border border-border rounded-md">
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">{label}</div>
                      <div className="font-mono text-sm">{value}</div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(value, label)}>
                      {copiedField === label ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Instructions */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-3">Інструкції для переказу</h3>
              <ol className="text-sm text-muted-foreground space-y-2">
                <li>1. Скопіюйте необхідні реквізити</li>
                <li>2. Увійдіть в свій банківський додаток або відвідайте відділення</li>
                <li>3. Оберіть "Переказ на рахунок організації"</li>
                <li>4. Вкажіть суму та призначення платежу</li>
                <li>5. Підтвердіть операцію</li>
              </ol>
            </Card>

            {/* Monthly Support */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-3">Щомісячна підтримка</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Для оформлення регулярної підтримки напишіть нам на пошту з вказанням суми та частоти переказів
              </p>
              <Button asChild variant="outline">
                <a href="mailto:support@vedic-portal.com?subject=Щомісячна підтримка">Написати листа</a>
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
