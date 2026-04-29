CREATE TABLE artifacts (
  id          INT          NOT NULL AUTO_INCREMENT,
  escrowId    INT          NOT NULL,
  studentId   INT          NOT NULL,
  fileUrl     VARCHAR(500) NOT NULL,
  description TEXT         DEFAULT NULL,
  createdAt   DATETIME     NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (escrowId)  REFERENCES escrows(id) ON DELETE CASCADE,
  FOREIGN KEY (studentId) REFERENCES users(id)
);
