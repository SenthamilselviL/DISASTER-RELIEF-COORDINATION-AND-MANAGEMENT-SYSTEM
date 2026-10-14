import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  MessageSquare,
  X,
  Send,
  LifeBuoy,
  AlertCircle,
  Stethoscope,
  Utensils,
  Home,
  ShieldAlert,
  ArrowRight,
  ChevronDown
} from 'lucide-react';

export const HelpAssistant = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: t.assistant?.greeting || 'Hello! I can guide you to emergency aid. What type of assistance do you need?',
      category: null
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');

  const handleQuery = (queryText) => {
    if (!queryText.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: queryText };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    const lower = queryText.toLowerCase();

    // Intent Matching
    setTimeout(() => {
      let botResponse = '';
      let detectedCategory = null;

      if (lower.includes('food') || lower.includes('water') || lower.includes('ration') || lower.includes('hungry') || lower.includes('starv') || lower.includes('உணவு') || lower.includes('தண்ணீர்') || lower.includes('भोजन') || lower.includes('पानी')) {
        botResponse = 'For food shortages or drinking water contamination, our verified relief partners and NGOs dispatch packaged meal kits and 20L potable water cans. Click below to submit a Food emergency request.';
        detectedCategory = 'Food';
      } else if (lower.includes('medic') || lower.includes('injur') || lower.includes('doctor') || lower.includes('wound') || lower.includes('oxygen') || lower.includes('fever') || lower.includes('மருத்துவ') || lower.includes('चिकित्सा') || lower.includes('दवा')) {
        botResponse = 'For medical emergencies, first aid, trauma kits, or oxygen support, our responders coordinate paramedic teams. If this is an immediate life threat, also dial 112 directly.';
        detectedCategory = 'Medical';
      } else if (lower.includes('shelter') || lower.includes('homeless') || lower.includes('roof') || lower.includes('stay') || lower.includes('rain') || lower.includes('தங்குமிடம்') || lower.includes('आश्रय') || lower.includes('घर')) {
        botResponse = 'Emergency shelter centers provide dry waterproof camps, blankets, and safe accommodation for displaced families and children.';
        detectedCategory = 'Shelter';
      } else if (lower.includes('flood') || lower.includes('trapped') || lower.includes('rescue') || lower.includes('boat') || lower.includes('water rising') || lower.includes('drown') || lower.includes('மீட்பு') || lower.includes('படகு') || lower.includes('बचाव') || lower.includes('नाव')) {
        botResponse = 'For flood-water rising, trapped residents, or rooftop evacuation, immediate motorized rescue boats and NDRF/Volunteer units are alerted.';
        detectedCategory = 'Rescue';
      } else if (lower.includes('what help') || lower.includes('available') || lower.includes('services') || lower.includes('உதவி') || lower.includes('मदद')) {
        botResponse = 'This portal provides direct coordination for 4 primary categories: (1) Rescue & Boat Evacuation, (2) Medical & First Aid, (3) Food & Clean Drinking Water, and (4) Emergency Shelter.';
        detectedCategory = null;
      } else {
        botResponse = "I can guide you to report an emergency. Please select one of our primary emergency categories below to begin dispatch coordination.";
        detectedCategory = null;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botResponse,
          category: detectedCategory
        }
      ]);
    }, 400);
  };

  const handleOpenForm = (cat) => {
    setIsOpen(false);
    navigate(`/citizen/new?category=${cat || 'Rescue'}`);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1100 }}>
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.5)',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.9rem',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
            title="Open Disaster Relief Help Assistant"
          >
            <MessageSquare size={20} />
            <span>{t.assistant?.title || 'Help Assistant'}</span>
          </button>
        ) : (
          /* Chat Window */
          <div
            style={{
              width: '380px',
              maxWidth: 'calc(100vw - 32px)',
              height: '520px',
              maxHeight: 'calc(100vh - 80px)',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div
              style={{
                backgroundColor: '#1e293b',
                color: '#ffffff',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    background: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <LifeBuoy size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>
                    {t.assistant?.title || 'Help Assistant'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    {t.assistant?.subtitle || 'Guidance & Emergency Navigation'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Disclaimer Bar */}
            <div
              style={{
                backgroundColor: '#fef2f2',
                borderBottom: '1px solid #fee2e2',
                padding: '8px 12px',
                fontSize: '0.74rem',
                color: '#991b1b',
                display: 'flex',
                gap: '6px',
                alignItems: 'flex-start'
              }}
            >
              <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{t.assistant?.disclaimer}</span>
            </div>

            {/* Message Stream */}
            <div
              style={{
                flex: 1,
                padding: '14px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                backgroundColor: '#f8fafc'
              }}
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%'
                  }}
                >
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      backgroundColor: m.sender === 'user' ? '#2563eb' : '#ffffff',
                      color: m.sender === 'user' ? '#ffffff' : '#1e293b',
                      fontSize: '0.85rem',
                      lineHeight: '1.4',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                      border: m.sender === 'user' ? 'none' : '1px solid #e2e8f0'
                    }}
                  >
                    {m.text}
                  </div>

                  {m.category && (
                    <button
                      onClick={() => handleOpenForm(m.category)}
                      style={{
                        marginTop: '8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: '#dc2626',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(220, 38, 38, 0.3)'
                      }}
                    >
                      <ShieldAlert size={14} />
                      <span>{t.assistant?.createRequestBtn || 'Create Emergency Request'} ({m.category})</span>
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Suggestions */}
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: '#ffffff',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                gap: '6px',
                overflowX: 'auto',
                whiteSpace: 'nowrap'
              }}
            >
              <button
                type="button"
                onClick={() => handleQuery(t.assistant?.quickRescue || 'I need Rescue / Boat')}
                style={{
                  fontSize: '0.72rem',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  border: '1px solid #fca5a5',
                  backgroundColor: '#fef2f2',
                  color: '#991b1b',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                🌊 Rescue
              </button>
              <button
                type="button"
                onClick={() => handleQuery(t.assistant?.quickMedical || 'I need Medical Aid')}
                style={{
                  fontSize: '0.72rem',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  border: '1px solid #fed7aa',
                  backgroundColor: '#fff7ed',
                  color: '#9a3412',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                🩺 Medical
              </button>
              <button
                type="button"
                onClick={() => handleQuery(t.assistant?.quickFood || 'I need Food & Water')}
                style={{
                  fontSize: '0.72rem',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  border: '1px solid #bbf7d0',
                  backgroundColor: '#f0fdf4',
                  color: '#166534',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                🍞 Food & Water
              </button>
              <button
                type="button"
                onClick={() => handleQuery(t.assistant?.quickShelter || 'I need Shelter')}
                style={{
                  fontSize: '0.72rem',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  border: '1px solid #bae6fd',
                  backgroundColor: '#f0f9ff',
                  color: '#075985',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                ⛺ Shelter
              </button>
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleQuery(inputQuery);
              }}
              style={{
                display: 'flex',
                padding: '10px 12px',
                backgroundColor: '#ffffff',
                borderTop: '1px solid #e2e8f0',
                gap: '8px'
              }}
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about food, medical, rescue..."
                style={{
                  flex: 1,
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};
