import React from 'react';

const InfoSection = ({ activeTab }) => {
  
  if (activeTab === 'coberturas') {
    return (
      <div className="info-section">
        <div className="info-card">
          <h2>Coberturas Principales y Adicionales</h2>
          <p>Conozca el detalle de los riesgos cubiertos por nuestras pólizas de transporte terrestre, aéreo y marítimo. La cobertura dependerá del servicio contratado y la evaluación de riesgos.</p>
          
          <h3>Cobertura Básica (Todo Riesgo - Tipo A)</h3>
          <ul>
            <li><strong>Choque, Vuelco, Desbarrancamiento o Descarrilamiento:</strong> Daños ocasionados por accidentes del vehículo transportador.</li>
            <li><strong>Incendio, Explosión y Rayo:</strong> Daños por combustión espontánea o accidentes externos que resulten en fuego.</li>
            <li><strong>Meteoros:</strong> Daños por huracán, ciclón, tornado, inundación, aluvión o alud.</li>
            <li><strong>Varadura y Hundimiento (Marítimo):</strong> Daños causados durante tránsitos complementarios por vías navegables.</li>
          </ul>

          <h3>Coberturas Adicionales</h3>
          <p>Sujetas a franquicias específicas (ej. 5% al 10%) y medidas de seguridad (Satelital / Custodia Armada):</p>
          <ul>
            <li><strong>Robo y Hurto:</strong> Incluyendo robo durante las operaciones de carga y descarga, asalto a mano armada y desaparición del vehículo o conductor.</li>
            <li><strong>Falta de Entrega:</strong> Desaparición de uno o más bultos enteros.</li>
            <li><strong>Derrames y Roturas:</strong> Pérdidas por derrame de líquidos o rotura de envases, condicionado a correcto embalaje o transporte en cisternas.</li>
            <li><strong>Mojadura:</strong> Daños causados por agua de lluvia, exigiendo que los vehículos posean lonas impermeables o sean furgones cerrados.</li>
            <li><strong>Contacto con otras cargas:</strong> Contaminación por contacto con otras mercaderías transportadas en el mismo medio.</li>
            <li><strong>Huelgas y Tumultos (Opcional):</strong> Daños originados por vandalismo, lock-out, o desórdenes públicos.</li>
          </ul>
        </div>

        <div className="info-card">
          <h2>Franquicias y Deducibles</h2>
          <p>Las coberturas adicionales de Robo, Hurto, Desaparición y Derrame suelen poseer franquicias a cargo del Asegurado, que van del <strong>5% al 20%</strong> del monto indemnizable, dependiendo del nivel de medidas de seguridad adoptadas (por ej: la falta de custodia armada puede incrementar la franquicia o anular la cobertura).</p>
        </div>
      </div>
    );
  }

  if (activeTab === 'exclusiones') {
    return (
      <div className="info-section">
        <div className="info-card">
          <h2>Bienes Excluidos o Restringidos</h2>
          <p>Los siguientes bienes <strong>no cuentan con cobertura automática</strong> y requieren la declaración expresa y autorización previa de la aseguradora, o bien se encuentran definitivamente excluidos del seguro de transporte:</p>
          
          <h3>Exclusiones Absolutas</h3>
          <ul>
            <li>Dinero en efectivo, cheques, pagarés, tarjetas de crédito/débito.</li>
            <li>Títulos, acciones, bonos y otros valores similares.</li>
            <li>Joyas, piedras preciosas, metales preciosos (oro, plata).</li>
            <li>Obras de arte, antigüedades, artículos de colección.</li>
            <li>Animales vivos y plantas.</li>
            <li>Armas, municiones y explosivos.</li>
            <li>Material radiactivo o bienes contaminantes no declarados.</li>
          </ul>

          <h3>Bienes Sujetos a Condiciones Especiales</h3>
          <p>Requieren empaque específico, cadena de frío garantizada o medidas de seguridad extremas:</p>
          <ul>
            <li><strong>Mercadería Perecedera:</strong> (Carnes, pescados, frutas, lácteos). Exigen la inclusión de cláusulas de paralización de equipo frigorífico (rotura de maquinaria de frío por más de 8 horas continuas) e historial del termógrafo.</li>
            <li><strong>Artículos Frágiles:</strong> (Vidrios, cristales, porcelana, equipos electrónicos, televisores).</li>
            <li><strong>Mercaderías de Alto Riesgo de Robo:</strong> Telefonía celular y sus partes, medicamentos, cigarrillos, licores, perfumes y cosméticos. Estos bienes obligatoriamente exigen custodia armada y satelital.</li>
          </ul>
        </div>

        <div className="info-card">
          <h2>Exclusiones de Cobertura Generales</h2>
          <p>Las aseguradoras no indemnizarán siniestros derivados de:</p>
          <ul>
            <li>Culpa grave, negligencia o dolo del conductor o transportista.</li>
            <li>Vicio propio de la mercadería, mermas naturales o mal embalaje.</li>
            <li>Uso, desgaste, oxidación o deterioro temporal normal.</li>
            <li>Multas o penalidades por demoras.</li>
            <li>Viajes realizados por rutas no convencionales sin necesidad.</li>
          </ul>
        </div>
      </div>
    );
  }

  return null;
};

export default InfoSection;
