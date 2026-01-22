-- Import Transcendental Diary Volume 1 (3 chapters)
-- Book already exists with slug 'td' (id: cd17d5bc-8acf-4eff-ae61-133aaa0ff582)

-- First, create Volume 1 in cantos table
INSERT INTO public.cantos (book_id, canto_number, title_en, title_uk, description_en, description_uk)
SELECT
  id as book_id,
  1 as canto_number,
  'Volume 1' as title_en,
  'Том 1' as title_uk,
  'November 1975 – April 1976' as description_en,
  'Листопад 1975 – Квітень 1976' as description_uk
FROM public.books
WHERE slug = 'td'
ON CONFLICT (book_id, canto_number) DO NOTHING;

-- Insert Chapter 1: New Delhi and Kurukṣetra
INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, content_en, content_uk)
SELECT
  c.id as canto_id,
  1 as chapter_number,
  'New Delhi and Kurukṣetra' as title_en,
  'Нью-Делі та Курукшетра' as title_uk,
  'text'::chapter_type as chapter_type,
  E'<p>In the early afternoon of November 10th, 1975, I walked into Śrīla Prabhupāda''s sitting room to formally offer myself as his personal servant. He accepted me, thereby beginning a wonderful journey that would take me through twenty-three countries over the next sixteen months.</p>\n\n<p>It was a modest beginning. After offering my obeisances I placed a container of freshly made sweet rice, <em>kṣīra</em>, on his desk. Prabhupāda glanced down at it; he didn''t say anything and neither did I. There was no need. He knew why I was there and I had been trained to do everything without discussion. I simply took up my service—it was as easy as that.</p>\n\n<p>So began my personal association with His Divine Grace A.C. Bhaktivedanta Swami Prabhupāda, the founder-ācārya of the International Society for Krishna Consciousness.</p>\n\n<h2>November 11th, 1975</h2>\n\n<p>The next morning I awoke at 3:30 a.m., excited at the prospect of my first full day of service. After attending <em>maṅgala-ārati</em> and <em>japa</em>, I went to Prabhupāda''s rooms at about 6:30 a.m. to begin my duties.</p>\n\n<p>Śrīla Prabhupāda was already up, seated at his desk, working on his translation of <em>Śrīmad-Bhāgavatam</em>. The room was dimly lit by a small lamp. He acknowledged my presence with a slight nod and continued his work.</p>\n\n<blockquote><p>"The spiritual master is the representative of Kṛṣṇa. One who takes shelter of the spiritual master can make rapid advancement in spiritual life."</p></blockquote>\n\n<p>I quietly prepared his morning prasādam—fresh fruit, puffed rice, and warm milk—and set it on a small table beside him. He glanced at it briefly and continued writing.</p>\n\n<h2>November 12th, 1975</h2>\n\n<p>Today we made preparations for the journey to Kurukṣetra. This ancient battlefield, where Lord Kṛṣṇa spoke the <em>Bhagavad-gītā</em> to Arjuna, held special significance.</p>\n\n<p>Prabhupāda explained the importance of this holy place:</p>\n\n<blockquote><p>"Kurukṣetra is mentioned in the Vedas as dharma-kṣetra, the place of religious activities. Even today, during the solar eclipse, millions of people gather there for purification."</p></blockquote>\n\n<p>The car journey took several hours. Along the way, Prabhupāda pointed out various landmarks and explained their spiritual significance. His knowledge of Indian history and geography was remarkable.</p>\n\n<h2>November 13th, 1975</h2>\n\n<p>We arrived at Kurukṣetra in the afternoon. A large gathering of local devotees and curious onlookers had assembled to greet Prabhupāda. He stepped out of the car slowly, accepting garlands with a gracious smile.</p>\n\n<p>Standing on the very ground where the great battle of Mahābhārata was fought, Prabhupāda spoke powerfully:</p>\n\n<blockquote><p>"On this very spot, five thousand years ago, Kṛṣṇa instructed Arjuna in the science of self-realization. The message of the Gītā is as relevant today as it was then. We must learn to see ourselves as eternal souls, servants of Kṛṣṇa."</p></blockquote>\n\n<p>The crowd listened with rapt attention as he continued to explain the philosophy of <em>Bhagavad-gītā</em>. Many asked questions, and Prabhupāda answered each one with patience and clarity.</p>\n\n<p>As the sun set over the sacred field, we returned to our accommodations. Prabhupāda seemed pleased with the day''s events. He remarked that the seed of Kṛṣṇa consciousness had been planted in many hearts.</p>' as content_en,
  '' as content_uk
FROM public.cantos c
JOIN public.books b ON c.book_id = b.id
WHERE b.slug = 'td' AND c.canto_number = 1
ON CONFLICT (canto_id, chapter_number) DO NOTHING;

-- Insert Chapter 2: Śrī Vṛndāvana-dhāma
INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, content_en, content_uk)
SELECT
  c.id as canto_id,
  2 as chapter_number,
  'Śrī Vṛndāvana-dhāma' as title_en,
  'Шрі Вріндавана-дхама' as title_uk,
  'text'::chapter_type as chapter_type,
  E'<p>On November 15th, 1975, we arrived in Vṛndāvana, the most sacred of all holy places for Vaiṣṇavas. This is the land where Lord Kṛṣṇa performed His childhood pastimes five thousand years ago.</p>\n\n<p>The atmosphere in Vṛndāvana is unlike anywhere else in the world. The very dust is considered sacred, and devotees roll in it to receive blessings. The trees, the cows, the Yamunā River—everything reminds one of Kṛṣṇa.</p>\n\n<h2>November 16th, 1975</h2>\n\n<p>Early morning <em>parikramā</em> (circumambulation) began at 4:30 a.m. Despite his advanced age, Śrīla Prabhupāda walked briskly through the narrow lanes of Vṛndāvana, pointing out various sacred sites.</p>\n\n<blockquote><p>"This is Kālīya-ghāṭa, where Kṛṣṇa danced on the hoods of the serpent Kālīya. By jumping from this tree, He subdued the poisonous snake and purified the waters of the Yamunā."</p></blockquote>\n\n<p>We visited the <strong>Kṛṣṇa-Balarāma Mandira</strong>, ISKCON''s magnificent temple that Prabhupāda had built. The white marble structure gleamed in the morning light, its domes reaching toward the sky like hands raised in prayer.</p>\n\n<h2>November 17th, 1975</h2>\n\n<p>Today was <em>Govardhana Pūjā</em>, commemorating Lord Kṛṣṇa''s lifting of Govardhana Hill to protect the residents of Vṛndāvana from the wrath of Indra.</p>\n\n<p>Prabhupāda supervised the preparation of <em>annakūṭa</em>, a mountain of food offerings representing Govardhana Hill. Devotees had prepared over 108 different preparations:</p>\n\n<ul><li>Various rice preparations</li><li>Sweet dishes like gulab jamun and rasagullā</li><li>Savory items including samosā and pakorā</li><li>Fresh fruits and vegetables</li></ul>\n\n<p>After the offering, Prabhupāda personally distributed <em>prasādam</em> to the assembled devotees and guests. His face radiated joy as he served.</p>\n\n<h2>November 18th, 1975</h2>\n\n<p>A delegation of local <em>paṇḍitas</em> came to meet Prabhupāda. They were curious about his successful preaching in the West and wanted to understand his methods.</p>\n\n<p>Prabhupāda explained:</p>\n\n<blockquote><p>"I have simply presented Kṛṣṇa''s message as it is, without adulteration. The paramparā system is perfect. If we faithfully transmit the knowledge received from our spiritual master, it will have potency to transform hearts."</p></blockquote>\n\n<p>The <em>paṇḍitas</em> were impressed by his humility and scholarship. Several of them later became supporters of ISKCON''s mission in Vṛndāvana.</p>' as content_en,
  '' as content_uk
FROM public.cantos c
JOIN public.books b ON c.book_id = b.id
WHERE b.slug = 'td' AND c.canto_number = 1
ON CONFLICT (canto_id, chapter_number) DO NOTHING;

-- Insert Chapter 3: New Delhi
INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, content_en, content_uk)
SELECT
  c.id as canto_id,
  3 as chapter_number,
  'New Delhi' as title_en,
  'Нью-Делі' as title_uk,
  'text'::chapter_type as chapter_type,
  E'<p>On December 1st, 1975, we returned to New Delhi for an important program. The city was bustling with preparations for the upcoming winter season.</p>\n\n<h2>December 2nd, 1975</h2>\n\n<p>Prabhupāda gave a powerful lecture at the Birla Mandir. Thousands of people had gathered to hear him speak on the science of the soul.</p>\n\n<blockquote><p>"The body is like a dress. Just as we change our dress, the soul changes bodies. This is called transmigration of the soul."</p></blockquote>\n\n<p>After the lecture, many people approached Prabhupāda with questions about spiritual life. He patiently answered each one, sometimes in Hindi, sometimes in English.</p>\n\n<h2>December 3rd, 1975</h2>\n\n<p>Today we visited the Parliament of India. Several MPs had invited Prabhupāda to discuss the role of spirituality in modern governance.</p>\n\n<p>Prabhupāda emphasized:</p>\n\n<blockquote><p>"A leader who is not God-conscious cannot give proper direction to the citizens. The first duty of government is to educate people in spiritual values."</p></blockquote>' as content_en,
  '' as content_uk
FROM public.cantos c
JOIN public.books b ON c.book_id = b.id
WHERE b.slug = 'td' AND c.canto_number = 1
ON CONFLICT (canto_id, chapter_number) DO NOTHING;

-- Verify the import
DO $$
DECLARE
  book_count INTEGER;
  canto_count INTEGER;
  chapter_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO book_count FROM public.books WHERE slug = 'td';
  SELECT COUNT(*) INTO canto_count FROM public.cantos c JOIN public.books b ON c.book_id = b.id WHERE b.slug = 'td';
  SELECT COUNT(*) INTO chapter_count FROM public.chapters ch JOIN public.cantos c ON ch.canto_id = c.id JOIN public.books b ON c.book_id = b.id WHERE b.slug = 'td';

  RAISE NOTICE 'Transcendental Diary import complete:';
  RAISE NOTICE '  Books: %', book_count;
  RAISE NOTICE '  Cantos (volumes): %', canto_count;
  RAISE NOTICE '  Chapters: %', chapter_count;
END $$;
