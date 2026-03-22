import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { insuranceService } from '../../services/insuranceService';
import {
  Plus,
  Upload,
  Download,
  Edit3,
  Trash2,
  Save,
  X,
  Search,
  FileText,
  Shield,
  Building2,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Filter,
  FileSpreadsheet
} from 'lucide-react';

export default function InsuranceManagement() {
  const { user, hasPermission, PERMISSIONS } = useAuth();
  const [activeTab, setActiveTab] = useState('mutuelles');

  // États pour les mutuelles
  const [mutuelles, setMutuelles] = useState([]);
  const [filteredMutuelles, setFilteredMutuelles] = useState([]);

  // États pour les assurances privées
  const [assurancesPrivees, setAssurancesPrivees] = useState([]);
  const [filteredAssurancesPrivees, setFilteredAssurancesPrivees] = useState([]);

  // États généraux
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // États pour les modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // États pour les formulaires
  const [newItem, setNewItem] = useState({
    name: '',
    code: '',
    description: '',
    active: true,
    contactInfo: {
      phone: '',
      email: '',
      website: '',
      address: ''
    }
  });

  // États pour l'import Excel
  const [importFile, setImportFile] = useState(null);
  const [importProgress, setImportProgress] = useState(0);
  const [importing, setImporting] = useState(false);

  // Vérifications des permissions
  const canManageInsurance = hasPermission(PERMISSIONS.MANAGE_CLINIC_SETTINGS);

  useEffect(() => {
    if (canManageInsurance) {
      loadData();
    }
  }, [canManageInsurance]);

  useEffect(() => {
    filterData();
  }, [searchTerm, mutuelles, assurancesPrivees]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [mutuellesData, assurancesData] = await Promise.all([
        insuranceService.getMutuelles(),
        insuranceService.getAssurancesPrivees()
      ]);
      setMutuelles(mutuellesData);
      setAssurancesPrivees(assurancesData);
    } catch (error) {
      setError('Erreur lors du chargement des données: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    const term = searchTerm.toLowerCase();

    const filteredMut = mutuelles.filter(item =>
      item.name?.toLowerCase().includes(term) ||
      item.code?.toLowerCase().includes(term)
    );
    setFilteredMutuelles(filteredMut);

    const filteredAss = assurancesPrivees.filter(item =>
      item.name?.toLowerCase().includes(term) ||
      item.code?.toLowerCase().includes(term)
    );
    setFilteredAssurancesPrivees(filteredAss);
  };

  const resetForm = () => {
    setNewItem({
      name: '',
      code: '',
      description: '',
      active: true,
      contactInfo: {
        phone: '',
        email: '',
        website: '',
        address: ''
      }
    });
    setEditingItem(null);
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      if (activeTab === 'mutuelles') {
        await insuranceService.createMutuelle(newItem);
        setSuccess('Mutuelle créée avec succès');
      } else {
        await insuranceService.createAssurancePrivee(newItem);
        setSuccess('Assurance privée créée avec succès');
      }

      resetForm();
      setShowCreateModal(false);
      await loadData();
    } catch (error) {
      setError('Erreur lors de la création: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      if (activeTab === 'mutuelles') {
        await insuranceService.updateMutuelle(editingItem.id, newItem);
        setSuccess('Mutuelle mise à jour avec succès');
      } else {
        await insuranceService.updateAssurancePrivee(editingItem.id, newItem);
        setSuccess('Assurance privée mise à jour avec succès');
      }

      resetForm();
      setShowCreateModal(false);
      await loadData();
    } catch (error) {
      setError('Erreur lors de la mise à jour: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;

    try {
      setLoading(true);
      if (activeTab === 'mutuelles') {
        await insuranceService.deleteMutuelle(id);
        setSuccess('Mutuelle supprimée avec succès');
      } else {
        await insuranceService.deleteAssurancePrivee(id);
        setSuccess('Assurance privée supprimée avec succès');
      }

      await loadData();
    } catch (error) {
      setError('Erreur lors de la suppression: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setNewItem({
      name: item.name || '',
      code: item.code || '',
      description: item.description || '',
      active: item.active ?? true,
      contactInfo: {
        phone: item.contactInfo?.phone || '',
        email: item.contactInfo?.email || '',
        website: item.contactInfo?.website || '',
        address: item.contactInfo?.address || ''
      }
    });
    setShowCreateModal(true);
  };

  const handleImportExcel = async () => {
    if (!importFile) return;

    try {
      setImporting(true);
      setImportProgress(0);

      // Simulation du progrès d'import
      const progressInterval = setInterval(() => {
        setImportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await insuranceService.importFromExcel(importFile, activeTab === 'mutuelles' ? 'mutuelle' : 'assurance-privee');

      clearInterval(progressInterval);
      setImportProgress(100);
      setSuccess('Import Excel réussi');
      setShowImportModal(false);
      setImportFile(null);
      await loadData();
    } catch (error) {
      setError('Erreur lors de l\'import Excel: ' + error.message);
    } finally {
      setImporting(false);
      setImportProgress(0);
    }
  };

  const downloadTemplate = async () => {
    try {
      await insuranceService.downloadExcelTemplate(activeTab === 'mutuelles' ? 'mutuelle' : 'assurance-privee');
      setSuccess('Template téléchargé avec succès');
    } catch (error) {
      setError('Erreur lors du téléchargement: ' + error.message);
    }
  };

  if (!canManageInsurance) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès non autorisé</h2>
          <p className="text-gray-600">Vous n'avez pas les permissions pour gérer les assurances.</p>
        </div>
      </div>
    );
  }

  const currentData = activeTab === 'mutuelles' ? filteredMutuelles : filteredAssurancesPrivees;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Assurances</h1>
            <p className="text-gray-600 mt-1">Gérez les mutuelles et assurances privées</p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={downloadTemplate}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Template Excel
            </button>

            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Excel
            </button>

            <button
              onClick={() => {
                resetForm();
                setShowCreateModal(true);
              }}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <span className="text-red-700">{error}</span>
            <button
              onClick={() => setError('')}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <span className="text-green-700">{success}</span>
            <button
              onClick={() => setSuccess('')}
              className="ml-auto text-green-600 hover:text-green-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('mutuelles')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'mutuelles'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Shield className="w-4 h-4 inline mr-2" />
            Mutuelles ({mutuelles.length})
          </button>

          <button
            onClick={() => setActiveTab('assurances')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'assurances'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Building2 className="w-4 h-4 inline mr-2" />
            Assurances Privées ({assurancesPrivees.length})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder={`Rechercher ${activeTab === 'mutuelles' ? 'une mutuelle' : 'une assurance'}...`}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      {item.description && (
                        <div className="text-sm text-gray-500">{item.description}</div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{item.code || '-'}</span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.contactInfo?.phone && (
                        <div>📞 {item.contactInfo.phone}</div>
                      )}
                      {item.contactInfo?.email && (
                        <div>✉️ {item.contactInfo.email}</div>
                      )}
                      {!item.contactInfo?.phone && !item.contactInfo?.email && '-'}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {currentData.length === 0 && !loading && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm
                ? 'Aucun résultat trouvé'
                : `Aucune ${activeTab === 'mutuelles' ? 'mutuelle' : 'assurance privée'} enregistrée`
              }
            </p>
          </div>
        )}
      </div>

      {/* Modal Create/Edit */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingItem ? 'Modifier' : 'Créer'} {activeTab === 'mutuelles' ? 'une mutuelle' : 'une assurance privée'}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Informations de base */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Nom de la compagnie"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Code
                    </label>
                    <input
                      type="text"
                      value={newItem.code}
                      onChange={(e) => setNewItem({...newItem, code: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Code unique"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows={3}
                    placeholder="Description optionnelle"
                  />
                </div>

                {/* Informations de contact */}
                <div className="border-t pt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Informations de contact</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={newItem.contactInfo.phone}
                        onChange={(e) => setNewItem({
                          ...newItem,
                          contactInfo: {...newItem.contactInfo, phone: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="01 23 45 67 89"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={newItem.contactInfo.email}
                        onChange={(e) => setNewItem({
                          ...newItem,
                          contactInfo: {...newItem.contactInfo, email: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="contact@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site web
                      </label>
                      <input
                        type="url"
                        value={newItem.contactInfo.website}
                        onChange={(e) => setNewItem({
                          ...newItem,
                          contactInfo: {...newItem.contactInfo, website: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="https://example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Statut
                      </label>
                      <select
                        value={newItem.active}
                        onChange={(e) => setNewItem({...newItem, active: e.target.value === 'true'})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="true">Actif</option>
                        <option value="false">Inactif</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse
                    </label>
                    <textarea
                      value={newItem.contactInfo.address}
                      onChange={(e) => setNewItem({
                        ...newItem,
                        contactInfo: {...newItem.contactInfo, address: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      rows={2}
                      placeholder="Adresse complète"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Annuler
                  </button>

                  <button
                    onClick={editingItem ? handleUpdate : handleCreate}
                    disabled={loading || !newItem.name}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    {loading && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                    <Save className="w-4 h-4 mr-2" />
                    {editingItem ? 'Mettre à jour' : 'Créer'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Import Excel */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Import Excel - {activeTab === 'mutuelles' ? 'Mutuelles' : 'Assurances Privées'}
                </h3>
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportFile(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fichier Excel
                  </label>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => setImportFile(e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés: .xlsx, .xls
                  </p>
                </div>

                {importing && (
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Import en cours...</span>
                      <span>{importProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${importProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <FileSpreadsheet className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                    <div className="text-sm">
                      <p className="text-blue-800 font-medium mb-1">Format requis:</p>
                      <p className="text-blue-700">
                        Le fichier Excel doit contenir les colonnes: <br />
                        <code className="bg-blue-100 px-1 rounded">Nom</code>,
                        <code className="bg-blue-100 px-1 rounded ml-1">Code</code>,
                        <code className="bg-blue-100 px-1 rounded ml-1">Description</code>,
                        <code className="bg-blue-100 px-1 rounded ml-1">Téléphone</code>,
                        <code className="bg-blue-100 px-1 rounded ml-1">Email</code>
                      </p>
                      <button
                        onClick={downloadTemplate}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 inline-flex items-center"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Télécharger le template
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportFile(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>

                <button
                  onClick={handleImportExcel}
                  disabled={!importFile || importing}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {importing && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                  <Upload className="w-4 h-4 mr-2" />
                  Importer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}