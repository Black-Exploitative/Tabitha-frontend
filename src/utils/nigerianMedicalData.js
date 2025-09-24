// src/utils/nigerianMedicalData.js

export const NIGERIAN_VACCINATION_SCHEDULE = {
    'Birth': ['BCG', 'OPV 0', 'HBV 1'],
    '6 weeks': ['DPT 1', 'OPV 1', 'HBV 2', 'Hib 1', 'PCV 1', 'Rota 1'],
    '10 weeks': ['DPT 2', 'OPV 2', 'Hib 2', 'PCV 2', 'Rota 2'],
    '14 weeks': ['DPT 3', 'OPV 3', 'HBV 3', 'Hib 3', 'PCV 3', 'Rota 3', 'IPV 1'],
    '6 months': ['Vitamin A 1'],
    '9 months': ['Measles 1', 'Yellow Fever', 'Vitamin A 2'],
    '12 months': ['Vitamin A 3'],
    '15 months': ['Measles 2', 'DPT Booster', 'OPV Booster'],
    '18 months': ['Vitamin A 4'],
    '24 months': ['Vitamin A 5'],
    '9-14 years (girls)': ['HPV 1', 'HPV 2']
  };
  
  export const GENOTYPE_RISKS = {
    'AA': [],
    'AS': [
      'Monitor for sickle cell crisis during illness',
      'Ensure adequate hydration',
      'Avoid extreme temperatures',
      'Regular health checkups recommended'
    ],
    'SS': [
      'High risk for sickle cell crisis',
      'Requires specialized medical care',
      'Pain management protocols needed',
      'Regular blood transfusions may be required',
      'Hydroxyurea therapy consideration'
    ],
    'AC': [
      'Generally healthy but monitor during illness',
      'Genetic counseling recommended'
    ],
    'SC': [
      'Moderate risk for complications',
      'Regular medical monitoring required',
      'Genetic counseling recommended'
    ],
    'CC': [
      'Rare genotype requiring specialized care',
      'Regular medical monitoring essential'
    ]
  };
  
  export const COMMON_MEDICAL_CONDITIONS = [
    'Malaria',
    'Upper Respiratory Infection',
    'Gastroenteritis',
    'Skin Infections',
    'Malnutrition',
    'Anemia',
    'Typhoid Fever',
    'Pneumonia',
    'Diarrheal Disease',
    'Measles',
    'Chicken Pox',
    'Worm Infestation',
    'Scabies',
    'Conjunctivitis',
    'Otitis Media',
    'Asthma',
    'Epilepsy',
    'HIV/AIDS',
    'Tuberculosis',
    'Hepatitis B'
  ];
  
  export const NIGERIAN_HOSPITALS = [
    'Lagos University Teaching Hospital (LUTH)',
    'University College Hospital (UCH), Ibadan',
    'Ahmadu Bello University Teaching Hospital, Zaria',
    'Federal Medical Centre, Abeokuta',
    'National Hospital, Abuja',
    'Jos University Teaching Hospital',
    'University of Nigeria Teaching Hospital, Enugu',
    'Federal Medical Centre, Owerri',
    'Obafemi Awolowo University Teaching Hospital',
    'Federal Teaching Hospital, Abakaliki',
    'General Hospital, Lagos',
    'Garki Hospital, Abuja',
    'Murtala Muhammed Specialist Hospital, Kano'
  ];
  
  export const MEDICAL_SPECIALTIES = [
    'Pediatrics',
    'General Practice',
    'Internal Medicine',
    'Psychiatry',
    'Dermatology',
    'Ophthalmology',
    'Orthopedics',
    'Cardiology',
    'Neurology',
    'Endocrinology',
    'Hematology',
    'Infectious Diseases',
    'Nutrition',
    'Psychology'
  ];
  
  export const NIGERIAN_HEALTH_INSURANCE = [
    'National Health Insurance Scheme (NHIS)',
    'State Health Insurance',
    'Private Health Insurance',
    'Self-Pay',
    'NGO Sponsored',
    'Government Assistance'
  ];