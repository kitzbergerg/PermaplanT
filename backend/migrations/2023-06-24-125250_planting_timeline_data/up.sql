ALTER TABLE plantings ADD COLUMN add_date DATE;
ALTER TABLE plantings ADD COLUMN remove_date DATE;
ALTER TABLE plantings ADD COLUMN create_date DATE NOT NULL DEFAULT CURRENT_DATE;
ALTER TABLE plantings ADD COLUMN delete_date DATE;
