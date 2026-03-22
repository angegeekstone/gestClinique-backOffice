import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import {
  DollarSign,
  Plus,
  Edit3,
  Trash2,
  Search,
  Check,
  AlertCircle,
  X,
  Loader,
  Stethoscope,
  Clock
} from 'lucide-react';

export default function PricingManagement() {
  const [specialities, setSpecialities] = useState([]);
  const [consultationTypes, setConsultationTypes] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPrice, setEditingPrice] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    specialityId: '',
    consultationType: '',
    price: '',
    duration: 30,
    description: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [specialitiesData] = await Promise.all([
        userService.getAllSpecialities()
      ]);

      setSpecialities(specialitiesData);

      // Types de consultation par défaut (à remplacer par API)
      setConsultationTypes([
        { id: 1, name: 'Consultation standard', duration: 30 },
        { id: 2, name: 'Consultation de suivi', duration: 20 },
        { id: 3, name: 'Consultation urgente', duration: 45 },
        { id: 4, name: 'Première consultation', duration: 60 }
      ]);

      // Données de tarification simulées (à remplacer par API)
      setPricing([
        { id: 1, specialityId: 1, specialityName: 'Cardiologie', consultationType: 'Consultation standard', price: 60, duration: 30, description: 'Consultation cardiologique standard' },
        { id: 2, specialityId: 1, specialityName: 'Cardiologie', consultationType: 'Première consultation', price: 80, duration: 60, description: 'Première consultation avec examen complet' }
      ]);

    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (priceToEdit = null) => {
    if (priceToEdit) {
      setEditingPrice(priceToEdit);
      setFormData({
        specialityId: priceToEdit.specialityId || '',
        consultationType: priceToEdit.consultationType || '',
        price: priceToEdit.price || '',
        duration: priceToEdit.duration || 30,
        description: priceToEdit.description || ''
      });
    } else {
      setEditingPrice(null);
      setFormData({
        specialityId: '',
        consultationType: '',
        price: '',
        duration: 30,
        description: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPrice(null);
    setFormData({
      specialityId: '',
      consultationType: '',
      price: '',
      duration: 30,
      description: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const speciality = specialities.find(s => s.id === parseInt(formData.specialityId));
      const newPricing = {
        id: editingPrice ? editingPrice.id : Date.now(),
        specialityId: parseInt(formData.specialityId),
        specialityName: speciality?.name,
        consultationType: formData.consultationType,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        description: formData.description
      };

      if (editingPrice) {
        setPricing(prev => prev.map(p => p.id === editingPrice.id ? newPricing : p));
        setNotification({
          type: 'success',
          message: 'Tarif modifié avec succès'
        });
      } else {
        setPricing(prev => [...prev, newPricing]);
        setNotification({
          type: 'success',
          message: 'Tarif créé avec succès'
        });
      }

      handleCloseModal();
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Erreur lors de la sauvegarde'
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleDelete = (priceId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce tarif ?')) {
      setPricing(prev => prev.filter(p => p.id !== priceId));
      setNotification({
        type: 'success',
        message: 'Tarif supprimé avec succès'
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const filteredPricing = pricing.filter(price =>
    price.specialityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    price.consultationType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion de la Tarification</h1>
          <p className="text-gray-600">Définissez les prix des consultations par spécialité</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nouveau Tarif</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par spécialité ou type de consultation..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Spécialité</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Type de Consultation</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Prix</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Durée</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPricing.map((price) => (
                  <tr key={price.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Stethoscope className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">{price.specialityName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-900">{price.consultationType}</span>
                      {price.description && (
                        <div className="text-sm text-gray-500">{price.description}</div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-lg font-semibold text-green-600">{price.price}€</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{price.duration} min</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleOpenModal(price)}
                          className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(price.id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPricing.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun tarif configuré</h3>
              <p className="text-gray-500">Commencez par ajouter vos premiers tarifs de consultation</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={handleCloseModal} />

            <div className="relative inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingPrice ? 'Modifier le tarif' : 'Nouveau tarif'}
                </h3>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
                  <select
                    value={formData.specialityId}
                    onChange={(e) => setFormData({ ...formData, specialityId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionnez une spécialité</option>
                    {specialities.map((speciality) => (
                      <option key={speciality.id} value={speciality.id}>
                        {speciality.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type de Consultation</label>
                  <select
                    value={formData.consultationType}
                    onChange={(e) => setFormData({ ...formData, consultationType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionnez un type</option>
                    {consultationTypes.map((type) => (
                      <option key={type.id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: 60.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Durée (min)</label>
                    <input
                      type="number"
                      min="15"
                      max="120"
                      step="15"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (optionnel)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Description du tarif..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingPrice ? 'Modifier' : 'Créer'}
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