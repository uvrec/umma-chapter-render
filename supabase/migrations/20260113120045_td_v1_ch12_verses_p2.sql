-- ============================================
-- TD Volume 1, Chapter 12 - Verses
-- ============================================

DO $$
DECLARE
  v_book_id uuid;
  v_canto_id uuid;
  v_chapter_id uuid;
BEGIN
  SELECT id INTO v_book_id FROM public.books WHERE slug = 'td';
  SELECT id INTO v_canto_id FROM public.cantos WHERE book_id = v_book_id AND canto_number = 1;
  SELECT id INTO v_chapter_id FROM public.chapters WHERE canto_id = v_canto_id AND chapter_number = 12;


  -- April 17th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'April 17th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>We took our last walk along Juhu Beach this morning, as Śrīla Prabhupāda will be leaving tomorrow to begin his world tour. The conversation took up from yesterday’s discussion about science. Dr. Patel began by stating that the scientists of <em>aparā-vidyā,</em> or material knowledge, and those with <em>parā-vidyā,</em> or superior spiritual knowledge, like Śrīla Prabhupāda, must not have any quarrel.</p>

<p>Prabhupāda’s response was frank. “No, there is no quarrel, but we say that these are for the rascals. Yes. <em>Aparā-vidyā</em> is for the rascals.” Unless one comes to the point of understanding Kṛṣṇa, he said, he is still in the <em>aparā-vidyā</em> and is therefore less intelligent.</p>

<p>Dr. Patel was firm in his belief that although we are spirit soul, <em>aparā-vidyā</em> is necessary since we have a body.</p>

<p>Again Prabhupāda disagreed. “No, no. No. That is to make the best use of a bad bargain, how to use the body best to perfect <em>parā</em>-<em>vidyā</em>. That is intelligence. Just like you have a car. A car is not neglected. We don’t kick out the car, but it must be used for spreading Kṛṣṇa consciousness.”</p>

<p>“That is what I say, sir, that you must have the knowledge of car, and that knowledge of car is <em>aparā-vidyā</em>.</p>

<p>“No. No. No. There is no need of. You have the car, you can go from this place to that place very quickly, so utilize it for Kṛṣṇa conscious.”</p>

<p>“They must know how to drive it. That is knowledge. Why do you say no?” Dr. Patel protested.</p>

<p>“That automatically comes,” Prabhupāda said.</p>

<p>“How automatically? Nothing can come automatically.”</p>

<p>Prabhupāda explained. “You’ll see many drivers. They do not know about mechanics, but they are very first-class driver.”</p>

<p>Dr. Patel said. “Well, learning driving is a knowledge of driving.”</p>

<p>“You are a physician,” Śrīla said. “You are not a motor mechanic, but you know how to drive. That is not a very difficult thing.”</p>

<p>Gurudāsa Mahārāja grasped Śrīla Prabhupāda’s point. “Isn’t it when you drive for Kṛṣṇa, doesn’t it become <em>parā-vidyā</em> then?”</p>

<p>“Yes,” Prabhupāda answered. “Everything is done for Kṛṣṇa, that is <em>parā-vidyā</em>.”</p>

<p>Dr. Patel clearly likes to think of himself as an appreciator of both disciplines. He seemed intent on proving that scientists are not as bad as Prabhupāda makes them out to be. This is probably because, as a doctor, he considers himself something of a scientist. In his opinion, if they studied Kṛṣṇa’s energy, in one sense they are connected to Kṛṣṇa. He obviously felt that this study was necessary in order to come to higher spiritual knowledge.</p>

<p>Śrīla Prabhupāda pointed out, though, that the intentions of the scientists are not as noble as the doctor likes to think. “Now scientists say that ‘Now we are advanced. We don’t require God.’ There is a book. Yes. ‘We don’t require God. Now we shall adjust. We shall create human beings according to our necessity.’”</p>

<p>Dr. Patel conceded the point, yet persisted in trying to defend the scientists. But as we walked steadily across the sand, occasional jets booming overhead and the docile sea waves continuously breaking along the shore, Prabhupāda repeatedly reduced his arguments, and he gradually began to let down his defense.</p>

<p>Śrīla Prabhupāda’s playful criticisms of Dr. Patel’s arguments often make us laugh. But for Dr. Patel, being constantly defeated in front of Prabhupāda’s young disciples is sometimes a little hard to take, as he wants us to show him respect. Today though he took it all good naturedly because he actually has great appreciation for Prabhupāda. “So I look a fool and they’ll become wise, all of them, eh?” he said.</p>

<p>Without irony, Prabhupāda immediately reassured him. “Oh, yes. You are wise.”</p>

<p>“They want that I should say something, and then you call me a rascal, and they take pleasure in it.”</p>

<p>Gurudāsa Mahārāja assured him that although we may laugh, we do not do it out of envy, or pleasure in seeing him discomforted. “No, no. <em>Para-duhkhī</em>. A Vaiṣṇava is not happy in someone else’s misery.”</p>

<p>Śrīla Prabhupāda encouraged him that actually he should associate more with the devotees [<em>sat-saṅga</em>]. “Amongst devotees, if you remain, then <em>Kṛṣṇa-kathā</em> will be so pleasing, <em>rasāyanakathā</em>.”</p>

<p>“Even good literature <em>saṅga</em> is also <em>sat-saṅga,</em> is it not?” Dr. Patel asked Prabhupāda.</p>

<p>“Yes. Yes.”</p>

<p>“So in the morning I do your <em>sat-saṅga,</em> and afterwards I do the <em>sat-saṅga</em> of <em>Bhāgavata</em> and <em>Bhagavad-gītā</em>. So it is a continuous <em>sat-saṅga</em>. So don’t say I am not doing it,” Dr. Patel laughed.</p>

<p>“No, no, I don’t say that you are rascal,” Prabhupāda humbly said. “Rather, I think myself rascal because I could not draw you in my temple.” Everyone laughed at this.</p>

<p>Dr. Patel immediately appreciated and reciprocated the sentiment. “You have drawn me lot, but still, you are dragging me by leg nowadays. I think I am not fit to be with you, so far I consider myself. I must correct myself and all my defects. Otherwise I would pollute you.”</p>

<p>It was a pleasant exchange. Dr. Patel was encouraged, and he gave Prabhupāda his assurance that he intends to fully dedicate himself to spiritual life. “I will become after sixty-five.”</p>

<p>Prabhupāda laughed. “You are 15 years late already!”</p>

<p class="verse">* * *</p>

<p>For his final class in Bombay, Prabhupāda elaborated upon some of the qualities of a <em>brahmacārī</em> described by Nārada Muni.</p>

<p>One of these qualities is <em>dakṣaḥ,</em> or expert. He gave the example of Raghunātha dāsa Gosvāmī who was completely disinterested in material affairs. Yet when it was required, he rescued his uncle from a difficult situation by expert political dealings. Prabhupāda said that being a devotee does not mean we cannot do anything else.</p>

<p>“This is called <em>dakṣaḥ</em>.” Not that because he has become Kṛṣṇa conscious and Vaiṣṇava<em>,</em> he is unable to do anything of this material world. No. One who is Kṛṣṇa conscious, he is conscious of everything, and he knows how to deal with them. That is called <em>dakṣaḥ;</em> not that ‘Because I have become Kṛṣṇa conscious I have no knowledge in other things.’ No. That is intelligence, to know something of everything and to know everything of something. That is wanted. You may be expert, a devotee. You know everything of devotional service, but you should not be callous. You know something of everything.”</p>

<p>Another quality he described was <em>śraddadhānaḥ,</em> being fully faithful to the words of one’s spiritual master. Of course, Śrīla Prabhupāda is the epitome of this quality. He told us that when he read a purport on a verse in <em>Bhagavad-gītā</em> by Śrīla Viśvanātha Cakravartī Ṭhākura, he realized the importance of his Guru Mahārāja’s instruction to him to preach in the English language.</p>

<p>He urged us to take particular note of the Ṭhākura’s advice. “<em>Śraddadhānaḥ,</em> faithful. Faithful to whom? To the spiritual master. Whatever he says, the <em>brahmacārī</em> should take it: ‘Yes, it is my life and soul.’ That is the explanation given by Viśvanātha Cakravartī Ṭhākura. He is explaining with reference to the verse <em>vyavasāyātmikā buddhir ekeha kuru-nandana</em>. He very nicely explains. You have perhaps read it. Viśvanātha Cakravartī Ṭhākura has taught very, very nicely about guru. Therefore he has written in <em>Gurv-aṣṭaka,</em> ‘<em>yasya prasādad bhagavat-prasādah</em>.’</p>

<p>“He is the practical example of <em>guru-bhakti,</em> Viśvanātha Cakravartī Ṭhākura. He accepted his guru, Narottama dāsa Ṭhākura. So he said, ‘I am not interested for my salvation or going back to Godhead. I am not interested. Interested means it may come; it may not come. That I don’t mind. But I am interested only with the words of my guru. That is my life. Whether I will be successful or not successful, it doesn’t matter. I must take the words of my Guru Mahārāja as my life and soul.’ Actually that is the secret of success. <em>Yasya deve parā bhaktir yathā deve tathā gurau/ tasyaite kathitā hy arthaḥ prakāśante mahātmanaḥ</em>. So that is the secret of success, <em>śraddadhānaḥ,</em> to accept the words of guru very, very faithfully.”</p>

<p>Prabhupāda’s words had all the more impact because he is the embodiment of faith in guru. With nothing more than faith in the words of his spiritual master, he struggled for thirty years to preach in India before Kṛṣṇa rewarded his efforts with the phenomenal success of his worldwide ISKCON society. It is evident that all the secrets of Vedic knowledge have been revealed to Prabhupāda, and now he is revealing his secret of success to us.</p>

<p class="verse">* * *</p>

<p>Some film producers came to see Prabhupāda during the evening <em>darśana</em> on the roof. Midst the swaying fronds of the coconut trees and as a cooling breeze gently blew, Prabhupāda sat comfortably on his <em>āsana</em> and preached to the guests until 9:00 p.m.</p>

<p>They spoke briefly about the guru who advertises “TM” or “Transcendental Meditation.” When Prabhupāda asked what the purpose of this process was, one of the visitors said that it pacifies the mind, and that also helps to relieve high blood pressure.</p>

<p>Prabhupāda had me look up the meaning of “transcendental” in the dictionary. It was given as “going above the mind.” So he asked, if transcendental means “above the mind,” why is this guru calling his system “Transcendental Meditation” when it only deals on the level of the mind’s activities? It is simply cheating, he told them.</p>', '', '1976-04-17', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- April 18th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'April 18th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Prabhupāda took his massage at 5:00 a.m. after which he bathed.</p>

<p>I had been rushing about rushing about since 3:30 a.m. preparing for the trip. First I packed Prabhupāda’s suitcase, then my own. After that I massaged Śrīla Prabhupāda, and while he bathed, I put away his dirty cloth, set out a clean set and then changed into my clean clothes. After I packed the massage paraphernalia, I set up his <em>tilaka</em> in his room. As he sat at his desk to apply it, I rushed to pack his bathing gear. And after he had finished his <em>tilaka,</em> I hurried back to complete the packing of his desk items.</p>

<p>When I came to his room at 7:00 a.m. with everything packed and ready to go, he was ready to leave and noted that I was also. But he didn’t budge. Instead, he looked at me, tipped his head up slightly, and said, “So, you have something?”</p>

<p>I could not think what he was alluding to; perhaps I had forgotten something.</p>

<p>With a slight upward gesture of his eyebrows he indicated my vest pocket, and it suddenly dawned on me what he was referring to. Last night, at the end of the evening <em>darśana,</em> I had picked up a ten-rupee note that one of his guests had placed at the foot of his <em>āsana</em>. Usually, Prabhupāda immediately puts such <em>dakṣiṇa</em> in his desk drawer or his red bag, and later it is deposited in some account, such as the Māyāpur-Vṛndāvana Trust. This time, however, I had slipped it into my pocket, thinking to give it to him later. But I had forgotten about it. I took itout of my pocket, and he called Girirāja in, handed over the note, and told him to deposit it. That matter settled, he then headed out the door.</p>

<p>Prabhupāda does not overlook the slightest detail. He is always very, very careful to see that whatever anyone gives him is used in Kṛṣṇa’s service and not wasted. He is exact down to the last rupee. Being such a conscientious manager, I can understand why he becomes upset at wasteful and careless disciples for whom, in the Western countries, money is so easily available.</p>

<p>Finally, at 7:10 a.m., together with Puṣṭa Kṛṣṇa Swami and myself, he left for the airport to begin the long journey to Melbourne, via Colombo and Singapore.</p>

<p>Within a short while we were seated on the plane, on our way to Australia. Śrīla Prabhupāda and I were seated in first class, and Puṣṭa Kṛṣṇa Mahārāja sat in the economy section. As we took off, I glanced out the window for a last look at Bombay. We won’t return until August.</p>

<p>As soon as we were airborne, Prabhupāda had his breakfast. I set out each of the four circular, stainless-steel containers and filled them with whatever Prabhupāda indicated from his well-packed tiffin box. From the multi-tiered container he ate <em>sabjīs,purīs,</em> rice, some fried savories, <em>vaḍa,</em> and <em>samosā,</em> as well as some fruit and <em>sandeśa</em>. I served him very carefully, much to the interest of the other passengers.</p>

<p>As he does wherever and whenever he travels, Śrīla Prabhupāda maintained his regular eating schedule. Knowing this I was well equipped for the journey, and I am by now well-versed in all the items that Prabhupāda requires when traveling. On planes he never accepts anything provided by the airlines, because they handle meat. He doesn’t even use the utensils like knives, forks, and spoons, because generally the metal ones have already been used. He will use new plastic ones though. He won’t eat anything touched by <em>karmīs</em>. He will not even accept the salt that they provide. So in addition to the <em>prasādam,</em> I carried small packets of salt, pepper, and ginger.</p>

<p>Generally he eats alone, but on the plane this was not possible. Unperturbed by his surroundings and the curiosity of the passengers, he simply continued following his daily schedule. He ate very slowly and carefully. By watching him take <em>prasādam</em> it was easy to understand that the Lord’s mercy, <em>prasādam,</em> is to be rendered service by the devotee. <em>Prasādam</em> should be eaten as humbly as one performs other forms of devotional service. Completely free from lust and other mundane attributes, His Divine Grace’s devotion is apparent even in the most basic activity of eating.</p>

<p>When he finished his meal, Prabhupāda told me to call Puṣṭa Kṛṣṇa Mahārāja. Together, we shared whatever was left over. I always feel a little uncomfortable eating in Prabhupāda’s presence, thinking that it may offend him. But he always insists that his servants take <em>prasādam</em> whenever he does, and he is concerned to see we are taken care of. Some of the passengers saw us eating the remnants of Prabhupāda’s half-chewed <em>purīs,</em> and I think they were a little shocked. But, of course, in Prabhupāda’s association we were unaffected by their mundane opinions.</p>

<p>At the end of his meal, Prabhupāda very carefully cleaned his mouth with a toothpick, then poured a little water on his hand to cleanse it, before drinking from the cup. He first swilled his mouth out and then drank, and thereafter he completed his ablutions in the bathroom. By the time he returned, I had cleared everything away.</p>

<p>Śrīla Prabhupāda spent the rest of the time before our arrival in Colombo silently chanting <em>japa</em>.</p>

<p>The plane landed in Colombo at 10:30 a.m. As we waited on the tarmac, Prabhupāda recalled his first trip there in 1965 aboard the <em>Jaladuta,</em> bound for the USA. He had never been to Śrī Lanka before, and so the captain of the ship very kindly arranged for a car to take him around the city to show him the sights.</p>

<p>On the two-hour leg to Singapore he read the typed manuscript entitled <em>Matter Comes from Life,</em> sent to him by Mādhava dāsa, one of our scientist devotees.</p>

<p>I moved to an empty seat nearby to give him some room and privacy, and also to nap and chant my rounds.</p>

<p>The plane touched down in Singapore at 5:00 p.m. for a four-hour transit stop. Because Prabhupāda and I were in first class, he decided to use the first-class lounge to rest in. However, it was located inside the airport, and to get to it we had to pass through immigration.</p>

<p>As soon as the officials saw our shaved heads and robes they refused us entry. I felt angry to see these mundane men obstruct the entry of a pure devotee, yet sad that they were guaranteeing their stay in the material world by their offense. Prabhupāda is undergoing so much trouble, with no personal motive whatever, simply to do good for others, yet they were such rascals that they wanted obstruct him.</p>

<p>Puṣṭa Kṛṣṇa Swami argued with them for nearly fifteen minutes before they agreed to let us through. They gave us a special pass, and we proceeded to the lounge, which turned out to be a public bar. It was closed when we first walked in, so Śrīla Prabhupāda sat at one of the tables and took his lunch. Afterward, he lay down on one of the seats to nap.</p>

<p>But before long the bar was opened, and the place soon filled up with noisy drinkers and smokers. Prabhupāda went out to sit—for what turned out to be several hours—on the uncomfortable molded-plastic seats in the terminal.</p>

<p>The plane was due to begin boarding at 8:15 p.m. for a 10:00 p.m. departure to Australia, but some mechanism on the plane required attention, and we boarded an hour late. There were further delays, and we had to sit on the aircraft for another three hours. To keep everybody happy, the crew handed out free drinks to the passengers. Consequently everyone became very noisy and boisterous. Prabhupāda sat patiently through the ordeal without complaining. It was not until 12:30 a.m. that the Qantas flight took off.</p>

<p>Flying in the first-class section offered more sitting room but little facility for lying down. So after a short while in the air, Prabhupāda went back into the economy section and lay across an empty row of seats until about 3:30 a.m.</p>

<p>Our seats were directly in front of the movie screen, and when Prabhupāda returned there was a war movie playing. Without headphones, we both watched as the hero, David Niven, ran up a mountain side, got shot, then blown up, and then again began fighting in hand-to-hand combat.</p>

<p>Prabhupāda looked for a couple of minutes and then turned to me with mock surprise. “Still alive?” he said, and laughed. With the sound turned off the movie looked like what it was, a silly make-believe, the epitome of the material world. Prabhupāda turned away and chanted <em>japa</em>.</p>

<p>Although he tolerated everything without complaint, the unbroken, seven-hour flight to Australia, plus the long delay in Singapore, was very difficult for him. He mentioned that any trip longer than three to four hours is a strain. Nevertheless, for preaching he is prepared to accept any difficulty; his own personal comfort is his last consideration.</p>', '', '1976-04-18', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


END $$;
