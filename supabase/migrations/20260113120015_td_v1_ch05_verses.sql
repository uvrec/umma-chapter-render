-- ============================================
-- TD Volume 1, Chapter 5 - Verses
-- ============================================

DO $$
DECLARE
  v_book_id uuid;
  v_canto_id uuid;
  v_chapter_id uuid;
BEGIN
  SELECT id INTO v_book_id FROM public.books WHERE slug = 'td';
  SELECT id INTO v_canto_id FROM public.cantos WHERE book_id = v_book_id AND canto_number = 1;
  SELECT id INTO v_chapter_id FROM public.chapters WHERE canto_id = v_canto_id AND chapter_number = 5;


  -- December 25th, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'December 25th, 1975', 1,
    '', '', '', '',
    '', '', '', '',
    E'<p>At noon Prabhupāda flew due north to Ahmedabad, a short thirty-five minute trip. Jaśomatīnandana and Kārttikeya Mahādevia, one of our more enthusiastic Bombay Life Members, were there to greet him. They drove us in two cars to a small town nearby called Sanand. The car I was in was delayed at a railway crossing, and Śrīla Prabhupāda’s car sped ahead.</p>

<p>Reaching the outskirts of Sanand, we found a large group of people in an open field. They clamored excitedly around a small colorful stage erected for Śrīla Prabhupāda’s arrival. Śrīla Prabhupāda sat, serene and comfortable on a raised dais, wreathed in about twenty garlands of marigolds and roses. Our host, the portly and venerable king of Sanand, with his long white beard and wearing a large red turban, sat at his side. A <em>chokidhar</em> sheltered Prabhupāda from the sun with a large, red-velvet ceremonial umbrella.</p>

<p>Several hundred townspeople gathered in front of the stage. It was quite a sight. A group of costumed dancers, caparisoned in smart, white costumes with unusual pleats and ruffles and wearing bright yellow <em>pagḍis</em>, headbands with large side frills, performed a stick dance as a greeting ceremony. They then sat in rows at the front, while the townspeople, some dressed in white turbans and others in colorful purple ones, clustered behind to get a glimpse of their revered visitor.</p>

<p>The king’s son, Yuvrāj Ṭhākura Sahib, a short, pleasant man in his late forties, gave a brief introductory speech and welcoming address before requesting Prabhupāda to speak. Prabhupāda asked for his <em>karatālas</em> and then chanted the <em>mahā-mantra</em> for a few minutes. He then thanked our hosts and the audience for their warm reception.</p>

<p>The Yuvrāj then invited him to come down off the stage and mount an open horse-drawn carriage that was waiting to take him on a grand reception tour through the town. The carriage had seen better days but was still quite stately. By this time several thousand people had gathered, eager to greet Śrīla Prabhupāda. Their enthusiasm and veneration surcharged the atmosphere.</p>

<p>Hansadūta, Harikeśa, and I were swept up in the excitement. Harikeśa rushed about snapping photos for <em>Back to Godhead</em> magazine. Hansadūta went off with a <em>mṛdaṅga</em> to join Jaśomatīnandana and Haihaya in <em>kīrtana</em> at the front of the procession.</p>

<p>Śrīla Prabhupāda and the king climbed into the carriage, sitting opposite each other, Prabhupāda on the back seat. On Prabhupāda’s request I was privileged to ride on the back running board. Taking the colorful umbrella from the <em>chokidhar’s</em> grasp, I leaned over to provide a shield for His Divine Grace from the sun’s rays.</p>

<p>Then we were off on an hour-long ride that took us through the main parts of the town and up the central thoroughfare leading to Sanand Palace. It was wonderful. All along the route excited people clamored to get a glimpse of Śrīla Prabhupāda and his foreign disciples.</p>

<p>A large crowd preceded us, with several hundred women following behind. As the procession wound its way through the town, the ladies spontaneously burst into chanting, “Hare Kṛṣṇa, Hare Kṛṣṇa, Kṛṣṇa Kṛṣṇa, Hare Hare/ Hare Rāma, Hare Rāma, Rāma Rāma, Hare Hare” without any prompting from our devotees. Although I’ve read in Prabhupāda’s books that village people in India are naturally inclined to be devotees, to actually see it practically manifested was a moving experience.</p>

<p>The reception was spontaneous and genuinely heart-warming. There is a piety in India, especially in the villages, that simply doesn’t exist anywhere else in the world.</p>

<p>In the main bazaar people came out on their balconies or rooftops and showered flowers or offered <em>praṇāmas</em>. The street was hung with mango leaves and colorful strips of paper, fluttering like little flags in the breeze.</p>

<p>As the carriage crept along, people pushed forward and repeatedly stopped it. Sometimes they’d give a garland to Śrīla Prabhupāda. With great respect and devotion others would offer him a brief <em>pūjā</em> from small trays equipped with a ghee lamp, a few grains of rice, some <em>kuṅkum</em>, a few <em>paisā</em>, a piece of fruit and a few flowers. After waving the tray with the lighted lamp in small circles before him, they leaned forward to dot his forehead with the <em>kuṅkum</em> and then a grain of rice. Śrīla Prabhupāda patiently accepted their offerings with great humility and appreciation, joining his palms together and blessing them with a smile and “Hare Kṛṣṇa!”</p>

<p>When we reached the palace entrance the carriage came to a halt, turning to face the crowd. Prabhupāda gave a short speech, then the carriage moved through a large arch into the privacy of the royal courtyard.</p>

<p>The reception delighted Prabhupāda. He commented that village people are all devotees because they naturally chant the holy names.</p>

<p class="verse">* * *</p>

<p>“Sanand Palace” sounds much grander than it actually is: a 450-year-old group of red brick buildings. By local standards it is impressive, but certainly not what we would call opulent. Prabhupāda is housed in one wing on an upper floor, and I sleep outside his door. Hansadūta and Harikeśa have a room on the roof.</p>

<p>The king’s entire family live here: sons, daughters, nephews, nieces, <em>et al</em>. It is a traditional Indian family enclave, and they are all cordial, humble, and helpful.</p>

<p class="verse">* * *</p>

<p>Jaśomatīnandana has arranged for a large <em>paṇḍāl</em> tent to be erected, and programs are to be held for the next five days. At 8:30 p.m. Prabhupāda went there to lecture. About 5,000 people turned out, impressive for a town with a population of only 21,000. After a brief <em>kīrtana</em> Prabhupāda gave a well-received fifty-minute discourse in Hindi, which Jaśomatīnandana translated into Gujarati.</p>

<p>On the way out of the <em>paṇḍāl</em> area Śrīla Prabhupāda stopped the car at the entrance and inquired whether all the visitors were being given <em>prasādam</em>. He was shown some small white sugar beads which are commonly given out at many temples. He wasn’t very impressed, but seemed to think it was better than nothing. We arrived back at the palace by 10:30 p.m.</p>', '', '1975-12-25', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date,
    updated_at = now();


  -- December 26th, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'December 26th, 1975', 2,
    '', '', '', '',
    '', '', '', '',
    E'<p>At about 7:00 a.m. Prabhupāda and his small <em>yātrā</em> of devotees took a short morning walk in the countryside. It was a late start by his usual standard, but now that the winter season has set in, the sun is rising later.</p>

<p>Walking down a rough dirt track in the open country we saw that the entire district was flat, fertile, and green. Unfortunately almost every field for miles around was dedicated to growing tobacco.</p>

<p>Prabhupāda expressed his amazement at the foolishness of modern economic systems. He explained that people can easily grow whatever they need in their own district, but instead they grow a product they can’t eat. Then they ship it somewhere else at great expense. With the money they receive they buy the very food they could have grown themselves. This system does nothing but make their lives more complicated. And by becoming dependent on just one crop, livelihood is jeopardized because of the fluctuations of world markets which they have no power to influence.</p>

<p>There was also some talk about George Harrison, the former member of the Beatles rock group, who has donated a large country estate just outside London to our Society. Hansadūta has recently come from England, and his mention of Bhaktivedanta Manor naturally made Prabhupāda think of George. Hansadūta reported that George was smoking and drinking again.</p>

<p>Even though the report on George’s activities wasn’t very encouraging in spiritual terms, Prabhupāda considered only the positive side of his character. “No, no, he is very good boy, George. He showed me in Bombay. He came to see me in Bombay. He is keeping Jagannātha within his bead bag and chanting.”</p>

<p>“Just before I came to India,” Hansadūta added, “Mukunda met him for about two hours. He said he was very friendly and said that he would arrange a ninety-nine year lease for us. Give us the right to Bhaktivedanta Manor.”</p>

<p>The news pleased Śrīla Prabhupāda. “No, he’s our well-wisher, a good boy.”</p>

<p class="verse">* * *</p>

<p>After breakfast, Jaśomatīnandana requested Prabhupāda to speak at a morning session of the <em>paṇḍāl</em>. Śrīla Prabhupāda is not really strong enough to do two lectures a day, but he agreed anyway.</p>

<p>Because most people are at work in the mornings, only about 150–200 people turned up for the lecture. It was disappointing, but Prabhupāda was undaunted. Last night he spoke in Hindi and Jaśomatīnandana translated into Gujarati. But today Prabhupāda announced that he would speak in English. “So they can understand,” he said, meaning us, his three servants.</p>

<p>Śrīla Prabhupāda pointed out that because he is presenting Kṛṣṇa as He is, the Supreme Personality of Godhead, he is attracting so many young men and women from the West who are now preaching Kṛṣṇa’s message all over the world. “We don’t manufacture any concocted things. We simply distribute the message given by the Supreme Personality of Godhead, and this is becoming effective practically. You can see these Europeans and Americans, Australians, all over the world. They did not know four or five years ago, or, say, ten years ago, since I have begun this movement, they did not know what is Kṛṣṇa. Although <em>Bhagavad-gītā</em> was being presented by so many svāmīs and yogis, not a single man became a devotee of Kṛṣṇa. So our, this presentation, because it is pure without any adulteration, it is acting very nicely.”</p>

<p>His recent conversation in Bombay about the Māyāvādī <em>sannyāsī</em> served to illustrate his point. “One big svāmī, he said that ‘Kṛṣṇa means “black,” and black means “unknown.”’ Of course, nobody cares for his speech. Kṛṣṇa is going on, forward. Everyone is accepting Kṛṣṇa. But this is the most unfortunate thing, that our men go there [to the West] to deprecate Kṛṣṇa.”</p>

<p>Finally he stressed Śrī Caitanya Mahāprabhu’s order that all Indians should become gurus by understanding <em>Bhagavad-gītā</em> as it is. Not considering whether he was speaking to sophisticated residents of Bombay or simple villagers who perhaps had never even ventured beyond Sanand, he urged his audience to preach Kṛṣṇa consciousness all over the world.</p>

<p>“So Bhagavān is not far away from you. He is staying within the core of your heart. If you qualify yourself as devotee, He’ll speak with you. But if you commit offenses, thinking Kṛṣṇa as ordinary man, then Kṛṣṇa will never give you instruction. So our request is that you study <em>Bhagavad-gītā</em>.”</p>

<p>Though devoid of real Vedic qualifications, it was still very satisfying to be used by Śrīla Prabhupāda as examples of the efficacy of Kṛṣṇa consciousness. It always pleases Prabhupāda to be able to point out how the Westerners have eagerly taken up his mission. He gives us credit far beyond what we deserve.</p>

<p>And it is not simply propaganda either. In private he also compliments us for having made the sacrifice of preaching on his behalf. He is always encouraging, correcting, and pushing us on to greater and greater degrees of surrender to Kṛṣṇa.</p>

<p class="verse">* * *</p>

<p>In the afternoon the king and many local village leaders came for <em>darśana</em>. They discussed the need to educate the people in spiritual values. Prabhupāda again brought up the point that growing cash crops such as tobacco was senseless. He informed them that he was prepared to travel to every village to preach <em>Bhagavad-gītā</em>, perform <em>kīrtana</em>, and distribute <em>prasādam</em>, if they were willing to organize it.</p>

<p class="verse">* * *</p>

<p>The evening program began late but was well attended. From 8:00–9:30 p.m. thousands of people poured into the grounds and enjoyed <em>bhajanas</em> until Prabhupāda began his lecture on <em>Bhagavad-gītā</em> 16.7: “Those who are demonic do not know what is to be done and what is not to be done. Neither cleanliness nor proper behavior nor truth is found in them.”</p>

<p>Once more he spoke in English, his strong, clear voice amplified above the clamor, and Jaśomatīnandana translated into Gujarati. He explained that one’s birth or upbringing are inconsequential—Kṛṣṇa consciousness is for anyone who wants to take it. “According to <em>varṇāśrama-dharma</em>, the <em>brāhmaṇas</em> are called <em>śuci</em>, means ‘pure.’ But this <em>śuci</em>—the opposite word is <em>muci</em>. So there is a Bengali Vaiṣṇava poet. He says that <em>śuci haya muci haya yadi kṛṣṇa tyaje/ muci haya śuci haya yadi kṛṣṇa-bhaje</em>. The purport is that if somebody takes to Kṛṣṇa consciousness, even he is born in the family of <em>muci</em>, then he becomes <em>śuci</em>. And if a person is born in the <em>brāhmaṇa</em> family or <em>kṣatriya</em> family but he does not take to Kṛṣṇa consciousness, then he becomes a <em>muci</em>. This is also confirmed in the <em>Bhagavad-gītā</em>, <em>māà hi pārtha vyapāśritya ye ’pi syuḥ pāpa-yonayaḥ</em>. <em>Pāpa-yoni</em> means <em>muci</em>, less than the <em>śūdras</em>. If he takes to Kṛṣṇa consciousness, <em>te ‘pi yānti parāà gatim</em>, he is also eligible to go back to home, back to Godhead. So even a <em>muci</em> or a <em>pāpa-yoni</em> born in the low-grade family, if he takes to Kṛṣṇa consciousness, he becomes a <em>devatā</em>. This is also confirmed in the <em>Śrīmad-Bhāgavatam</em> [2.4.18] by Śukadeva Gosvāmī,</p>

<p><em>kirāta-hūṇāndhra-pulinda-pulkaśā abhīra-śumbhā yavanāḥ khasādayaḥ</em></p>

<p><em>ye ’nye ca pāpā yad-apāśrayāśrayāḥ śudhyanti tasmai prabhaviṣṇave namaḥ. </em></p>

<p>“So it doesn’t matter where we are born. If we take to Kṛṣṇa consciousness, then he becomes a <em>śuci</em>, purified, and he is eligible to go back to home, to back to Godhead.”</p>

<p>Later in the lecture Prabhupāda again displayed his determination to challenge the atheistic scientists, whom he described as asuric. “Their main proposal is that there is no creator, God. The modern scientists, philosophers, Western people, they don’t accept that God is the creator of everything. And their theory of creation is the chemical composition.... They think that chemical combination is the cause of life. So the <em>asuras’</em> theory of creation is a chance theory, but we don’t accept. We are preaching against them, writing books against them. We are challenging this atheistic theory of creation. The Kṛṣṇa consciousness movement is against the <em>āsuras</em>. Kṛṣṇa also comes down to kill the <em>asuras</em>. <em>Paritrāṇāya sādhūnāà vināśāya ca duṣkṛtām</em>. <em>Asuras</em> cannot flourish by their atheistic theory. Unless one comes to Kṛṣṇa consciousness, he has to be put into the different types of asuric<em> yoni</em> [lower species] to suffer in this material world.”</p>

<p>Śrīla Prabhupāda summarized by explaining how easy it is to become Kṛṣṇa conscious, urging everyone to adopt the universal panacea given by Śrī Caitanya Mahāprabhu. “To take to this Kṛṣṇa consciousness is made very easy during this Kali-yuga. <em>Harer nāma harer nāma harer nāmaiva kevalam, kalau nāsty eva nāsty eva nāsty eva gatir anyathā</em>. <em>Kalau</em>, in this age, if you take to Kṛṣṇa consciousness, simply chant Hare Kṛṣṇa, Hare Kṛṣṇa <em>mantra</em>, then you become <em>devatā</em>. This is our program. So our only request is to you, that in whatever position you are—it doesn’t require to be changed—simply take to Kṛṣṇa consciousness. Chant Hare Kṛṣṇa <em>mahā-mantra</em>, and gradually you’ll become <em>devatā</em>. That is the recommendation of Śrī Caitanya Mahāprabhu.<em> Sthāne sthitāḥ śruti-gatāà tanu-vāṅ-manobhir</em>. ‘Remain in your place but be Kṛṣṇa conscious.’ It is not difficult at all. Thank you very much. Hare Kṛṣṇa.”</p>

<p>The crowd was clearly impressed. I doubt anyone had ever spoken so directly and forcefully to them, yet they appreciated it. Even though it was very late, most of the audience stayed after Prabhupāda left to see a film depicting Kṛṣṇa consciousness around the world.</p>', '', '1975-12-26', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date,
    updated_at = now();


  -- December 27th, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'December 27th, 1975', 3,
    '', '', '', '',
    '', '', '', '',
    E'<p>During this morning’s walk Prabhupāda again criticized the local farmers for growing tobacco rather than grains, cotton, and other necessities. He said it was a symptom of degradation to grow cash crops instead of food.</p>

<p>“Now eat cash! So cash is also paper. So what is the use of laboring so hard? You eat paper. Paper is available. Growing tea, growing tobacco, growing jute, and no grains. And grain for the animal. So that animal, as soon as it becomes fatty, send it to the slaughterhouse and then finish business. Smoke, eat meat, drink, and be happy! So much land, but it is producing tobacco, which we are prohibiting: no smoking.”</p>

<p>The talk of crops also brought up the question of <em>prasādam</em> distribution at these programs. Prabhupāda is very keen to see that sumptuous <em>prasādam</em> is given out whenever we hold a gathering. He said that otherwise ordinary people will not be attracted.</p>

<p>Although lecturing very strongly every day, he is aware that what he says inevitably will go over the heads of most people. Therefore he told the local devotees, “Then accept this program, distribution of <em>prasādam</em>. Then we can go everywhere, whole day program—<em>kīrtana</em> and distribution. Simply dry philosophy, what will people understand?”</p>

<p class="verse">* * *</p>

<p>Despite our remote location, somehow the mail is still reaching us. The first tally from the annual Christmas book distribution marathon in the West came today via a telegram from Rāmeśvara in Los Angeles. Prabhupāda was ecstatic; the distribution is increasing and his response undoubtedly stoked the fire of the devotees’ enthusiasm.</p>

<p>“Please accept my blessings. I am in due receipt of your telegram as follows: ‘CHRISTMAS WEEK BOOK DISTRIBUTION IN LOS ANGELES DESPITE CLOSED AIRPORT BETTER THAN EVER BY YOUR GRACE 112,000 BTG’S, 8,000 GITAS SOLD STOP ON INVITATION OF GOVERNOR BROWN OF CALIFORNIA 50 DEVOTEES VISITED STATE MENTAL INSTITUTIONS TO HELP IMPROVE CONDITIONS AND MORALE BY GIVING RELIGIOUS MESSAGE. PUBLICITY VERY GOOD, HARE KRSNA.’</p>

<p>“Thank you very much. This is very good. Fight and depend on Krsna. That will bring you victory.”</p>

<p>The immense distribution of transcendental literature in the West is a sharp contrast to its lack in India. Although India has one of the largest populations in the world, with people naturally receptive to the message of Śrī Caitanya Mahāprabhu’s movement, so little of it is being realized because of a lack of books in the local languages.</p>

<p>So Prabhupāda remains ever vigilant for competent translators. In Vṛndāvana, one Gosvāmī along with his sons are currently working on translations of his books. Anxious to see how it is progressing, Śrīla Prabhupāda wrote Bhagatjī, for the second time within the last few weeks, asking him to send samples to him. He also requested Bhagatjī to help expedite the opening of a branch of the Punjab National Bank within our temple compound in Vṛndāvana. Negotiations are nearly complete, and Prabhupāda wants it open as soon as possible.</p>

<p class="verse">* * *</p>

<p>Prabhupāda is always pointing out the fraudulence of modern scientists. Yesterday he mentioned that in Germany after the first World War they opened a factory to extract fat from stool for eventual human consumption. “How could they even <em>think </em>of such a thing?” he said.</p>

<p>He also told us a little about his German Godbrother, a scientifically-minded man. Understanding the limitations of scientific endeavor, he had taken shelter of Śrīla Bhaktisiddhānta Sarasvatī Ṭhākura and received first initiation. He lived with Prabhupāda for some time in Bombay, but could not maintain the strict discipline of spiritual life. Later he returned to Germany.</p>

<p class="verse">* * *</p>

<p>Prabhupāda considers Harikeśa’s writing assignment important enough that he has given him permission to miss some of the programs to work on it. He is applying himself very seriously to the task, and Prabhupāda frequently calls him to discuss various arguments. Today he even had him come during his massage to discuss it.</p>

<p>Prabhupāda decided to take his massage up on the roof as it was warm and sunny. Being the highest building in the district, it affords a good view for miles all around with a gentle breeze carrying the distinct redolence of the tobacco plants.</p>

<p>Harikeśa came up carrying the tape recorder. He has recently obtained a small book explaining Leninist philosophy, and using it as a basis, he and Prabhupāda engaged in a lengthy discussion.</p>

<p>Prabhupāda brilliantly exposed the defects in communist ideology, showing how to defeat them at their own game of “thesis, antithesis, and synthesis.”</p>

<p>“So what is the thesis of life?” Prabhupāda challenged.</p>

<p>Harikeśa answered, “Some people say that life is to be enjoyed. Life is simply there for enjoyment.”</p>

<p>Prabhupāda replied, “So the answer is that, whether you are actually enjoying life.”</p>

<p>Harikeśa got into the mood. “Well, right now I am not actually enjoying life, so I have to find out the means to enjoy and to negate the pain and to make the pleasure more.”</p>

<p>“Yes,” Prabhupāda agreed. “That’s very nice proposal. But whether at the present moment or in the history a man is enjoying life or suffering?”</p>

<p>“Well,” Harikeśa replied, “men have actually never really enjoyed because they never understood enough about themselves. They were never able to overcome their difficulties due to ignorance.”</p>

<p>“So,” Prabhupāda said, “then the next question will be how to enjoy. There may be different theses so our thesis is that we are trying to enjoy life by covering ourself. The crude example: The contraceptive method was by using one cover, but that was not enjoyable. So then they discovered pills.</p>

<p>“So covered enjoyment is not enjoyment; it is not complete enjoyment. The real enjoyment in this material world is sex. Now, if we want to enjoy sex covered with coats and pants, is that enjoyment pleasing?”</p>

<p>Harikeśa had to admit, “No.”</p>

<p>“Therefore actually when they want to enjoy sex in the private room they become naked. So they are seeking enjoyment with this material body, but they are not able to enjoy on account of being covered....</p>

<p>“That means covered enjoyment is not enjoyment. It is hampered enjoyment. Therefore we—human beings—we want enjoyment. That’s all right, but we are not able to enjoy fully because we are covered by something. This is the thesis. But these rascals, or the ignorant person, they do not know that ‘I am covered by something. Therefore my enjoyment is not complete.’ So you answer this. Our enjoyment is not being completed on account of being covered by this material body. This is the thesis.”</p>

<p>Harikeśa began to reply, “So the antithesis would be there is no....”</p>

<p>But before he could finish, Prabhupāda went on, “The antithesis will be how to become uncovered. And the synthesis will be that because we are unable to uncover immediately, therefore there must be some synthesis.”</p>

<p>Harikeśa had to admit he hadn’t thought of it that way.</p>

<p>Prabhupāda went on to explain, “This is Kṛṣṇa conscious. The thesis of the covering and the antithesis of the soul should be synthesized by arrangement. And that we are teaching.”</p>

<p>“Dialectical spiritualism,” Harikeśa offered.</p>

<p>Prabhupāda said, “Yes. Dialectic means spiritualism and materialism. It is dialectic. Two sides there are, the material and the spiritual. These ignorant rascals, cats-and-dogs-like men, they have no information of the thing which is covered. They are simply dealing with the coverings. Therefore their knowledge is imperfect, and they are not successful by so many theses. They do not know the real problem. Who is enjoyer? That they do not know. That enjoyer is covered, and they are talking of the cover.</p>

<p>“In Bengal it is a proverb, saying that <em>chopra niye tanatani</em>. The coconut, sweet pulp and water is within, and they are struggling with the fibers above the coconut. Coconut, they have got some information: ‘Coconut is enjoyable.’ But where is the enjoyable article there? That they do not know. They have simply information, this body. And the coconut’s body is covered with fibers, and they are fighting with the fibers.</p>

<p>“None of these so-called capitalists or communists, they do not know where the real substance is. Superficially they are fighting on the platform of fiber covering. That’s all. <em>Chopra niye tanatani</em>, they are fighting just like dogs. Actually they do not know how to become happy, but one dog is barking upon another dog, and they are fighting, attacking, barking—useless.</p>

<p>“The dogs and cats, they do not know what is the value of life. But here is a chance, human being. Therefore dialectic, dialectic materialism. The inside pulp of coconut requires the covering outside; otherwise it would be spoiled. Crude example. But the real substance is inside, not outside. But these rascals, they have no information of the inside substance. They think that, ‘Here is coconut. Let us try to find out happiness,’ and they are simply struggling to adjust the fibers. Therefore they have been described as <em>mūḍha</em>, rascals....</p>

<p>“Therefore, you see despite so many rascal philosophers in the Western country, they simply fight and bomb and cheat and politics, diplomacy—on the surface of the coconut, not inside. So you have to prove that, ‘All of you are rascals. You do not know where to get pleasure. You are missing that point...’</p>

<p>“So we know the thesis, antithesis, and synthesis—that this soul, living entity, is within this body.” Prabhupāda concluded by saying, “So in their dialectic process try to bring this thesis that ‘Within this body there is the real enjoyer,’ and try to convince them in that way. That will be great service.”</p>

<p>Harikeśa said, “You’ve already done it.”</p>

<p>Prabhupāda answered, “I have done with few selected men. Now it has to be spread. We have to face bigger field. Then it will be nice...The thesis is the soul, the antithesis is the body, and synthesis is how to adjust the body and soul so that the soul be benefitted from this entanglement.”</p>

<p>Śrīla Prabhupāda perfectly analyzed the defective materialistic philosophies, and with only a few choice words defeated the results of lifetimes of speculative thought. The discussion was stimulating and left us feeling full of admiration for him. At a loss for words, we can only admire his genius and offer inadequate homage.</p>

<p>Yet he isn’t content to sit back in complacent satisfaction, nor will he allow us to either. Harikeśa suggested that what Prabhupāda had just spoken should be written as a <em>Back to Godhead</em> article. So Prabhupāda told him to write it.</p>

<p>Harikeśa said, “You so completely destroy the opposition, it is very hard to say anything more!”</p>

<p>Prabhupāda agreed, but challenged further, “Yes. That you have to prove. You can eulogize your Guru Mahārāja, but you have to learn it and face the public and be strong to defend yourself. That is success, not by praising your Guru Mahārāja. You’ll praise your Guru Mahārāja. That is not very difficult. But be victorious to the opposing elements. Then you’ll praise your Guru Mahārāja best. At home you can praise your Guru Mahārāja, and Guru Mahārāja be satisfied, ‘Oh, my disciples are praising me.’ That is good, respectful. That is the qualification. But you have to fight. Then your Guru Mahārāja will be glorified.”</p>

<p>These discussions have been going on for weeks, but Prabhupāda continues to prod Harikeśa for further materialistic viewpoints, which he then promptly defeats. He is determined to challenge and destroy every philosophical obstacle to Lord Caitanya’s mission. He is always visibly inspired by such debate.</p>

<p>At the same time Prabhupāda is making it clear that he wants to train as many men as possible to take up this task of saving the world. He concluded the discussion by asking Harikeśa to produce a small pamphlet on the subject, urging him to print it even in Russian.</p>

<p>“Oh, in Russian!”</p>

<p>“Hm? They are the greatest atheist.”</p>

<p>“A dialectic spiritualism pamphlet in Russian! That’s big, Russian.”</p>

<p>Prabhupāda’s sharp intellect shows in other ways. At the beginning of the massage I had brought out a thin cotton mattress for him to sit on, rather than the usual straw mat. As he spoke with Harikeśa, I knelt in front of him to begin massaging his head. I poured a little of the precious sandalwood oil into my cupped palm, placing the almost full bottle on the lumpy mattress.</p>

<p>Concentrating on being careful not to tip the contents out of my leveled hand, I let go of the bottle and reached up to apply the oil to his head. In a flash Prabhupāda’s hand swooped down to catch the uncapped bottle as it toppled on the uneven surface. Not a drop was spilt. Though he was speaking with Harikeśa, he had anticipated my carelessness and saved the expensive oil. His short sharp rebuke, “You rascal!” and critical glare was enough to guarantee that I wouldn’t make the same mistake again.</p>

<p class="verse">* * *</p>

<p>In the afternoon Kārttikeya drove us five miles to a local village for a program. In the car Prabhupāda talked enthusiastically about village-to-village preaching. He is eager to see this program established and said that mass propaganda of <em>saṅkīrtana</em> and <em>prasādam</em> distribution will save India. He said that if programs are arranged he will travel in his new car (when it comes), taking a dozen men all around Gujarat to every village.</p>

<p>Upon arrival, he was welcomed grandly and taken to an open area where a thousand or so village people had gathered. The leading men lined up and offered Prabhupāda at least twenty or thirty garlands. Prabhupāda chanted for a few minutes and then began to speak; but it was so noisy, with all the women and children, he stopped.</p>

<p>He chanted again, this time getting the crowd to join in. Again he lectured, this time to a quiet audience. For twenty minutes he gave a simple explanation of spiritual knowledge and impressed on them the need to lead a pure life following God’s laws. His main intent was to get them to chant and take <em>prasādam</em>.</p>

<p>At the conclusion he returned by car directly to the <em>paṇḍāl</em> in Sanand for the evening program, which continued to be very well attended. At least 4,000–5,000 people turned out and sat quietly in the cool night air to hear him deliver an enlightening discourse on <em>Bhagavad-gītā</em> (7.1) in English, with Jaśomatīnandana translating.</p>

<p>Tonight’s topic was about <em>āsakti</em>, converting our attachment to Kṛṣṇa. He stressed the role that a pure devotee plays in creating opportunities for the materially attached people to take shelter of Kṛṣṇa.</p>

<p>He repeated, as he continually does, his appeal to the Indian people to take up the mission entrusted to them by Śrī Caitanya Mahāprabhu. “Kṛṣṇa <em>bhakti</em>, attachment for Kṛṣṇa, is quite natural. It is already there. Simply it has to be awakened. If you engage yourself to hear about Kṛṣṇa, then your heart will be purified and your original Kṛṣṇa consciousness will be awakened. For this purpose Śrī Caitanya Mahāprabhu also advises, <em>paraà vijayate śrī-kṛṣṇa-saṅkīrtanam</em>, ‘All glories to the <em>saṅkīrtana</em> movement,’ because simply by chanting the Hare Kṛṣṇa mantra, everything will automatically come. The <em>saṅkīrtana</em> movement, Kṛṣṇa consciousness movement, the more you chant Hare Kṛṣṇa <em>mahā-mantra</em>, the heart disease, material enjoyment, that will decrease, and then you will understand what is your position, and you will be gradually attracted by Kṛṣṇa. This is the test of <em>bhakti</em>, that if you engage yourself twenty-four hours in devotional service, then immediately you become liberated.”</p>

<p>He offered them the example of Dhruva Mahārāja to illustrate that even one who is not free from material desire can still be accepted by Kṛṣṇa and go back to Godhead. “Kṛṣṇa is so nice, so liberal, that if you have got a little tinge of aspiration He will fulfill you, and at the same time, you’ll go back to home, back to Godhead. Kṛṣṇa is all-powerful, almighty, full with six opulences. So if you have got any material desire, that also Kṛṣṇa can fulfill, but you stick to Kṛṣṇa so that your <em>āsakti</em> will be increased. If we want to go back to home, back to Godhead, then we must increase our attachment for Kṛṣṇa, and by that process we can understand Kṛṣṇa, what He is. <em>Bhaktyā mām abhijānāti</em>. Then our door to go back to home, back to Godhead is clear.”</p>

<p>It was a long lecture and very late when he returned to the palace. He looked strained. He said that he was experiencing heart palpitations because of air in his chest.</p>

<p>So many programs are clearly too much. Only one per day should be the limit, otherwise he is becoming ill.</p>', '', '1975-12-27', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date,
    updated_at = now();


  -- December 28th, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'December 28th, 1975', 4,
    '', '', '', '',
    '', '', '', '',
    E'<p>No morning walk today. After resting until seven-thirty, Śrīla Prabhupāda felt a little better. Still, Jaśomatīnandana performed the morning program. Prabhupāda told him that he should lead the remaining morning <em>paṇḍāls</em> with help from Hansadūta.</p>

<p>Being Ekādaśī, we observed a half-day fast. Prabhupāda told me that to please Kṛṣṇa, we could fast completely, even from water. The fast was welcome for another reason also—the meals cooked for us by our hosts are swimming in ghee.</p>

<p class="verse">* * *</p>

<p>Prabhupāda took his massage on the palace roof again. It was pleasant sitting in the warm sun, looking out over the township and across the green expanse of countryside.</p>

<p>Prabhupāda continued his assault on the material scientists. “They are simply building a big palace on a tiny, shaky foundation. It cannot stand.” He compared their inspection of the material nature to analyzing stool. “Some is dry, some is wet, and they are arguing which is best. They are simply fools.” He told Harikeśa not to call them directly rascals, though, but to make them realize that they are by explaining the facts nicely.</p>

<p class="verse">* * *</p>

<p>In mid-afternoon Kārttikeya Mahādevia drove us in his old American limousine for a program in another nearby town called Bavala (pop. 20,000).</p>

<p>Along the way Prabhupāda incited our enthusiasm for the village preaching programs. He told us that in the 1950s he had made plans to travel all around India, hoping to gather up a force of <em>brahmacārī</em> preachers. Somehow it never happened, for he had neither men nor money. And Kṛṣṇa had another plan for him—preaching in the West. He said that now Kṛṣṇa has sent him so many nice young men to help fulfil his long-cherished vision.</p>

<p>Jaśomatīnandana eagerly offered to organize a program in a different village every day, and Kārttikeya even offered his car if Prabhupāda wanted it.</p>

<p>Prabhupāda encouraged Hansadūta take up this engagement, declaring that he would personally travel with the party. It was such an exciting concept, and Prabhupāda was so enthusiastic, the fact that such a program would be almost physically impossible for him wasn’t even mentioned. For Prabhupāda, preaching means that there is no consideration other than spreading Kṛṣṇa consciousness, whatever the cost.</p>

<p>In Bavala, like Sanand, thousands of people turned out to greet him. Taken first to a small house and worshiped by local <em>brāhmaṇas</em>, he later boarded a camel cart for a procession through the main streets. There were four or five camel carts, many bullock carts, and many, many thousands of people—practically the whole town. Prabhupāda was perched up on a high seat covered with white cloth, and I sat in front of him on the deck. Hansadūta stood directly behind Prabhupāda. This was a little troublesome for Hansadūta because every time the caravan stopped the camel pulling the cart behind us would inch forward so close that he was literally breathing down Hansadūta’s neck.</p>

<p>We stopped once at a Swami Nārāyaṇa Temple and then went on to a meeting hall. After garlands were given by leading citizens, local children performed a lovely <em>rasa-līlā</em> dance. It was pure and simple, and Prabhupāda enjoyed it. He then led a <em>kīrtana</em> and gave a fairly short English lecture on <em>Bhagavad-gītā</em> (3.14), about food grains being the result of the performance of sacrifice.</p>

<p>About three thousand noisy, but respectful, people packed into an open area to hear Prabhupāda tell them not to grow jute and tobacco but to produce food grains, chant, avoid the four aspects of sinful life, and please Kṛṣṇa by their work. His lecture was brief, but direct and to the point. After explaining that the purpose of life is simply to please Lord Viṣṇu, he outlined the process of work by which this can be achieved. “It is not possible that we can give up sinful activities by our own endeavor, because in this age, Kali-yuga, everyone is addicted to some sort of sinful activities. But if we surrender to Kṛṣṇa as He is instructing, fully, without any reservation, He will help us to become free from sinful reactions.”</p>

<p>Immediately after the close of the lecture, as the excited townspeople clamored around, he climbed back into the car and returned to Sanand. Upon arrival, he went straight to the <em>paṇḍāl</em> where he gave another lecture, this time in Hindi. It was after ten o’clock when we arrived back at the palace.</p>', '', '1975-12-28', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date,
    updated_at = now();


  -- December 29th, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'December 29th, 1975', 5,
    '', '', '', '',
    '', '', '', '',
    E'<p>No morning walk again today, although Prabhupāda is feeling a little better.</p>

<p class="verse">* * *</p>

<p>Rather than take his massage on the roof, Prabhupāda sat on the veranda outside his room overlooking the inner courtyard of the house. He could hear Harikeśa preaching enthusiastically to the king’s son and his wife inside a room across the courtyard down on the ground floor. He gave a slight motion of his head and a sidelong glance to indicate it to me. He listened appreciatively for a few moments and said, “He is preaching very nicely!” Smiling, he remarked that Harikeśa is very enthusiastic for preaching, and that that is his greatest asset.</p>

<p class="verse">* * *</p>

<p>Our hosts are cooking for us, but Harikeśa still prepares Śrīla Prabhupāda’s meals. In this way Prabhupāda can maintain his regular diet suited to his own taste and delicate digestion. He likes to eat alone and rarely allows anyone to remain with him while he honors his <em>prasādam</em>, as I found out this afternoon.</p>

<p>Prabhupāda sat down after taking his bath, and I brought in his plate. He began to eat, so I sat obediently in front, eager to serve. I thought myself very privileged to share the intimacy of Śrīla Prabhupāda taking his lunch. Prabhupāda, however, looked up from his plate and raised his eyebrows, questioning why I was there. He clearly felt the intrusion. And, slightly embarrassed, I left. I could understand he likes us to do things with reason and purpose and not simply hang around.</p>

<p class="verse">* * *</p>

<p>The only program today was in the evening, the final one in Sanand. After a short half-hour lecture many people came up to the stage and gave garlands to Prabhupāda.</p>

<p>Then the king’s son and his wife stood before Prabhupāda, jointly offering a gigantic multitiered lamp of 108 wicks to Prabhupāda. Not only was the lamp heavy, being made of brass, it was also extremely hot. A huge flame shot up from the burning wicks about a foot high, but somehow they held on to the lamp and completed the <em>pūjā</em>.</p>

<p>We performed <em>kīrtana</em>, and all the family members and prominent citizens sang a traditional <em>bhajana</em>. There were some short speeches of thanks, and finally the highly successful <em>paṇḍāl </em>series was brought to a close.</p>', '', '1975-12-29', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date,
    updated_at = now();


  -- December 30th, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'December 30th, 1975', 6,
    '', '', '', '',
    '', '', '', '',
    E'<p>Early in the morning Prabhupāda took his leave, graciously thanking the king’s entire family for their kindness and hospitality. He was very happy with the programs and talked with the king’s son about organizing the village preaching. Prabhupāda’s enthusiasm has clearly rubbed off on the Yuvrāj, and he seemed very eager to help us push forward Śrī Caitanya Mahāprabhu’s mission.</p>

<p><strong>Ahmedabad</strong></p>

<p>We drove to one Life Member’s house in Ahmedabad. After a brief reception, Śrīla Prabhupāda boarded a silver carriage drawn by two horses for a procession through the local district. This time Prabhupāda had me sit directly opposite him, at his feet on the lower front seat.</p>

<p>It was strikingly different from the Sanand and Bavala parades, where Prabhupāda’s presence had attracted crowds of thousands. Here only a few hundred people lined up along the route, mainly out of curiosity at the sound of the <em>kīrtana</em>. It appeared that the event wasn’t well advertised or organized. Yet those who attended the parade were nonetheless respectful and sincere, and Prabhupāda was pleased with their attempts.</p>

<p>We ended up at a small temple of Lord Śiva. After offering respects to the deity, Prabhupāda gave a short lecture in Hindi. Then it was on to a Life Member’s house for lunch and a short rest. Jaśomatīnandana then took Prabhupāda to see a house he is thinking of renting for a center. After inspecting it, Prabhupāda sat in the back seat of the car next me, ready to leave for the airport.</p>

<p>Just then a young boy of about ten came up to the window next to me. He peered in and saw the beautiful button I was wearing on my <em>khadi</em> waistcoat. It was a photo of the Deities of Lord Jagannātha, Balarāma, and Subhadrā in Melbourne. The boy’s eyes lit up. Without saying a word he repeatedly pointed first at the badge and then at himself with his eyebrows going up and down and big smile on his face, as if to say, “Give it to me! Give it to me!”</p>

<p>I did my best to ignore him, for I was rather attached to the badge and had worn it for a long time.</p>

<p>When Śrīla Prabhupāda looked over to see what was going on, I half suspected that he might tell me to give it to the boy. I was hoping not.</p>

<p>Suddenly Prabhupāda leaned forward with his eyes wide and put up both his hands with his fingers spread wide. “Ten rupees!” he told the boy with mock seriousness. “Ten rupees!”</p>

<p>Our solicitous young visitor was only momentarily taken aback. Shaking his head from side to side he continued to point.</p>

<p>Śrīla Prabhupāda laughed and sat back. “All right, give him it.”</p>

<p>Resigned, I dutifully I handed over the badge, and the boy skipped merrily away. His prize was the lotus feet of the Lord of the Universe. Mine was a little more detachment, and surrender to the lotus feet of the Lord’s servant, Śrīla Prabhupāda.</p>

<p class="verse">* * *</p>

<p>We flew back to Bombay at 5 o’clock, and by mid-evening Śrīla Prabhupāda was back in his quarters at Hare Kṛṣṇa Land, Juhu Beach. Upon arrival in his room he again admitted that his heart was getting weaker and that he was not feeling well.</p>', '', '1975-12-30', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date,
    updated_at = now();


  -- December 31st, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'December 31st, 1975', 7,
    '', '', '', '',
    '', '', '', '',
    E'<p>Madhudviṣa Swami, GBC for Australia, contacted us today and requested a confirmation of Śrīla Prabhupāda’s intention to attend their fourth annual Melbourne Ratha-yātrā in mid-January.</p>

<p>Australia’s seasons are reverse to those in the Northern Hemisphere. So a few years ago Prabhupāda had given his permission to hold the festival during the summer, rather than in the cold of June, in order to attract the greatest number of people.</p>

<p>Although Prabhupāda wanted to attend, after some discussion he finally decided not to go. He reasoned that his legs, feet, and hands were still quite swollen with fluid and he was not feeling well enough to travel such a long distance.</p>

<p>He did go on his walk, though, and otherwise spent a quiet day, meeting a few visitors in the afternoon.</p>

<p class="verse">* * *</p>

<p>Hansadūta returned from a day’s shopping with a set of small bowls, a <em>loṭā</em>, a spoon, and a rimmed plate for Śrīla Prabhupāda, all made of solid silver. Hansadūta was surprised to discover that Prabhupāda didn’t have his own eating utensils, so on his own initiative he purchased a complete set of silverware.</p>

<p>His Divine Grace was very pleased at his thoughtfulness and accepted the gift with humble appreciation. He handed them over to me with the instruction that they should be kept with him as his permanent travel set.</p>

<p>Hansadūta is now thoroughly enlivened with the idea of village-to-village preaching in India. Recent problems in Germany, where he is the GBC, have virtually stopped the preaching there, so he is looking for a new engagement. Prabhupāda is therefore encouraging him to preach in the villages.</p>

<p>Hansadūta spent the entire day inquiring about the price of buses and other equipment, and he talked with Prabhupāda about bringing some men over from Germany to form an all-India traveling <em>saṅkīrtana</em> party.</p>

<p>Although Prabhupāda likes the idea, he doesn’t want him to abandon his duties in Germany altogether. He told him that even if there are difficulties there, the efforts for the long-term establishment of Kṛṣṇa consciousness have to be maintained.</p>

<p>Since Hansadūta prabhu has been instrumental in the development of the German <em>yātrā</em>, Śrīla Prabhupāda isn’t keen to see him leave, lest everything collapse. But Śrīla Prabhupāda also has no objection at all to Hansadūta’s preaching in India—at least for the time being while the difficulties persist.</p>

<p>Śrīla Prabhupāda likes the idea of having some of his senior preachers active in India. In many ways he is personally carrying the full weight of the Indian preaching. He has few experienced men based here and consequently has to do much of the preaching and management himself. Thus the presence of another one of his trained preachers is therefore welcome to him.</p>', '', '1975-12-31', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date,
    updated_at = now();


END $$;
