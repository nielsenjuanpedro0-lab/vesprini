import React, { useState } from 'react';
import WizardForm from './components/WizardForm';
import InfoSection from './components/InfoSection';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('cotizador');
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { num: 1, label: "Datos del Cliente" },
    { num: 2, label: "Logística" },
    { num: 3, label: "Seguro" },
    { num: 4, label: "Resumen" }
  ];

  return (
    <div className="split-layout">
      {/* Left Panel */}
      <div className="left-panel">
        <div>
          <div className="brand-logo">
            <span>Vesprini</span>
          </div>
          
          <div className="left-content">
            <h1>Plataforma de<br/>Logística</h1>
            <p>Complete los datos para generar una nueva solicitud de servicio de manera rápida y segura.</p>
            
            {activeTab === 'cotizador' && (
              <div className="vertical-steps">
                {steps.map(s => (
                  <div key={s.num} className={`v-step ${currentStep === s.num ? 'active' : ''} ${currentStep > s.num ? 'completed' : ''}`}>
                    <div className="v-indicator">{currentStep > s.num ? '✓' : s.num}</div>
                    <span className="v-label">{s.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation / Footer of Left Panel */}
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            style={{ padding: '0.5rem 0', background: 'transparent', color: activeTab === 'cotizador' ? 'white' : 'rgba(255,255,255,0.5)', borderBottom: activeTab === 'cotizador' ? '2px solid var(--accent)' : '2px solid transparent', borderRadius: 0, fontWeight: 500 }}
            onClick={() => setActiveTab('cotizador')}
          >
            Nuevo Formulario
          </button>
          <button 
            style={{ padding: '0.5rem 0', background: 'transparent', color: activeTab !== 'cotizador' ? 'white' : 'rgba(255,255,255,0.5)', borderBottom: activeTab !== 'cotizador' ? '2px solid var(--accent)' : '2px solid transparent', borderRadius: 0, fontWeight: 500 }}
            onClick={() => setActiveTab('coberturas')}
          >
            Info Coberturas
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <div className="form-container">
          {activeTab === 'cotizador' && <WizardForm currentStep={currentStep} setCurrentStep={setCurrentStep} />}
          {activeTab !== 'cotizador' && <InfoSection activeTab={activeTab} />}
        </div>
      </div>
    </div>
  );
}

export default App;
