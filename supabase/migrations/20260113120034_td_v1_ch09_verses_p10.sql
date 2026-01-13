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


  -- March 12th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'March 12th, 1976', 56,
    '', '', '', '',
    '', '', '', '',
    E'<p>Hundreds of devotees from around the world are packed into rooms all around the temple compound. The atmosphere is very festive.</p>

<p>The <em>shenai</em> band sits up in the compartments on the main gate, and at dawn the wail of the pipe and the melodic rhythms of the drum create an almost mystical atmosphere. The exotic sounds enliven the mind and drift across the fields to call the faithful to the holy <em>dhāma</em> to pay respectful homage to the Supreme Personality of Godhead, Śrī Caitanya Mahāprabhu, on the coming anniversary of His Divine Appearance.</p>

<p>During the walk, which Prabhupāda took on the roof, the black bee we had seen in February reappeared after a few weeks’ absence. Repeating its past behavior, it flew around Śrīla Prabhupāda and his entourage several times. Then, as it had done previously, it landed on the spire of the small dome.</p>

<p>Everyone gathered around for a close inspection before it suddenly rose in the air and headed off across the fields. Prabhupāda said it was very beautiful.</p>

<p>Accompanied by at least twenty men, Prabhupāda went down and walked around the grounds. He checked the management and gave advice, even expressing concern over plants that had not been watered.</p>

<p>He told Jayapatāka Mahārāja how to systematize the removal and collection of visitor’s shoes at the temple entrance by using tickets. Yaśodānandana Mahārāja suggested that instead of charging for the shoe service, people could be requested to give a donation to the Deities.</p>

<p>Prabhupāda rejected the idea. People should simply come and see the Deities. That is our main concern, he said. The Deity is not a beggar but the Bestower. His Guru Mahārāja had said it was better to be a street sweeper and earn an honest living than to make a living by showing the Deity. “It is a question of heart, that a man should come and visit the temple—he must give something. Why he is to be asked? Voluntarily he should give.”</p>

<p>“But encouraging is not recommended?” Lokanātha Mahārāja asked.</p>

<p>“Encouraging means your behavior should be so nice that he voluntarily gives,” Śrīla Prabhupāda said. “That is encouraging, not that begging and ‘Put something here. My belly is empty.’” We all laughed.</p>

<p>He said that asking someone to contribute to the institution by some payment was another thing. “But why should you earn by showing the Deity? You work so nicely they will become voluntarily member, contributing. That is nice. But not that ‘Now we have got Deity. He’s starving. Please give me something.’ No. That is not good practice.”</p>

<p>He also briefly recollected his early days in New York in 1965-66, telling us that part of his daily routine was to go “loitering” along Fifth Avenue. He said that his purpose was to study the Americans, how they were walking, how they were shopping.</p>

<p>Satsvarūpa Mahārāja remembered that Prabhupāda had once said those were happier days, when he had only himself to maintain, rather than thousands of disciples.</p>

<p>Prabhupāda laughed. “Yes,” he agreed. “There was no chance of finding fault. Now I have to find fault.”</p>

<p>He also visited the newly erected public exhibition and saw some of the displays. The presentation of so many international projects was impressive. Prabhupāda suggested that a book be published showing all the temples and Deities around the world, with a short explanation of each. He said this would be good for preaching work.</p>

<p>However, the structure built to house the exhibit is terrible. It is constructed along the banks of the <em>pukkur</em> from dirty old tarpaulin sheets, bamboo, and crudely woven, split-bamboo fencing. Access is poor, up a slippery mud slope. It compelled Śrīla Prabhupāda to again complain about the management.</p>

<p class="verse">* * *</p>

<p>During class he explained to his hundreds of eager followers the benefits of Deity worship. He compared it to the process of yogic meditation by which one tries to see the Lord within the heart.</p>

<p>“You may practice this <em>haṭha-yoga</em>, or gymnastic yoga, for many, many births—you cannot see Kṛṣṇa. Kṛṣṇa can be seen when you smear with love ointment in your eyes. And that is possible through <em>bhakti</em>. Therefore why not practice <em>bhakti-yoga</em> from the beginning if you want to see Kṛṣṇa?</p>

<p>“Kṛṣṇa says, ‘He’s first-class yogi who is always trying to see Kṛṣṇa within the heart.’ So it is very difficult task? In our <em>bhakti-yoga</em> we can teach this art of seeing Kṛṣṇa within the core of the heart in one minute. It is so simple. “You are seeing Kṛṣṇa here. You must have impression; and try to keep that impression within your heart always. Then you become first-class yogi. Why so much gymnastic and pressing the nose? No. Take directly.</p>

<p>“If you are engaged twenty-four hours in the service of the Deity, you cannot see except the Deity. This <em>bhakti-yoga</em> practice is so simple. Therefore <em>kaniṣṭha</em>-<em>adhikārī</em>, those who are neophyte, they must take to Deity worship. By Deity worship he is elevated to the position of seeing the Lord within the heart. This is very important thing.</p>

<p>“You can see, He is there, but you have no knowledge, or even if you have knowledge, you are not competent to see Him. But if you practice Deity worship... Therefore it is the duty of guru to engage the neophyte devotee always in Deity worship.”</p>

<p class="verse">* * *</p>

<p>Devotees crowd into Prabhupāda’s room in the early evenings, eager to get as much association with His Divine Grace as possible. Many of them have worked hard all year round, selling books and doing other temple duties, and their visit to the holy<em> dhāma</em>, and especially the opportunity to see Śrīla Prabhupāda, makes it all worthwhile.</p>

<p>This evening was no exception. The atmosphere couldn’t have been more congenial. Prabhupāda was very relaxed and enjoyed the company of his faithful disciples. He is always aware and deeply appreciative of the sacrifices they are making on his behalf. Although he is our spiritual master, our instructor in every aspect of life, his dealings with us are full of respect and compassion. A few minutes with Śrīla Prabhupāda can change anyone’s life.</p>

<p>Someone brought in some sweets to be handed out, so I put them to one side. Śrīla Prabhupāda glanced over, concerned as ever that his guests receive a little <em>prasādam</em>. “Oh, you are not distributing?”</p>

<p>“Well, there are so many devotees, I thought I would give the sweets out when every one leaves.”</p>

<p>“They will never leave!” Prabhupāda said, laughing.</p>

<p>All the devotees cheered, “<em>Jaya</em>, Śrīla Prabhupāda!” Even a few simple words from him are enough to completely capture everyone’s heart.</p>', '', '1976-03-12', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- March 13th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'March 13th, 1976', 57,
    '', '', '', '',
    '', '', '', '',
    E'<p>Mahāàsa Swami is here, and on this morning’s walk he gave Śrīla Prabhupāda an update on some land in Hyderabad being donated to ISKCON. Mr. Hari Prasad Badruka, the current owner, wants to create a joint trust and have ISKCON develop the land, but legal complications have caused a delay. We may get only 250 acres, rather than the 600 originally promised. Mahāàsa expects the case to clear through the courts within a month or so.</p>

<p>After walking around the roof, Prabhupāda came down to the front of the property. He wanted to take another look at the displays in the exhibition area, which is now complete. He particularly enjoyed seeing the favorable reviews written by some of the most important scholars in the fields of linguistics, Asian studies, Sanskrit studies, psychology, and philosophy. The reviewers’ enthusiasm for his books, their personal appreciation for him as a spiritual leader, and an author, had all the devotees cheering as Śrīla Prabhupāda himself read one out loud.</p>

<p>It was a review by Dr. Geddes MacGregor, Emeritus Distinguished Professor of Philosophy from the University of Southern California. “No work in all Indian literature is more quoted. Because none is better loved in the West than the <em>Bhagavad-gītā</em>. Translation of such work demands not only knowledge of Sanskrit but an inward sympathy with the theme and a verbal artistry. But the poem is a symphony in which God is seen in all things. His Divine Grace A. C. Bhaktivedanta Swami Prabhupāda is, of course, profoundly sympathetic to the theme. He brings to it a special interpretative insight. Here we have a powerful and persuasive presentation in the <em>bhakti</em> tradition of this dearly beloved poem. The Swami’s introduction makes clear at once where he stands as a leading exponent of Kṛṣṇa consciousness.”</p>

<p>The acceptance of his work by the scholarly community in the most important universities in America and Europe is a source of deep satisfaction to Śrīla Prabhupāda. The clarity and power of his translations and purports has enabled the professors to appreciate the authenticity of Kṛṣṇa consciousness and, more importantly, distinguish it from the impersonal hodgepodge usually associated with the Hindu spiritual outlook.</p>

<p>Satsvarūpa Mahārāja, the leader of the Library Party responsible for garnering the reviews, read out several more. Each one drew more and more applause from the devotees and bigger and brighter smiles from Śrīla Prabhupāda.</p>

<p>“Ever since 1893, when Swami Vivekananda proclaimed monism and tolerance to the World’s Parliament of Religions at Chicago, nonspecialists in America have pictured Hinduism as an easy-going phantasmagoria of smiling faces disappearing like dewdrops into the shining sea. <em>The Nectar of Devotion</em> should bring them up sharp.”</p>

<p>Midst lots of laughter, he went on. “His Divine Grace A. C. Bhaktivedanta Swami Prabhupāda, whose shorn, orange-clad disciples have brought the inseparable twins of <em>bhajana</em> and <em>baksish</em> to the streets of America, has no doubt that such impersonalism is nothing less than rascaldom.”</p>

<p>“<em>Jaya!</em>” all the devotees exclaimed.</p>

<p>“With all the books on <em>Vedānta</em> and bland neo-transcendentalism that are at present available to the English-speaking public, it is good to have on the popular market such an uncompromising statement of an opposing view from the pen of one who is as firmly rooted in a disciplic tradition, <em>guru-paramparā</em>, as Bhaktivedanta Swami.”</p>

<p>At this the devotees were ecstatic. “<em>Haribol!</em>” they shouted, as Prabhupāda, a huge grin stretching right across his face, moved further down the exhibits.</p>

<p>Ghanaśyāma dāsa, a leading Library Party member, pointed out another review, written by the Chairman of Harvard University’s Department of Sanskrit and Indian Studies, Dr. Daniel H. H. Ingalls. He apparently rarely, if ever, gives reviews, but for Śrīla Prabhupāda he agreed. “I am most happy to have these handsomely printed volumes which embody the work of so learned and sincere a believer in the message of the <em>Caritāmṛta</em>. I thank you.”</p>

<p>Another was written by the current representative of Hinduism to the World Council of Churches. Mahābuddhi, another active Library Party member, added that the man ordered not one, but two, standing orders for the library.</p>

<p>“<em>Śrīmad-Bhāgavatam</em>, the Indian classic par excellence on <em>bhakti-yoga</em>, attributed to Vyāsa, is one of the most important and influential religio-philosophical works within the Vedic tradition. Thanks to the devoted and scholarly endeavors of Śrī A. C. Bhaktivedanta Swami Prabhupāda, the entire work of twelve cantos will be available in a superb English edition for the benefit of the English-reading peoples... This monumental work is immensely valuable alike to historians of religion, linguistic scholars, cultural anthropologists, pious devotees, as well as to the general reader interested in spiritual matters. I recommend it highly to every student of Indian philosophy, culture, and religion.”</p>

<p>Each review offered glowing testimonial of such high appreciation they could hardly have been better if the devotees themselves had written them. As Dr. Garry Gelade, a psychologist at Oxford University, wrote: “It is a work to be treasured. The opportunity to receive the profound teachings of the <em>Śrīmad-Bhāgavatam</em> in the West has been made possible by the devoted labor of Śrīla Prabhupāda. The clarity and precision of his commentaries on the text have rarely been equaled. No one of whatever faith or philosophical persuasion who reads this book with an open mind can fail to be both moved and impressed. The spirit of its message shines brightly from the pages.”</p>

<p>Ghanaśyāma prabhu pointed out another one from Dr. R. E. Asher, the chairman of the Department of Linguistics at Edinburgh, one of the biggest linguistic schools in the world. He is known all over the world for his studies in different kinds of languages. “It is axiomatic that no book can be expected entirely to satisfy all its potential readers. Here is one, <em>Śrīmad-Bhāgavatam</em>, however, which can be said to come remarkably close to that ideal... We have here the ideal of what an edition of a Sanskrit text for a Western audience should be.”</p>

<p>Śrīla Prabhupāda stopped at the review written by Professor Kailash Vajpeye, who had been invited to the University of Mexico to take charge of Oriental studies, specifically Hinduism. Satsvarūpa read it out. His statement amounted to a verbal broadside against the so-called svāmīs and yogis, and it drew the most enthusiastic response from the devotees and ŚrīlaPrabhupāda as well. “As a native of India now living in the West, it has given me much grief to see so many of my fellow countrymen coming to the West in the role of gurus and spiritual leaders. Just as any ordinary man in the West becomes conscious of Christian culture from his very birth, any ordinary man in India becomes familiar with the principles of meditation and yoga from his very birth. Unfortunately, many unscrupulous persons come from India, exhibit their imperfect and ordinary knowledge of yoga, cheat the people with their wares consisting of <em>mantra</em>s, and present themselves as incarnations of God. So many of these cheaters have come, convincing their foolish followers to accept them as God, that those who are actually well versed and learned in Indian culture have become very concerned and troubled. For this reason I am very excited... ”</p>

<p>At this, Śrīla Prabhupāda suddenly interrupted the reading. “Send this copy to Indira Gandhi,” he told his GBC men, “and request her to stop giving passports to all these nonsense. Do this. Yes.”</p>

<p>Satsvarūpa continued his recitation of Professor Vajpeye’s eulogy. “For this reason I am very excited to see the publication of <em>Bhagavad-gītā</em> As <em>It Is</em>, by Śrī A. C. Bhaktivedanta Swami Prabhupāda. Śrīla Prabhupāda, from his very birth, was trained in the strict practice of <em>bhakti-yoga</em>, and he appears in a succession of gurus that traces back to the original speaking of <em>Bhagavad-gītā</em> by Śrī Kṛṣṇa. His knowledge of Sanskrit is impeccable. His penetration into the inner meaning of the text is befitting only a fully realized soul who has indeed perfectly understood the meaning of <em>Bhagavad-gītā</em>. Personally, I intend to use this book in the courses which I am directing by invitation of the Mexican government on the language, culture, and philosophy of India. This authorized edition of the <em>Gītā</em> will serve a double purpose in Spanish-speaking countries. One, it will help to stop the terrible cheating of false and unauthorized gurus and yogis; and two, it will give an opportunity to Spanish-speaking people to understand the actual meaning of Oriental culture.”</p>

<p>Prabhupāda was extremely pleased with the display and said a building should be erected as a permanent exhibition. He also enthusiastically approved Madhudviṣa Swami’s idea that every temple have a display of his books along with the reviews. The whole display, he said, was “very enlivening, encouraging, very good.”</p>

<p class="verse">* * *</p>

<p>Many devotees, led by Jayapatāka Swami, went out on <em>parikrama</em> very early in the morning to avoid the heat of the day. But they ended up returning after the start of Śrīla Prabhupāda’s lecture, and he was not at all pleased with this. He said that the morning program of hearing <em>Śrīmad-Bhāgavatam</em> is more important, and so there should be no more early <em>parikramas</em>.</p>

<p class="verse">* * *</p>

<p>The Australian devotees had a special <em>darśana</em> with Śrīla Prabhupāda. They presented him with $1,350 dollars <em>guru-dakṣiṇa</em> and sixty-nine kilos of their famous Australian ghee. The meeting was short but sweet, and Śrīla Prabhupāda encouraged them all to continue distributing his books in ever-increasing quantities.</p>

<p>In the late evening he called Gargamuni Mahārāja, the newly appointed Māyāpur GBC, and sold the ghee to him for use here for twenty-five rupees per kilo.</p>

<p class="verse">* * *</p>

<p>Śrīla Prabhupāda also viewed plans for the palace the devotees in New Vrindaban, West Virginia, are building for him. He was extremely pleased with it and accepted their invitation to visit there this summer.</p>

<p class="verse">* * *</p>

<p>Arundhatī dāsī, the wife of an early disciple, Pradyumna dāsa, came for <em>darśana</em>. Prabhupāda immediately greeted her, inquiring about her husband’s whereabouts. Arundhatī explained that Pradyumna was in Uḍupi in South India, studying Sanskrit.</p>

<p>Śrīla Prabhupāda requested that he come see him. He didn’t seem very satisfied to hear that Pradyumna was simply studying and not doing any active service.</p>

<p class="verse">* * *</p>

<p>Thirteen members of Prabhupāda’s former family came to see him. They will stay for Gaura Pūrṇimā. Prabhupāda met with them all briefly, making sure they were comfortably situated. After some light conversation they went out. Prabhupāda was warm and cordial, but he didn’t give them any special attention beyond that which he extends to all his visitors. He clearly has no sense of bodily identification and deals with everyone equitably. He has truly realized that every living being is spirit soul, part of Kṛṣṇa. His dealings at every moment reflect his sense of all existence as a homogenous whole.</p>', '', '1976-03-13', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- March 14th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'March 14th, 1976', 58,
    '', '', '', '',
    '', '', '', '',
    E'<p>During the morning walk on the roof, Rāmeśvara prabhu raised a common doubt: If Kṛṣṇa knows everything, past, present, and future, then He must know that a soul is going to fall into the material world, yet He allows it. Therefore He must be cruel.</p>

<p>This set off a long and lively discussion about the individual soul’s fall-down from the spiritual realm. Prabhupāda explained that ultimately the soul always has a choice to serve Kṛṣṇa or not. Otherwise we would simply be like dead stones. Therefore Kṛṣṇa cannot be blamed for allowing the soul his independence. Yet despite this little independence, the soul requires assistance from Kṛṣṇa’s representative, the guru, in order to regain his position as Kṛṣṇa’s servant. And who gets that assistance is decided by Kṛṣṇa.</p>

<p>Revatīnandana and Paṣcadraviḍa Swamis wanted to know what it is that decides why one man and not another gets the good fortune of having a good spiritual master.</p>

<p>Prabhupāda said that it is due to <em>ajṣāta-sukṛti</em>, past pious activities unknowingly performed.</p>

<p>Then it seems like chance, Revatīnandana said.</p>

<p>“Not chance,” Prabhupāda told him. “Just like a sinful man. Some saintly person comes to him and he gives some money to him. He does not know that ‘I am doing very pious activity,’ but because he has given, he becomes pious.”</p>

<p>Revatīnandana’s mind jumped to the next logical point. “If not even a blade of grass moves unless Kṛṣṇa sanctions it, then why does someone have the opportunity to perform such <em>ajṣāta-sukṛti</em>, and another person not?”</p>

<p>Śrīla Prabhupāda explained it in terms of a dual intervention from both guru externally and Kṛṣṇa within the heart. “Suppose a saintly person comes to a very sinful man. He needs some money. Immediately Kṛṣṇa says, ‘Give him some money, he requires.’</p>

<p>“So he says, ‘All right, sir, take it.’ So Kṛṣṇa desires—he gives. Unless Kṛṣṇa dictates from within, how he can give?”</p>

<p>I asked that if that is the case, where is the question of the free will of the individual?</p>

<p>Again Prabhupāda had the answer. “Free will under Kṛṣṇa. You can become free will and become a big man immediately. Your free will sanctioned by Kṛṣṇa. You are not so free that whatever you like, you can do.”</p>

<p>“So even if I want to perform some <em>ajṣāta-sukṛti</em>,” Madhudviṣa asked, “it is only by Kṛṣṇa’s mercy that I will do it?”</p>

<p>“Yes. That is stated by Caitanya Mahāprabhu.<em> Ei rūpe brahmāṇḍa bhramite kona bhāgyavān jīva/ guru-kṛṣṇa-kṛpāya pāya bhakti-latā-bīja:</em> As soon as he gives to a saintly person, <em>bhakta</em>, he immediately acquires some asset of future development. Immediately.”</p>

<p>I still had a remaining doubt. The world is full of sinful people, and not all get contact with devotees, or if they do, not all give. Therefore I asked, if Kṛṣṇa is giving dictation to sinful people to give to the saintly persons, does He give dictation to every sinful person? It seems that there is some discrimination.</p>

<p>Prabhupāda’s answer cleared my doubts. He said that it isn’t just a question of our free will; Kṛṣṇa has His also, and that is supreme. “You cannot bind Kṛṣṇa to dictate in a similar way. If He likes, He can ask a sinful man, “Do this.” If He doesn’t like, He may not act. That is Kṛṣṇa.”</p>

<p>“So, ultimately it is simply by the mercy of Kṛṣṇa that a living entity comes back to Kṛṣṇa,” Revatīnandana Mahārāja concluded.</p>

<p>“Yes. So it is Kṛṣṇa’s business where to show mercy, where not to show. You cannot oblige Him that ‘You show mercy everywhere.’ No. You cannot oblige Kṛṣṇa, ‘You do this.’ That is not Kṛṣṇa. If one is obliged to act to your dictation, then he is not Kṛṣṇa. Therefore whatever Kṛṣṇa likes, He’ll do. Ordinary people, they think <em>karma-mīmāàsā</em>, ‘If I do good work, Kṛṣṇa will be obliged to give me good effect. Why shall I care for Kṛṣṇa?’ They say like that. But we say, even if you do good work, if Kṛṣṇa does not want it, then it will not produce good result. That is Kṛṣṇa. Everyone has got the mercy, but that mercy is not obligatory. If He likes, He can give you mercy; if He does not like, He may not.”</p>

<p>Paṣcadraviḍa Mahārāja was curious, why then, if it is a question of <em>ajṣāta-sukṛti</em>, the Indian people, who from their birth water the <em>tulasī</em> tree, chant Hare Kṛṣṇa, and do so many pious activities, don’t seem to be taking to the Kṛṣṇa consciousness movement. Meanwhile, so many Westerners are becoming Prabhupāda’s followers.</p>

<p>Prabhupāda used a metaphor to explain the position of the Indian people. It was perhaps also a revelation as to why he is putting so much personal effort into his Indian preaching, despite the seemingly poor response. “That is temporary,” he said. “They may come again. It will never go in vain. Just like this cloud. Cloud is meant for raining. Now it is not raining, but when there is sufficient cloud, it will rain. You cannot say there is no rain. There is, but it is not sufficiently collected. When it is sufficiently collected, then... .”</p>

<p>Even without sufficient cloud it sometimes rains, he said. “That is superior direction. It is not your direction.”</p>

<p>Revatīnandana asked about Kṛṣṇa’s appearance in the material world. It seems that He comes whenever there are certain conditions.</p>

<p>Prabhupāda disagreed. Kṛṣṇa comes when He wants, not according to conditions. Looking at his watch he made a sudden declaration, emphasizing his point, finishing the debate, and making us all laugh. “Now it is 6:30. Generally I go down. If I like, I don’t go!”</p>

<p class="verse">* * *</p>

<p>Down in the temple room during his discourse, Śrīla Prabhupāda told us about <em>bhāva</em>, ecstasy. “At the present moment,” he said, “we have got a <em>bhāva:</em> ‘I am this. I am that. I belong to this family. I belong to this nation.’ <em>Bhāva</em> is ecstasy, and everyone is overwhelmed with such kind of ecstasy. The politicians, they think that we are simply wasting time in chanting and dancing. ‘They have no sense how to improve the position of the country.’ They do not like it because they are in different <em>bhāva</em>.</p>

<p>“But we are trying to change that <em>bhāva</em>. The <em>bhāva</em> must be there. The whole Kṛṣṇa consciousness movement is to purify the <em>bhāva</em>. That is stated here. <em>Pariśuddha-bhāvaḥ</em>. We are not negating everything. We are simply changing from material <em>bhāva</em> to spiritual <em>bhāva</em>. That’s all.</p>

<p>“Here is a big building, but there are many other hundreds and thousands of big buildings in this district or in this country. But here the <em>bhāva</em> is changed. In your country there are many big skyscraper buildings. In comparison to those buildings, this is nothing. But still you have come, spending thousands of dollars, here, to change the <em>bhāva</em>. That is required. Otherwise you American boys and girls, you have no business to come here to see this big building, no. To change the <em>bhāva</em>. That is required. That is very important thing.”</p>

<p>Getting down from the <em>vyāsāsana</em>, the devotees crowding around, Prabhupāda embarked on his daily circuit of the temple room. Pṛthu Putra Swami struck up a loud <em>kīrtana</em>, and Prabhupāda began to exhibit his own <em>bhāva</em>, dancing up and down the whole time. The devotees were wild with delight as he rang the bells hanging down on either side of the temple room, strongly pulling on the ropes for prolonged spells, encouraging the devotees to chant and dance with increasing enthusiasm, and smiling all the while.</p>

<p>After his third circuit he came before their Lordships and began to dance. Hundreds of devotees converged around him, leaping with excitement as he put first one hand in the air and then, handing his cane to Madhudviṣa Swami, raised the other. With both arms extended and a huge smile on his face, he urged the ecstatic crowd to greater and greater heights of spiritual abandon as he also jumped up and down enthusiastically.</p>

<p>It was a personal demonstration of what Lord Caitanya’s festival is really all about—purification through association. Visiting the <em>dhāma</em> is wonderful, but seeing and being with Śrīla Prabhupāda is the concentrated essence.</p>

<p class="verse">* * *</p>

<p>During his massage, Prabhupāda replied to a couple of letters, one from Ambarīṣa prabhu and one from his former personal servant, Śruta Kīrti. Both of them reported having some difficulties, Ambarīṣa with his parents and Śruta Kīrti with the local temple president in Hawaii.</p>

<p>Ambarīṣa has moved to Boston and is attending the university there, to satisfy his parents. He said that he is helping the local temple there, and he suggested that a restaurant serving Kṛṣṇa <em>prasādam</em> would be very successful among the huge student community. He also reaffirmed his commitment to fund the Kurukṣetra project.</p>

<p>Śruta Kīrti reported the successful reestablishment of the Govinda’s restaurant near the University of Hawaii. It is becoming popular among the 25,000 students there. He is disturbed, however, because of some misunderstandings with the local temple management. Thus he asked for a new engagement.</p>

<p>Śrīla Prabhupāda put the two together. He wrote to Ambarīṣa prabhu, approving his move to satisfy his parents, “although they do not know that someone who is a devotee is best educated.” He told him that Śruta Kīrti will come to Boston to help him start a restaurant.</p>

<p>To Śruta Kīrti he sent Ambarīṣa’s address and advised him to join him in Boston immediately, “for there are many, many young people, and a Hare Krsna Restaurant where we serve delicious Krsna prasadam will be appreciated there.”</p>

<p class="verse">* * *</p>

<p>Right after dealing with the mail, Puṣṭa Kṛṣṇa Mahārāja allowed some devotees from the Los Angeles BBT—Rāmeśvara, Rādhāballabha, and Jagannātha Suta—to come onto the veranda. Prabhupāda approved specific criteria for the <em>Śrīmad</em>-<em>Bhāgavatam</em> covers. The artists had drawn a new color scheme, a different one for each of the twelve Cantos. Although Prabhupāda said that originally he had planned to use the illustration of the spiritual sky that presently adorns the First Canto, for all the volumes, he accepted their idea but told them very clearly that after this there could be no more changes.</p>

<p>Jayatīrtha prabhu also showed up. He asked that Rāmeśvara be awarded <em>sannyāsa</em>. Prabhupāda immediately and happily granted the request. Jayatīrtha told Prabhupāda that Rāmeśvara is a <em>naiṣṭhiki-brahmacārī</em>, having never had sex in this lifetime.</p>

<p>Gradually more GBC members arrived on the balcony. Paṣcadraviḍa Swami brought up the <em>sannyāsī</em>/<em>gṛhastha</em> conflict again. Tamal Krishna Goswami, Gargamuni Swami, and Bhagavān dāsa eventually joined the discussion, which went on until 1:30 p.m.</p>

<p>The topic came up again because many devotees feel that the resolutions passed are too drastic. The resolution calling for all householders to earn a living outside of the temple financial structure includes temple presidents. Śrīla Prabhupāda was told that such regulations were meant to protect ISKCON from becoming financially overburdened.</p>

<p>Śrīla Prabhupāda has given his approval in principle, but there is considerable discontent among the temple presidents. Most of them are married men and feel that they are simply being discriminated against by the <em>sannyāsīs</em>. They are very apprehensive about how the new resolutions will be practically applied.</p>

<p>They also resent what they perceive to be inferences that as married men they are less useful than the <em>brahmacārīs</em> and <em>sannyāsīs</em> and perhaps even burdensome to the preaching mission. Many GBC members, including some of the <em>sannyāsīs</em>, are now also having doubts about whether the resolutions passed are actually fair.</p>

<p>Thus the debate was resumed, and Śrīla Prabhupāda listened as various devotees expressed their views.</p>

<p>Tamal Krishna Goswami was apparently not prepared to concede any ground on the issue, even though nearly everyone else’s complaint is against him and his marked pro-<em>sannyāsī</em>/<em>brahmacārī</em> inclination.</p>

<p>It got late, and Śrīla Prabhupāda sent everyone for lunch without coming to any real conclusions.</p>

<p>When everyone had gone, Tamal Krishna Mahārāja remained behind for a minute with Śrīla Prabhupāda. It appeared he wanted to gain Prabhupāda’s affirmation on his feeling that it is better to be strict. He told Prabhupāda that as a <em>sannyāsī</em> he is personally uncompromising in dealings with women, to the point that he doesn’t speak to any women whatsoever, even when preaching. He feels that unless the Society is conscientious on this matter, there will be a loss of purity and determination to preach.</p>

<p>Prabhupāda agreed, Tamal Krishna then left, and Prabhupāda took his bath.</p>

<p>When Prabhupāda returned to his room I asked him whether Mahārāja’s attitude of avoiding women in his preaching is a material consideration.</p>

<p>“Yes, it is,” he said. However, noting my critical tone of voice, he corrected me, “But does that mean he is not a devotee?”</p>

<p>As he sat down at his desk putting on his <em>tilaka</em>, he noticed a beautifully decorated bookmark that I had just placed there. Picking it up he asked me where it came from. I told him it was a gift from Kṛṣṇa Rūpa dāsī, an Australian <em>brahmacārinī</em> living here in Māyāpur. He exclaimed very appreciatively, “Such nice service, how can it be refused? I have never stopped them from rendering service simply because they are women.”</p>

<p>After <em>prasādam</em> he went for his usual nap, but arose early, within fifteen minutes. I answered the ring of the bell and found him sitting on his bed, looking deeply troubled. He was unable to rest because of the controversy. He had a headache. “This is a very serious thing, this difference of <em>sannyāsī</em> and <em>gṛhastha</em>,” he said with a frown. “Everything will be spoiled.”</p>

<p>I recalled his comments that the Gaudiya Math fell into difficult times because Śrīla Bhaktisiddhānta Sarasvatī had ordered his disciples to form a GBC to conjointly manage, and they had simply argued and made their own plans. “We made a GBC ŚrīlaPrabhupāda,” I said, “but still there is splitting.”</p>

<p>Śrīla Prabhupāda’s reply was brusque and revealing. “Personal ambition!” Then he went to sit in his <em>darśana</em> room.</p>

<p>In the evening the entire Governing Body Commission came in to see Prabhupāda. Things had come to a head. After some discussion, Jayādvaita dāsa, a <em>brahmacārī</em>, was invited in to speak as the representative of all the temple presidents. They had held meetings to discuss the implications of the new resolutions, and he presented the results. It seemed that much of the basis of the conflict stemmed from the activities of the Rādhā Dāmodara <em>saṅkīrtana</em> party. They have gained some notoriety for taking unmarried men from temples without asking, thereby undermining temple authorities.</p>

<p><em>Brahmacārīs</em> were being told that if they remained in the temples they would end up married, entangled in family affairs, and therefore useless. On the other hand, they could accept the alternative of a carefree life, traveling and preaching with the RDTSKP buses.</p>

<p>It was claimed that the effect on the temples was to put them in great difficulty because they were losing the <em>saṅkīrtana</em> men, their most valuable assets.</p>

<p>Tamal Krishna Mahārāja was still adamant, defending his party and their record-breaking book distribution. He proclaimed the accusations as outright lies. However, he seemed alone. Most GBC men, although highly appreciative of the RDTSKP’s book distribution and sympathetic to the principle of <em>vairāgya</em> as being the foundation for a spiritually strong society, were now backing away from their earlier stance.</p>

<p>After hearing both sides, Prabhupāda spoke. He broke the deadlock. He finally settled the issue by wonderfully preaching to everyone that it does not matter what one is, one can do anything and go anywhere for Kṛṣṇa. We are not to discriminate against anyone on the basis of external dress. One is to be judged on the basis of one’s advancement in Kṛṣṇa consciousness.</p>

<p>Quoting the verse <em>yei kṛṣṇa-tattva-vettā sei ‘guru’ haya</em>, he told them, “We cannot say simply because one is <em>gṛhastha</em> then he must go away.” Everyone is entitled to the same facility to preach he said. Śrīla Bhaktivinoda was a <em>gṛhastha</em>, and his son a lifelong celibate and <em>sannyāsī</em>, but both of them were gurus. There was no difference. He said that the tendency to form factions was not good and he wanted it to stop immediately. He stressed there must be cooperation between the temples and the traveling parties, and that no one fixed principle applied to everyone.</p>

<p>Living in the temple is preaching also—cleaning, cooking and doing Deity worship. A <em>brahmacārī</em> may be allowed to go with the <em>sannyāsīs</em>, but not if he is holding a responsible position in the temple.</p>

<p>He stated the proper etiquette for a man to join a traveling party; he should do so only with the permission of the temple president. And ideally, he said, it is better that the <em>gṛhasthas</em> manage the temples and the <em>sannyāsīs</em> go out and preach. This example was set by the six Gosvāmīs, who turned over the management of their temples to their married disciples. As for the <em>brahmacārīs</em>, he said they may do either—travel and preach, or remain in the temple.</p>

<p>As Śrīla Prabhupāda gave his verdict, the room became increasingly packed with devotees eager to understand the solution to the conflict.</p>

<p>Finally Prabhupāda concluded that this competitive spirit and attitude of “puffed-up prestige,” was not good. Everyone should remain as a humble servant. Thus he made it quite clear that he disapproved of the resolutions and ordered the GBC to meet and strike out the controversial ones.</p>

<p>Everyone left happy and relieved that the conflict that had grown over a period of a year or so was finally resolved.</p>

<p>Only Tamal Krishna Goswami remained in Śrīla Prabhupāda’s room, requesting me also to leave so that he could spend a few minutes alone with Śrīla Prabhupāda. I later heard from Mahārāja what he discussed with Śrīla Prabhupāda. Seeking solace and feeling defeated, he began to lament to Prabhupāda that now he felt discouraged, like an enemy in the camp. He said that he didn’t want to be an obstacle to the progress of Śrīla Prabhupāda’s movement, so perhaps he should not even preach in America any more. Maybe he should go and preach where he would not be a disturbance to anyone, like China or somewhere else.</p>

<p>After twenty minutes of commiseration, he got up and left. I was out on the balcony, and I watched him make a lonely walk down the veranda and disappear up the stairs.</p>

<p>I entered Prabhupāda’s room and found him clearly relieved at having resolved the matter. He smiled at me and said, “Of all the GBC, he,” indicating Tamal Krishna Mahārāja with a tip of his head, “is the most intelligent. But the problem is, those with intelligence want to control everything. And he wants to control the whole Society. He wants to be the supreme controller.”</p>', '', '1976-03-14', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


END $$;
