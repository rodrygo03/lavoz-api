CREATE TABLE escrows (
  id          INT      NOT NULL AUTO_INCREMENT,
  projectId   INT      NOT NULL,
  studentId   INT      NOT NULL,
  localId     INT      NOT NULL,
  adminId     INT      NOT NULL,
  status      ENUM('pending','active','submitted','completed','cancelled') NOT NULL DEFAULT 'pending',
  pendingAt   DATETIME DEFAULT NULL,
  activeAt    DATETIME DEFAULT NULL,
  submittedAt DATETIME DEFAULT NULL,
  resolvedAt  DATETIME DEFAULT NULL,
  createdAt   DATETIME NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (projectId) REFERENCES projects(id),
  FOREIGN KEY (studentId) REFERENCES users(id),
  FOREIGN KEY (localId)   REFERENCES users(id),
  FOREIGN KEY (adminId)   REFERENCES users(id)
);
