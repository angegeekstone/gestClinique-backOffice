import { cn } from '../../utils/cn';

export default function StatCard({
  title,
  value,
  change,
  changeType = 'increase',
  icon: Icon,
  className
}) {
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-sm border border-gray-200 p-6",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change !== null && change !== undefined && (
            <div className="flex items-center mt-2">
              <span className={cn(
                "text-sm font-medium",
                changeType === 'increase' ? "text-green-600" :
                changeType === 'decrease' ? "text-red-600" : "text-gray-600"
              )}>
                {changeType === 'increase' ? '+' : changeType === 'decrease' ? '-' : ''}{Math.abs(change)}%
              </span>
              <span className="text-sm text-gray-500 ml-2">vs mois dernier</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="flex-shrink-0">
            <div className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center",
              changeType === 'increase' ? "bg-green-100" :
              changeType === 'decrease' ? "bg-red-100" : "bg-gray-100"
            )}>
              <Icon className={cn(
                "w-6 h-6",
                changeType === 'increase' ? "text-green-600" :
                changeType === 'decrease' ? "text-red-600" : "text-gray-600"
              )} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}