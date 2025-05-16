
-- 1. 创建临时表备份数据
CREATE TABLE IF NOT EXISTS Selections_backup AS SELECT * FROM Selections;

-- 2. 删除原表
DROP TABLE IF EXISTS Selections;

-- 3. 重建正确结构的表
CREATE TABLE IF NOT EXISTS Selections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  courseId INTEGER NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id),
  FOREIGN KEY (courseId) REFERENCES Courses(id),
  UNIQUE(userId, courseId)
);

-- 4. 恢复数据
INSERT INTO Selections (userId, courseId, createdAt)
SELECT userId, courseId, createdAt FROM Selections_backup;

-- 5. 删除临时表
DROP TABLE IF EXISTS Selections_backup;
