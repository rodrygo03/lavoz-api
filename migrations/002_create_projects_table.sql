CREATE TABLE projects (
  id            INT           NOT NULL AUTO_INCREMENT,
  userId        INT           NOT NULL,
  title         VARCHAR(200)  NOT NULL,
  description   TEXT          NOT NULL,
  skills        TEXT          DEFAULT NULL,
  timeline      VARCHAR(200)  DEFAULT NULL,
  deliverables  TEXT          DEFAULT NULL,
  status        ENUM('open','closed') NOT NULL DEFAULT 'open',
  createdAt     DATETIME      NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
