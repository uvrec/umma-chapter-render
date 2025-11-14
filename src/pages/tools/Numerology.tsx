import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateNumCal, isValidBirthDate, formatDate, NumCalResult } from "@/utils/numcal";
import { numberDescriptions } from "@/utils/numberDescriptions";
import { toast } from "@/hooks/use-toast";
import { Calendar } from "lucide-react";

/**
 * NumCal - Нумерологічний калькулятор
 * Розраховує 4 числа за датою народження
 */
const Numerology = () => {
  const [birthDate, setBirthDate] = useState<string>("");
  const [result, setResult] = useState<NumCalResult | null>(null);

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
          Розрахунок чисел за датою народження
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

            {/* Детальні описи чисел */}
            <div className="space-y-6 mt-8">
              <h2 className="text-2xl font-bold">Детальний опис ваших чисел</h2>

              {/* Число Розуму (Свідомості) */}
              {numberDescriptions[result.mindNumber] && (
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="text-xl text-blue-600 dark:text-blue-400">
                      Число Розуму (Свідомості) {result.mindNumber}
                    </CardTitle>
                    <CardDescription>
                      {numberDescriptions[result.mindNumber].birthDates}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="whitespace-pre-line">{numberDescriptions[result.mindNumber].mainDescription}</p>
                    </div>

                    {/* Опис конкретної дати народження */}
                    {numberDescriptions[result.mindNumber].specificDates && (
                      (() => {
                        const birthDay = new Date(birthDate).getDate();
                        const specificDate = numberDescriptions[result.mindNumber].specificDates?.find(
                          (d) => d.date === birthDay
                        );
                        if (specificDate) {
                          return (
                            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                              <h4 className="font-semibold mb-2">Народжені {specificDate.date} числа:</h4>
                              <p className="whitespace-pre-line">{specificDate.description}</p>
                            </div>
                          );
                        }
                        return null;
                      })()
                    )}

                    {numberDescriptions[result.mindNumber].planet && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Планета-покровитель:</h4>
                          <p>{numberDescriptions[result.mindNumber].planet}</p>
                        </div>
                        {numberDescriptions[result.mindNumber].luckyDay && (
                          <div>
                            <h4 className="font-semibold mb-2">Щасливий день:</h4>
                            <p>{numberDescriptions[result.mindNumber].luckyDay}</p>
                          </div>
                        )}
                        {numberDescriptions[result.mindNumber].luckyStone && (
                          <div>
                            <h4 className="font-semibold mb-2">Щасливий камінь:</h4>
                            <p>{numberDescriptions[result.mindNumber].luckyStone}</p>
                          </div>
                        )}
                        {numberDescriptions[result.mindNumber].luckyColor && (
                          <div>
                            <h4 className="font-semibold mb-2">Щасливий колір:</h4>
                            <p>{numberDescriptions[result.mindNumber].luckyColor}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {numberDescriptions[result.mindNumber].karmicTasks && (
                      <div>
                        <h4 className="font-semibold mb-2">Кармічні завдання:</h4>
                        <p>{numberDescriptions[result.mindNumber].karmicTasks}</p>
                      </div>
                    )}

                    {numberDescriptions[result.mindNumber].positiveQualities && (
                      <div>
                        <h4 className="font-semibold mb-2">Позитивні якості:</h4>
                        <div className="flex flex-wrap gap-2">
                          {numberDescriptions[result.mindNumber].positiveQualities?.map((quality, idx) => (
                            <span key={idx} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full text-sm">
                              {quality}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {numberDescriptions[result.mindNumber].negativeQualities && (
                      <div>
                        <h4 className="font-semibold mb-2">Негативні якості (які треба опрацьовувати):</h4>
                        <div className="flex flex-wrap gap-2">
                          {numberDescriptions[result.mindNumber].negativeQualities?.map((quality, idx) => (
                            <span key={idx} className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-full text-sm">
                              {quality}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {numberDescriptions[result.mindNumber].professions && (
                      <div>
                        <h4 className="font-semibold mb-2">Сприятливі професії та сфери діяльності:</h4>
                        <div className="flex flex-wrap gap-2">
                          {numberDescriptions[result.mindNumber].professions?.map((profession, idx) => (
                            <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm">
                              {profession}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {numberDescriptions[result.mindNumber].additionalInfo && (
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="whitespace-pre-line">{numberDescriptions[result.mindNumber].additionalInfo}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Число Дії */}
              {numberDescriptions[result.actionNumber] && (
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="text-xl text-green-600 dark:text-green-400">
                      Число Дії {result.actionNumber}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="whitespace-pre-line">{numberDescriptions[result.actionNumber].mainDescription}</p>
                    </div>

                    {numberDescriptions[result.actionNumber].positiveQualities && (
                      <div>
                        <h4 className="font-semibold mb-2">Позитивні якості:</h4>
                        <div className="flex flex-wrap gap-2">
                          {numberDescriptions[result.actionNumber].positiveQualities?.map((quality, idx) => (
                            <span key={idx} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full text-sm">
                              {quality}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {numberDescriptions[result.actionNumber].negativeQualities && (
                      <div>
                        <h4 className="font-semibold mb-2">Негативні якості (які треба опрацьовувати):</h4>
                        <div className="flex flex-wrap gap-2">
                          {numberDescriptions[result.actionNumber].negativeQualities?.map((quality, idx) => (
                            <span key={idx} className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-full text-sm">
                              {quality}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Число Реалізації */}
              {numberDescriptions[result.realizationNumber] && (
                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="text-xl text-purple-600 dark:text-purple-400">
                      Число Реалізації {result.realizationNumber}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="whitespace-pre-line">{numberDescriptions[result.realizationNumber].mainDescription}</p>
                    </div>

                    {numberDescriptions[result.realizationNumber].positiveQualities && (
                      <div>
                        <h4 className="font-semibold mb-2">Позитивні якості:</h4>
                        <div className="flex flex-wrap gap-2">
                          {numberDescriptions[result.realizationNumber].positiveQualities?.map((quality, idx) => (
                            <span key={idx} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full text-sm">
                              {quality}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {numberDescriptions[result.realizationNumber].negativeQualities && (
                      <div>
                        <h4 className="font-semibold mb-2">Негативні якості (які треба опрацьовувати):</h4>
                        <div className="flex flex-wrap gap-2">
                          {numberDescriptions[result.realizationNumber].negativeQualities?.map((quality, idx) => (
                            <span key={idx} className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-full text-sm">
                              {quality}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Число Підсумку */}
              {numberDescriptions[result.resultNumber] && (
                <Card className="border-l-4 border-l-amber-500">
                  <CardHeader>
                    <CardTitle className="text-xl text-amber-600 dark:text-amber-400">
                      Число Підсумку {result.resultNumber}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="whitespace-pre-line">{numberDescriptions[result.resultNumber].mainDescription}</p>
                    </div>

                    {numberDescriptions[result.resultNumber].positiveQualities && (
                      <div>
                        <h4 className="font-semibold mb-2">Позитивні якості:</h4>
                        <div className="flex flex-wrap gap-2">
                          {numberDescriptions[result.resultNumber].positiveQualities?.map((quality, idx) => (
                            <span key={idx} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full text-sm">
                              {quality}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {numberDescriptions[result.resultNumber].negativeQualities && (
                      <div>
                        <h4 className="font-semibold mb-2">Негативні якості (які треба опрацьовувати):</h4>
                        <div className="flex flex-wrap gap-2">
                          {numberDescriptions[result.resultNumber].negativeQualities?.map((quality, idx) => (
                            <span key={idx} className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-full text-sm">
                              {quality}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Numerology;
