import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Settings,
  Upload,
  Save,
  MapPin,
  Phone,
  Mail,
  Clock,
  DollarSign,
  Users,
  Shield,
  Bell,
  Palette,
  Camera
} from 'lucide-react';

export default function ClinicSettings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [clinicData, setClinicData] = useState({
    general: {
      name: user?.clinique?.name || 'Clinique Centrale',
      description: 'Centre médical spécialisé en soins de santé primaires et consultations spécialisées.',
      address: '123 Rue de la Santé, 75001 Paris',
      phone: '+33 1 23 45 67 89',
      email: 'contact@clinique-centrale.fr',
      website: 'www.clinique-centrale.fr',
      siret: '12345678901234',
      logo: null
    },
    hours: {
      monday: { open: '08:00', close: '18:00', closed: false },
      tuesday: { open: '08:00', close: '18:00', closed: false },
      wednesday: { open: '08:00', close: '18:00', closed: false },
      thursday: { open: '08:00', close: '18:00', closed: false },
      friday: { open: '08:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '12:00', closed: false },
      sunday: { open: '09:00', close: '12:00', closed: true }
    },
    pricing: {
      consultationGenerale: 25,
      consultationSpecialiste: 35,
      consultationUrgence: 50,
      visiteDomicile: 45,
      certificatMedical: 15
    },
    notifications: {
      appointmentReminders: true,
      paymentReminders: true,
      marketingEmails: false,
      systemAlerts: true
    },
    appearance: {
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      theme: 'light'
    }
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
  };

  const tabs = [
    { id: 'general', label: 'Informations générales', icon: Settings },
    { id: 'hours', label: 'Horaires', icon: Clock },
    { id: 'pricing', label: 'Tarifs', icon: DollarSign },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Apparence', icon: Palette }
  ];

  const dayLabels = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paramètres de la Clinique</h1>
          <p className="text-gray-600">Configurez les paramètres de {user?.clinique?.name}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
        >
          <Save className="w-5 h-5" />
          <span>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="flex items-start space-x-6">
                <div className="flex-1 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de la clinique
                    </label>
                    <input
                      type="text"
                      value={clinicData.general.name}
                      onChange={(e) => setClinicData({
                        ...clinicData,
                        general: { ...clinicData.general, name: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={clinicData.general.description}
                      onChange={(e) => setClinicData({
                        ...clinicData,
                        general: { ...clinicData.general, description: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="tel"
                          value={clinicData.general.phone}
                          onChange={(e) => setClinicData({
                            ...clinicData,
                            general: { ...clinicData.general, phone: e.target.value }
                          })}
                          className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          value={clinicData.general.email}
                          onChange={(e) => setClinicData({
                            ...clinicData,
                            general: { ...clinicData.general, email: e.target.value }
                          })}
                          className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                      <textarea
                        rows={2}
                        value={clinicData.general.address}
                        onChange={(e) => setClinicData({
                          ...clinicData,
                          general: { ...clinicData.general, address: e.target.value }
                        })}
                        className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="w-48">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo de la clinique
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Cliquez pour télécharger</p>
                    <p className="text-xs text-gray-500">PNG, JPG jusqu'à 2MB</p>
                    <input type="file" className="hidden" accept="image/*" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hours' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Horaires d'ouverture</h3>
              <div className="space-y-4">
                {Object.entries(clinicData.hours).map(([day, hours]) => (
                  <div key={day} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-24">
                      <span className="font-medium text-gray-900">{dayLabels[day]}</span>
                    </div>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={hours.closed}
                        onChange={(e) => setClinicData({
                          ...clinicData,
                          hours: {
                            ...clinicData.hours,
                            [day]: { ...hours, closed: e.target.checked }
                          }
                        })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">Fermé</span>
                    </label>

                    {!hours.closed && (
                      <>
                        <div className="flex items-center space-x-2">
                          <input
                            type="time"
                            value={hours.open}
                            onChange={(e) => setClinicData({
                              ...clinicData,
                              hours: {
                                ...clinicData.hours,
                                [day]: { ...hours, open: e.target.value }
                              }
                            })}
                            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <span className="text-gray-500">à</span>
                          <input
                            type="time"
                            value={hours.close}
                            onChange={(e) => setClinicData({
                              ...clinicData,
                              hours: {
                                ...clinicData.hours,
                                [day]: { ...hours, close: e.target.value }
                              }
                            })}
                            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Grille tarifaire</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(clinicData.pricing).map(([key, value]) => {
                  const labels = {
                    consultationGenerale: 'Consultation générale',
                    consultationSpecialiste: 'Consultation spécialiste',
                    consultationUrgence: 'Consultation urgence',
                    visiteDomicile: 'Visite à domicile',
                    certificatMedical: 'Certificat médical'
                  };

                  return (
                    <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <span className="font-medium text-gray-900">{labels[key]}</span>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={value}
                          onChange={(e) => setClinicData({
                            ...clinicData,
                            pricing: {
                              ...clinicData.pricing,
                              [key]: parseInt(e.target.value)
                            }
                          })}
                          className="w-20 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                        />
                        <span className="text-gray-500">€</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Paramètres de notification</h3>
              <div className="space-y-4">
                {Object.entries(clinicData.notifications).map(([key, enabled]) => {
                  const labels = {
                    appointmentReminders: 'Rappels de rendez-vous',
                    paymentReminders: 'Rappels de paiement',
                    marketingEmails: 'Emails marketing',
                    systemAlerts: 'Alertes système'
                  };

                  return (
                    <label key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <span className="font-medium text-gray-900">{labels[key]}</span>
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => setClinicData({
                          ...clinicData,
                          notifications: {
                            ...clinicData.notifications,
                            [key]: e.target.checked
                          }
                        })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Personnalisation de l'interface</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Couleur principale
                  </label>
                  <input
                    type="color"
                    value={clinicData.appearance.primaryColor}
                    onChange={(e) => setClinicData({
                      ...clinicData,
                      appearance: { ...clinicData.appearance, primaryColor: e.target.value }
                    })}
                    className="w-full h-12 rounded-lg border border-gray-200 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Couleur secondaire
                  </label>
                  <input
                    type="color"
                    value={clinicData.appearance.secondaryColor}
                    onChange={(e) => setClinicData({
                      ...clinicData,
                      appearance: { ...clinicData.appearance, secondaryColor: e.target.value }
                    })}
                    className="w-full h-12 rounded-lg border border-gray-200 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thème
                </label>
                <select
                  value={clinicData.appearance.theme}
                  onChange={(e) => setClinicData({
                    ...clinicData,
                    appearance: { ...clinicData.appearance, theme: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="light">Clair</option>
                  <option value="dark">Sombre</option>
                  <option value="auto">Automatique</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}