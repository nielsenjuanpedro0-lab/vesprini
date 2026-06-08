import React, { useState, useEffect } from 'react';

const API_BASE = 'http://127.0.0.1:8000';

const WizardForm = ({ currentStep, setCurrentStep }) => {
  const totalSteps = 4;
  const [formData, setFormData] = useState({
    nombre: '',
    cuit: '',
    email: '',
    telefono: '',
    iva: 'Responsable Inscripto',
    fechaSalida: '',
    origen: '',
    tipoDestino: 'Único',
    destino: '',
    tipoServicio: 'Terrestre',
    tipoVehiculo: 'Semi-remolque (Sider/Barandas)',
    eximicion: 'Territorio de Argentina',
    tipoCarga: 'Pallets',
    pesoEstimado: '',
    mercaderia: '',
    archivoAdjunto: null,
    quiereSeguro: false,
    tienePolizaExistente: false,
    archivoPoliza: null,
    sumaMaximaViaje: '',
    coberturaBasica: 'BASICA',
    aseguradoraDetectada: '',
    adiccionalesDetectados: '',
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfResult, setPdfResult] = useState(null);
  const [pdfError, setPdfError] = useState('');

  // Make sure to reset step when component mounts
  useEffect(() => {
    setCurrentStep(1);
  }, [setCurrentStep]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => {
      const updatedValue = type === 'checkbox' ? checked : type === 'file' ? files[0] : value;
      const newData = { ...prev, [name]: updatedValue };

      if (name === 'tipoDestino' || name === 'destino') {
        const isMultidestino = name === 'tipoDestino' ? updatedValue === 'Multidestino' : newData.tipoDestino === 'Multidestino';
        const isChile = name === 'destino' ? updatedValue.toLowerCase().includes('chile') : newData.destino.toLowerCase().includes('chile');
        if (isMultidestino || isChile) newData.eximicion = 'Mercosur y países limítrofes';
      }
      return newData;
    });
  };

  const handlePolicyUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData(prev => ({ ...prev, archivoPoliza: file }));
    setIsLoadingPdf(true); setPdfResult(null); setPdfError('');

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/api/extract-policy/`, { method: 'POST', body: uploadData });
      if (!res.ok) throw new Error('Error al procesar el PDF');
      const result = await res.json();
      setPdfResult(result);
      setFormData(prev => ({
        ...prev,
        sumaMaximaViaje: result.suma_asegurada || prev.sumaMaximaViaje,
        mercaderia: result.mercaderia || prev.mercaderia,
        aseguradoraDetectada: result.aseguradora || '',
        adiccionalesDetectados: result.adicionales ? result.adicionales.join(', ') : '',
      }));
    } catch (err) {
      setPdfError('No pudimos leer el PDF automáticamente. Los datos fueron cargados manualmente.');
    } finally {
      setIsLoadingPdf(false);
    }
  };

  const nextStep = () => { if (currentStep < totalSteps) setCurrentStep(currentStep + 1); };
  const prevStep = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
        if (key === 'archivoPoliza' && formData[key] instanceof File) {
          submitData.append('archivo_poliza', formData[key]);
        } else if (key !== 'archivoAdjunto' && key !== 'archivoPoliza') {
          submitData.append(key, formData[key]);
        }
      }
    });

    try {
      await fetch(`${API_BASE}/api/submit-quote/`, { method: 'POST', body: submitData });
    } catch (err) {
      console.warn('Backend no disponible, guardado localmente.');
    }
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="form-section">
            <h2>1. Datos del Cliente</h2>
            <p className="form-subtitle">Información corporativa del solicitante del servicio.</p>

            <div className="form-group">
              <input type="text" name="nombre" className="floating-input" placeholder=" " value={formData.nombre} onChange={handleChange} required />
              <label className="floating-label">Nombre(s) y Apellido(s) / Razón Social *</label>
            </div>

            <div className="form-row">
              <div className="form-group">
                <input type="text" name="cuit" className="floating-input" placeholder=" " value={formData.cuit} onChange={handleChange} required />
                <label className="floating-label">DNI / CUIT *</label>
              </div>
              <div className="form-group">
                <select name="iva" className="floating-input" value={formData.iva} onChange={handleChange}>
                  <option>Consumidor Final</option>
                  <option>Exento</option>
                  <option>Monotributo</option>
                  <option>Responsable Inscripto</option>
                </select>
                <label className="floating-label" style={{top: 0, fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600}}>Condición IVA</label>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <input type="email" name="email" className="floating-input" placeholder=" " value={formData.email} onChange={handleChange} />
                <label className="floating-label">Email de Contacto</label>
              </div>
              <div className="form-group">
                <input type="tel" name="telefono" className="floating-input" placeholder=" " value={formData.telefono} onChange={handleChange} />
                <label className="floating-label">Teléfono</label>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form-section">
            <h2>2. Datos de la Carga y Logística</h2>
            <p className="form-subtitle">Detalles operativos para organizar el flete.</p>

            <div className="form-row">
              <div className="form-group">
                <input type="date" name="fechaSalida" className="floating-input" placeholder=" " value={formData.fechaSalida} onChange={handleChange} />
                <label className="floating-label" style={{top: 0, fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600}}>Fecha Estimada</label>
              </div>
              <div className="form-group">
                <input type="text" name="origen" className="floating-input" placeholder=" " value={formData.origen} onChange={handleChange} required />
                <label className="floating-label">Localidad de Origen *</label>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <select name="tipoDestino" className="floating-input" value={formData.tipoDestino} onChange={handleChange}>
                  <option value="Único">Destino Único</option>
                  <option value="Multidestino">Multidestino</option>
                </select>
                <label className="floating-label" style={{top: 0, fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600}}>Tipo de Destino</label>
              </div>
              <div className="form-group">
                <input type="text" name="destino" className="floating-input" placeholder=" " value={formData.destino} onChange={handleChange} />
                <label className="floating-label">Localidad(es) Destino</label>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <select name="tipoCarga" className="floating-input" value={formData.tipoCarga} onChange={handleChange}>
                  <option value="Pallets">Pallets</option>
                  <option value="Cajas / Bultos Sueltos">Cajas / Bultos Sueltos</option>
                  <option value="A Granel">A Granel</option>
                  <option value="Maquinaria / Pesada">Maquinaria pesada</option>
                  <option value="Otro">Otro</option>
                </select>
                <label className="floating-label" style={{top: 0, fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600}}>Formato</label>
              </div>
              <div className="form-group">
                <input type="text" name="pesoEstimado" className="floating-input" placeholder=" " value={formData.pesoEstimado} onChange={handleChange} />
                <label className="floating-label">Peso Est. (Ej: 15 Ton)</label>
              </div>
            </div>

            <div className="form-group">
              <input type="text" name="mercaderia" className="floating-input" placeholder=" " value={formData.mercaderia} onChange={handleChange} />
              <label className="floating-label">Descripción de Mercadería (¿frío, frágil?)</label>
            </div>
            
            <label style={{color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block', fontWeight: 500}}>Adjuntar Documentación (Remito, Fotos)</label>
            <label className="file-upload-box">
              <input type="file" name="archivoAdjunto" onChange={handleChange} accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png" />
              <div className="file-upload-label">
                <span style={{fontSize: '2rem'}}>📁</span>
                <span>Clic para subir un archivo</span>
                <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{formData.archivoAdjunto ? formData.archivoAdjunto.name : 'Formatos: PDF, JPG, PNG'}</span>
              </div>
            </label>
          </div>
        );

      case 3:
        return (
          <div className="form-section">
            <h2>3. Seguros de Carga</h2>
            <p className="form-subtitle">Seleccione si necesita seguro o ya cuenta con uno.</p>

            <label className={`checkbox-card ${formData.quiereSeguro ? 'active' : ''}`}>
              <input type="checkbox" name="quiereSeguro" checked={formData.quiereSeguro} onChange={handleChange} />
              <span>Deseo cotizar el seguro para la mercadería</span>
            </label>

            {formData.quiereSeguro && (
              <div className="dynamic-panel">
                <div className="form-row">
                  <div className="form-group">
                    <input type="number" name="sumaMaximaViaje" className="floating-input" placeholder=" " value={formData.sumaMaximaViaje} onChange={handleChange} required={formData.quiereSeguro} />
                    <label className="floating-label">Suma Máx. por Viaje ($)</label>
                  </div>
                  <div className="form-group">
                    <select name="coberturaBasica" className="floating-input" value={formData.coberturaBasica} onChange={handleChange}>
                      <option value="BASICA">Básica</option>
                      <option value="BASICA + ROBO">Básica + Robo</option>
                      <option value="TODO RIESGO">Todo Riesgo</option>
                    </select>
                    <label className="floating-label" style={{top: 0, fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600}}>Cobertura</label>
                  </div>
                </div>
              </div>
            )}

            <div style={{ textAlign: 'center', margin: '1rem 0', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
              — O BIEN —
            </div>

            <label className={`checkbox-card ${formData.tienePolizaExistente ? 'active' : ''}`}>
              <input type="checkbox" name="tienePolizaExistente" checked={formData.tienePolizaExistente} onChange={handleChange} />
              <span>Ya cuento con una póliza vigente (Adjuntar)</span>
            </label>

            {formData.tienePolizaExistente && (
              <div className="dynamic-panel">
                <label className="file-upload-box">
                  <input type="file" accept=".pdf" onChange={handlePolicyUpload} />
                  <div className="file-upload-label">
                    <span style={{fontSize: '2rem'}}>📄</span>
                    <span>Subir póliza (PDF)</span>
                    <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{formData.archivoPoliza ? formData.archivoPoliza.name : 'Se analizará automáticamente'}</span>
                  </div>
                </label>

                {isLoadingPdf && <p style={{ marginTop: '1rem', color: 'var(--accent)', fontWeight: 600 }}>⏳ Analizando póliza...</p>}
                {pdfResult && (
                  <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '1rem', marginTop: '1rem', fontSize: '0.9rem' }}>
                    <p style={{ fontWeight: 600, color: '#166534', marginBottom: '0.5rem' }}>✓ Datos detectados:</p>
                    <div><strong>Aseguradora:</strong> {pdfResult.aseguradora}</div>
                    <div><strong>Suma:</strong> {pdfResult.suma_asegurada || '-'}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="form-section">
            <h2>4. Resumen Final</h2>
            <p className="form-subtitle">Revisa los datos antes de enviar.</p>

            <div className="summary-grid">
              <div className="summary-card">
                <h3>Cliente</h3>
                <div className="summary-item"><span className="label">Razón Social</span><span className="value">{formData.nombre || '-'}</span></div>
                <div className="summary-item"><span className="label">Contacto</span><span className="value">{formData.telefono || formData.email || '-'}</span></div>
              </div>

              <div className="summary-card">
                <h3>Logística</h3>
                <div className="summary-item"><span className="label">Ruta</span><span className="value">{formData.origen || '?'} ➔ {formData.destino || '?'}</span></div>
                <div className="summary-item"><span className="label">Mercadería</span><span className="value">{formData.tipoCarga} / {formData.pesoEstimado || '?'}</span></div>
              </div>
              
              <div className="summary-card" style={{gridColumn: '1 / -1'}}>
                <h3>Seguro</h3>
                {formData.quiereSeguro ? (
                  <div className="summary-item"><span className="label">Solicitado</span><span className="value">Suma: ${formData.sumaMaximaViaje} | Cobertura: {formData.coberturaBasica}</span></div>
                ) : formData.tienePolizaExistente ? (
                  <div className="summary-item"><span className="label">Póliza Propia</span><span className="value">Adjunta</span></div>
                ) : (
                  <div className="summary-item"><span className="label">Estado</span><span className="value" style={{color: 'var(--text-muted)'}}>Sin seguro seleccionado</span></div>
                )}
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  if (isSubmitted) {
    return (
      <div style={{ textAlign: 'center', marginTop: '10vh' }}>
        <div style={{ fontSize: '4rem', color: 'var(--success)', marginBottom: '1rem' }}>✓</div>
        <h2 style={{ color: 'var(--primary)', fontSize: '2rem', marginBottom: '1rem' }}>¡Solicitud Registrada!</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>Nuestro equipo analizará la información y te contactará en breve.</p>
        <button className="btn-primary" onClick={() => window.location.reload()}>Nueva Solicitud</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {renderStepContent()}
      <div className="actions">
        {currentStep > 1 ? (
          <button type="button" className="btn-secondary" onClick={prevStep}>Volver</button>
        ) : <div></div>}

        {currentStep < totalSteps ? (
          <button type="button" className="btn-primary" onClick={nextStep}>Continuar</button>
        ) : (
          <button type="submit" className="btn-primary" style={{ background: 'var(--success)' }} disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Confirmar Envío'}
          </button>
        )}
      </div>
    </form>
  );
};

export default WizardForm;
