
// 学生数据生成器
const generateStudentData = (count = 100) => {
  const students = [];
  const firstNames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴'];
  const lastNames = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '洋'];
  const genders = ['male', 'female', 'other'];
  const majors = [
    '计算机科学', '软件工程', '人工智能', 
    '数据科学', '网络安全', '电子信息工程'
  ];
  const grades = [1, 2, 3, 4]; // 1:大一, 2:大二, 3:大三, 4:大四

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const gender = genders[Math.floor(Math.random() * genders.length)];
    const major = majors[Math.floor(Math.random() * majors.length)];
    const grade = grades[Math.floor(Math.random() * grades.length)];
    
    students.push({
      id: 20230000 + i,
      code: `STU${20230000 + i}`, // 学号字符串
      name: `${firstName}${lastName}`,
      gender,
      age: Math.floor(Math.random() * 4) + 18, // 18-22岁
      grade: grades[Math.floor(Math.random() * grades.length)],
      class: `班级${Math.floor(Math.random() * 10) + 1}`, // 添加class字段
      enrollmentDate: new Date(Date.now() - Math.floor(Math.random() * 365 * 3 * 24 * 60 * 60 * 1000)), // 过去3年内随机日期
      status: ['active', 'active', 'active', 'inactive'][Math.floor(Math.random() * 4)], // 75%活跃
      major,
      phone: `138${Math.floor(10000000 + Math.random() * 90000000)}`,
      email: `student${i}@university.edu`,
      address: `${['东', '西', '南', '北'][Math.floor(Math.random()*4)]}校区学生公寓${Math.floor(Math.random()*20)+1}栋${Math.floor(Math.random()*10)+1}室`
    });
  }

  return students;
};

// 导出生成的数据
module.exports = generateStudentData();

// 导出生成函数以便其他模块使用
module.exports.generate = generateStudentData;
