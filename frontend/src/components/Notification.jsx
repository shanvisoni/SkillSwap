import { useNotifications } from '../context/NotificationContext';

const NotificationBadge = ({ userId }) => {
  const { unreadCounts } = useNotifications();
  const count = unreadCounts[userId] || 0;

  if (count === 0) return null;

  return (
    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
      {count}
    </span>
  );
};

export default NotificationBadge;