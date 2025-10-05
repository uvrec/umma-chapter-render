-- Update donation page content and publish it
UPDATE pages 
SET 
  content_ua = '<h2>Допоможіть розвитку духовної освіти</h2><p>Ваша підтримка допомагає нам продовжувати роботу над перекладом та поширенням ведичних знань українською мовою. Кожна пожертва йде на розвиток проєкту.</p><h3>PayPal</h3><p>Підтримайте проєкт через PayPal: <a href="https://paypal.me/andriiuvarov" target="_blank" rel="noopener noreferrer">paypal.me/andriiuvarov</a></p>',
  content_en = '<h2>Help Develop Spiritual Education</h2><p>Your support helps us continue working on translating and spreading Vedic knowledge in Ukrainian. Every donation goes towards developing the project.</p><h3>PayPal</h3><p>Support the project via PayPal: <a href="https://paypal.me/andriiuvarov" target="_blank" rel="noopener noreferrer">paypal.me/andriiuvarov</a></p>',
  meta_description_ua = 'Підтримайте проєкт з перекладу та поширення ведичних знань українською мовою. Ваш внесок допомагає розвитку духовної освіти.',
  meta_description_en = 'Support the project of translating and spreading Vedic knowledge in Ukrainian. Your contribution helps develop spiritual education.',
  is_published = true,
  seo_keywords = 'підтримка, donation, пожертва, духовна освіта, ведичні знання',
  updated_at = now()
WHERE slug = 'donation';