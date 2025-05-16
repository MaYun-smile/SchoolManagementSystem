
// 课程数据生成器
const generateCourseData = (count = 100) => {
  const courses = [];
  const teachers = ['张', '李', '王', '赵', '刘', '陈', '林', '周', '吴', '郑'];
  const buildings = ['A', 'B', 'C', 'D', 'E'];
  const weekdays = ['周一', '周二', '周三', '周四', '周五'];
  const timeSlots = [1, 2, 3, 4, 5];
  const courseTypes = [
    '计算机科学导论', '数据结构与算法', '数据库系统', 
    'Web开发技术', '人工智能基础', '机器学习', 
    '深度学习', '计算机网络', '操作系统'
  ];

  // 生成固定前缀的课程
  const fixedCourses = [
    {
      code: 'CS101',
      name: '计算机科学导论',
      teacher: '张教授',
      credit: 3,
      time: '周一 1',
      location: '教学楼A101',
      capacity: 50,
      selected: 0
    },
    // 可以添加更多固定课程...
  ];

  // 添加固定课程
  fixedCourses.forEach(course => courses.push(course));

  // 生成随机课程
  for (let i = 0; i < count - fixedCourses.length; i++) {
    const teacher = teachers[Math.floor(Math.random() * teachers.length)];
    const building = buildings[Math.floor(Math.random() * buildings.length)];
    const weekday = weekdays[Math.floor(Math.random() * weekdays.length)];
    const timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
    const courseType = courseTypes[Math.floor(Math.random() * courseTypes.length)];
    
    courses.push({
      code: `CS${200 + i}`,
      name: courseType,
      teacher: `${teacher}教授`,
      credit: Math.floor(Math.random() * 2) + 3, // 3-4学分
      time: `${weekday} ${timeSlot}`,
      location: `教学楼${building}${100 + i}`,
      capacity: Math.floor(Math.random() * 20) + 30, // 30-50人
      selected: 0
    });
  }

  // 添加毕业设计课程
  courses.push({
    code: 'CS599',
    name: '毕业设计',
    teacher: '导师',
    credit: 8,
    time: '灵活安排',
    location: '各实验室',
    capacity: 1,
    selected: 0
  });

  return courses;
};

// 导出生成的数据
module.exports = generateCourseData();

// 导出生成函数以便其他模块使用
module.exports.generate = generateCourseData;
