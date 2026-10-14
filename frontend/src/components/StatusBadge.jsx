import React from 'react';
import { Clock, UserCheck, Activity, CheckCircle } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const s = (status || 'PENDING').toUpperCase();

  const configs = {
    PENDING: {
      className: 'badge-status-pending',
      icon: Clock,
      label: 'PENDING'
    },
    ASSIGNED: {
      className: 'badge-status-assigned',
      icon: UserCheck,
      label: 'ASSIGNED'
    },
    IN_PROGRESS: {
      className: 'badge-status-in_progress',
      icon: Activity,
      label: 'IN PROGRESS'
    },
    RESOLVED: {
      className: 'badge-status-resolved',
      icon: CheckCircle,
      label: 'RESOLVED'
    }
  };

  const config = configs[s] || configs.PENDING;
  const Icon = config.icon;

  return (
    <span className={`badge ${config.className}`}>
      <Icon size={12} strokeWidth={2.5} />
      <span>{config.label}</span>
    </span>
  );
};
