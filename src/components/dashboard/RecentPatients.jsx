import { User, Calendar, Clock, Loader, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService.js';

const getStatusColor = (status) => {
  switch (status) {
    case 'En consultation':
    case 'ACTIVE':
      return 'bg-green-100 text-green-800';
    case 'Suivi':
    case 'FOLLOW_UP':
      return 'bg-blue-100 text-blue-800';
    case 'Terminé':
    case 'COMPLETED':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatLastVisit = (dateString) => {
  if (!dateString) return 'Pas de visite';

  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "Aujourd'hui";
  if (diffDays === 2) return "Hier";
  if (diffDays <= 7) return `Il y a ${diffDays - 1} jours`;

  return date.toLocaleDateString('fr-FR');
};

export default function RecentPatients() {
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecentPatients();
  }, []);

  const fetchRecentPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const patients = await dashboardService.getRecentPatients(5);
      setRecentPatients(patients || []);
    } catch (err) {
      console.error('Erreur lors du chargement des patients récents:', err);
      setError('Erreur de chargement');
      setRecentPatients([]);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-48">
          <div className="flex items-center space-x-2">
            <Loader className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-gray-600">Chargement des patients...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Patients récents</h3>
        <div className="flex items-center space-x-2">
          {error && (
            <div className="flex items-center text-orange-600 text-xs">
              <AlertCircle className="w-3 h-3 mr-1" />
              <span>Erreur</span>
            </div>
          )}
          <button
            onClick={fetchRecentPatients}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Actualiser
          </button>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Voir tout
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {recentPatients.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Aucun patient récent</p>
          </div>
        ) : (
          recentPatients.map((patient) => (
            <div key={patient.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-blue-600" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {patient.firstName && patient.lastName
                    ? `${patient.firstName} ${patient.lastName}`
                    : patient.name || 'Patient inconnu'
                  }
                </p>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{patient.age || patient.dateOfBirth ?
                    new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear() + ' ans'
                    : 'Age inconnu'}
                  </span>
                  <span className="mx-2">•</span>
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{formatLastVisit(patient.lastVisit || patient.createdAt)}</span>
                </div>
              </div>

              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                {patient.status === 'ACTIVE' ? 'Actif' :
                 patient.status === 'FOLLOW_UP' ? 'Suivi' :
                 patient.status === 'COMPLETED' ? 'Terminé' : patient.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}