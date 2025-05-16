
const { sequelize } = require('../src/models');
const { QueryTypes } = require('sequelize');

async function checkDuplicates() {
  try {
    const duplicates = await sequelize.query(
      `SELECT userId, courseId, COUNT(*) as count 
       FROM Selections 
       GROUP BY userId, courseId 
       HAVING count > 1`,
      { type: QueryTypes.SELECT }
    );
    
    console.log('重复的选课记录:');
    console.log(duplicates);
    
    if (duplicates.length > 0) {
      console.log('\n建议执行以下SQL清理重复数据:');
      duplicates.forEach(d => {
        console.log(
          `DELETE FROM Selections WHERE rowid NOT IN ` +
          `(SELECT MIN(rowid) FROM Selections WHERE userId = ${d.userId} AND courseId = ${d.courseId});`
        );
      });
    } else {
      console.log('没有发现重复的选课记录');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('检查重复记录时出错:', error);
    process.exit(1);
  }
}

checkDuplicates();
