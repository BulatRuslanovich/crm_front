import Link from "next/link"
import { Activ } from "@/dto/Activ";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('ru-RU', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const formatTime = (time: string) => {
  return time.substring(0, 5);
};

const getStatusLabel = (statusId: string) => {
  const statusConfig: Record<string, string> = {
    '1': 'Запланирован',
    '2': 'Открыт',
    '3': 'Сохранен',
    '4': 'Завершен',
  };
  
  return statusConfig[statusId] || `Статус ${statusId}`;
};

const ActivCard = ({activId, usrId, orgId, statusId, visitDate, startTime, endTime, description}: Activ) => {
  return (
    <Link 
      href={`/activ/${activId}`} 
      className="block bg-dark-100 border border-dark-200 rounded-lg p-4 hover:border-primary/50 transition-colors"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <p className="text-lg font-semibold flex-1 line-clamp-2">{description}</p>
        <span className="text-xs text-light-200 whitespace-nowrap">{getStatusLabel(statusId)}</span>
      </div>

      <div className="text-sm text-light-200 space-y-1">
        <p>{formatDate(visitDate)} • {formatTime(startTime)} - {formatTime(endTime)}</p>
        <p className="text-xs text-light-200/70">ID: {activId} • User: {usrId} • Org: {orgId}</p>
      </div>
    </Link>
  )
}

export default ActivCard;    