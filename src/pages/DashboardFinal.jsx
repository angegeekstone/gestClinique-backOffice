import { Users, Calendar, DollarSign, TrendingUp, Stethoscope, FileText, Clock, CheckCircle, AlertTriangle, Pill, CreditCard, Receipt, Calculator, Euro, TrendingDown, UserPlus, Phone, CalendarCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardFinal() {
  const { user, hasRole } = useAuth();

  // Stats spécifiques selon le rôle
  const getMedecinStats = () => [
    {
      title: "Mes Patients",
      value: "156",
      change: "+8 cette semaine",
      icon: Users,
      color: "blue"
    },
    {
      title: "RDV Aujourd'hui",
      value: "12",
      change: "3 en attente",
      icon: Calendar,
      color: "green"
    },
    {
      title: "Consultations Mensuelles",
      value: "89",
      change: "+15% vs mois dernier",
      icon: Stethoscope,
      color: "purple"
    },
    {
      title: "Documents signés",
      value: "24",
      change: "6 en attente",
      icon: FileText,
      color: "orange"
    }
  ];

  const getCaisseStats = () => [
    {
      title: "Encaissements Aujourd'hui",
      value: "1.540.000 FCFA",
      change: "+12% vs hier",
      icon: Euro,
      color: "green"
    },
    {
      title: "Transactions Traitées",
      value: "47",
      change: "3 en attente",
      icon: Receipt,
      color: "blue"
    },
    {
      title: "Revenus Mensuels",
      value: "58.630.000 FCFA",
      change: "+18% vs mois dernier",
      icon: DollarSign,
      color: "purple"
    },
    {
      title: "Factures Impayées",
      value: "12",
      change: "-3 vs semaine dernière",
      icon: TrendingDown,
      color: "orange"
    }
  ];

  const getReceptionStats = () => [
    {
      title: "RDV Aujourd'hui",
      value: "28",
      change: "5 confirmés ce matin",
      icon: Calendar,
      color: "blue"
    },
    {
      title: "Nouveaux Patients",
      value: "7",
      change: "+3 vs hier",
      icon: UserPlus,
      color: "green"
    },
    {
      title: "Appels Téléphoniques",
      value: "42",
      change: "8 en attente de rappel",
      icon: Phone,
      color: "purple"
    },
    {
      title: "RDV Confirmés",
      value: "85%",
      change: "+12% vs semaine dernière",
      icon: CalendarCheck,
      color: "orange"
    }
  ];

  const getGeneralStats = () => [
    {
      title: "Total Patients",
      value: "1,250",
      change: "+12%",
      icon: Users,
      color: "blue"
    },
    {
      title: "RDV Aujourd'hui",
      value: "24",
      change: "+5%",
      icon: Calendar,
      color: "green"
    },
    {
      title: "Revenus Mensuel",
      value: "81.900.000 FCFA",
      change: "+15%",
      icon: DollarSign,
      color: "purple"
    },
    {
      title: "Taux d'occupation",
      value: "85%",
      change: "+8%",
      icon: TrendingUp,
      color: "orange"
    }
  ];

  const stats = hasRole('MEDECIN') ? getMedecinStats() :
                hasRole('CAISSE') ? getCaisseStats() :
                hasRole('RECEPTION') ? getReceptionStats() :
                getGeneralStats();

  const colorClasses = {
    blue: {
      icon: "text-blue-600 bg-blue-100",
      value: "text-blue-600",
      change: "text-green-600"
    },
    green: {
      icon: "text-green-600 bg-green-100",
      value: "text-green-600",
      change: "text-green-600"
    },
    purple: {
      icon: "text-purple-600 bg-purple-100",
      value: "text-purple-600",
      change: "text-green-600"
    },
    orange: {
      icon: "text-orange-600 bg-orange-100",
      value: "text-orange-600",
      change: "text-green-600"
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête adaptatif */}
      <div className="bg-white rounded-lg shadow p-6">
        {hasRole('MEDECIN') ? (
          <>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Bonjour Dr. {user?.lastName || user?.username || 'Médecin'}
                </h1>
                <p className="text-gray-600">Votre tableau de bord médical</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-gray-600">Prochain RDV: 14:30</span>
              </div>
              <div className="flex items-center text-sm">
                <AlertTriangle className="w-4 h-4 text-orange-600 mr-2" />
                <span className="text-gray-600">6 documents à signer</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-gray-600">3 consultations terminées</span>
              </div>
            </div>
          </>
        ) : hasRole('CAISSE') ? (
          <>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Bonjour {user?.firstName || user?.username || 'Caissier'}
                </h1>
                <p className="text-gray-600">Tableau de bord financier</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center text-sm">
                <Receipt className="w-4 h-4 text-orange-600 mr-2" />
                <span className="text-gray-600">Dernière transaction: 14:15</span>
              </div>
              <div className="flex items-center text-sm">
                <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                <span className="text-gray-600">3 paiements en attente</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-gray-600">47 transactions aujourd'hui</span>
              </div>
            </div>
          </>
        ) : hasRole('RECEPTION') ? (
          <>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Bonjour {user?.firstName || user?.username || 'Réceptionniste'}
                </h1>
                <p className="text-gray-600">Tableau de bord réception</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-gray-600">Prochain RDV: 14:45</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-gray-600">8 appels en attente</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-gray-600">28 RDV programmés aujourd'hui</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Clinique</h1>
            <p className="text-gray-600">Vue d'ensemble de votre activité</p>
          </>
        )}
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colors = colorClasses[stat.color];

          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${colors.icon}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className={`text-2xl font-bold ${colors.value}`}>
                    {stat.value}
                  </p>
                  <p className={`text-sm ${colors.change}`}>
                    {stat.change} vs mois dernier
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sections spécifiques selon le rôle */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {hasRole('MEDECIN') ? (
          <>
            {/* Mes prochains RDV */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Mes prochains RDV</h3>
                <span className="text-sm text-blue-600 font-medium">Aujourd'hui</span>
              </div>
              <div className="space-y-4">
                {[
                  { name: "Sophie Leblanc", time: "14:30", type: "Consultation générale", urgent: false },
                  { name: "Marc Petit", time: "15:00", type: "Suivi post-op", urgent: true },
                  { name: "Claire Moreau", time: "15:30", type: "Première consultation", urgent: false }
                ].map((rdv, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded hover:bg-blue-50 transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{rdv.name}</p>
                      <p className="text-sm text-gray-600">{rdv.time} - {rdv.type}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {rdv.urgent && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-medium">
                          Urgent
                        </span>
                      )}
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Confirmé
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                  Voir mon planning complet →
                </button>
              </div>
            </div>

            {/* Documents à traiter */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Documents à traiter</h3>
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded font-medium">
                  6 en attente
                </span>
              </div>
              <div className="space-y-4">
                {[
                  { type: "Certificat médical", patient: "Jean Martin", date: "Il y a 2h", priority: "normal" },
                  { type: "Ordonnance", patient: "Marie Dubois", date: "Il y a 3h", priority: "urgent" },
                  { type: "Rapport d'examen", patient: "Paul Bernard", date: "Il y a 5h", priority: "normal" }
                ].map((doc, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded hover:bg-orange-50 transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{doc.type}</p>
                      <p className="text-sm text-gray-600">Patient: {doc.patient} • {doc.date}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {doc.priority === 'urgent' && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        doc.priority === 'urgent'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        À signer
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full text-orange-600 text-sm font-medium hover:text-orange-700 transition-colors">
                  Gérer tous les documents →
                </button>
              </div>
            </div>
          </>
        ) : hasRole('CAISSE') ? (
          <>
            {/* Transactions récentes */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Transactions récentes</h3>
                <span className="text-sm text-orange-600 font-medium">Aujourd'hui</span>
              </div>
              <div className="space-y-4">
                {[
                  { patient: "Marie Dubois", amount: "55.700 FCFA", time: "14:15", type: "Consultation", status: "Payée" },
                  { patient: "Jean Martin", amount: "78.600 FCFA", time: "13:45", type: "Radiologie", status: "Payée" },
                  { patient: "Sophie Leblanc", amount: "42.600 FCFA", time: "13:20", type: "Consultation", status: "En attente" }
                ].map((transaction, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded hover:bg-orange-50 transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{transaction.patient}</p>
                      <p className="text-sm text-gray-600">{transaction.time} - {transaction.type}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-900">{transaction.amount}</span>
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        transaction.status === 'Payée'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full text-orange-600 text-sm font-medium hover:text-orange-700 transition-colors">
                  Voir toutes les transactions →
                </button>
              </div>
            </div>

            {/* Factures en attente */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Factures en attente</h3>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-medium">
                  12 impayées
                </span>
              </div>
              <div className="space-y-4">
                {[
                  { patient: "Pierre Bernard", amount: "62.300 FCFA", date: "02/03/2026", days: "2 jours", urgent: true },
                  { patient: "Claire Moreau", amount: "91.800 FCFA", date: "28/02/2026", days: "5 jours", urgent: false },
                  { patient: "Paul Durand", amount: "49.200 FCFA", date: "25/02/2026", days: "8 jours", urgent: false }
                ].map((facture, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded hover:bg-red-50 transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{facture.patient}</p>
                      <p className="text-sm text-gray-600">{facture.date} - {facture.days}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-900">{facture.amount}</span>
                      {facture.urgent && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-medium">
                          Urgent
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full text-red-600 text-sm font-medium hover:text-red-700 transition-colors">
                  Gérer les impayés →
                </button>
              </div>
            </div>
          </>
        ) : hasRole('RECEPTION') ? (
          <>
            {/* RDV du jour */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">RDV du jour</h3>
                <span className="text-sm text-green-600 font-medium">28 programmés</span>
              </div>
              <div className="space-y-4">
                {[
                  { patient: "Sophie Leblanc", time: "14:45", doctor: "Dr. Martin", status: "Confirmé", phone: "+225 07 12 34 56" },
                  { patient: "Marc Petit", time: "15:15", doctor: "Dr. Dubois", status: "En salle d'attente", phone: "+225 05 23 45 67" },
                  { patient: "Claire Moreau", time: "15:30", doctor: "Dr. Martin", status: "Confirmé", phone: "+225 01 34 56 78" }
                ].map((rdv, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded hover:bg-green-50 transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{rdv.patient}</p>
                      <p className="text-sm text-gray-600">{rdv.time} - Dr. {rdv.doctor.split(' ')[1]}</p>
                      <p className="text-xs text-gray-500">{rdv.phone}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        rdv.status === 'En salle d\'attente'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {rdv.status}
                      </span>
                      <button className="p-1 rounded-full hover:bg-blue-100">
                        <Phone className="w-4 h-4 text-blue-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full text-green-600 text-sm font-medium hover:text-green-700 transition-colors">
                  Voir tous les RDV du jour →
                </button>
              </div>
            </div>

            {/* Nouveaux patients */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Nouveaux patients</h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                  7 aujourd'hui
                </span>
              </div>
              <div className="space-y-4">
                {[
                  { name: "Emma Diallo", time: "Inscrit à 13:20", phone: "+225 07 89 01 23", firstVisit: true },
                  { name: "Ahmed Traore", time: "Inscrit à 12:45", phone: "+225 05 67 89 01", firstVisit: true },
                  { name: "Fatou Kone", time: "Inscrit à 11:30", phone: "+225 01 45 67 89", firstVisit: false }
                ].map((patient, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded hover:bg-blue-50 transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserPlus className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{patient.name}</p>
                      <p className="text-sm text-gray-600">{patient.time}</p>
                      <p className="text-xs text-gray-500">{patient.phone}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {patient.firstVisit && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-medium">
                          Première visite
                        </span>
                      )}
                      <button className="p-1 rounded-full hover:bg-green-100">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                  Gérer tous les patients →
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Patients récents (vue générale) */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Patients récents</h3>
              <div className="space-y-4">
                {[
                  { name: "Jean Dupont", time: "Il y a 2h", status: "Consultation terminée", doctor: "Dr. Martin" },
                  { name: "Marie Martin", time: "Il y a 3h", status: "En suivi", doctor: "Dr. Dubois" },
                  { name: "Pierre Bernard", time: "Il y a 5h", status: "Consultation terminée", doctor: "Dr. Martin" }
                ].map((patient, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{patient.name}</p>
                      <p className="text-sm text-gray-600">{patient.time} - {patient.status}</p>
                      <p className="text-xs text-gray-500">{patient.doctor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RDV du jour (vue générale) */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">RDV du jour</h3>
              <div className="space-y-4">
                {[
                  { name: "Sophie Leblanc", time: "14:30", doctor: "Dr. Martin", status: "En cours" },
                  { name: "Marc Petit", time: "15:00", doctor: "Dr. Dubois", status: "Confirmé" },
                  { name: "Claire Moreau", time: "15:30", doctor: "Dr. Martin", status: "Confirmé" }
                ].map((rdv, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{rdv.name}</p>
                      <p className="text-sm text-gray-600">{rdv.time} - {rdv.doctor}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      rdv.status === 'En cours'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {rdv.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Actions rapides selon le rôle */}
      {hasRole('MEDECIN') && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <Calendar className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Nouveau RDV</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <Stethoscope className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Consultation</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <Pill className="w-8 h-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Ordonnance</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <FileText className="w-8 h-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Certificat</span>
            </button>
          </div>
        </div>
      )}

      {/* Actions rapides pour caissier */}
      {hasRole('CAISSE') && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <CreditCard className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Nouveau Paiement</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <Receipt className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Facture</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <Calculator className="w-8 h-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Rapport Caisse</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <AlertTriangle className="w-8 h-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Impayés</span>
            </button>
          </div>
        </div>
      )}

      {/* Actions rapides pour réception */}
      {hasRole('RECEPTION') && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <Calendar className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Nouveau RDV</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <UserPlus className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Nouveau Patient</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <Phone className="w-8 h-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Appels</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <CalendarCheck className="w-8 h-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Confirmations</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}