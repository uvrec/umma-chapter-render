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


  -- March 8th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'March 8th, 1976', 52,
    '', '', '', '',
    '', '', '', '',
    E'<p>In the early morning Prabhupāda called Tamal Krishna Goswami into his room. He told him that Madhudviṣa Swami should be made GBC Vice Chairman for the year and that Gargamuni Swami should be given GBC responsibility.</p>

<p>Tamal Krishna Mahārāja replied that the GBC had already considered Gargamuni, but they decided not to appoint him because he does not regularly chant his rounds. Some of Gargamuni’s men have left him, complaining that his devotional standard is not strict.</p>

<p>Śrīla Prabhupāda said that despite this he should become a GBC member, the reason being that Gargamuni has “creative energy” that should be used constructively. Otherwise he may become frustrated and misapply it.</p>

<p>Prabhupāda also told Tamal Krishna that he should become a BBT trustee because of the tremendous work his party is doing in book distribution. He suggested that Gopāla Kṛṣṇa be tried out for one year here in India, not as a full trustee but as a BBT manager, to see how he does. The BBT Trustees will then be: Śrīla Prabhupāda as the head, Rāmeśvara, Bhagavān, Hansadūta, Hridayānanda, and Tamal Krishna, all for Europe and America; and for India, Gopāla Kṛṣṇa, Girirāja, and Jaśomatīnandana prabhus.</p>

<p class="verse">* * *</p>

<p>As the sun arose, Śrīla Prabhupāda toured the temple grounds. He took the opportunity to ask Siddha Svarūpānanda Goswami and some our ISKCON authorities about their dispute. He wanted to hear all points of contention in order to try to settle the long-simmering quarrel.</p>

<p>Madhudviṣa Swami spoke up first. His South Seas zone was the most seriously affected when Siddha Svarūpa and his followers left ISKCON. One temple had to be closed and several others were severely depleted in manpower. Siddha’s group is most active in New Zealand and Australia, sometimes causing friction with anti-ISKCON propaganda.</p>

<p>Madhudviṣa Swami itemized several points of contention, especially the tendency of Siddha Svarūpa’s followers to focus their allegiance on him rather than on Prabhupāda. He also complained that they prefer to distribute books written by Siddha Svarūpa rather than Śrīla Prabhupāda’s.</p>

<p>Siddha Svarūpa vigorously denied the allegations.</p>

<p>Prabhupāda himself said he didn’t think Siddha’s having a following was a serious thing. On the whole, he seemed to minimize the complaints against Siddha Svarūpa. He hoped to heal their rift, and told them in a good humoredly fashion, “Whatever is done is done. Now let us make some adjustment and work combinedly. That is my proposal.”</p>

<p>Siddha Svarūpa, however, didn’t think he could comply with this request. “Śrīla Prabhupāda, the problem is that to work combinedly, they think that that means that I surrender to them and I do everything as they say; otherwise I am not surrendering. So as far as I am concerned, I cannot work with them... .”</p>

<p>The discussion became a little acrimonious as Siddha Svarūpānanda became increasingly defensive. He eventually revealed his underlying mentality by adamantly proclaiming that he would never accept control by anyone, especially not the GBC.</p>

<p>Prabhupāda offered to make him a GBC member, but he refused even to consider this alternative. This seemed to be the real crux of the issue—he doesn’t want to work with his Godbrothers on any level.</p>

<p>Another of Madhudviṣa Mahārāja’s complaints was that those who have left ISKCON to join Siddha Svarūpa now lack the discipline they had formerly.</p>

<p>This seemed to strike a chord with Śrīla Prabhupāda. He clearly explained that unless there is discipline, there is no question of “disciple.”</p>

<p>Siddha Svarūpa didn’t have any disagreement with that but said he considered that the person being disciplined must voluntarily put himself under someone’s discipline.</p>

<p>Śrīla Prabhupāda agreed with his point. “Accepting a spiritual master means voluntarily accepting somebody to rule him. There is no question... I have no power to rule over you unless you voluntarily surrender.”</p>

<p>When Gurukṛpa Swami mentioned that <em>vaidhi-bhakti</em> means sometimes doing things that one does not like to do, Prabhupāda also agreed. To illustrate the point he told a story of a famous lawyer during the days of British rule, C. R. Das, who was earning a huge amount of money. He was also a supporter of the Congress party, but in a meeting it was decided that party members should not cooperate with the British court system. C. R. Das fought the proposal, offering to use his earnings to promote the party, but the resolution was passed. This meant he lost everything, but because the majority decided, he had to do it.</p>

<p>Prabhupāda said that of course we are not interested in democracy; we follow the instructions of the spiritual master. But the point is that we have to work in a cooperative and systematic way to spread Kṛṣṇa consciousness all over the world so that people may be highly benefitted. He said that whatever misunderstandings are there should be adjusted, and we should work wholeheartedly together to relieve the suffering of the people.</p>

<p>Ultimately, in Prabhupāda’s summation, he said there seemed to be a disagreement not in philosophy but in the matter of process. “You are thinking this way, he is thinking that way. That is the difference. Otherwise he is also eager to push on Kṛṣṇa consciousness; you are also.”</p>

<p>Tamal Krishna Mahārāja suggested the problem was that both parties believe Prabhupāda was thinking their way.</p>

<p>So Prabhupāda brought the discussion to an end by declaring that he will give his personal verdict and they should all accept that. “Not your way, not his way. Let me understand what is the way you are trying to follow, what is the way he is trying to follow. Now I shall give my verdict, that ‘This is the right way.’” Turning to Siddha Svarūpa he asked him, “Are you agreeable to this?”</p>

<p>“Yes.”</p>

<p>“Then thank you, no more talk now. We shall talk later.”</p>

<p class="verse">* * *</p>

<p>About midday, as Prabhupāda took his massage on the roof, Siddha Svarūpānanda Mahārāja came to see him with a nice poem he had written. He was upset and crying as he read it out by way of apology for his defensive manner during the earlier conversation.</p>

<p>After talking sympathetically with him for a few minutes, Prabhupāda had me find Madhudviṣa Swami. As the two sat before him, they discussed the dispute, now in a much more relaxed mood.</p>

<p>Prabhupāda urged them to settle their differences. He gave them indications of what he did and did not approve.</p>

<p>Siddha Svarūpa and his followers are not inclined to worship Deities in a large temple setting, yet some of them have recently asked for brahminical initiation in order to worship Deities in their own homes.</p>

<p>Prabhupāda told Siddha Svarūpa that Deity worship is not to be introduced in private homes until his men have been trained up to the proper standard found in ISKCON temples. However, he gave full endorsement for their <em>kīrtana</em> and <em>prasādam</em>-distribution programs.</p>

<p>Siddha Svarūpa has also been criticized for not strictly adhering to the fundamental practices like attending <em>maṅgala-ārati</em>, worshiping the Deity, and wearing the attire of a <em>sannyāsī</em>, so Prabhupāda requested him to travel with him for a while so as to become more fixed up in the regulations of <em>sannyāsa</em> life. However, Siddha Svarūpa was not keen on this idea and declined Prabhupāda’s offer. He said that he preferred to preach on his own, “As I know how.”</p>

<p>Prabhupāda didn’t push the point, and he said that as long as the <em>Bhagavad-gītā</em> is distributed there is no fault. But he did ask him to shave his head.</p>

<p>When matters appeared settled, Prabhupāda asked each of them how old he was. Madhudviṣa Swami was the elder by one year. Turning to Siddha Svarūpa, Prabhupāda said, “So Madhudviṣa Mahārāja is senior to you both in age and in <em>sannyāsa</em>. So you work cooperatively together and take good instruction from him.”</p>

<p>Outside Śrīla Prabhupāda’s room they offered their obeisances to each other and embraced. So to some extent, relations were improved by the medication of Śrīla Prabhupāda’s touch and he seems to be healing the rift.</p>

<p>After they had gone, I questioned Śrīla Prabhupāda again on the criticism that Siddha Svarūpa’s men are more attached to him than to Prabhupāda.</p>

<p>Prabhupāda shrugged it off, saying it is all right, it is not harmful. He said that each of us has to become a guru and accept many disciples. But as a matter of etiquette, one should wait until his own spiritual master has departed before doing so.</p>

<p>After lunch, I questioned him further. He told me that having a following is not such a serious offense. But if someone thinks that he is qualified, and accepts disciples in the presence of his own spiritual master, that in itself would be his disqualification.</p>

<p>Replying to my question whether one has to be a pure devotee to make disciples, he said that one has to be strictly following the principles. That is the requirement. Then he can be considered to be on a pure platform.</p>

<p class="verse">* * *</p>

<p>Not much mail is coming in now, since most leaders are here for the festival. But today Puṣṭa Kṛṣṇa Swami read out a pleasing letter from Robert Veiga, a science student in Dallas. He is studying physics and math, but he comes regularly to the temple and chants sixteen rounds. Robert began by glorifying Śrīla Prabhupāda.</p>

<p>“You are the only person that I have approached that claims (with logical argument) to be relaying the undaunted truth. Every scientist that I have ever approached for truth reprimanded me quickly by stating that absolutes are not part of the ‘real world,’ and therefore only relative truths can exist. Although some scientists are Deists, they do not have a place for God in everyday activities. I therefore submit to you as my authority.”</p>

<p>His idea is to attempt to prove to the scientists, using their own weapons of “mathematical trickery, logic, deductive and inductive instruments,” that they are wrong in their conclusions. He wrote that once this is done, “the knowledge in the Srimad-Bhagavatam can be presented and verified to the best extent possible.”</p>

<p>However, he has received conflicting advice from the devotees on whether he should continue with his studies and what his service should be. Therefore he requested Śrīla Prabhupāda’s guidance.</p>

<p>Śrīla Prabhupāda was very glad to receive such a letter; it was once again a confirmation that his books are having the effect he desires. Although, as he often says, he is “a layman” in the science field, his arguments are convincing many men of science of the fallibility of their theories and the superiority of the Vedic version.</p>

<p>In his reply he encouraged Robert to continue with his studies. “There is a Bengali proverb: tor shil tor noda, tor bhangi dater goda. ‘I take your mortar and pestle and I break your teeth.’ This means we use the scientists’ own weapons and with them we defeat their atheistic philosophy.</p>

<p>“There is another example. A hatchet is sitting before a tree. The tree asks, ‘What are you doing here?’ The hatchet replies, ‘I have come here to cut you down.’ The tree then said, ‘You cannot cut me down alone, but with the help of my descendants you can do it.’</p>

<p>The idea is that the ax-handle is made of wood, and so without the assistance of the wooden tree, the hatchet is useless. Similarly, we can use our materialistic knowledge to defeat the atheistic philosophy of the scientists.</p>

<p>“So you can continue your studies and learn what is shil and noda (mortar and pestle) so you can break their dater goda (break their teeth).”</p>

<p class="verse">* * *</p>

<p>Sharma dāsa came over from his hideaway at the <em>gośālā</em> at 4:00 p.m. to see Śrīla Prabhupāda with a request to leave Māyāpur. He wanted to go to chant at Rādhā Kuṇḍa. With so many devotees here now for the festival, he complained that he is again being disturbed in his chanting.</p>

<p>Prabhupāda told him that this indicated that his mind was restless. Previously he had asked to live in a tree, and now Rādhā Kuṇḍa. “You are not fit for <em>nirjana-bhajana</em>,” Śrīla Prabhupāda told him. “This is for <em>mahā-bhāgavatas</em> like Haridāsa Ṭhākura, who are completely undisturbed. Ṭhākura Haridāsa lived in a cave with a large snake but was not perturbed.” He added that if one’s mind is even a little disturbed, <em>nirjana-bhajana</em> will not be possible.</p>

<p>After this meeting, Sharma prabhu later told Puṣṭa Kṛṣṇa Swami that he had decided to return to Africa and preach. Prabhupāda was pleased to hear this.</p>

<p class="verse">* * *</p>

<p>In the evening Prabhupāda told Puṣṭa Kṛṣṇa Mahārāja and myself that he likes the idea of having one servant, along with a <em>sannyāsī</em> as his secretary. Puṣṭa Kṛṣṇa Mahārāja is very competent, and apart from the regular secretarial duties, is also transcribing Śrīla Prabhupāda’s translations and commentaries. Prabhupāda said that I should become trained up in cooking. Then if we three travel, it will be convenient and inexpensive.</p>

<p class="verse">* * *</p>

<p>There are 150 western devotees here now.</p>

<p>Hearing that some Australian devotees have been purchasing fruit from the market, and also remembering Prabhupāda’s previous comment that no one should eat anything without first offering it to the Deities, I asked him if they should stop.</p>

<p>Prabhupāda wasn’t disturbed. He replied, “Fruit may be offered within the mind.”</p>

<p class="verse">* * *</p>

<p>Today I presented Śrīla Prabhupāda with some new neck beads, strung and cleaned up by Rasājṣā dāsa, a young Australian devotee working with the Nāma Haṭṭa party in Japan. The tiny beads on his existing strand were beginning to split off. So he accepted the new set and, to my great delight, gave me the old ones, some of which I presented to Rasājṣā prabhu.</p>', '', '1976-03-08', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date,
    updated_at = now();


  -- March 9th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'March 9th, 1976', 53,
    '', '', '', '',
    '', '', '', '',
    E'<p>During the walk Śrīla Prabhupāda again criticized some of his Godbrothers for making false claims. He said that in sixty years they have not been able to attract any foreign students, nor have they published any books. Still they are envious and proudly claim to have all the blessings of Śrīla Bhaktisiddhānta.</p>

<p>As we walked, the discussion turned to how to combat the flooding of the Ganges in our future city here in Māyāpur. He told us to make a system of canals to drain the land. He also suggested that we could use the need for flood avoidance as a reason to get our land acquisition application through on an emergency basis.</p>

<p>Prabhupāda urged us to use our abilities as Europeans and Americans to make our plans. He joked that even though he is an Indian, “I have no Indian plans. My plans are all American.” He told us that generally when Indians think of emigrating, they head for London. But, in the days when he was planning to go the West, he only thought about going to America. He was even dreaming sometimes that he had come to New York.</p>

<p>Now the movement has a good reputation with the Indian government, although having so many American followers can also be a problem. Prabhupāda said that Indira Gandhi has such high regard for him that she received him even in the midst of the National Emergency. She had expressed great appreciation and faith in him for what he has done, but she admitted she is afraid of the Americans.</p>

<p>Toward the end of the walk, Madhudviṣa brought up a question about the role of <em>sannyāsī</em>, <em>brahmacārī</em>, and <em>gṛhastha</em> in ISKCON. “In one of your purports you say that a <em>sannyāsī</em> should never discourage a young man from getting married. But on the other hand, we have understood that a <em>sannyāsī</em> should encourage young men to remain <em>brahmacārī</em>. So it seems to me like there’s some kind of a... ”</p>

<p>Prabhupāda replied, “According to time, circumstances. Just like Kṛṣṇa says, <em>niyataà kuru karma tvam</em>: ‘Always be engaged in your prescribed work.’ And, at last, He says <em>sarva-dharmān parityajya mām ekaà śaraṇaà vraja</em>. Now we have to adjust. That is not contradiction. That is suitable to the time and circumstance. <em>Karma-kāṇḍa</em> is also recommended in the Vedas. There are three divisions: <em>karma-kāṇḍa</em>, <em>jṣāna-kāṇḍa </em>and <em>upāsana-kāṇḍa</em>... . You have to become the eternal servant of Kṛṣṇa. Either you go through<em>karma </em>or <em>jṣāna</em> or yoga, it doesn’t matter. The ultimate aim is how to reach Kṛṣṇa. That is wanted.”</p>

<p class="verse">* * *</p>

<p>The GBCs came to see Prabhupāda at the end of their meeting. Again they gathered in his room, and one by one the results of their day’s deliberations were read out.</p>

<p>They have been debating the <em>sannyāsī/gṛhastha</em> issue and wanted Śrīla Prabhupāda’s confirmation on some new guidelines on how those in the <em>gṛhastha āśrama</em> should be handled. They have made a series of strictures aimed at preventing householders, including Temple Presidents, from being financially dependant on the Society. Their idea is that the Society should not become overburdened and thus have its resources diverted from the preaching effort. The proposals are very restrictive, and not even all the GBC <em>sannyāsīs</em> are in agreement as to how far they should go in implementing them.</p>

<p>Tamal Krishna Mahārāja, with one or two other <em>sannyāsīs</em>, is the main driving force behind the new reforms. As the GBC Chairman, he spoke logically on each point as it came up for Śrīla Prabhupāda’s approval, philosophically establishing its necessity, strictly distinguishing the interests of the Society, and promoting it over that of individual concerns.</p>

<p>After hearing all their arguments and resolutions, Śrīla Prabhupāda accepted most of them. But he requested the removal of one designed to prevent single women with children from joining a temple. And he dismissed another which required a man to remain financially responsible for his wife and family for his whole life up to the point of taking <em>sannyāsa</em>. Prabhupāda emphasized that our principle is to give facility to help <em>everyone</em> become detached from sex life and to become Kṛṣṇa conscious.</p>

<p>He said that <em>gṛhasthas</em> must live physically apart from the temple if husband and wife wish to associate together, but after two or three children, he said, what is the need to continue living together? If they want to improve their Kṛṣṇa consciousness, he said, they may separate. The man can move to a different temple and dedicate himself to preaching, although he said that the <em>vānaprastha āśrama</em> may not be accepted before one is fifty years old. The women and children can be supported by the temples, and nurseries can be established. If a man wishes to separate from his family when his children are young, he must still send money for their support. Śrīla Prabhupāda said that we can give them facility to become detached, but they cannot be irresponsible. When the children reach eight years old, they may be sent to a <em>gurukula</em> in India, and ISKCON will take full responsibility for them.</p>

<p>On other business, the <em>sannyāsa</em> initiation issue was finalized. The GBC confirmed the new system, whereby nominations can be made only by GBC men who are <em>sannyāsīs</em>. The nominee must then work at least one year with that GBC member before being given his <em>tridaṇḍa</em>.</p>

<p class="verse">* * *</p>

<p>Sixty-five devotees arrived from the USA today.</p>', '', '1976-03-09', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date,
    updated_at = now();


  -- March 10th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'March 10th, 1976', 54,
    '', '', '', '',
    '', '', '', '',
    E'<p>News of yesterday’s GBC resolutions has traveled fast. Among the householders there is considerable resistance and resentment. Most temple presidents are householders and, according to the new directives, they will all have to go out and establish outside sources of income while still continuing to run their temples. Many feel that certain <em>sannyāsīs</em> are questioning their sincerity in being fully dedicated devotees, as if being married is at odds with the spiritual principles.</p>

<p>Some of the GBC are already having doubts about whether their decisions were either practical or fair. Madhudviṣa Swami spoke for several others in voicing his concern during Prabhupāda’s walk.</p>

<p>In response, Śrīla Prabhupāda suggested the <em>gṛhasthas</em> form a small committee to have further discussions.</p>

<p>There was some discussion back and forth, and Tamal Krishna Mahārāja, as the champion of the GBC reforms, repeatedly reminded everyone that the resolutions were not meant to govern the way the <em>gṛhasthas</em> conduct their personal affairs. He agreed that a committee for that purpose was a good idea. But he said it is for the GBC only to decide what support the Society gives them.</p>

<p>Śrīla Prabhupāda stressed that the important thing is that we do not develop factions within our Society. Unity is possible only when <em>harer nāma</em> is there constantly.</p>

<p>Puṣṭa Kṛṣṇa Mahārāja brought the discussion closer to the root of the differences between <em>gṛhastha</em> and <em>sannyāsa</em>. “What about the distinction between the enjoying spirit and the renouncing spirit? For example, between the <em>brahmacārīs</em> and the <em>gṛhasthas</em>... The <em>brahmacārīs</em> have this tendency; at least, this is the attitude—towards renunciation. And so far we can see, a <em>brahmacārī</em> who gives up his <em>brahmacārī</em> life means he’s more inclined towards the enjoying spirit, at least to some extent. So how do we deal with this situation?”</p>

<p>“If you want to enjoy,” Prabhupāda asked, “who can stop you?”</p>

<p>Tamal Krishna Mahārāja again made his point. “But we cannot support it. We cannot support his enjoyment. That he should take on his own self to do.”</p>

<p>Prabhupāda explained that according to different positions and attitudes, the four <em>āśramas</em> are existing. Therefore everyone is not on an equal platform. But the whole idea, he said, is how to give up the propensity of enjoyment. That is wanted.</p>

<p>On the other hand, Puṣṭa Kṛṣṇa Swami presented a criticism that the householders have of the renunciates. “Sometimes the <em>brahmacārīs</em> and <em>sannyāsīs</em> may have a very strong aversion towards association with women and/or householder life, things of this nature. And sometimes the <em>gṛhasthas</em>will criticize the <em>sannyāsīs</em> and <em>brahmacārīs</em> that ‘This is fanaticism,’ or it’s, to the other end, ‘It’s just as bad as the enjoying spirit, because you’re meditating on the same thing, but only you’re averse to it.’”</p>

<p>It was like a seesaw, one party accusing the other. And the last thing Śrīla Prabhupāda wanted was the formation of different factions. He said that the whole world is full of different <em>isms</em>, one party against another. We should not bring that attitude into our Society. He said the accusations of one side against the other are all fanaticism. He gave the solution. “Real unity is in advancing Kṛṣṇa consciousness. In Kali-yuga, you cannot strictly follow; neither I can strictly follow. If I criticize you, if you criticize me, then we go far away from our real life of Kṛṣṇa consciousness.</p>

<p>“You should always remember that either <em>gṛhastha</em> or <em>brahmacārī</em> or <em>sannyāsī</em>, nobody can strictly follow all the rules and regulations of them. In the Kali-yuga it is not possible. So if I find simply fault with you, and if you find fault with me, then it will be factional, and our real business will be hampered. Therefore Caitanya Mahāprabhu has recommended that <em>harer nāma</em>, chanting Hare Kṛṣṇa <em>mantra</em>, should be very rigidly performed, which is common for everyone—<em>gṛhastha</em>, <em>vānaprastha</em>, or <em>sannyāsī</em>. They should always chant Hare Kṛṣṇa <em>mantra</em>. Then everything will be adjusted. Otherwise it is impossible to advance. We shall be complicated with the details only.”</p>

<p>On the whole, throughout the discussions, Prabhupāda has naturally leant his support to the more renounced position. Yet he obviously wants everyone to have the chance to develop their Kṛṣṇa consciousness.</p>

<p>He said that we should neither neglect the regulations, nor pursue them so fanatically that we miss the point of actual spiritual advancement. He repeated the real formula for success. “If we advance in Kṛṣṇa consciousness, simple method, chanting twenty-four hours, <em>kīrtanīyaḥ sadā hariḥ</em>, then things will be automatically adjusted. You cannot find in Kali-yuga everything is being done very correctly, to the point. That is very difficult.”</p>

<p>He recalled with amusement his own experiences in establishing his movement in the early days in New York. “Just like our poet, Allen Ginsberg. He was always accusing me, ‘Swamijī, you are very conservative and strict.’</p>

<p>“Actually, I told him that ‘I am never strict, neither I am conservative. If I become conservative, then I cannot live here for a moment. So I’m not at all conservative.’” We all laughed as Śrīla Prabhupāda described what he had to tolerate. “I was cooking, and I saw in refrigerator of Yeargen, [a young man he was staying with] he kept some pieces of meat for his cat. So still, I kept my things in that refrigerator. What can be done? I had no place at that time.”</p>

<p class="verse">* * *</p>

<p>As if to help us keep a proper perspective on our tiny lives, the <em>Śrīmad-Bhāgavatam</em> verse described the position of the Lord in His form as Kāraṇodakaśāyī Viṣṇu, the creator of the material worlds. His existence is <em>turīya</em>, in the fourth dimension. Prabhupāda compared how He lies in slumber on the Causal Ocean with an expert swimmer who lies for hours with eyes closed on the surface of the water.</p>

<p>As Viṣṇu exhales, the material universes come out, and when He inhales, everything is again retracted into His body. All this happens within a few seconds by His measurement. Yet that interim period between His breathing out and breathing in is, for us, an incalculable number of billions of years.</p>

<p>Therefore, Prabhupāda told us that by studying Kṛṣṇa, one becomes liberated. “So these verses should be studied very carefully, understanding each word very carefully. Then you’ll understand Kṛṣṇa. Don’t be lazy in understanding Kṛṣṇa, because if you try to understand then you’ll not take Him as ordinary human being, as foolish persons are taking. Rascals, they think Kṛṣṇa as one of us. Then you’ll not be a <em>mūḍha</em>. You’ll be intelligent. Of course, we cannot know Kṛṣṇa perfectly. He’s so big and we are so small that it is impossible. But you can understand Kṛṣṇa as He explains Himself in the <em>Bhagavad-gītā</em>. That much will help you.</p>

<p>“You cannot understand Kṛṣṇa,” he repeated. “It is not possible. Kṛṣṇa cannot understand Himself. Therefore He came as Caitanya, to understand Himself. Caitanya Mahāprabhu has recommended human life is meant for understanding Kṛṣṇa. There is no other business. If you simply stick to this business, your life is successful.</p>

<p>“Our Kṛṣṇa consciousness movement is meant for that purpose. We are opening so many centers so that the people of the world may take advantage of this opportunity and understand Kṛṣṇa and make his life successful. Thank you very much.”</p>

<p class="verse">* * *</p>

<p>Around midday, eight coaches arrived carrying about 350 devotees from North America. Several <em>sannyāsīs</em>—Tripurāri, Viṣṇujana, Gurudāsa, Revatīnandana, and Parivrājakācārya—were among them.</p>

<p>Many of the new arrivals are being housed in the new building, where construction work has now stopped. The first floor level has been cast, and Jayapatāka Mahārāja has arranged for temporary shelters made from split bamboo and tarpaulins to be erected on top of the bare concrete. The facilities are woefully inadequate. The devotees have to bathe from hand pumps, and the toilets are simply holes in the ground, but they don’t seem to mind. They are happy just to be here in the holy <em>dhāma</em> with Śrīla Prabhupāda.</p>

<p>Rāmeśvara, Rādhāballabha, and the BBT staff were also among the group of newly arrived devotees. They brought with them 255 photographic enlargements of our temples, Deities from around the world, <em>Śrīmad-Bhāgavatam</em> illustrations, and book reviews. They are all mounted and encased in protective Perspex sheets, all destined to be placed in a gigantic public display here in Māyāpur. Prabhupāda looked through at least fifty of them. He was in ecstasy. Rāmeśvara also gave him the newly printed Seventh Canto, Part One.</p>

<p>Surprisingly, Dayānanda also returned today. He had flown to Dallas but found himself unable to do anything with the <em>gurukula</em>.</p>

<p>Shortly after Dayānanda had left here, Jagadīśa prabhu arrived for the GBC meetings. After meeting with him, Prabhupāda accepted his reasons for what actually turns out to be only a temporary closure of the Dallas <em>gurukula</em>. Prabhupāda took Jagadīśa’s assurance that the issue would be carefully studied in the meetings, and a solution has been found in line with Prabhupāda’s desire. The GBC has recommended a series of smaller regional schools, rather than a single, centralized one. By keeping the number of students down and having several in different states, the hope is to minimize governmental attention and so avoid restrictive codes and regulations. At the same time emphasis will be given to the development of the Vṛndāvana school, and parents will be encouraged to send their children there.</p>

<p>With Śrīla Prabhupāda’s approval, Jagadīśa and Hridayānanda Mahārāja had rung Dayānanda in Dallas to inform him to leave things as they are. Dayānanda then persuaded Rāmeśvara to buy him a ticket back to Māyāpur, apparently hoping to be reinstated as Śrīla Prabhupāda’s secretary. Thus his unexpected arrival today.</p>

<p>Prabhupāda was not very happy to see him. He seemed to have expected he would stay there, and he was irritated Dayānanda has spent so much money going and coming and achieving nothing. Rather than restore him as his secretary, he called in Atreya Ṛṣi prabhu and offered him Dayānanda’s services in Iran.</p>

<p class="verse">* * *</p>

<p>Evening <em>kīrtana</em>, which has been getting bigger and wilder every night, was extraordinary to say the least. There were at least six hundred exuberant devotees, chanting and dancing with Madhudviṣa and Gurukṛpa Swamis in the middle, leading them.</p>

<p class="verse">* * *</p>

<p>Prabhupāda has been receiving many gifts of sweets, dried fruit, honey, money, and other things from visiting devotees.</p>

<p class="verse">* * *</p>

<p>As Gaura Pūrṇimā nears, the electrical power has been going off for longer and longer periods. Today it was off almost all day, but it came on again in the evening, in time for Prabhupāda to view a new ISKCON movie in his room. It was shown on Gargamuni Swami’s Fairchild projector. The movie was about the production of his books and was called <em>Brilliant as the Sun</em>. Prabhupāda loved it. He ate potato <em>sabji</em> and <em>purīs</em> as he watched, finishing with a <em>rasagullā</em>.</p>', '', '1976-03-10', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date,
    updated_at = now();


  -- March 11th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'March 11th, 1976', 55,
    '', '', '', '',
    '', '', '', '',
    E'<p>Prabhupāda took his walk on the roof with the GBC members and <em>sannyāsīs</em>.</p>

<p>Jaśomatīnandana dāsa from Gujarat had visited one of Prabhupāda’s leading Godbrothers in a neighboring <em>maṭha</em> here in Māyāpur. He reported back that, on hearing of Śrīla Prabhupāda’s achievements, the Godbrother commented, “Your Guru Mahārāja was previously a businessman, and we are, from our childhood, we are Vaiṣṇava. So therefore he is doing business and getting money.” For those who have worked here in Māyāpur over the last few years, such attitudes and comments are not new. But the lack of propriety in speaking such things to Prabhupāda’s own disciples is still surprising.</p>

<p>It was an insult, but Śrīla Prabhupāda turned it to his advantage. From the roof he looked across the expanse of open fields he plans to build a transcendental city on, towards the few buildings clustered around a small temple that comprise the Godbrother’s headquarters.</p>

<p>“Business means four things,” he chuckled. “Yes, we are businessman. I was student of economics. I know how to do business, and business principle means you require four things: land, labor, capital, organization. So, ordinary man cannot do that. Otherwise, everyone would have done some business and become millionaires. But it requires these four things: land, labor, organization, and capital.</p>

<p>“So where you have got these? You have neither land, neither capital, neither place. So how you can do business? I am doing business because I have got all these things. I went to America—land. Then I worked—labor. Then I earned some capital, and I have got brain how to do it.”</p>

<p>We see on a daily basis that Śrīla Prabhupāda knows precisely how to use each of these in devotional service. Therefore, by Kṛṣṇa’s grace every facility is being supplied. It is regrettable that his Godbrothers choose not to see his success as purely spiritual.</p>

<p>As he walked around the roof, Prabhupāda nodded approvingly as he heard the auspicious tones of a <em>shenai</em> and drum reverberating through the compound. Jayapatāka Mahārāja has installed the players in the small rooms in the main gate to help create a festive atmosphere. All the devotees are appreciating their music. Tamal Krishna Mahārāja recalled the excellent reception given to Śrīla Prabhupāda during our visit to the Nellore Raṅganātha temple two months ago when Prabhupāda was honored with a <em>shenai</em> band and the large ceremonial umbrella.</p>

<p>Jayapatāka Swami asked whether such an arrangement could be made here in Māyāpur to honor His Divine Grace.</p>

<p>Prabhupāda approved, saying that such liturgy is not a pompous display or self-aggrandizement. It is <em>ācāryopāsana</em>, worship of Kṛṣṇa’s representative, and is therefore needed, because that is the way of spiritual advancement. Only with full faith in the guru can one understand spiritual truth.</p>

<p>Paṣcadraviḍa Swami wanted to know how a person can attain perfection simply from one <em>lava</em>, one eleventh of a second’s association with a pure devotee.</p>

<p>Śrīla Prabhupāda stopped and turned to him as we all gathered around. He said that it is like dry wood, which can be ignited immediately. Similarly, if one is sincere, then he immediately becomes spiritually ignited. And if he is still “moist” from material contact, it may take hundreds of years or lifetimes. A pure devotee is like a match, and the recipient the wood. If both are good then there is fire. “When you go to the fire, you become dry. But willfully we put again water. This nonsense business makes us wet. This process is already there, how to become dry. But instead of taking the process, we put water. Then how it will be ignited? The rules and regulations are the drying process. But without following the rules and regulation, if you again become victimized by <em>māyā</em>, then there is water and again dry it. So this is going on, watering and drying, watering and drying. Difficulty is that we dry and again water.”</p>

<p>Viṣṇujana Mahārāja, the tall, charismatic co-leader of Rādhā Dāmodara TSKP, who was listening in the background, spoke up for the first time. “Śrīla Prabhupāda, how did Choṭa Haridāsa achieve perfection by killing himself after apparently pouring water on his devotional creeper by talking to a woman?”</p>

<p>He was referring to the close associate of Lord Caitanya who drowned himself in the Gaṅgā after being rejected by the Lord.</p>

<p>Śrīla Prabhupāda’s reply was very grave. “His instance was that even an associate of Caitanya Mahāprabhu can fall down. And if one falls down, his punishment is that, suicide. There is no other punishment—he must commit suicide. This is Caitanya Mahāprabhu’s instruction. Otherwise he is Caitanya Mahāprabhu’s personal servant. He cannot fall down. But Caitanya Mahāprabhu showed this instance that ‘Even one is My personal servant, he can fall down.’ And if anyone by any cause he falls down, his punishment is he must commit suicide. This is instruction.”</p>

<p>Everyone’s eyes widened as they took in the statement.</p>

<p>Śrīla Prabhupāda elaborated. “This falldown, there is possibility in any moment because we are very small. We can be captivated by <em>māyā</em> at any moment. Therefore we shall be very, very careful. And if you fall down, then punishment is you make suicide. That’s all. Then next life we shall see.”</p>

<p>Viṣṇujana Mahārāja withdrew to the back as the other <em>sannyāsīs</em> sought clarification. Satsvarūpa mentioned that in <em>The Nectar of Devotion</em> it says devotional service is so pure that there is no <em>prāyaścitta</em>, or atonement, necessary if one falls down. Just again engage in your service.</p>

<p>Prabhupāda agreed, but said that Choṭa Haridāsa’s case was not typical. His was exemplary punishment that was enacted between him and the Lord. Caitanya Mahāprabhu was <em>vajrād api kaṭhora</em>, harder than the thunderbolt and softer than the rose.</p>

<p>“But, Prabhupāda,” asked Tamal Krishna, “if you were as strict as... ”</p>

<p>“No, I am not Caitanya Prabhu. I am not... Why you are comparing me? I am an ordinary man.”</p>

<p>Gurukṛpa Mahārāja brought the exchange to its point, asking the question that was undoubtedly on everyone’s mind. “So in ISKCON, if someone falls down, it means that he should commit suicide?”</p>

<p>Śrla Prabhupāda’s monosyllabic answer couldn’t be clearer. “No.”</p>

<p>Gurudāsa Mahārāja laughed. “We wouldn’t have much of a movement then.”</p>

<p>Prabhupāda clarified, “No, no, if he falls down, that is automatically suicide—if he falls down, that means it is suicide. He got the chance. If he falls down, that is suicide, spiritual suicide. If one gets the chance of becoming eligible for going back to home, back to Godhead, and if he commits mistake and it is stopped, is it not suicide?”</p>

<p>He concluded that we should be very strong-minded and continue our devotional service with determination.</p>

<p class="verse">* * *</p>

<p>This is the official beginning of the festival. Just before class started, Prabhupāda gave the hundreds of assembled devotees his personal welcome. His simple, heartfelt message expressing his appreciation for their attendance here in Māyāpur was greeted with large smiles and cheers. “First of all, we must welcome all the devotees. There may be so many inconveniences. Please do not mind it. This is Caitanya Mahāprabhu’s place. Be joyful always. Thank you.”</p>

<p>His thoughtfulness immeasurably deepened everyone’s affection and gratitude to him. Without Prabhupāda none of us would be here, none of us would have even heard of Māyāpur, or Kṛṣṇa consciousness, or tasted the happiness of spiritual life. So his humble concern about the lack of amenities was all the more endearing.</p>

<p>As he had told us earlier on the walk, it was out of his concern for the devotees that he built a guest house first, even before a temple. Some locals have criticized him for it, but he told us that wherever there are devotees, then God will come. Kṛṣṇa is not a dull stone; He is drawn by the affection of His devotees. Therefore making a place for God, without facility for His devotees, is merely idol worship.</p>

<p class="verse">* * *</p>

<p>About thirty Australian devotees arrived at 8:30 a.m.</p>

<p><em>Parikramas</em> have begun with a visit over the Jalāṅgī river to Śrīla Bhaktivinoda’s house at nearby Godruma-dvīpa.</p>

<p class="verse">* * *</p>

<p>After having heard and approved the last of the new GBC resolutions, Prabhupāda added another of his own: that no decision is to be changed for one year, except by him personally.</p>

<p class="verse">* * *</p>

<p>Prabhupāda was given $600 in donations, and Jayatīrtha brought one boy in with a donation of $5,000 to be used for building a house for him here in Māyāpur. Plans are already underway for it, and Prabhupāda has chosen a site near the <em>pukkur</em>.</p>

<p class="verse">* * *</p>

<p>Jagannātha Suta dāsa, the production manager of <em>Back to Godhead</em>, taped a lengthy interview between Ravīndra-svarūpa dāsa and Śrīla Prabhupāda. It’s for a special article on the upcoming bicentennial anniversary of the American Declaration of Independence.</p>

<p>The conversation naturally centered on whether the living being is actually independent or not. Śrīla Prabhupāda is scheduled to be visit the capital, Washington, D.C., this coming July 4th. BTG will carry the article in that month’s issue.</p>', '', '1976-03-11', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date,
    updated_at = now();


END $$;
