import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Plus,
  Calendar,
  User,
  Upload,
  Trash2,
  Edit3,
  FolderOpen,
  Clock,
  PenTool,
  Share,
  Archive,
  CheckCircle
} from 'lucide-react';

const DOCUMENT_TYPES = [
  { id: 'rapport_medical', label: 'Rapport médical', icon: FileText, color: 'bg-blue-500' },
  { id: 'prescription', label: 'Prescription', icon: FileText, color: 'bg-green-500' },
  { id: 'certificat', label: 'Certificat médical', icon: FileText, color: 'bg-purple-500' },
  { id: 'resultat_analyse', label: 'Résultat d\'analyse', icon: FileText, color: 'bg-yellow-500' },
  { id: 'attestation', label: 'Attestation', icon: FileText, color: 'bg-indigo-500' },
  { id: 'autre', label: 'Autre', icon: FolderOpen, color: 'bg-gray-500' }
];

const SAMPLE_DOCUMENTS = [
  {
    id: 1,
    title: 'Rapport de consultation - Dupont Jean',
    type: 'rapport_medical',
    patient: 'Dupont Jean',
    patientId: 'P001234',
    date: '2024-03-01',
    size: '245 KB',
    status: 'completed',
    createdBy: 'Dr. Martin',
    signedBy: 'Dr. Martin',
    signedAt: '2024-03-01T14:30:00',
    consultationId: 'C-2024-001',
    tags: ['consultation', 'gastro']
  },
  {
    id: 2,
    title: 'Prescription antibiotiques',
    type: 'prescription',
    patient: 'Martin Marie',
    patientId: 'P001235',
    date: '2024-02-28',
    size: '128 KB',
    status: 'signed',
    createdBy: 'Dr. Durand',
    signedBy: 'Dr. Durand',
    signedAt: '2024-02-28T10:15:00',
    prescriptionId: 'P-2024-001',
    tags: ['antibiotique', 'infection']
  },
  {
    id: 3,
    title: 'Certificat arrêt de travail',
    type: 'certificat',
    patient: 'Moreau Pierre',
    patientId: 'P001236',
    date: '2024-02-25',
    size: '89 KB',
    status: 'draft',
    createdBy: 'Dr. Martin',
    tags: ['arrêt_travail', 'lombalgie']
  },
  {
    id: 4,
    title: 'Résultats analyses sanguines',
    type: 'resultat_analyse',
    patient: 'Sophie Bernard',
    patientId: 'P001237',
    date: '2024-02-20',
    size: '156 KB',
    status: 'completed',
    createdBy: 'Laboratoire Central',
    tags: ['sang', 'glycémie']
  },
  {
    id: 5,
    title: 'Attestation vaccination COVID',
    type: 'attestation',
    patient: 'Lucas Thomas',
    patientId: 'P001238',
    date: '2024-02-15',
    size: '92 KB',
    status: 'signed',
    createdBy: 'Dr. Martin',
    signedBy: 'Dr. Martin',
    signedAt: '2024-02-15T16:00:00',
    tags: ['vaccination', 'covid']
  }
];

export default function Documents() {
  const { user, hasRole } = useAuth();
  const [documents, setDocuments] = useState(SAMPLE_DOCUMENTS);
  const [filteredDocuments, setFilteredDocuments] = useState(SAMPLE_DOCUMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // États pour les modals
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [documentToSign, setDocumentToSign] = useState(null);
  const [showMyDocumentsOnly, setShowMyDocumentsOnly] = useState(false);

  useEffect(() => {
    filterDocuments();
  }, [searchTerm, selectedType, selectedStatus, documents, showMyDocumentsOnly]);

  const filterDocuments = () => {
    let filtered = documents;

    // Filtrage pour médecin - ses propres documents seulement
    if (hasRole('MEDECIN') && showMyDocumentsOnly) {
      const doctorName = `${user.firstName} ${user.lastName}` || user.username;
      filtered = filtered.filter(doc =>
        doc.createdBy.includes(doctorName) || doc.createdBy.includes('Dr. Martin') // Temp pour démo
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(doc => doc.type === selectedType);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(doc => doc.status === selectedStatus);
    }

    setFilteredDocuments(filtered);
  };

  const getDocumentTypeInfo = (typeId) => {
    return DOCUMENT_TYPES.find(type => type.id === typeId) || DOCUMENT_TYPES[5];
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { label: 'Terminé', class: 'bg-green-100 text-green-800', icon: CheckCircle },
      signed: { label: 'Signé', class: 'bg-blue-100 text-blue-800', icon: PenTool },
      pending: { label: 'En attente', class: 'bg-yellow-100 text-yellow-800', icon: Clock },
      draft: { label: 'Brouillon', class: 'bg-gray-100 text-gray-800', icon: Edit3 }
    };
    return statusConfig[status] || statusConfig.draft;
  };

  const handleNewDocument = (type) => {
    if (type === 'rapport_medical') {
      // Redirection vers la page de rapport médical
      window.location.href = '/documents/rapport';
    } else if (hasRole('MEDECIN')) {
      // Ouvrir le modal de template pour médecins
      setSelectedDocumentType(type);
      setShowDocumentModal(true);
    } else {
      console.log('Création nouveau document:', type);
    }
  };

  const handleSignDocument = (document) => {
    setDocumentToSign(document);
    setShowSignatureModal(true);
  };

  const confirmSignature = () => {
    if (!documentToSign) return;

    const updatedDocuments = documents.map(doc =>
      doc.id === documentToSign.id
        ? {
            ...doc,
            status: 'signed',
            signedBy: `${user.firstName} ${user.lastName}` || 'Dr. Martin',
            signedAt: new Date().toISOString()
          }
        : doc
    );

    setDocuments(updatedDocuments);
    setShowSignatureModal(false);
    setDocumentToSign(null);
  };

  const createDocumentFromTemplate = (templateData) => {
    const newDocument = {
      id: Date.now(),
      title: templateData.title,
      type: selectedDocumentType,
      patient: templateData.patient || 'Patient à sélectionner',
      patientId: templateData.patientId || '',
      date: new Date().toISOString().split('T')[0],
      size: '0 KB',
      status: 'draft',
      createdBy: `${user.firstName} ${user.lastName}` || 'Dr. Martin',
      tags: templateData.tags || []
    };

    setDocuments([newDocument, ...documents]);
    setShowDocumentModal(false);
    setSelectedDocumentType(null);
    console.log('Document créé:', newDocument);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600 mt-1">Gestion des documents médicaux et administratifs</p>
        </div>

        {hasRole(['ADMIN_CLINIQUE', 'MEDECIN']) && (
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Upload className="w-4 h-4 mr-2" />
              Importer
            </button>
          </div>
        )}
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">En attente signature</p>
              <p className="text-2xl font-bold text-orange-600">
                {documents.filter(d => d.status === 'draft').length}
              </p>
            </div>
            <PenTool className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Signés</p>
              <p className="text-2xl font-bold text-green-600">
                {documents.filter(d => d.status === 'signed').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Ce mois</p>
              <p className="text-2xl font-bold text-purple-600">
                {documents.filter(d => {
                  const docDate = new Date(d.date);
                  const now = new Date();
                  return docDate.getMonth() === now.getMonth() && docDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions - Types de documents */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {DOCUMENT_TYPES.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => handleNewDocument(type.id)}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow group"
            >
              <div className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center mb-3 mx-auto group-hover:scale-105 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 text-center">{type.label}</h3>
            </button>
          );
        })}
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Barre de recherche */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par titre, patient ou médecin..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtres */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            {hasRole('MEDECIN') && (
              <label className="flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={showMyDocumentsOnly}
                  onChange={(e) => setShowMyDocumentsOnly(e.target.checked)}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-blue-900">Mes documents uniquement</span>
              </label>
            )}

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les types</option>
              {DOCUMENT_TYPES.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="completed">Terminé</option>
              <option value="signed">Signé</option>
              <option value="pending">En attente</option>
              <option value="draft">Brouillon</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des documents */}
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Header du tableau */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Documents récents ({filteredDocuments.length})
            </h2>
          </div>
        </div>

        {/* Corps du tableau */}
        <div className="overflow-x-auto">
          {filteredDocuments.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun document trouvé</h3>
              <p className="text-gray-500">
                {searchTerm || selectedType !== 'all' || selectedStatus !== 'all'
                  ? 'Essayez de modifier vos critères de recherche.'
                  : 'Commencez par créer votre premier document.'
                }
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Créé par
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((document) => {
                  const typeInfo = getDocumentTypeInfo(document.type);
                  const statusInfo = getStatusBadge(document.status);
                  const TypeIcon = typeInfo.icon;

                  return (
                    <tr key={document.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 ${typeInfo.color} rounded-lg flex items-center justify-center mr-3`}>
                            <TypeIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{document.title}</div>
                            <div className="text-sm text-gray-500">{typeInfo.label} • {document.size}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <span className="text-sm font-medium text-gray-900">{document.patient}</span>
                            {document.patientId && (
                              <div className="text-xs text-gray-500">{document.patientId}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500">
                            {new Date(document.date).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.class}`}>
                          <statusInfo.icon className="w-3 h-3 mr-1" />
                          {statusInfo.label}
                        </span>
                        {document.signedBy && document.signedAt && (
                          <div className="text-xs text-gray-500 mt-1">
                            Signé par {document.signedBy}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {document.createdBy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            className="text-gray-400 hover:text-blue-500 transition-colors"
                            title="Voir le document"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="text-gray-400 hover:text-green-500 transition-colors"
                            title="Télécharger"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          {document.patientId && (
                            <button
                              className="text-gray-400 hover:text-purple-500 transition-colors"
                              title="Voir dossier patient"
                              onClick={() => window.location.href = `/patients/dossiers?patient=${document.patientId}`}
                            >
                              <User className="w-4 h-4" />
                            </button>
                          )}
                          {document.status === 'draft' && hasRole(['ADMIN_CLINIQUE', 'MEDECIN']) && (
                            <button
                              className="text-gray-400 hover:text-blue-600 transition-colors"
                              title="Signer le document"
                              onClick={() => handleSignDocument(document)}
                            >
                              <PenTool className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            className="text-gray-400 hover:text-indigo-500 transition-colors"
                            title="Partager"
                          >
                            <Share className="w-4 h-4" />
                          </button>
                          {hasRole(['ADMIN_CLINIQUE', 'MEDECIN']) && (
                            <>
                              <button
                                className="text-gray-400 hover:text-yellow-500 transition-colors"
                                title="Modifier"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                className="text-gray-400 hover:text-red-500 transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Création Document Template */}
      {showDocumentModal && (
        <DocumentTemplateModal
          documentType={selectedDocumentType}
          onClose={() => {
            setShowDocumentModal(false);
            setSelectedDocumentType(null);
          }}
          onCreateDocument={createDocumentFromTemplate}
        />
      )}

      {/* Modal Signature Électronique */}
      {showSignatureModal && documentToSign && (
        <SignatureModal
          document={documentToSign}
          onClose={() => {
            setShowSignatureModal(false);
            setDocumentToSign(null);
          }}
          onConfirm={confirmSignature}
          doctorName={`${user.firstName} ${user.lastName}` || 'Dr. Martin'}
        />
      )}
    </div>
  );
}

// Modal Template Document
function DocumentTemplateModal({ documentType, onClose, onCreateDocument }) {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    patient: '',
    patientId: '',
    content: '',
    tags: [],
    dateDebut: '',
    dateFin: ''
  });

  const [patients] = useState([
    { id: 'P001234', name: 'Marie Dubois', birthDate: '1990-05-15' },
    { id: 'P001235', name: 'Jean Martin', birthDate: '1978-09-22' },
    { id: 'P001236', name: 'Sophie Bernard', birthDate: '1985-03-10' },
    { id: 'P001237', name: 'Pierre Moreau', birthDate: '1992-11-08' },
    { id: 'P001238', name: 'Lucas Thomas', birthDate: '1980-07-14' },
    { id: 'P001239', name: 'Emma Leroy', birthDate: '1995-03-22' }
  ]);

  const [patientSearch, setPatientSearch] = useState('');
  const [showPatientList, setShowPatientList] = useState(false);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    patient.id.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const documentTemplates = {
    certificat: {
      title: 'Certificat médical',
      templates: [
        {
          name: 'Arrêt de travail',
          defaultTitle: 'Certificat d\'arrêt de travail',
          content: 'Je soussigné(e), Dr. [NOM], certifie que [PATIENT] nécessite un arrêt de travail du [DATE_DEBUT] au [DATE_FIN] pour motif médical.',
          tags: ['arrêt_travail']
        },
        {
          name: 'Aptitude au sport',
          defaultTitle: 'Certificat d\'aptitude au sport',
          content: 'Je soussigné(e), Dr. [NOM], certifie que [PATIENT] est apte à la pratique sportive.',
          tags: ['sport', 'aptitude']
        },
        {
          name: 'Contre-indication',
          defaultTitle: 'Certificat de contre-indication',
          content: 'Je soussigné(e), Dr. [NOM], certifie que [PATIENT] présente une contre-indication médicale à [ACTIVITE].',
          tags: ['contre_indication']
        }
      ]
    },
    attestation: {
      title: 'Attestation médicale',
      templates: [
        {
          name: 'Vaccination',
          defaultTitle: 'Attestation de vaccination',
          content: 'Je soussigné(e), Dr. [NOM], atteste que [PATIENT] a reçu le vaccin [VACCIN] le [DATE].',
          tags: ['vaccination']
        },
        {
          name: 'Soins médicaux',
          defaultTitle: 'Attestation de soins',
          content: 'Je soussigné(e), Dr. [NOM], atteste que [PATIENT] a bénéficié de soins médicaux du [DATE_DEBUT] au [DATE_FIN].',
          tags: ['soins']
        }
      ]
    },
    autre: {
      title: 'Document médical',
      templates: [
        {
          name: 'Document personnalisé',
          defaultTitle: 'Document médical',
          content: 'Contenu du document à personnaliser...',
          tags: ['personnalisé']
        }
      ]
    }
  };

  const currentTemplates = documentTemplates[documentType] || documentTemplates.autre;

  const handleTemplateSelect = (template) => {
    const doctorName = `${user.firstName} ${user.lastName}` || 'Dr. Martin';

    let content = template.content;
    // Remplacer le nom du médecin
    content = content.replace(/\[NOM\]/g, doctorName);

    setFormData(prev => ({
      ...prev,
      title: template.defaultTitle,
      content: content,
      tags: template.tags
    }));
  };

  const handlePatientSelect = (patient) => {
    setFormData(prev => {
      // Remplacer le nom du patient dans le contenu
      let updatedContent = prev.content.replace(/\[PATIENT\]/g, patient.name);

      return {
        ...prev,
        patient: patient.name,
        patientId: patient.id,
        content: updatedContent
      };
    });
    setPatientSearch(patient.name);
    setShowPatientList(false);
  };

  const handlePatientSearchChange = (e) => {
    setPatientSearch(e.target.value);
    setShowPatientList(true);
    // Reset sélection si l'utilisateur tape
    if (formData.patient !== e.target.value) {
      setFormData(prev => ({
        ...prev,
        patient: e.target.value,
        patientId: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation des champs obligatoires
    if (!formData.title || !formData.patientId) {
      alert('Veuillez sélectionner un patient et remplir tous les champs requis');
      return;
    }

    // Validation des dates pour les arrêts de travail
    if (needsDates) {
      if (!formData.dateDebut || !formData.dateFin) {
        alert('Veuillez sélectionner les dates de début et de fin d\'arrêt');
        return;
      }
      if (new Date(formData.dateFin) <= new Date(formData.dateDebut)) {
        alert('La date de fin doit être postérieure à la date de début');
        return;
      }
    }

    onCreateDocument(formData);
  };

  // Variable pour savoir si ce template utilise des dates
  const needsDates = formData.tags.includes('arrêt_travail') ||
                     formData.content.includes('[DATE_DEBUT]') ||
                     formData.content.includes('[DATE_FIN]') ||
                     (formData.dateDebut || formData.dateFin); // Garde les champs si dates déjà saisies

  // Gérer les changements de dates
  const handleDateChange = (dateType, value) => {
    setFormData(prev => {
      const newFormData = { ...prev, [dateType]: value };

      // Mettre à jour le contenu avec les nouvelles dates
      let updatedContent = prev.content;

      if (dateType === 'dateDebut' || (dateType === 'dateFin' && prev.dateDebut)) {
        const dateDebut = dateType === 'dateDebut' ? value : prev.dateDebut;
        const dateFin = dateType === 'dateFin' ? value : prev.dateFin;

        if (dateDebut) {
          updatedContent = updatedContent.replace(/\[DATE_DEBUT\]/g,
            new Date(dateDebut).toLocaleDateString('fr-FR'));
        }
        if (dateFin) {
          updatedContent = updatedContent.replace(/\[DATE_FIN\]/g,
            new Date(dateFin).toLocaleDateString('fr-FR'));
        }
      }

      return { ...newFormData, content: updatedContent };
    });
  };

  // Fermer dropdown si clic extérieur
  const handleClickOutside = (e) => {
    if (!e.target.closest('.patient-search-container')) {
      setShowPatientList(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClickOutside}
    >
      <div
        className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Créer un {currentTemplates.title}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Sélection template */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Choisir un modèle</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentTemplates.templates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => handleTemplateSelect(template)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left transition-colors"
                >
                  <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
                  <p className="text-sm text-gray-600">{template.defaultTitle}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre du document *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Titre du document"
                />
              </div>
              <div className="relative patient-search-container">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient *
                </label>
                <input
                  type="text"
                  value={patientSearch}
                  onChange={handlePatientSearchChange}
                  onFocus={() => setShowPatientList(true)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Rechercher un patient par nom ou numéro..."
                />

                {/* Dropdown liste patients */}
                {showPatientList && patientSearch && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map((patient) => (
                        <button
                          key={patient.id}
                          type="button"
                          onClick={() => handlePatientSelect(patient)}
                          className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{patient.name}</p>
                              <p className="text-sm text-gray-600">
                                {patient.id} • {new Date().getFullYear() - new Date(patient.birthDate).getFullYear()} ans
                              </p>
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(patient.birthDate).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-500 text-sm">
                        Aucun patient trouvé
                      </div>
                    )}
                  </div>
                )}

                {/* Affichage patient sélectionné */}
                {formData.patientId && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-900">Patient sélectionné :</p>
                        <p className="text-blue-800">{formData.patient} ({formData.patientId})</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, patient: '', patientId: '' }));
                          setPatientSearch('');
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Champs de dates pour les certificats */}
            {needsDates && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de début d'arrêt *
                  </label>
                  <input
                    type="date"
                    value={formData.dateDebut}
                    onChange={(e) => handleDateChange('dateDebut', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de fin d'arrêt *
                  </label>
                  <input
                    type="date"
                    value={formData.dateFin}
                    onChange={(e) => handleDateChange('dateFin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    min={formData.dateDebut || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenu du document
              </label>
              <textarea
                rows={8}
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contenu du document..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Créer le document
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Modal Signature Électronique
function SignatureModal({ document, onClose, onConfirm, doctorName }) {
  const [signatureConfirmed, setSignatureConfirmed] = useState(false);

  const handleConfirm = () => {
    if (!signatureConfirmed) {
      alert('Veuillez confirmer votre signature');
      return;
    }
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Signature Électronique</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Document à signer :</h3>
            <p className="text-blue-800">{document.title}</p>
            <p className="text-blue-700 text-sm">Patient : {document.patient}</p>
            <p className="text-blue-700 text-sm">Date : {new Date(document.date).toLocaleDateString('fr-FR')}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <PenTool className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h4 className="font-medium text-gray-900">Signature électronique</h4>
                <p className="text-sm text-gray-600">
                  En signant ce document, vous certifiez son authenticité et sa conformité.
                  La signature sera horodatée et légalement valide.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Signataire :</strong> {doctorName}<br />
                <strong>Date :</strong> {new Date().toLocaleDateString('fr-FR')}<br />
                <strong>Heure :</strong> {new Date().toLocaleTimeString('fr-FR')}
              </p>
            </div>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={signatureConfirmed}
                onChange={(e) => setSignatureConfirmed(e.target.checked)}
                className="mt-1 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Je confirme que j'ai relu ce document et que je souhaite le signer électroniquement.
                Cette signature a la même valeur légale qu'une signature manuscrite.
              </span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              disabled={!signatureConfirmed}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                signatureConfirmed
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>Signer le document</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}