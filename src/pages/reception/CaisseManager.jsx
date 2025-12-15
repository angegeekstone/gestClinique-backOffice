import { useState } from 'react';
import {
  DollarSign,
  CreditCard,
  Banknote,
  Receipt,
  Calendar,
  User,
  Search,
  Download,
  Eye,
  Plus,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const transactions = [
  {
    id: 1,
    type: 'payment',
    amount: 50,
    method: 'card',
    patient: 'Marie Dubois',
    description: 'Consultation générale',
    date: '2024-12-12T10:30:00',
    receipt: 'R001234'
  },
  {
    id: 2,
    type: 'payment',
    amount: 75,
    method: 'cash',
    patient: 'Jean Martin',
    description: 'Consultation cardiologie',
    date: '2024-12-12T09:15:00',
    receipt: 'R001235'
  },
  {
    id: 3,
    type: 'refund',
    amount: -25,
    method: 'card',
    patient: 'Sophie Bernard',
    description: 'Remboursement consultation annulée',
    date: '2024-12-11T16:45:00',
    receipt: 'R001236'
  },
  {
    id: 4,
    type: 'payment',
    amount: 120,
    method: 'card',
    patient: 'Pierre Lefebvre',
    description: 'Consultation + analyses',
    date: '2024-12-11T14:20:00',
    receipt: 'R001237'
  },
  {
    id: 5,
    type: 'payment',
    amount: 60,
    method: 'cash',
    patient: 'Anne Moreau',
    description: 'Consultation de suivi',
    date: '2024-12-11T11:00:00',
    receipt: 'R001238'
  }
];

const getMethodInfo = (method) => {
  const methodMap = {
    cash: {
      label: 'Espèces',
      icon: Banknote,
      color: 'bg-green-100 text-green-800 border-green-200'
    },
    card: {
      label: 'Carte',
      icon: CreditCard,
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    check: {
      label: 'Chèque',
      icon: Receipt,
      color: 'bg-purple-100 text-purple-800 border-purple-200'
    }
  };
  return methodMap[method] || methodMap.cash;
};

const getTypeColor = (type, amount) => {
  if (type === 'refund' || amount < 0) {
    return 'text-red-600';
  }
  return 'text-green-600';
};

export default function CaisseManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.receipt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = selectedMethod === 'all' || transaction.method === selectedMethod;
    const transactionDate = new Date(transaction.date).toISOString().split('T')[0];
    const matchesDate = !selectedDate || transactionDate === selectedDate;
    return matchesSearch && matchesMethod && matchesDate;
  });

  const todayTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date).toISOString().split('T')[0];
    return transactionDate === new Date().toISOString().split('T')[0];
  });

  const totalToday = todayTransactions.reduce((sum, t) => sum + t.amount, 0);
  const cashToday = todayTransactions
    .filter(t => t.method === 'cash')
    .reduce((sum, t) => sum + t.amount, 0);
  const cardToday = todayTransactions
    .filter(t => t.method === 'card')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion de Caisse</h1>
          <p className="text-gray-600">Suivi des encaissements et paiements</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Nouvel Encaissement</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Aujourd'hui</p>
              <p className="text-2xl font-bold text-gray-900">{totalToday}€</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+12.5%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Espèces</p>
              <p className="text-2xl font-bold text-gray-900">{cashToday}€</p>
              <p className="text-sm text-gray-500">
                {todayTransactions.filter(t => t.method === 'cash').length} transactions
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Banknote className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cartes</p>
              <p className="text-2xl font-bold text-gray-900">{cardToday}€</p>
              <p className="text-sm text-gray-500">
                {todayTransactions.filter(t => t.method === 'card').length} transactions
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{todayTransactions.length}</p>
              <p className="text-sm text-gray-500">Aujourd'hui</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Receipt className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par patient, description ou numéro de reçu..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <input
            type="date"
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
          >
            <option value="all">Tous les moyens</option>
            <option value="cash">Espèces</option>
            <option value="card">Carte</option>
            <option value="check">Chèque</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Reçu</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Patient</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Montant</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Méthode</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date & Heure</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => {
                const methodInfo = getMethodInfo(transaction.method);
                const MethodIcon = methodInfo.icon;

                return (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {transaction.receipt}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">{transaction.patient}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{transaction.description}</td>
                    <td className="py-4 px-4">
                      <span className={`font-semibold ${getTypeColor(transaction.type, transaction.amount)}`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount}€
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${methodInfo.color}`}>
                        <MethodIcon className="w-4 h-4 mr-1" />
                        {methodInfo.label}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600">
                        <div>{new Date(transaction.date).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(transaction.date).toLocaleTimeString()}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune transaction trouvée</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Fermeture Caisse</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
            <Receipt className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Rapport Journalier</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
            <Download className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Export Comptable</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
            <Calendar className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Planifier Export</p>
          </button>
        </div>
      </div>
    </div>
  );
}