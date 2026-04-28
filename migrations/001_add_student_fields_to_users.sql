-- Adds student-specific profile fields to the users table.
-- account_type already exists; values should be: 'student', 'local', 'admin'

ALTER TABLE users
  ADD COLUMN skills       TEXT         DEFAULT NULL,
  ADD COLUMN university   VARCHAR(100) DEFAULT NULL,
  ADD COLUMN major        VARCHAR(100) DEFAULT NULL,
  ADD COLUMN grad_year    YEAR         DEFAULT NULL;
