from django.contrib import admin
from .models import Cotizacion

@admin.register(Cotizacion)
class CotizacionAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'origen', 'destino', 'quiere_seguro', 'suma_asegurada', 'aseguradora', 'fecha_creacion')
    list_filter = ('quiere_seguro', 'aseguradora', 'fecha_creacion')
    search_fields = ('nombre', 'cuit', 'email', 'origen', 'destino')
    readonly_fields = ('fecha_creacion',)
    
    fieldsets = (
        ('Datos del Cliente', {
            'fields': ('nombre', 'cuit', 'email', 'telefono')
        }),
        ('Ruta y Logística', {
            'fields': ('origen', 'destino', 'tipo_destino', 'fecha_salida', 'tipo_servicio', 'tipo_vehiculo')
        }),
        ('Carga', {
            'fields': ('tipo_carga', 'peso_estimado', 'mercaderia')
        }),
        ('Seguro y Póliza Adjunta', {
            'fields': ('quiere_seguro', 'suma_asegurada', 'cobertura_basica', 'archivo_poliza', 'aseguradora', 'adicionales')
        }),
        ('Metadatos', {
            'fields': ('fecha_creacion',)
        }),
    )
