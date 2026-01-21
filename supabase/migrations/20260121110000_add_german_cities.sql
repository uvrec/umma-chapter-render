-- Add German cities to calendar locations
-- Includes Würzburg and other major German cities

INSERT INTO calendar_locations (name_ua, name_en, latitude, longitude, timezone, country_code, city_ua, city_en, is_preset) VALUES
  -- Würzburg (user's location)
  ('Вюрцбург', 'Würzburg', 49.7913, 9.9534, 'Europe/Berlin', 'DE', 'Вюрцбург', 'Würzburg', true),
  -- Major German cities
  ('Берлін', 'Berlin', 52.5200, 13.4050, 'Europe/Berlin', 'DE', 'Берлін', 'Berlin', true),
  ('Мюнхен', 'Munich', 48.1351, 11.5820, 'Europe/Berlin', 'DE', 'Мюнхен', 'Munich', true),
  ('Франкфурт', 'Frankfurt', 50.1109, 8.6821, 'Europe/Berlin', 'DE', 'Франкфурт', 'Frankfurt', true),
  ('Гамбург', 'Hamburg', 53.5511, 9.9937, 'Europe/Berlin', 'DE', 'Гамбург', 'Hamburg', true),
  ('Кельн', 'Cologne', 50.9375, 6.9603, 'Europe/Berlin', 'DE', 'Кельн', 'Cologne', true),
  -- Additional European cities
  ('Прага', 'Prague', 50.0755, 14.4378, 'Europe/Prague', 'CZ', 'Прага', 'Prague', true),
  ('Відень', 'Vienna', 48.2082, 16.3738, 'Europe/Vienna', 'AT', 'Відень', 'Vienna', true)
ON CONFLICT DO NOTHING;
