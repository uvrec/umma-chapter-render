import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateNumCal, isValidBirthDate, formatDate, NumCalResult } from "@/utils/numcal";
import { toast } from "@/hooks/use-toast";
import { Calendar } from "lucide-react";

/**
 * NumCal - Нумерологічний калькулятор (ТІЛЬКИ для авторизованих користувачів)
 * Розраховує 4 числа за датою народження
 */
const Numerology = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [birthDate, setBirthDate] = useState<string>("");
  const [result, setResult] = useState<NumCalResult | null>(null);

  // ⚠️ КРИТИЧНО: Перевірка авторизації - тільки для залогінених користувачів
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const handleCalculate = () => {
    if (!birthDate) {
      toast({
        title: "Помилка",
        description: "Будь ласка, введіть дату народження",
        variant: "destructive",
      });
      return;
    }

    const date = new Date(birthDate);
    if (!isValidBirthDate(date)) {
      toast({
        title: "Помилка",
        description: "Неправільна дата народження",
        variant: "destructive",
      });
      return;
    }

    const calculatedResult = calculateNumCal(date);
    setResult(calculatedResult);

    toast({
      title: "Розрахунок виконано",
      description: `Ваші числа: ${calculatedResult.formatted}`,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-2">NumCal - Нумерологічний калькулятор</h1>
        <p className="text-muted-foreground mb-8">
          Розрахунок чисел за датою народження (доступ тільки для авторизованих користувачів)
        </p>

        {/* Форма вводу */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Введіть дату народження</CardTitle>
            <CardDescription>
              Оберіть дату для розрахунку нумерологічних чисел
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="birthDate">Дата народження</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="mt-2"
                />
              </div>
              <Button onClick={handleCalculate} size="lg">
                <Calendar className="mr-2 h-4 w-4" />
                Розрахувати
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Результати */}
        {result && (
          <>
            <Card className="border-primary">
              <CardHeader>
                <CardTitle>Результат</CardTitle>
                <CardDescription>
                  Дата народження: {birthDate.split('-').reverse().join('.')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6 bg-muted rounded-lg">
                  <div className="text-5xl font-bold mb-2 font-mono">
                    {result.formatted}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {result.mindNumber} - {result.actionNumber} - {result.realizationNumber} - {result.resultNumber}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Пояснення чисел */}
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {/* Число Розуму */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Число Розуму (Свідомості)</CardTitle>
                  <CardDescription>День народження</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-4 text-blue-600 dark:text-blue-400">
                    {result.mindNumber}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Розраховується як день народження, зведений до однієї цифри.
                    Показує вашу природну схильність до мислення та сприйняття світу.
                  </p>
                </CardContent>
              </Card>

              {/* Число Дії */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Число Дії</CardTitle>
                  <CardDescription>Сума всіх цифр дати</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-4 text-green-600 dark:text-green-400">
                    {result.actionNumber}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Сума всіх цифр дати народження, зведена до однієї цифри.
                    Відображає вашу енергію дії та те, як ви діє в світі.
                  </p>
                </CardContent>
              </Card>

              {/* Число Реалізації */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Число Реалізації</CardTitle>
                  <CardDescription>Розум + Дія</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-4 text-purple-600 dark:text-purple-400">
                    {result.realizationNumber}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Сума Числа Розуму та Числа Дії.
                    Показує, як ви можете реалізувати свій потенціал у житті.
                  </p>
                </CardContent>
              </Card>

              {/* Число Підсумку */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Число Підсумку</CardTitle>
                  <CardDescription>Загальна сума всіх трьох чисел</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <div className="text-4xl font-bold text-amber-600 dark:text-amber-400">
                      {result.resultNumber}
                    </div>
                    {result.resultNumberDouble && (
                      <div className="text-xl text-muted-foreground">
                        (з {result.resultNumberDouble})
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Сума всіх трьох чисел, зведена до однієї цифри.
                    Відображає загальний підсумок вашого життєвого шляху.
                    {result.resultNumberDouble && (
                      <span className="block mt-2 text-xs">
                        Двозначне число ({result.resultNumberDouble}) зберігається
                        для детального вивчення шляху
                      </span>
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Цикли розвитку енергії */}
            <Card className="border-2 border-primary/20 mt-6">
              <CardHeader>
                <CardTitle className="text-xl">Цикли розвитку енергії</CardTitle>
                <CardDescription>
                  Кожна енергія розвивається через проходження трьох етапів (+3 на кожному кроці)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Цикл Розуму */}
                  <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                    <h4 className="font-semibold mb-2">Цикл розвитку Розуму</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {result.cycles.mind.numbers[0]}
                      </span>
                      <span className="text-lg">→</span>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {result.cycles.mind.numbers[1]}
                      </span>
                      <span className="text-lg">→</span>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {result.cycles.mind.numbers[2]}
                      </span>
                      <span className="text-lg">→</span>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {result.cycles.mind.numbers[0]}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {result.cycles.mind.description}
                    </p>
                  </div>

                  {/* Цикл Дії */}
                  <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                    <h4 className="font-semibold mb-2">Цикл розвитку Дії</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {result.cycles.action.numbers[0]}
                      </span>
                      <span className="text-lg">→</span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {result.cycles.action.numbers[1]}
                      </span>
                      <span className="text-lg">→</span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {result.cycles.action.numbers[2]}
                      </span>
                      <span className="text-lg">→</span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {result.cycles.action.numbers[0]}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {result.cycles.action.description}
                    </p>
                  </div>

                  {/* Цикл Реалізації */}
                  <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                    <h4 className="font-semibold mb-2">Цикл розвитку Реалізації</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {result.cycles.realization.numbers[0]}
                      </span>
                      <span className="text-lg">→</span>
                      <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {result.cycles.realization.numbers[1]}
                      </span>
                      <span className="text-lg">→</span>
                      <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {result.cycles.realization.numbers[2]}
                      </span>
                      <span className="text-lg">→</span>
                      <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {result.cycles.realization.numbers[0]}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {result.cycles.realization.description}
                    </p>
                  </div>

                  {/* Цикл Підсумку */}
                  <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
                    <h4 className="font-semibold mb-2">Цикл розвитку Підсумку</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {result.cycles.result.numbers[0]}
                      </span>
                      <span className="text-lg">→</span>
                      <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {result.cycles.result.numbers[1]}
                      </span>
                      <span className="text-lg">→</span>
                      <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {result.cycles.result.numbers[2]}
                      </span>
                      <span className="text-lg">→</span>
                      <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {result.cycles.result.numbers[0]}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {result.cycles.result.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>Як працюють цикли:</strong> Кожна енергія розвивається, проходячи три етапи.
                    На кожному етапі до числа додається +3, і результат зводиться до однієї цифри.
                    Після третього кроку цикл повертається до початкового числа, але вже з новими якостями,
                    набутими на попередніх етапах.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Детальне пояснення циклів */}
            <Card className="border-l-4 border-l-amber-500 mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Розвиток через цикли: практичне застосування</CardTitle>
                <CardDescription>
                  Приклади того, як набуття якостей інших чисел у циклі допомагає розкрити потенціал
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {/* Приклад з Числом Дії 8 */}
                <div className="p-4 border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/20 rounded-r">
                  <h5 className="font-semibold mb-2 text-green-800 dark:text-green-300">
                    Приклад: Розвиток Числа Дії 8 → 2 → 5 → 8
                  </h5>
                  <p className="mb-2">
                    <strong>Початкова проблема:</strong> Людина з Числом Дії 8 часто має проблеми з контролем,
                    не хоче ділитися ресурсами та роботою з іншими людьми, намагається все робити сама через
                    недовіру до людей. Це призводить до трудоголізму та зниження ефективності.
                  </p>
                  <p className="mb-2">
                    <strong>Шлях розвитку:</strong> Щоб розвинути своє Число Дії, потрібно набути:
                  </p>
                  <ul className="list-disc ml-6 mb-2 space-y-1">
                    <li><strong>Якості числа 2:</strong> довіра та делегування</li>
                    <li><strong>Якості числа 5:</strong> комунікація та розширення</li>
                  </ul>
                  <p>
                    <strong>Результат:</strong> З допомогою цих якостей людина може створити сильну команду,
                    що приведе до розширення та багаторазового зростання доходів. Розкриваються найкращі
                    якості Числа Дії 8: успіх у матеріальному світі, грамотний контроль, стратегія та управління.
                  </p>
                </div>

                {/* Приклад з Числом Реалізації 6 */}
                <div className="p-4 border-l-4 border-l-purple-500 bg-purple-50/50 dark:bg-purple-950/20 rounded-r">
                  <h5 className="font-semibold mb-2 text-purple-800 dark:text-purple-300">
                    Приклад: Розвиток Числа Реалізації 6 → 9 → 3 → 6
                  </h5>
                  <p className="mb-2">
                    <strong>Початкова проблема:</strong> Людина з Числом Реалізації 6 може мати великі проблеми
                    з доведенням справ до кінця, а через тягу до постійних задоволень життя може бути погано
                    організоване.
                  </p>
                  <p className="mb-2">
                    <strong>Шлях розвитку:</strong> Щоб правильно розвивати свою реалізацію, потрібно набути:
                  </p>
                  <ul className="list-disc ml-6 mb-2 space-y-1">
                    <li><strong>Якості числа 9:</strong> доведення справ до кінця та дисципліна</li>
                    <li><strong>Якості числа 3:</strong> отримання нових знань та організованість</li>
                  </ul>
                  <p>
                    <strong>Результат:</strong> Тільки в цьому випадку мудрі та творчі ідеї Числа Реалізації 6
                    будуть втілені в життя, і людина зможе задовольнятися результатами своїх дій
                    (тобто стане реалізованим творцем).
                  </p>
                </div>

                {/* Важливе застереження */}
                <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <h5 className="font-semibold mb-2 text-destructive">⚠️ Важливо: позитивний VS негативний розвиток</h5>
                  <p className="mb-2">
                    Ваші цикли можуть розвиватися <strong>позитивно</strong> або <strong>негативно</strong>.
                  </p>
                  <p className="mb-2">
                    <strong>Негативний приклад:</strong> Число Розуму 7 може піти в самотність та відстороненість
                    (негативні якості цифри 1), що призводить до емоційного руйнування та депресії
                    (негативні якості цифри 4).
                  </p>
                  <p className="font-semibold">
                    Якщо людина не розвивається всередині циклу через позитивні якості, вона автоматично
                    розкриває негативні якості кожної цифри. Тому так важливо знати свої цикли свідомості,
                    дії та реалізації — у Вас з'являється здатність самостійно контролювати події у своєму житті.
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Numerology;
