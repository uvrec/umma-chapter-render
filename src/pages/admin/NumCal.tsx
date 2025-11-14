import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calculator } from "lucide-react";
import { calculateNumCal, isValidBirthDate, formatDate, NumCalResult } from "@/utils/numcal";

const NumCal = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [birthDate, setBirthDate] = useState<string>("");
  const [result, setResult] = useState<NumCalResult | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
    }
  }, [user, isAdmin, navigate]);

  const handleCalculate = () => {
    setError("");
    setResult(null);

    if (!birthDate) {
      setError("Будь ласка, введіть дату народження");
      return;
    }

    const date = new Date(birthDate);

    if (!isValidBirthDate(date)) {
      setError("Невалідна дата народження");
      return;
    }

    const calculatedResult = calculateNumCal(date);
    setResult(calculatedResult);
  };

  const handleReset = () => {
    setBirthDate("");
    setResult(null);
    setError("");
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/dashboard")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад до панелі адміністратора
        </Button>

        <h1 className="text-3xl font-bold mb-2">NumCal - Нумерологічний калькулятор</h1>
        <p className="text-muted-foreground">
          Розрахунок нумерологічних чисел на основі дати народження
        </p>
      </div>

      <div className="grid gap-6">
        {/* Форма введення */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Введіть дату народження
            </CardTitle>
            <CardDescription>
              Формат: день.місяць.рік (наприклад: 07.01.2000)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="birthDate">Дата народження</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="max-w-md"
                />
              </div>

              {error && (
                <div className="text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleCalculate}>
                  Розрахувати
                </Button>
                <Button onClick={handleReset} variant="outline">
                  Скинути
                </Button>
              </div>
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
                  Дата народження: {formatDate(new Date(birthDate))}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6 bg-muted rounded-lg">
                  <div className="text-5xl font-bold mb-2 font-mono">
                    {result.formatted}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Число Розуму - Число Дії - Число Реалізації - Число Підсумку
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Детальна інформація */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Число Розуму (Свідомості)</CardTitle>
                  <CardDescription>
                    Як людина мислить, її бажання та базові характеристики
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">
                    {result.mindNumber}
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>
                      Число Розуму визначає Ваш світогляд, бажання і сприйняття себе
                      та навколишнього світу. Воно відображає Ваші вроджені таланти,
                      схильності та унікальні якості особистості.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Число Дії</CardTitle>
                  <CardDescription>
                    Як людина діє та досягає результатів
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">
                    {result.actionNumber}
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>
                      Число Дії показує, як Ви проявляєте себе в соціумі та
                      взаємодієте з людьми і обставинами для досягнення своїх цілей.
                      Це Ваша головна життєва енергія.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Число Реалізації</CardTitle>
                  <CardDescription>
                    Сфери максимального успіху та реалізації
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">
                    {result.realizationNumber}
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>
                      Число Реалізації розкриває Ваше істинне призначення та місію в
                      цьому житті. Воно вказує на ті сфери діяльності та напрямки,
                      в яких Ви можете найбільш повно реалізувати свої таланти.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Число Підсумку</CardTitle>
                  <CardDescription>
                    Головний життєвий урок та мудрість
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">
                    {result.resultNumber}
                    {result.resultNumberDouble && (
                      <span className="text-lg text-muted-foreground ml-2">
                        ({result.resultNumberDouble})
                      </span>
                    )}
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>
                      Число Підсумку — це Ваш головний життєвий урок та ключ до здобуття
                      мудрості. Воно відображає ту сферу життя, яка викликатиме у Вас
                      найбільший інтерес. Активізується після 40 років.
                    </p>
                    {result.resultNumberDouble && (
                      <p className="mt-2 text-xs">
                        * Двозначне число {result.resultNumberDouble} має значення
                        для детального вивчення шляху
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Цикли розвитку енергії */}
            <Card className="border-2 border-primary/20">
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
            <Card className="border-l-4 border-l-amber-500">
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

            {/* Приклад інтерпретації */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg">Приклад інтерпретації</CardTitle>
                <CardDescription>
                  Загальна характеристика на основі розрахованих чисел
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>
                  <strong>Свідомість ({result.mindNumber}):</strong> Базовий тип мислення
                  та сприйняття світу визначається енергією числа {result.mindNumber}.
                </p>
                <p>
                  <strong>Дії ({result.actionNumber}):</strong> У діях людина проявляє
                  енергію числа {result.actionNumber}, що визначає її стиль досягнення цілей.
                </p>
                <p>
                  <strong>Реалізація ({result.realizationNumber}):</strong> Найкраще
                  реалізується через енергію числа {result.realizationNumber}.
                </p>
                <p>
                  <strong>Підсумок ({result.resultNumber}):</strong> Життя постійно повертає
                  до теми числа {result.resultNumber}, розвиваючи відповідні якості.
                </p>
                <p className="text-xs text-muted-foreground mt-4">
                  Примітка: Детальні описи для кожного числа будуть додані пізніше.
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default NumCal;
