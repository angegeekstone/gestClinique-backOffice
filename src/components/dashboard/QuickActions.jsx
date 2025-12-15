import {
  UserPlus,
  Calendar,
  FileText,
  Pill,
  Activity,
  Clock
} from 'lucide-react';

const actions = [
  {
    title: "Nouveau patient",
    description: "Ajouter un nouveau patient",
    icon: UserPlus,
    color: "bg-blue-500 hover:bg-blue-600",
    href: "/patients/nouveau"
  },
  {
    title: "Nouveau RDV",
    description: "Planifier un rendez-vous",
    icon: Calendar,
    color: "bg-green-500 hover:bg-green-600",
    href: "/consultations/rdv/nouveau"
  },
  {
    title: "Consultation urgente",
    description: "Consultation d'urgence",
    icon: Clock,
    color: "bg-red-500 hover:bg-red-600",
    href: "/consultations/urgence"
  },
  {
    title: "Prescription",
    description: "Créer une ordonnance",
    icon: Pill,
    color: "bg-purple-500 hover:bg-purple-600",
    href: "/prescriptions/nouvelle"
  },
  {
    title: "Demande analyse",
    description: "Demander des analyses",
    icon: Activity,
    color: "bg-orange-500 hover:bg-orange-600",
    href: "/analyses/demande"
  },
  {
    title: "Rapport médical",
    description: "Rédiger un rapport",
    icon: FileText,
    color: "bg-indigo-500 hover:bg-indigo-600",
    href: "/documents/rapport"
  }
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Actions rapides</h3>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => (
          <button
            key={action.title}
            className="group flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
          >
            <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3 transition-colors duration-200`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-sm font-medium text-gray-900 text-center mb-1">
              {action.title}
            </h4>
            <p className="text-xs text-gray-500 text-center">
              {action.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}