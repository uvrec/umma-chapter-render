import { Play, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
interface VerseCardProps {
  verseNumber: string;
  bookName?: string;
  sanskritText: string;
  transliteration?: string;
  synonyms?: string;
  translation: string;
  commentary?: string;
  onPlay: () => void;
  isPlaying: boolean;
}
export const VerseCard = ({
  verseNumber,
  bookName,
  sanskritText,
  transliteration,
  synonyms,
  translation,
  commentary,
  onPlay,
  isPlaying
}: VerseCardProps) => {
  return <Card className="w-full bg-card border-border animate-fade-in">
      <div className="p-6">
        {/* Verse Number and Book */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">{verseNumber}</span>
            </div>
            {bookName && <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                {bookName}
              </span>}
            <Button variant="ghost" size="sm" onClick={onPlay} className={`${isPlaying ? 'text-primary' : 'text-muted-foreground'} hover:text-primary`}>
              <Play className={`w-4 h-4 mr-2 ${isPlaying ? 'fill-current' : ''}`} />
              {isPlaying ? 'Відтворюється' : 'Слухати'}
            </Button>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Sanskrit Text */}
        <div className="mb-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-center text-xl leading-relaxed font-mono text-foreground whitespace-pre-line">
            {sanskritText}
          </p>
        </div>

        {/* Transliteration */}
        {transliteration && <div className="mb-4">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2 text-center">Транслітерація:</h4>
            <p className="italic leading-relaxed whitespace-pre-line text-center text-slate-800 font-medium text-base">
              {transliteration}
            </p>
          </div>}

        {/* Word-for-word synonyms */}
        {synonyms && <div className="mb-4">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2 text-center">Послівний переклад:</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {synonyms}
            </p>
          </div>}

        {/* Literary Translation */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-muted-foreground mb-2 text-center">Літературний переклад:</h4>
          <p className="text-base text-foreground leading-relaxed font-medium">
            О мій Господи! Я шанобливо схиляюся перед Тобою, Шрі Крішно, сину Васудеви, усепроникливий Боже-Особо! Я медитую на Господа Шрі Крішну, тому що Він – Абсолютна Істина, первинна причина всіх причин творення, підтримання та знищення проявлених усесвітів. Він знає, прямо чи непрямо, всі прояви, і Він незалежний, бо немає іншого начала, крім Нього. Саме Він на початку вклав ведичне знання в серце Брахмаджі, першоствореної живої істоти. Він вводить в оману навіть великих мудреців та півбогів, як людину збиває з пантелику оманний образ води, що з'являється у вогні, чи образ землі на воді. Тільки Він – причина того, що тимчасово проявлені через взаємодію трьох ґун природи матеріальні всесвіти видаються справжніми, хоча насправді вони нереальні. Отже, я медитую на Нього, Господа Шрі Крішну, що вічно перебуває у трансцендентній обителі, якої ніколи не торкаються ілюзорні образи матеріального світу. Я медитую на Нього, бо Він – Абсолютна Істина.
          </p>
        </div>

        {/* Prabhupada's Commentary */}
        {commentary && <div className="pt-4 border-t border-border">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2 text-center">Пояснення Шріли Прабгупади:</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Поклони Богові-Особі, Ва̄судеві, прямо вказують на вираження шани Господу Шрі Крішні, божественному сину Васудеви й Девакі. Далі в цій праці це буде зʼясовано докладніше. У цьому ж вірші Шрі Вʼясадева стверджує, що Шрі Крішна – це первинний Бог-Особа, а всі інші – Його безпосередні чи непрямі довершені частки й частки часток. Шріла Джіва Ґосвамі глибше розʼяснив цю тему в «Крішна-сандарбзі». Брахма, першостворена жива істота, теж докладно пояснив усе, що стосується Крішни, в трактаті за назвою «Брахма-самхіта». У «Сама-веда-упанішаді» також сказано, що Господь Шрі Крішна – це божественний син Девакі. Отже, перше твердження цієї молитви таке: Господь Шрі Крішна – відначальний Господь; якщо до Абсолютного Бога-Особи можна застосувати якесь трансцендентне визначення, то це має бути імʼя «Крішна», що означає «всепривабливий». У «Бгаґавад-ґіті» Господь багаторазово стверджує, що Він – відначальний Бог-Особа, і це підтверджують Арджуна та великі мудреці – Нарада, Вʼяса й багато інших. У «Падма Пурані» також зазначено: з-поміж незліченних імен Господа імʼя «Крішна» найголовніше. Імʼя «Ва̄судева» позначає довершену частку Бога-Особи; всі різні подоби Господа, що тотожні Ва̄судеві, також вказані в цьому вірші. Імʼя «Ва̄судева» вказує конкретно на божественного сина Васудеви та Девакі. На Шрі Крішну завжди медитують парамахамси – особ
            </p>
          </div>}
      </div>
    </Card>;
};