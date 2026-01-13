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


  -- March 2nd, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'March 2nd, 1976', 46,
    '', '', '', '',
    '', '', '', '',
    E'<p>The <em>sannyāsī</em>/<em>gṛhastha</em> controversy continues to simmer, although in Śrīla Prabhupāda’s presence the criticism’s are muted. Even among the <em>sannyāsīs</em> there is no clear consensus.</p>

<p>When Prabhupāda brought it up for discussion on his walk this morning, Hridayānanda Mahārāja said he doesn’t think the <em>gṛhasthas</em> are such a burden on the Society. But Gurukṛpa, Yaśodānandana, and Gargamuni Mahārājas disagreed and were quite pushy. They feel that the presence of many women and children in the temples is creating an atmosphere of laziness.</p>

<p>Prabhupāda agreed that the women and children could live on farms. There the children could be brought up as devotees and the women engaged in small cottage industry. The city centers could then be used simply for preaching.</p>

<p>Gurukṛpa doubted the <em>gṛhasthas</em> would agree to such a proposal.</p>

<p>Prabhupāda’s response was quick and straight to the point. “Then don’t allow. Don’t allow that... . Unless they follow the rules and regulations, what is the use?” He was concerned that all the devotees be conscientious about their service and spiritual practices, and he was satisfied to hear from Gargamuni that in general, most devotees do attend all the programs in the temple.</p>

<p>Prabhupāda’s main point was that all devotees must be fully engaged in service. He doesn’t want any laziness.</p>

<p>He brought up the same point again at the end of his <em>Śrīmad</em>-<em>Bhāgavatam</em> lecture. He told us that the disease of everyone in the material world is the desire to be a master. Whether a person has charge of one or two family members or the entire universe like Lord Brahmā, the disease is the same. So when people come to our Kṛṣṇa conscious Society, the leaders have to be alert to see to the treatment of this disease.</p>

<p>“Prahlāda Mahārāja has understood this so-called false prestigious position of becoming a master. He says that ‘I am quite aware of this false thing. Kindly engage me... <em>Nija-bhṛtya-pārśvam</em>, means just like apprentice. One apprentice is engaged to one expert man. By and by, the apprentice learns how to do the things. Therefore he says, <em>nija-bhṛtya-pārśvam</em>. ‘Not that immediately I become very expert servant, but let me... ’</p>

<p>“Our institution is for that purpose. If somebody comes here, he must learn how to serve. Those who are serving, one should learn from him how he’s serving twenty-four hours. Then our joining this institution will be successful. And if we take it that ‘Here is an institution where we can have free hotel, free living, and free sense gratification,’ then the whole institution will be spoiled. Be careful. All the GBCs, they should be careful that this mentality may not increase. Everyone should be very eager to serve, to learn how to serve. Then life will be successful.”</p>

<p class="verse">* * *</p>

<p>About 10:30 a.m. he heard some disconcerting reports about the Vṛndāvana temple from Hansadūta and Pṛthu Putra Swami. They said the devotees in Vṛndāvana are eating three large meals a day and they even owe money for food supplies. Akṣayānanda Mahārāja is spending all his time in management at the temple. Consequently there is no preaching program going on.</p>

<p>Prabhupāda wasn’t happy to hear about this. He told Gurukṛpa Swami to go there immediately with instructions to reorganize everything and to send Akṣayānanda out preaching to raise funds through Life Membership.</p>

<p class="verse">* * *</p>

<p>In the evening Śrīla Prabhupāda called all the <em>sannyāsīs</em>, and whatever GBC men were present, to discuss the position of women in our Society. He is concerned that a major conflict seems to be looming between the <em>sannyāsīs</em> and <em>gṛhastha</em> temple presidents. They appear to be at odds on many issues.</p>

<p>There are reports that some <em>sannyāsīs</em> are not allowed to preach in certain temples in America because they are speaking out against marriage and are almost exclusively supporting <em>brahmacārī</em> life. There are also allegations that large buildings are being purchased, simply for use as residences. Thus difficult monetary obligations are being incurred, and it is the <em>brahmacārī saṅkīrtana</em> members who end up paying for them. Preaching programs have begun to suffer as a result.</p>

<p>And some <em>sannyāsīs</em> are objecting that <em>brahmacārīs</em> are being told to get married if they feel some sexual agitation, rather than being encouraged to strive for higher principles of austerity and celibacy. They argued that the presidents prefer to get them married off in order to keep them in their temples for fund-raising rather than let them travel and preach with <em>sannyāsīs</em>.</p>

<p>Prabhupāda heard the complaints but said that all things must be decided by the GBC and no one can go against their decision. He declined to make a final statement one way or the other, but he again suggested the women and children could live on ISKCON farms and help develop small-scale cottage industries. He said that our whole preaching program is detachment from material enjoyment: stopping sex life altogether. <em>Gṛhastha</em> life is a concession to those unable to give up sex immediately. But he added that in actuality, marriage is not at all required. It is simply burdensome. Licit or illicit, the after-effects of sex simply mean difficulty.</p>', '', '1976-03-02', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date,
    updated_at = now();


  -- March 3rd, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'March 3rd, 1976', 47,
    '', '', '', '',
    '', '', '', '',
    E'<p>In the morning Śrīla Prabhupāda met with two of his Godbrothers, Govinda Mahārāja and one other, who came from the Caitanya Gaudiya Math to see him. Prabhupāda referred to Govinda Mahārāja as an old friend. After Tīrtha Mahārāja, who is now apparently crippled, he is second in command at the Caitanya Math. Prabhupāda gave him a copy of his translation and commentary on the <em>Caitanya-caritāmṛta</em>, <em>Ādi-līlā</em> Volume One. He also discussed his book production and distribution with Govinda Mahārāja. Their meeting was short but pleasant. It seems Prabhupāda will reciprocate with a visit to their <em>maṭha</em>.</p>

<p class="verse">* * *</p>

<p>With the evening came disturbing news that Jagadīśa prabhu, who is now back in America, has sent all the Dallas <em>gurukula</em> children and teachers home without consulting anyone. It so disturbed Prabhupāda that he immediately called all the <em>sannyāsīs</em> and GBCs into his room for discussion. Jagadīśa was here in Māyāpur just a short while ago, but he had not mentioned that he was contemplating such radical action.</p>

<p>Prabhupāda was incredulous. He said that the <em>gurukula</em> must be continued at all costs. He knew of the difficulties in conforming to government regulations and of the devotee’s attempts to find another place, but he never anticipated Jagadīśa’s drastic decision. He was extremely perturbed and feared that everything there would be finished. So after consulting with his GBC men and <em>sannyāsīs</em>, he ordered Dayānanda prabhu, who was formerly the headmaster there in Dallas, to return tomorrow. He gave him instructions to take charge and keep the school open.</p>

<p>Even when I reminded Śrīla Prabhupāda that Jagadīśa will be arriving here in a few days for the GBC meetings, he remained insistent that Dayānanda should leave at the earliest opportunity and do all he can to prevent the closing. After much discussion he finally sent everyone out.</p>

<p>I returned about 9:00 p.m. to find him sitting on the carpet in his bedroom, before his small Deity of Lord Caitanya, deep in contemplation. He looked very strained.</p>

<p>Kneeling before him, I asked how we could avoid bad management. Should we simply pray to Kṛṣṇa to reveal the faults, or what?</p>

<p>With resignation in his voice, Prabhupāda replied. “We cannot hire outsiders. Everything must be done by our own men. Unless a man is Kṛṣṇa conscious, he cannot manage nicely. A bad man cannot do good management. The only way we can be sure of our leaders is if they follow the instructions of the spiritual master.”</p>

<p class="verse">* * *</p>

<p>On a happier note, Puṣṭa Kṛṣṇa Swami arrived very late in the evening with Prabhupāda’s new Mercedes limousine, which he had driven from Germany. He was immediately appointed Śrīla Prabhupāda’s new secretary. Before packing his own bags Dayānanda gave him a quick briefing.</p>

<p>Siddha Svarūpānanda Goswami also arrived. He went to the banana plantation we have near the Jalāṅgī river to stay with Sudāmā Vipra Mahārāja.</p>', '', '1976-03-03', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date,
    updated_at = now();


  -- March 4th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'March 4th, 1976', 48,
    '', '', '', '',
    '', '', '', '',
    E'<p>Dayānanda prabhu left at daybreak, bound for Dallas. He was armed with two letters from Śrīla Prabhupāda: one addressed to the parents of the students asking them to return their children to the school, with an additional request that they be prompt in paying tuition fees; and one to the devotees involved with the running of the school, asking them to cooperate with Dayānanda to keep it open.</p>

<p class="verse">* * *</p>

<p>Instead of walking on the roof, Prabhupāda went for a twenty-minute ride in his new, maroon Mercedes sedan. Gargamuni’s van rode in front, playing <em>kīrtana</em> over the loudspeakers. As we drove through the surrounding villages the inhabitants stood wide-eyed looking at the procession.</p>

<p>The car is classy and comfortable, and Prabhupāda is very pleased to have it because previously devotees have had to beg various Life Members for the use of their cars whenever he arrived at their temples. Prabhupāda felt that this created a bad image for the Society.</p>

<p>There is a complication to keeping it in India though, because import tariffs are two to three times the value of the car. Puṣṭa Kṛṣṇa Mahārāja has obtained a six-month <em>carnet</em>, after which the car must be taken out of the country. He hopes to make an arrangement to send it to Nepal, renew the <em>carnet</em>, and then bring it back in.</p>

<p>Once back inside the temple compound’s front gate, Prabhupāda got out of the car and decided to walk down towards the <em>prasādam</em> hall. At the end of the line of the boundary wall, opposite the southern gate, he stopped to inspect the circular-shaped toilet block. It is meant to provide basic amenities for the families occupying the rooms on the front wall.</p>

<p>He was repulsed by what he saw. Human faeces lay strewn on the outer pathway. Poking several of the doors open with his cane, he saw that each and every toilet was completely blocked with stool and overflowing. Śrīla Prabhupāda was shocked. He could not believe it possible that the maintenance of the block was so neglected. He demanded to know who was responsible.</p>

<p>One devotee explained that the newer Bengali devotees are simple village people, unaccustomed to using flush toilets. He said the Western devotees never used this block.</p>

<p>Prabhupāda rejected the excuse. He was disgusted. “I could understand if they [the villagers] do not react to this, because they are used to passing stool in the fields. But you Westerners, you are not trained in such a way. How our Western men can allow this situation without doing anything about it?”</p>

<p>He called the managers and told them to immediately have the toilets fixed and cleaned.</p>

<p>After entering the temple, greeting the Deities, and receiving <em>guru-pūjā</em>, he gave <em>Śrīmad-Bhāgavatam</em> class. The verse expressed Prahlāda Mahārāja’s feelings of humility as he described himself as born in a family infected with the hellish qualities of passion and ignorance. It was a wonder to Prahlāda that Lord Nṛsiàha had touched him personally on his head, even though such a favor had never been extended to great personalities like Lord Brahmā, Lord Śiva and even Lakṣmī, the Lord’s eternal consort.</p>

<p>The toilet incident was obviously still on Prabhupāda’s mind. He often draws upon real-life incidents and presents them in a more-refined philosophical way in class. But today, without any delay, he directly complained about what he had seen. He spelled out the serious implications very clearly. Prabhupāda took full advantage of the description in this verse to express his disapproval of our inaction in the face of a gross display of ignorance.</p>

<p>“This is the position. Prahlāda Mahārāja, humbly submitting, because he is Vaiṣṇava, that ‘What is my position? My position is that I am born of <em>rajas-tamo-guṇa</em>.’ This birth takes place according to quality we acquire. Just like I was rebuking that toilet. This is so nasty, <em>tamo-guṇa</em>, and if I have no response to such <em>tamo-guṇa </em>place, that means I am also of that quality.</p>

<p>“Just like between fire and fire, there is no reaction; but fire and water there is reaction. Similarly, <em>sattva-guṇa</em> and <em>sattva-guṇa</em>, there is no reaction. <em>Tamo-guṇa/tamo-guṇa</em>, there is no reaction. In English it is called incompatible, when different qualities [mix]. Acid and acid, you mix; there is no reaction. But acid and alkaline, if you mix, there will be effervescence immediately.</p>

<p>“So if one is developing <em>tamo-guṇa</em>, then, if he becomes a pig next life there is no reaction. He’ll be very glad that ‘I am pig,’ ‘I am dog.’ There is no reaction. But if one is <em>sattva-guṇa</em>, then he cannot tolerate. Immediately obnoxious: ‘Oh, such a nasty condition.’</p>

<p>“So I am very sorry there was no reaction in such a nasty toilet room. And you are getting sacred thread, the quality of <em>brāhmaṇa</em>,<em> sattva-guṇa</em>. It is very regrettable. Nobody reacted. This is the position, that unless we curb down these <em>raja-guṇa</em>, <em>tamo-guṇa</em>, there is no improvement. If a person in Kṛṣṇa consciousness is found to have no reaction in <em>raja-guṇa</em>, <em>tamo-guṇa</em>, then he’s a dull stone. It is not improving. It is simply show bottle. So show bottle will not help.</p>

<p>“This prescription is there. If one develops Kṛṣṇa consciousness, then it is to be understood that he has surpassed <em>sattva-guṇa</em>, the brahminical qualification. Why we offer sacred thread to a person who is coming from very, very low family? Because it is to be understood by chanting Hare Kṛṣṇa <em>mantra</em>, by following the regulative principle, he has already come to the platform of <em>sattva-guṇa</em>. But if it is a false thing, there is no need of second initiation.</p>

<p>“Our process is ‘Don’t do this. Do this: Chant Hare Kṛṣṇa <em>mantra</em>, sixteen rounds; and don’t do this—no illicit sex, no meat-eating.’ That means he’s becoming purified from the rotten condition of <em>rajo-guṇa</em> and <em>tamo-guṇa</em>. But if he does not, then there should be no second initiation. This should be the rule.”</p>

<p>Prabhupāda’s criticism had its effect. By mid-morning the whole block was thoroughly cleansed and disinfected. The managers vowed to keep it that way.</p>

<p class="verse">* * *</p>

<p>The work on the new building is going on enthusiastically even though it is clear it will not be habitable for the festival. The several-hundred hired workers usually arrive around 7:00 a.m. Within a half hour everything is in full swing. Sometimes a great clamor and loud shouts can be heard from them as they respond to the urging of devotee supervisors to work faster and harder. Even though they are being pushed, they are in good spirits, full of smiles. They often chant “Hare Kṛṣṇa” and “<em>Jaya</em>” due to their association with our devotees.</p>

<p>Some of our Western men are also helping with the construction. They balance mortar, bricks, and mud in the wok-shaped <em>karai</em> on their heads, much to the delight of the laborers. The new cement mixer is a boon, but its loud clatter has been creating a distracting background racket during Prabhupāda’s morning <em>Śrīmad-Bhāgavatam</em> discourse. So now it is shut down while he speaks.</p>

<p class="verse">* * *</p>

<p>During his massage, which he took downstairs on his veranda, Prabhupāda glanced across the fields toward the <em>gośālā</em>. “So our Siddha Svarūpa and Sudāmā Vipra like to stay at the banana plantation?” he asked.</p>

<p>I took his enquiry as a prompt to ask some questions of my own. I wanted to hear Prabhupāda’s response to some specific points of contention between Siddha Svarūpa’s followers and our ISKCON devotees. “Śrīla Prabhupāda, when Siddha Svarūpa first surrendered... ”</p>

<p>Prabhupāda cut me off. “He never surrendered!” Then he chuckled. Seeing my surprised look, he explained that they had come and made some offering of men and assets. Therefore he was trying to engage them in devotional service.</p>

<p>I asked whether our devotees should read Siddha Svarūpa’s books, because ISKCON devotees have been told that they are not bona fide.</p>

<p>Prabhupāda laughed and replied good humoredly. “We don’t take notice of what they say. We just take their money!”</p>

<p>Although between his disciples there seem to be major differences preventing cooperative action, Prabhupāda smilingly gave his own perspective on the two camps. “Of course I have affection for them. I don’t send them away, and they are coming to see me. Just like there may be so many animals; some are a little fiercer than others.” He also pointed out that they are coming to us, not us to them. Prabhupāda always refers to ISKCON as “us.” He said that there are differences, just as there are between him and his own Godbrothers, but that we share a common platform of chanting Hare Kṛṣṇa and taking <em>prasādam</em>.</p>

<p>I mentioned that in New Zealand our men discouraged Siddha Svarūpa’s people from visiting the temple. But Prabhupāda said, “Why? They can come. Our centers are only for this purpose—to chant Hare Kṛṣṇa and take <em>prasādam</em>. Gradually they will come to sense.”</p>

<p class="verse">* * *</p>

<p>Śrīla Prabhupāda sent Śatadhanya with a message to his Godbrother, Śrīdhara Swami, inviting him to come to see him here in Māyāpur. He offered to send his car.</p>

<p class="verse">* * *</p>

<p>During the evening, as the temple room reverberated with a thunderous <em>sundara-ārati kīrtana</em>, Acyutānanda Swami, Puṣṭa Kṛṣṇa Swami and I had a debate on the balcony about whether everything in the material creation is actually spirit or not.</p>

<p>Acyutānanda Swami, a witty, brilliant speaker, argued that everything is not spirit, at least not in the sense that spiritual means everything is conscious. Thinking that everything made of matter is conscious, he said, could lead to madness. You might walk around on tiptoes not wishing to hurt the floor, or you might hesitate to close the door, not wishing to hurt the door. In this way, Mahārāja spoke quite convincingly that matter is not spirit.</p>

<p>Later I went in to see Śrīla Prabhupāda to get a proper understanding. When I put the question to him, he immediately cited <em>Śrīmad-Bhāgavatam</em> 1.5.20. He had me read it aloud: “The Supreme Personality of Godhead is Himself this cosmos, and still He is aloof from it. From Him only has this cosmic manifestation emanated, in Him it rests, and unto Him it enters after annihilation. Your good self knows all about this. I have given only a synopsis.”</p>

<p>He then explained that everything is spirit, and thus everything is conscious. The material energy is conscious, but undeveloped. It can develop consciousness by Kṛṣṇa’s will. <em>Prasādam</em> is matter but changes into spirit, and it is therefore conscious.</p>

<p>He gave me an example he used a few days ago, how the body produces skin and nails: one is sensitive and the other insensitive. Cut one and you feel pain, cut the other and you feel nothing. Yet the body as a whole is conscious.</p>

<p>The entire universe is Lord Kṛṣṇa’s body and thus is conscious. <em>Jīvas</em>, the individual souls, are very minute consciousness, but there is also “mass consciousness.” If you touch a stone it is conscious, yet unconscious, or undeveloped. The term “matter” simply indicates the state of one of Lord Kṛṣṇa’s eternal spiritual potencies.</p>

<p>I left his room happy in mind and gratified in heart. This is one of the advantages of being with him personally—all doubts can be immediately resolved. As disciples, we may read Śrīla Prabhupāda’s books yet still end up speculating. But a few direct words from His Divine Grace and everything becomes clear. He always refers to a scriptural verse when asked a question and has the purport read out. It invariably explains the point perfectly. Śrīla Prabhupāda is intimately familiar with everything in each of his books, and his deep realizations enable him to answer every question to one’s complete satisfaction.</p>', '', '1976-03-04', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date,
    updated_at = now();


  -- March 5th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'March 5th, 1976', 49,
    '', '', '', '',
    '', '', '', '',
    E'<p>Prabhupāda is a reservoir of information on all topics. He has quotes and meaningful comments to make on all varieties of topics, and with just a few words he can enlighten his eager listeners on any subject. He has a clear vision of what constitutes the best qualities and attributes required by man for peaceful and successful human life. His observations on culture and education are especially penetrating. He likes to quote the great sage Cāṇakya, whose writings offer penetrating observations on the psychology of human living.</p>

<p>During his walk he told us how, according to Cāṇakya, true beauty can be understood. “Man with education is compared with the <em>kokila</em>. The bird, <em>kokila</em>, is very black, but his sound, sweet, so sweet, everyone likes. <em>Kokilanam svaro rūpām vidyā rūpām kurūpānam, nari rūpām pati-vrataḥ</em>. A woman’s beauty is how she is chaste and devoted to the husband. That is beauty, not personal beauty. Education is the beauty for the brain. And those who are saintly person, they should be simply forgiving. That is their beauty.”</p>

<p>Though simple points, when understood in the greater context of Śrīla Prabhupāda’s mission, each small aspect fits like a clear note into the harmonic melody of Kṛṣṇa conscious life. And Prabhupāda is the expert conductor, in knowledge of all the available elements, masterfully blending them together to produce a beautiful symphony on a universal scale. Every moment with him is an opportunity to learn and to advance another step toward Lord Śrī Kṛṣṇa, the ultimate goal of life.</p>

<p class="verse">* * *</p>

<p>In class Prabhupāda described the relationship of the living being with Kṛṣṇa as “responsive cooperation.” People sometimes ask, if God does not discriminate, then why are there rich and poor people in the world? The answer is that because of this responsive cooperation, however much we surrender to Kṛṣṇa, that much He returns to us.</p>

<p>He explained how there are many men, who after making <em>lakhs</em> and <em>crores</em> of rupees, retire to Vṛndāvana. They leave all their money to their wives and families, requesting them to send two hundred rupees a month “for serving God.” But this is not a good policy, he said. If we give two hundred to God, then Kṛṣṇa will give us two hundred in return. He does not discriminate. Rather we discriminate, and Kṛṣṇa reciprocates.</p>

<p>He offered himself as an example: “Just see practically. Our Kṛṣṇa consciousness movement was started with forty rupees. Now that forty rupees added with Kṛṣṇa, it has become forty <em>crores</em>. You see practically. When I started for your country, I came to Māyāpur. I offered my obeisances to my spiritual master. Then I went. At that time I had no money even to purchase the ticket. And after that, I have come with forty <em>crores</em>. This is the secret. <em>Ye yathā māà prapadyante</em>. If you fully surrender to Kṛṣṇa, then Kṛṣṇa is there.”</p>

<p class="verse">* * *</p>

<p>Bhavānanda Goswami returned today from the boat program, enthusiastic and full of wonderful stories about the response they have been receiving. Prabhupāda relished hearing about the daily programs in the villages and big receptions they got wherever they went.</p>

<p>Bhavānanda described how they simply dock the boat, perform <em>kīrtana</em>, and then walk in procession with Śrī Śrī Gaura-Nitāi. The villagers become very eager to have the party visit their homes. The devotees make it a point to sell everyone a <em>Gītār-gāna</em>, which they daily distribute by the hundreds.</p>

<p>Prabhupāda was excited at the news of the book sales. He made it clear this was the success of the party. He praised Bhavānanda that he had begun book distribution in India. He now wants 100,000 <em>Gītār-gānas</em> printed immediately.</p>

<p class="verse">* * *</p>

<p>Atreya Ṛṣi dāsa, the GBC for the Middle East, arrived from Iran. He came up to see Prabhupāda just as he began his lunch. Rather than ask him to come back later, Prabhupāda had me set a plate for Atreya by his side. He personally filled Atreya Ṛṣi’s plate with <em>prasādam</em> from his own plate, as he heard about his efforts to preach in Iran. He was very happy with Atreya and promised him all the men he needs to get things going in the Middle East.</p>

<p class="verse">* * *</p>

<p>In the evening, on the big lawn adjacent to the guest house, dozens of local villagers came and put on a whirling, exuberant display of flame throwing and stick fighting, especially for Prabhupāda’s pleasure. While some danced around in a huge circle, twirling their hard bamboo <em>lāṭhis</em> over their heads, behind their backs, and between their legs, others put on mock fights, clashing and banging their sticks together. Still others blew huge clouds of flames high into the air and lit up the night sky. Prabhupāda came out onto the balcony and watched it all for fifteen minutes, enjoying it very much.</p>

<p>Afterward all the villagers were fed sumptuous <em>prasādam</em>.</p>', '', '1976-03-05', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date,
    updated_at = now();


  -- March 6th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'March 6th, 1976', 50,
    '', '', '', '',
    '', '', '', '',
    E'<p>About 6:30 a.m. Prabhupāda went with his senior <em>sannyāsīs</em> to the Caitanya Gaudiya Math to visit Govinda Mahārāja. He was received cordially in the <em>darśana</em>-<em>maṇḍap</em>, or viewing area, at the <em>samādhi</em>, or tomb, of Śrīla Bhaktisiddhānta Sarasvatī Ṭhākura. After offering his obeisances to his Guru Mahārāja, he sat on the spacious marble floor as many members of the <em>āśrama</em> gathered around. As Govinda Mahārāja and Prabhupāda talked, delicious <em>gulabjamuns</em> were passed around to the visitors.</p>

<p>After about twenty-five minutes, Prabhupāda returned to Māyāpur Candrodaya Mandir. He was in time to greet the Deities and give his lecture on <em>Śrīmad-Bhāgavatam</em> 7.9.28.</p>

<p>In the lecture he stressed the need to hear about Kṛṣṇa consciousness from the guru, who must be a pure devotee, rather than try to approach Kṛṣṇa directly. Even Prahlāda Mahārāja, though a <em>śaktyāveśa-avātara</em>, an especially empowered representative of the Lord, felt his first duty was to serve his spiritual master. Prabhupāda said we should therefore be very careful not to mix with the <em>sahajiyās</em>, the professional men, or Vaiṣṇavas who are not well-behaved.</p>

<p class="verse">* * *</p>

<p>Large numbers of devotees are flowing in for the festival now. The rest of the GBC members arrived in one party at 9:30 this morning. They were Tamal Krishna Goswami, Madhudviṣa Mahārāja, Satsvarūpa Mahārāja, and Jayatīrtha, Rūpānuga, Jagadīśa, and Bhagavān prabhus. Only Kīrtanānanda and Brahmānanda Swami’s are missing. Prabhupāda called them all in to his room and immediately raised the <em>sannyāsī</em>/<em>gṛhastha</em> controversy. He preached to them that we must become attached to Kṛṣṇa’s family, not the material, bodily-based concept—the “stool family” or “pig family,” as he put it. <em>Sannyāsa</em> means to reject such conceptions. He said that this is wanted. Household life is a concession only. However, since our Kṛṣṇa conscious Society is based on this principle of renunciation, all Kṛṣṇa conscious persons are actually <em>sannyāsīs</em>; the outer dress doesn’t matter. Still, he said, if our householders can rise to the level of formal <em>sannyāsa</em> that should be encouraged.</p>

<p>His delivery was a perfect synthesis of the two views.</p>

<p>Śrīla Prabhupāda having set the tone, the GBCs began their annual meetings in the afternoon.</p>', '', '1976-03-06', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date,
    updated_at = now();


  -- March 7th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'March 7th, 1976', 51,
    '', '', '', '',
    '', '', '', '',
    E'<p>With all the GBC here and so many <em>sannyāsīs</em>, it is getting too crowded on the roof for Prabhupāda’s walk. So he came down and exercised around the grounds this morning.</p>

<p>As he descended the staircase I walked immediately in front of him, keeping always just two or three steps ahead, with my eye on his feet. It’s a precautionary habit I have developed since we have been here in Māyāpur. Similarly, whenever he goes up, I follow immediately behind him. This way, should he trip or slip, I can prevent him from tumbling down.</p>

<p>Prabhupāda went out to inspect the front wall on which Pāṇḍu dāsa is now painting pictures of his books. Jayapatāka Mahārāja told Prabhupāda each panel will take about five days to complete, but Prabhupāda said he isn’t concerned how long it takes, as long as it is done nicely.</p>

<p class="verse">* * *</p>

<p>Now there are several hundred devotees attending the morning program, and a real, festive air pervades our whole compound. As many <em>sannyāsīs</em> and GBCs as possible crowd into the fenced-off area around Prabhupāda’s <em>vyāsāsana</em>, and the <em>kīrtana</em>s are increasingly ecstatic. Although everyone is here to celebrate Lord Caitanya’s birthday, Śrīla Prabhupāda is the main attraction at the festival.</p>

<p>In class, he revealed a little more of the devotional psychology of Prahlāda Mahārāja. Prior to Lord Nṛsiàha’s appearance, Prahlāda always referred to Hiraṇyakaśipu as “the best of the demons.” He would never call him “father.” Prabhupāda explained that after Hiraṇyakaśipu was killed personally by the Lord, he was therefore liberated, and thus Prahlāda’s mood changed. He therefore began to refer to him as “my father.”</p>

<p>Devotees listen intently to his lectures and afterward dance and chant with tremendous energy and enthusiasm as Prabhupāda circumambulates the Deity room, vigorously ringing the bells that hang at each side of the temple room.</p>

<p class="verse">* * *</p>

<p>Prabhupāda surprised me when I entered his room at about 11 a.m. this morning to prepare for his massage. For almost half an hour he preached to me, explaining that he wants all his disciples to become gurus. Each of us is to make thousands of disciples just as he has and in this way spread Kṛṣṇa consciousness all over the world.</p>

<p>He didn’t seem to be speaking in general terms either, but directly to me. He seemed very enlivened at the prospect of spreading Kṛṣṇa consciousness in this way.</p>

<p>In the evening, when the GBC men filed into his room to make their report about their day’s meeting, he brought up the same topic, before discussing their resolutions. He asked me to explain to everyone what he had said earlier. But when I hesitated, he did it himself, repeating in brief this principle of becoming guru.</p>

<p>He told them that just as he had made thousands of disciples he wants each one of them to make ten thousand each. He encouraged them to become increasingly more qualified and rise to the position of being spiritual masters. He stressed that this can be done only if they maintain spiritual strength by strictly following the four regulative principles and chanting the prescribed number of rounds.</p>

<p>It is all dependant on enthusiasm, he told us. At seventy years he had left Vṛndāvana with no money or men, nor any facility. He had done everything simply on this principle of enthusiasm. Without directly saying it, Śrīla Prabhupāda made it clear that all internal arguments and disputes can be resolved by turning our attention to the higher ideal of preaching Kṛṣṇa consciousness to the world.</p>

<p>He then heard the report of the day’s meeting. He had previously instructed them to officially elect a Chairman and Secretary to conduct their meetings and that these posts are to be retained for one year. Tamal Krishna Goswami was chosen as the first GBC chairman and Satsvarūpa Mahārāja as the secretary.</p>

<p>Their day’s discussion focused on redefining ISKCON zones. India now has two, Europe two, America and Canada six, and South America two. In addition, there is North and South Africa, the South Seas, the Middle East, eastern Asia, and the Rādhā Dāmodara TSKP.</p>

<p>The GBC agreed to rotate some members. Hansadūta and Gopāla Kṛṣṇa prabhus will oversee India; Madhudviṣa Swami was confirmed as GBC for the East Coast of America; Jayatīrtha prabhu will shift from Los Angeles to Germany and England; Bhagavān prabhu will remain in France and the Mediterranean; and Brahmānanda Swami will remain in Africa. Rūpānuga prabhu replaces Madhudviṣa in the South Seas; Gurukṛpa Swami will go to the Northwest Coast of America and to Japan; Jagadīśa prabhu, Midwest America and Canada; while Satsvarūpa and Kīrtanānanda Swamis will retain the same zones. Hridayānanda Mahārāja is joined in South America by newly elected Paṣcadraviḍa Swami as provisional GBC; and another new member, Balavanta dāsa, got the American Southeast. Atreya Ṛṣi is the GBC for the Middle East. Rāmeśvara prabhu, who has not yet arrived, will become GBC for southern California. This was Śrīla Prabhupāda’s personal request that Rāmeśvara be added to the body.</p>

<p>New BBT Trustees were nominated, and various other business matters were completed.</p>

<p class="verse">* * *</p>

<p>A letter came today from Harikeśa Swami. It was a long, detailed, and ecstatic report of his recent and unexpected preaching trip in Hungary. He explained that when passing through London, he had met Alanātha dāsa, who was just preparing to go to Hungary in response to an invitation from a yoga school. Alanātha invited Harikeśa along, and he gladly accepted.</p>

<p>Taking books, pamphlets, posters, and instruments, the two of them met with great success. Although they were highly restricted in what they could say, the Hungarians’ reception to <em>kīrtana</em> and <em>prasādam</em> was extraordinary.</p>

<p>“I simply engaged them in kirtana and made them all kinds of nice prasadam which they went wild over,” he wrote. “The Hungarians like to eat a lot and they are so poor and have not much selection of foods, that they never had anything so nice. Milk and grains and milk products are very cheap and this is the basis of our prasadam, so I made very much and very opulently halava and puris and a drink made from whey and sometimes Simply Wonderfuls [a milk sweet], and they loved it. They could not believe how anything could taste so good. From the point of view of prasadam they became completely convinced.</p>

<p>“And what to speak of kirtana. After a short while as they learned how to chant the mantra and play karatalas, we started having kirtanas which to me seemed as good as any kirtana in any temple in the movement. They chanted and danced like real mad men and they would go on as long as I could; every night very raging hour kirtanas where at the end everyone collapsed on the floor in ecstasy and then we gave them prasadam while I chanted bhajanas, which they fell over each other to record... .</p>

<p>“It even occurred in public that although I had to always cover up the philosophy out of fear of being stopped and thrown out of the country, these people became so enlightened due to the ecstatic kirtana that they actually forced me to speak about Kṛṣṇa although they didn’t have any idea what was the force behind the chanting. I started speaking about the soul very reluctantly and I was refusing to do it, but all of a sudden out of my control, a sanskrit verse nityam sasvato ‘yam puranah etc. came out of my mouth, and they all jumped on me as if half crazed, demanding to know what was that; and I had to surrender and pray to Krsna for protection, and I started to explain everything to them. The translator became so excited that her face lighted up like a Christmas tree and she became so excited that she could no longer speak properly. It seems that this is what they have been waiting for because their lives are so very empty. But they were all afraid for us at the end because what I had said was very revolutionary.”</p>

<p>Despite the restrictions for speaking, Dely Karoly, the yoga instructor who had organized the programs, will organize outdoor <em>kīrtanas</em> and wants the devotees to return as often as possible. Included in his letter were photos of men and women dancing with upraised arms and <em>japa </em>beads around their necks. There is such a demand that he hopes to return frequently and visit Bulgaria, Romania, and East Germany in the summer.</p>

<p>He asked if he should make a recording of the chanting because, he predicted, along with <em>prasādam</em>, it would sweep the country. Harikeśa described his experience as the “most wonderful of my whole life.” He also asked if he should continue on to join the Rādhā Dāmodara party in America or remain to preach in Europe.</p>

<p>Śrīla Prabhupāda was delighted with his report. He told me, “This is needed—to travel and preach and make new devotees.”</p>

<p>After so many months of getting trained by Śrīla Prabhupāda how to defeat Marxist philosophy, it seems Kṛṣṇa has now given Harikeśa the opportunity to use it.</p>

<p>Prabhupāda replied, encouraging him to take the newly found opportunity to preach to the Communists. He approved his plans for mass <em>kīrtana</em> and <em>prasādam</em> distribution but advised him to preach very tactfully in such places. He said that printing our books can wait. “First let their hearts be cleansed by chanting Hare Krsna and taking Krsna prasadam. To take birth in such place is due to impious past, so it is not easy for them to immediately accept our philosophy.”</p>

<p>He ended by advising him to work with Kīrtirāja prabhu to introduce the <em>saṅkīrtana</em> movement to Eastern Europe.</p>

<p class="verse">* * *</p>

<p>During the evening massage, I related to Prabhupāda a story my mother had told me when I was fourteen. When I was still in the womb, an elderly relative had advised her to have an abortion. She had even given her some knitting needles with which to do it. My mother refused, burying the needles in the back yard. Another relative, however, had actually accepted a similar proposal, and they had buried the child in their backyard.</p>

<p>Śrīla Prabhupāda was shocked. He shook his head in amazement. “Now I can understand the advantage of a birth in India. People here could not even <em>dream</em> of such a thing.” Then he added, “Kṛṣṇa saved you because He knew you were a devotee.” He lamented over the unfortunate position of women in the West, who he said are encouraged by their parents to behave like prostitutes in order to capture some rich man while still youthful. He pointed out the risks they are prepared to take to become murderesses simply out of sexual urge.</p>', '', '1976-03-07', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date,
    updated_at = now();


END $$;
