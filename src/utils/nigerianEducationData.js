// src/utils/nigerianEducationData.js

export const NIGERIAN_EDUCATION_LEVELS = {
    primary: {
      'Pre-Primary': ['Nursery 1', 'Nursery 2', 'Reception'],
      'Primary': ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6']
    },
    secondary: {
      'Junior Secondary': ['JSS 1', 'JSS 2', 'JSS 3'],
      'Senior Secondary': ['SSS 1', 'SSS 2', 'SSS 3']
    },
    tertiary: {
      'Higher Education': ['ND 1', 'ND 2', 'HND 1', 'HND 2', 'University Year 1', 'University Year 2', 'University Year 3', 'University Year 4', 'University Year 5', 'University Year 6']
    }
  };
  
  export const SUBJECT_CATEGORIES = {
    core: [
      'English Language',
      'Mathematics',
      'Basic Science',
      'Social Studies',
      'Civic Education',
      'Security Education'
    ],
    languages: [
      'Yoruba Language',
      'Hausa Language',
      'Igbo Language',
      'French Language',
      'Arabic Studies'
    ],
    sciences: [
      'Physics',
      'Chemistry',
      'Biology',
      'Agricultural Science',
      'Computer Studies',
      'Further Mathematics'
    ],
    arts: [
      'Literature in English',
      'Government',
      'Economics',
      'Geography',
      'History',
      'Christian Religious Studies',
      'Islamic Religious Studies'
    ],
    vocational: [
      'Home Economics',
      'Food and Nutrition',
      'Clothing and Textiles',
      'Technical Drawing',
      'Basic Technology',
      'Business Studies',
      'Creative Arts',
      'Music',
      'Physical Education'
    ]
  };
  
  export const GRADING_SYSTEM = {
    primary: {
      'A+': { min: 90, max: 100, description: 'Excellent' },
      'A': { min: 80, max: 89, description: 'Very Good' },
      'B+': { min: 70, max: 79, description: 'Good' },
      'B': { min: 60, max: 69, description: 'Satisfactory' },
      'C': { min: 50, max: 59, description: 'Fair' },
      'D': { min: 40, max: 49, description: 'Pass' },
      'F': { min: 0, max: 39, description: 'Fail' }
    },
    secondary: {
      'A1': { min: 75, max: 100, description: 'Excellent' },
      'B2': { min: 70, max: 74, description: 'Very Good' },
      'B3': { min: 65, max: 69, description: 'Good' },
      'C4': { min: 60, max: 64, description: 'Credit' },
      'C5': { min: 55, max: 59, description: 'Credit' },
      'C6': { min: 50, max: 54, description: 'Credit' },
      'D7': { min: 45, max: 49, description: 'Pass' },
      'E8': { min: 40, max: 44, description: 'Pass' },
      'F9': { min: 0, max: 39, description: 'Fail' }
    }
  };
  
  export const NIGERIAN_SCHOOLS = [
    // Lagos State
    { name: 'St. Gregory\'s College', state: 'Lagos', type: 'Private', level: 'Secondary' },
    { name: 'Queen\'s College', state: 'Lagos', type: 'Federal', level: 'Secondary' },
    { name: 'Lagos State Model College', state: 'Lagos', type: 'Public', level: 'Secondary' },
    { name: 'Chrisland Schools', state: 'Lagos', type: 'Private', level: 'Primary & Secondary' },
    { name: 'Corona Schools', state: 'Lagos', type: 'Private', level: 'Primary & Secondary' },
    
    // Oyo State
    { name: 'University of Ibadan International School', state: 'Oyo', type: 'Private', level: 'Primary & Secondary' },
    { name: 'Loyola College', state: 'Oyo', type: 'Private', level: 'Secondary' },
    { name: 'International School Ibadan', state: 'Oyo', type: 'Private', level: 'Primary & Secondary' },
    
    // Abuja FCT
    { name: 'British Nigerian Academy', state: 'FCT', type: 'Private', level: 'Primary & Secondary' },
    { name: 'Nile University of Nigeria', state: 'FCT', type: 'Private', level: 'University' },
    { name: 'American International School', state: 'FCT', type: 'Private', level: 'Primary & Secondary' },
    
    // General Categories
    { name: 'Community Primary School', state: 'Various', type: 'Public', level: 'Primary' },
    { name: 'Local Government Secondary School', state: 'Various', type: 'Public', level: 'Secondary' },
    { name: 'Federal Government College', state: 'Various', type: 'Federal', level: 'Secondary' }
  ];
  
  export const ACADEMIC_TERMS = [
    {
      name: '1st Term',
      months: ['September', 'October', 'November', 'December'],
      start_month: 8, // September (0-indexed)
      end_month: 11    // December
    },
    {
      name: '2nd Term', 
      months: ['January', 'February', 'March', 'April'],
      start_month: 0,  // January
      end_month: 3     // April
    },
    {
      name: '3rd Term',
      months: ['May', 'June', 'July'],
      start_month: 4,  // May
      end_month: 6     // July
    }
  ];
  
  export const CAREER_PATHWAYS = {
    'Medical Doctor': {
      subjects: ['Biology', 'Chemistry', 'Physics', 'English Language', 'Mathematics'],
      education_path: ['Secondary School', 'University (6 years)', 'Internship', 'Residency'],
      description: 'Healthcare professional treating patients and diseases'
    },
    'Engineer': {
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Further Mathematics', 'Technical Drawing'],
      education_path: ['Secondary School', 'University (5 years)', 'NYSC', 'Professional Registration'],
      description: 'Designing and building systems, structures, and technologies'
    },
    'Lawyer': {
      subjects: ['English Language', 'Literature', 'Government', 'Economics', 'History'],
      education_path: ['Secondary School', 'University (5 years)', 'Law School', 'Call to Bar'],
      description: 'Legal professional representing clients and upholding justice'
    },
    'Teacher': {
      subjects: ['Education', 'Two Teaching Subjects', 'English Language', 'Mathematics'],
      education_path: ['Secondary School', 'College of Education/University (4 years)', 'Teaching Practice'],
      description: 'Educating and shaping future generations'
    },
    'Accountant': {
      subjects: ['Mathematics', 'Economics', 'Commerce', 'English Language'],
      education_path: ['Secondary School', 'University/Polytechnic', 'Professional Certification'],
      description: 'Managing financial records and providing financial advice'
    },
    'Artist': {
      subjects: ['Creative Arts', 'Fine Arts', 'English Language', 'Literature'],
      education_path: ['Secondary School', 'Art School/University', 'Portfolio Development'],
      description: 'Creating visual art and expressing creativity'
    },
    'Scientist': {
      subjects: ['Biology', 'Chemistry', 'Physics', 'Mathematics', 'English Language'],
      education_path: ['Secondary School', 'University', 'Research/Postgraduate Studies'],
      description: 'Conducting research and advancing scientific knowledge'
    }
  };
  
  export const EXTRACURRICULAR_ACTIVITIES = [
    // Academic Clubs
    'Mathematics Club',
    'Science Club',
    'English Language Society',
    'Literature Club',
    'French Club',
    'Computer Club',
    'Debate Society',
    'Quiz Competition Team',
    
    // Sports
    'Football Team',
    'Basketball Team',
    'Table Tennis',
    'Athletics (Track & Field)',
    'Swimming',
    'Volleyball',
    'Badminton',
    'Cricket',
    
    // Arts & Culture
    'Drama Club',
    'Art Club',
    'Music Club',
    'School Choir',
    'School Band',
    'Dance Group',
    'Cultural Dance',
    'Photography Club',
    
    // Community Service
    'Boys Scout/Girls Guide',
    'Red Cross Society',
    'Environmental Club',
    'Community Service Group',
    'Peer Counseling',
    'Student Council',
    'Press Club',
    'Social Work Group',
    
    // Religious
    'Christian Fellowship',
    'Islamic Society',
    'Scripture Union',
    'Prayer Group'
  ];
  
  export const BEHAVIORAL_ASSESSMENT_CRITERIA = [
    {
      category: 'Attendance & Punctuality',
      criteria: ['Regular attendance', 'Punctuality to school', 'Punctuality to classes'],
      weight: 20
    },
    {
      category: 'Academic Engagement',
      criteria: ['Class participation', 'Homework completion', 'Study habits'],
      weight: 25
    },
    {
      category: 'Social Behavior',
      criteria: ['Interaction with peers', 'Respect for others', 'Teamwork'],
      weight: 20
    },
    {
      category: 'Discipline',
      criteria: ['Following rules', 'Self-control', 'Response to correction'],
      weight: 20
    },
    {
      category: 'Leadership',
      criteria: ['Initiative taking', 'Helping others', 'Responsibility'],
      weight: 15
    }
  ];