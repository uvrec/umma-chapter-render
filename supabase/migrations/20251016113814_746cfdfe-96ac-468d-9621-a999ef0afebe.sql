-- Add sample blog posts for demonstration purposes
-- This migration inserts sample blog posts to populate the blog page

-- Insert sample blog posts only if the blog_posts table is empty
DO $$
DECLARE
  category_news_id UUID;
  category_articles_id UUID;
  category_philosophy_id UUID;
BEGIN
  -- Get category IDs (they should exist from previous migration)
  SELECT id INTO category_news_id FROM blog_categories WHERE slug = 'news' LIMIT 1;
  SELECT id INTO category_articles_id FROM blog_categories WHERE slug = 'articles' LIMIT 1;
  SELECT id INTO category_philosophy_id FROM blog_categories WHERE slug = 'philosophy' LIMIT 1;

  -- Only insert sample posts if table is empty
  IF NOT EXISTS (SELECT 1 FROM blog_posts LIMIT 1) THEN
    -- Sample post 1: Welcome post
    INSERT INTO blog_posts (
      title_ua,
      title_en,
      slug,
      content_ua,
      content_en,
      excerpt_ua,
      excerpt_en,
      category_id,
      is_published,
      published_at,
      author_display_name,
      read_time,
      view_count
    ) VALUES (
      'Ласкаво просимо до нашого духовного блогу',
      'Welcome to our spiritual blog',
      'welcome-to-spiritual-blog',
      '<p>Дорогі друзі!</p><p>Ми раді вітати вас на сторінках нашого духовного блогу. Тут ви знайдете статті, роздуми та практичні поради на шляху духовного розвитку.</p><p>Наша мета — допомогти вам глибше зрозуміти ведичну мудрість та застосувати її у повсякденному житті. Ми прагнемо створити простір, де кожен зможе знайти натхнення та підтримку на своєму духовному шляху.</p><p>Слідкуйте за оновленнями та діліться своїми думками в коментарях!</p>',
      '<p>Dear friends!</p><p>We are glad to welcome you to our spiritual blog. Here you will find articles, reflections and practical advice on the path of spiritual development.</p><p>Our goal is to help you better understand Vedic wisdom and apply it in everyday life. We strive to create a space where everyone can find inspiration and support on their spiritual path.</p><p>Stay tuned for updates and share your thoughts in the comments!</p>',
      'Вітальна стаття нашого духовного блогу. Дізнайтеся про наші цілі та плани.',
      'Welcome article to our spiritual blog. Learn about our goals and plans.',
      category_news_id,
      true,
      now() - interval '2 days',
      'Адміністратор',
      3,
      145
    );

    -- Sample post 2: Bhagavad Gita insights
    INSERT INTO blog_posts (
      title_ua,
      title_en,
      slug,
      content_ua,
      content_en,
      excerpt_ua,
      excerpt_en,
      category_id,
      is_published,
      published_at,
      author_display_name,
      read_time,
      view_count
    ) VALUES (
      'Уроки з Бгагавад-гіти: Шлях до внутрішнього спокою',
      'Lessons from Bhagavad Gita: Path to Inner Peace',
      'bhagavad-gita-inner-peace',
      '<p>Бгагавад-гіта — це вічне джерело мудрості, яке допомагає нам знайти внутрішній спокій у сучасному світі.</p><p>У цій священній книзі Господь Крішна пояснює Арджуні, як зберігати рівновагу розуму навіть у найскладніших обставинах. Ключ до цього — розуміння свого справжнього "я" та своєї природи як вічної душі.</p><p>Одна з найважливіших настанов — це практика карма-йоги, коли ми виконуємо свої обов''язки без прив''язаності до результатів. Така практика допомагає звільнитися від стресу та тривоги, які часто виникають через надмірні очікування.</p>',
      '<p>The Bhagavad Gita is an eternal source of wisdom that helps us find inner peace in the modern world.</p><p>In this sacred book, Lord Krishna explains to Arjuna how to maintain mental equilibrium even in the most difficult circumstances. The key to this is understanding one''s true self and one''s nature as an eternal soul.</p><p>One of the most important teachings is the practice of karma-yoga, where we perform our duties without attachment to results. This practice helps to free ourselves from stress and anxiety that often arise from excessive expectations.</p>',
      'Дізнайтеся, як настанови Бгагавад-гіти можуть допомогти знайти внутрішній спокій у повсякденному житті.',
      'Learn how the teachings of the Bhagavad Gita can help find inner peace in everyday life.',
      category_articles_id,
      true,
      now() - interval '5 days',
      'Адміністратор',
      5,
      278
    );

    -- Sample post 3: Meditation practice
    INSERT INTO blog_posts (
      title_ua,
      title_en,
      slug,
      content_ua,
      content_en,
      excerpt_ua,
      excerpt_en,
      category_id,
      is_published,
      published_at,
      author_display_name,
      read_time,
      view_count
    ) VALUES (
      'Практика медитації: З чого почати',
      'Meditation Practice: Where to Start',
      'meditation-practice-beginners',
      '<p>Медитація — це потужний інструмент для розвитку свідомості та досягнення внутрішнього спокою. Але з чого почати тим, хто вперше стикається з цією практикою?</p><p>Найпростіший спосіб — це мантра-медитація. У ведичній традиції рекомендується повторення Маха-мантри: Харе Крішна, Харе Крішна, Крішна Крішна, Харе Харе / Харе Рама, Харе Рама, Рама Рама, Харе Харе.</p><p>Почніть з 5-10 хвилин щодня, знайдіть тихе місце, де вас ніхто не потурбує. Сидіть зручно, закрийте очі і повторюйте мантру вголос або пошепки. Не турбуйтеся, якщо розум блукає — це нормально для початківців. Просто повертайте увагу до мантри.</p>',
      '<p>Meditation is a powerful tool for developing consciousness and achieving inner peace. But where to start for those who are encountering this practice for the first time?</p><p>The simplest way is mantra meditation. In the Vedic tradition, the repetition of the Maha Mantra is recommended: Hare Krishna, Hare Krishna, Krishna Krishna, Hare Hare / Hare Rama, Hare Rama, Rama Rama, Hare Hare.</p><p>Start with 5-10 minutes daily, find a quiet place where no one will disturb you. Sit comfortably, close your eyes and repeat the mantra aloud or in a whisper. Don''t worry if your mind wanders—this is normal for beginners. Just bring your attention back to the mantra.</p>',
      'Практичні поради для тих, хто хоче почати практикувати медитацію. Прості кроки для початківців.',
      'Practical tips for those who want to start practicing meditation. Simple steps for beginners.',
      category_articles_id,
      true,
      now() - interval '7 days',
      'Адміністратор',
      4,
      312
    );

    -- Sample post 4: Philosophy
    INSERT INTO blog_posts (
      title_ua,
      title_en,
      slug,
      content_ua,
      content_en,
      excerpt_ua,
      excerpt_en,
      category_id,
      is_published,
      published_at,
      author_display_name,
      read_time,
      view_count
    ) VALUES (
      'Природа душі у ведичній філософії',
      'The Nature of the Soul in Vedic Philosophy',
      'nature-of-soul-vedic-philosophy',
      '<p>Одне з найглибших питань філософії — це питання про природу душі. У ведичній традиції душа (атма) розглядається як вічна, нематеріальна частка Верховного Господа.</p><p>Душа не народжується і не вмирає. Вона лише змінює тіла, подібно до того, як людина змінює одяг. Це фундаментальна концепція, яка пояснюється у Бгагавад-гіті.</p><p>Розуміння цієї природи душі допомагає нам по-іншому поглянути на життя і смерть, на наші стосунки з іншими живими істотами та нашу роль у цьому світі.</p><p>Коли ми усвідомлюємо себе як вічну душу, а не тимчасове матеріальне тіло, наше життя набуває нового, глибшого сенсу.</p>',
      '<p>One of the deepest questions in philosophy is the question of the nature of the soul. In the Vedic tradition, the soul (atma) is considered an eternal, immaterial particle of the Supreme Lord.</p><p>The soul is not born and does not die. It only changes bodies, similar to how a person changes clothes. This is a fundamental concept explained in the Bhagavad Gita.</p><p>Understanding this nature of the soul helps us look differently at life and death, our relationships with other living beings and our role in this world.</p><p>When we realize ourselves as an eternal soul, not a temporary material body, our life takes on a new, deeper meaning.</p>',
      'Глибокий розгляд концепції душі у ведичній філософії та її практичне значення для нашого життя.',
      'A deep exploration of the concept of the soul in Vedic philosophy and its practical significance for our lives.',
      category_philosophy_id,
      true,
      now() - interval '10 days',
      'Адміністратор',
      6,
      198
    );

  END IF;
END $$;
