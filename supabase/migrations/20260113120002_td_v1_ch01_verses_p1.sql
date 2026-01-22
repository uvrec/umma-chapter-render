-- ============================================
-- TD Volume 1, Chapter 1 - Verses
-- ============================================

DO $$
DECLARE
  v_book_id uuid;
  v_canto_id uuid;
  v_chapter_id uuid;
BEGIN
  SELECT id INTO v_book_id FROM public.books WHERE slug = 'td';
  SELECT id INTO v_canto_id FROM public.cantos WHERE book_id = v_book_id AND canto_number = 1;
  SELECT id INTO v_chapter_id FROM public.chapters WHERE canto_id = v_canto_id AND chapter_number = 1;


  -- November 26th, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'November 26th, 1975',
    '', '', '', '',
    '', '', '', '',
    E'<p><strong>ISKCON, 19, Todar Mal Lane,</strong></p>

<p><strong>Bengali Market, New Delhi</strong></p>

<p>At 11:30 a.m. I was sitting alone in the tiny temple room chanting in front of the Deities when Harikeśa walked in. Stopping at the open door he peered at me intensely through his thick glasses. “Do you know how to massage?” he asked.</p>

<p>“No, I’ve never done it in my life.”</p>

<p>“Well, go up on the roof of Prabhupāda’s apartment and watch how Upendra massages Śrīla Prabhupāda. Upendra is leaving tomorrow, so someone else will have to give Śrīla Prabhupāda his massage.”</p>

<p>Hardly daring to believe what I had just heard, I didn’t wait around. I immediately ran down the street to number nine, a small two story building, and quickly climbed the steep steps, past the ground-floor apartment of the building’s owner, Mr. B. N. Mukherjee, past the mezzanine, past Śrīla Prabhupāda’s flat, and up the final flight to the roof.</p>

<p>It seemed too good to be true; things like this just don’t happen! But sure enough, as I came out of the covered stairwell, I found His Divine Grace dressed in his <em>gamchā</em>, sitting on a straw mat in the sunshine. His eyes were closed, and Upendra was kneeling behind him, massaging his back with mustard oil. I offered my obeisances and sat down to watch.</p>

<p>After a minute Śrīla Prabhupāda opened his eyes and looked at me inquiringly. With a slight tip of his head, and raising his eyebrows, he asked, “Hm? What is that?”</p>

<p>I explained that Harikeśa had sent me to learn how to render the massage. “All right,” he said simply, and again closed his eyes until the end of the massage. When it was over, Prabhupāda returned to his rooms downstairs to bathe and eat his lunch.</p>

<p>Upendra took just two minutes to explain to me some of the finer techniques of massage—the amount of time to spend on each part of his body, the correct order to do it in, and the two types of oil to be used. Upendra confirmed that he would be leaving tomorrow for a preaching assignment in Fiji. And since Nitāi, Prabhupāda’s other servant, had gone to Bombay to renew his visa, Śrīla Prabhupāda would need someone to give him his noon and evening massages, at least while he remained in Delhi. Harikeśa was fully engaged in transcribing Śrīla Prabhupāda’s tapes and cooking, so he was unable to do it. Under the circumstances, it seemed that I was the only one available to execute this personal service.</p>

<p>Apparently, early this morning, Śrīla Prabhupāda and Harikeśa had discussed how to arrange for his morning massage. His Divine Grace had noticed me guarding the door, and remembering me from Australia, thought I might be able to do it. Harikeśa apparently had strong reservations about my suitability. He saw me in action as the temple commander in Vṛndāvana two months ago, when I had a somewhat violent exchange with a young Bengali man. It was only resolved through Śrīla Prabhupāda’s personal intervention. Despite this, Prabhupāda has decided to give me a chance.</p>

<p>I returned to the temple quite unable to comprehend my good fortune. I am apprehensive but utterly ecstatic at the extraordinary turn of events. As requested, I went back to Śrīla Prabhupāda’s quarters at 9:00 p.m. It was the first time that I had ever been in Prabhupāda’s rooms at such a late hour. To see him smiling and relaxed, sitting back and chatting with his servants (to be part of it!), was a privilege I had never even dreamed of.</p>

<p>After a few minutes Śrīla Prabhupāda retired to his bedroom, and Upendra signaled for me to follow.</p>

<p>As Upendra stood at the side of the bed massaging Śrīla Prabhupāda, I looked on through the semi-darkness of the room. Upendra explained that if the bed was large enough Prabhupāda allowed his servant to sit cross-legged beside him. With this bed that was not possible.</p>

<p>Śrīla Prabhupāda dozed lightly as Upendra carefully kneaded and squeezed his calves, thighs, and feet. After a few minutes, he turned on his side, and Upendra worked on his left hip. This hip sometimes becomes numb due to poor blood circulation.</p>

<p>Upendra whispered to me that once, while he was massaging at night, Prabhupāda began to snore, so he stopped massaging and began to tiptoe out of the room. Just as he reached the door, Prabhupāda’s voice came from out of the darkness, “Oh, you are finished already?” He had Upendra return to continue the massage.</p>

<p>There is no set duration. One simply keeps going until, on awakening, Prabhupāda tells the servant he may leave. Then he generally turns over and goes back to sleep again for a short while before getting up to begin his night time writing.</p>

<p>After only ten minutes Śrīla Prabhupāda gave a gentle “Hm,” signaling that the session was over. We left the bedroom, and Harikeśa escorted us out of the apartment and locked up for the night.</p>

<p>I never expected that such an opportunity would ever actually come my way. In <em>śāstra</em> it says that even a moment’s association with a pure devotee is enough to bestow upon one the perfection of life and that such association is rarely achieved. I never dreamt I would be the recipient of such good fortune, even after lifetimes of many rendering devotional service. Everything has occurred simply by Lord Śrī Kṛṣṇa’s arrangement and Śrīla Prabhupāda’s causeless mercy.</p>

<p>Excited and elated, I immediately rushed to the New Janata Book Depot, a small shop on the corner next to Nathu’s Sweet Shop, and purchased a blank, lined notebook. Although my new engagement is to last only the next couple of days while Prabhupāda remains in New Delhi, I have decided to keep a diary of events so that in the future I will have something with which to remember this rare chance to personally serve His Divine Grace.</p>', '', '1975-11-26', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- November 27th, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'November 27th, 1975',
    '', '', '', '',
    '', '', '', '',
    E'<p>While Prabhupāda took his morning walk, I cleaned his apartment. It is a small residence, with four rooms—very basic, but adequate quarters. The entry from the stairwell brings one into the main room, measuring about twenty feet by ten. I dusted off the sparse furnishings, including Prabhupāda’s sitting place and the small, low desk at which he spends most of his time either receiving guests or translating during the night. I went through the back and straightened up the servants’ room, where Harikeśa and Hansadūta are staying.</p>

<p>Prabhupāda’s bedroom, about the same size as theirs, runs off from the side of it. It didn’t take long to change the sheets on the small single bed and scrub out the tiny, cramped attached bathroom. Going back through the servants’ room I came through a narrow passageway to the very small kitchen. I cleaned its unpolished stone benches and white ceramic tiled walls and swept off the narrow back veranda where Harikeśa seems to do most of the cooking on a coal fired bucket stove. Finally, I wiped the floors, all standard yellow mosaic stone and marble chip, mostly uncovered except for the thin, cotton rug, or <em>dhuri</em>, in the sitting room. I finished well before His Divine Grace returned from his daily walk.</p>

<p class="verse">* * *</p>

<p>At 11:00 a.m. I reported to the flat for my first day’s duty as masseur. I walked in just as Śrīla Prabhupāda was giving his blessings to Upendra for the success of his new preaching assignment in Fiji. After receiving Prabhupāda’s garland, Upendra left for the airport. Looking at me, Prabhupāda casually tipped his head from side to side and signaled that it was time for his massage.</p>

<p>Prabhupāda went up to the roof and changed into his <em>gamchā</em>. I was already wearing mine. As he sat on the straw mat, all the instructions Upendra had given me began to whirl through my mind. Now I was on my own. There was no trial, no practice session, no comment from Śrīla Prabhupāda—nothing. I was in at the deep end! I had to concentrate hard to overcome my nervousness and remember what to do. I had never massaged anyone before, what to speak of even touch His Divine Grace. So I mentally prayed to Kṛṣṇa to please give me sufficient intelligence to do it nicely for Śrīla Prabhupāda’s pleasure.</p>

<p>In order to ensure a proper service attitude, I first offered Śrīla Prabhupāda my humble obeisances before touching him. Prabhupāda sat cross-legged as I fought my nervousness and knelt upright before him. I took hold of the bottle of sandalwood oil, poured a few drops into the palm of my hand, and began to massage Prabhupāda’s head. Sandalwood has cooling properties and is therefore good for the brain.</p>

<p>After only a minute my thumbs and finger joints became suddenly, and severely, sore. Every knuckle ached so much I thought my hands were going to seize up. It was a sensation I hadn’t foreseen. My mind flooded with signals of protest, which I fought to transcend. I prayed to Kṛṣṇa for the determination not to fail at my first attempt. By concentrating on trying to please Śrīla Prabhupāda I was able to keep the motion of my hands going without interruption. Thankfully, the pain soon disappeared, my hands loosened, and I pressed and rubbed Prabhupāda’s smooth, shaved head without difficulty.</p>

<p>Not knowing any particular techniques, I simply tried to think what it would be like to receive the massage, how each stroke of thumb or finger would feel, and then I acted accordingly.</p>

<p>I took great care not to jerk, scratch, or poke him, yet at the same time give him a firm and smooth massage, working the oil into his skin thoroughly. It wasn’t a question of merely rubbing in some oil. The trick, I realized, was to apply pressure, moving my fingers and thumbs backward and forward, while holding his head steady and balanced. I was extremely cautious when massaging his temples, forehead, and around his eyes, for the oil could easily make the thumbs slip.</p>

<p>After fifteen minutes I moved around to Śrīla Prabhupāda’s back and switched to mustard oil, which is used on the rest of his body. Mustard oil vitalizes and tones the skin, giving warmth to the body. I spent another fifteen minutes squeezing, pressing, and rippling the supple muscles of his neck, shoulders and back. With both circular and up-and-down motions of my thumbs, I gave his lower back and spine a firm work over.</p>

<p>Next, moving to his right side, I sat cross-legged and massaged his chest and stomach. These motions were all circular, made with the flat of my hand, all the time directing the massaging motion toward his heart.</p>

<p>Concentrating intensely on what my hands were doing, I failed to notice that I was sitting extremely close to His Divine Grace, breathing directly into the side of his face. I was embarrassed when Prabhupāda suddenly leaned away from me, half turning his head and giving me a sidelong look. He cautioned me, and I mentally made a note to remember to look away in future.</p>

<p>After ten minutes I moved to his right arm. With his arm outstretched and hand resting palm down on my right knee, I worked his biceps, forearm, wrist, and the joints of his hand. I noted that his hands were very refined, his palms especially soft and smooth. I was extremely apprehensive when it came to popping his joints by pulling each finger, as I had to tug quite hard. Horrible thoughts of dislocation rushed through my mind, but Prabhupāda didn’t seem to mind at all. After twenty minutes on his right side I moved to his left arm and repeated the procedure.</p>

<p>Then I moved to his front. He stuck his legs out, and I spent about fifteen minutes on each one, first his left leg, and finally his right. Prabhupāda warned me not to touch his knee that is still bruised from his recent car crash in Mauritius. He is treating this with a poultice of hot ghee and neem leaves.</p>

<p>I carefully massaged his thighs, calves, and ankles and finished with his feet, which I made a special effort to massage as nicely as possible. Rubbing my thumbs up and down his high arches and pressing the joints in the ball of each foot, I ended by pulling each individual toe, giving a slight squeeze to the soft, fleshy end portions. This made my thumb and forefinger snap together as they came up over the tips of his toes. Now I have some practical understanding of the meaning of “lotus feet,” as Prabhupāda’s feet are surprisingly soft and delicate, just like the petals of a flower.</p>

<p>After an hour and a half, I reluctantly concluded my service by again offering obeisances. Śrīla Prabhupāda stood up, took a little mustard oil in his palm, and applied it to the various gates of his body—ears, nostrils, genital, and anus. He then went downstairs to bathe and take his lunch.</p>

<p>Throughout the massage he had not said a word but sat silently with his eyes closed, his body relaxed, glistening and golden in the gentle winter sun. Later, I was relieved and elated to find out that Prabhupāda had commented I gave a good massage.</p>

<p class="verse">* * *</p>

<p>In mid-afternoon I took an auto-rickshaw to the flower stands in Chandni-chowk in Old Delhi and bought the biggest garland I could find, just as I had done yesterday. It took over an hour to go there and back in the noxious, noisy, dirty Delhi traffic, but it was worth it. I waited to present it to Prabhupāda at the beginning of his <em>darśana </em>at 4:30 p.m.</p>

<p>He was pleased to receive it, and this gave me an excuse to remain in the <em>darśana </em>and spend more time with him. By now news of his arrival had spread, so a number of well-wishers and Life Members came to see him.</p>

<p>Prabhupāda also met with several potential English-Hindi translators. He is eager to see his books published in the Indian languages, but in ISKCON so far we have no trained translators among our devotees. Thus, Gopāla Kṛṣṇa has been publicly advertising for qualified Hindi translators.</p>

<p>Śrīla Prabhupāda personally interviewed all the applicants who responded, carefully checking their philosophical understanding as well as their scholastic abilities. He wants to be certain that the translator is capable of conveying precisely the same meaning as the original text and that no tinge of impersonalism creep into the translation of his books. Unfortunately, India is teeming with false interpretations of <em>śāstra</em>, contaminated primarily with the Māyāvāda notion that God is impersonal. So to find someone who is free from such impure influence is no easy task.</p>

<p><em>Darśana </em>ended around 7:00 p.m. After the guests left, His Divine Grace sat with his secretary and the local ISKCON managers. He discussed their preaching activities, giving advice and suggestions.</p>

<p>Harikeśa asked me to also leave along with the guests. He wanted to make the point that although I am massaging Śrīla Prabhupāda for the next day or two, I should not consider myself a member of Prabhupāda’s personal party. It seemed a bit pointless to me since I had to return at 9:00 p.m. for his evening massage, but I wasn’t disappointed. In these past two days I have already experienced more personal association with Śrīla Prabhupāda than at any time in the last nearly four years as a devotee. So I have no complaints. I’m just eager for whatever bits of nectar I can get.</p>

<p>When I returned I presented Śrīla Prabhupāda with some thick, hole-proof, knee-length socks from Australia. It’s getting cold in the mornings, and I had two new pairs I hadn’t worn. Prabhupāda looked inquiringly from behind his desk. “Are they wool?” he asked.</p>

<p>I looked at the labels. “No, Śrīla Prabhupāda.”</p>

<p>“Oh.” His reaction was one of mild disappointment, and without saying anything more, he continued with his work. Thinking that Prabhupāda didn’t want the socks, Harikeśa prabhu told me to keep them.</p>

<p class="verse">* * *</p>

<p>The evening massage, which had appeared to be easier than the morning session, was actually more difficult. The house was quiet, the lights were out, Śrīla Prabhupāda dozed lightly, and I was left to massage with only my restless, wandering mind to keep me company. Were it not for the ache in my legs, which developed from standing in one spot, I might easily have succumbed to fatigue. Yet I managed to keep going, steadily and gently compressing and squeezing through Prabhupāda’s thin <em>dhotī</em>, up and down, up and down. After twenty minutes his faint “Hm” was a signal that my first day as his masseur was over.</p>

<p>I went back to the temple to rest, feeling satisfied with my first attempts to personally serve his Divine Grace, and completely enlivened from the intimate contact I had had with him.</p>', '', '1975-11-27', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- November 28th, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'November 28th, 1975',
    '', '', '', '',
    '', '', '', '',
    E'<p>At six o’clock this morning Harikeśa came panting in to the small <em>brahmacārī āśrama</em> exclaiming, “Where are the socks? Prabhupāda’s asking for them!” His face fell when he saw I was already wearing one pair. Naturally I couldn’t give him those. Fortunately the other pair was still unused. He gratefully took them to Prabhupāda. They fit perfectly, and he wore them on his walk.</p>

<p class="verse">* * *</p>

<p>Śrīla Prabhupāda attended a morning program at the Jorbagh Colony organized by Mr. Susil Ansal, the son-in-law of the owner of the Tiger Lock Company, Mr. S. K. Saigal. Jorbagh is a fairly prestigious neighborhood next to Lodi Gardens, one of New Delhi’s historical landmarks. The program was held at the local community hall—a large, ugly, concrete building, quite featureless and uninviting, with a cavernous interior reminiscent of a school hall.</p>

<p>A small but interested audience gathered to hear Śrīla Prabhupāda deliver an excellent lecture from the Fifth Canto of the <em>Śrīmad-Bhāgavatam</em> on King Ṛṣabhadeva’s instructions to His one hundred sons. As always, whether speaking to one man or ten thousand, Prabhupāda’s speech was earnest and grave. He applied himself fully to the great task of cutting through the clouds of illusion that keep every living being firmly bound up in material existence.</p>

<p>Śrīla Prabhupāda explained that our real problem is this body. “<em>Nūnaà pramattaḥ kurute vikarma yad indriya-prītaya āpṛṇoti</em>. We have now become mad after sense gratification. <em>Mattaḥ</em> means mad, and when the prefix <em>pra</em> is added it means <em>sufficiently</em> mad. Not only mad, but sufficiently mad, and we are engaged in activities which are forbidden...this is called <em>vikarma</em>.”</p>

<p>He explained that the knowledge to free oneself from this madness depends upon which authority one accepts. One can accept the atheistic views of materialistic scientists, which are based on nothing more than mere speculation. Or one may accept śāstric knowledge, which is practical, authoritative, and accepted by all the great thinkers and saintly persons.</p>

<p>Challenging those who accept the views of the scientists, Prabhupāda cited an example from <em>śāstra</em> that describes the moon as farther way from earth than the sun. According to the <em>Bhāgavatam</em> it’s some 1,600,000 miles higher than the sun.</p>

<p>Scientists say that the sun is 93,000,000 miles away from earth, he said, which, if we accept, means that the moon is almost 95,000,000 miles distant. “So,” he asked, “how could the astronauts have journeyed there in only four days? “You may say that you have not practically experimented; but what you have experimented? You also hear from others. You believe that they have gone to the moon planet. You have not gone. You have heard from somebody in the newspaper, that’s all. That is your authority.</p>

<p>“So if you can believe in the newspaper, then I cannot believe in <em>śāstra</em>? It is a different source of knowledge, but one takes one source, another takes another source. Our source of knowledge is Kṛṣṇa, or Kṛṣṇa’s disciples. This is the source of knowledge—<em>avaroha-panthā</em>, knowledge coming from higher authorities.”</p>

<p>Prabhupāda gave a concise conclusion, frankly telling his sophisticated and somewhat Westernized audience what their real business in life is. “You have to accept this process of austerity by which you purify your existence. Then you will get deathless life, eternal. This is science. This <em>Bhāgavata</em> literature, this Vedic literature, is giving you information how you can revive your original, eternal life.</p>

<p>“That is the business of human life; not to become mad like hogs and dogs and simply work very hard, ‘Where is stool?’ and eat it and get some strength and then enjoy senses. This is not life. “In the human form of life if we do not purify our existence, if we do not realize God, if we do not understand what is my relationship with God, then we are simply wasting time living like cats and dogs. These things should be stopped. And our Kṛṣṇa consciousness movement is meant for stopping this rascal civilization and giving you life. Thank you very much. Hare Kṛṣṇa.”</p>

<p>Prabhupāda couldn’t have spoken Lord Caitanya’s message more lucidly, establishing it clearly that he himself is the undisputable spiritual authority for this age. His powerful lecture filled us with renewed conviction and enthusiasm to practice Kṛṣṇa consciousness. The audience responded altogether favorably, although some of the questions showed a rather dismal lack of attentiveness. Still, Prabhupāda patiently answered them in his own inimitable style, always respectful, but candid.</p>

<p>His first questioner asked, “And what do you think about the factor in reincarnation? Do you think it has got any significance?”</p>

<p>“I do not think anything,” Prabhupāda stated frankly. “I have already explained. We do not think, ‘perhaps, maybe’.”</p>

<p>The man persisted. “Do you think reincarnation is there?”</p>

<p>“Yes, that is stated in the <em>śāstra</em>.”</p>

<p>“What is your opinion about it?”</p>

<p>“I have no opinion. I take <em>śāstra</em> as it is.”</p>

<p>“After all, you are writing...”</p>

<p>Seeing he wasn’t getting anywhere, Śrīla Prabhupāda didn’t bother any more. He cut off the exchange by taking a question from another man. “I accept the goal is self-realization,” the second man asked, “but my general difficulty is that the soul is so difficult to turn about, but...”</p>

<p>“It is very difficult, undoubtedly,” Śrīla Prabhupāda said, “but if you train from the very beginning of life...That is stated by Prahlāda Mahārāja. He was child, five years old. In tiffin hours the other children of the demons, they were playing, and Prahlāda Mahārāja was asking to sit down and hear him. He was preaching, ‘My dear friends, don’t spoil your life by playing. Now this is the period of understanding <em>bhāgavata-dharma</em>.’ <em>Bhāgavata-dharma</em> means to understand God and our relationship with God and act accordingly. We might have done mistakes in our life, but if we train our children in the <em>brahmacārī </em>system and gradually they understand the <em>bhāgavata-dharma</em>, at least their life becomes perfect. And in the <em>Bhāgavata</em> it is ordered in this Ṛṣabhadeva’s instruction: <em>pitā na sa syāj jananī na sā syāt sva-jano na sa syāt gurur na sa syāt</em>: ‘One should not become guru, one should not become kinsman, one should not become father, one should not become mother...’ <em>na mocayed yaḥ samupeta-mṛtyum</em>, ‘if one cannot give lesson to the children how to avoid death.’</p>

<p>“This is the duty of the guardians, of the government, how to avoid death. Where is that education? So that is the defect of the modern education. There is no training. It is going on, very risky civilization.”</p>

<p>The man was looking for something more immediate though. “Swamijī, I was asking point in a different way, that we are so helpless. We are born as human being with inherent weaknesses and shortcomings, like <em>kāma</em>, <em>krodhā</em>, <em>moha</em>, <em>lobha</em> [lust, anger, illusion, greed]...”</p>

<p>“Yes, that I know.” Prabhupāda assured him. “But you can rectify it provided you like. But if you don’t like to rectify yourself, how it can be done? If you are thinking that you have got so many defects, you rectify your defects. Just like these European, American boys. They were all illicit sex hunters and intoxicators and meat-eaters. That is their daily affair. How they have given up? They have decided that, ‘We shall rectify ourself.’ You rectify yourself and you will be able to do. Are you prepared to rectify yourself?”</p>

<p>Still unable to grasp that rectification was his own choice, the man answered, “Why nature has given us...”</p>

<p>“Nature has made you a dog. Why should you remain a dog? You should become a human being. That is your duty.”</p>

<p>After another question Śrīla Prabhupāda stopped. The audience was well satisfied, and Mr. Ansal concluded the program with a final speech in praise of Śrīla Prabhupāda. His Divine Grace then returned to the temple in time for his massage.</p>

<p class="verse">* * *</p>

<p>It was during Prabhupāda’s noon massage that I made my first major mistake as his servant. Because of his weak heart Śrīla Prabhupāda requires to bathe in warm water, which, unlike the West, is not usually available on tap in Indian houses.</p>

<p>Upendra had shown me how to set up a bucket of water and a portable immersion heater in the <em>varṣati</em>, the small room on the roof, at the beginning of the massage. It takes about twenty minutes for the water to heat up, so the servant must remember to switch it on halfway through the massage in order that the water is hot by the end. Then I am supposed to take it downstairs to the bathroom, where Śrīla Prabhupāda mixes it with another bucket, of cold water, according to his liking.</p>

<p>Concentrating on massaging him nicely, I completely forgot about heating the water until the very end of the massage. Thus, Prabhupāda had to wait. I was embarrassed at my own stupidity and very regretful that Śrīla Prabhupāda had to wait around because of my foolishness. He was slightly annoyed, but kindly did not reproach me. I think this was both because I was new to the service and because of my remorse.</p>

<p class="verse">* * *</p>

<p>Harikeśa usually tries to time things so that lunch is ready just at the moment His Divine Grace finishes his bathing and dressing. And although yesterday Harikeśa prabhu made it quite clear that I am allowed into Prabhupāda’s apartment only during massage and <em>darśana</em> times, today he was too busy cooking to usher me out after the massage. So, by lingering for a few minutes, I got the chance to help Harikeśa serve Śrīla Prabhupāda his <em>prasādam</em>.</p>

<p>Prabhupāda ate his meal on a <em>choṇki</em>, a small wooden table about a foot high, in his bedroom. I first served his <em>thāli</em>, a full plate with various preparations of <em>sabji</em>, rice, <em>dāl</em>, chutney, and a sweet, all in their own small bowls. After five minutes Prabhupāda rang a small hand bell.</p>

<p>Harikeśa, squatting out on the balcony before the small bucket of hot charcoal, immediately tossed a piece of flat, rolled-out dough onto the coals. By expertly manipulating it with a pair of tongs, he allowed it to cook on both sides. As it puffed into a kind of organic hot-air chamber, he carefully retrieved it and dropped it on a small plate, which he then handed to me. Hot <em>capātīs</em> were then brought in to Śrīla Prabhupāda, as required, fresh from the stove. Fresh and hot is the Maḍwari <em>dhawa</em> style of eating, and Śrīla Prabhupāda ate three <em>capātīs</em> like this.</p>

<p>Acting as the waiter, I found it exciting to run in, bow down, and then drop the hot <em>capātī</em> on Prabhupāda’s plate. He deftly prodded it with delicate and aristocratic movements of his first and middle fingers to release the hot air. After flattening it, he tore off a small piece using only his right hand, gathered up some <em>sabji</em>, and popped the morsel into his mouth.</p>

<p>After eating, Śrīla Prabhupāda went into the bathroom, while I removed his plate and cleaned the <em>choṇki</em>. Prabhupāda then sat in his <em>darśana</em> room for a brief interval before retiring for his afternoon nap. Meanwhile, Hansadūta, Harikeśa, and I happily shared the remnants of Prabhupāda’s meal.</p>

<p class="verse">* * *</p>

<p>During the afternoon <em>darśana</em> Prabhupāda had me stand at the door to distribute sweets to each guest as they departed. Śrīla Prabhupāda was insistent that every visitor must receive some <em>prasādam</em>. Because there are no devotees available to prepare the sweets, Prabhupāda has given Tejīyas permission to buy them from the Bengali Sweet Shop on the corner. He said those sweets may even be offered to the Deities, as they are cooked with pure ingredients.</p>

<p class="verse">* * *</p>

<p>These few new engagements have enabled me to remain in Śrīla Prabhupāda’s quarters for most of the day, albeit seemingly against Harikeśa’s better judgement. Nevertheless, Harikeśa has given me some helpful guidance on how to serve Śrīla Prabhupāda properly. Today he explained to me that obeisances should be offered each time one enters or leaves Śrīla Prabhupāda’s presence, whether by his coming and going or by one’s own.</p>

<p>From the past few days’ experience I am beginning to understand that humility is everything; the essential basis on which all other service is built. Being humble is the only means to counteract offenses and is the key to a good service attitude. Śrīla Prabhupāda is tolerant of ignorance, if one is eager to serve.</p>

<p>This whole experience is tremendous. It is extremely blissful to be so close to the vital essence of what Kṛṣṇa consciousness is all about—association with and service to the pure devotee of the Lord.</p>', '', '1975-11-28', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- November 29th, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'November 29th, 1975',
    '', '', '', '',
    '', '', '', '',
    E'<p>For his morning walk Prabhupāda followed a route that took us along Tansen Marg, across Mandi House, up Feroz Shah as far as Curzon, then left, almost to India Gate, before turning along Tilak Marg and then returning.</p>

<p>During the course of the walk the conversation was lively, with the science-versus-religion dialogue predominating. Prabhupāda commented on the numerous <em>kalā-kendras</em> in the area. <em>Kalā</em> means “art” or “culture,” and in Bengali <em>kalā</em> also means “cheating.” Prabhupāda pointed out that although their presentations are supposed to be cultural for the upliftment and refinement of human life, they are not culture at all. He said that real culture means to understand that everything comes from the soul.</p>

<p>People give attention to the activities of the body, such as the vibrations produced by the tongue, without really understanding the cause. When the body is dead, there is no more singing, although the same tongue and ears are present. They don’t know who is the person singing and hearing. Materialistic scientists claim that it is all chemical reaction, but they cannot produce such a chemical.</p>

<p>When Ambarīṣa prabhu said the scientists were simply bluffing, he agreed. He humorously emphasized his point by declaring that the scientists should be “kicked on the face.” They were offering the public “postdated checks” by promising to deliver proof of their claims in the future, but an intelligent man should not be cheated in this way.</p>

<p>Harikeśa suggested the scientists should receive their own treatment. “They should have their salaries paid by postdated check.”</p>

<p>“No, they will not accept that. That they will not accept,” Prabhupāda smiled.</p>

<p>“In the future we will pay you!” Harikeśa joked.</p>

<p>And Tejīyas added, “When you find the chemicals!”</p>

<p>Prabhupāda stopped and entertained everyone with an amusing parody of a dependant scientist and his boss. “Now you starve. In future I shall pay!” he said, imitating the boss. Then, taking the part of the scientist, “How shall I eat?”</p>

<p>“Now, you starve. In future, you’ll get payment!”</p>

<p>He had everyone laughing as he walked on, continuing to expose the folly of modern man in accepting such false promises.</p>

<p>Defending the scientists, Harikeśa cited some of their advances. In Russia, for example, they claim to have grafted an extra head onto a dog.</p>

<p>Prabhupāda had a quick answer for him. He pointed out that Rāvaṇa had ten heads, and still he could not save himself from the hands of Rāma. “Rāvaṇa was thinking, ‘Who can be more intelligent than me?’ But, still Lord Rāmacandra proved ‘Yes, I am better intelligent than you!’”</p>

<p>A Punjabi devotee, Caitya-guru, observed that in India people now regard their own philosophies to be outdated and are showing increasing interest in Russian books and Soviet philosophy.</p>

<p>Prabhupāda asked what the basis of Marxist philosophy was.</p>

<p>A devotee replied, “Matter is supreme.”</p>

<p>“If matter is supreme,” Prabhupāda argued, “why don’t you combine matter and let it move? What is that Supreme which is moving this matter? If they do not know, then again a rascal, in spite of so much philosophy and so much communism. Why, when Stalin and Lenin died, they simply remained matter? Why it was not moving? Where is that matter?”</p>

<p>Harikeśa tried to argue that Marxism is actually a social philosophy. He explained that the main point of Marxism is to eliminate the unfair conditions in the world, whereby a few people are very wealthy while others remain poverty stricken like in India. The communist tries to abolish the poor by taking money from the rich.</p>

<p>“Again that, ‘We are trying to abolish,’” Prabhupāda mocked. “The postdated check again!”</p>

<p>Ambarīṣa, a multimillionaire in his own right, added his own pertinent observation. “In Russia, everyone is poor.”</p>

<p>“But at least they are equal,” Harikeśa answered.</p>

<p>Again Prabhupāda shot him down. “Well, when you become poor, then naturally it is equal. There is no rich man. If everyone is fool, then everyone is equal, that’s all.”</p>

<p>Prabhupāda recalled how the taxi drivers in Moscow were so poor they were begging for something extra. Most people were so poor they couldn’t afford a taxi. They were walking on the street.</p>

<p>“Yes,” Harikeśa argued. “But why should somebody be rich, and I be poor? What gives him the right to have money?”</p>

<p>“That is everywhere,” Prabhupāda answered. Tipping his head towards Ambarīṣa, he continued, “He is born in a rich family, and I am born in a poor family. So why this is happening?”</p>

<p>“Yes, that’s unfair,” Harikeśa said. “I mean, I should take his money.”</p>

<p>“No, no, not unfair. This is nature’s arrangement, <em>uccāvacair</em>. Why one has become animal? Why one has become man? The same living entities?”</p>

<p>“Chance!” Harikeśa declared.</p>

<p>Prabhupāda stopped. “Chance! Who is making this chance? Can I make you by chance a dog? That is not possible. There is no such chance. It is by <em>karma-phala</em> [the fruit of one’s past activities]. Just like you infect some disease, you suffer from that disease. So this happens to the rascal. One who is intelligent, he does not infect. He is always cautious. Therefore this chance of infection is not there. Actually you cannot say, ‘chance.’ It is your ignorance. You create ‘chance.’ Because you do not know what will happen after something, on account of ignorance it is ‘chance.’ But if you are fully aware, there is no question of chance. An intelligent student, he does not think, ‘By chance, I may be passed.’ He reads properly. He appears in the examination, gives the proper answer. It is not chance. And if he thinks, ‘All right, by chance I will be passing the exam,’ is it very intelligent?</p>

<p>“These rascals are talking like that. There is no question of chance. On account of ignorance they commit something infectious and they suffer. And because they cannot explain, they say it is chance. It is not chance. It is due to some cause.”</p>

<p>Hansadūta said Marx had philosophized that capitalist systems would eventually collapse on themselves, and communism would be the natural outcome.</p>

<p>Even if that were true, Prabhupāda wouldn’t give Marx any credit. He said that when there is no capital, naturally they will be communistic. That was already predicted by Vyāsadeva. “That is not a communistic idea. That is the future of Kali-yuga. That is mentioned in the <em>Bhāgavatam</em>. <em>ācchinna-dāra-draviṇā yāsyanti giri-kānanam</em>. They will be harassed by famine, taxation, and starvation. Naturally they will be disappointed, <em>ācchinna</em>. That is already told.”</p>

<p>He noted how in Communist countries people must queue for hours just to obtain basic commodities. That is all due to godlessness.</p>

<p>Going down as far as the Indian Transport Offices we turned left on Sikhandra Road, gradually making our way back to Todar Mal Lane by crossing over College Road and coming down Barbar Road. As we made our way along the dirty footpaths, Prabhupāda intermittently drew our attention to the deteriorating state of India’s capital. He said that people are starving, and yet they are building museums of natural history and so forth to show heaps of dead stones and bones. This cheating and bluffing is going on, he said, at the cost of the poor man’s blood. “There are so many buildings but there is not a single building where spiritual culture is discussed, although it is the real basis of life.”</p>

<p>As we arrived back at the temple, Prabhupāda ended the conversation on an ominous note. “Civilization will collapse very soon, all over the world. It will collapse. Either you may bring this ‘ism’ or that ‘ism,’ this civilization will collapse. People will become mad, being harassed in so many ways. When one is harassed in so many problems, he commits suicide. So that position is coming.”</p>

<p>“Or he starts a war,” Harikeśa said.</p>

<p>“Yes.” Prabhupāda agreed. “When the government cannot adjust, they start a war.”</p>

<p class="verse">* * *</p>

<p>Ambarīṣa has come here to Delhi for a special purpose. He plans to finance a new development in Kurukṣetra and he has already donated $150,000 for the project. Prabhupāda wants to build a Varṇāśrama University there, as well as a temple of Kṛṣṇa and Arjuna. To this end he has been in contact with Gulzarilal Nanda, a former home minister and twice the acting prime minister of India. Gulzarilal Nanda is now in charge of a special trust set up to develop the Kurukṣetra area for pilgrims.</p>

<p>Nandajī arrived at the temple at noon and came up on the rooftop. As Prabhupāda sat on a straw mat in his <em>gamchā</em> receiving his massage, Nandajī perched on a chair. They discussed the Kurukṣetra project.</p>

<p>They talked first about the work Nandajī has done to restore and develop the Kurukṣetra area and what Prabhupāda’s requirements would be for his proposed college. Then gradually ranged onto more general topics. At the end, they agreed to meet once again on December 1st, in Kurukṣetra. Prabhupāda will examine the land, and continue the discussions on his plans for development at the site.</p>

<p class="verse">* * *</p>

<p>Later, around 9:00 p.m., Prabhupāda finished eating a little <em>prasādam</em> and then asked me take his plate, along with a basket of fruit that had been given to him earlier in the evening, down to the temple. The fruit was to be given to the Deities, and Śrīla Prabhupāda’s plate was to be washed off and cleansed. Picking up his plate in one hand and the fruit in the other, I started for the door, but Prabhupāda immediately stopped me. He pointed out that the plate, having been eaten from, was dirty. I had picked it up, contaminating myself by touching it, and then I touched the fruit to be offered to the Deity. He told me to wash my hands and take the items separately. We all smiled at his thoughtfulness and my dullness.</p>

<p>From my point of view as a disciple, both guru and God were to be worshipped on the same level. Foremost in my mind was the thought that every little opportunity to render some service was for my own benefit. In other words, I thought that I was becoming purified simply by touching the plate that Śrīla Prabhupāda had personally eaten from.</p>

<p>He, however, thought of himself as a humble servant of Kṛṣṇa; thus he saw the plate as being contaminated. Because he has such a high standard of purity, and because the fruit was to be offered to the Deity, Śrīla Prabhupāda could therefore not accept the mixing of the two items.</p>

<p>In Prabhupāda’s presence it is becoming quite clear how little I have learned in almost four years in the movement. Being with Śrīla Prabhupāda is opening up a whole new perspective on devotional service to me. As Śrīla Prabhupāda’s assistant, one has to learn to see matters from his point of view, and that takes precedence over one’s own.</p>', '', '1975-11-29', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- November 30th, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'November 30th, 1975',
    '', '', '', '',
    '', '', '', '',
    E'<p>As Śrīla Prabhupāda took his massage on the roof, Hansadūta prabhu came up to join him. After sitting for a while and reading from the Fifth Canto of <em>Śrīmad-Bhāgavatam</em>, he expressed to Śrīla Prabhupāda his appreciation of the newly published volume. Prabhupāda chatted a little with him, extolling the pleasures of sitting in the sunshine. He said the <em>rājarṣis</em> of former ages all made their capitals in India on account of the pleasant, sunny weather. Even during winter the days are warm and sunny, and in the summer the evenings are very pleasant and mild.</p>

<p>Hansadūta asked Śrīla Prabhupāda about the possibility of opening a center in Kabul. He explained that the residents there have shown interest in our Society. And a good number of young Westerners pass through the area, many of whom are receptive to learning about spiritual life.</p>

<p>Śrīla Prabhupāda positively declared that it is his desire to see a center in every city of the world. He encouraged Hansadūta to go ahead and try to establish something.</p>

<p>Gopāla Kṛṣṇa joined us on the roof to finalize arrangements for tomorrow’s journey to Kurukṣetra. When he asked who would accompany His Divine Grace on the trip, Śrīla Prabhupāda, with an upward tip of his head, immediately indicated me. “He may go.”</p>

<p>Gopāla Kṛṣṇa registered mild surprise, since I am only a temporary fill-in. “Hari-śauri, Śrīla Prabhupāda?”</p>

<p>To which Prabhupāda responded, “Well, I have to have my massage.”</p>

<p>So by Prabhupāda’s grace, and to my great satisfaction, my tenure as his servant has been extended, and I will get my first chance to travel with His Divine Grace.</p>

<p class="verse">* * *</p>

<p>Unfortunately I blundered with the hot water for his bath again today. I remembered to place the immersion heater in the bucket of water, but I foolishly forgot to switch it on. This time Śrīla Prabhupāda became exasperated and reprimanded me because he had to wait until the water heated up. I had nothing to say. I hung my head, feeling terrible. It was the second time in three days and there was no excuse.</p>

<p>Now I can understand that although Prabhupāda is very tolerant of mistakes arising from inexperience, he expects us to learn from our errors. Simple carelessness does not sit well with him at all. He wants us to act with clear intelligence, seeing this as the symptom of our Kṛṣṇa consciousness.</p>

<p class="verse">* * *</p>

<p>After taking lunch <em>prasādam</em> Prabhupāda sat at ease in his sitting room for a short while. Then he walked through the servants’ room to his bedroom to retire for his afternoon nap. Hansadūta, Harikeśa, and I were in the servants’ room, taking our lunch. As he came in, we offered our obeisances. I was sitting on the floor eating from a bowl with a spoon, and as I knelt back, I put the spoon down and rested my hand on my knee.</p>

<p>Immediately Prabhupāda looked at me and said, “Oh, you are eating and then...?” He put his hand on different places of his body as if to illustrate a child contaminating his clothes with a dirty hand.</p>

<p>My instinct was to say, “Well, Śrīla Prabhupāda, my <em>hand</em> isn’t dirty. I’m eating with a spoon.” But I thought better of it and checked myself. Prabhupāda could obviously see that. I realized that Prabhupāda simply had a better understanding of what constitutes cleanliness. He laughed. As he walked past us into his bedroom, he shook his head and said, “You are all brought up <em>mlecchas</em>.”</p>

<p>Then again in the evening, without first washing my hands, I picked up a water jug after handling Śrīla Prabhupāda’s plate. He immediately noticed and corrected me. He laughed and told me not to mind. It is the position of the guru, he said, to find out the faults in the disciple and rectify them.</p>

<p>It was simultaneously embarrassing and pleasurable to be on the receiving end of Prabhupāda’s reproof. His standard of purity is so much higher than ours. By his keen observation and objective criticism he is training us to the highest levels, making us fit for serving Kṛṣṇa. I feel very fortunate that Prabhupāda is very patiently training me. Even though he sometimes calls us <em>mlecchas</em>, he is actually very proud of his Western disciples. He constantly points out to his visitors how we have been transformed.</p>

<p>These incidents have made me realize that Śrīla Prabhupāda has unlimited patience in training his disciples. Although he must have given these instructions hundreds of times during the last ten years, he is still prepared to patiently teach the same things again and again to any new disciple, provided that student has an attitude of humble service and is eager to learn.</p>

<p class="verse">* * *</p>

<p>Śrīla Prabhupāda’s schedule is finally fixed for him to go to Kurukṣetra on December 1st and to Vṛndāvana the following day. Gopāla Kṛṣṇa informed me today that as soon as Śrīla Prabhupāda gets to Vṛndāvana, I have to leave immediately for Calcutta to help with the management. Harikeśa has also made it quite clear that he has already arranged for someone else to assume the role of masseur in Vṛndāvana.</p>

<p>So my short sojourn is, sadly, coming to an end. But still, I have a feeling of overwhelming gratitude for having been allowed in His Divine Grace’s personal service these past few days. It is something I never expected nor deserved; truly the causeless mercy of Śrīla Prabhupāda and Kṛṣṇa.</p>', '', '1975-11-30', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


END $$;
