CREATE TABLE services (
  id           INT           NOT NULL AUTO_INCREMENT,
  userId       INT           NOT NULL,
  title        VARCHAR(255)  NOT NULL,
  description  TEXT          NOT NULL,
  skills       TEXT          DEFAULT NULL,
  availability VARCHAR(255)  DEFAULT NULL,
  createdAt    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
