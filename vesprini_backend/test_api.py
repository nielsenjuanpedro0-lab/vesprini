import urllib.request
import json

boundary = 'boundary123'
body = b''
fields = {
    'nombre': 'Empresa Prueba SA',
    'cuit': '30-12345678-9',
    'email': 'test@prueba.com',
    'telefono': '1123456789',
    'origen': 'Buenos Aires',
    'destino': 'Cordoba',
    'tipoDestino': 'Unico',
    'tipoServicio': 'Terrestre',
    'tipoVehiculo': 'Furgon Cerrado',
    'tipoCarga': 'Pallets',
    'pesoEstimado': '5000 Kg',
    'mercaderia': 'Ropa de temporada',
    'quiereSeguro': 'false',
}
for key, val in fields.items():
    body += f'--{boundary}\r\nContent-Disposition: form-data; name="{key}"\r\n\r\n{val}\r\n'.encode()
body += f'--{boundary}--\r\n'.encode()

req = urllib.request.Request(
    'http://127.0.0.1:8000/api/submit-quote/',
    data=body,
    headers={'Content-Type': f'multipart/form-data; boundary={boundary}'},
    method='POST'
)
try:
    res = urllib.request.urlopen(req)
    print('STATUS:', res.status, json.loads(res.read()))
except Exception as e:
    print('ERROR:', e)
