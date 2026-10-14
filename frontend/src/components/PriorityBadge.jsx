import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export const PriorityBadge = ({ priority }) => {
  const p = (priority || 'MEDIUM').toUpperCase();

  const configs = {
    CRITICAL: {
      className: 'badge-priority-critical',
      icon: AlertCircle,
      label: 'CRITICAL'
    },
    HIGH: {
      className: 'badge-priority-high',
      icon: AlertTriangle,
      label: 'HIGH'
    },
    MEDIUM: {
      className: 'badge-priority-medium',
      icon: Info,
      label: 'MEDIUM'
    },
    LOW: {
      className: 'badge-priority-low',
      icon: CheckCircle2,
      label: 'LOW'
    }
  };

  const config = configs[p] || configs.MEDIUM;
  const Icon = config.icon;

  return (
    <span className={`badge ${config.className}`}>
      <Icon size={12} strokeWidth={2.5} />
      <span>{config.label}</span>
    </span>
  );
};
