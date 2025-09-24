// src/utils/nigerianStaffData.js

export const STAFF_POSITIONS = [
    // Senior Management
    'Director',
    'Deputy Director',
    'Assistant Director',
    
    // Administration
    'Administrative Manager',
    'HR Manager',
    'Finance Manager',
    'Operations Manager',
    'Records Officer',
    'Administrative Assistant',
    'Accountant',
    'Secretary',
    
    // Child Care
    'Child Care Manager',
    'House Mother',
    'House Father',
    'Child Care Worker',
    'Youth Worker',
    'Residential Care Worker',
    
    // Medical
    'Medical Officer',
    'Nurse',
    'Medical Assistant',
    'Pharmacist',
    'Physiotherapist',
    'Counselor',
    'Psychologist',
    
    // Education
    'Education Manager',
    'Academic Coordinator',
    'Teacher',
    'Tutor',
    'Librarian',
    'Computer Instructor',
    
    // Social Work
    'Social Work Manager',
    'Senior Social Worker',
    'Social Worker',
    'Case Worker',
    'Family Liaison Officer',
    
    // Support Services
    'Security Supervisor',
    'Security Officer',
    'Driver',
    'Cook',
    'Cleaner',
    'Maintenance Officer',
    'Gardner',
    
    // Specialized
    'Legal Officer',
    'Public Relations Officer',
    'Procurement Officer',
    'IT Support Specialist',
    'Volunteer Coordinator'
  ];
  
  export const STAFF_DEPARTMENTS = [
    'Administration',
    'Childcare',
    'Medical',
    'Education',
    'Social Work',
    'Security',
    'Maintenance',
    'Finance',
    'Legal',
    'Human Resources'
  ];
  
  export const EMPLOYMENT_STATUS = [
    'Active',
    'Probation',
    'Contract',
    'Part-time',
    'On Leave',
    'Suspended',
    'Terminated',
    'Retired'
  ];
  
  export const PERFORMANCE_RATINGS = [
    'Excellent',
    'Very Good',
    'Good',
    'Fair',
    'Poor',
    'Needs Improvement'
  ];
  
  export const STAFF_ROLES = {
    super_admin: {
      label: 'Super Administrator',
      permissions: ['all'],
      description: 'Full system access and management'
    },
    admin: {
      label: 'Administrator',
      permissions: [
        'children.all',
        'staff.all',
        'reports.all',
        'documents.all',
        'settings.read',
        'medical.read',
        'education.all'
      ],
      description: 'Administrative access to most features'
    },
    manager: {
      label: 'Manager',
      permissions: [
        'children.read',
        'children.update',
        'staff.read',
        'reports.read',
        'documents.read',
        'education.read'
      ],
      description: 'Management level access'
    },
    medical_staff: {
      label: 'Medical Staff',
      permissions: [
        'children.read',
        'medical.all',
        'documents.medical',
        'reports.medical'
      ],
      description: 'Medical records and health management'
    },
    education_staff: {
      label: 'Education Staff',
      permissions: [
        'children.read',
        'education.all',
        'documents.education',
        'reports.education'
      ],
      description: 'Academic and educational management'
    },
    social_worker: {
      label: 'Social Worker',
      permissions: [
        'children.read',
        'children.update',
        'documents.read',
        'reports.read',
        'family.all'
      ],
      description: 'Child welfare and family services'
    },
    staff: {
      label: 'General Staff',
      permissions: [
        'children.read',
        'documents.read',
        'reports.read'
      ],
      description: 'Basic staff access'
    },
    volunteer: {
      label: 'Volunteer',
      permissions: [
        'children.read',
        'activities.read'
      ],
      description: 'Limited volunteer access'
    }
  };
  
  export const NIGERIAN_QUALIFICATIONS = [
    // Primary/Secondary Education
    'Primary School Certificate',
    'Junior Secondary School Certificate (JSC)',
    'Senior Secondary School Certificate (SSCE)',
    'WAEC',
    'NECO',
    'GCE O\'Level',
    'GCE A\'Level',
    
    // Tertiary Education
    'National Diploma (ND)',
    'Higher National Diploma (HND)',
    'Bachelor\'s Degree (B.A./B.Sc./B.Ed.)',
    'Master\'s Degree (M.A./M.Sc./M.Ed.)',
    'Doctorate (Ph.D.)',
    
    // Professional Qualifications
    'Chartered Accountant (ACA)',
    'Certified Public Accountant (CPA)',
    'Licensed Social Worker',
    'Registered Nurse (RN)',
    'Licensed Medical Doctor (MBBS)',
    'Licensed Teacher',
    'Barrister at Law',
    'Solicitor',
    
    // Specialized Certifications
    'Child Protection Specialist',
    'First Aid Certificate',
    'Computer Literacy Certificate',
    'Project Management Professional (PMP)',
    'Human Resources Certification',
    'Security Training Certificate'
  ];
  
  export const NIGERIAN_INSTITUTIONS = [
    // Federal Universities
    'University of Lagos (UNILAG)',
    'University of Ibadan (UI)',
    'Ahmadu Bello University (ABU)',
    'University of Nigeria, Nsukka (UNN)',
    'Obafemi Awolowo University (OAU)',
    'Federal University of Technology, Akure (FUTA)',
    'University of Benin (UNIBEN)',
    'University of Ilorin (UNILORIN)',
    'Federal University of Agriculture, Abeokuta (FUNAAB)',
    
    // State Universities
    'Lagos State University (LASU)',
    'Kaduna State University',
    'Rivers State University',
    'Ekiti State University',
    'Osun State University',
    
    // Private Universities
    'Covenant University',
    'Babcock University',
    'American University of Nigeria',
    'Bowen University',
    'Crawford University',
    
    // Polytechnics
    'Yaba College of Technology (YABATECH)',
    'Federal Polytechnic, Nekede',
    'Kaduna Polytechnic',
    'Federal Polytechnic, Auchi',
    
    // Colleges of Education
    'Federal College of Education, Akoka',
    'Adeniran Ogunsanya College of Education',
    'Emmanuel Alayande College of Education',
    
    // Professional Institutes
    'Institute of Chartered Accountants of Nigeria (ICAN)',
    'Nigerian Institute of Management (NIM)',
    'Nigerian Bar Association Law School',
    'University of Lagos College of Medicine'
  ];
  
  export const SALARY_RANGES = {
    'Director': { min: 400000, max: 800000 },
    'Deputy Director': { min: 300000, max: 600000 },
    'Assistant Director': { min: 250000, max: 500000 },
    'Manager': { min: 200000, max: 400000 },
    'Medical Officer': { min: 300000, max: 600000 },
    'Nurse': { min: 120000, max: 250000 },
    'Teacher': { min: 100000, max: 200000 },
    'Social Worker': { min: 150000, max: 300000 },
    'Administrative Assistant': { min: 80000, max: 150000 },
    'Security Officer': { min: 60000, max: 120000 },
    'Driver': { min: 50000, max: 100000 },
    'Cook': { min: 40000, max: 80000 },
    'Cleaner': { min: 30000, max: 60000 }
  };
  
  export const LEAVE_TYPES = [
    'Annual Leave',
    'Sick Leave',
    'Maternity Leave',
    'Paternity Leave',
    'Compassionate Leave',
    'Study Leave',
    'Emergency Leave',
    'Public Holiday',
    'Casual Leave'
  ];
  
  export const DISCIPLINARY_ACTIONS = [
    'Verbal Warning',
    'Written Warning',
    'Final Written Warning',
    'Suspension with Pay',
    'Suspension without Pay',
    'Demotion',
    'Transfer',
    'Termination',
    'Dismissal'
  ];
  
  export const TRAINING_CATEGORIES = [
    'Child Protection',
    'First Aid & Safety',
    'Professional Development',
    'Leadership & Management',
    'Computer Skills',
    'Communication Skills',
    'Health & Safety',
    'Legal Compliance',
    'Cultural Sensitivity',
    'Conflict Resolution'
  ];
  
  export const BACKGROUND_CHECK_TYPES = [
    'Criminal Background Check',
    'Employment History Verification',
    'Educational Qualification Verification',
    'Character Reference Check',
    'Medical Fitness Certificate',
    'Child Protection Clearance',
    'Drug Test',
    'Financial Background Check'
  ];