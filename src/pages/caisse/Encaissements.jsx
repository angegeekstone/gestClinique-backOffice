import { useState } from 'react';
import {
  CreditCard,
  Banknote,
  Receipt,
  User,
  Search,
  Plus,
  Check,
  X,
  Calculator,
  Clock,
  AlertCircle
} from 'lucide-react';

const patientsList = [
  { id: 1, name: 'Marie Dubois', phone: '+225 07 12 34 56 78' },
  { id: 2, name: 'Jean Martin', phone: '+225 05 23 45 67 89' },
  { id: 3, name: 'Sophie Bernard', phone: '+225 01 34 56 78 90' },
  { id: 4, name: 'Pierre Lefebvre', phone: '+225 07 45 67 89 01' },
  { id: 5, name: 'Anne Moreau', phone: '+225 05 56 78 90 12' }
];

const consultationTypes = [
  { id: 1, name: 'Consultation générale', price: 32800 },
  { id: 2, name: 'Consultation cardiologie', price: 49200 },
  { id: 3, name: 'Consultation pédiatrie', price: 39300 },
  { id: 4, name: 'Consultation gynécologie', price: 42600 },
  { id: 5, name: 'Radiologie', price: 78600 },
  { id: 6, name: 'Analyses biologiques', price: 65500 }
];

export default function Encaissements() {
  const [showNewPayment, setShowNewPayment] = useState(false);
  const [searchPatient, setSearchPatient] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedConsultation, setSelectedConsultation] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [description, setDescription] = useState('');

  const filteredPatients = patientsList.filter(patient =>
    patient.name.toLowerCase().includes(searchPatient.toLowerCase())
  );

  const selectedConsultationType = consultationTypes.find(c => c.id === parseInt(selectedConsultation));
  const finalAmount = customAmount ? parseInt(customAmount) : selectedConsultationType?.price || 0;

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    if (!selectedPatient || !finalAmount) return;

    // Ici on traiterait le paiement
    console.log('Nouveau paiement:', {
      patient: selectedPatient,
      amount: finalAmount,
      method: paymentMethod,
      description: description || selectedConsultationType?.name,
      timestamp: new Date().toISOString()
    });

    // Reset form
    setSelectedPatient(null);
    setSelectedConsultation('');
    setCustomAmount('');
    setDescription('');
    setSearchPatient('');
    setShowNewPayment(false);
  };

  const recentPayments = [
    {
      id: 1,
      patient: 'Marie Dubois',
      amount: 32800,
      method: 'card',
      time: '14:25',
      description: 'Consultation générale'
    },
    {
      id: 2,
      patient: 'Jean Martin',
      amount: 49200,
      method: 'cash',
      time: '14:15',
      description: 'Consultation cardiologie'
    },
    {
      id: 3,
      patient: 'Sophie Bernard',
      amount: 78600,
      method: 'card',
      time: '14:05',
      description: 'Radiologie'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Encaissements</h1>
          <p className="text-gray-600">Gestion des paiements et encaissements</p>
        </div>
        <button
          onClick={() => setShowNewPayment(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nouveau Paiement</span>
        </button>
      </div>

      {/* Statistiques du jour */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Encaissé</p>
              <p className="text-2xl font-bold text-green-600">183.100 FCFA</p>
            </div>
            <CreditCard className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Espèces</p>
              <p className="text-2xl font-bold text-yellow-600">65.600 FCFA</p>
            </div>
            <Banknote className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cartes</p>
              <p className="text-2xl font-bold text-blue-600">117.500 FCFA</p>
            </div>
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-purple-600">47</p>
            </div>
            <Receipt className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Paiements récents */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Paiements récents</h3>
        <div className="space-y-4">
          {recentPayments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{payment.patient}</p>
                  <p className="text-sm text-gray-600">{payment.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-bold text-green-600">{payment.amount.toLocaleString('fr-FR')} FCFA</p>
                  <p className="text-sm text-gray-500">{payment.time}</p>
                </div>
                <div className={`p-2 rounded-full ${
                  payment.method === 'cash' ? 'bg-yellow-100' : 'bg-blue-100'
                }`}>
                  {payment.method === 'cash' ? (
                    <Banknote className="w-5 h-5 text-yellow-600" />
                  ) : (
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Nouveau Paiement */}
      {showNewPayment && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />

            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Nouveau Paiement</h3>
                <button
                  onClick={() => setShowNewPayment(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitPayment} className="space-y-6">
                {/* Recherche Patient */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Rechercher un patient..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={searchPatient}
                      onChange={(e) => setSearchPatient(e.target.value)}
                    />
                  </div>
                  {searchPatient && filteredPatients.length > 0 && (
                    <div className="mt-2 border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                      {filteredPatients.map((patient) => (
                        <button
                          key={patient.id}
                          type="button"
                          onClick={() => {
                            setSelectedPatient(patient);
                            setSearchPatient(patient.name);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                        >
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-gray-600">{patient.phone}</p>
                        </button>
                      ))}
                    </div>
                  )}
                  {selectedPatient && (
                    <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-900">{selectedPatient.name}</p>
                          <p className="text-sm text-green-700">{selectedPatient.phone}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Type de consultation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type de consultation</label>
                  <select
                    value={selectedConsultation}
                    onChange={(e) => setSelectedConsultation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez un type</option>
                    {consultationTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name} - {type.price.toLocaleString('fr-FR')} FCFA
                      </option>
                    ))}
                  </select>
                </div>

                {/* Montant personnalisé */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Montant personnalisé (optionnel)</label>
                  <div className="relative">
                    <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      placeholder="Montant en FCFA"
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                    />
                  </div>
                </div>

                {/* Méthode de paiement */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Méthode de paiement</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`p-4 border rounded-lg flex items-center justify-center space-x-2 ${
                        paymentMethod === 'cash'
                          ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <Banknote className="w-6 h-6" />
                      <span>Espèces</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 border rounded-lg flex items-center justify-center space-x-2 ${
                        paymentMethod === 'card'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <CreditCard className="w-6 h-6" />
                      <span>Carte</span>
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description (optionnel)</label>
                  <input
                    type="text"
                    placeholder="Description du paiement"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Résumé */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Résumé du paiement</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Patient:</span>
                      <span className="font-medium">{selectedPatient?.name || 'Non sélectionné'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Montant:</span>
                      <span className="font-bold text-green-600">
                        {finalAmount ? `${finalAmount.toLocaleString('fr-FR')} FCFA` : '0 FCFA'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Méthode:</span>
                      <span className="font-medium">
                        {paymentMethod === 'cash' ? 'Espèces' : 'Carte'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewPayment(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedPatient || !finalAmount}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Encaisser
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}