-- ============================================
-- TD Volume 1, Chapter 10 - Verses
-- ============================================

DO $$
DECLARE
  v_book_id uuid;
  v_canto_id uuid;
  v_chapter_id uuid;
BEGIN
  SELECT id INTO v_book_id FROM public.books WHERE slug = 'td';
  SELECT id INTO v_canto_id FROM public.cantos WHERE book_id = v_book_id AND canto_number = 1;
  SELECT id INTO v_chapter_id FROM public.chapters WHERE canto_id = v_canto_id AND chapter_number = 10;


  -- March 29th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'March 29th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p><strong>Modinagar</strong></p>

<p>Early in the morning Śrīla Prabhupāda went by car to Modinagar, a small industrial town founded by the Modi family. They are well-known throughout India for cloth and other manufactured goods. It has six colleges and a huge factory complex. A notable feature is a grand Lakṣmī-Nārāyaṇa temple compound, built from red sandstone with three large, steeple-like towers, set back from the road across a broad, open courtyard.</p>

<p>Śrīla Prabhupāda was met in front of the temple by the widowed Mrs. Modi and a large crowd of our devotees. After paying his respects to the Deities and taking a tour of the marble complex, he gave a short talk in a back room before going to the Modi mansion, where we will reside until tomorrow.</p>

<p>The mansion is situated on several acres of land and enclosed by a high wall. The house is quite dark and seems to lack personal warmth, but the reception was quite cordial.</p>

<p>In the evening Prabhupāda returned to the temple lecture hall and gave a long discourse to a crowd of some 2,500, the majority being women and children. After an exuberant <em>kīrtana,</em> he spoke for about an hour.</p>

<p>The <em>vyāsāsana</em> was one of the most spectacular we’ve seen yet. In shape it looked almost like a silver spaceship, and it was detailed with flowered patterns and bright colors.</p>

<p>On his return to the house, Mrs. Modi gave Śrīla Prabhupāda a thousand rupees as <em>dakṣiṇa</em>.</p>', '', '1976-03-29', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- March 30th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'March 30th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Śrīla Prabhupāda took a brief walk around the Modi estate before his departure. During the walk he noted some large bottle palms, similar to the ones we had seen at the sisters’ estate in Nellore. He suggested they would be suitable trees for decorating the grounds of our Māyāpur complex.</p>

<p>Śrīla Prabhupāda then took his leave and we headed off for our next program.</p>

<p><strong>Aligarh</strong></p>

<p>Aligarh is a city with a population of about 300,000. A very old center of learning, it is also notable as the place where the Muslim League was founded in the fight to gain Indian independence from the British. Its university is also of national importance. Because Aligarh is very near to Vṛndāvana, most of the people speak <em>brajbhāṣaḥ,</em> the dialect of Hindi peculiar to this area.</p>

<p>We are staying at Surendra Kumar Saigal’s home on Marris Road, the main residential area for the wealthy section of the populace. The house, which was erected around 1918, is a large, single-story colonial-style building, with very high ceilings, dark rooms, and a cool interior. It stands behind a high front wall on three acres of spacious lawns and landscaped gardens. Two large <em>ashok</em> trees dominate a central circular lawn. Frangipani, mango, and eucalyptus trees are scattered here and there, with bottle palms standing like tall sentinels along the pathways.</p>

<p>Prabhupāda is staying in an unusual seven-sided room at the end of the front veranda. We servants are staying in a room at the opposite end. A few other devotees are also residing here for the program.</p>

<p>As soon as Śrīla Prabhupāda arrived, Surendra Kumar’s wife invited him to see a beautiful Deity of Kṛṣṇa. Stepping inside a small room off the back veranda, Mrs. Saigal revealed her worshipable Lord. He is three feet high and carved from white marble, complete with crown, <em>chaddar,dhotī</em>and a brass flute. Her worship of the Lord is not very elaborate, with offerings consisting primarily of incense and flowers, but Śrīla Prabhupāda encouraged her devotion and suggested that she obtain a Deity of Rādhārāṇī. “Why keep Kṛṣṇa alone?” he said.</p>

<p class="verse">* * *</p>

<p>Śrīla Prabhupāda held an afternoon <em>darśana</em> in a central room packed with devotees and visitors. He began by emphasizing to Mr. Saigal and his family the necessity of offering everything to Kṛṣṇa so that it becomes <em>prasādam</em>. We should offer whatever we consume, he told them.</p>

<p>One of the devotees suggested that perhaps <em>bhakti-yoga</em> is not much of an intellectual process.</p>

<p>Prabhupāda quickly corrected him by quoting the <em>Gītā</em> verse <em>na me bhaktaḥ pranaśyati,</em> “I am never lost nor is he ever lost to Me.” How can one who knows Kṛṣṇa be ignorant? he asked. If Kṛṣṇa is merciful to him, how can he remain a fool?</p>

<p>A visitor asked a question relating to the Arya Samaja, an organization that claims religiosity but rejects the idea that God can appear in the form of the Deity. Its followers uphold the impersonal concept of the Absolute.</p>

<p>Prabhupāda replied that to worship <em>nirguṇa-brahman,</em> the formless aspect of God, is all right, but Śrī Kṛṣṇa Himself <em>is</em> the Deity; He is not stone or wood. He mercifully appears in this form to enable us to render personal service to Him.</p>

<p>Surendra Kumar also introduced Dr. V. N. Sukla from Aligarh University, who holds a doctorate in <em>Bhāgavata</em> philosophy and is a recognized Vaiṣṇava and a Sanskrit scholar. He is a very learned and amiable man in his late forties and is clearly quite impressed with Śrīla Prabhupāda. They chatted for some time and Prabhupāda asked him to translate <em>The Nectar of Instruction</em> into Hindi.</p>

<p class="verse">* * *</p>

<p>In the evening a large <em>paṇḍāl</em> program was held on the Government of India Press Colony grounds, just off Marris road. The crowd numbered some 7,000 people, an excellent turnout.</p>

<p>The devotees had already been chanting for half an hour when Prabhupāda arrived, and the audience was eager to hear him. Clearly it was a special event for them to see so many Westerners chanting and dancing and to meet the personality who has inspired them to do so.</p>

<p>Prabhupāda was given a vote of thanks by the head of the nearby Rāma Tīrtha Mission, who had helped organize the <em>paṇḍāl</em> on just a few days notice.</p>

<p>Prabhupāda was noticeably pleased with the program and gave a splendid lecture about the value of chanting Hare Kṛṣṇa. He quoted a statement from <em>śāstra</em> that there was no amount of sin that could not be eradicated by the chanting of the holy name of Kṛṣṇa.</p>

<p>Prabhupāda stayed to see a film that was shown at the end. All-in-all, it was a well organized program, and Prabhupāda was very satisfied with all the arrangements.</p>', '', '1976-03-30', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- March 31st, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'March 31st, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Before leaving Aligarh, Prabhupāda was presented with three books about the life and teachings of Rāma Tīrtha, by the head of that mission. Although cordially received, he paid them scant attention, being already familiar with their contents.</p>

<p>I peeked inside. They were full of Māyāvāda speculation. Some of the recorded lectures began with, “Myself, in the form of ladies and gentlemen.”</p>

<p>Prabhupāda left the books behind. Taking leave of his hosts he boarded his car for the hour-long drive to Śrī Vṛndāvana-dhāma.</p>', '', '1976-03-31', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


END $$;
