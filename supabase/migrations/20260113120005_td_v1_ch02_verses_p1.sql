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


  -- December 2nd, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'December 2nd, 1975',
    '', '', '', '',
    '', '', '', '',
    E'<p>After a short early morning walk, our party left New Delhi, following the main Agra road as far as the District of Mathurā, a two hour trip. Just before the Vṛndāvana turn-off, Prabhupāda was pleased to see a newly erected sign on the Agra Road advertising our ISKCON Krishna-Balaram International Guest House. As his car turned left onto Chattikara Road, Guṇārṇava dāsa, eagerly waiting at the roadside on a motorcycle, sped ahead to inform the devotees of His Divine Grace’s imminent arrival.</p>

<p>We drove the last few miles down the narrow road, past open fields and roadside trees and bushes, until Vṛndāvana village finally came in sight. It brought a strong feeling of attainment, as if we were arriving home. Vṛndāvana is not an ordinary village. Even a neophyte devotee such as myself can perceive how different its spiritual atmosphere is from anywhere else.</p>

<p>As the spires of our ISKCON temple came into view Śrīla Prabhupāda’s comments on an enchanting description of Mathurā-maṇḍala by Rūpa Gosvāmī in <em>The Nectar of Devotion</em> ran through my mind: “‘I remember the Lord standing by the banks of the Yamunā River, so beautiful amid the <em>kadamba</em> trees, where many birds are chirping in the gardens. And these impressions are always giving me transcendental realization of beauty and bliss.’ This feeling about Mathurā-maṇḍala and Vṛndāvana described by Rūpa Gosvāmī can actually be felt even by nondevotees. The places in the eighty-four-square-mile district of Mathurā are so beautifully situated on the banks of the River Yamunā that anyone who goes there will never want to return to this material world. These statements by Rūpa Gosvāmī are factually realized descriptions of Mathurā and Vṛndāvana. All these qualities prove that Mathurā and Vṛndāvana are situated transcendentally. Otherwise, there would be no possibility of invoking our transcendental sentiments in these places. Such transcendental feelings are aroused immediately and without fail after one arrives in Mathurā or Vṛndāvana.”</p>

<p>By Śrīla Prabhupāda’s mercy we disciples are realizing the truth of these words. Vṛndāvana invokes and inspires extraordinary devotional feeling. Pilgrims flock from all over the country to bathe in the Yamunā’s sanctified waters or simply to spend a day or night within its holy precincts. Especially during auspicious times of the year, tens of thousands of pilgrims crowd Vṛndāvana’s nine-miles-long <em>parikrama </em>path as they circumambulate the entire area. Some repeatedly cover the entire distance over and over again not by walking, but by continually offering <em>daṇḍavats</em>.</p>

<p>And then, apart from the visiting pilgrims, there are the residents of Vṛndāvana: old men and widows who’ve come to live out their last times seeking a release from repeated birth and death rather than a temporary cure for physical ailments. They know that to die in Vṛndāvana means never having to return to this material world again.</p>

<p>There are literally thousands of temples in the greater Vṛndāvana area. They range in size and grandeur from large custom-built structures, with towering domes and elaborate carvings, to simple homes in which traditional family Deities are humbly worshiped. Most famous are those of the six Gosvāmīs, Śrī Caitanya Mahāprabhu’s intimate followers.</p>

<p>Modern Vṛndāvana has risen and flourished because of the initial efforts of Śrīla Rūpa and Sanātana Gosvāmīs some four hundred years ago. They dedicated their lives to the restoration of the once-hidden sites of Śrī Kṛṣṇa’s pastimes. Now, by their grace, thousands of pilgrims visit every day, attending temple <em>āratis</em> and festivals that celebrate the pastimes of the Lord.</p>

<p>Following in the footsteps of the Gosvāmīs, Śrīla Prabhupāda’s special contribution is to broadcast the glories of the <em>dhāma</em>, not simply within India, but throughout the entire world.</p>

<p>By providing us with the Krishna-Balaram Temple and Guest House, Prabhupāda is giving us firsthand experience of the holy <em>dhāma</em>’s transcendental nature. As his most elaborate and expensive project to date, in the most important place in the world for all Vaiṣṇavas, Prabhupāda is paying special attention to its development. Especially because none of his disciples have ever managed such a large project, he is taking great care, personally guiding and overseeing the management’s development of the project to assure its success. He is only too aware of the many pitfalls to be avoided here in India. He spent considerable time doing this two months ago, and now he plans to spend the next two weeks to further solidify the high standards he requires.</p>

<p>When the cars pulled up outside the main gates Prabhupāda stepped out to an exuberant welcome. As he moved forward to the temple entrance, I tucked in close behind. It was a completely new and marvelous experience for me, arriving at a temple with Prabhupāda instead of being there to receive and welcome him.</p>

<p>My close friends, Bhagavat Āśraya and Guṇārṇava prabhus, both gave me quizzical looks filled with surprise, perhaps even amazement. A few days ago I had left Vṛndāvana for a one day trip to Delhi and now I was returning as part of Śrīla Prabhupāda’s entourage! But this was only a second’s exchange. Śrīla Prabhupāda again absorbed our full attention, and we hurried to catch up as he entered the temple among a crowd of joyous, chanting disciples.</p>

<p>Prabhupāda took <em>darśana</em> of the Deities, offering his prostrate obeisances before each of the three altars, housing Śrī Śrī Gaura-Nitāi, Śrī Śrī Kṛṣṇa-Balarāma and Śrī Śrī Rādhā-Śyāmasundara. After tasting the <em>caraṇāmṛta</em>, the water that has bathed the Deities, he walked back across the black and white checks of the marble floor to the <em>vyāsāsana</em>, the seat reserved for him in the temple, and accepted <em>guru-pūjā </em>before giving a lecture from the <em>Śrīmad-Bhāgavatam</em>.</p>

<p>Śrīla Prabhupāda spoke on the Seventh Canto, Sixth Chapter, Verse 1, concerning Prahlāda Mahārāja’s instructions to his school friends. This section of the <em>Bhāgavatam </em>is not yet published, as Śrīla Prabhupāda is still translating it. Thus it is new and exciting to hear.</p>

<p>After the devotees responsively recited the Sanskrit, Harikeśa loudly read the translation. Repeating the verse, Prabhupāda described Prahlāda Mahārāja as our predecessor guru and one of the twelve great authorities, or <em>mahājanas</em>, on the science of <em>bhāgavata-dharma</em>. He explained that although Prahlāda Mahārāja was born the son of a great demon, his life proved that even birth in a sinful family does not bar one from Kṛṣṇa consciousness, a point very relevant to us.</p>

<p>He noted that Prahlāda instructed his friends about <em>bhāgavata- dharma</em> during “tiffin hours,” although only five years old. <em>Kaumāra </em>means “at a young age,” and <em>prajṣo</em> means “sufficiently intelligent.” When one is sufficiently intelligent he follows <em>bhāgavata-dharma</em>, and this is described by Kṛṣṇa in the <em>Bhagavad-gītā</em> as surrender unto Him. Prabhupāda said that Śrī Kṛṣṇa advents once in every four billion years at this very place, Śrī Vṛndāvana-dhāma, just to teach us this. Therefore Vṛndāvana is so valuable.</p>

<p>He summed up the purpose of the Kṛṣṇa consciousness movement as teaching that Kṛṣṇa is the Supreme and that there is no one superior to Him. “We are preaching this. In this temple we are asking everyone, ‘Here is Kṛṣṇa. Always think of Kṛṣṇa. Chant Hare Kṛṣṇa. Then you will have to think, Hare Kṛṣṇa.’ Simply by chanting Hare Kṛṣṇa <em>mantra</em> you become a devotee of Kṛṣṇa.”</p>

<p>From his own experience, he pointed out that the results of that devotion are wonderful. “We don’t do any business, but we are spending at least twenty five <em>lakhs</em> [2,500,000] of rupees every month. Kṛṣṇa is supplying. If you remain Kṛṣṇa conscious, fully dependent on Kṛṣṇa, then there will be no scarcity. I started this Kṛṣṇa business with forty rupees. Now we have got forty <em>crores</em> [400,000,000] of rupees and ten thousand men eating <em>prasādam</em> daily. So this is Kṛṣṇa consciousness!”</p>

<p>Everyone cheered, “<em>Jaya!</em>”</p>

<p>Prabhupāda smiled and continued. “As soon as you become Kṛṣṇa conscious, you simply depend on Him and work sincerely, and then Kṛṣṇa will supply everything. For example, in Bombay: now the land is one <em>crore</em> of rupees worth, and when I purchased this land I had, might be, three or four <em>lakhs</em>. I was confident that ‘I shall be able to pay, Kṛṣṇa will give me.’ There was no money. I have got now practical experience that you depend on Kṛṣṇa—there will be no scarcity.”</p>

<p>Finally Prabhupāda pointedly reminded his young audience to get on with the task of becoming Kṛṣṇa conscious now, while we still have the opportunity. “<em>Artha-dam</em>. You do not know when you will die. At any moment you will die. Therefore before your next death, you realize Kṛṣṇa. <em>Artha-dam </em>means even if you live for only a few years, if you take the chance of chanting Hare Kṛṣṇa, still you are benefitted. This chanting of Hare Kṛṣṇa is so important that you can always think that ‘Death is coming. Death is at my door. Let me finish my chanting. Let me finish my chanting.’ Always you should think like that, that ‘Death is already coming, so let me chant.’ So this is called <em>bhāgavata-dharma</em>, and the Kṛṣṇa consciousness movement means <em>bhāgavata-dharma</em>. So you read Prahlāda Mahārāja’s instructions very nicely and utilize it in your life. Your life will be successful. Thank you very much.”</p>

<p>To the cheers of the devotees Prabhupāda left the temple and disappeared into his quarters with Hansadūta and Harikeśa. I remained outside, feeling happy yet regretful. I had been allowed to travel back to Vṛndāvana with Prabhupāda’s party but only to collect my belongings before going on to Calcutta. I reflected on how even a drop of Śrīla Prabhupāda’s mercy is so sweet and satisfying, yet it leaves you craving for more.</p>

<p>Others were craving Śrīla Prabhupāda’s mercy also. Pṛthu-putra, whom Harikeśa had appointed as my replacement, approached me, expressing his eagerness to take over as Prabhupāda’s masseur. I had foolishly forgotten Śrīla Prabhupāda’s <em>gamchā</em> in the motel bathroom in Kurukṣetra, so I had to go to Loi Bazaar to buy him another. Inviting Pṛthu-putra along, I explained to him what I had learned about massaging Prabhupāda and told him about my experiences in New Delhi and Kurukṣetra as we bumped and bounced our way through the narrow streets on a rickshaw. While at the cloth store I bought myself a new <em>dhotī</em> also.</p>

<p>Pṛthu-putra was as excited as I had been at the prospect of personally serving His Divine Grace. My own feelings of regret at losing the opportunity mingled with a deep sense of gratitude for having had the chance at all, and I resigned myself to whatever my new assignment might bring.</p>

<p>Arriving back at the Mandir, however, something unexpected and wonderful occurred. Harikeśa met us on the porch of Śrīla Prabhupāda’s quarters with an apology. “Sorry Pṛthu. Forget it! Prabhupāda doesn’t want any change!”</p>

<p>My heart leapt and Pṛthu-putra’s fell. Harikeśa looked at me, simultaneously resigned and apologetic. “Śrīla Prabhupāda just told me he doesn’t want to keep changing his servant every five minutes. He said you are doing fine so you’re to continue, at least while he’s here in Vṛndāvana, and he told me that I’m to divide up the duties so that you will have a full day’s engagement.”</p>

<p>I couldn’t believe my good fortune. So far I had only been doing his massage, but now I was being given full responsibilities as Śrīla Prabhupāda’s personal servant, at least while he is here in Vṛndāvana. Not only was I being retained, but I was also getting an increase in service.</p>

<p>Harikeśa appeared a little shame-faced, as he didn’t like the idea of relinquishing the servant’s duties to someone else. He admitted that losing some of his duties had left him feeling uncertain about his future and what Prabhupāda wanted him to do.</p>

<p>Nevertheless, Harikeśa made me feel welcome, and I immediately moved my personal belongings into the small servant’s room. The room was bare, save for a glass cabinet and a solitary line drawing on the wall of Jagannātha Miśra and Śacīdevī with baby Nimāi on her lap. It was signed at the bottom ‘Devahūti dāsī 11/74.’ I felt very privileged to be staying within the sacred precincts of Śrīla Prabhupāda’s personal quarters.</p>

<p>Śrīla Prabhupāda is certainly being very kind, for it seems to me there are many other devotees far more qualified than I, and yet here he is, keeping me on for a few weeks more.</p>

<p>Thus I spent this morning with Harikeśa, as he filled me in on the details of my new service. First, in the bedroom we went through the contents of Prabhupāda’s suitcase. Śrīla Prabhupāda has very few personal possessions: everything he owns fills only half of a large red suitcase. He has three or four sets of cloth—<em>kurtā</em>, <em>luṅgi</em> and <em>kaupīna</em>; a couple of sweaters, a few pairs of socks, <em>gamchā</em>, heavy lined winter coat, <em>chaddar</em>, and some sundries.</p>

<p>A second suitcase holds various electrical devices used for operating his dictaphone and the large reel-to-reel tape recorder to record his morning walks and classes. There are two electric bells on long leads, one of which is immediately set up between his desk and the servant’s room whenever Prabhupāda arrives at a new place. The other is a spare. The servant also uses this suitcase for his own clothing and other belongings. Harikeśa showed me how to pack the suitcases properly for travel both within and outside India. It’s an art in itself.</p>

<p>He revealed the contents of Prabhupāda’s bedroom cupboards, which contain his bed sheets, floor covers, bathing <em>loṭās</em> and towels. His servant doesn’t necessarily handle these items, but he has to give instructions about them to the cleaning crew that comes in every morning when Prabhupāda takes his walk.</p>

<p>He also showed me two large brass buckets Prabhupāda uses for bathing (which require polishing every day) and the straw mat and bottles of oil for massage. After showing me what clean clothes to lay out for Prabhupāda to change into after his bath, he finally left me on my own.</p>

<p>Śrīla Prabhupāda’s servant always has to be readily available. If Prabhupāda rings for anything it’s the servant who responds, not the secretary. Along with giving the two massages, the servant is expected to see that Prabhupāda’s clothes are washed, his rooms cleaned, <em>prasādam</em> is on time and to arrange all the many small items needed to make Prabhupāda’s day go smoothly. The art is to see that Śrīla Prabhupāda is not in any way inconvenienced and can go on with his mission of preaching Kṛṣṇa consciousness undisturbed. Prabhupāda’s secretary, usually a GBC member, takes care of correspondence, requests for appointments with His Divine Grace, travel arrangements, tour schedules, and the like. Harikeśa transcribes Prabhupāda’s translations and nightly revelations and sends them to the Bhaktivedanta Book Trust (BBT) in Los Angeles for editing and publishing. He also cooks for Prabhupāda, although here in Vṛndāvana he has help with this from other devotees.</p>

<p class="verse">* * *</p>

<p>At 11:15 a.m. I changed into my <em>gamchā</em> and went into the <em>darśana</em> room where Prabhupāda was sitting at his desk talking with some devotees. He decided to go up on the roof and sit in the sun.</p>

<p>Prabhupāda climbed the covered back stairs without difficulty, coming out into the bright sunlight. After a quick glance of inspection over the side wall, he walked on through the ten-by-twenty-foot room to the open back section.</p>

<p>Prabhupāda changed into his <em>gamchā</em> and sat on the straw mat. As I began to massage him, Hansadūta arrived with the mail. Prabhupāda sometimes replies to his letters at mid-morning, but more often during his massage. Hansadūta read each letter one by one, writing down Śrīla Prabhupāda’s replies exactly as he dictated them.</p>

<p>It is instructive and entertaining to hear various ISKCON reports from all over the world, both the problems and the successes, and to hear Prabhupāda’s responses to them. He is very punctual in answering, always replying within a day or two of receiving a letter. He answers a letter as if the correspondent is there in front of him. His responses are accompanied by all the same facial gestures that mark his conversations—appreciative raising of his brows and widening of his eyes, a slight tip of his head, bright smiles, scolding looks. He gives each letter his full attention and his replies are expressive and personal and always to the point.</p>

<p>Today he dealt with the letters received in New Delhi.</p>

<p>To Kīrtirāja he wrote an encouraging letter, urging him to preach in Poland. He reminded him of Lord Caitanya’s prediction that Kṛṣṇa consciousness will spread to every town and village of the world. Then he expressed his gratitude that so many American and European boys and girls are helping to make this a reality. “It is not bogus like Communism, socialism and so many ‘isms’ going on in the world today, but it is purely spiritual, authorized by Krsna Himself, who spoke this science of life five thousand years ago on the battlefield of Kuruksetra. The battlefield is still there, and you will be happy to know that yesterday we have been at that very spot where Krsna spoke to Arjuna, and we will build a gorgeous Krsna-Arjuna temple there. People will come from all over the world to see it and understand the authority and sublime message of Lord Krsna.” He ended by asking Kīrtirāja to send regular progress reports on his mission.</p>

<p>Puṣṭa Kṛṣṇa Swami sent a report on the proposed new Mercedes car. He also enclosed a critical news article from the magazine of a Christian sect, with his reply correcting their misconceptions.</p>

<p>Prabhupāda was pleased by his preaching and told him, “They do not accept the fact of rebirth, and they claim “Awake” so this is nonsense. Your letter was nice. The whole world is in darkness, and we are bringing it to light by preaching Bhagavata-dharma. Thank you for helping me.”</p>

<p>A letter requesting Prabhupāda to accept eleven new candidates for first initiation came from Germany, and he replied to Cakravartī dāsa according to his standard format. “Please accept my blessings. I have accepted the following list of boys and girls as my duly initiated disciples. So you are the president there at Schloss Retterschof, it is your duty to see that the standards of Krsna consciousness are always maintained. Especially chanting sixteen rounds daily, observing the four regulative principles: no meat, fish, eggs, no intoxication, no gambling, and no illicit sex life. The students must all attend morning and evening arati and classes. If we follow this simple program along with regular sankirtana, distributing the books and preaching, then there will be no fall down. Just like if one keeps himself clean and properly nourished by eating regularly, he will not infect disease, but if there is neglect, there is room for infection, he becomes weak and falls prey to disease. So Krsna consciousness is the medicine for the material disease, and chanting Hare Krsna mantra sincerely is the basic ingredient of that medicine.”</p>

<p>In accepting new disciples Śrīla Prabhupāda gives each a spiritual name and a new set of beads. Śrīla Prabhupāda has delegated the task of choosing spiritual names to his secretary. The secretary culls the names from books listing the various names of Rādhā and Kṛṣṇa, and they are sent with Prabhupāda’s reply. Prabhupāda has also entrusted his <em>sannyāsīs</em> and some GBCs with the responsibility of chanting the first round of the <em>mahā-mantra</em> on each disciple’s new set of beads. Sometimes he chants on the beads himself before sending them in the mail to the new disciple.</p>

<p>Lastly he replied to a letter from Tuṣṭa Kṛṣṇa Swami in New Zealand. Tuṣṭa Kṛṣṇa Mahārāja belongs to a group of devotees who split away from ISKCON several years ago. They disagreed with certain methods of book distribution and the managerial structure within ISKCON. The leader of this group is a former ISKCON <em>sannyāsī </em>named Siddha-svarūpānanda Goswami. Although members of this group have their own ideas about spreading Kṛṣṇa consciousness, Tuṣṭa Kṛṣṇa Mahārāja writes to Śrīla Prabhupāda regularly.</p>

<p>Tuṣṭa Kṛṣṇa had previously recommended various people for initiation, but before accepting them Prabhupāda wanted to know if Tuṣṭa Kṛṣṇa Mahārāja himself was following. Tuṣṭa Kṛṣṇa’s letter contained positive confirmation and Prabhupāda wrote back, “Every student is expected to become acarya. Acarya means one who knows the scriptural injunctions and follows them practically in life and teaches them to his disciples. I have given you sannyasa with the great hope that in my absence you will preach the cult throughout the world and thus become recognized by Krsna as the most sincere servant of the Lord. So I am pleased you have not deviated from the principles I have taught, and thus, with power of attorney go on preaching Kṛṣṇa consciousness. That will make me very happy as it is confirmed in the Gurv-astaka: ‘yasya prasadat bhagavata prasadah.’ Just by satisfying your spiritual master, who is accepted as the bona fide representative of the Lord, you satisfy Krsna immediately without any doubt.”</p>

<p>Prabhupāda also alluded to Tuṣṭa Kṛṣṇa’s independent mentality, carefully encouraging him to keep him close. “Keep trained very rigidly, and then you are bona fide guru, and you can accept disciples on the same principle. But as a matter of etiquette it is the custom that during the lifetime of your spiritual master you bring the prospective disciples to him, and in his absence or disappearance you can accept disciples without any limitation. This is the law of disciplic succession. I want to see my disciples become bona fide spiritual master and spread Krsna consciousness very widely; that will make me and Krsna very happy.”</p>

<p>He ended each letter with, “I hope this finds you well” and the epithet “Your ever well-wisher, A.C. Bhaktivedanta Swami.”</p>

<p>Each day after taking dictation, Hansadūta types the letters and later, in the evening, places them on Prabhupāda’s desk. Each one is clipped to an addressed envelope, a carbon copy, whatever enclosures there might be, and the letter being replied to. In the night Prabhupāda reads and signs them. They are mailed the next day.</p>

<p>Toward the end of the massage Akṣayānanda Swami came up to the roof. He requested Prabhupāda to allow Pṛthu-putra to be initiated into the renounced order of life, joining in the ceremony already arranged for two <em>brahmacārīs </em>from the Bombay temple, Lokanātha and Śrīdhara, who are to be awarded <em>sannyāsa</em> tomorrow.</p>

<p>Prabhupāda asked, “Why does he want to be a <em>sannyāsī</em>?” Akṣayānanda replied very simplistically, “To increase his preaching.”</p>

<p>Prabhupāda seemed to find his answer rather trite, so Akṣayānanda Mahārāja assured him that Pṛthu-putra was already living apart from his wife and preaching enthusiastically with the Vṛndāvana <em>saṅkīrtana</em> party.</p>

<p>Prabhupāda was still somewhat skeptical and wanted more confirmation of his worthiness for <em>sannyāsa</em>. He suggested that Pṛthu-putra travel in America with the Rādhā-Dāmodara party under Tamal Krishna Goswami for a year and get trained up, but Akṣayānanda Mahārāja persisted. He said that Pṛthu-putra had been in India for many years and wasn’t thinking of leaving. Because Akṣayānanda Mahārāja attested to his dependability, Prabhupāda finally agreed.</p>

<p>Since the only bathroom was the one attached to his bedroom, Prabhupāda had to go back downstairs to bathe. Sitting on a small wooden stool on the marble floor of his bathroom, he mixed hot and cold water in the brass buckets and began to wash off the oil. Meanwhile, I carefully laid a set of clean clothes on his bed: <em>kurtā</em>, <em>dhotī</em>, and <em>kaupīna</em>. I transferred the four gold buttons from his soiled <em>kurtā</em> and inserted them in the clean one. After taking care of his dirty clothes and the massage paraphernalia, I went to the sitting room.</p>

<p>On his desk Prabhupāda has a very small silver <em>loṭā</em> filled with water, together with a matching spoon and lid. Scooping up some water with the spoon I put it on the lid, and next to this I put a small ball of <em>gopī-candana tilaka</em> clay and a compact mirror.</p>

<p>After dressing, he crossed the black polished sitting room floor covered with thin, white-sheeted cotton mattresses. These serve as seats for his daily visitors. Sitting at his desk he put on his <em>tilaka</em> and then chanted Gāyatrī <em>mantra</em>.</p>

<p>Immediately after Harikeśa came into the side room carrying a full <em>thāli</em> of <em>prasādam</em>. Prabhupāda sat down to eat lunch in peace and solitude, eating slowly and deliberately, occasionally glancing out over the back veranda into the back yard.</p>

<p>After lunch Prabhupāda returned to the room on the roof. Walking through the door he turned and gave me my first direct instruction in my new service. “Now your only business is to stay with me twenty-four hours. You can remain here,” he said, indicating a straw mat outside the door, “and do not leave.” Then he went inside to rest.</p>

<p>I happily sat down, feeling very satisfied to have received my first personal directive from him. And what an instruction! To be with him continuously: who could hope for anything more?</p>

<p>He awoke an hour or so later and sat for a while at his desk reading <em>Śrīmad-Bhāgavatam</em> as I cooled him with a small peacock fan. Feeling fully satisfied performing this menial service, it occurred to me just how simple and sublime spiritual life can be. Only a few short weeks ago I had been busily engaged as the temple commander here in Vṛndāvana, frantically running around from morning until night (and often in the middle of the night). Always active and energetic, I didn’t like to sit idle for even a few minutes. Since first joining the Movement I have had the impression that I wasn’t properly conducting my devotional service unless I was constantly physically active and producing some tangible result. But now here I was, in stark contrast, standing quietly fanning Śrīla Prabhupāda, pouring out a little water into his cup, or patiently guarding his door. It seemingly was so little, but because it was directly pleasing to the spiritual master I could understand it to be just as substantial as any major undertaking in devotional life.</p>

<p>It is extremely pleasurable to be with Prabhupāda during these quiet moments. He is gentle and mild in his manner, and completely fixed and steady in his devotion to Kṛṣṇa. He has tremendous strength and force, but is devoid of passion. His presence is totally dominating without being at all domineering, his mind steady and his senses controlled effortlessly. His intelligence is perfectly clear, and he knows how to act and how others should act in every situation. His presence thus makes spiritual life a reality.</p>

<p>Watching him today, it struck me that he is a living, breathing <em>Bhāgavatam</em>; whatever description of Kṛṣṇa consciousness is in his books, he himself is that. Reading his books brings gradual realization, but what is understood in perhaps several lifetimes of study is revealed on a second-to-second, minute-to-minute, and day-to-day basis in Prabhupāda’s personal association.</p>

<p>I have therefore resolved within myself to learn as much as I can while I have this matchless opportunity to observe him closely. Simply watching Śrīla Prabhupāda in his daily activities—how he deals with devotees, how he responds to different situations, how he preaches, how he manages the worldwide affairs of his ever-expanding society, how he relaxes, how he continually pushes forward the movement of Lord Caitanya, how absolutely every facet of his being is fully Kṛṣṇa conscious—it is quite feasible to understand the full import of the sacred scriptures. By studying and preaching one may make steady advancement, but at least for me, although I have full faith in Kṛṣṇa consciousness, many ideas and principles are still only intellectually perceived, not yet fully realized. But by observing Śrīla Prabhupāda I can see they are a natural, integral part of his very being.</p>', '', '1975-12-02', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- December 3rd, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'December 3rd, 1975',
    '', '', '', '',
    '', '', '', '',
    E'<p>First thing this morning Prabhupāda complained that during the night someone’s snoring had disturbed him. Prabhupāda translates in his sitting room, which is next to the servants’ room where all three of us sleep. Since Harikeśa has not previously drawn any complaint we concluded that the culprit is either Hansadūta or myself, so we now share a guest house room.</p>

<p>Today I gave Śrīla Prabhupāda a new <em>tilaka</em> mirror. His previous one was a converted powder compact given to him in Japan, with an ivory design on the lid and a mirror inside. The face powder had been removed and replaced with a picture of Rādhā and Kṛṣṇa.</p>

<p>In September I had asked a local craftsman to make a new compact as a Vyāsa-pūjā gift for Śrīla Prabhupāda, but I received it just last night, over two months late. It is made of solid silver with a peacock embossed on the bottom and a gold relief depicting Kṛṣṇa and Balarāma in Vṛndāvana forest on the lid. Although it is considerably heavier than the one it replaces, Prabhupāda seemed to like it very much. I was surprised and pleased when he offered me his old one.</p>

<p class="verse">* * *</p>

<p>During Śrīla Prabhupāda’s last visit in August and September he spent the three weeks from Janmāṣṭamī through Rādhāṣṭamī painstakingly supervising every aspect of the temple management, and he is continuing to do so on this trip as well. He is personally inspecting the temple, guest house, and restaurant. He ensured that we were maintaining proper standards of Deity worship, such as overseeing the quality of the <em>bhoga</em> offerings and scrutinizing the flowers we purchased for Their Lordship’s garlands. He was aware of the devotees’ attendance at the programs and would speak out whenever our standards of cleanliness and punctuality fell short. He was even concerned with the hired laborers’ attention to their work. The plans for the new <em>gurukula</em> building and many other important features of life in the large and important temple compound all received his concerned attention.</p>

<p>This trip is no different. Most of his disciples here are raw recruits, with little or no experience in managing affairs in India. Therefore Prabhupāda is personally checking on everything—correcting, advising, and sometimes chastising.</p>

<p>Viśāla dāsa got a taste of Prabhupāda’s chastisement this morning. Viśāla is in his mid-thirties, a rotund, early devotee from America. He is likeable and eager to please, but with an eccentrically humble manner that can border on the onerous. Prabhupāda generally receives Viśāla’s overwrought praises with good humor and appreciation, but this morning he decided it wasn’t the time for eulogies.</p>

<p>As Prabhupāda strode out of the front gate for his morning walk, Viśāla emulated the Vedic <em>brāhmaṇas</em> by chanting some verses from the <em>Śrīmad-Bhāgavatam</em> in praise of Prabhupāda: “We think that we have met Your Goodness by the will of Providence...”</p>

<p>Gripping the spiral tapered walking stick that Viśāla himself had given him for this year’s Vyāsa-pūjā gift, Prabhupāda poked its silver tip at some puddles in the temple entrance way and interrupted caustically, “It is the grace of Providence you do not see that it is properly cleansed?”</p>

<p>Unexpectedly cut short and somewhat taken aback, Viśāla stammered apologetically, “I...I’m sorry. I will see to that, Your Divine Grace. That is my fault.”</p>

<p>Prabhupāda remained deadpan. “Why there is water? This water means the shoes—dirt; it will be dirty. So you have no eyes to see?”</p>

<p>“I am blind. I’m sorry. I will see that it is cleaned for you.”</p>

<p>“Then become with eyes. Simply praying, what you will do? Do something practical!”</p>

<p>Leaving Viśāla agape he strode strongly off down the road with his amused disciples following.</p>

<p>Harikeśa prabhu perceived some irony in Śrīla Prabhupāda’s remarks. “This is the argument people always throw against us,” he said. “‘Simply praying, what will you do? Do something practical.’ People often criticize the devotees in this way.”</p>

<p>Prabhupāda answered that Kṛṣṇa consciousness <em>is </em>the practical side of yoga. He said that it isn’t a system of simply “pressing the nose.” Kṛṣṇa consciousness is not mere sentiment and an excuse for doing nothing, nor are devotees incapable of real achievement.</p>

<p>He explained that the real problem is that people are not following Kṛṣṇa’s instructions properly. If one practically surrenders to Kṛṣṇa, He makes everything successful.</p>

<p>“Practical,” he said, “means it will be done by Kṛṣṇa. Your only business is to surrender to Kṛṣṇa. You cannot do anything. And as soon as you think, ‘I shall be able to do it,’ then you are a rascal. Immediately you are rascal.”</p>

<p>“So only a fully surrendered soul can do everything perfectly?” Harikeśa asked.</p>

<p>Prabhupāda answered, “He cannot do anything. Everything is to be done by Kṛṣṇa. But he has to apply his intelligence by Kṛṣṇa consciousness. Even if he is intelligent, he cannot do anything.”</p>

<p>Harikeśa added, “Except surrender.”</p>

<p>“Yes. He can surrender, and Kṛṣṇa will do everything. You have to act very sincerely under the direction of Kṛṣṇa, and then the war will be successful, as Arjuna did.”</p>

<p>Harikeśa wanted more clarification. “So imperfect activity is a sign of lack of surrender?”</p>

<p>“Yes,” Prabhupāda said. “You work sincerely, devoutly, and have faith that Kṛṣṇa will save me from all dangers. <em>Rakṣiṣyati iti viśvāsa-pālanam</em>. ‘I have surrendered to Kṛṣṇa sincerely. Now Kṛṣṇa will give me all protection.’ This faith, that is the beginning of devotional life—faith.”</p>

<p>“So is this faith <em>śraddhā</em> or <em>niṣṭha</em>?” Harikeśa asked.</p>

<p>“<em>Śraddhā</em>. Beginning, <em>śraddhā</em>. Then, when he is advanced, then he becomes fixed up. ‘Yes, Kṛṣṇa is protecting me.’”</p>

<p>Prabhupāda walked briskly, occasionally stopping to emphasize a point, sometimes greeting the local residents with “Hare Kṛṣṇa,” and sometimes speaking a little about the surroundings. After exactly half an hour he turned and headed back for the temple.</p>

<p>Upon entering the temple compound Prabhupāda noticed a young Western hippie girl who was staying in the guest house. He cautioned the managers that people in such dress should not be admitted to the guest house simply because they are paying guests. We must use some discretion, otherwise the local residents will consider us no better than our hippie visitors.</p>

<p>Akṣayānanda Mahārāja explained that the hippie girl had agreed to wear a <em>sari</em> when she arrived, but has now reverted to her old dress.</p>

<p>Prabhupāda said “Yes, that is due to habit.”</p>

<p>Akṣayānanda told Prabhupāda that recently one young man had arrived there dressed in a similar way, but after a few days he shaved his head and became a devotee.</p>

<p>Prabhupāda told him that was all right, but meanwhile the temple will become known as a “hippie resort, and the prestige of the temple will be minimized.” Nevertheless, he agreed that we must give everyone a chance to become devotees; but if they do not change their habits after three days they should be asked to leave.</p>

<p class="verse">* * *</p>

<p>As his Indian, American and French disciples sat before him, Prabhupāda conducted the fire <em>yajṣa</em> this morning for the <em>sannyāsa</em> initiations of Lokanātha, Śrīdhara and Pṛthu-putra in the temple courtyard. He gave a short talk based on the <em>sannyāsa mantra</em> beginning “<em>etāà sa āsthāya parātma-niṣṭhām</em>, ” from the <em>Caitanya-caritāmṛta</em>. He told them that although they are young men in the midst of the very powerful material energy, if they simply keep full faith in Kṛṣṇa and follow the previous <em>ācāryas</em> they will remain fixed up. He advised them to do this by chanting the Hare Kṛṣṇa <em>mantra</em>. He even suggested that as <em>sannyāsīs</em> they should chant extra rounds.</p>

<p>Describing the <em>sannyāsa</em> initiation as the last ceremonial procedure in the <em>varṇāśrama</em> system, and the <em>sannyāsī</em> as the guru of the other social and spiritual divisions, he told them to follow the example of Śrī Caitanya Mahāprabhu and preach all over the world.</p>

<p>“Preaching is also not very difficult because you haven’t got to manufacture anything. Everything is there, and it is Caitanya Mahāprabhu’s order. Caitanya Mahāprabhu also took <em>sannyāsa</em> at a very early age, twenty-four years old only. So He has practically shown by His activities how to preach Kṛṣṇa consciousness all over the world. And He gives order to everyone, ‘<em>āmāra ājṣāya guru haṣā tāra’ ei deśa</em>’: ‘In whichever country you may live, it doesn’t matter. Try to deliver them by becoming their guru.’</p>

<p>“And how one becomes guru? That is also very easy. Śrī Caitanya Mahāprabhu says, ‘<em>yāre dekha, tāre kaha ‘kṛṣṇa’-upadeśa’</em>. You haven’t got to manufacture anything. Simply you try to repeat the instruction of <em>Bhagavad-gītā</em>, <em>kṛṣṇa-upadeśa</em>. Not only <em>Bhagavad-gītā</em>, there are many other instructions. Especially <em>Bhagavad-gītā</em>. So if you simply carry the message of <em>Bhagavad-gītā</em>, then you become guru. Don’t manufacture anything. Then it will be spoiled. ‘<em>Man-manā bhava mad-bhakto mad-yājī mām namaskuru</em>.’ You can, everyone can, say this. Kṛṣṇa says, ‘You always think of Me.’ So you can repeat only. You can say to others, ‘My dear Sir, please think of Kṛṣṇa.’ It doesn’t require very much education. Simply just like a peon carry the message, ‘Sir, you always think of Kṛṣṇa.’ Then you become guru.</p>

<p>“If you follow it strictly, you also think of Kṛṣṇa yourself, and you teach others, ‘My dear Sir, my only request is that you think of Kṛṣṇa,’ nobody will kill you. If he doesn’t follow, he will appreciate you, ‘Oh, these <em>sannyāsīs</em> are very nice. They are advising to think of Kṛṣṇa.’ Then you become guru. Simple thing.”</p>

<p>He ended with a reference to the multinational status of his candidates. “This kind of duty was entrusted by Caitanya Mahāprabhu to the Indians. <em>Bhārata-bhūmite haila manuṣya janma yāra janma sārthaka kari’ kara para-upakāra</em>. This is Caitanya Mahāprabhu’s mission, that every Indian should learn what is this Kṛṣṇa consciousness and preach it all over the world. That is His order. But our Indians are not taking care of it. Therefore it doesn’t matter—Indian or European or American. Who will carry the order of Caitanya Mahāprabhu he will be benefitted. He will be glorified. So don’t be hesitant, because the soul is neither Indian or American. ‘<em>Ahaà brahmāsmi</em>.’ Every one of us, we are part and parcel of Kṛṣṇa and our position is Brahman. ‘<em>Brahma-bhūtaḥ prasannātmā</em>.’ So from that platform you go on preaching Kṛṣṇa consciousness. By executing the order of Śrī Caitanya Mahāprabhu, you will be glorified, the country will be glorified, the whole world will benefit. Thank you very much.”</p>

<p>One by one the three men came forward in their new dress as <em>sannyāsīs</em>. Bright faced and enthusiastic, they humbly received their <em>tridaṇḍas</em> and the title “Swami” as the entire assembly of devotees loudly cheered, “<em>Haribol</em>. <em>Jaya!</em>” Then everyone threw grains into the sacrificial fire to complete the ceremony.</p>

<p>Afterward the three new <em>sannyāsīs</em> all came into Prabhupāda’s room to receive his blessings. Prabhupāda sat at his desk, next to the fireplace. Giving each a garland, he encouraged them to go out and preach immediately. It clearly delights Prabhupāda to see his disciples commit themselves fully to the service of the Supreme Lord. On the basis of such surrendered disciples he is able to spread Kṛṣṇa consciousness all over the world.</p>

<p>Yet, Prabhupāda is not indiscriminate about awarding <em>sannyāsa</em>. Recently, two boys arrived from Germany, Alanātha and Sucandra, asking permission to take <em>sannyāsa</em>. Prabhupāda discussed their request with Hansadūta, as well as Bhavānanda and Sudāmā Mahārājas, who had just arrived from New York. Prabhupāda indicated that he considered the boys a bit young to accept <em>sannyāsa</em>. He warned them that it is very difficult to remain in the renounced order, especially in the Western countries.</p>

<p>He cited the example of two of his leading disciples, both GBC men, who had fallen victim to <em>māyā</em> after becoming <em>sannyāsīs</em>. Prabhupāda explained, “<em>Māyā</em> is very, very strong. Butter is sure to melt when there is fire.” He artistically gestured, waving his left hand in the air, bringing his right hand to meet it from below. “Even if the butter is here the fire will come. I tried to think of so many ways to keep them separate, but it was not possible. They are spirit soul, of course, but <em>māyā</em> is very strong.”</p>

<p>Bhavānanda and Sudāmā Mahārājas are staying here for a few days before leaving for Bengal. They plan to hire two forty-foot-long boats to travel to all the villages along the Ganges. They want to perform <em>kīrtana</em>, distribute <em>prasādam</em>, and recruit new devotees. Prabhupāda decided that the two German devotees should go with them for further training.</p>

<p>Not everyone is happy to see a new <em>sannyāsī</em>. Since his arrival Hansadūta has also approached Prabhupāda for <em>sannyāsa</em>. But his wife, Himavatī, heard about it in Germany and immediately rushed to Vṛndāvana to voice her objection. She was very upset, but Śrīla Prabhupāda pacified her. Nevertheless, she is still adamantly opposed to her husband taking <em>sannyāsa</em>. Therefore Prabhupāda is not encouraging him to do so. Hansadūta is somewhat confused about what to do and wants Prabhupāda to decided his fate. But Śrīla Prabhupāda won’t give him a direct instruction; he is leaving it to Hansadūta to make the decision.</p>

<p class="verse">* * *</p>

<p>This afternoon while Prabhupāda rested upstairs I noticed that the water pot in his room was empty. I thought of taking it downstairs to fill it but was hesitant, since Śrīla Prabhupāda had instructed me not to leave his presence. I got in a quandary: “If Śrīla Prabhupāda wakes up and I’m not here, that will not be good. On the other hand, if he asks for a drink when he wakes up, then he will have to wait.” I wasn’t sure what to do, but decided it was best to wait.</p>

<p>Sure enough, though, the first thing Prabhupāda did when he awoke was to sit at his desk and tell me to fill his glass. I diffidently explained there was no water in the pot and that I would have to go downstairs to get some.</p>

<p>He asked me, “Did you not think about filling it while I slept?”</p>

<p>I explained my dilemma, and Śrīla Prabhupāda tipped his head a little. “Hm, all right,” but his tone indicated it was second best.</p>

<p>From this incident I can understand that although it is essential to follow the instructions of the spiritual master closely, a little intelligence in the application of those instructions is also required. A first-class servant will anticipate the needs of his spiritual master, rather than simply wait to be told everything. One who is expert at pleasing the guru can do many things on his own initiative and still adhere strictly to all instructions. Our intelligence shouldn’t be stereotyped or inflexible.</p>', '', '1975-12-03', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


END $$;
