// 课程代码到完整名称的映射
export const COURSE_MAPPING: Record<string, string> = {
  'PSP': 'Problem Solving and Programming',
  'OOP': 'Object-Oriented Programming',
  'AOOP': 'Advanced Object-Oriented Programming',
  'SE': 'Software Engineering',
  'SAaT': 'Software Analysis and Testing',
  'HCI': 'Human-Computer Interaction',
  'DevOps': 'DevOps',
  'IPD': 'Innovative Product Development',
  'ML': 'Machine Learning',
  'SPM': 'Software Project Management',
  'DSA': 'Data Structures and Algorithms',
  'IS': 'Information Systems',
  'FCS': 'Fundamentals of Computing Science',
  'FOS': 'Foundations of Security',
  'SDCACPP': 'Software Development With C and C++',
  'SEE': 'Software Engineering Economics',
  'DB': 'Database',
  'WAD': 'Web Application Development',
  'MfC': 'Mathematics of Computing',
  'BCPCN': 'Basic Communications and PC Networking',
  'OTHER': '其他',
};

// 获取课程完整名称
export const getCourseFullName = (courseCode: string): string => {
  return COURSE_MAPPING[courseCode] || courseCode;
};

// 课程选项列表（用于下拉菜单）
export const COURSE_OPTIONS = [
  { value: 'PSP', label: 'Problem Solving and Programming' },
  { value: 'OOP', label: 'Object-Oriented Programming' },
  { value: 'AOOP', label: 'Advanced Object-Oriented Programming' },
  { value: 'SE', label: 'Software Engineering' },
  { value: 'SAaT', label: 'Software Analysis and Testing' },
  { value: 'HCI', label: 'Human-Computer Interaction' },
  { value: 'DevOps', label: 'DevOps' },
  { value: 'IPD', label: 'Innovative Product Development' },
  { value: 'ML', label: 'Machine Learning' },
  { value: 'SPM', label: 'Software Project Management' },
  { value: 'DSA', label: 'Data Structures and Algorithms' },
  { value: 'IS', label: 'Information Systems' },
  { value: 'FCS', label: 'Fundamentals of Computing Science' },
  { value: 'FOS', label: 'Foundations of Security' },
  { value: 'SDCACPP', label: 'Software Development With C and C++' },
  { value: 'SEE', label: 'Software Engineering Economics' },
  { value: 'DB', label: 'Database' },
  { value: 'WAD', label: 'Web Application Development' },
  { value: 'MfC', label: 'Mathematics of Computing' },
  { value: 'BCPCN', label: 'Basic Communications and PC Networking' },
  { value: 'OTHER', label: '其他' },
];
