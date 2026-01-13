-- ============================================
-- TD Volume 1, Chapter 9 - Verses
-- ============================================

DO $$
DECLARE
  v_book_id uuid;
  v_canto_id uuid;
  v_chapter_id uuid;
BEGIN
  SELECT id INTO v_book_id FROM public.books WHERE slug = 'td';
  SELECT id INTO v_canto_id FROM public.cantos WHERE book_id = v_book_id AND canto_number = 1;
  SELECT id INTO v_chapter_id FROM public.chapters WHERE canto_id = v_canto_id AND chapter_number = 9;


  -- March 21st, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'March 21st, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Today was Śrīla Prabhupāda’s final day in Māyāpur.</p>

<p>Jayapatāka Mahārāja was instructed during the walk to arrange a meeting with Śrīla Lalitā Prasāda Ṭhākura, the only remaining brother of Śrīla Prabhupāda’s Guru Mahārāja, Śrīla Bhaktisiddhānta Sarasvatī. Prabhupāda wants to meet with him on his way into Calcutta tomorrow.</p>

<p>Apparently Śrīla Bhaktisiddhānta had some difference of opinion with Lalitā Prasāda. Lalitā Prasāda is a <em>bābājī</em>, a member of a class of reclusive devotees who remain aloof from the general population and simply chant the <em>mahā-mantra</em>. His brother, on the other hand, was a <em>sannyāsī</em>, an active preacher who created a large movement and attracted much opposition in the process. Apparently Lalitā Prasāda considers himself to be more confidentially situated in his relationship with the previous <em>ācāryas</em> and Kṛṣṇa.</p>

<p>Despite this, Śrīla Prabhupāda has been negotiating to get either a lease or ownership of the birthsite of Śrīla Bhaktivinoda Ṭhākura, the father of Bhaktisiddhānta and Lalitā Prasāda, and our spiritual great-great grandfather. He wants to renovate the place and maintain a preaching center there. Prabhupāda has met with Lalitā Prasāda previously, who said he was willing to cooperate with us. He has not been able to develop the birthsite, but still some of his men are hesitating. He has a committee to manage his affairs, and now it appears they want another meeting.</p>

<p>Without raking up the controversial points, Śrīla Prabhupāda made a few observations by which we could understand the actual symptoms of confidential service. “So what is the use of such men? Why he’s keeping these men? They cannot do anything. He gets some pension, and he spends that money. But they are not doing anything. So what is the meaning of this committee?”</p>

<p>Jayapatāka Mahārāja told Prabhupāda that the Ṭhākura has admitted that many times he has told some of his men to leave their family life and take up some preaching, but they don’t do it.</p>

<p>“How they’ll do it?” Prabhupāda rejoined. “They do not know how to preach. Neither they are trained up. That means it is his disqualification. He could not train them how to preach. Even Caitanya Mahāprabhu, He was training Haridāsa Ṭhākura, Nityānanda, ‘Go there. Preach there. Do that.’ My Guru Mahārāja was doing that. But he [Lalitā Prasāda] has no power. He cannot do it. He simply talks that he is a very confidential devotee. That’s all. He cannot preach. Otherwise Prabhupāda developed this Māyāpur, and he could not do anything. That means he has no such power.”</p>

<p>“He should have developed that place,” Jayapatāka Swami ventured.</p>

<p>“Yes. He simply talks of big, big work. In the beginning, Prabhupāda had no committee, nothing of the sort. That he’ll not admit, that he has no power to do so. He simply thinks that he is a very confidential son of Bhaktivinoda Ṭhākura.”</p>

<p>Going down to the front gate, Prabhupāda went to inspect the painting of the front wall.</p>

<p>The <em>gurukula</em> children were gleefully yelling “<em>Jaya</em> Prabhupāda! <em>Haribol!</em>” all the way down the road and he reciprocated with smiles and “Hare Kṛṣṇa!” He has a ingenuous rapport with them, innocents entrusted to him to send back to home, back to Godhead. And they love him without reservation, putting in him their full trust, as guileless young children do.</p>

<p>As he made his way out the gate, he emphasized why he has had such success in his preaching mission. “You must be always convinced that if we simply take up the knowledge given by Kṛṣṇa, then you are perfect. That’s all. A little success is there for me, [more] than other svāmīs and yogis. It is due to my conviction on this point. I never compromised with anything which is not spoken by Kṛṣṇa. Did you mark it or not?”</p>

<p>All the devotees replied in unison. “Yes.”</p>

<p>One of the devotees recalled a previous instruction that Śrīla Prabhupāda had given. “One time you told us, Śrīla Prabhupāda, to meet every man at his door and ask him to give up everything he knows and chant Hare Kṛṣṇa.”</p>

<p>“Yes. That is simple. ‘You rascal, you give up whatever you have learned to chant Hare Kṛṣṇa.’” He smiled at us. “Don’t say rascal, but indirectly. ‘What ever you have learned, it is all nonsense. You give up everything, kicked out, and simply become adherent to Caitanya.’ This is our preaching. And what Caitanya Mahāprabhu said, <em>yāre dekhe, tāre kaha ‘kṛṣṇa’-upadeśa</em>. That’s all.”</p>

<p>Paṣcadraviḍa Swami asked him to repeat the reason for his success.</p>

<p>Prabhupāda obliged. “Because I stick to Kṛṣṇa’s word! I go to present <em>Bhagavad-gītā</em> as it is. We don’t make any amendment. Therefore we decry eulogizing Gandhi, Dr. Radhakrishnan, Aurobindo, this, that... all rascals! Because they tried to amend it.”</p>

<p>Prabhupāda recalled a recent review of his <em>Bhagavad-gītā As It Is</em> by Francois Chenique, Professor of Religious Sciences at the Institute of Political Studies in Paris. This man has written very appreciatively. “Śrīla Prabhupāda’s edition thus fills a sensitive gap in France, where many hope to become familiar with traditional Indian thought, beyond the commercial East-West hodgepodge that has arisen since the time the Europeans first penetrated India. Whether the reader be an adept of Indian spiritualism or not, a reading of the <em>Bhagavad-gītā As It Is</em> will be extremely profitable. For many this will be the first contact with the true India, the ancient India, the eternal India.”</p>

<p>“That is admitted by the French professor,” Prabhupāda said. That they have all tried to make it modernized. But I have not done that. ‘Here is a spiritual master in disciplic succession, so we are indebted to him, to understand the original traditional knowledge.’ Everyone who is after truth will accept. And if you are bogus, want to be cheated and cheat others, then he’ll not. Ninety-nine percent are cheaters and cheated. This is the position. All these cheaters they are cheating and they accept to be cheated.</p>

<p>“If I am very clever but I don’t go to be cheated, nobody can cheat me. But these rascals, they <em>want</em> to be cheated. If you say, ‘What is the wrong in illicit sex?’ that means you want to be cheated. And if we say, and the press will go, ‘Oh this svāmī is very conservative.’ This is the position. We want cheap things because we want to be cheated. And here are so many cheaters, they will take advantage and cheat you. This is going on.”</p>

<p>Paṣcadraviḍa mentioned again that Allen Ginsberg had said that Prabhupāda was very conservative.</p>

<p>“Yes. Because he wants to be cheated. And he cheats others. Some followers, he is cheating.”</p>

<p>Paṣcadraviḍa Mahārāja repeated a slogan the Ramakrishna mission uses to summarize its philosophy. It means ‘Whatever path one follows, you get the same result.’ It well represents the kind of mentality Prabhupāda was describing.</p>

<p>Prabhupāda agreed with his observation. “<em>Yata mat, tata path</em>. Yes, this is going on. This business is to ruin the innocent persons, who are being cheated. And we don’t want to cheat them. Whatever Kṛṣṇa says—our business is very simple.”</p>

<p class="verse">* * *</p>

<p>A letter from Raṇadhira dāsa, who runs the BBT Mail Order department in Los Angeles, informed Prabhupāda of the mailing of 200,000 copies of<em> The Kṛṣṇa Consciousness Movement Is Authorized</em> to the “leading citizens of the United States.” As well as this they are compiling a list of over 2,500 professors who have ordered one or more of Prabhupāda’s books. In addition, Raṇadhira enclosed a list of every library and all the professors who have taken a standing order of the full set.</p>

<p>Prabhupāda was very pleased to receive the material. He asked Puṣṭa Kṛṣṇa Mahārāja to keep the lists in his standing file. (Prabhupāda’s secretary carries two files. One is for correspondence and is cleared out every few months. The other is a “standing file” containing important documents, news clips, etc. which Śrīla Prabhupāda uses in his preaching.) In his reply Prabhupda asked Raṇadhira to “please continue with this important work.”</p>

<p>There was a letter from a devotee in Nairobi, Mahāvirya dāsa. Written on the appearance day of Śrīla Jagannātha dāsa Bābājī, it described a dramatic reason why he now wants permission to take <em>bābājī</em> initiation. “Recently while here in the Nairobi ISKCON center, the temple was attacked, and I was practically sliced to death by thieves and murderers. I was unconscious for two days, hospitalized for twenty- eight, and now I presently have the use of only one hand and arm. I consider this the Lord’s mercy. I am suffering still, conditional, fallen and the greatest fool, so I beg you to please give me permission to chant daily ninety rounds.”</p>

<p>Even with that heartfelt plea, Prabhupāda was cautious. Mahāvirya is still only twenty-seven years old. So Prabhupāda wrote back, deferring his decision until next time he goes to Nairobi. As he told him, “I gave babaji initiation to one other devotee but now he is off somewhere restless.”</p>

<p class="verse">* * *</p>

<p>Tamal Krishna Mahārāja reported to Śrīla Prabhupāda that Viṣṇujana Swami has disappeared. He has failed to appear since he asked Śrīla Prabhupāda his questions about Choṭa Haridāsa up on the roof. One of the devotees saw him the day after, on the morning of March 12th, on the train to Calcutta, and no one has seen him since.</p>

<p>Prabhupāda didn’t seem to take it too seriously. He appeared unperturbed. He doesn’t think there has been any mishap, he thinks he simply doesn’t want to serve.</p>

<p class="verse">* * *</p>

<p>With Prabhupāda’s permission I took my one and only bath in the Ganges before we left. She was flowing swiftly, and swimming was difficult.</p>

<p>Prabhupāda has decided to bring along Anantarāma Śāstrī as part of his party, to assist him with the Sanskrit grammar checking in his books.</p>

<p class="verse">* * *</p>

<p>In the afternoon devotees gathered in Prabhupāda’s room for a last <em>darśana</em>. On behalf of the Philadelphia temple, Ravīndra Svarūpa prabhu gave him an eighteen-carat gold ring made by Gopīnātha dāsa. Prabhupāda held it for a moment, puzzled as to what the design was. “It is a crown?” he asked.</p>

<p>Ravīndra Svarūpa reached forward and turned it up the other way. That revealed the words “Hare Kṛṣṇa,” with three small diamonds forming the diacritic dots under “Kṛṣṇa.”</p>

<p>Prabhupāda smiled with pleasure and appreciation, and he slipped it on the little finger of his right hand. Then, opening the drawer in his desk, he pulled out another ring, a large, decorative, golden one with a big, black stone, which he handed to Bhavānanda Mahārāja. Very gratefully, Bhavānanda immediately put it on, and it fitted perfectly.</p>', '', '1976-03-21', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


END $$;
