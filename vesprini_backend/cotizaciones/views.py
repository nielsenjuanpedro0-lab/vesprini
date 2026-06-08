"""
Django REST Framework views para el sistema de cotizaciones Vesprini.
"""
import re
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

try:
    import pdfplumber
    PDF_AVAILABLE = True
except ImportError:
    PDF_AVAILABLE = False

from .models import Cotizacion


def _detect_aseguradora(text: str, filename: str = "") -> str:
    """Detecta la aseguradora a partir del texto extraído del PDF o el nombre de archivo."""
    t = text.lower()
    fn = filename.lower()
    if "sancor" in t or "sancor" in fn:
        return "Sancor Seguros"
    if "integrity" in t or "intégrity" in t or "integrity" in fn:
        return "Intégrity Seguros"
    if "berkley" in t or "berkley" in fn:
        return "Berkley International Seguros"
    if "la segunda" in t or "la segunda" in fn or "aon risk" in t:
        return "La Segunda Seguros"
    return "Desconocida"


def _extract_suma(text: str):
    """Extrae la suma asegurada del texto del PDF."""
    # 1. Patrones explícitos (Sancor, Integrity, Berkley, etc.)
    patterns = [
        r"(?i)l[íi]mite\s+m[áa]ximo\s+de\s+responsabilidad[^\d]*(?:USD|U\$S|\$)?\s*([\d\.,]+)",
        r"(?i)sumas?\s+aseguradas?[^\d]*(?:USD|U\$S|\$)?\s*([\d\.,]+)",
        r"(?i)resp\.?\s*m[áa]xima\s*\(?rm\)?[^\d]*(?:USD|U\$S|\$)?\s*([\d\.,]+)",
    ]
    for pattern in patterns:
        m = re.search(pattern, text)
        if m:
            return m.group(1).strip()

    # 2. Formato La Segunda (ej: PRODUCTOS LACTEOS U$S 250.000)
    lines = text.split('\n')
    for line in lines:
        m = re.search(r"^(.*?)(?:USD|U\$S|\$)\s*([\d\.,]+)$", line.strip(), re.IGNORECASE)
        if m:
            prefix = m.group(1).upper()
            if not any(x in prefix for x in ["PRIMA", "MONTO", "TOTAL", "SALDO", "FRANQUICIA", "LIMITE", "LIMITES", "SUMA", "CUOTA", "COTIZ"]):
                return m.group(2).strip()

    # 3. Fallback a Monto Estimado o cualquier monto
    m_estimado = re.search(r"(?i)monto\s+estimado\s+a\s+transportar[^\d]*(?:USD|U\$S|\$)?\s*([\d\.,]+)", text)
    if m_estimado:
        return m_estimado.group(1).strip()
        
    m_any = re.search(r"(?:USD|U\$S)\s*([\d\.,]+)", text)
    if m_any:
        return m_any.group(1).strip()

    return ""


def _extract_mercaderia(text: str):
    """Extrae la descripción de mercadería del texto del PDF."""
    # 1. Patrones explícitos
    for pattern in [
        r"(?i)tipo\s+de\s+mercader[íi]a\s*[:\-]?\s*([^\n]+)",
        r"(?i)mercader[íi]a\s*[:\-]\s*([^\n]+)",
    ]:
        m = re.search(pattern, text)
        if m:
            return m.group(1).strip()[:200]
            
    # 2. Formato La Segunda (el texto antes del monto)
    lines = text.split('\n')
    for line in lines:
        m = re.search(r"^(.*?)(?:USD|U\$S|\$)\s*([\d\.,]+)$", line.strip(), re.IGNORECASE)
        if m:
            prefix = m.group(1).strip()
            up = prefix.upper()
            if prefix and not any(x in up for x in ["PRIMA", "MONTO", "TOTAL", "SALDO", "FRANQUICIA", "LIMITE", "LIMITES", "SUMA", "CUOTA", "COTIZ"]):
                return prefix[:200]

    return ""


KEYWORDS_COBERTURA = ["Incendio", "Choque", "Vuelco", "Desbarrancamiento"]
KEYWORDS_ADICIONALES = [
    "Robo", "Hurto", "Falta de Entrega", "Desaparición",
    "Mojadura", "Derrame", "Carga y Descarga",
    "Eximición", "Vandalismo", "Tumulto", "Huelga",
]


class ExtractPolicyView(APIView):
    """
    POST /api/extract-policy/
    Recibe un archivo PDF y devuelve los datos extraídos de la póliza.
    """

    def post(self, request, *args, **kwargs):
        if not PDF_AVAILABLE:
            return Response(
                {"error": "pdfplumber no está instalado en el servidor."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        if "file" not in request.FILES:
            return Response(
                {"error": "No se recibió ningún archivo."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        pdf_file = request.FILES["file"]
        text = ""

        try:
            with pdfplumber.open(pdf_file) as pdf:
                for page in pdf.pages[:4]:
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + "\n"
        except Exception as exc:
            return Response(
                {"error": f"No se pudo leer el PDF: {exc}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        coberturas = [kw for kw in KEYWORDS_COBERTURA if re.search(rf"(?i)\b{re.escape(kw)}\b", text)]
        adicionales = [kw for kw in KEYWORDS_ADICIONALES if re.search(rf"(?i)\b{re.escape(kw)}\b", text)]

        data = {
            "aseguradora": _detect_aseguradora(text, pdf_file.name),
            "tipo_poliza": "Transporte Terrestre",
            "suma_asegurada": _extract_suma(text),
            "mercaderia": _extract_mercaderia(text),
            "coberturas": coberturas,
            "adicionales": adicionales,
        }

        return Response(data, status=status.HTTP_200_OK)


class SubmitQuoteView(APIView):
    """
    POST /api/submit-quote/
    Guarda una cotización completa en la base de datos.
    """

    def post(self, request, *args, **kwargs):
        data = request.data
        files = request.FILES

        # Normalize boolean coming from FormData as string
        quiere_seguro = str(data.get("quiereSeguro", "false")).lower() == "true"

        try:
            Cotizacion.objects.create(
                nombre=data.get("nombre", ""),
                cuit=data.get("cuit", ""),
                email=data.get("email", "") or None,
                telefono=data.get("telefono", "") or None,
                origen=data.get("origen", ""),
                destino=data.get("destino", ""),
                tipo_destino=data.get("tipoDestino", "Único"),
                tipo_servicio=data.get("tipoServicio", ""),
                tipo_vehiculo=data.get("tipoVehiculo", "") or None,
                tipo_carga=data.get("tipoCarga", ""),
                peso_estimado=data.get("pesoEstimado", "") or None,
                mercaderia=data.get("mercaderia", ""),
                quiere_seguro=quiere_seguro,
                suma_asegurada=data.get("sumaMaximaViaje", "") or None,
                cobertura_basica=data.get("coberturaBasica", "") or None,
                aseguradora=data.get("aseguradoraDetectada", "") or None,
                adicionales=data.get("adiccionalesDetectados", "") or None,
                archivo_poliza=files.get("archivo_poliza") or None,
            )
        except Exception as exc:
            return Response(
                {"error": f"No se pudo guardar la cotización: {exc}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            {"message": "Cotización guardada exitosamente"},
            status=status.HTTP_201_CREATED,
        )
