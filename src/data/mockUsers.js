export const MOCK_USERS = [
  // SUPER_ADMIN - Propriétaire système
  {
    id: 1,
    email: 'admin@gestclinique.com',
    password: 'admin123',
    name: 'Alexandre Martin',
    role: 'SUPER_ADMIN',
    avatar: null,
    clinique: {
      id: 0,
      name: 'GestClinique System',
      logo: null
    },
    permissions: ['all']
  },

  // ADMIN_CLINIQUE - Directeur Clinique Centrale
  {
    id: 2,
    email: 'directeur@clinique-centrale.fr',
    password: 'directeur123',
    name: 'Dr. Marie Dupont',
    role: 'ADMIN_CLINIQUE',
    avatar: null,
    clinique: {
      id: 1,
      name: 'Clinique Centrale Paris',
      logo: null,
      address: '123 Rue de la Santé, 75001 Paris',
      phone: '+33 1 23 45 67 89'
    },
    speciality: 'Administration',
    permissions: ['manage_clinic_users', 'view_clinic_reports', 'manage_clinic_settings', 'manage_finances']
  },

  // ADMIN_CLINIQUE - Directeur Clinique du Nord
  {
    id: 3,
    email: 'directeur@clinique-nord.fr',
    password: 'directeur123',
    name: 'Dr. Jean Moreau',
    role: 'ADMIN_CLINIQUE',
    avatar: null,
    clinique: {
      id: 2,
      name: 'Clinique du Nord Lille',
      logo: null,
      address: '456 Avenue Médicale, 59000 Lille',
      phone: '+33 3 20 30 40 50'
    },
    speciality: 'Administration',
    permissions: ['manage_clinic_users', 'view_clinic_reports', 'manage_clinic_settings', 'manage_finances']
  },

  // MEDECIN - Cardiologue Clinique Centrale
  {
    id: 4,
    email: 'marie.bernard@clinique-centrale.fr',
    password: 'medecin123',
    name: 'Dr. Marie Bernard',
    role: 'MEDECIN',
    avatar: null,
    clinique: {
      id: 1,
      name: 'Clinique Centrale Paris',
      logo: null
    },
    speciality: 'Cardiologie',
    permissions: ['manage_consultations', 'generate_prescriptions', 'view_patient_files']
  },

  // MEDECIN - Généraliste Clinique du Nord
  {
    id: 5,
    email: 'pierre.martin@clinique-nord.fr',
    password: 'medecin123',
    name: 'Dr. Pierre Martin',
    role: 'MEDECIN',
    avatar: null,
    clinique: {
      id: 2,
      name: 'Clinique du Nord Lille',
      logo: null
    },
    speciality: 'Médecine générale',
    permissions: ['manage_consultations', 'generate_prescriptions', 'view_patient_files']
  },

  // MEDECIN - Pédiatre Clinique Centrale
  {
    id: 6,
    email: 'sophie.dubois@clinique-centrale.fr',
    password: 'medecin123',
    name: 'Dr. Sophie Dubois',
    role: 'MEDECIN',
    avatar: null,
    clinique: {
      id: 1,
      name: 'Clinique Centrale Paris',
      logo: null
    },
    speciality: 'Pédiatrie',
    permissions: ['manage_consultations', 'generate_prescriptions', 'view_patient_files']
  },

  // RECEPTION - Clinique Centrale
  {
    id: 7,
    email: 'reception@clinique-centrale.fr',
    password: 'reception123',
    name: 'Sophie Lefebvre',
    role: 'RECEPTION',
    avatar: null,
    clinique: {
      id: 1,
      name: 'Clinique Centrale Paris',
      logo: null
    },
    speciality: null,
    permissions: ['manage_patients', 'manage_payments', 'view_schedule']
  },

  // RECEPTION - Clinique du Nord
  {
    id: 8,
    email: 'accueil@clinique-nord.fr',
    password: 'reception123',
    name: 'Julie Moreau',
    role: 'RECEPTION',
    avatar: null,
    clinique: {
      id: 2,
      name: 'Clinique du Nord Lille',
      logo: null
    },
    speciality: null,
    permissions: ['manage_patients', 'manage_payments', 'view_schedule']
  },

  // RECEPTION - Chef Réception Clinique Centrale
  {
    id: 9,
    email: 'chef.accueil@clinique-centrale.fr',
    password: 'reception123',
    name: 'Anne Rousseau',
    role: 'RECEPTION',
    avatar: null,
    clinique: {
      id: 1,
      name: 'Clinique Centrale Paris',
      logo: null
    },
    speciality: 'Chef d\'équipe',
    permissions: ['manage_patients', 'manage_payments', 'view_schedule']
  }
];

export const findUserByCredentials = (email, password) => {
  return MOCK_USERS.find(user =>
    user.email.toLowerCase() === email.toLowerCase() &&
    user.password === password
  );
};

export const getUsersByClinic = (clinicId) => {
  return MOCK_USERS.filter(user => user.clinique.id === clinicId);
};

export const getUsersByRole = (role) => {
  return MOCK_USERS.filter(user => user.role === role);
};