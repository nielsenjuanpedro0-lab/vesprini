import React, { useState, useEffect } from 'react';
import WizardForm from './components/WizardForm';
import './index.css';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [scrolled, setScrolled] = useState(false);

  const steps = [
    { num: 1, label: "Datos del Cliente" },
    { num: 2, label: "Logística" },
    { num: 3, label: "Seguro" },
    { num: 4, label: "Resumen" }
  ];

  // Handle Navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 60, behavior: 'smooth' });
    }
  };

  return (
    <div>
      {/* Sticky Navbar */}
      <nav className="top-navbar" style={{ background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent', borderBottomColor: scrolled ? 'var(--border-color)' : 'transparent' }}>
        <div className="nav-brand" style={{ color: scrolled ? 'var(--primary)' : 'white' }}>
          <span style={{ color: 'var(--accent)' }}>Vesprini</span>
        </div>
        <div className="nav-links">
          <a href="#inicio" onClick={(e) => { e.preventDefault(); scrollTo('inicio'); }} style={{ color: scrolled ? 'var(--text-main)' : 'rgba(255,255,255,0.8)' }}>Inicio</a>
          <a href="#coberturas" onClick={(e) => { e.preventDefault(); scrollTo('coberturas'); }} style={{ color: scrolled ? 'var(--text-main)' : 'rgba(255,255,255,0.8)' }}>Coberturas</a>
          <a href="#beneficios" onClick={(e) => { e.preventDefault(); scrollTo('beneficios'); }} style={{ color: scrolled ? 'var(--text-main)' : 'rgba(255,255,255,0.8)' }}>Beneficios</a>
        </div>
      </nav>

      {/* Hero Section: Split Layout */}
      <div id="inicio" className="split-layout">
        <div className="left-panel-wrapper">
          <div className="left-panel">
            <div>
              <div className="brand-logo" style={{ visibility: 'hidden' /* Hidden to make room for navbar, but keeps spacing */ }}>
                <span>Vesprini</span>
              </div>
              
              <div className="left-content" style={{ marginTop: '3rem' }}>
                <h1>Plataforma de<br/>Logística</h1>
                <p>Complete los datos para generar una nueva solicitud de servicio de manera rápida y segura.</p>
                
                <div className="vertical-steps">
                  {steps.map(s => (
                    <div key={s.num} className={`v-step ${currentStep === s.num ? 'active' : ''} ${currentStep > s.num ? 'completed' : ''}`}>
                      <div className="v-indicator">{currentStep > s.num ? '✓' : s.num}</div>
                      <span className="v-label">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="right-panel">
          <div className="form-container" style={{ marginTop: '3rem' }}>
            <WizardForm currentStep={currentStep} setCurrentStep={setCurrentStep} />
          </div>
        </div>
      </div>

      {/* Section: Coberturas */}
      <section id="coberturas" className="landing-section">
        <div className="section-header">
          <h2>Nuestras Coberturas de Seguro</h2>
          <p>Protegemos su mercadería en cada kilómetro del trayecto con opciones adaptadas a sus necesidades específicas.</p>
        </div>
        <div className="cards-grid">
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Cobertura Básica</h3>
            <p>Protección esencial contra choques, vuelcos, desbarrancamientos, incendio, rayo o explosión durante el tránsito.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚨</div>
            <h3>Básica + Robo</h3>
            <p>Suma la protección total contra el robo de mercadería, con opciones de custodia satelital y armada según el valor.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌟</div>
            <h3>Todo Riesgo</h3>
            <p>La cobertura más completa del mercado. Incluye daños durante la carga y descarga, roturas, abolladuras y mojadura.</p>
          </div>
        </div>
      </section>

      {/* Section: Beneficios */}
      <section id="beneficios" className="landing-section alt-bg">
        <div className="section-header">
          <h2>¿Por qué elegir Vesprini?</h2>
          <p>Contamos con más de dos décadas de experiencia brindando soluciones logísticas integrales en todo el país.</p>
        </div>
        <div className="cards-grid">
          <div className="feature-card">
            <div className="feature-icon">⏱️</div>
            <h3>Cotización Inmediata</h3>
            <p>Nuestro sistema digitalizado permite procesar las solicitudes en tiempo récord, reduciendo los tiempos de espera a minutos.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3>Trazabilidad Total</h3>
            <p>Seguimiento GPS constante de la flota para garantizar la seguridad y brindarle actualizaciones precisas sobre su carga.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Atención Personalizada</h3>
            <p>Un equipo de especialistas asignado exclusivamente para optimizar sus costos logísticos y resolver contingencias.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span>Vesprini</span> Logística
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', opacity: 0.8 }}>
              <strong>Contacto</strong>
              <span>info@vesprini.com.ar</span>
              <span>+54 11 1234-5678</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} Vesprini. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}

export default App;
