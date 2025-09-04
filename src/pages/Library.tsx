import { Header } from "@/components/Header";

export const Library = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-6">Пояснення</h1>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground mb-4">
              Тут ви знайдете детальні пояснення до ведичних писань та їх коментарі.
            </p>
            <div className="grid gap-4">
              <div className="p-4 border border-border rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Коментарі Шріли Прабгупади</h3>
                <p className="text-sm text-muted-foreground">
                  Детальні пояснення до віршів Бгагавад-гіти та Шрімад-Бгагаватам
                </p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Філософські концепції</h3>
                <p className="text-sm text-muted-foreground">
                  Роз'яснення основних принципів ведичної філософії
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};