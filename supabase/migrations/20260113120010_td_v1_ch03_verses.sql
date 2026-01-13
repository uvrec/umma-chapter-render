-- ============================================
-- TD Volume 1, Chapter 3 - Verses
-- ============================================

DO $$
DECLARE
  v_book_id uuid;
  v_canto_id uuid;
  v_chapter_id uuid;
BEGIN
  SELECT id INTO v_book_id FROM public.books WHERE slug = 'td';
  SELECT id INTO v_canto_id FROM public.cantos WHERE book_id = v_book_id AND canto_number = 1;
  SELECT id INTO v_chapter_id FROM public.chapters WHERE canto_id = v_canto_id AND chapter_number = 3;


  -- December 13th, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'December 13th, 1975', 1,
    '', '', '', '',
    '', '', '', '',
    E'<p>Prabhupāda likes to travel early in the morning. At 6:00 a.m., he chanted Gāyatrī <em>mantra</em>, donned his coat, gloves, and hat, and headed for the door. In a flurry of activity Harikeśa and I quickly packed last-minute items. Harikeśa placed the dictaphone and <em>Bhāgavatam</em>s into a black attachê case. Meanwhile I hastily filled Prabhupāda’s red vinyl briefcase with his desk paraphernalia (a pen case, a golden straw for drinking coconut juice, a jar of ink, a small silver cask filled with cardamom seeds, his glasses, <em>tilaka</em> clay, <em>loṭā</em>, mirror, mortar and pestle, a small enameled tin full of snuff for his high blood pressure, and a black Revlon manicure case). Finally, I swiftly stuffed Śrīla Prabhupāda’s indoor slippers and the brass spittoon engraved with his name into my shoulder bag and rushed to catch up.</p>

<p>Before exiting, Prabhupāda turned to the painting of his Guru Mahārāja, Śrīla Bhaktisiddhānta Sarasvatī Ṭhākura, hanging on the wall. “Hare Kṛṣṇa!” he said out loud, humbly touching his forehead to its base. Then he grasped his cane, slipped on his shoes, and swiftly walked out to the side gate amidst the clamor of the <em>kīrtana</em>.</p>

<p>Harikeśa and I climbed into the car following Prabhupāda’s, and we sped off, leaving the shelter of the holy <em>dhāma</em> for the external parts of Kṛṣṇa’s kingdom.</p>

<p>About halfway to Delhi, on a clear stretch of road, our driver suddenly stopped for no apparent reason. Shifting the ageing Ambassador’s gear stick, he reversed back a hundred yards, not heeding our questions as to what was going on. Then it became apparent. He stopped the car, opened his door, and dragged in the still warm and slightly mangled body of a recent road victim—a dead rabbit. Tucking the rodent’s carcass under his seat, he was about to start off again, but our loud and angry protests stopped him. It wasn’t for us to question his eating habits, but there was no way we were going to allow him to keep his gruesome potluck prize in the same car. He sheepishly deposited it back on the roadway, and sped off again in pursuit of Śrīla Prabhupāda’s car.</p>

<p><strong>ISKCON, 19 Todar Mal Lane</strong></p>

<p><strong>Bengali Market, New Delhi</strong></p>

<p>Today Prabhupāda talked informally with me for the first time. During his massage, as he relaxed and basked in the friendly sun, he looked out across the rooftops and suddenly asked, “So, you know our philosophy?”</p>

<p>“Yes, Śrīla Prabhupāda. At least I think so.”</p>

<p>“So you can explain?”</p>

<p>I was a little nervous at being directly questioned, but did my best. “Everyone in the material world is suffering due to being in illusion, thinking that they are this body. Because the body is temporary, the happiness they get from it is temporary also. Actually they are not this body, they are eternal servants of Kṛṣṇa...”</p>

<p>Prabhupāda immediately corrected me. “First of all you tell them that they are spirit soul. Then later on what is the function of the soul can be brought out.”</p>

<p>He seemed satisfied with my explanation, and I felt especially privileged to be personally tutored in the basic ABC’s of preaching.</p>

<p>Even when no one is around, Prabhupāda’s mind never deviates from his mission. He sees every occasion as an opportunity to teach Kṛṣṇa consciousness, either personally or through his disciples.</p>

<p class="verse">* * *</p>

<p>One great advantage of traveling with Śrīla Prabhupāda is that you can get answers to doubts and questions very easily. I approached him today with one that has confused me just lately.</p>

<p>“Śrīla Prabhupāda, I have been reading in <em>The Nectar of Devotion</em> that unless one has done devotional service in a previous life, it is not possible to take it up in this life. Also, in <em>Bhagavad-gītā</em> it states that if one takes up yoga but fails to reach the goal Kṛṣṇa still rewards that person with birth in a good family, wealth, intelligence or good looks. “So how does that work? At least in my own case, I wasn’t born in a good family. They are all just ordinary working-class people, meat-eaters with no idea of anything spiritual. Nor do I personally have any of the opulences mentioned in the <em>Gītā</em>. Yet here I am doing devotional service.”</p>

<p>Śrīla Prabhupāda smiled and immediately gave the answer. “It is like Prahlāda Mahārāja. He did not become degraded by his birth in a demonic family. Rather, the family was glorified because of him.”</p>', '', '1975-12-13', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- December 14th, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'December 14th, 1975', 2,
    '', '', '', '',
    '', '', '', '',
    E'<p>Early this morning Prabhupāda walked his usual route past the <em>kalā-kendras</em> and <em>bhavans</em>. Cocks crowed, and occasionally a few cars and trucks passed by. Tejīyas, Hansadūta, Harikeśa, Nayanābhirāma, and I kept close as he strode the littered streets. Noting the dilapidated appearance of New Delhi, Prabhupāda remarked with disapproval, “If this is the capital, what does it indicate about the condition of the country?”</p>

<p>Prabhupāda questioned the wisdom of pursuing economic advancement. Pointing to a tree he challenged Harikeśa, “Where does its food come from? Kṛṣṇa is providing, but these rascals they cannot understand. The animals have no arrangement for making industry, but nature’s food is already there. They are not opening factories. Modern men claim to be more civilized, but they have simply complicated their activities by opening factories. Formerly the sages took fruits from the trees, and milk from the cows. Whatever nature supplied, that’s all.”</p>

<p>Harikeśa mockingly protested, “But it’s a lot of fun to drive fast cars and have sex and see movies and...This is fun you know. It’s the only way to enjoy!”</p>

<p>Prabhupāda retorted, “Yes. Enjoyment is there in the cats and dogs. When you enjoy sex in a palace or the dog enjoys sex on the street, the value is the same. Taste does not increase or decrease. But you are thinking to enjoy sex in big palace is advancement. This is your foolishness. Actually sex enjoyment in the palace or on the street is the same.”</p>

<p>Harikeśa made another pitch, speaking for the materialists. “But there is happiness of the senses. When you have sex life...”</p>

<p>“Happiness there is, not for the rascals, but for the intelligent. Happiness there is. Unless there is happiness, how we are seeking for happiness? Unless there is immortality, how we are seeking for immortality? There is. But the way in which we are seeking for these things, that is wrong. That is the whole education. Just like a foolish animal, he is seeking water from the desert because it appears there is water. That is his foolishness. A human being, he knows that there is no water; it is all sand. That is the difference between animal and human being.”</p>

<p>To emphasize even further the effects of illusion and its result, Prabhupāda told us two anecdotes of what it means to be an animal: A dog was carrying some bread in its mouth. Seeing its own reflection in a pool of water, it thought there was another dog carrying a piece of bread, and immediately barked to challenge its imaginary competitor, hoping to gain more bread. Thus it lost its bread in the water. Similarly, a lion was once tricked into thinking there was another lion within a well. He gave a roar, and a roar came back. Thus he jumped into the well and lost his life.</p>

<p>“Although lions are fabulously strong,” Prabhupāda told us, “in spite of so much strength, he’s an animal. Similarly, this modern civilization, in spite of so much so-called advancement, they are simply animals. A big animal is eulogized by a small animal, that’s all. Animal is animal—big animal or small.”</p>

<p>Prabhupāda pointed out one of New Delhi’s flea-bitten dogs sniffing in the gutter. The wretched dog was homeless, scratching for food, and suffering without a master. “This is <em>śūdra</em>,” he said. “If anyone depends on the master’s mercy, he’s a <em>śūdra</em>. Here in New Delhi, these big, big buildings, big officers, as soon as the government will sell, they will be street dogs, that’s all. Now they are plundering by official instrument. So when the government will be finished they will be street dog. This is your civilization. Immediately, if all of a sudden there is attack on New Delhi, all the people will starve. There is no food at home, and they’ll die.”</p>

<p>“That’s a really important point,” Harikeśa responded, “that the government takes more and more, and everybody gets poorer and poorer.”</p>

<p>“Yes,” Prabhupāda replied. “The government is also poor because they do not know how to govern. <em>Buddhi yasya balaà tasya</em>: if one has got intelligence, he has got strength.”</p>

<p>Harikeśa added, “Change of government means getting poorer.”</p>

<p>“Just like they say,” Prabhupāda confirmed. “A change of theories by the rascals. Change means rascal. Anything change means it is the domain of rascals. Pandemonium. Just like in <em>Manu-saàhitā</em> it is said that women should not be given independence. Once said, that is fact. If you want to change, you suffer. That’s all.”</p>

<p>I said, “Any deviation from absolute law means immediate suffering.”</p>

<p>Prabhupāda agreed. “<em>Bas!</em> Immediately you have to suffer.”</p>

<p>“You’re painting a pretty bleak picture,” Harikeśa said.</p>

<p>Prabhupāda didn’t immediately catch his idiomatic expression, so Harikeśa elaborated. “The one you’re painting of society and the future. There’s no hope.”</p>

<p>“No,” Prabhupāda said. “Unless they take to Kṛṣṇa consciousness, there is no hope; that’s a fact. There will be more chaotic condition, and everyone will suffer and perish. <em>Ācchinna-dāra-draviṇā yāsyanti giri-kānanam</em>. This is already predicted. I am not painting. It is already there; I am simply repeating. That’s all. I am not speculator.”</p>

<p>“Actually most of them are aware that they’re in a very bad position,” I added. “Everybody is expecting another war.”</p>

<p>“Yes, just see. This is the capital of India, just see the position. We can now understand.”</p>

<p>Prabhupāda somberly observed an overloaded hand-drawn cart pulled by several dirty, poorly dressed, and barefoot men. Their veins bulged as they strained and sweated to get their load to its destination. “Economic development,” he mocked. “Where is economic development for these men? When there was no economic development, the same <em>taila</em> [cart] and poor people with black cloth were there. And now, the same thing is still there. So where is development? Nature’s law you cannot check. It must go on. <em>Bhāgavata</em> says, ‘Don’t try to improve all these things, it is not possible. Improve your Kṛṣṇa consciousness; that will be benefit for your life.’”</p>

<p>Keeping up a brisk pace, Prabhupāda turned his attention to the <em>kalā-kendras</em>. Noting their advertisements for <em>māgha-melā</em> dances, he said they are simply encouraging illicit sex. “Yet if our men dance, they say we are crazy.”</p>

<p>He told Tejīyas that he should immediately hire some of the halls for a week at a time and present plays, <em>kīrtana</em>, and <em>prasādam</em>. “Five minutes talking and ten minutes <em>kīrtana </em>—alternate. Tickets can be given and donations asked for.”</p>

<p>Because Nayanābhirāma has had previous experience in art and drama, Prabhupāda told him to arrange performances all over Delhi. He said that way we won’t require any big arrangement for living, but our propaganda will go on. Prabhupāda seemed certain that this program will attract thousands of people. “Of course,” he added with a touch of irony, “I can suggest, but whether you do it is another thing.”</p>

<p>Walking back toward the temple, loud train whistles and increasingly noisy traffic signaled the awakening of the city. The conversation turned to another topic. Hansadūta told Prabhupāda about the plight of a former GBC secretary, Śyāmasundara, an early recruit to the Kṛṣṇa consciousness movement. He has fallen into considerable difficulty in a bad business deal, losing a large amount of the Society’s money. He is now selling jewelry to repay it, but neglecting his devotional life.</p>

<p>Prabhupāda, the ideal representative of Śrī Caitanya Mahāprabhu, compassionately remarked, “No. He has done a mistake, so he wants to rectify it. He wants to bring money. But if the money is lost, it is lost. Let him come back. A life saved is more important than saving the money. So if I could know the address, then I could write? I wanted to write him a letter.”</p>

<p>Harikeśa said Śyāmasundara told him that he wanted to make millions of dollars for Prabhupāda so that he can make up for his mistake.</p>

<p>Prabhupāda responded with loving concern for his wayward disciple, “Yes, and I am thinking when making millions of dollars he may not be lost. I want one soul saved. That is more than millions of dollars.”</p>

<p class="verse">* * *</p>

<p>One reason for remaining in Delhi is to see Gulzarilal Nanda again in a follow-up to the earlier Kurukṣetra trip. Nandajī arrived about midday while Prabhupāda was taking his massage on the roof of number nine. Sitting on a chair as Prabhupāda relaxed in his <em>gamchā</em> in the sun, he listened carefully while Prabhupāda revealed his desires for Kurukṣetra. Prabhupāda first requested Nandajī to get as much free land as possible for us at Jyotisar. (Prabhupāda wants between four and ten acres.) As soon as that land is acquired, Prabhupāda said he will immediately begin building a Kṛṣṇa-Arjuna Temple there. But he put him off for now about purchasing property at Brahma-sarovara. After the rainy season he said he would reappraise the land and decide whether to begin a project there.</p>

<p>Nandajī is eager for ISKCON to build a college at Brahma-sarovara as quickly as possible to train up young people. He began to confide how anxious he is about the atheistic influence of the USSR on the country and the present government’s close relationship with the Soviets.</p>

<p>But Prabhupāda cut him off. India is in a state of official emergency and many have been jailed for simply criticizing the Government. “We are not interested in politics,” he said emphatically, “only Kṛṣṇa.”</p>

<p>Nandajī politely took his leave, promising to pursue Prabhupāda’s requests.</p>

<p class="verse">* * *</p>

<p>During the afternoon <em>darśana</em> there was a lively discussion about how to preach effectively. Prabhupāda challenged us to go beyond mere parrot like repetition and come to the platform of genuine realization. He emphasized that people will be convinced of our philosophy only when we present everything with logic and <em>śāstra</em>. Otherwise, they will simply be cheated by so many false yogis and svāmīs who misuse the <em>Vedas</em> for making money. Everyone else is presenting the impersonalist and Māyāvādī idea, removing Kṛṣṇa from the picture.</p>

<p>He concluded, “Therefore, these rascals they have no clear understanding, and they are svāmīs, yogis, and <em>avatāras</em>. It is a very dangerous position, very dangerous. We have to deal with all rascals and fools. And they have made some position; of course, that position is nothing. Mr. Nanda is also big on this idea, <em>nirviśeṣa śūnyavādi</em>. Still, we cannot change our position. We must go on with our conviction, and that is real, reality. So, begin <em>kīrtana</em>.”</p>', '', '1975-12-14', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- December 15th, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'December 15th, 1975', 3,
    '', '', '', '',
    '', '', '', '',
    E'<p>Bhagavat dāsa, an intelligent and talkative twenty-five year old New Yorker, currently the Calcutta temple president, passed through on his way to renew his visa in the West. He told Prabhupāda that some astrologers and political experts are predicting a big war early in 1976 with China, Pakistan, and America against India and Russia.</p>

<p>Prabhupāda shrugged, saying that an atomic war will be short and severe. “But war or not,” he said, “it makes no difference for us. A devotee doesn’t care if he lives or dies; he always serves Kṛṣṇa. We shall simply continue to do our duties—chant Hare Kṛṣṇa.”</p>

<p>Bhagavat also asked if he could take <em>sannyāsa</em>. Prabhupāda’s response wasn’t one of enthusiasm, but rather noncommittal. Never wanting to dampen anyone’s enthusiasm for preaching, he tactfully agreed to consider Bhagavat for <em>sannyāsa</em> at next year’s Gaura Pūrṇimā festival in Māyāpur.</p>

<p>Bhagavat is a portly, almost overweight, fellow, and later Prabhupāda told us that for <em>sannyāsa</em> one should be “fit, not fat.”</p>

<p class="verse">* * *</p>

<p>Interviews with prospective Hindi translators are still going on, and His Divine Grace has already engaged a Mathurā woman named Dr. Paliwal. Later this evening Mr. Singh arrived and showed Prabhupāda his Ph.D. thesis—a lengthy treatise on Caitanya Vaiṣṇavism.</p>

<p>Impressed with the man’s work, Śrīla Prabhupāda said he wanted to spend more time with him, examining the document and testing his ability to translate. This posed a dilemma. It was too late to do anything on the spot, and Prabhupāda has to fly to Bombay first thing in the morning. Prabhupāda asked Mr. Singh if he could come to Bombay. He was immediately agreeable, but he could not afford to buy a plane ticket.</p>

<p>Prabhupāda thought for a moment and then called in Harikeśa and Hansadūta. “So, what tickets do we have for Bombay?”</p>

<p>“Well, there are four: yours, Hansadūta’s, mine, and Hari-śauri’s.”</p>

<p>“So give him his,” Prabhupāda said, without even a glance in my direction.</p>

<p>Harikeśa gave me a sympathetic smile and shrugged. Within a moment my ticket was handed over to Mr. Singh. The man happily left, and Śrīla Prabhupāda took rest.</p>', '', '1975-12-15', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


END $$;
