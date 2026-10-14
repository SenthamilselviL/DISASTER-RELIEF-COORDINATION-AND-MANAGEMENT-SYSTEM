import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageSelector = ({ variant = 'default' }) => {
  const { lang, changeLanguage } = useLanguage();

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <Globe size={16} color={variant === 'dark' ? '#94a3b8' : '#64748b'} />
      <select
        value={lang}
        onChange={(e) => changeLanguage(e.target.value)}
        style={{
          padding: '5px 8px',
          borderRadius: '6px',
          border: '1px solid #cbd5e1',
          fontSize: '0.8rem',
          fontWeight: '600',
          backgroundColor: '#ffffff',
          color: '#334155',
          cursor: 'pointer',
          outline: 'none'
        }}
        aria-label="Select Language"
      >
        <option value="en">English</option>
        <option value="ta">தமிழ் (Tamil)</option>
        <option value="hi">हिन्दी (Hindi)</option>
      </select>
    </div>
  );
};
