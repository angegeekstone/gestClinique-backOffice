import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { patientService } from '../../services/patientService';
import { insuranceService } from '../../services/insuranceService';
import { appointmentService } from '../../services/appointmentService';
import { specialityService } from '../../services/specialityService';
import { doctorService } from '../../services/doctorService';
import ConnectionStatus from '../../components/dashboard/ConnectionStatus';
import {
  UserPlus,
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Edit3,
  Eye,
  CreditCard,
  Clock,
  User,
  AlertCircle,
  Filter,
  UserCheck,
  UserX,
  Star,
  RefreshCw,
  Plus,
  BookOpen,
  Shield,
  ChevronRight,
  Ban,
  Info,
  X,
  Save,
  Check,
  AlertTriangle,
  Clock12,
  CalendarCheck,
  ChevronDown,
  UserCheck2,
  Zap,
  ArrowRight
} from 'lucide-react';

// Données de test patients avec plus de détails pour la réception
const SAMPLE_PATIENTS = [
  {
    id: 1,
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    phone: '+33 6 12 34 56 78',
    address: '123 Rue de la Paix, 75001 Paris',
    birthDate: '1990-05-15',
    lastVisit: '2024-12-10',
    nextAppointment: '2024-12-15 14:30',
    status: 'active',
    balance: 150,
    medicalNumber: 'P001234',
    insuranceType: 'Sécurité Sociale',
    emergencyContact: 'Paul Dubois - 06 11 22 33 44',
    notes: 'Allergie aux antibiotiques',
    preferredDoctor: 'Dr. Martin',
    isVip: false,
    lastPayment: '2024-12-05',
    appointmentHistory: 12
  },
  {
    id: 2,
    name: 'Jean Martin',
    email: 'jean.martin@email.com',
    phone: '+33 6 23 45 67 89',
    address: '456 Avenue des Champs, 69002 Lyon',
    birthDate: '1978-11-22',
    lastVisit: '2024-12-08',
    nextAppointment: null,
    status: 'active',
    balance: -75,
    medicalNumber: 'P001235',
    insuranceType: 'Mutuelle',
    emergencyContact: 'Claire Martin - 06 22 33 44 55',
    notes: 'Préfère les RDV le matin',
    preferredDoctor: 'Dr. Durand',
    isVip: true,
    lastPayment: '2024-11-28',
    appointmentHistory: 25
  },
  {
    id: 3,
    name: 'Sophie Bernard',
    email: 'sophie.bernard@email.com',
    phone: '+33 6 34 56 78 90',
    address: '789 Place de la Liberté, 13001 Marseille',
    birthDate: '1985-03-08',
    lastVisit: '2024-12-12',
    nextAppointment: '2024-12-20 10:00',
    status: 'inactive',
    balance: 0,
    medicalNumber: 'P001236',
    insuranceType: 'CMU',
    emergencyContact: 'Marc Bernard - 06 33 44 55 66',
    notes: '',
    preferredDoctor: 'Dr. Martin',
    isVip: false,
    lastPayment: '2024-12-10',
    appointmentHistory: 8
  },
  {
    id: 4,
    name: 'Pierre Lefebvre',
    email: 'pierre.lefebvre@email.com',
    phone: '+33 6 45 67 89 01',
    address: '321 Boulevard Médical, 31000 Toulouse',
    birthDate: '1972-09-12',
    lastVisit: '2024-12-11',
    nextAppointment: '2024-12-18 16:00',
    status: 'active',
    balance: 250,
    medicalNumber: 'P001237',
    insuranceType: 'Sécurité Sociale',
    emergencyContact: 'Anne Lefebvre - 06 44 55 66 77',
    notes: 'Mobilité réduite - accès PMR',
    preferredDoctor: 'Dr. Durand',
    isVip: false,
    lastPayment: '2024-12-11',
    appointmentHistory: 18
  }
];

const STATUS_CONFIG = {
  active: { label: 'Actif', color: 'bg-green-100 text-green-800 border-green-200', icon: UserCheck },
  inactive: { label: 'Inactif', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: UserX },
  new: { label: 'Nouveau', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Star }
};

const FILTER_OPTIONS = [
  { value: 'all', label: 'Tous les patients' },
  { value: 'active', label: 'Actifs uniquement' },
  { value: 'inactive', label: 'Inactifs' },
  { value: 'new', label: 'Nouveaux patients' },
  { value: 'hasAppointment', label: 'Avec RDV' },
  { value: 'hasBalance', label: 'Solde à régler' }
];

// Listes des mutuelles et assurances
const MUTUELLES_LIST = [
  'Harmonie Mutuelle',
  'MGEN',
  'Mutuelle Générale',
  'MAIF',
  'GMF',
  'Mutuelle des Motards',
  'LMDE',
  'Humanis',
  'Malakoff Humanis',
  'Swiss Life',
  'Crédit Mutuel',
  'La Mutuelle Familiale',
  'Eovi Mcd',
  'April',
  'Alan',
  'Allianz',
  'AXA',
  'Groupama',
  'Macif',
  'Maif'
].sort();

const ASSURANCES_PRIVEES_LIST = [
  'Allianz France',
  'AXA France',
  'Generali France',
  'BNP Paribas Cardif',
  'Crédit Agricole Assurances',
  'Groupama',
  'Covéa (MAAF, MMA, GMF)',
  'Swiss Life France',
  'CNP Assurances',
  'Société Générale Assurances',
  'April',
  'Santéclair',
  'Alan',
  'WeMind',
  'Oliver Wyman',
  'Henner',
  'Bupa',
  'Cigna',
  'MSH International'
].sort();


export default function PatientsManager() {
  const { user, hasRole, hasPermission, PERMISSIONS } = useAuth();
  const location = useLocation();

  // Détecter le mode d'utilisation basé sur la route
  const getCurrentMode = () => {
    if (location.pathname.includes('nouveau-patient')) {
      return 'nouveau';
    } else if (location.pathname.includes('recherche')) {
      return 'recherche';
    } else {
      return 'liste';
    }
  };

  const currentMode = getCurrentMode();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // États pour les listes d'assurances
  const [mutuelles, setMutuelles] = useState([]);
  const [assurancesPrivees, setAssurancesPrivees] = useState([]);
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [showPatientDetailsModal, setShowPatientDetailsModal] = useState(false);
  const [showEditPatientModal, setShowEditPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [newPatient, setNewPatient] = useState({
    name: '',
    email: '',
    phone: '+225 ',
    address: '',
    birthDate: '',
    gender: 'OTHER',
    insuranceType: 'Sécurité Sociale',
    insuranceNumber: '',
    emergencyContactName: '',
    emergencyContactPhone: '+225 ',
    notes: '',
    preferredSpecialty: ''
  });
  const [insuranceSearch, setInsuranceSearch] = useState('');
  const [showInsuranceDropdown, setShowInsuranceDropdown] = useState(false);

  // États pour les RDV automatiques
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [suggestedSlots, setSuggestedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isBookingAppointment, setIsBookingAppointment] = useState(false);
  const [newlyCreatedPatient, setNewlyCreatedPatient] = useState(null);
  const [availableSpecialities, setAvailableSpecialities] = useState([]);
  const [isLoadingSlotsData, setIsLoadingSlotsData] = useState(false);

  // États pour le check-in patient existant
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [searchPatientTerm, setSearchPatientTerm] = useState('');
  const [foundPatients, setFoundPatients] = useState([]);
  const [selectedPatientForCheckIn, setSelectedPatientForCheckIn] = useState(null);
  const [checkInData, setCheckInData] = useState({
    consultationType: 'consultation',
    urgency: 'normal',
    notes: '',
    hasInsurance: true,
    paymentMethod: 'cash'
  });

  // État de connexion API
  const [connectionStatus, setConnectionStatus] = useState('online');

  // Vérification des permissions pour la réception
  const canCreatePatients = hasPermission(PERMISSIONS.CREATE_PATIENTS);
  const canUpdatePatientInfo = hasPermission(PERMISSIONS.UPDATE_PATIENT_INFO);
  const canViewPatientContact = hasPermission(PERMISSIONS.VIEW_PATIENT_CONTACT);

  // Charger les spécialités
  const loadSpecialities = async () => {
    try {
      const specialities = await specialityService.getAllSpecialities();
      setAvailableSpecialities(specialities);
      console.log('✅ Spécialités chargées:', specialities.length);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des spécialités:', error);
      // Fallback avec spécialités par défaut
      setAvailableSpecialities([
        { id: 1, name: 'Généraliste', description: 'Médecine générale' },
        { id: 2, name: 'Cardiologie', description: 'Spécialiste du cœur' }
      ]);
    }
  };

  // Charger les données d'assurances
  const loadInsuranceData = async () => {
    try {
      const [mutuellesData, assurancesData] = await Promise.all([
        insuranceService.getMutuelles(),
        insuranceService.getAssurancesPrivees()
      ]);

      setMutuelles(mutuellesData.filter(m => m.active));
      setAssurancesPrivees(assurancesData.filter(a => a.active));
      console.log('✅ Données d\'assurance chargées:', {
        mutuelles: mutuellesData.length,
        assurancesPrivees: assurancesData.length
      });
    } catch (error) {
      console.warn('⚠️ Erreur lors du chargement des assurances (utilisation des données statiques):', error);
      // Fallback vers les listes statiques si l'API n'est pas disponible
      setMutuelles(MUTUELLES_LIST.map((name, index) => ({ id: index, name, active: true })));
      setAssurancesPrivees(ASSURANCES_PRIVEES_LIST.map((name, index) => ({ id: index, name, active: true })));
    }
  };

  // Charger les patients depuis l'API
  const loadPatients = async () => {
    console.log('🔄 Début du chargement des patients...');
    setIsLoading(true);
    setConnectionStatus('online'); // Réinitialiser le statut avant le test

    try {
      console.log('📡 Appel API pour récupérer les patients...');
      const response = await patientService.getPatients(0, 50); // Charge 50 patients max
      console.log('📥 Réponse API reçue:', response);

      // Convertir les données API vers le format local
      // Gérer les deux formats possibles : tableau simple ou objet paginé
      const patientsData = Array.isArray(response) ? response : (response.content || []);
      console.log('📋 Données patients à traiter:', patientsData);

      const formattedPatients = patientsData.map(patient => ({
        id: patient.id,
        name: `${patient.firstName || ''} ${patient.lastName}`.trim(),
        email: patient.email,
        phone: patient.phoneNumber,
        address: patient.address,
        birthDate: patient.dateOfBirth,
        lastVisit: patient.updatedAt ? patient.updatedAt.split('T')[0] : new Date().toISOString().split('T')[0],
        nextAppointment: null, // Pas disponible dans ReceptionPatientDTO
        status: patient.isActive ? 'active' : 'inactive',
        balance: 0, // Pas disponible pour la réception
        medicalNumber: `P${String(patient.id).padStart(6, '0')}`,
        insuranceType: 'Sécurité Sociale', // Valeur par défaut
        insuranceCompany: null,
        emergencyContact: patient.emergencyContactName && patient.emergencyContactPhone
          ? `${patient.emergencyContactName} - ${patient.emergencyContactPhone}`
          : '',
        emergencyContactName: patient.emergencyContactName || '',
        emergencyContactPhone: patient.emergencyContactPhone || '',
        notes: patient.medicalHistory || '',
        medicalHistory: patient.medicalHistory || '',
        preferredSpecialty: '',
        isVip: false,
        lastPayment: null,
        appointmentHistory: 0
      }));

      setPatients(formattedPatients);
      setConnectionStatus('online');
      setErrors({}); // Effacer les erreurs précédentes
      console.log('✅ Patients chargés depuis l\'API:', formattedPatients.length);
    } catch (error) {
      console.error('Erreur lors du chargement des patients (API non disponible):', error.message);

      // Déterminer le type d'erreur pour le statut de connexion
      if (error.message.includes('403') || error.message.includes('Session expirée')) {
        setConnectionStatus('error');
        setErrors({
          general: error.message.includes('Session expirée')
            ? 'Session expirée - Redirection vers la connexion...'
            : 'Erreur d\'authentification - Veuillez vous reconnecter'
        });
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        setConnectionStatus('offline');
        setErrors({
          general: 'Backend non accessible - Vérifiez que le serveur est démarré'
        });
      } else {
        setConnectionStatus('error');
        setErrors({
          general: `Erreur API: ${error.message}`
        });
      }

      setPatients([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Charger les données au montage du composant
    loadInsuranceData();
    loadPatients();
    loadSpecialities();

    // Ouvrir automatiquement la modal en fonction du mode
    if (currentMode === 'nouveau') {
      setShowNewPatientModal(true);
    }
  }, [currentMode]);

  useEffect(() => {
    filterPatients();
  }, [searchTerm, selectedStatus, patients]);

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showInsuranceDropdown && !event.target.closest('.insurance-dropdown-container')) {
        setShowInsuranceDropdown(false);
        setInsuranceSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showInsuranceDropdown]);

  // Charger les créneaux quand le modal RDV s'ouvre
  useEffect(() => {
    if (showAppointmentModal && newlyCreatedPatient) {
      const specialtyToUse = newlyCreatedPatient.preferredSpecialty || 'Généraliste';
      console.log('🔄 Chargement des créneaux pour:', specialtyToUse);
      loadAvailableSlots(specialtyToUse);
    }
  }, [showAppointmentModal, newlyCreatedPatient, availableSpecialities]);

  const filterPatients = () => {
    let filtered = patients;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm) ||
        patient.medicalNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (selectedStatus !== 'all') {
      switch (selectedStatus) {
        case 'hasAppointment':
          filtered = filtered.filter(patient => patient.nextAppointment);
          break;
        case 'hasBalance':
          filtered = filtered.filter(patient => patient.balance !== 0);
          break;
        default:
          filtered = filtered.filter(patient => patient.status === selectedStatus);
      }
    }

    setFilteredPatients(filtered);
  };

  const getStatusInfo = (status) => {
    return STATUS_CONFIG[status] || STATUS_CONFIG.active;
  };

  const getBalanceColor = (balance) => {
    if (balance > 0) return 'text-green-600';
    if (balance < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDetailsModal(true);
  };

  // Actions des boutons
  const handleEditPatient = (patient) => {
    // Préparer les données avec les préfixes téléphoniques si nécessaires
    const patientData = {...patient};

    // Ajouter +225 au téléphone principal s'il n'existe pas
    if (patientData.phone && !patientData.phone.startsWith('+225')) {
      patientData.phone = '+225 ' + patientData.phone.replace(/^\+?225?\s*/, '');
    }

    // Ajouter +225 au téléphone du contact d'urgence s'il n'existe pas
    if (patientData.emergencyContactPhone && !patientData.emergencyContactPhone.startsWith('+225')) {
      patientData.emergencyContactPhone = '+225 ' + patientData.emergencyContactPhone.replace(/^\+?225?\s*/, '');
    }

    // S'assurer que les antécédents médicaux sont bien copiés (peut venir de 'notes' ou 'medicalHistory')
    if (!patientData.medicalHistory && patientData.notes) {
      patientData.medicalHistory = patientData.notes;
    }

    // Debug : afficher les données du contact d'urgence et antécédents
    console.log('🔍 Debug données patient:', {
      emergencyContact: patientData.emergencyContact,
      emergencyContactName: patientData.emergencyContactName,
      emergencyContactPhone: patientData.emergencyContactPhone,
      notes: patientData.notes,
      medicalHistory: patientData.medicalHistory
    });

    // Extraire le contact d'urgence s'il est au format "Nom - Téléphone" et qu'on n'a pas les champs séparés
    if (patientData.emergencyContact && (!patientData.emergencyContactName || !patientData.emergencyContactPhone)) {
      const parts = patientData.emergencyContact.split(' - ');
      if (parts.length === 2) {
        if (!patientData.emergencyContactName) {
          patientData.emergencyContactName = parts[0].trim();
        }
        if (!patientData.emergencyContactPhone) {
          const phone = parts[1].trim();
          patientData.emergencyContactPhone = phone.startsWith('+225') ? phone : '+225 ' + phone.replace(/^\+?225?\s*/, '');
        }
      }
    }

    // S'assurer qu'on a au moins les champs séparés même si emergencyContact existe
    if (patientData.emergencyContact && !patientData.emergencyContactName && !patientData.emergencyContactPhone) {
      // Essayer de parser même sans le délimiteur " - "
      const contactText = patientData.emergencyContact.trim();
      // Si ça ressemble à "Nom Prénom 07 XX XX XX XX", on essaie de séparer
      const phoneMatch = contactText.match(/(.+?)(\+?225?\s*\d{2}\s*\d{2}\s*\d{2}\s*\d{2}\s*\d{2})$/);
      if (phoneMatch) {
        patientData.emergencyContactName = phoneMatch[1].trim();
        const phone = phoneMatch[2].trim();
        patientData.emergencyContactPhone = phone.startsWith('+225') ? phone : '+225 ' + phone.replace(/^\+?225?\s*/, '');
      }
    }

    console.log('✅ Après parsing:', {
      emergencyContactName: patientData.emergencyContactName,
      emergencyContactPhone: patientData.emergencyContactPhone,
      medicalHistory: patientData.medicalHistory,
      notes: patientData.notes
    });

    setEditingPatient(patientData);
    setShowEditPatientModal(true);
    setErrors({});
  };

  // Validation du formulaire de modification patient
  const validateEditingPatient = () => {
    const newErrors = {};

    if (!editingPatient.name?.trim()) {
      newErrors.name = 'Le nom est obligatoire';
    }

    if (!editingPatient.phone?.trim()) {
      newErrors.phone = 'Le téléphone est obligatoire';
    } else if (!validatePhoneNumber(editingPatient.phone)) {
      newErrors.phone = 'Le téléphone doit contenir exactement 10 chiffres après +225';
    }

    if (!editingPatient.email?.trim()) {
      newErrors.email = 'L\'email est obligatoire';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editingPatient.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!editingPatient.birthDate) {
      newErrors.birthDate = 'La date de naissance est obligatoire';
    }

    if (!editingPatient.address?.trim()) {
      newErrors.address = 'L\'adresse est obligatoire';
    }

    if (!editingPatient.emergencyContactName?.trim()) {
      newErrors.emergencyContactName = 'Le nom du contact d\'urgence est obligatoire';
    }

    if (!editingPatient.emergencyContactPhone?.trim()) {
      newErrors.emergencyContactPhone = 'Le téléphone du contact d\'urgence est obligatoire';
    } else if (!validatePhoneNumber(editingPatient.emergencyContactPhone)) {
      newErrors.emergencyContactPhone = 'Le téléphone doit contenir exactement 10 chiffres après +225';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Mise à jour du patient
  const handleUpdatePatient = async () => {
    if (!validateEditingPatient()) {
      return;
    }

    setIsSaving(true);
    try {
      const patientData = {
        firstName: editingPatient.name?.split(' ')[0] || '',
        lastName: editingPatient.name?.split(' ').slice(1).join(' ') || '',
        email: editingPatient.email,
        phoneNumber: editingPatient.phone,
        address: editingPatient.address,
        dateOfBirth: editingPatient.birthDate,
        gender: editingPatient.gender || 'MALE',
        emergencyContactName: editingPatient.emergencyContactName,
        emergencyContactPhone: editingPatient.emergencyContactPhone,
        medicalHistory: editingPatient.medicalHistory || '',
        isActive: editingPatient.status === 'active'
      };

      const updatedPatient = await patientService.updatePatient(editingPatient.id, patientData);

      // Mettre à jour la liste des patients
      setPatients(prev => prev.map(p =>
        p.id === editingPatient.id
          ? { ...p, ...updatedPatient, name: `${updatedPatient.firstName} ${updatedPatient.lastName}` }
          : p
      ));

      setShowEditPatientModal(false);
      setEditingPatient(null);
      setErrors({});

      // Recharger les patients pour avoir les données à jour
      loadPatients();

    } catch (error) {
      console.error('Erreur lors de la mise à jour du patient:', error);

      if (error.message.includes('403')) {
        setConnectionStatus('error');
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        setConnectionStatus('offline');
      }

      setErrors({
        general: error.message || 'Erreur lors de la mise à jour du patient. Veuillez réessayer.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePatientPayment = (patient) => {
    console.log('Paiement pour patient:', patient);
    // TODO: Ouvrir modal de paiement
    alert('Fonctionnalité de paiement en cours de développement');
  };

  // Génération automatique du numéro patient
  const generatePatientNumber = () => {
    const maxId = Math.max(...patients.map(p => p.id), 0);
    return `P${String(maxId + 1).padStart(6, '0')}`;
  };

  // Validation du formulaire nouveau patient
  const validateNewPatient = () => {
    const newErrors = {};

    if (!newPatient.name.trim()) {
      newErrors.name = 'Le nom est obligatoire';
    }

    if (!newPatient.phone.trim()) {
      newErrors.phone = 'Le téléphone est obligatoire';
    } else if (!validatePhoneNumber(newPatient.phone)) {
      newErrors.phone = 'Le téléphone doit contenir exactement 10 chiffres après +225';
    }

    if (!newPatient.email.trim()) {
      newErrors.email = 'L\'email est obligatoire';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newPatient.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!newPatient.birthDate) {
      newErrors.birthDate = 'La date de naissance est obligatoire';
    }

    if (!newPatient.address.trim()) {
      newErrors.address = 'L\'adresse est obligatoire';
    }

    if (!newPatient.emergencyContactName.trim()) {
      newErrors.emergencyContactName = 'Le nom du contact d\'urgence est obligatoire';
    }

    if (!newPatient.emergencyContactPhone.trim()) {
      newErrors.emergencyContactPhone = 'Le téléphone du contact d\'urgence est obligatoire';
    } else if (!validatePhoneNumber(newPatient.emergencyContactPhone)) {
      newErrors.emergencyContactPhone = 'Le téléphone d\'urgence doit contenir exactement 10 chiffres après +225';
    }

    // Validation du numéro d'assurance
    if (newPatient.insuranceType !== 'Autre' && !newPatient.insuranceNumber.trim()) {
      newErrors.insuranceNumber = 'Le numéro d\'assurance est obligatoire pour ce type d\'assurance';
    } else if (newPatient.insuranceNumber.trim()) {
      // Validation spécifique selon le type
      const insuranceNumber = newPatient.insuranceNumber.trim();

      if (newPatient.insuranceType === 'Sécurité Sociale') {
        if (!/^[0-9]{13}$/.test(insuranceNumber)) {
          newErrors.insuranceNumber = 'Le numéro de sécurité sociale doit contenir 13 chiffres';
        }
      } else if (newPatient.insuranceType === 'CMU') {
        if (!/^[A-Z0-9]{6,15}$/.test(insuranceNumber)) {
          newErrors.insuranceNumber = 'Le numéro CMU doit contenir entre 6 et 15 caractères alphanumériques';
        }
      } else if (newPatient.insuranceType === 'Mutuelle' || newPatient.insuranceType === 'Assurance privée') {
        if (!/^[A-Z0-9]{3,20}$/.test(insuranceNumber)) {
          newErrors.insuranceNumber = 'Le numéro doit contenir entre 3 et 20 caractères alphanumériques';
        }
      }
    }

    // Vérification des doublons
    const duplicatePhone = patients.find(p => p.phone === newPatient.phone);
    if (duplicatePhone) {
      newErrors.phone = 'Un patient avec ce numéro existe déjà';
    }

    const duplicateEmail = patients.find(p => p.email.toLowerCase() === newPatient.email.toLowerCase());
    if (duplicateEmail) {
      newErrors.email = 'Un patient avec cet email existe déjà';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Sauvegarde du nouveau patient
  const handleSaveNewPatient = async () => {
    if (!validateNewPatient()) {
      return;
    }

    setIsSaving(true);
    try {
      // Extraire prénom et nom du nom complet
      const nameParts = newPatient.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || nameParts[0];

      // Utiliser directement les champs séparés du contact d'urgence
      const emergencyContactName = newPatient.emergencyContactName.trim();
      const emergencyContactPhone = newPatient.emergencyContactPhone.trim();

      // Préparer les données pour l'API
      const patientData = {
        firstName: firstName,
        lastName: lastName,
        email: newPatient.email.trim().toLowerCase(),
        phoneNumber: newPatient.phone.trim(),
        address: newPatient.address.trim(),
        dateOfBirth: newPatient.birthDate,
        gender: newPatient.gender,
        emergencyContactName: emergencyContactName,
        emergencyContactPhone: emergencyContactPhone,
        medicalHistory: newPatient.notes.trim(),
        insuranceType: newPatient.insuranceType,
        insuranceNumber: newPatient.insuranceNumber.trim(),
        isActive: true
      };

      // Appel API pour créer le patient
      const createdPatient = await patientService.createPatient(patientData);

      // Convertir la réponse API vers le format local pour l'affichage
      const patientToAdd = {
        id: createdPatient.id,
        name: `${createdPatient.firstName || ''} ${createdPatient.lastName}`.trim(),
        email: createdPatient.email,
        phone: createdPatient.phoneNumber,
        address: createdPatient.address,
        birthDate: createdPatient.dateOfBirth,
        lastVisit: new Date().toISOString().split('T')[0],
        nextAppointment: null,
        status: 'new',
        balance: 0,
        medicalNumber: `P${String(createdPatient.id).padStart(6, '0')}`,
        insuranceType: newPatient.insuranceType, // Garder depuis le form car pas retourné par l'API
        insuranceNumber: newPatient.insuranceNumber,
        insuranceCompany: newPatient.insuranceCompany,
        emergencyContact: `${createdPatient.emergencyContactName || ''} - ${createdPatient.emergencyContactPhone || ''}`.replace(' - ', '').trim(),
        notes: createdPatient.medicalHistory || '',
        preferredSpecialty: newPatient.preferredSpecialty,
        isVip: false,
        lastPayment: null,
        appointmentHistory: 0
      };

      setPatients(prev => [patientToAdd, ...prev]);
      setNewlyCreatedPatient(patientToAdd);
      setShowNewPatientModal(false);
      resetNewPatientForm();

      // Chargement automatique des créneaux via API
      const specialtyToUse = patientToAdd.preferredSpecialty || 'Généraliste';
      console.log('🔄 Chargement des créneaux pour:', specialtyToUse);

      // Déclencher le chargement des créneaux qui ouvrira automatiquement le modal
      setShowAppointmentModal(true);

      console.log('Patient créé avec succès:', createdPatient);

    } catch (error) {
      console.error('Erreur lors de la création du patient:', error);

      // Mettre à jour le statut de connexion selon l'erreur
      if (error.message.includes('403')) {
        setConnectionStatus('error');
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        setConnectionStatus('offline');
      }

      // Afficher l'erreur à l'utilisateur
      setErrors({
        general: error.message || 'Erreur lors de la création du patient. Veuillez réessayer.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Charger les créneaux disponibles pour une spécialité
  const loadAvailableSlots = async (specialityName) => {
    setIsLoadingSlotsData(true);
    try {
      // Trouver l'ID de la spécialité
      const speciality = availableSpecialities.find(s =>
        s.name.toLowerCase() === specialityName.toLowerCase()
      );

      if (!speciality) {
        console.warn('Spécialité non trouvée:', specialityName);
        setSuggestedSlots([]);
        return;
      }

      // Récupérer les médecins de cette spécialité
      const doctors = await doctorService.getDoctorsBySpeciality(speciality.id);
      console.log('Médecins trouvés:', doctors);

      // Récupérer les créneaux disponibles pour chaque médecin
      const allSlots = [];
      for (const doctor of doctors) {
        const slots = await doctorService.getAvailableSlots(doctor.id);
        allSlots.push(...slots);
      }

      // Trier par charge du médecin (moins chargé en premier)
      const sortedSlots = allSlots.sort((a, b) => {
        const loadA = a.load / a.doctor.maxLoad;
        const loadB = b.load / b.doctor.maxLoad;
        return loadA - loadB;
      });

      // Limiter aux 6 premiers créneaux
      setSuggestedSlots(sortedSlots.slice(0, 6));
      console.log('✅ Créneaux chargés:', sortedSlots.length);

    } catch (error) {
      console.error('❌ Erreur lors du chargement des créneaux:', error);
      setSuggestedSlots([]);
    } finally {
      setIsLoadingSlotsData(false);
    }
  };

  // Reset du formulaire
  const resetNewPatientForm = () => {
    setNewPatient({
      name: '',
      email: '',
      phone: '+225 ',
      address: '',
      birthDate: '',
      gender: 'OTHER',
      insuranceType: 'Sécurité Sociale',
      insuranceNumber: '',
      emergencyContactName: '',
      emergencyContactPhone: '+225 ',
      notes: '',
      preferredSpecialty: ''
    });
    setErrors({});
  };

  // Fonction pour réserver un créneau de RDV
  const handleBookAppointment = async () => {
    if (!selectedSlot || !newlyCreatedPatient) {
      console.error('Pas de créneau sélectionné ou de patient');
      return;
    }

    setIsBookingAppointment(true);
    try {
      // Préparer les données du RDV
      const appointmentData = {
        patientId: newlyCreatedPatient.id,
        doctorId: selectedSlot.doctor.id,
        appointmentDateTime: `${selectedSlot.date}T${selectedSlot.time}:00`,
        appointmentType: 'CONSULTATION',
        status: 'SCHEDULED',
        notes: `RDV créé automatiquement après création du patient ${newlyCreatedPatient.name}`,
        duration: selectedSlot.duration || 30
      };

      console.log('📅 Création du RDV:', appointmentData);

      // Appeler l'API pour créer le RDV
      const createdAppointment = await appointmentService.createAppointment(appointmentData);

      console.log('✅ RDV créé avec succès:', createdAppointment);

      // Fermer le modal et nettoyer les états
      setShowAppointmentModal(false);
      setNewlyCreatedPatient(null);
      setSuggestedSlots([]);
      setSelectedSlot(null);

      // Afficher un message de succès (vous pourriez utiliser un toast/notification ici)
      alert(`RDV programmé avec succès!\n\nPatient: ${newlyCreatedPatient.name}\nMédecin: ${selectedSlot.doctor.name}\nDate: ${selectedSlot.date} à ${selectedSlot.time}`);

    } catch (error) {
      console.error('❌ Erreur lors de la création du RDV:', error);

      // Afficher l'erreur à l'utilisateur
      let errorMessage = 'Erreur lors de la création du rendez-vous.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(`Erreur: ${errorMessage}`);
    } finally {
      setIsBookingAppointment(false);
    }
  };

  // Fermeture du modal
  const handleCloseNewPatientModal = () => {
    setShowNewPatientModal(false);
    resetNewPatientForm();
    setInsuranceSearch('');
    setShowInsuranceDropdown(false);
  };

  // Gestion des changements dans le formulaire
  // Format phone number with +225 prefix and validate 10 digits
  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');

    // If it starts with 225, remove it to avoid duplication
    const cleanDigits = digits.startsWith('225') ? digits.substring(3) : digits;

    // Limit to 10 digits
    const limitedDigits = cleanDigits.substring(0, 10);

    // Format as +225 XX XX XX XX XX
    if (limitedDigits.length === 0) {
      return '+225 ';
    } else if (limitedDigits.length <= 2) {
      return `+225 ${limitedDigits}`;
    } else if (limitedDigits.length <= 4) {
      return `+225 ${limitedDigits.substring(0, 2)} ${limitedDigits.substring(2)}`;
    } else if (limitedDigits.length <= 6) {
      return `+225 ${limitedDigits.substring(0, 2)} ${limitedDigits.substring(2, 4)} ${limitedDigits.substring(4)}`;
    } else if (limitedDigits.length <= 8) {
      return `+225 ${limitedDigits.substring(0, 2)} ${limitedDigits.substring(2, 4)} ${limitedDigits.substring(4, 6)} ${limitedDigits.substring(6)}`;
    } else {
      return `+225 ${limitedDigits.substring(0, 2)} ${limitedDigits.substring(2, 4)} ${limitedDigits.substring(4, 6)} ${limitedDigits.substring(6, 8)} ${limitedDigits.substring(8)}`;
    }
  };

  // Validate phone number has exactly 10 digits after +225
  const validatePhoneNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    const phoneDigits = digits.startsWith('225') ? digits.substring(3) : digits;
    return phoneDigits.length === 10;
  };


  const handleNewPatientChange = (field, value) => {
    let processedValue = value;

    // Handle phone number formatting
    if (field === 'phone' || field === 'emergencyContactPhone') {
      processedValue = formatPhoneNumber(value);
    }

    setNewPatient(prev => ({ ...prev, [field]: processedValue }));

    // Supprimer l'erreur si le champ devient valide
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Obtenir la liste des compagnies selon le type d'assurance
  const getInsuranceCompanies = () => {
    switch (newPatient.insuranceType) {
      case 'Mutuelle':
        return mutuelles.map(m => m.name);
      case 'Assurance privée':
        return assurancesPrivees.map(a => a.name);
      default:
        return [];
    }
  };

  // Filtrer les compagnies selon la recherche
  const getFilteredCompanies = () => {
    const companies = getInsuranceCompanies();
    if (!insuranceSearch.trim()) {
      return companies;
    }
    return companies.filter(company =>
      company.toLowerCase().includes(insuranceSearch.toLowerCase())
    );
  };

  // Gérer la sélection d'une compagnie
  const handleInsuranceCompanySelect = (company) => {
    setNewPatient(prev => ({ ...prev, insuranceCompany: company }));
    setInsuranceSearch('');
    setShowInsuranceDropdown(false);
  };

  // Vérifier si un champ de compagnie est requis
  const isInsuranceCompanyRequired = () => {
    return newPatient.insuranceType === 'Mutuelle' || newPatient.insuranceType === 'Assurance privée';
  };

  // ===== LOGIQUE RDV AUTOMATIQUES =====

  // Obtenir le jour de la semaine en anglais
  const getDayName = (date) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  };

  // Réserver un créneau via API
  const bookAppointment = async (slot, patient) => {
    setIsBookingAppointment(true);

    try {
      const appointmentData = {
        patientId: patient.id,
        doctorId: slot.doctor.id,
        appointmentDate: slot.datetime.toISOString(),
        duration: slot.duration || 30,
        reason: 'Consultation'
      };

      const response = await api.post('/reception/appointments', appointmentData);

      console.log('RDV créé avec succès:', {
        patient: patient.name,
        doctor: slot.doctor.name,
        datetime: slot.datetime,
        specialty: slot.doctor.specialty
      });

      // Actualiser la liste des patients
      loadPatients();

      return true;
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      return false;
    } finally {
      setIsBookingAppointment(false);
    }
  };

  // ===== FONCTIONS CHECK-IN PATIENT EXISTANT =====

  // Recherche de patients existants
  const searchExistingPatients = (term) => {
    if (!term || term.length < 2) {
      setFoundPatients([]);
      return;
    }

    const searchTerm = term.toLowerCase().trim();
    const matches = patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm) ||
      patient.phone.includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchTerm) ||
      patient.medicalNumber.toLowerCase().includes(searchTerm)
    );

    setFoundPatients(matches.slice(0, 8)); // Limiter à 8 résultats
  };

  // Check-in d'un patient existant
  const handlePatientCheckIn = async () => {
    if (!selectedPatientForCheckIn) return;

    setIsSaving(true);
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mettre à jour le patient avec les infos de check-in
      const updatedPatients = patients.map(p =>
        p.id === selectedPatientForCheckIn.id
          ? {
              ...p,
              lastVisit: new Date().toISOString().split('T')[0],
              status: 'active',
              notes: checkInData.notes ? `${p.notes || ''}\n[${new Date().toLocaleDateString('fr-FR')}] ${checkInData.notes}`.trim() : p.notes
            }
          : p
      );

      setPatients(updatedPatients);

      // Charger les créneaux pour une consultation si nécessaire
      if (checkInData.consultationType === 'consultation') {
        const specialtyToUse = selectedPatientForCheckIn.preferredSpecialty || 'Généraliste';
        console.log('🔄 Chargement des créneaux pour consultation:', specialtyToUse);

        setNewlyCreatedPatient(selectedPatientForCheckIn);
        setShowAppointmentModal(true);
      }

      // Fermer le modal de check-in
      setShowCheckInModal(false);
      resetCheckInForm();

      console.log('Check-in réussi pour:', selectedPatientForCheckIn.name);

    } catch (error) {
      console.error('Erreur lors du check-in:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset du formulaire de check-in
  const resetCheckInForm = () => {
    setSearchPatientTerm('');
    setFoundPatients([]);
    setSelectedPatientForCheckIn(null);
    setCheckInData({
      consultationType: 'consultation',
      urgency: 'normal',
      notes: '',
      hasInsurance: true,
      paymentMethod: 'cash'
    });
  };

  // Fermeture du modal de check-in
  const handleCloseCheckInModal = () => {
    setShowCheckInModal(false);
    resetCheckInForm();
  };


  // Vérification des permissions d'accès
  if (!hasRole('RECEPTION') && !hasRole('ADMIN_CLINIQUE') && !hasRole('MEDECIN')) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-900 mb-2">Accès non autorisé</h2>
          <p className="text-red-700">Vous n'avez pas les permissions nécessaires pour accéder à la gestion des patients.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900">
              {currentMode === 'nouveau' && 'Nouveau Patient'}
              {currentMode === 'recherche' && 'Recherche de Patients'}
              {currentMode === 'liste' && 'Gestion des Patients'}
            </h1>
            <ConnectionStatus status={connectionStatus} isRefreshing={isLoading} />
          </div>
          <p className="text-gray-600 mt-1">
            {currentMode === 'nouveau' && 'Créer un nouveau dossier patient'}
            {currentMode === 'recherche' && 'Rechercher et filtrer les patients'}
            {currentMode === 'liste' && (hasRole('RECEPTION') ? 'Interface réception - Accueil et contact patients' : 'Vue complète des patients')}
          </p>
        </div>

        {currentMode !== 'nouveau' && (
          <div className="flex space-x-3">
            <button
              onClick={() => setShowCheckInModal(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <UserCheck2 className="w-4 h-4 mr-2" />
              Patient Existant
            </button>
            {canCreatePatients && (
              <button
                onClick={() => setShowNewPatientModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Nouveau Patient
              </button>
            )}
          </div>
        )}
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
            </div>
            <User className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">RDV Aujourd'hui</p>
              <p className="text-2xl font-bold text-gray-900">
                {patients.filter(p => p.nextAppointment && new Date(p.nextAppointment).toDateString() === new Date().toDateString()).length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Patients Actifs</p>
              <p className="text-2xl font-bold text-gray-900">
                {patients.filter(p => p.status === 'active').length}
              </p>
            </div>
            <UserCheck className="w-8 h-8 text-emerald-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Soldes en attente</p>
              <p className="text-2xl font-bold text-gray-900">
                {patients.filter(p => p.balance !== 0).length}
              </p>
            </div>
            <CreditCard className="w-8 h-8 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      {currentMode !== 'nouveau' && (
      <div className={`bg-white rounded-lg border p-6 mb-6 ${
        currentMode === 'recherche' ? 'border-purple-200 ring-2 ring-purple-100' : 'border-gray-200'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Barre de recherche */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Nom, téléphone, email ou numéro patient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtre */}
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {FILTER_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              onClick={loadPatients}
              disabled={isLoading}
              className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Liste des patients - Tableau */}
      {currentMode !== 'nouveau' && (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Liste des patients ({filteredPatients.length})
          </h3>
          {/* Debug info */}
          <p className="text-xs text-gray-500 mt-1">
            Total: {patients.length} | Filtrés: {filteredPatients.length}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Chargement des patients...</p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {errors.general ? 'Erreur de connexion API' : 'Aucun patient trouvé'}
            </h3>
            <p className="text-gray-500">
              {errors.general
                ? 'Vérifiez que le backend est démarré et accessible.'
                : (searchTerm || selectedStatus !== 'all'
                  ? 'Essayez de modifier vos critères de recherche.'
                  : 'Commencez par ajouter votre premier patient.')
              }
            </p>
            {errors.general && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernière visite
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prochain RDV
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Solde
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map((patient) => {
                  const statusInfo = getStatusInfo(patient.status);
                  const StatusIcon = statusInfo.icon;
                  const age = calculateAge(patient.birthDate);

                  return (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">
                                {patient.name}
                              </div>
                              {patient.isVip && (
                                <Star className="ml-2 h-4 w-4 text-yellow-500 fill-current" />
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              {patient.medicalNumber} • {age} ans
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{patient.phone}</div>
                        <div className="text-sm text-gray-500">{patient.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                          {new Date(patient.lastVisit).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {patient.nextAppointment ? (
                          <div className="flex items-center text-blue-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(patient.nextAppointment).toLocaleDateString('fr-FR')}
                          </div>
                        ) : (
                          <span className="text-gray-400">Aucun</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getBalanceColor(patient.balance)}`}>
                          {patient.balance !== 0 ? `${patient.balance > 0 ? '+' : ''}${patient.balance} CFA` : '0 CFA'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handlePatientSelect(patient)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Voir détails"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {canUpdatePatientInfo && (
                            <button
                              onClick={() => handleEditPatient(patient)}
                              className="text-gray-600 hover:text-gray-900 transition-colors"
                              title="Modifier"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handlePatientPayment(patient)}
                            className="text-green-600 hover:text-green-900 transition-colors"
                            title="Paiement"
                          >
                            <CreditCard className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )}

      {/* Modal Nouveau Patient */}
      {showNewPatientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header du modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Nouveau Patient</h2>
                  <p className="text-sm text-gray-600">Créer un nouveau dossier patient</p>
                </div>
              </div>
              <button
                onClick={handleCloseNewPatientModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isSaving}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Corps du modal */}
            <div className="p-6 space-y-6">
              {/* Erreur générale */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                    <p className="text-sm text-red-700">{errors.general}</p>
                  </div>
                </div>
              )}
              {/* Informations personnelles */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-gray-600" />
                  Informations personnelles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      value={newPatient.name}
                      onChange={(e) => handleNewPatientChange('name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Prénom NOM"
                      disabled={isSaving}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de naissance *
                    </label>
                    <input
                      type="date"
                      value={newPatient.birthDate}
                      onChange={(e) => handleNewPatientChange('birthDate', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.birthDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      disabled={isSaving}
                    />
                    {errors.birthDate && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        {errors.birthDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sexe
                    </label>
                    <select
                      value={newPatient.gender}
                      onChange={(e) => handleNewPatientChange('gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isSaving}
                    >
                      <option value="OTHER">Non spécifié</option>
                      <option value="MALE">Masculin</option>
                      <option value="FEMALE">Féminin</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Informations de contact */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-gray-600" />
                  Contact
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      value={newPatient.phone}
                      onChange={(e) => handleNewPatientChange('phone', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="+225 07 12 34 56 78"
                      disabled={isSaving}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={newPatient.email}
                      onChange={(e) => handleNewPatientChange('email', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="patient@example.com"
                      disabled={isSaving}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse *
                    </label>
                    <textarea
                      value={newPatient.address}
                      onChange={(e) => handleNewPatientChange('address', e.target.value)}
                      rows={2}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
                        errors.address ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Adresse complète"
                      disabled={isSaving}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        {errors.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Informations administratives */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
                  Informations administratives
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type d'assurance
                      </label>
                      <select
                        value={newPatient.insuranceType}
                        onChange={(e) => handleNewPatientChange('insuranceType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isSaving}
                      >
                        <option value="Sécurité Sociale">Sécurité Sociale</option>
                        <option value="Mutuelle">Mutuelle</option>
                        <option value="CMU">CMU</option>
                        <option value="Assurance privée">Assurance privée</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>

                    {/* Numéro d'assurance */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Numéro d'assurance {newPatient.insuranceType !== 'Autre' ? '*' : ''}
                        <span className="text-xs text-gray-500 block">
                          {newPatient.insuranceType === 'Sécurité Sociale' && 'Numéro de sécurité sociale'}
                          {newPatient.insuranceType === 'CMU' && 'Numéro CMU'}
                          {newPatient.insuranceType === 'Mutuelle' && 'Numéro d\'adhérent mutuelle'}
                          {newPatient.insuranceType === 'Assurance privée' && 'Numéro de police d\'assurance'}
                          {newPatient.insuranceType === 'Autre' && 'Numéro ou référence (optionnel)'}
                        </span>
                      </label>
                      <input
                        type="text"
                        value={newPatient.insuranceNumber}
                        onChange={(e) => handleNewPatientChange('insuranceNumber', e.target.value.toUpperCase())}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.insuranceNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder={
                          newPatient.insuranceType === 'Sécurité Sociale' ? 'Ex: 1234567890123' :
                          newPatient.insuranceType === 'CMU' ? 'Ex: CMU123456789' :
                          newPatient.insuranceType === 'Mutuelle' ? 'Ex: MUT987654321' :
                          newPatient.insuranceType === 'Assurance privée' ? 'Ex: POL456789123' :
                          'Numéro ou référence'
                        }
                        disabled={isSaving}
                      />
                      {errors.insuranceNumber && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          {errors.insuranceNumber}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Spécialité souhaitée
                      </label>
                      <select
                        value={newPatient.preferredSpecialty}
                        onChange={(e) => handleNewPatientChange('preferredSpecialty', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isSaving}
                      >
                        <option value="">Médecine générale</option>
                        <option value="cardiologie">Cardiologie</option>
                        <option value="dermatologie">Dermatologie</option>
                        <option value="gynecologie">Gynécologie</option>
                        <option value="pediatrie">Pédiatrie</option>
                        <option value="ophtalmologie">Ophtalmologie</option>
                        <option value="orthopedie">Orthopédie</option>
                        <option value="psychiatrie">Psychiatrie</option>
                        <option value="radiologie">Radiologie</option>
                        <option value="urgences">Urgences</option>
                        <option value="autre">Autre spécialité</option>
                      </select>
                    </div>
                  </div>

                  {/* Champ conditionnel pour la compagnie d'assurance */}
                  {isInsuranceCompanyRequired() && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {newPatient.insuranceType === 'Mutuelle' ? 'Mutuelle' : 'Compagnie d\'assurance'} *
                      </label>
                      <div className="relative insurance-dropdown-container">
                        <input
                          type="text"
                          value={newPatient.insuranceCompany || insuranceSearch}
                          onChange={(e) => {
                            setInsuranceSearch(e.target.value);
                            setShowInsuranceDropdown(true);
                            if (!e.target.value.trim()) {
                              setNewPatient(prev => ({ ...prev, insuranceCompany: '' }));
                            }
                          }}
                          onFocus={() => setShowInsuranceDropdown(true)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.insuranceCompany ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder={`Rechercher une ${newPatient.insuranceType.toLowerCase()}...`}
                          disabled={isSaving}
                          autoComplete="off"
                        />

                        {/* Dropdown avec recherche */}
                        {showInsuranceDropdown && !newPatient.insuranceCompany && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {getFilteredCompanies().length > 0 ? (
                              getFilteredCompanies().map((company, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => handleInsuranceCompanySelect(company)}
                                  className="w-full px-3 py-2 text-left hover:bg-blue-50 hover:text-blue-900 focus:bg-blue-50 focus:text-blue-900 focus:outline-none"
                                  disabled={isSaving}
                                >
                                  {company}
                                </button>
                              ))
                            ) : (
                              <div className="px-3 py-2 text-gray-500 text-sm">
                                Aucun résultat trouvé
                              </div>
                            )}
                          </div>
                        )}

                        {/* Bouton pour effacer la sélection */}
                        {newPatient.insuranceCompany && (
                          <button
                            type="button"
                            onClick={() => {
                              setNewPatient(prev => ({ ...prev, insuranceCompany: '' }));
                              setInsuranceSearch('');
                              setShowInsuranceDropdown(false);
                            }}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            disabled={isSaving}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {errors.insuranceCompany && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          {errors.insuranceCompany}
                        </p>
                      )}

                      {newPatient.insuranceCompany && (
                        <div className="mt-1 flex items-center text-sm text-green-600">
                          <Check className="w-4 h-4 mr-1" />
                          {newPatient.insuranceCompany} sélectionné
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du contact d'urgence *
                    </label>
                    <input
                      type="text"
                      value={newPatient.emergencyContactName}
                      onChange={(e) => handleNewPatientChange('emergencyContactName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.emergencyContactName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Nom et prénom"
                      disabled={isSaving}
                    />
                    {errors.emergencyContactName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        {errors.emergencyContactName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone du contact d'urgence *
                    </label>
                    <input
                      type="tel"
                      value={newPatient.emergencyContactPhone}
                      onChange={(e) => handleNewPatientChange('emergencyContactPhone', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.emergencyContactPhone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="+225 07 12 34 56 78"
                      disabled={isSaving}
                    />
                    {errors.emergencyContactPhone && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        {errors.emergencyContactPhone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes d'accueil avec suggestions */}
              <div className="bg-orange-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-orange-600" />
                  Notes importantes pour l'accueil
                </label>

                {/* Suggestions rapides par catégorie */}
                <div className="mb-3 space-y-3">

                  {/* Allergies & Médicales */}
                  <div>
                    <p className="text-xs font-medium text-red-700 mb-1 flex items-center">
                      <Shield className="w-3 h-3 mr-1" />
                      Allergies & Médical
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {[
                        "Allergie antibiotiques",
                        "Allergie anesthésie",
                        "Hypertension",
                        "Diabète",
                        "Pacemaker"
                      ].map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => {
                            const currentNotes = newPatient.notes || '';
                            const separator = currentNotes.length > 0 ? ', ' : '';
                            handleNewPatientChange('notes', currentNotes + separator + suggestion);
                          }}
                          className="px-2 py-1 text-xs bg-red-50 border border-red-200 text-red-700 rounded-md hover:bg-red-100 transition-colors"
                        >
                          + {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Préférences */}
                  <div>
                    <p className="text-xs font-medium text-blue-700 mb-1 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Préférences RDV
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {[
                        "RDV matin uniquement",
                        "Éviter vendredi",
                        "Préfère Dr. X",
                        "Ponctuel/le",
                        "Besoin temps supplémentaire"
                      ].map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => {
                            const currentNotes = newPatient.notes || '';
                            const separator = currentNotes.length > 0 ? ', ' : '';
                            handleNewPatientChange('notes', currentNotes + separator + suggestion);
                          }}
                          className="px-2 py-1 text-xs bg-blue-50 border border-blue-200 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          + {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accessibilité */}
                  <div>
                    <p className="text-xs font-medium text-purple-700 mb-1 flex items-center">
                      <UserX className="w-3 h-3 mr-1" />
                      Accessibilité
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {[
                        "Difficultés audition",
                        "Mobilité réduite",
                        "Fauteuil roulant",
                        "Malvoyant",
                        "Parle peu français"
                      ].map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => {
                            const currentNotes = newPatient.notes || '';
                            const separator = currentNotes.length > 0 ? ', ' : '';
                            handleNewPatientChange('notes', currentNotes + separator + suggestion);
                          }}
                          className="px-2 py-1 text-xs bg-purple-50 border border-purple-200 text-purple-700 rounded-md hover:bg-purple-100 transition-colors"
                        >
                          + {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <textarea
                  value={newPatient.notes}
                  onChange={(e) => handleNewPatientChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical"
                  placeholder="Ex: Allergie aux pénicillines, préfère les RDV l'après-midi, a des difficultés à se déplacer..."
                  disabled={isSaving}
                />

                {/* Preview et actions */}
                {newPatient.notes && (
                  <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-orange-800 mb-1">Aperçu des notes d'accueil :</p>
                        <p className="text-sm text-orange-700 leading-relaxed">{newPatient.notes}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleNewPatientChange('notes', '')}
                        className="ml-2 p-1 text-orange-600 hover:text-orange-800 hover:bg-orange-100 rounded transition-colors"
                        title="Effacer les notes"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-2 flex items-start space-x-2">
                  <Info className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-orange-700">
                    <p className="font-medium">Ces informations seront affichées :</p>
                    <ul className="mt-1 space-y-0.5 text-orange-600">
                      <li>• Lors de l'accueil du patient</li>
                      <li>• Dans la fiche patient pour les consultations</li>
                      <li>• Pour les prochains RDV</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Informations générées automatiquement */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Informations générées automatiquement</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Numéro patient: <span className="font-mono">{generatePatientNumber()}</span></p>
                  <p>• Statut: <span className="text-blue-600 font-medium">Nouveau patient</span></p>
                  <p>• Date de création: <span className="font-medium">{new Date().toLocaleDateString('fr-FR')}</span></p>
                </div>
              </div>
            </div>

            {/* Footer du modal */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCloseNewPatientModal}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSaving}
              >
                Annuler
              </button>
              <button
                onClick={handleSaveNewPatient}
                disabled={isSaving}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Créer le patient
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Proposition RDV */}
      {showAppointmentModal && newlyCreatedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header du modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Programmer un RDV</h2>
                  <p className="text-sm text-gray-600">Patient : {newlyCreatedPatient.name}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAppointmentModal(false);
                  setNewlyCreatedPatient(null);
                  setSuggestedSlots([]);
                  setSelectedSlot(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isBookingAppointment}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Corps du modal */}
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Spécialité : <span className="font-medium text-gray-900">
                    {newlyCreatedPatient.preferredSpecialty || 'Médecine générale'}
                  </span>
                </p>
                <p className="text-sm text-blue-600">
                  <Zap className="w-4 h-4 inline mr-1" />
                  Créneaux disponibles (médecins les moins chargés en premier)
                </p>
              </div>

              {isLoadingSlotsData ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Recherche des créneaux disponibles...</h3>
                  <p className="text-gray-500">
                    Nous analysons les plannings des médecins pour vous proposer les meilleurs créneaux.
                  </p>
                </div>
              ) : suggestedSlots.length === 0 ? (
                <div className="text-center py-8">
                  <Clock12 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun créneau disponible</h3>
                  <p className="text-gray-500">
                    Tous les médecins de cette spécialité sont complets.
                    Vous pourrez programmer un RDV ultérieurement.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {suggestedSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSlot(slot)}
                      className={`w-full p-4 border rounded-lg text-left transition-all ${
                        selectedSlot === slot
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      disabled={isBookingAppointment}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <UserCheck2 className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-gray-900">{slot.doctor.name}</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {slot.doctor.specialty}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{slot.date}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock12 className="w-4 h-4" />
                              <span>{slot.time}</span>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center space-x-2">
                            <div className="flex items-center space-x-1 text-xs">
                              <span className="text-gray-500">Charge:</span>
                              <div className="flex space-x-1">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${
                                      i < (slot.load / slot.doctor.maxLoad) * 5
                                        ? 'bg-blue-500'
                                        : 'bg-gray-200'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-gray-500 ml-1">
                                {slot.load}/{slot.doctor.maxLoad}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          {selectedSlot === slot && (
                            <Check className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer du modal */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowAppointmentModal(false);
                  setNewlyCreatedPatient(null);
                  setSuggestedSlots([]);
                  setSelectedSlot(null);
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isBookingAppointment}
              >
                Plus tard
              </button>

              <div className="flex space-x-3">
                {suggestedSlots.length > 0 && (
                  <button
                    onClick={handleBookAppointment}
                    disabled={!selectedSlot || isBookingAppointment}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isBookingAppointment ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Réservation...
                      </>
                    ) : (
                      <>
                        <CalendarCheck className="w-4 h-4 mr-2" />
                        Réserver maintenant
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Check-in Patient Existant */}
      {showCheckInModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header du modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserCheck2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Check-in Patient</h2>
                  <p className="text-sm text-gray-600">Accueil d'un patient existant pour consultation</p>
                </div>
              </div>
              <button
                onClick={handleCloseCheckInModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isSaving}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Étape 1: Recherche du patient */}
              {!selectedPatientForCheckIn ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rechercher le patient
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Nom, téléphone, email ou numéro patient..."
                        value={searchPatientTerm}
                        onChange={(e) => {
                          setSearchPatientTerm(e.target.value);
                          searchExistingPatients(e.target.value);
                        }}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Résultats de recherche */}
                  {foundPatients.length > 0 && (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      <p className="text-sm text-gray-600 mb-3">
                        {foundPatients.length} patient(s) trouvé(s)
                      </p>
                      {foundPatients.map((patient) => (
                        <button
                          key={patient.id}
                          onClick={() => setSelectedPatientForCheckIn(patient)}
                          className="w-full p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{patient.name}</p>
                              <p className="text-sm text-gray-600">{patient.phone}</p>
                              <p className="text-xs text-gray-500">#{patient.medicalNumber}</p>
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                STATUS_CONFIG[patient.status]?.color || 'bg-gray-100 text-gray-800 border-gray-200'
                              }`}>
                                {STATUS_CONFIG[patient.status]?.label || patient.status}
                              </span>
                              <p className="text-xs text-gray-500 mt-1">
                                Dernière visite: {new Date(patient.lastVisit).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {searchPatientTerm && searchPatientTerm.length >= 2 && foundPatients.length === 0 && (
                    <div className="text-center py-8">
                      <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun patient trouvé</h3>
                      <p className="text-gray-500">
                        Aucun patient ne correspond à votre recherche.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                /* Étape 2: Informations du check-in */
                <>
                  {/* Patient sélectionné */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-green-900">{selectedPatientForCheckIn.name}</h3>
                        <p className="text-sm text-green-700">{selectedPatientForCheckIn.phone}</p>
                        <p className="text-xs text-green-600">#{selectedPatientForCheckIn.medicalNumber}</p>
                      </div>
                      <button
                        onClick={() => setSelectedPatientForCheckIn(null)}
                        className="text-green-600 hover:text-green-800 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Informations de consultation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type de visite
                      </label>
                      <select
                        value={checkInData.consultationType}
                        onChange={(e) => setCheckInData(prev => ({ ...prev, consultationType: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled={isSaving}
                      >
                        <option value="consultation">Consultation</option>
                        <option value="controle">Contrôle</option>
                        <option value="urgence">Urgence</option>
                        <option value="examen">Examen médical</option>
                        <option value="vaccination">Vaccination</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Urgence
                      </label>
                      <select
                        value={checkInData.urgency}
                        onChange={(e) => setCheckInData(prev => ({ ...prev, urgency: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled={isSaving}
                      >
                        <option value="normal">Normal</option>
                        <option value="urgent">Urgent</option>
                        <option value="tres_urgent">Très urgent</option>
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes de visite (optionnel)
                    </label>
                    <textarea
                      value={checkInData.notes}
                      onChange={(e) => setCheckInData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical"
                      placeholder="Motif de consultation, symptômes, remarques..."
                      disabled={isSaving}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Footer du modal */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCloseCheckInModal}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSaving}
              >
                Annuler
              </button>

              {selectedPatientForCheckIn && (
                <button
                  onClick={handlePatientCheckIn}
                  disabled={isSaving}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Check-in en cours...
                    </>
                  ) : (
                    <>
                      <UserCheck2 className="w-4 h-4 mr-2" />
                      Confirmer Check-in
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Détails Patient */}
      {showPatientDetailsModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Eye className="w-6 h-6 mr-2 text-blue-600" />
                Détails du Patient
              </h2>
              <button
                onClick={() => {
                  setShowPatientDetailsModal(false);
                  setSelectedPatient(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Informations personnelles</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nom complet</label>
                      <p className="text-sm text-gray-900">{selectedPatient.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
                      <p className="text-sm text-gray-900">{new Date(selectedPatient.birthDate).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Âge</label>
                      <p className="text-sm text-gray-900">{calculateAge(selectedPatient.birthDate)} ans</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Genre</label>
                      <p className="text-sm text-gray-900">{selectedPatient.gender === 'MALE' ? 'Masculin' : selectedPatient.gender === 'FEMALE' ? 'Féminin' : 'Non spécifié'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Contact</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                      <p className="text-sm text-gray-900">{selectedPatient.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900">{selectedPatient.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Adresse</label>
                      <p className="text-sm text-gray-900">{selectedPatient.address}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact d'urgence</label>
                      <p className="text-sm text-gray-900">{selectedPatient.emergencyContact}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informations médicales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Numéro médical</label>
                    <p className="text-sm text-gray-900">{selectedPatient.medicalNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Assurance</label>
                    <p className="text-sm text-gray-900">{selectedPatient.insuranceType}</p>
                  </div>
                  {selectedPatient.insuranceNumber && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Numéro d'assurance</label>
                      <p className="text-sm text-gray-900 font-mono">{selectedPatient.insuranceNumber}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Solde</label>
                    <p className={`text-sm font-medium ${getBalanceColor(selectedPatient.balance)}`}>
                      {selectedPatient.balance > 0 ? '+' : ''}{selectedPatient.balance} CFA
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre de consultations</label>
                    <p className="text-sm text-gray-900">{selectedPatient.appointmentHistory}</p>
                  </div>
                </div>

                {selectedPatient.notes && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedPatient.notes}</p>
                  </div>
                )}
              </div>

              {/* Informations d'audit */}
              {selectedPatient.createdByName && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <UserCheck2 className="w-5 h-5 mr-2 text-gray-600" />
                    Informations d'audit
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Créé par</label>
                      <p className="text-sm text-gray-900 font-medium">{selectedPatient.createdByName}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Date de création</label>
                      <p className="text-sm text-gray-900">
                        {selectedPatient.createdAt ? new Date(selectedPatient.createdAt).toLocaleString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Non disponible'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowPatientDetailsModal(false);
                  setSelectedPatient(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Modification Patient */}
      {showEditPatientModal && editingPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Edit3 className="w-6 h-6 mr-2 text-gray-600" />
                Modifier le Patient
              </h2>
              <button
                onClick={() => {
                  setShowEditPatientModal(false);
                  setEditingPatient(null);
                  setErrors({});
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {errors.general && (
                <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                  <div>
                    <p className="font-medium text-red-800">Erreur de modification</p>
                    <p className="text-sm text-red-700">{errors.general}</p>
                  </div>
                </div>
              )}

              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleUpdatePatient(); }}>
                {/* Informations personnelles */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-gray-600" />
                    Informations personnelles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        value={editingPatient.name || ''}
                        onChange={(e) => setEditingPatient(prev => ({...prev, name: e.target.value}))}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Prénom Nom"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de naissance *
                      </label>
                      <input
                        type="date"
                        value={editingPatient.birthDate || ''}
                        onChange={(e) => setEditingPatient(prev => ({...prev, birthDate: e.target.value}))}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.birthDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {errors.birthDate && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.birthDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Genre
                      </label>
                      <select
                        value={editingPatient.gender || 'MALE'}
                        onChange={(e) => setEditingPatient(prev => ({...prev, gender: e.target.value}))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="MALE">Masculin</option>
                        <option value="FEMALE">Féminin</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Statut
                      </label>
                      <select
                        value={editingPatient.status || 'active'}
                        onChange={(e) => setEditingPatient(prev => ({...prev, status: e.target.value}))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="active">Actif</option>
                        <option value="inactive">Inactif</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-blue-600" />
                    Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        value={editingPatient.phone && editingPatient.phone !== '+225 ' ? editingPatient.phone : '+225 '}
                        onChange={(e) => {
                          let value = e.target.value;
                          if (!value.startsWith('+225 ')) {
                            value = '+225 ' + value.replace(/^\+225\s*/, '');
                          }

                          // Extraire seulement les chiffres après +225
                          const digitsOnly = value.replace(/^\+225\s*/, '').replace(/\D/g, '');

                          // Limiter à 10 chiffres maximum
                          if (digitsOnly.length <= 10) {
                            // Reformater avec espaces pour lisibilité
                            let formattedDigits = digitsOnly;
                            if (digitsOnly.length > 2) {
                              formattedDigits = digitsOnly.substring(0, 2) + ' ' +
                                              digitsOnly.substring(2, 4) + ' ' +
                                              digitsOnly.substring(4, 6) + ' ' +
                                              digitsOnly.substring(6, 8) + ' ' +
                                              digitsOnly.substring(8, 10);
                            }
                            formattedDigits = formattedDigits.trim();
                            setEditingPatient(prev => ({...prev, phone: '+225 ' + formattedDigits}));
                          }
                        }}
                        onFocus={(e) => {
                          if (!e.target.value || e.target.value === '+225 ') {
                            setEditingPatient(prev => ({...prev, phone: '+225 '}));
                          }
                        }}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="+225 07 12 34 56 78"
                        maxLength="19"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={editingPatient.email || ''}
                        onChange={(e) => setEditingPatient(prev => ({...prev, email: e.target.value}))}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="patient@email.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse *
                      </label>
                      <textarea
                        value={editingPatient.address || ''}
                        onChange={(e) => setEditingPatient(prev => ({...prev, address: e.target.value}))}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.address ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        rows="2"
                        placeholder="Adresse complète"
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.address}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact d'urgence */}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
                    Contact d'urgence
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom du contact *
                      </label>
                      <input
                        type="text"
                        value={editingPatient.emergencyContactName || ''}
                        onChange={(e) => setEditingPatient(prev => ({...prev, emergencyContactName: e.target.value}))}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.emergencyContactName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Nom du contact"
                      />
                      {errors.emergencyContactName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.emergencyContactName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone du contact *
                      </label>
                      <input
                        type="tel"
                        value={editingPatient.emergencyContactPhone && editingPatient.emergencyContactPhone !== '+225 ' ? editingPatient.emergencyContactPhone : '+225 '}
                        onChange={(e) => {
                          let value = e.target.value;
                          if (!value.startsWith('+225 ')) {
                            value = '+225 ' + value.replace(/^\+225\s*/, '');
                          }

                          // Extraire seulement les chiffres après +225
                          const digitsOnly = value.replace(/^\+225\s*/, '').replace(/\D/g, '');

                          // Limiter à 10 chiffres maximum
                          if (digitsOnly.length <= 10) {
                            // Reformater avec espaces pour lisibilité
                            let formattedDigits = digitsOnly;
                            if (digitsOnly.length > 2) {
                              formattedDigits = digitsOnly.substring(0, 2) + ' ' +
                                              digitsOnly.substring(2, 4) + ' ' +
                                              digitsOnly.substring(4, 6) + ' ' +
                                              digitsOnly.substring(6, 8) + ' ' +
                                              digitsOnly.substring(8, 10);
                            }
                            formattedDigits = formattedDigits.trim();
                            setEditingPatient(prev => ({...prev, emergencyContactPhone: '+225 ' + formattedDigits}));
                          }
                        }}
                        onFocus={(e) => {
                          if (!e.target.value || e.target.value === '+225 ') {
                            setEditingPatient(prev => ({...prev, emergencyContactPhone: '+225 '}));
                          }
                        }}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.emergencyContactPhone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="+225 07 12 34 56 78"
                        maxLength="19"
                      />
                      {errors.emergencyContactPhone && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.emergencyContactPhone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Antécédents médicaux */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-green-600" />
                    Antécédents médicaux
                  </h3>
                  <textarea
                    value={editingPatient.medicalHistory || editingPatient.notes || ''}
                    onChange={(e) => setEditingPatient(prev => ({...prev, medicalHistory: e.target.value}))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Antécédents médicaux, allergies, traitements en cours..."
                  />
                </div>
              </form>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setShowEditPatientModal(false);
                  setEditingPatient(null);
                  setErrors({});
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={isSaving}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleUpdatePatient}
                disabled={isSaving}
                className={`px-6 py-2 text-white rounded-lg transition-colors flex items-center ${
                  isSaving
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Mettre à jour
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}