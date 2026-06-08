import pdfplumber
import re
import json
import sys

def extract_policy_data(pdf_path):
    data = {
        "aseguradora": "Desconocida",
        "tipo_poliza": "Transporte Terrestre",
        "suma_asegurada": None,
        "mercaderia": None,
        "coberturas": [],
        "adicionales": []
    }
    
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages[:3]: # Usually the first 3 pages contain the summary
            text += page.extract_text() + "\n"
            
    # Detect Aseguradora
    if "SANCOR SEGUROS" in text or "Sancor" in text:
        data["aseguradora"] = "Sancor Seguros"
    elif "INTEGRITY" in text or "Intégrity" in text:
        data["aseguradora"] = "Intégrity Seguros"
    elif "BERKLEY" in text or "Berkley" in text:
        data["aseguradora"] = "Berkley International Seguros"
    elif "la segunda" in text.lower():
        data["aseguradora"] = "La Segunda Seguros"
        
    # Extract Suma Asegurada
    # Matches patterns like "Límite máximo de responsabilidad: USD 600.000,00" or "U$S 390.000" or "Resp.Máxima (RM) 70.000.000,00"
    suma_patterns = [
        r"(?i)l[íi]mite m[áa]ximo de responsabilidad.*? (?:USD|U\$S|\$)\s*([\d\.,]+)",
        r"(?i)monto estimado a transportar.*? (?:USD|U\$S|\$)\s*([\d\.,]+)",
        r"(?:USD|U\$S)\s*([\d\.,]+).*?(?:LIMITE|SUMA ASEGURADA)",
        r"(?i)resp\.m[áa]xima\s*\(rm\)\s*([\d\.,]+)",
        r"(?i)suma asegurada.*?(?:USD|U\$S|\$)\s*([\d\.,]+)"
    ]
    
    for pattern in suma_patterns:
        match = re.search(pattern, text)
        if match:
            data["suma_asegurada"] = match.group(1).strip()
            break
            
    # Extract Mercaderia
    merc_match = re.search(r"(?i)TIPO DE MERCADER[ÍI]A\s*\n(.*?)\n", text)
    if not merc_match:
        merc_match = re.search(r"(?i)Mercader[íi]a:\s*(.*)", text)
    if not merc_match:
        # Integrity format
        merc_match = re.search(r"(?i)Mercader[íi]a:\s*(.*?)\n", text)
        
    if merc_match:
        data["mercaderia"] = merc_match.group(1).strip()
        
    # Extract Coberturas and Adicionales (Basic keyword matching)
    keywords_cobertura = ["Incendio", "Choque", "Vuelco", "Desbarrancamiento"]
    keywords_adicionales = ["Robo", "Hurto", "Falta de Entrega", "Desaparición", "Mojadura", "Derrame", "Carga y Descarga", "Eximición", "Vandalismo", "Tumulto", "Huelga"]
    
    for kw in keywords_cobertura:
        if re.search(r"(?i)\b" + kw + r"\b", text):
            data["coberturas"].append(kw)
            
    for kw in keywords_adicionales:
        if re.search(r"(?i)\b" + kw + r"\b", text):
            data["adicionales"].append(kw)
            
    return data

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extractor.py <path_to_pdf>")
        sys.exit(1)
        
    result = extract_policy_data(sys.argv[1])
    print(json.dumps(result, indent=4, ensure_ascii=False))
