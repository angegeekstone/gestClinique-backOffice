import { useState, useEffect } from 'react';
import {
  Building,
  Phone,
  Mail,
  MapPin,
  Clock,
  Save,
  AlertCircle,
  Check,
  X,
  Calendar,
  Stethoscope,
  FileText,
  Plus,
  Edit3,
  Trash2
} from 'lucide-react';

export default function ClinicConfiguration() {
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('general');

  const [clinicInfo, setClinicInfo] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    email: '',
    siret: '',
    description: ''
  });

  const [openingHours, setOpeningHours] = useState({
    lundi: { open: '08:00', close: '18:00', closed: false },
    mardi: { open: '08:00', close: '18:00', closed: false },
    mercredi: { open: '08:00', close: '18:00', closed: false },
    jeudi: { open: '08:00', close: '18:00', closed: false },
    vendredi: { open: '08:00', close: '18:00', closed: false },
    samedi: { open: '09:00', close: '17:00', closed: false },
    dimanche: { open: '09:00', close: '12:00', closed: true }
  });

  const [consultationTypes, setConsultationTypes] = useState([]);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [editingConsultation, setEditingConsultation] = useState(null);
  const [consultationForm, setConsultationForm] = useState({
    name: '',
    duration: 30,
    description: '',
    isUrgent: false
  });

  const [documentTemplates, setDocumentTemplates] = useState([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    type: 'ordonnance',
    content: '',
    isActive: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Simuler le chargement des données (à remplacer par API)
      await new Promise(resolve => setTimeout(resolve, 800));

      setClinicInfo({
        name: 'Clinique Saint-Antoine',
        address: '123 Avenue de la Santé',
        city: 'Paris',
        postalCode: '75015',
        phone: '01 23 45 67 89',
        email: 'contact@clinique-st-antoine.fr',
        siret: '12345678901234',
        description: 'Clinique spécialisée en médecine générale et cardiologie'
      });

      setConsultationTypes([
        { id: 1, name: 'Consultation standard', duration: 30, description: 'Consultation médicale classique', isUrgent: false },
        { id: 2, name: 'Consultation de suivi', duration: 20, description: 'Suivi post-consultation', isUrgent: false },
        { id: 3, name: 'Consultation urgente', duration: 45, description: 'Consultation en urgence', isUrgent: true },
        { id: 4, name: 'Première consultation', duration: 60, description: 'Premier rendez-vous avec examen complet', isUrgent: false }
      ]);

      setDocumentTemplates([
        { id: 1, name: 'Ordonnance standard', type: 'ordonnance', content: 'Modèle d\'ordonnance par défaut', isActive: true },
        { id: 2, name: 'Certificat médical', type: 'certificat', content: 'Modèle de certificat médical', isActive: true },
        { id: 3, name: 'Arrêt de travail', type: 'arret', content: 'Modèle d\'arrêt de travail', isActive: true }
      ]);

    } catch (error) {
      console.error('Erreur chargement données:', error);
      showNotification('error', 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSaveClinicInfo = async (e) => {
    e.preventDefault();
    try {
      // Simuler l'enregistrement (à remplacer par API)
      await new Promise(resolve => setTimeout(resolve, 500));
      showNotification('success', 'Informations de la clinique mises à jour');
    } catch (error) {
      showNotification('error', 'Erreur lors de l\'enregistrement');
    }
  };

  const handleSaveOpeningHours = async () => {
    try {
      // Simuler l'enregistrement (à remplacer par API)
      await new Promise(resolve => setTimeout(resolve, 500));
      showNotification('success', 'Horaires d\'ouverture mis à jour');
    } catch (error) {
      showNotification('error', 'Erreur lors de l\'enregistrement des horaires');
    }
  };

  const handleOpenConsultationModal = (consultation = null) => {
    if (consultation) {
      setEditingConsultation(consultation);
      setConsultationForm({
        name: consultation.name,
        duration: consultation.duration,
        description: consultation.description,
        isUrgent: consultation.isUrgent
      });
    } else {
      setEditingConsultation(null);
      setConsultationForm({
        name: '',
        duration: 30,
        description: '',
        isUrgent: false
      });
    }
    setShowConsultationModal(true);
  };

  const handleConsultationSubmit = async (e) => {
    e.preventDefault();
    try {
      const newConsultation = {
        id: editingConsultation ? editingConsultation.id : Date.now(),
        ...consultationForm,
        duration: parseInt(consultationForm.duration)
      };

      if (editingConsultation) {
        setConsultationTypes(prev => prev.map(c => c.id === editingConsultation.id ? newConsultation : c));
        showNotification('success', 'Type de consultation modifié');
      } else {
        setConsultationTypes(prev => [...prev, newConsultation]);
        showNotification('success', 'Type de consultation créé');
      }

      setShowConsultationModal(false);
      setEditingConsultation(null);
      setConsultationForm({ name: '', duration: 30, description: '', isUrgent: false });
    } catch (error) {
      showNotification('error', 'Erreur lors de l\'enregistrement');
    }
  };

  const handleDeleteConsultationType = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce type de consultation ?')) {
      setConsultationTypes(prev => prev.filter(c => c.id !== id));
      showNotification('success', 'Type de consultation supprimé');
    }
  };

  const handleOpenTemplateModal = (template = null) => {
    if (template) {
      setEditingTemplate(template);
      setTemplateForm({
        name: template.name,
        type: template.type,
        content: template.content,
        isActive: template.isActive
      });
    } else {
      setEditingTemplate(null);
      setTemplateForm({
        name: '',
        type: 'ordonnance',
        content: '',
        isActive: true
      });
    }
    setShowTemplateModal(true);
  };

  const handleTemplateSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTemplate = {
        id: editingTemplate ? editingTemplate.id : Date.now(),
        ...templateForm
      };

      if (editingTemplate) {
        setDocumentTemplates(prev => prev.map(t => t.id === editingTemplate.id ? newTemplate : t));
        showNotification('success', 'Modèle de document modifié');
      } else {
        setDocumentTemplates(prev => [...prev, newTemplate]);
        showNotification('success', 'Modèle de document créé');
      }

      setShowTemplateModal(false);
      setEditingTemplate(null);
      setTemplateForm({ name: '', type: 'ordonnance', content: '', isActive: true });
    } catch (error) {
      showNotification('error', 'Erreur lors de l\'enregistrement');
    }
  };

  const handleDeleteTemplate = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce modèle ?')) {
      setDocumentTemplates(prev => prev.filter(t => t.id !== id));
      showNotification('success', 'Modèle supprimé');
    }
  };

  const toggleTemplateStatus = (id) => {
    setDocumentTemplates(prev => prev.map(t =>
      t.id === id ? { ...t, isActive: !t.isActive } : t
    ));
  };

  const tabs = [
    { id: 'general', label: 'Informations Générales', icon: Building },
    { id: 'horaires', label: 'Horaires d\'Ouverture', icon: Clock },
    { id: 'consultations', label: 'Types de Consultations', icon: Stethoscope },
    { id: 'documents', label: 'Modèles de Documents', icon: FileText }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuration de la Clinique</h1>
        <p className="text-gray-600">Gérez les paramètres et la configuration de votre clinique</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <TabIcon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Informations Générales */}
          {activeTab === 'general' && (
            <form onSubmit={handleSaveClinicInfo} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la Clinique</label>
                  <input
                    type="text"
                    value={clinicInfo.name}
                    onChange={(e) => setClinicInfo({ ...clinicInfo, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SIRET</label>
                  <input
                    type="text"
                    value={clinicInfo.siret}
                    onChange={(e) => setClinicInfo({ ...clinicInfo, siret: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="12345678901234"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                <input
                  type="text"
                  value={clinicInfo.address}
                  onChange={(e) => setClinicInfo({ ...clinicInfo, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                  <input
                    type="text"
                    value={clinicInfo.city}
                    onChange={(e) => setClinicInfo({ ...clinicInfo, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Code Postal</label>
                  <input
                    type="text"
                    value={clinicInfo.postalCode}
                    onChange={(e) => setClinicInfo({ ...clinicInfo, postalCode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={clinicInfo.phone}
                    onChange={(e) => setClinicInfo({ ...clinicInfo, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={clinicInfo.email}
                    onChange={(e) => setClinicInfo({ ...clinicInfo, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={clinicInfo.description}
                  onChange={(e) => setClinicInfo({ ...clinicInfo, description: e.target.value })}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Description de la clinique et des services proposés..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Sauvegarder</span>
                </button>
              </div>
            </form>
          )}

          {/* Horaires d'Ouverture */}
          {activeTab === 'horaires' && (
            <div className="space-y-6">
              <div className="grid gap-4">
                {Object.entries(openingHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-24">
                      <span className="font-medium text-gray-900 capitalize">{day}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={!hours.closed}
                        onChange={(e) => setOpeningHours({
                          ...openingHours,
                          [day]: { ...hours, closed: !e.target.checked }
                        })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">Ouvert</span>
                    </div>
                    {!hours.closed && (
                      <div className="flex items-center space-x-2">
                        <input
                          type="time"
                          value={hours.open}
                          onChange={(e) => setOpeningHours({
                            ...openingHours,
                            [day]: { ...hours, open: e.target.value }
                          })}
                          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="text-gray-500">à</span>
                        <input
                          type="time"
                          value={hours.close}
                          onChange={(e) => setOpeningHours({
                            ...openingHours,
                            [day]: { ...hours, close: e.target.value }
                          })}
                          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    )}
                    {hours.closed && (
                      <span className="text-sm text-gray-500">Fermé</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveOpeningHours}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Sauvegarder les Horaires</span>
                </button>
              </div>
            </div>
          )}

          {/* Types de Consultations */}
          {activeTab === 'consultations' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Types de Consultations</h3>
                <button
                  onClick={() => handleOpenConsultationModal()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouveau Type</span>
                </button>
              </div>

              <div className="grid gap-4">
                {consultationTypes.map((consultation) => (
                  <div key={consultation.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium text-gray-900">{consultation.name}</h4>
                          {consultation.isUrgent && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                              Urgent
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{consultation.description}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{consultation.duration} minutes</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleOpenConsultationModal(consultation)}
                          className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteConsultationType(consultation.id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modèles de Documents */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Modèles de Documents</h3>
                <button
                  onClick={() => handleOpenTemplateModal()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouveau Modèle</span>
                </button>
              </div>

              <div className="grid gap-4">
                {documentTemplates.map((template) => (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium text-gray-900">{template.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            template.type === 'ordonnance' ? 'bg-blue-100 text-blue-800' :
                            template.type === 'certificat' ? 'bg-green-100 text-green-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {template.type}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {template.isActive ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{template.content}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleTemplateStatus(template.id)}
                          className={`p-2 rounded-lg ${template.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenTemplateModal(template)}
                          className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Type de Consultation */}
      {showConsultationModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowConsultationModal(false)} />

            <div className="relative inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingConsultation ? 'Modifier le Type' : 'Nouveau Type de Consultation'}
                </h3>
                <button onClick={() => setShowConsultationModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleConsultationSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    value={consultationForm.name}
                    onChange={(e) => setConsultationForm({ ...consultationForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durée (minutes)</label>
                  <input
                    type="number"
                    min="15"
                    max="120"
                    step="15"
                    value={consultationForm.duration}
                    onChange={(e) => setConsultationForm({ ...consultationForm, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={consultationForm.description}
                    onChange={(e) => setConsultationForm({ ...consultationForm, description: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Description du type de consultation..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={consultationForm.isUrgent}
                    onChange={(e) => setConsultationForm({ ...consultationForm, isUrgent: e.target.checked })}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500 mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700">Consultation urgente</label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowConsultationModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingConsultation ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Modèle de Document */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowTemplateModal(false)} />

            <div className="relative inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingTemplate ? 'Modifier le Modèle' : 'Nouveau Modèle de Document'}
                </h3>
                <button onClick={() => setShowTemplateModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleTemplateSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Modèle</label>
                    <input
                      type="text"
                      value={templateForm.name}
                      onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={templateForm.type}
                      onChange={(e) => setTemplateForm({ ...templateForm, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="ordonnance">Ordonnance</option>
                      <option value="certificat">Certificat médical</option>
                      <option value="arret">Arrêt de travail</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contenu du Modèle</label>
                  <textarea
                    value={templateForm.content}
                    onChange={(e) => setTemplateForm({ ...templateForm, content: e.target.value })}
                    rows="8"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Contenu du modèle de document..."
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={templateForm.isActive}
                    onChange={(e) => setTemplateForm({ ...templateForm, isActive: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700">Modèle actif</label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowTemplateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingTemplate ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-[60] max-w-md">
          <div className={`flex items-center px-4 py-3 rounded-lg shadow-lg ${
            notification.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {notification.type === 'success' ? (
              <Check className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-auto text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}