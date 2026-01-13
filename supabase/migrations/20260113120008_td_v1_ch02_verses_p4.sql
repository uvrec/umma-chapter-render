-- ============================================
-- TD Volume 1, Chapter 2 - Verses
-- ============================================

DO $$
DECLARE
  v_book_id uuid;
  v_canto_id uuid;
  v_chapter_id uuid;
BEGIN
  SELECT id INTO v_book_id FROM public.books WHERE slug = 'td';
  SELECT id INTO v_canto_id FROM public.cantos WHERE book_id = v_book_id AND canto_number = 1;
  SELECT id INTO v_chapter_id FROM public.chapters WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- December 10th, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'December 10th, 1975', 9,
    '', '', '', '',
    '', '', '', '',
    E'<p>Morning walks are always fascinating. Devotees often bring up controversial subjects just to get Prabhupāda’s reaction. Akṣayānanda Swami initiated the discussion this morning by mentioning a questionable statement made by a senior devotee in a class recently. “I was told by one devotee that the <em>ācārya</em> does not have to be a pure devotee.”</p>

<p>Prabhupāda stopped abruptly. “What?”</p>

<p>“That the <em>ācārya</em> does not have to be a pure devotee.”</p>

<p>Prabhupāda was annoyed. “Who is that rascal? Who said? Who is that rascal? The <em>ācārya</em> does not require to be a pure devotee?”</p>

<p>“Nitāi said it. He said that Lord Brahmā is the <em>ācārya</em> in the Brahmā-sampradāya, but yet he is sometimes afflicted by passion. So therefore it appears that the <em>ācārya</em> does not have to be a pure devotee. So it does not seem right.”</p>

<p>“So who is that rascal? I want to know. Who has said?”</p>

<p>“Nitāi. Nitāi dāsa.”</p>

<p>Prabhupāda was indignant and denounced such a speculative mentality. “He manufactured his idea. Therefore he’s a rascal. Nitāi has become an authority?”</p>

<p>“No, actually he said that he thought...”</p>

<p>“He thought something rascaldom, and he is expressing that. Therefore he is more rascal.”</p>

<p>He walked on again, digging down to the real cause of the comments. “These things are going on. As soon as he reads some books, he becomes an <em>ācārya</em>, whatever rascal he may be.”</p>

<p>“So there’s no doubt that Lord Brahmā is a pure devotee?” Akṣayānanda asked.</p>

<p>“Whatever he may be, he is <em>ācārya</em>,” Prabhupāda answered. Then he stopped again and brought in another example. “Then Kṛṣṇa is also passionate. Kṛṣṇa danced with so many <em>gopīs</em>; therefore He is passionate. These things are to be seen in this way, that ‘Such exalted person, he sometimes becomes passionate, so how much we shall be careful.’ This is the instruction. Then we petty things, petty persons, how much we shall be careful. It is not that ‘<em>Ācārya</em> has become passionate, therefore I shall become passionate. I am strict follower of <em>ācārya</em>.’ These rascals say like this.”</p>

<p>Śrīla Prabhupāda gave a lengthy critique including commenting on various gurus and writers who, unable to understand Lord Kṛṣṇa’s transcendental nature, still want to comment on His words or on the literature that describe Him. They make Him appear an ordinary man, only to imitate Him. There are others who think they can understand Him simply by reading the <em>Gītā</em> or <em>Bhāgavatam</em>, despite Kṛṣṇa’s statement that out of many millions of persons only one may understand Him.</p>

<p>Śrīla Prabhupāda said that a guru, <em>ācārya</em>, is essential for proper realization. He referred to his early morning translation work from verse thirty of the Seventh Chapter of <em>Śrīmad-Bhāgavatam</em>. “You’ll find in today’s tape that Prahlāda Mahārāja is recommending, ‘Spiritual life begins by <em>guru-śuśruṣaḥ</em>, by serving guru.’ Rūpa Gosvāmī said, <em>ādaugurvāśrayam</em>, ‘The first beginning is to take shelter of the bona fide spiritual master.’ <em>Sad-dharma-pṛcchat</em>: ‘Then inquire from him about the spiritual path.’ <em>Sādhu</em>- <em>mārganugamanam</em>: ‘Follow the previous <em>ācāryas</em>.’ These are the steps. In <em>Bhagavad-gītā</em> Arjuna said, <em>śiṣyas te ’haà śādhi māà</em>, ‘Now I become Your disciple. Teach me.’ And these rascals are more than Arjuna: ‘There is no need of guru.’ Hm? He says, <em>śiṣyas te ’ham</em>. Why? He was already friend. Why he should submit himself as disciple? That is the beginning of spiritual life.”</p>

<p>This conversation eventually led into another controversial subject in which Caitya-guru said, “One Life Member’s wife was very upset. She came to see you with that rascal yogi. He said that the <em>Vedas</em> mention that we can drink, and that women and men have equal rights.” Prabhupāda acknowledged the meeting with a nod of his head.</p>

<p>Caitya-guru went on, “Then as she was also saying the same thing, you answered her: ‘Okay, if woman and men have equal rights, why don’t you beget children in the womb of your husband?’” Prabhupāda smiled as he recalled the incident.</p>

<p>“She was very upset,” Caitya-guru said. “She said, ‘Prabhupāda sometimes says things like that which are unreasonable.’”</p>

<p>Everyone laughed loudly.</p>

<p>“No,” Prabhupāda said. “I said that if you have equal rights, then make some arrangement. Sometimes you become pregnant, sometimes he becomes pregnant. Why there is not right? Equal right?”</p>

<p>Caitya-guru explained, “She told me, ‘Prabhupāda sometimes says these things that we feel all ashamed.’”</p>

<p>“But in speaking spiritual understanding,” Prabhupāda boldly pronounced, “we cannot make any compromise. What to speak of in Mauritius, in Chicago I told.”</p>

<p>Then Prabhupāda related an exchange he had with a stewardess on a plane journey in America. She had taken exception to a TV show in which Prabhupāda had declared that men and women were not equal.</p>

<p>“I think that was the same stewardess,” Harikeśa offered, “who came in the back and asked us why the Swamijī doesn’t like women.”</p>

<p>Prabhupāda was apologetic for the misunderstanding, but he wasn’t about to alter the truth. “No, no. I don’t say that I don’t like women. But I cannot say that equal rights. How can I say? First of all show equal rights—your husband becomes sometimes pregnant, and then you become pregnant, alternately.” Prabhupāda explained that even in Russia, where they had tried to make people equal, still there are managers and workers. So that sort of equality isn’t ever possible.</p>

<p>When Harikeśa mentioned that nowadays there are women senators and ambassadors, Prabhupāda still did not concede that this means equality. “That simply requires education,” he said. “But by nature the woman’s body is different from man’s.”</p>

<p>However, when Caitya-guru took his comments to imply that this difference means that women are subordinate, Prabhupāda corrected him. “Not subordinate, actually. Their occupations are different...That is another mistake. Just like the leg is walking and the head is directing; so although the occupation is different, both of them are important. We require the head and leg also. If simply head is there, if there is no leg, then who’ll walk? This is the understanding. Not equal. Everyone must have his separate duties to serve the whole. That is the arrangement; this is real understanding. The most important part of the body is head, but that does not mean the leg is not important. Leg is important in its work, and head is important in its work. So we require both, head and tail both. Not that simply leg or simply head. But when we make comparative study, we can understand that head is more important than the leg. If you cut your leg, you can live, but if you cut your head, you’ll die. Therefore the conclusion is: head is more important than the leg. Comparative study. Otherwise, head is also required and leg is also required.</p>

<p>“You collect some flowers, nice flowers, and add with it some green foliage, it becomes more beautiful. Simply flower is not so beautiful. When it is arrayed with some green foliage, then it becomes more beautiful. So we have to take in that sense. But comparatively, the flower is more important than the foliage. But the both of them are required.”</p>

<p>Harikeśa added, “The foliage also becomes beautiful because of the flower.”</p>

<p>“Yes, that is God’s creation,” Prabhupāda agreed. “Just like these trees: they are condemned. But still with trees we can make a beautiful garden, and that is very enjoyable. That is God’s arrangement.”</p>

<p class="verse">* * *</p>

<p>For an ordinary man, a life void of family affairs is almost unthinkable. Thus, Prahlāda Mahārāja’s instructions to develop detachment from worldly affairs are very difficult to appreciate except by those with a very broad understanding and a genuine desire to seek out the real meaning of life.</p>

<p>Sitting on his <em>āsana</em> during class, the perfect representative of the Gosvāmīs, Śrīla Prabhupāda explained how painless this process can be by simply directing the inherent tendency to form bonds back towards Kṛṣṇa. “This is <em>bhakti</em> process. Not that we have to bring a separate attachment. It has to be cleansed. That is described in the <em>Nārada-paṣcarātra: sarvopādhi-vinirmuktaà tat-paratvena nirmalam, hṛṣīkena hṛṣīkeśa sevanaà bhaktir uttamam</em>. Consciousness is there, attachment is there, but it is being covered by so many designations.... Just like we have got feeling for raising children; attachment, that is attachment.</p>

<p>“So what Mother Yaśodā is doing? She is attached to Kṛṣṇa, and that is Vṛndāvana. The same thing in otherwise: Vṛndāvana life means all attachment to Kṛṣṇa. Mother Yaśodā is attached to Kṛṣṇa, Nanda Mahārāja is attached to Kṛṣṇa, the cowherd boys are attached to Kṛṣṇa, the cows and calves are attached to Kṛṣṇa, Rādhārāṇī is attached to Kṛṣṇa, the trees are attached to Kṛṣṇa, the flowers are attached to Kṛṣṇa, the water is attached to Kṛṣṇa. That is Vṛndāvana. Vṛndāvana means the central attachment is Kṛṣṇa. That is Vṛndāvana.</p>

<p>“So if you can create that central attachment for Kṛṣṇa, then it is Vṛndāvana. Then you can create Vṛndāvana anywhere. Any family, any society, any country—just make the point of attachment Kṛṣṇa, and it is Vṛndāvana. That is required. That is the Kṛṣṇa consciousness movement.”</p>

<p class="verse">* * *</p>

<p>Immediately after class, as Prabhupāda relaxed in his <em>darśana</em> room waiting for breakfast, Harikeśa asked some questions about Lord Brahmā. He explained that he had read in the <em>Śrīmad-Bhāgavatam</em> that every living entity upon leaving the spiritual world first falls to the level of Brahmā. He wondered whether that means that each <em>jīva</em> becomes a Lord Brahmā in charge of his own universe, or, as some devotees have interpreted, that he falls to the planet Brahmaloka?</p>

<p>Prabhupāda confirmed that <em>each</em> living being becomes a Lord Brahmā.</p>

<p>A little incredulously I tried to grasp this inconceivable fact. “But that means each and every living being has his own universe?”</p>

<p>Prabhupāda responded rather sharply, “Oh? <em>Śrīmad-Bhāgavatam</em> is wrong? You do not think it is possible for Kṛṣṇa to give everyone his own universe? For Kṛṣṇa anything is possible!”</p>

<p>We brought up the statement that at the end of the universe, Lord Brahmā, as a pure devotee and the head of our spiritual lineage, goes back to Godhead. Prabhupāda confirmed that this does not happen to every Brahmā. The living beings begin their entanglement in material life from that status and then fall further down as their material desires increase.</p>

<p class="verse">* * *</p>

<p>Today during Prabhupāda’s morning massage on the roof, I tentatively asked if I could continue as his servant. I explained that I had become very attached to personally serving him, and had no specific engagement to return to. Although Gopāla Kṛṣṇa wanted me to go to Calcutta to help manage the temple, I frankly admitted that I had no experience with management in India, and thus I didn’t really feel qualified.</p>

<p>Prabhupāda thought for a moment, and then asked what my educational background was, in particular whether I knew any foreign languages. I confessed to having no talent for learning foreign languages. In fact, it was my worst subject in school.</p>

<p>He listened to what I said, then sent me to call Harikeśa. “So,” he asked Harikeśa, “he wants to remain with me. What do you think?”</p>

<p>“Well, he’s doing very nicely. I think it would be a good thing for you to have a steady servant.”</p>

<p>“What about Nitāi?” (Nitāi is in Bombay renewing his visa and is supposed to rejoin Prabhupāda there.)</p>

<p>Harikeśa was forthright. “Well, Nitāi joined up with us in America. But when we got here, he wanted to leave and stay to develop the <em>gurukula</em>. There’s no guarantee he won’t want to leave again in another few months. But Hari-śauri can remain as your permanent servant and you won’t be disturbed by any more changes.”</p>

<p>Śrīla Prabhupāda tipped his head. “All right.”</p>

<p>I am ecstatic! I can’t believe my good fortune! Three or four weeks ago I was cleaning the temple floors, and now I am to be His Divine Grace’s permanent personal servant. This is solely his mercy, because I have absolutely no qualification. Unlike his previous servants I can’t cook, type, or do anything useful. Yet he’s keeping me on just to purify me. Although I have no particular ability to do any of the servant’s duties, I have tried to do my best to perform whatever menial service Prabhupāda has given me. It seems that because of this service attitude, Prabhupāda is prepared to keep me on.</p>

<p><strong>December 11th, 1975 </strong></p>

<p>Prabhupāda always begins his morning walk at dawn when the still, fresh morning air and quiet atmosphere are healthy for both body and mind. Few people are out then; only the occasional bullock or buffalo amble slowly past, straining with heavily loaded carts. The drivers peer with somnambulant curiosity from under thick blankets at the “Western” Vaiṣṇavas struggling to keep up with their master, straining to hear his every word as he enlightens and entertains us with his vision of the world seen through the eyes of <em>śāstra</em>.</p>

<p>Śrīla Prabhupāda always strictly adheres to the authoritative statements of the Vedic literature. Yet, he expertly assesses our particular time, place, and circumstance and delivers the Vedic conclusions in a way that is easy for us to understand and apply. Despite his obvious success in spreading Kṛṣṇa consciousness without any loss of its true potency, there are those who criticize his adaption of the principles of <em>sādhana</em>. These people sometimes confuse the minds of his neophyte disciples with other ideas.</p>

<p>All over India many <em>bābājīs</em> and gurus claim to be authorities on spiritual life, yet they find fault with Prabhupāda’s honest efforts to rescue the fallen conditioned souls.</p>

<p>Here in Vṛndāvana, Śrīla Prabhupāda is especially protective of his vulnerable young disciples, always watching to see that we do not become infected with ideas that will poison our spiritual lives. He strictly forbids us to live outside of the temple, and in the past posed strong opposition to the tendency of some devotees to go off to Rādhā-kuṇḍa to live with a particular <em>bābājī</em> there. He is very much on his guard to see that his spiritual children are not beguiled by envious or ambitious spiritualists. He knows that such people can easily undermine our faith and cause havoc in our spiritual progress. He constantly insists to the temple leaders that they be alert in this regard.</p>

<p>These impediments to our spiritual lives do not always come from non-Gauḍīya-sampradāya elements. Prabhupāda is aware that some of his Godbrothers are less than enthusiastic about his achievements. The natural respect for our spiritual elders we’ve imbibed from him could result in an unsuspecting fraternization with members of their <em>maṭhas</em>. This could leave us vulnerable to subtle impurities, derailing our dependency on Śrīla Prabhupāda. So this is also something he is constantly combating.</p>

<p>During this morning’s walk Akṣayānanda Swami sought śāstric verification for our standards of chanting <em>japa</em>, which some have faulted. “Of course we accept,” he said. “When you tell us to chant sixteen rounds, we accept that figure in perfect faith. You’re the <em>ācārya</em>. But what if we wanted to convince others? Is there any <em>śāstric</em> or Vedic verse we can refer to, to corroborate that at least they must chant sixteen rounds? Or that many number of names?”</p>

<p>“No,” Prabhupāda answered. “In the <em>śāstra</em> it is not said like that...It is said, <em>saṅkhyā-pūrvaka</em>.... You must fix up in numerical strength...whatever you can...But I have fixed up sixteen rounds, because you cannot do.”</p>

<p>Akṣayānanda Swami confirmed, “That’s all we can do.”</p>

<p>Prabhupāda smiled and added, with a touch of irony, “Yes. That also is difficult.”</p>

<p>Akṣayānanda Swami laughed, “Yes.”</p>

<p>Prabhupāda continued, “Otherwise, Haridāsa Ṭhākura was chanting three <em>lakhs</em>. So, that is not possible. You should not imitate, but whatever you fix up you must do. That is wanted.”</p>

<p>“Yes,” Akṣayānanda Swami said. “I was told that in the beginning you asked the first disciples to chant sixty-four rounds?”</p>

<p>Prabhupāda said, “Yes.”</p>

<p>“They were unable,” Akṣayānanda said. To our laughter he added, “Then you asked them to chant thirty-two?”</p>

<p>Prabhupāda grinned. “Hm.<em> Saṅkhyā-pūrvaka-nāma-gāna-natibhiḥ</em>. <em>Saṅkhyā-pūrva</em>, or numerical strength must be there. And you should follow rigidly.”</p>

<p>“So if we are serious and sincere, it means that that sixteen will increase to continuously chanting,” Akṣayānanda Swami said.</p>

<p>“You can do also now,” Prabhupāda said. “It’s not that because I’ve finished sixteen rounds...You can increase. But that sixteen must be finished.”</p>

<p>“Yes,” Akṣayānanda Mahārāja agreed. “What I mean is, that’s to bring us to the platform of chanting constantly. At least we must do that numerical number. If we’re fortunate, we may finally be able to chant constantly day and night.”</p>

<p>“Yes,” Prabhupāda confirmed.</p>

<p>As we walked on, people began to appear here and there, a few at first, the numbers gradually increasing, going about their morning duties in preparation for another bout of daily labor. A few bicyclists passed us, whizzing silently along under self-propulsion, swerving at the last moment to avoid seemingly certain collision. “More dangerous than cars,” Prabhupāda commented.</p>

<p>Śrīla Prabhupāda then initiated a conversation about his favorite subject, materialistic science. He asked whether scientists acknowledge that there is life on the sun globe. Thus a long, animated discussion ensued about the defects of scientific speculation and the inability of the godless scientists to solve the real problems of life—birth, death, disease, and old age.</p>

<p>He walked as far as his halfway mark, a solitary house called “Moda Place”, then returned at the same brisk pace.</p>

<p>The temple bell rang as Prabhupāda entered the compound grounds. He walked across the red flagstones and into the temple to greet Their Lordships Kṛṣṇa and Balarāma and give <em>Śrīmad-Bhāgavatam</em> class. Just before entering the temple door, he summarized modern society. “Hiraṇyakaśipu civilization. And we are presenting Prahlāda civilization. So this is a struggle, but ultimately Prahlāda will come out triumphant and Hiraṇyakaśipu will be killed. <em>Jaya!</em> Hare Kṛṣṇa!”</p>

<p>Prabhupāda seems especially enlivened from his translation work on the history of Prahlāda. Many of his conversations draw graphically from Prahlāda’s teachings. His classes are strong and powerful indictments of everything wrong with the modern world. The small child Prahlāda’s battle and victory against overwhelming odds by his full dependence on Kṛṣṇa is a fit comparison to Prabhupāda’s own single-handed struggle against a world populated with extremely materialistic people.</p>

<p>Today’s verse was from the Seventh Canto, Sixth Chapter, verse nine. “Who is the person who is too much attached to household life on account of being unable to control the senses and who can liberate himself because he is bound up very strongly with the rope of affection for the family, namely wife, children, relatives, etc.?”</p>

<p>After reading out the Sanskrit, Prabhupāda recalled the morning’s conversation and explained the difference between the scientists’ approach to life and that of a devotee. The materialists derive enjoyment from killing, not knowing that this only increases their problems; but the devotees solve all problems and attain happiness by cultivating detachment.</p>

<p>He illustrated this by citing an incident from his early days of preaching in the West. “The examples are here.... Although you are young boys and girls, you have given up so many nonsense things. This is called <em>vairāgya</em>, detachment. Meat eating is the general life of the Europeans and Americans, but at the present moment if someone offers you millions of dollars and he requests you, that you take some meat with me, I think you will deny. This is called <em>vairāgya</em>. I’ve actually seen. Our Gargamuni was sent to his father. I advised him that, ‘Your father has big business; just take it for Kṛṣṇa consciousness.’ So father was very glad, but he offered meat.</p>

<p>“When Gargamuni said, ‘Father, I cannot take meat,’ then the father became angry. He drove him away. Hiraṇyakaśipu father. So Gargamuni came back. The young man, father’s property, he refused to take it. This is <em>vairāgya</em>. And the whole Kṛṣṇa consciousness movement means <em>vairāgya-vidyā</em>, the education of detachment.”</p>

<p>He referred to Śrīla Rūpa and Sanātana Gosvāmīs as examples in recent history of learned and intelligent men who, after having achieved great things materially, practiced the art of detachment to attain the goal of life. “Voluntarily accepting poverty, this is Indian civilization, this is Vedic civilization—not to increase material opulence, but to decrease. The more you decrease, you are civilized. But the Western countries, if you decrease, if you instruct them to decrease this nonsense activities, they’ll say, ‘Oh, this is primitive.’ Primitive. This tendency is present. But actually the primitive civilization—not primitive, that is, very sober civilization—instead of increasing unwanted necessities, decrease it. That is <em>Śrīmad-Bhāgavatam</em>.”</p>

<p>Finally, Prabhupāda nicely summed up the meaning of his spiritual movement and the opportunity he is presenting to us by the construction of the Krishna-Balaram Mandir and Guest House. “We are interested to construct a nice temple, but we are not interested to construct a very big skyscraper building. We should live very humbly. Vṛndāvana means everyone is engaged how to keep Kṛṣṇa in comfort. This is Vṛndāvana. Not for personal comfort. The whole Vṛndāvana is engaged, beginning from Mother Yaśodā, Nanda Mahārāja, the young <em>gopīs</em>, and the young cowherd boys; that is Vṛndāvana. Kṛṣṇa is the center. So the more we become engaged with the view to giving Kṛṣṇa the comfortable position, that is our aim of life. Then we can be liberated.”</p>

<p>Prabhupāda’s words are not impractical expressions of idealism. They have the greatest impact because he himself is the very epitome of a Brijvāsī, a resident of the holy <em>dhāma</em>. He lived for years in total poverty, without any care except how to preach. He has built a grand temple, a guest house, an <em>āśrama</em>, and he is still preaching. He goes on expending his energy for Kṛṣṇa’s comfort at the expense of his own, without exhibiting any attachment for sitting down in his spacious quarters in comfortable retirement.</p>

<p class="verse">* * *</p>

<p>Harikeśa’s article is taking shape, and he read it out this evening, enlivening Śrīla Prabhupāda and instigating a lively conversation. Prabhupāda’s idea is to show how everything has a single ultimate cause—life. Scientists look for life within chemicals, but find none. Yet life is there, and the chemicals act and react in exact ways for a purpose. So, according to whose purpose? Understanding that, he said, should be the goal of knowledge.</p>

<p>The moon is also one of Śrīla Prabhupāda’s favorite topics. According to the scientists, there is no life on the moon, and they say it is doubtful whether there is life on any other planet in our solar system.</p>

<p>Prabhupāda argued that life is everywhere: on the moon, sun, and every other planet. He said that even on this planet life can be seen everywhere: in water, air, and on land. This is the statement of <em>śāstra</em>. Living beings are not material, but spiritual, and exist in all conditions of matter.</p>

<p>Prabhupāda detailed the progression of material development as described in the Third Canto of the <em>Bhāgavatam</em>. He explained how the individual elements come, one after another, in a systematic chain of cause and effect.</p>

<p>Harikeśa listened attentively in order to incorporate the added information into his work.</p>

<p>“First there is sound,” Prabhupāda explained, “and from sound, ether is generated. Then from ether, air. When there is friction in the air, then fire comes—electricity. When excessive heat is there, then water comes. Just like we see how immediately after the heat of the summer the rainy season comes. From water, earth comes. If we examine a drop of water when it dries up, there is some small deposit.</p>

<p>“All the elements have accompanying characteristics and attributes. In this way, by the influence of time, the elements are generated, one after another. All the bodies of the living beings are made from these elements. So why not fire bodies? The scientists cannot perceive. The defect is theirs, but they judge everything by their own standards of imperfection and advertise this as knowledge.”</p>', '', '1975-12-10', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date,
    updated_at = now();


  -- December 12th, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'December 12th, 1975', 10,
    '', '', '', '',
    '', '', '', '',
    E'<p>There is an old man with white hair and beard who recently moved into the <em>āśrama</em>. When Prabhupāda came out from his front porch to begin his walk, all the devotees offered their obeisances except the old man. He was busy throwing water from a brass <em>loṭā</em> onto the <em>tulasī</em> plants in the small garden in front of Prabhupāda’s house. He wasn’t very conscious of Śrīla Prabhupāda’s presence, and a few devotees felt he was being offensive. Prabhupāda’s mood was different. “This is devotee!” he said, turning to all of us. “Just see how nicely he is watering the <em>tulasī</em> tree. You should all do this.”</p>

<p>Out on the road, Prabhupāda’s thoughts turned to last night’s discussion on Harikeśa’s science article. He had Harikeśa give a brief summary of the premise to his attentive audience.</p>

<p>As the subdued but rising sun cast its long shadows and steadily increased its fiery and brilliant effulgence, Prabhupāda challenged that our own imperfectness leads us to think there is no life on the sun. He described how the Tata Iron and Steel Works appears from a distance as a mass of flame, but that does not mean there are no people there. Similarly, the sun appears to our eyes as a ball of flame, but that does not mean there is no life. The discussion invigorated Prabhupāda and enlivened the devotees, and the exchange continued throughout the walk.</p>

<p>Early morning walking is a very popular form of exercise in a country where people habitually rise at dawn, and Prabhupāda generally greets familiar faces each morning with “Hare Kṛṣṇa!” and “<em>Jaya!</em>” When a couple of local residents approached, he also drew them into the polemic. Presenting his arguments, using the example of the Tata Iron Factory, he solicited their opinions. He encouraged one of them to join in by referring to him as a “<em>bora</em>-<em>bora</em> scientist”, a big-big scientist. After a minute’s conversation they also concluded that <em>śāstra</em> must be correct.</p>

<p>Prabhupāda explained that it ultimately comes down to what authority one follows. Scientists quote the findings of other scientists, and we quote the <em>Bhagavad-gītā</em>. The real problem is that everyone thinks himself independent and ignores Kṛṣṇa’s statement, <em>vāsudevaḥ sarvam iti</em>, that He is everything.</p>

<p>To emphasize the foolishness of the materialistic mentality, Śrīla Prabhupāda made a brilliantly funny imitation of a so-called independent man. “He prefers to be controlled by the laws of nature instead of by Kṛṣṇa. That is his misfortune. He is controlled, but he thinks I am free. That is ignorance. <em>Mūḍhā</em>. Just like I am the state citizen. I am not free. I must work according to the state laws. ‘I don’t care for the government.’ That is my foolishness. You have to care. At home I can say to my wife, ‘I don’t care for government, I don’t care for police.’ But when there is crime, when the police come, then he says, ‘Ohhnn!’” Śrīla Prabhupāda made a sad face, making everyone laugh.</p>

<p>Prabhupāda continued, “There is an example that the <em>murgi</em>, what do you call? Chicken? The male?”</p>

<p>Someone answered, “Cock?”</p>

<p>“Yes. So when in the morning, it is let loose, he says, ‘I don’t care for <em>anywwhawwoone...caawwwcawww</em>.’ Then in the evening when he is pushed into the nest,” Prabhupāda became very subdued and humble as he imitated, “‘<em>Caawcaacaacaaw</em>. Whatever you like you can do. Whatever you like you can do!’”</p>

<p>We all burst out laughing at Śrīla Prabhupāda’s comic impression.</p>

<p>“This is the example, you see. When he’s under arrest,” (imitated a groveling manner). “‘Now sir, whatever you like you can do with me. If you like, you can excuse me.’” Prabhupāda laughed. “And when he’s out...” Then in a loud, boastful voice, “‘I don’t care for anyonnnne...!’ <em>Murgi</em>intelligence. ‘I don’t care for anyone. I am God.’ <em>Murgi</em> logic. <em>Harāv abhaktasya kuto mahad-guṇā manorathenāsati dhāvato bahiḥ</em>; if one is not a devotee his only business is to remain on the mental platform and concoct things. And at the end he thinks that I am God. Concoction. If he’s not a devotee, he has no good qualification. He is simply hovering on the mental platform.”</p>

<p>“The sixteenth chapter describes it very nicely,” I ventured, thinking of a verse in <em>Bhagavad-gītā</em>.</p>

<p>“Yes. <em>Pravṛttià ca nivṛttià ca, janā na vidur āsurāḥ</em>: In which way we have to direct our activities, in which way we shall have to stop our activities—they do not know. <em>Āsura ajana</em>. Because they don’t take direction from God. They make their own way of speculation. Therefore they are animals, or demons. Because they do not take direction during life, therefore at the end Kṛṣṇa comes, <em>mṛtyuḥ sarva-haraś cāham</em>. All mental speculation, creation, is taken away. At death. In Bengal it is said, <em>kṛṣṇa nāma koro vai ar sabe miche palaiba patha nāi yama āche piche</em>: ‘Take to Kṛṣṇa consciousness, don’t try to escape. Because behind you there is Yamarāja!’ He will finish your all concoction.”</p>

<p class="verse">* * *</p>

<p>This is Prabhupāda’s last day in Vṛndāvana. Tomorrow he goes to Delhi for several days and then on to Bombay.</p>

<p>He gave his final lecture on Prahlāda Mahārāja’s instructions in Seventh Canto, Sixth Chapter, verse ten. “Money is so dear that one conceives that money is sweeter than honey. And who can give up the desire of accumulating such money, especially in household life? The thieves, the professional soldiers, or the mercantile community try to acquire money by risking the very life.”</p>

<p>He explained the foolishness of the materially attached persons. Everything that a person holds near and dear is in fact the very cause of his suffering, and to maintain his household a person may take on all manner of dangerous occupations, even at the risk of death. This is all going on merely because of sexual urges. He pointed out that those who are <em>brāhmaṇas</em> never take up such a risky life, preferring instead to engage in the peaceful development of spiritual affairs and to live a simple life free from such desires.</p>

<p>In that respect he said that the “hippie” lifestyle of many Western youths was actually an advantage. It simply had to be directed properly. “Therefore I was saying these Europeans, American boys, they prefer to become hippies; that is another process of desirelessness—don’t want. They are coming from rich man’s house, but they don’t want. That is desireless, but it is not properly utilized. Now they have got this opportunity: how to serve Kṛṣṇa. Therefore they are advancing so quickly.”</p>

<p class="verse">* * *</p>

<p>During his massage Prabhupāda heard a letter from Jayaśacīnandana dāsa in Los Angeles written on behalf of a group of <em>brahmacārīs</em>. In every ISKCON temple in the world the assembled devotees offer their obeisances to the Deities in the morning as the Govindam prayers loudly play. George Harrison recorded it and Yamunā dāsī sings the <em>mantra</em>s.</p>

<p>Disturbed by this custom, Jayaśacīnandana quoted Śrīla Bhaktivinoda Ṭhākura (as well as Śrīla Prabhupāda) that if a <em>brahmacārī</em> hears and is attracted to a woman singing, it is a subtle falldown. “In light of this,” he wrote, “many of the <em>brahmacārīs</em> approached the temple president to see if it would be possible that when the Deities are greeted in the morning that instead of listening to Gurudāsa Mahārāja’s former wife singing the <em>Brahma-saàhitā</em> prayers, we could listen to Your Divine Grace rather than hear a woman sing. He did not want to change the tape because it had been a standard thing in ISKCON since 1970. So requested by many devotees, I am enquiring from Your Divine Grace if we could play a tape recording of you singing instead of a woman when the Deities of Rukmini-Dvarakadisa are greeted in the morning. I am sure that all the devotees would be enlivened to hear you instead of electric guitars, the London symphonic orchestra, etc. etc.”</p>

<p>Śrīla Prabhupāda was not pleased. He said that constantly changing things is “our Western disease.” His reply was short and direct. “No! You have made some discovery. All along you have been hearing the recording of Yamuna dasi, and now you want to change. It is not ordinary singing, it is concert. Many people are singing, so it is not bad. Just like sankirtana, many voices are there—men and women; so it is the same thing, sankirtana. I approve of it. Here in the Krishna-Balaram temple we are hearing the same recording every morning. So if it is good here, why not there?”</p>

<p class="verse">* * *</p>

<p>Every day since Prabhupāda has been in Vṛndāvana Bhagatjī has been making <em>capātīs</em> for him. Prabhupāda normally doesn’t see anyone while he eats, but he makes an exception for Bhagatjī, who brings the last <em>capātī</em> in himself. He then sits and chats with Prabhupāda for five or ten minutes before returning to his home.</p>

<p>Today Bhagatjī came with a donation of 53,000 rupees in cash, given on behalf of his mother for the purchase of land for the <em>gurukula</em>. A stone bearing her name as the donor will be placed on the land after its registration. It is a widespread tradition in India to give donations to religious institutions in the name of one’s deceased relatives. Thus they get both material and spiritual benefit in their new birth. Prabhupāda is very happy that Bhagatjī has come forward to help with management of the temple, and he looks to him as an experienced local to guide and train his Western disciples in the intricacies of Indian management.</p>

<p class="verse">* * *</p>

<p>Prabhupāda observed his normal program, while we spent most of the day preparing for three months’ travel. He will not be returning until the Gaura Pūrṇimā festival in March. We stored everything not required in his almirah and cupboards, while packing everything else to be ready for our early morning departure. We left his desk paraphernalia, toiletries, and dictaphone. They’ll go in at the last minute.</p>', '', '1975-12-12', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date,
    updated_at = now();


END $$;
