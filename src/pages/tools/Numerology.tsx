import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateNumCal, isValidBirthDate, formatDate, NumCalResult } from "@/utils/numcal";
import { numberDescriptions, actionNumberDescriptions, realizationNumberDescriptions, resultNumberDescriptions, lastYearDigitDescriptions, personalYearDescriptions, personalMonthDescriptions, personalDayDescriptions } from "@/utils/numberDescriptions";
import { toast } from "@/hooks/use-toast";
import { Calendar } from "lucide-react";
import { trackNumerologyCalculation } from "@/services/numerologyTracking";

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

    trackNumerologyCalculation({
      tool_type: "numcal",
      birth_date: birthDate,
      mind_number: calculatedResult.mindNumber,
      action_number: calculatedResult.actionNumber,
      realization_number: calculatedResult.realizationNumber,
      result_number: calculatedResult.resultNumber,
      formatted: calculatedResult.formatted,
    });

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
        <div className="mb-8">
          <div>
            <h3 className="text-lg font-semibold">Введіть дату народження</h3>
            <p className="text-sm text-muted-foreground">
              Оберіть дату для розрахунку нумерологічних чисел
            </p>
          </div>
          <div>
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
          </div>
        </div>

        {/* Результати */}
        {result && (
          <>
            <div className="border-primary">
              <div>
                <h3 className="text-lg font-semibold">Результат</h3>
                <p className="text-sm text-muted-foreground">
                  Дата народження: {birthDate.split('-').reverse().join('.')}
                </p>
              </div>
              <div>
                <div className="text-center p-6 bg-muted rounded-lg">
                  <div className="text-5xl font-bold mb-2 font-mono">
                    {result.formatted}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {result.mindNumber} - {result.actionNumber} - {result.realizationNumber} - {result.resultNumber}
                  </div>
                </div>
              </div>
            </div>

            {/* Пояснення чисел */}
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {/* Число Розуму */}
              <div>
                <div>
                  <h3 className="text-lg font-semibold">Число Розуму (Свідомості)</h3>
                  <p className="text-sm text-muted-foreground">День народження</p>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-4 text-primary">
                    {result.mindNumber}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Розраховується як день народження, зведений до однієї цифри.
                    Показує вашу природну схильність до мислення та сприйняття світу.
                  </p>
                </div>
              </div>

              {/* Число Дії */}
              <div>
                <div>
                  <h3 className="text-lg font-semibold">Число Дії</h3>
                  <p className="text-sm text-muted-foreground">Сума всіх цифр дати</p>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-4 text-primary">
                    {result.actionNumber}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Сума всіх цифр дати народження, зведена до однієї цифри.
                    Відображає вашу енергію дії та те, як ви діє в світі.
                  </p>
                </div>
              </div>

              {/* Число Реалізації */}
              <div>
                <div>
                  <h3 className="text-lg font-semibold">Число Реалізації</h3>
                  <p className="text-sm text-muted-foreground">Розум + Дія</p>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-4 text-primary">
                    {result.realizationNumber}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Сума Числа Розуму та Числа Дії.
                    Показує, як ви можете реалізувати свій потенціал у житті.
                  </p>
                </div>
              </div>

              {/* Число Підсумку */}
              <div>
                <div>
                  <h3 className="text-lg font-semibold">Число Підсумку</h3>
                  <p className="text-sm text-muted-foreground">Загальна сума всіх трьох чисел</p>
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-4xl font-bold text-primary">
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
                </div>
              </div>
            </div>

            {/* Цикли розвитку енергії */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-2">Цикли розвитку енергії</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Кожна енергія розвивається через проходження трьох етапів (+3 на кожному кроці)
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Цикл Розуму */}
                <div>
                  <h4 className="font-semibold mb-2">Цикл розвитку Розуму</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-primary">
                      {result.cycles.mind.numbers[0]}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-2xl font-bold text-primary">
                      {result.cycles.mind.numbers[1]}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-2xl font-bold text-primary">
                      {result.cycles.mind.numbers[2]}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-2xl font-bold text-primary">
                      {result.cycles.mind.numbers[0]}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {result.cycles.mind.description}
                  </p>
                </div>

                {/* Цикл Дії */}
                <div>
                  <h4 className="font-semibold mb-2">Цикл розвитку Дії</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-primary">
                      {result.cycles.action.numbers[0]}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-2xl font-bold text-primary">
                      {result.cycles.action.numbers[1]}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-2xl font-bold text-primary">
                      {result.cycles.action.numbers[2]}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-2xl font-bold text-primary">
                      {result.cycles.action.numbers[0]}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {result.cycles.action.description}
                  </p>
                </div>

                {/* Цикл Реалізації */}
                <div>
                  <h4 className="font-semibold mb-2">Цикл розвитку Реалізації</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-primary">
                      {result.cycles.realization.numbers[0]}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-2xl font-bold text-primary">
                      {result.cycles.realization.numbers[1]}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-2xl font-bold text-primary">
                      {result.cycles.realization.numbers[2]}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-2xl font-bold text-primary">
                      {result.cycles.realization.numbers[0]}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {result.cycles.realization.description}
                  </p>
                </div>

                {/* Цикл Підсумку */}
                <div>
                  <h4 className="font-semibold mb-2">Цикл розвитку Підсумку</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-primary">
                      {result.cycles.result.numbers[0]}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-2xl font-bold text-primary">
                      {result.cycles.result.numbers[1]}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-2xl font-bold text-primary">
                      {result.cycles.result.numbers[2]}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-2xl font-bold text-primary">
                      {result.cycles.result.numbers[0]}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {result.cycles.result.description}
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mt-4">
                <strong>Як працюють цикли:</strong> Кожна енергія розвивається, проходячи три етапи.
                На кожному етапі до числа додається +3, і результат зводиться до однієї цифри.
                Після третього кроку цикл повертається до початкового числа, але вже з новими якостями,
                набутими на попередніх етапах.
              </p>
            </div>

            {/* Життєве завдання - Остання цифра року */}
            {lastYearDigitDescriptions[result.lastYearDigit] && (
              <div className="mt-8">
                <h3 className="text-2xl font-semibold mb-1">
                  Ваше Життєве Завдання
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Остання цифра року народження: <strong className="text-primary">{result.lastYearDigit}</strong>
                </p>

                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h4 className="text-xl font-bold text-primary mb-2">
                      {lastYearDigitDescriptions[result.lastYearDigit].title}
                    </h4>
                    <p className="text-muted-foreground">
                      {lastYearDigitDescriptions[result.lastYearDigit].mainDescription}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Позитивні аспекти</h4>
                      <p className="text-sm text-muted-foreground">{lastYearDigitDescriptions[result.lastYearDigit].positiveAspects}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Негативні аспекти</h4>
                      <p className="text-sm text-muted-foreground">{lastYearDigitDescriptions[result.lastYearDigit].negativeAspects}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Життєвий урок</h4>
                    <p className="text-sm text-muted-foreground">{lastYearDigitDescriptions[result.lastYearDigit].lifeLesson}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Підказка для гармонізації</h4>
                    <p className="text-sm text-muted-foreground italic">{lastYearDigitDescriptions[result.lastYearDigit].nextStepHint}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Грошовий код */}
            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-1">
                Ваш Грошовий Код
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Особистий 4-цифровий код для фінансового успіху
              </p>

              <div className="space-y-4">
                <div className="text-center mb-4">
                  <div className="text-5xl font-bold text-primary mb-2 tracking-wider font-mono">
                    {result.moneyCode.code}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Цей код розраховано з вашої дати народження
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary mb-1">
                      {result.moneyCode.digit1}
                    </div>
                    <p className="text-xs text-muted-foreground">День</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary mb-1">
                      {result.moneyCode.digit2}
                    </div>
                    <p className="text-xs text-muted-foreground">Місяць</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary mb-1">
                      {result.moneyCode.digit3}
                    </div>
                    <p className="text-xs text-muted-foreground">Рік</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary mb-1">
                      {result.moneyCode.digit4}
                    </div>
                    <p className="text-xs text-muted-foreground">Сума</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Як використовувати грошовий код?</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Використовуйте як PIN-код для банківських карток</li>
                    <li>Встановіть як пароль для фінансових додатків</li>
                    <li>Використовуйте в номерах телефонів або адресах</li>
                    <li>Медитуйте на ці цифри під час фінансових рішень</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Персональні цикли */}
            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-1">
                Ваші Персональні Цикли
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Енергія поточного року, місяця та дня
              </p>

              <div className="space-y-6">
                {/* Персональний рік */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold">
                      Персональний Рік
                    </h4>
                    <span className="text-3xl font-bold text-primary">
                      {result.personalYear}
                    </span>
                  </div>
                  <h5 className="font-semibold mb-1">
                    {personalYearDescriptions[result.personalYear].title}
                  </h5>
                  <p className="text-sm text-muted-foreground mb-2 whitespace-pre-line">
                    {personalYearDescriptions[result.personalYear].description}
                  </p>
                  <p className="text-sm">
                    <strong>Рекомендації:</strong> {personalYearDescriptions[result.personalYear].recommendations}
                  </p>
                </div>

                {/* Персональний місяць */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold">
                      Персональний Місяць
                    </h4>
                    <span className="text-3xl font-bold text-primary">
                      {result.personalMonth}
                    </span>
                  </div>
                  <h5 className="font-semibold mb-1">
                    {personalMonthDescriptions[result.personalMonth].title}
                  </h5>
                  <p className="text-sm text-muted-foreground mb-2 whitespace-pre-line">
                    {personalMonthDescriptions[result.personalMonth].description}
                  </p>
                  <p className="text-sm">
                    <strong>Рекомендації:</strong> {personalMonthDescriptions[result.personalMonth].recommendations}
                  </p>
                </div>

                {/* Персональний день */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold">
                      Персональний День
                    </h4>
                    <span className="text-3xl font-bold text-primary">
                      {result.personalDay}
                    </span>
                  </div>
                  <h5 className="font-semibold mb-1">
                    {personalDayDescriptions[result.personalDay].title}
                  </h5>
                  <p className="text-sm text-muted-foreground mb-2 whitespace-pre-line">
                    {personalDayDescriptions[result.personalDay].description}
                  </p>
                  <p className="text-sm">
                    <strong>Рекомендації на сьогодні:</strong> {personalDayDescriptions[result.personalDay].recommendations}
                  </p>
                </div>

                <p className="text-sm text-muted-foreground">
                  <strong>Про персональні цикли:</strong> Кожен рік, місяць та день має свою унікальну енергію, яка впливає на ваше життя.
                  Персональний рік показує загальну енергію всього року (цикл з 9 років).
                  Персональний місяць показує енергію поточного місяця в контексті вашого року.
                  Персональний день показує енергію сьогоднішнього дня та підказує, чим краще займатися.
                </p>
              </div>
            </div>

            {/* Детальні описи чисел */}
            <div className="space-y-8 mt-8">
              <h2 className="text-2xl font-bold">Детальний опис ваших чисел</h2>

              {/* Число Розуну (Свідомості) */}
              {numberDescriptions[result.mindNumber] && (
                <div className="border-l-2 border-l-primary pl-4">
                  <h3 className="text-xl font-semibold text-primary">
                    Число Розуму (Свідомості) {result.mindNumber}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {numberDescriptions[result.mindNumber].birthDates}
                  </p>

                  <div className="space-y-4">
                    <p className="whitespace-pre-line">{numberDescriptions[result.mindNumber].mainDescription}</p>

                    {/* Опис конкретної дати народження */}
                    {numberDescriptions[result.mindNumber].specificDates && (
                      (() => {
                        const birthDay = new Date(birthDate).getDate();
                        const specificDate = numberDescriptions[result.mindNumber].specificDates?.find(
                          (d) => d.date === birthDay
                        );
                        if (specificDate) {
                          return (
                            <div>
                              <h4 className="font-semibold mb-1">Народжені {specificDate.date} числа:</h4>
                              <p className="text-muted-foreground whitespace-pre-line">{specificDate.description}</p>
                            </div>
                          );
                        }
                        return null;
                      })()
                    )}

                    {numberDescriptions[result.mindNumber].planet && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-1">Планета-покровитель:</h4>
                          <p className="text-muted-foreground">{numberDescriptions[result.mindNumber].planet}</p>
                        </div>
                        {numberDescriptions[result.mindNumber].luckyDay && (
                          <div>
                            <h4 className="font-semibold mb-1">Щасливий день:</h4>
                            <p className="text-muted-foreground">{numberDescriptions[result.mindNumber].luckyDay}</p>
                          </div>
                        )}
                        {numberDescriptions[result.mindNumber].luckyStone && (
                          <div>
                            <h4 className="font-semibold mb-1">Щасливий камінь:</h4>
                            <p className="text-muted-foreground">{numberDescriptions[result.mindNumber].luckyStone}</p>
                          </div>
                        )}
                        {numberDescriptions[result.mindNumber].luckyColor && (
                          <div>
                            <h4 className="font-semibold mb-1">Щасливий колір:</h4>
                            <p className="text-muted-foreground">{numberDescriptions[result.mindNumber].luckyColor}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {numberDescriptions[result.mindNumber].karmicTasks && (
                      <div>
                        <h4 className="font-semibold mb-1">Кармічні завдання:</h4>
                        <p className="text-muted-foreground">{numberDescriptions[result.mindNumber].karmicTasks}</p>
                      </div>
                    )}

                    {numberDescriptions[result.mindNumber].positiveQualities && (
                      <div>
                        <h4 className="font-semibold mb-2">Позитивні якості:</h4>
                        <p className="text-sm text-muted-foreground">
                          {numberDescriptions[result.mindNumber].positiveQualities?.join(' • ')}
                        </p>
                      </div>
                    )}

                    {numberDescriptions[result.mindNumber].negativeQualities && (
                      <div>
                        <h4 className="font-semibold mb-2">Негативні якості (які треба опрацьовувати):</h4>
                        <p className="text-sm text-muted-foreground">
                          {numberDescriptions[result.mindNumber].negativeQualities?.join(' • ')}
                        </p>
                      </div>
                    )}

                    {numberDescriptions[result.mindNumber].professions && (
                      <div>
                        <h4 className="font-semibold mb-2">Сприятливі професії та сфери діяльності:</h4>
                        <p className="text-sm text-muted-foreground">
                          {numberDescriptions[result.mindNumber].professions?.join(' • ')}
                        </p>
                      </div>
                    )}

                    {numberDescriptions[result.mindNumber].additionalInfo && (
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{numberDescriptions[result.mindNumber].additionalInfo}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Число Дії */}
              {actionNumberDescriptions[result.actionNumber] && (
                <div className="border-l-2 border-l-primary pl-4">
                  <h3 className="text-xl font-semibold text-primary mb-4">
                    Число Дії {result.actionNumber}
                  </h3>

                  <div className="space-y-4">
                    <p className="whitespace-pre-line">{actionNumberDescriptions[result.actionNumber].mainDescription}</p>

                    {actionNumberDescriptions[result.actionNumber].positiveQualities && (
                      <div>
                        <h4 className="font-semibold mb-2">Позитивні якості:</h4>
                        <p className="text-sm text-muted-foreground">
                          {actionNumberDescriptions[result.actionNumber].positiveQualities?.join(' • ')}
                        </p>
                      </div>
                    )}

                    {actionNumberDescriptions[result.actionNumber].negativeQualities && (
                      <div>
                        <h4 className="font-semibold mb-2">Негативні якості (які треба опрацьовувати):</h4>
                        <p className="text-sm text-muted-foreground">
                          {actionNumberDescriptions[result.actionNumber].negativeQualities?.join(' • ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Число Реалізації */}
              {realizationNumberDescriptions[result.realizationNumber] && (
                <div className="border-l-2 border-l-primary pl-4">
                  <h3 className="text-xl font-semibold text-primary mb-4">
                    Число Реалізації {result.realizationNumber}
                  </h3>

                  <div className="space-y-4">
                    <p className="whitespace-pre-line">{realizationNumberDescriptions[result.realizationNumber].mainDescription}</p>

                    {realizationNumberDescriptions[result.realizationNumber].positiveQualities && (
                      <div>
                        <h4 className="font-semibold mb-2">Позитивні якості:</h4>
                        <p className="text-sm text-muted-foreground">
                          {realizationNumberDescriptions[result.realizationNumber].positiveQualities?.join(' • ')}
                        </p>
                      </div>
                    )}

                    {realizationNumberDescriptions[result.realizationNumber].negativeQualities && (
                      <div>
                        <h4 className="font-semibold mb-2">Негативні якості (які треба опрацьовувати):</h4>
                        <p className="text-sm text-muted-foreground">
                          {realizationNumberDescriptions[result.realizationNumber].negativeQualities?.join(' • ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Число Підсумку */}
              {resultNumberDescriptions[result.resultNumber] && (
                <div className="border-l-2 border-l-primary pl-4">
                  <h3 className="text-xl font-semibold text-primary mb-4">
                    Число Підсумку {result.resultNumber}
                  </h3>

                  <div className="space-y-4">
                    <p className="whitespace-pre-line">{resultNumberDescriptions[result.resultNumber].mainDescription}</p>

                    {resultNumberDescriptions[result.resultNumber].positiveQualities && (
                      <div>
                        <h4 className="font-semibold mb-2">Позитивні якості:</h4>
                        <p className="text-sm text-muted-foreground">
                          {resultNumberDescriptions[result.resultNumber].positiveQualities?.join(' • ')}
                        </p>
                      </div>
                    )}

                    {resultNumberDescriptions[result.resultNumber].negativeQualities && (
                      <div>
                        <h4 className="font-semibold mb-2">Негативні якості (які треба опрацьовувати):</h4>
                        <p className="text-sm text-muted-foreground">
                          {resultNumberDescriptions[result.resultNumber].negativeQualities?.join(' • ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
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
