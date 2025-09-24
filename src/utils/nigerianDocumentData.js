// src/utils/nigerianDocumentData.js

export const NIGERIAN_DOCUMENT_TYPES = {
    legal: {
      name: 'Legal Documents',
      icon: 'FaGavel',
      description: 'Court orders, birth certificates, legal guardianship papers',
      subtypes: [
        'Birth Certificate',
        'Court Placement Order',
        'Guardianship Papers',
        'Adoption Papers',
        'Legal ID Documents',
        'Affidavits',
        'Police Reports',
        'Social Welfare Reports'
      ]
    },
    medical: {
      name: 'Medical Records',
      icon: 'FaUserMd',
      description: 'Health records, medical reports, vaccination cards',
      subtypes: [
        'Medical Reports',
        'Vaccination Records',
        'Hospital Discharge Summaries',
        'Prescription Records',
        'Specialist Reports',
        'Mental Health Assessments',
        'Dental Records',
        'Vision/Hearing Tests',
        'Growth Charts',
        'Surgery Reports'
      ]
    },
    education: {
      name: 'Education Records',
      icon: 'FaGraduationCap',
      description: 'School reports, certificates, academic records',
      subtypes: [
        'School Report Cards',
        'Certificates',
        'School Admission Letters',
        'Transfer Certificates',
        'Academic Transcripts',
        'Examination Results',
        'School Fees Records',
        'Educational Assessments',
        'Behavioral Reports',
        'Extracurricular Records'
      ]
    },
    photos: {
      name: 'Photos & Images',
      icon: 'FaFileImage',
      description: 'Passport photos, family photos, identification images',
      subtypes: [
        'Passport Photos',
        'Family Photos',
        'School Photos',
        'Event Photos',
        'Progress Photos',
        'Medical Images',
        'ID Photos',
        'Certificate Photos'
      ]
    },
    personal: {
      name: 'Personal Documents',
      icon: 'FaUser',
      description: 'Personal identification, letters, personal records',
      subtypes: [
        'Personal Letters',
        'Journals/Diaries',
        'Personal Statements',
        'Identity Documents',
        'Personal History',
        'Character References',
        'Personal Belongings Inventory'
      ]
    },
    family: {
      name: 'Family Documents',
      icon: 'FaHome',
      description: 'Family history, contact information, visit records',
      subtypes: [
        'Family History Records',
        'Contact Information',
        'Visit Logs',
        'Family Photos',
        'Communication Records',
        'Family Tree Documents',
        'Relative Information',
        'Background History'
      ]
    },
    financial: {
      name: 'Financial Records',
      icon: 'FaMoneyBill',
      description: 'Allowances, sponsorship, financial assistance records',
      subtypes: [
        'Sponsorship Documents',
        'Allowance Records',
        'School Fees Receipts',
        'Medical Bills',
        'Financial Assistance Records',
        'Bank Account Information',
        'Budget Plans',
        'Expense Reports'
      ]
    },
    administrative: {
      name: 'Administrative',
      icon: 'FaClipboard',
      description: 'Internal forms, assessments, case notes',
      subtypes: [
        'Admission Forms',
        'Case Notes',
        'Assessment Reports',
        'Progress Reviews',
        'Incident Reports',
        'Staff Notes',
        'Administrative Correspondence',
        'Policy Documents'
      ]
    }
  };
  
  export const FILE_SIZE_LIMITS = {
    max_size: 10 * 1024 * 1024, // 10MB
    max_total_size: 100 * 1024 * 1024, // 100MB per child
    allowed_types: [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ],
    image_formats: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    document_formats: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
  };
  
  export const ACCESS_LEVELS = {
    public: {
      label: 'Public',
      description: 'Accessible to everyone including volunteers',
      roles: ['super_admin', 'admin', 'manager', 'staff', 'volunteer'],
      color: 'success'
    },
    general: {
      label: 'General Staff',
      description: 'Accessible to all staff members',
      roles: ['super_admin', 'admin', 'manager', 'staff'],
      color: 'primary'
    },
    medical_staff: {
      label: 'Medical Staff Only',
      description: 'Restricted to medical professionals',
      roles: ['super_admin', 'admin', 'medical_staff'],
      color: 'warning'
    },
    restricted: {
      label: 'Restricted Access',
      description: 'Admin and management only',
      roles: ['super_admin', 'admin', 'manager'],
      color: 'error'
    },
    confidential: {
      label: 'Confidential',
      description: 'Super admin access only',
      roles: ['super_admin'],
      color: 'error'
    }
  };
  
  export const DOCUMENT_RETENTION_POLICIES = {
    legal: {
      retention_period: 'permanent',
      description: 'Legal documents must be retained permanently'
    },
    medical: {
      retention_period: '25_years',
      description: 'Medical records retained for 25 years after child reaches 18'
    },
    education: {
      retention_period: '10_years',
      description: 'Education records retained for 10 years after graduation'
    },
    photos: {
      retention_period: 'permanent',
      description: 'Photos may be retained permanently with consent'
    },
    personal: {
      retention_period: '7_years',
      description: 'Personal documents retained for 7 years after exit'
    },
    family: {
      retention_period: '15_years',
      description: 'Family records retained for 15 years'
    },
    financial: {
      retention_period: '7_years',
      description: 'Financial records retained for 7 years for audit purposes'
    },
    administrative: {
      retention_period: '5_years',
      description: 'Administrative documents retained for 5 years'
    }
  };
  
  export const NIGERIAN_DOCUMENT_FORMATS = {
    birth_certificate: {
      format: 'PDF',
      required_fields: ['Full Name', 'Date of Birth', 'Place of Birth', 'Parents Names', 'Registration Number'],
      issuing_authority: 'National Population Commission (NPC)',
      validity: 'Permanent'
    },
    nin: {
      format: 'PDF/Image',
      required_fields: ['NIN Number', 'Full Name', 'Date of Birth', 'Photo'],
      issuing_authority: 'National Identity Management Commission (NIMC)',
      validity: 'Permanent'
    },
    school_certificate: {
      format: 'PDF/Image',
      required_fields: ['Student Name', 'School Name', 'Subjects', 'Grades', 'Date Issued'],
      issuing_authority: 'West African Examinations Council (WAEC) / NECO',
      validity: 'Permanent'
    },
    medical_report: {
      format: 'PDF',
      required_fields: ['Patient Name', 'Date', 'Doctor Name', 'Hospital/Clinic', 'Diagnosis', 'Treatment'],
      issuing_authority: 'Licensed Medical Practitioner',
      validity: 'As indicated by doctor'
    },
    court_order: {
      format: 'PDF',
      required_fields: ['Case Number', 'Date', 'Judge Name', 'Court', 'Order Details'],
      issuing_authority: 'Nigerian Court System',
      validity: 'As specified in order'
    }
  };
  
  export const VERIFICATION_REQUIREMENTS = {
    legal: {
      verification_needed: true,
      verification_method: 'Official stamps and signatures',
      verification_authority: 'Issuing government agency'
    },
    medical: {
      verification_needed: true,
      verification_method: 'Doctor signature and hospital stamp',
      verification_authority: 'Licensed medical practitioner'
    },
    education: {
      verification_needed: true,
      verification_method: 'School official signature and seal',
      verification_authority: 'Educational institution'
    },
    photos: {
      verification_needed: false,
      verification_method: 'Staff verification of identity',
      verification_authority: 'Internal staff'
    },
    personal: {
      verification_needed: false,
      verification_method: 'Staff review',
      verification_authority: 'Internal staff'
    },
    family: {
      verification_needed: false,
      verification_method: 'Cross-reference with other records',
      verification_authority: 'Case worker'
    },
    financial: {
      verification_needed: true,
      verification_method: 'Receipt verification',
      verification_authority: 'Finance department'
    },
    administrative: {
      verification_needed: false,
      verification_method: 'Supervisor approval',
      verification_authority: 'Department supervisor'
    }
  };