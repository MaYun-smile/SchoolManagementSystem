
const importStudents = require('./importStudents');
const importCourses = require('./importCourses');
const importGrades = require('./importGrades');

async function seed() {
  try {
    console.log('开始导入数据...');

    // 按顺序导入数据
    console.log('\n1. 导入学生数据');
    await importStudents.up();

    console.log('\n2. 导入课程数据');
    await importCourses.up();

    console.log('\n3. 导入成绩数据');
    await importGrades.up();

    console.log('\n所有数据导入完成！');
    process.exit(0);
  } catch (error) {
    console.error('导入失败:', error);
    process.exit(1);
  }
}

// 清除所有数据
async function clear() {
  try {
    console.log('开始清除数据...');

    // 按相反顺序清除数据
    console.log('\n1. 清除成绩数据');
    await importGrades.down();

    console.log('\n2. 清除课程数据');
    await importCourses.down();

    console.log('\n3. 清除学生数据');
    await importStudents.down();

    console.log('\n所有数据清除完成！');
    process.exit(0);
  } catch (error) {
    console.error('清除失败:', error);
    process.exit(1);
  }
}

// 根据命令行参数决定是导入还是清除数据
const command = process.argv[2];
if (command === 'clear') {
  clear();
} else {
  seed();
}