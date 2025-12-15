import {
  Users,
  Calendar,
  TrendingUp,
  Activity,
  DollarSign,
  Clock
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import RecentPatients from '../components/dashboard/RecentPatients';
import AppointmentsChart from '../components/dashboard/AppointmentsChart';
import QuickActions from '../components/dashboard/QuickActions';
import UpcomingAppointments from '../components/dashboard/UpcomingAppointments';

export default function Dashboard() {
  const stats = [
    {
      title: "Total Patients",
      value: "1,234",
      change: 12,
      changeType: "increase",
      icon: Users
    },
    {
      title: "RDV Aujourd'hui",
      value: "28",
      change: 8,
      changeType: "increase",
      icon: Calendar
    },
    {
      title: "Revenus Mensuel",
      value: "€45,230",
      change: 15,
      changeType: "increase",
      icon: DollarSign
    },
    {
      title: "Taux d'occupation",
      value: "87%",
      change: 3,
      changeType: "decrease",
      icon: TrendingUp
    },
    {
      title: "Consultations",
      value: "156",
      change: 22,
      changeType: "increase",
      icon: Activity
    },
    {
      title: "Temps moyen",
      value: "32 min",
      change: 5,
      changeType: "decrease",
      icon: Clock
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Vue d'ensemble de votre clinique</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>Dernière mise à jour:</span>
          <span className="font-medium">Il y a 2 minutes</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            icon={stat.icon}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppointmentsChart />
        <QuickActions />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentPatients />
        <UpcomingAppointments />
      </div>
    </div>
  );
}