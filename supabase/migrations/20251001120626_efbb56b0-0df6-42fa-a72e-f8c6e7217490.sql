-- Видалити надлишкове текстове поле category
ALTER TABLE blog_posts DROP COLUMN category;

-- Зробити category_id обов'язковим
ALTER TABLE blog_posts ALTER COLUMN category_id SET NOT NULL;

-- Додати початкові категорії блогу
INSERT INTO blog_categories (name_uk, name_en, slug, description_uk, description_en) VALUES
  ('Новини', 'News', 'news', 'Новини та оголошення', 'News and announcements'),
  ('Статті', 'Articles', 'articles', 'Статті та есе', 'Articles and essays'),
  ('Лекції', 'Lectures', 'lectures', 'Лекції та проповіді', 'Lectures and sermons'),
  ('Філософія', 'Philosophy', 'philosophy', 'Філософські роздуми', 'Philosophical reflections'),
  ('Цитати', 'Quotes', 'quotes', 'Натхненні цитати', 'Inspirational quotes');