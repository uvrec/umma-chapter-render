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
              <span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('ом̇')}`, '_blank')}>ом̇</span> –  	мій Господи;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('намах̣')}`, '_blank')}>намах̣</span> –  	у шанобі схиляюсь;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('бгаґавате')}`, '_blank')}>бгаґавате</span> –  	Богові-Особі;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('ва̄судева̄йа')}`, '_blank')}>ва̄судева̄йа</span> –  	Ва̄судеві (синові Васудеви), Господу Шрі Крішні, відначальному Господеві;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('джанма-а̄ді')}`, '_blank')}>джанма-а̄ді</span> –  	творення, підтримання та знищення;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('асйа')}`, '_blank')}>асйа</span> –  	проявлених усесвітів;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('йатах̣')}`, '_blank')}>йатах̣</span> –  	що з Нього;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('анвайа̄т')}`, '_blank')}>анвайа̄т</span> –  	прямо;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('ітаратах̣')}`, '_blank')}>ітаратах̣</span> –  	непрямо;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('ча')}`, '_blank')}>ча</span> –  	і;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('артхешу')}`, '_blank')}>артхешу</span> –  	цілях;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('абгіджн̃ах̣')}`, '_blank')}>абгіджн̃ах̣</span> –  	повністю свідомий;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('сва-ра̄т̣')}`, '_blank')}>сва-ра̄т̣</span> –  	цілковито незалежний;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('тене')}`, '_blank')}>тене</span> –  	вклав;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('брахма')}`, '_blank')}>брахма</span> –  	ведичне знання;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('хр̣да̄')}`, '_blank')}>хр̣да̄</span> –  	свідомість серця;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('йах̣')}`, '_blank')}>йах̣</span> –  	той, котрий;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('а̄ді-кавайе')}`, '_blank')}>а̄ді-кавайе</span> –  	первісній живій істоті;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('мухйанті')}`, '_blank')}>мухйанті</span> –  	введені в оману;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('йат')}`, '_blank')}>йат</span> –  	що про Нього;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('сӯрайах̣')}`, '_blank')}>сӯрайах̣</span> –  	великі мудреці та півбоги;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('теджах̣')}`, '_blank')}>теджах̣</span> –  	вогонь;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('ва̄рі')}`, '_blank')}>ва̄рі</span> –  	вода;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('мр̣да̄м')}`, '_blank')}>мр̣да̄м</span> –  	земля;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('йатха̄')}`, '_blank')}>йатха̄</span> –  	так само;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('вінімайах̣')}`, '_blank')}>вінімайах̣</span> –  	дія та протидія;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('йатра')}`, '_blank')}>йатра</span> –  	звідки;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('трі-сарґах̣')}`, '_blank')}>трі-сарґах̣</span> –  	три ґуни творення, твірні сили;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('амр̣ша̄')}`, '_blank')}>амр̣ша̄</span> –  	мов справжні;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('дга̄мна̄')}`, '_blank')}>дга̄мна̄</span> –  	разом з усіма трансцендентними атрибутами;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('свена')}`, '_blank')}>свена</span> –  	самодостатньо;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('сада̄')}`, '_blank')}>сада̄</span> –  	завжди;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('ніраста')}`, '_blank')}>ніраста</span> –  	заперечення через відсутність;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('кухакам')}`, '_blank')}>кухакам</span> –  	ілюзії;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('сатйам')}`, '_blank')}>сатйам</span> –  	істину;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('парам')}`, '_blank')}>парам</span> –  	абсолютну;   	<span className="cursor-pointer text-primary hover:underline" onClick={() => window.open(`/glossary?search=${encodeURIComponent('дгīмахі')}`, '_blank')}>дгīмахі</span> –  	я медитую на.
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