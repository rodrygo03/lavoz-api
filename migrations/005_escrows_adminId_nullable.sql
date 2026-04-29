-- Local-initiated escrows have no admin, so adminId must be nullable.
ALTER TABLE escrows
  MODIFY COLUMN adminId INT DEFAULT NULL;
