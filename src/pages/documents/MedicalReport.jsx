import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Save,
  Send,
  ArrowLeft,
  User,
  Calendar,
  Clock,
  AlertCircle,
  Check,
  Printer,
  Download,
  Plus,
  Trash2
} from 'lucide-react';

const REPORT_SECTIONS = [
  { id: 'motif', title: 'Motif de consultation', required: true },
  { id: 'histoire', title: 'Histoire de la maladie', required: true },
  { id: 'antecedents', title: 'Antécédents médicaux', required: false },
  { id: 'examen', title: 'Examen clinique', required: true },
  { id: 'diagnostic', title: 'Diagnostic', required: true },
  { id: 'traitement', title: 'Traitement prescrit', required: false },
  { id: 'recommandations', title: 'Recommandations', required: false },
  { id: 'suivi', title: 'Suivi prévu', required: false }
];

const TEMPLATES = [
  {
    id: 'consultation_generale',
    name: 'Consultation générale',
    sections: {
      motif: 'Consultation de routine',
      examen: 'État général: Bon\nConstantes vitales:\n- Tension artérielle: \n- Fréquence cardiaque: \n- Température: \n- Poids: \n- Taille: ',
      diagnostic: '',
      recommandations: 'Maintenir un mode de vie sain\nSuivre les recommandations alimentaires'
    }
  },
  {
    id: 'controle',
    name: 'Consultation de contrôle',
    sections: {
      motif: 'Consultation de contrôle',
      histoire: 'Suivi de la pathologie connue',
      examen: 'Évolution clinique:\nConstantes vitales:\n- Tension artérielle: \n- Poids: ',
      diagnostic: 'Évolution favorable/défavorable',
      suivi: 'Prochain contrôle dans 1 mois'
    }
  }
];

const SAMPLE_PATIENTS = [
  { id: 1, name: 'Dupont Jean', birthDate: '1980-05-15', phone: '0123456789' },
  { id: 2, name: 'Martin Marie', birthDate: '1975-11-22', phone: '0123456790' },
  { id: 3, name: 'Moreau Pierre', birthDate: '1990-03-08', phone: '0123456791' }
];

export default function MedicalReport() {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();

  const [report, setReport] = useState({
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    sections: REPORT_SECTIONS.reduce((acc, section) => ({
      ...acc,
      [section.id]: ''
    }), {}),
    status: 'draft' // draft, completed, sent
  });

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients] = useState(SAMPLE_PATIENTS);
  const [isLoading, setIsLoading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [errors, setErrors] = useState({});

  const validateSection = (sectionId, value) => {
    const section = REPORT_SECTIONS.find(s => s.id === sectionId);
    if (section.required && (!value || value.trim() === '')) {
      return `Le champ "${section.title}" est obligatoire`;
    }
    return null;
  };

  const validateReport = () => {
    const newErrors = {};

    if (!report.patientId) {
      newErrors.patient = 'Veuillez sélectionner un patient';
    }

    REPORT_SECTIONS.forEach(section => {
      const error = validateSection(section.id, report.sections[section.id]);
      if (error) {
        newErrors[section.id] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSectionChange = (sectionId, value) => {
    setReport(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionId]: value
      }
    }));

    // Supprimer l'erreur si la section devient valide
    if (errors[sectionId] && validateSection(sectionId, value) === null) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[sectionId];
        return newErrors;
      });
    }
  };

  const handlePatientSelect = (patientId) => {
    const patient = patients.find(p => p.id === parseInt(patientId));
    setReport(prev => ({ ...prev, patientId }));
    setSelectedPatient(patient);

    if (errors.patient) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.patient;
        return newErrors;
      });
    }
  };

  const applyTemplate = (template) => {
    setReport(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        ...template.sections
      }
    }));
    setShowTemplates(false);
  };

  const handleSave = async () => {
    if (!validateReport()) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Rapport sauvegardé:', report);

      // Retour vers la liste des documents
      navigate('/documents');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!validateReport()) {
      return;
    }

    setReport(prev => ({ ...prev, status: 'completed' }));
    await handleSave();
  };

  const handleSend = async () => {
    if (!validateReport()) {
      return;
    }

    setReport(prev => ({ ...prev, status: 'sent' }));
    await handleSave();
  };

  if (!hasRole(['ADMIN_CLINIQUE', 'MEDECIN'])) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-900 mb-2">Accès non autorisé</h2>
          <p className="text-red-700">Vous n'avez pas les permissions nécessaires pour créer des rapports médicaux.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/documents')}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FileText className="w-7 h-7 mr-3 text-blue-600" />
              Nouveau rapport médical
            </h1>
            <p className="text-gray-600 mt-1">Rédigez un rapport de consultation détaillé</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Template
          </button>
          <button className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            <Printer className="w-4 h-4 mr-2" />
            Aperçu
          </button>
        </div>
      </div>

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Choisir un template</h3>
            <div className="space-y-3">
              {TEMPLATES.map(template => (
                <button
                  key={template.id}
                  onClick={() => applyTemplate(template)}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <div className="font-medium text-gray-900">{template.name}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowTemplates(false)}
              className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Informations du patient */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Informations du patient
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient *
              </label>
              <select
                value={report.patientId}
                onChange={(e) => handlePatientSelect(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.patient ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionner un patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
              {errors.patient && (
                <p className="mt-1 text-sm text-red-600">{errors.patient}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de consultation *
              </label>
              <input
                type="date"
                value={report.date}
                onChange={(e) => setReport(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {selectedPatient && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-6 text-sm text-blue-900">
                <span>
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Né(e) le {new Date(selectedPatient.birthDate).toLocaleDateString('fr-FR')}
                </span>
                <span>📞 {selectedPatient.phone}</span>
              </div>
            </div>
          )}
        </div>

        {/* Sections du rapport */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Contenu du rapport
          </h2>

          <div className="space-y-6">
            {REPORT_SECTIONS.map(section => (
              <div key={section.id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {section.title}
                  {section.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <textarea
                  value={report.sections[section.id]}
                  onChange={(e) => handleSectionChange(section.id, e.target.value)}
                  rows={section.id === 'examen' ? 6 : 4}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
                    errors[section.id] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder={`Saisir ${section.title.toLowerCase()}...`}
                />
                {errors[section.id] && (
                  <p className="mt-1 text-sm text-red-600">{errors[section.id]}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => navigate('/documents')}
            className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Annuler
          </button>

          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center px-6 py-2 text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Sauvegarde...' : 'Sauvegarder brouillon'}
          </button>

          <button
            onClick={handleComplete}
            disabled={isLoading}
            className="flex items-center px-6 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <Check className="w-4 h-4 mr-2" />
            Finaliser
          </button>

          <button
            onClick={handleSend}
            disabled={isLoading}
            className="flex items-center px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4 mr-2" />
            Envoyer au patient
          </button>
        </div>
      </div>
    </div>
  );
}