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


  -- December 1st, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'December 1st, 1975',
    '', '', '', '',
    '', '', '', '',
    E'<p><strong>Kurukṣetra</strong></p>

<p>At morning''s first light, Śrīla Prabhupāda and his party set out in two cars for the famous <em>tīrtha</em> of Kurukṣetra, the site where Lord Śrī Kṛṣṇa spoke the <em>Bhagavad-gītā</em> to Arjuna some five thousand years ago. Prabhupāda rode in the first car with Harikeśa, Gopāla Kṛṣṇa, and Hansadūta prabhus. Caitya-guru, Ambarīṣa, and I brought up the rear. Leaving New Delhi we drove due north for about three hours to reach our destination.</p>

<p>Kurukṣetra is still a popular pilgrimage site, as it was even thousands of years before Lord Kṛṣṇa''s appearance. It is a small town, but there are many temples. Every year, especially during an eclipse of the sun or moon, millions of pilgrims gather to bathe in the large lakes and to visit the site of the famous battle between the Pāṇḍavas and the Kurus.</p>

<p>Gulzarilal Nanda received Śrīla Prabhupāda at a nearby guest house. They took breakfast together, then Nandajī took him on a tour of the area known as Brahma-sarovara.</p>

<p>This particular site is the main pilgrimage center. It consists of a very large lake, approximately half-a-mile wide and two-thirds of a mile long. Nandajī has established a Trust called Manava Dharma for the purpose of developing the area, and to date they have spent one and half crores of rupees (about one and a half million dollars) doing this. The money has all come from government grants.</p>

<p>The lake was impressive, with exceptionally clean water. All around, at regular intervals on its shored-up banks, there were ghats for bathing, with separate enclosed facilities for women. Nandajī''s plan is to eventually create steps leading into the water along the entire length of the shoreline. Across the expanse of water we could see a line of buildings and temples on the opposite bank, one of which was a Gaudiya Matha.</p>

<p>Nandajī took Prabhupāda around to one end of the tank where he pointed out some plots of land that were available for development, as well as some land along the side of the lake. It became clear he wanted Śrīla Prabhupāda to purchase a parcel of land, although Prabhupāda would have preferred that Nandajī donate something to ISKCON. Prabhupāda didn''t appear too impressed with the offer. He inquired about the low elevation of the land and the possibility of flooding during the rainy season. All in all Prabhupāda seemed somewhat doubtful but still expressed some interest.</p>

<p>Nandajī has gathered quite a coterie of men who all glorify him and consider him a spiritual leader as well as a statesman. Around the end of the tank we noticed a large statue of Nandajī had been erected. And, as we continued our tour, his secretaries praised him constantly. Indeed, his efforts to develop the area are impressive.</p>

<p>In addition to the Brahma-sarovara development he also showed Prabhupāda a new irrigation system. This fed off a small pump station with locks constructed on a small canal running alongside Brahma-sarovara. It was designed to supply water to the entire district. Then he took Prabhupāda to a small <em>gośālā</em> and finally to a recently established Āyurvedic pharmacy. We returned to the guest house at noon.</p>

<p>As Prabhupāda took his massage in the sunny back garden, Nandajī sat in a chair and talked about his future plans for improving the area. He also expressed his ideas for strengthening the moral and spiritual lives of the Indian people, especially the young. He feels that their sense of values are being eroded away by the forces of materialism and atheism. The conversation centered on the philosophy of the <em>Bhagavad-gītā</em> as the basis for achieving positive changes. Although Nandajī began the speaking, he ended up hearing; initiating the dialogue but gradually winding down as Śrīla Prabhupāda took over.</p>

<p>The <em>Bhagavad-gītā</em>, Prabhupāda pointed out, must be properly understood and assimilated before it can be given to others. Therefore it has to be accepted exactly as Kṛṣṇa spoke it, first to the sun god Vivasvān, and then later to Arjuna here in Kurukṣetra.</p>

<p>At the mention of the sun god, Nandajī expressed some doubt as to how this should be understood. It seemed to him somewhat symbolic. But Śrīla Prabhupāda explained that Vivasvān actually exists and that everything in the <em>Gītā</em> is factual, not symbolic.</p>

<p>Nandajī leaned back as Prabhupāda elucidated the Vedic descriptions of life on other planets such as the sun and moon. He cited the statement of Lord Kṛṣṇa in the <em>Gītā</em> that the living entities are both <em>nitya</em>, eternal, and <em>sarva-gata</em>, all-pervasive. This meant, he said, that they are unaffected by any material condition and are therefore found everywhere in the universe. Śrī Kṛṣṇa specifically points out that the <em>ātmā </em>is not burnt by fire, so Kṛṣṇa''s statement that He spoke the science of <em>Bhagavad-gītā</em> to the sun god must be taken as it is, literally, and not as something symbolic.</p>

<p>At Nandajī''s prompting, Prabhupāda also described the position of the sun, the moon and other planets according to the <em>Śrīmad-Bhāgavatam</em>.</p>

<p>Apparently Nandajī had never considered that the <em>Gītā</em> should be accepted literally. Nevertheless, he continued to listen attentively as Śrīla Prabhupāda skillfully guided the discussion. Prabhupāda didn''t create a controversy, even though the subject matter could have prompted one. He kept things on the level of a pleasant tête-à-tête. He allowed his companion to reveal his position and then gradually drew him closer to the Kṛṣṇa conscious viewpoint. He encouraged Nandajī to study the <em>Gītā</em> and even suggested that, as he was now retired from politics, he should consider taking <em>sannyāsa</em> and preach the message of Kṛṣṇa full time.</p>

<p>Nandajī visibly balked at this. The very thought of entering the renounced order of life literally made him fidget in his seat. Tactfully, Prabhupāda didn''t press the point.</p>

<p>After a few minutes more Nandajī courteously took his leave, allowing Prabhupāda to bathe and eat his lunch.</p>

<p>Prabhupāda is fascinating to hear and watch, especially when dealing with persons who are prominent in the common man''s eyes. He talks with such total conviction and realization, and quotes so many references from the <em>Vedas</em>, that it is very difficult to dispute what he says.</p>

<p>Yet, mundane men in India, despite their professed attachment to the Vedic way of life and the teachings of the <em>Gītā</em>, seem to have great difficulty in accepting the <em>Vedas</em> literally. They accept only that part that fits within their own limited viewpoint and either interpret or avoid that which does not tally with their own sense of what is logical.</p>

<p>Śrīla Prabhupāda, however, never covers over the statements of Śrī Kṛṣṇa, or any Vedic authority, with speculation. He accepts the <em>Bhagavad-gītā as it is</em>. Consequently he is always very effective in changing people''s lives for the better. He has such presence, learning, and conviction, that men like Nandajī are naturally respectful. Whether they actually take his advice, though, is another matter.</p>

<p>Immediately after lunch Nandajī took Prabhupāda on a tour of Kurukṣetra University. Prabhupāda made certain that his books were left there for further examination. Then Prabhupāda returned to the guest house and said good-bye to his host. He declined to give any immediate decision on the land purchase but assured Nandajī that he would be in touch with him in the near future.</p>

<p>Śrīla Prabhupāda rested for an hour, then we prepared for our return to New Delhi. After some discussion, however, Prabhupāda decided to visit another, less developed, area of Kurukṣetra called Jyotisar. This area has not been within the focus of attention of Nandajī''s Manava Dharma Trust, although it is reputed to be the actual place where the <em>Bhagavad-gītā</em> was spoken.</p>

<p>We drove through the town, past the sites of the morning''s tour. About seven miles on, we turned off down a narrow, dusty track to an unimpressive clutch of buildings. By the side of a modest lake with curving banks we saw several small shrines. One housed a deity of Sarasvatī, and in another Kṛṣṇa stood with a conch in His right hand and <em>cakra</em> in His left.</p>

<p>But the main feature was out in the open, under the spreading arms of a large banyan tree. The tree is said to have been there since the time of the battle five thousand years ago. There, encased in a metal-and-glass house, we came upon a half-life-sized, white-marble Deity of Śrī Kṛṣṇa and Arjuna in a chariot. Arjuna was sitting cross-legged on the back of the chariot with his palms together. And Kṛṣṇa, who was painted blue, sat on the front, half-turning to Arjuna. His left hand held the reins to the four horses, and His right hand was raised, with the thumb and forefinger forming a circle in the classic <em>mudrā</em> signifying the exchange of spiritual knowledge.</p>

<p>Prabhupāda walked about and gave the entire area a thorough inspection. After ten minutes he asked us what we thought about it. Free from the previous constraints imposed by our status as guests, everyone expressed their enthusiasm. We unanimously concluded that it seemed as if this was the main pilgrimage site. We all sensed the spiritual vibrancy of the area. A deep sense of timeless wisdom and serenity seemed to permeate the atmosphere.</p>

<p>Harikeśa put it very succinctly. "The other place was like the heavenly planets, but this place is Vaikuṇṭha!"</p>

<p>Prabhupāda smiled and said that we should build a temple of Kṛṣṇa and Arjuna here. At Brahma-sarovara he suggested that another temple could be built for Kṛṣṇa, Balarāma, and Subhadrā, because They went there to bathe during the solar eclipse.</p>

<p>Caitya-guru was chosen to negotiate with Nandajī for the land. Prabhupāda also requested him to try to get land donated at Jyotisar.</p>

<p>On the way back, Prabhupāda candidly remarked about the Kurukṣetra development. "They call it <em>mānava-dharma</em> [religious actions for humanity]; I call it <em>paśu-dharma</em> [animal life]. One-and-a-half crores of rupees spent, and they erect a big statue for birds to pass stool on. But they have installed not one single Deity."</p>

<p class="verse">* * *</p>

<p>It was about nine in the evening when we arrived at No. 9 Todar Mal Lane. As he sat in his room, Prabhupāda inquired about the day''s mail. Generally, Prabhupāda''s mail is handled exclusively by his secretary. But, since Hansadūta had gone off to get something to eat at Nathu''s, Śrīla Prabhupāda sent me to the temple to collect his mail. When I handed him the letters, to my great surprise, he asked me to open them and read him the contents. It was a privilege that I eagerly although nervously accepted. Tearing open the envelopes one by one, I read out the messages. Prabhupāda also opened a few and inspected them.</p>

<p>Puṣṭa Kṛṣṇa Swami sent one from South Africa, describing his plans to purchase a Mercedes in Germany and drive it here for Prabhupāda''s use in India. One was from Kīrtirāja dāsa in Los Angeles. He is moving to Europe in order to begin preaching in Poland. Another, written by Gopīparāṇadhana dāsa, contained a translation of the first chapter of Śrīla Bhaktivinoda Ṭhākura''s work <em>Śrī Caitanya-śikṣāmṛta</em>. There were several other letters as well.</p>

<p>Just as Prabhupāda was finishing his reading, Harikeśa came in. Shocked to see me reading Prabhupāda''s mail, he proceeded to chastise me, disregarding the fact that Śrīla Prabhupāda was present right in front of us. "This is to be done only by the secretary," he said angrily, "You have no business even touching the mail!"</p>

<p>Śrīla Prabhupāda did not say a word. He merely stood and walked quietly into his bedroom to take rest. Harikeśa meanwhile continued to emphasize his point. "If Brahmānanda was still the secretary, you''d never get away with this!" He cooled off, however, when I explained that Śrīla Prabhupāda himself had asked me to read to him. Harikeśa conceded that under the circumstances I had no choice but to do it.</p>

<p>In one sense Harikeśa was right. Prabhupāda''s mail <em>is</em> private and is not to be dealt with whimsically. From Harikeśa''s point of view I am just a temporary helper, and thus I should be careful not to tread on the more exclusive domain of Śrīla Prabhupāda''s regular servants. Otherwise Prabhupāda himself will be disturbed in his daily activities.</p>

<p>Nevertheless, we both understood that, while recognizing a certain preeminence of his senior men, in the aggregate Prabhupāda doesn''t discriminate. If the right man is not around, he employs whoever is available. To him we are all his disciples in the service of Kṛṣṇa, and he engages anyone who is willing and available, according to necessity and the devotee''s own capacity.</p>

<p>Accepting my action as an innocent response to a direct request from Śrīla Prabhupāda, Harikeśa relented. Then I joined Śrīla Prabhupāda to give him his massage.</p>

<p>After a few minutes silence in the gentle darkness, as I carefully massaged his legs and feet, he softly asked me how I liked the idea of having a temple at Jyotisar.</p>

<p>I said, "Yes, it would be very nice."</p>

<p>He smiled and replied, "Yes, Kṛṣṇa spoke His <em>Bhagavad-gītā</em> there." Then he closed his eyes and went to sleep.</p>', '', '1975-12-01', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


END $$;