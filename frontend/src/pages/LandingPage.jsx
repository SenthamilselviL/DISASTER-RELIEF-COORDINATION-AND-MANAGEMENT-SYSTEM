import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import {
  ShieldAlert,
  PhoneCall,
  HeartHandshake,
  AlertTriangle,
  ArrowRight,
  LifeBuoy,
  Stethoscope,
  Utensils,
  Home,
  CheckCircle2,
  Users,
  Building2,
  MapPin
} from 'lucide-react';

export const LandingPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'CITIZEN') return '/citizen';
    if (user.role === 'GOVERNMENT') return '/control-room';
    if (user.role === 'ADMIN') return '/admin';
    return '/relief';
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      {/* Emergency Hotlines Alert Bar */}
      <div style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '10px 20px', fontSize: '0.85rem', fontWeight: '600' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PhoneCall size={16} />
            <span>{t.hotlineBanner}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <LanguageSelector variant="dark" />
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 28px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', background: '#dc2626', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <ShieldAlert size={22} />
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '1.2rem', color: '#0f172a', letterSpacing: '-0.02em' }}>
                {t.systemTitle}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t.systemSubtitle}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {user ? (
              <Link to={getDashboardLink()} className="btn btn-primary">
                {t.goToDashboard} ({t.roles[user.role] || user.role}) &rarr;
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">
                  {t.login}
                </Link>
                <Link to="/register" className="btn btn-primary">
                  {t.citizenRegistration}
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', alignItems: 'center' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              fontSize: '0.8rem',
              fontWeight: '700',
              color: '#38bdf8',
              marginBottom: '20px',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <span className="pulse-dot"></span>
              {t.heroTag}
            </div>

            <h1 className="hero-title">
              {t.heroTitle}
            </h1>

            <p className="hero-subtitle">
              {t.heroSubtitle}
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '24px' }}>
              <Link to="/citizen/new" className="btn btn-lg btn-danger" style={{ fontWeight: '700', padding: '14px 24px' }}>
                <AlertTriangle size={20} /> {t.requestEmergencyAid}
              </Link>
              <Link to="/login" className="btn btn-lg btn-outline" style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.3)', padding: '14px 24px' }}>
                <HeartHandshake size={20} /> {t.volunteerResponders}
              </Link>
            </div>
          </div>

          {/* Core System Highlights Card */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            padding: '28px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)',
            color: '#ffffff'
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}>
              <ShieldAlert size={20} color="#ef4444" /> Live Incident Grid
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '20px', lineHeight: '1.5' }}>
              Every citizen emergency request is directly routed to verified field teams with automated priority rating and duplicate prevention.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(220, 38, 38, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171' }}>
                  <LifeBuoy size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>Instant Dispatch Routing</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Rescue boats, trauma medical units, and food supplies</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(37, 99, 235, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>Geospatial Tracking</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Live OpenStreetMap command center with reverse geocoding</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>Verified Relief Lifecycle</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Transparent status progression from Pending to Resolved</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Link to="/register" style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Register as Citizen, NGO, or Volunteer</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Categories Section */}
      <section style={{ maxWidth: '1200px', margin: '-40px auto 40px auto', padding: '0 20px', width: '100%', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div className="card" style={{ padding: '24px', borderLeft: '4px solid #dc2626' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <LifeBuoy size={22} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '6px', color: '#0f172a' }}>{t.categories.Rescue}</h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: '1.5' }}>
              Boat evacuation for flood-trapped families, rooftop rescue, and high-risk hazard extraction.
            </p>
          </div>

          <div className="card" style={{ padding: '24px', borderLeft: '4px solid #ea580c' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Stethoscope size={22} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '6px', color: '#0f172a' }}>{t.categories.Medical}</h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: '1.5' }}>
              Trauma medical supplies, emergency oxygen support, and paramedic dispatch coordination.
            </p>
          </div>

          <div className="card" style={{ padding: '24px', borderLeft: '4px solid #16a34a' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Utensils size={22} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '6px', color: '#0f172a' }}>{t.categories.Food}</h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: '1.5' }}>
              Clean 20L drinking water cans, packaged meal kits, and baby nutrition supplies.
            </p>
          </div>

          <div className="card" style={{ padding: '24px', borderLeft: '4px solid #0284c7' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Home size={22} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '6px', color: '#0f172a' }}>{t.categories.Shelter}</h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: '1.5' }}>
              Temporary relief camps, waterproof tarpaulins, blankets, and safe shelter accommodations.
            </p>
          </div>
        </div>
      </section>

      {/* Stakeholders & Coordination Network */}
      <section style={{ maxWidth: '1200px', margin: '20px auto 60px auto', padding: '0 20px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>Unified Multi-Agency Coordination</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Ensuring zero duplication and rapid response across all relief agencies</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f1f5f9', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>For Citizens</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6', marginBottom: '16px' }}>
              Submit emergency requests in seconds, pinpoint your exact GPS location, track responder dispatch progress live, and receive confirmation when aid arrives.
            </p>
            <Link to="/citizen/new" style={{ color: '#2563eb', fontWeight: '700', fontSize: '0.85rem', textDecoration: 'none' }}>
              Report an Emergency &rarr;
            </Link>
          </div>

          <div className="card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f1f5f9', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HeartHandshake size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>For NGOs & Volunteers</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6', marginBottom: '16px' }}>
              Access live broadcast feeds of unassigned emergencies, claim tasks with a single click, update field rescue status, and eliminate duplicate aid distribution.
            </p>
            <Link to="/login" style={{ color: '#ea580c', fontWeight: '700', fontSize: '0.85rem', textDecoration: 'none' }}>
              Access Responder Portal &rarr;
            </Link>
          </div>

          <div className="card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f1f5f9', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>For Government Control Rooms</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6', marginBottom: '16px' }}>
              Monitor comprehensive district-wide operations on live Leaflet tactical maps, allocate central food & medical stockpiles, and audit all relief actions.
            </p>
            <Link to="/login" style={{ color: '#0f172a', fontWeight: '700', fontSize: '0.85rem', textDecoration: 'none' }}>
              Command Room Login &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '32px 24px', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={20} color="#ef4444" />
            <span style={{ color: '#ffffff', fontWeight: '700', fontSize: '0.9rem' }}>Disaster Relief Coordination & Management System</span>
          </div>
          <div style={{ fontSize: '0.8rem' }}>
            Real-Time MERN & Geospatial Disaster Response Platform
          </div>
        </div>
      </footer>
    </div>
  );
};
