from django.db import models

class Cotizacion(models.Model):
    nombre = models.CharField(max_length=255, verbose_name="Nombre / Razón Social")
    cuit = models.CharField(max_length=50, verbose_name="CUIT")
    email = models.EmailField(blank=True, null=True)
    telefono = models.CharField(max_length=50, blank=True, null=True)
    
    fecha_salida = models.DateField(blank=True, null=True, verbose_name="Fecha de Salida")
    origen = models.CharField(max_length=255)
    destino = models.CharField(max_length=255)
    tipo_destino = models.CharField(max_length=50, default="Único")
    
    tipo_servicio = models.CharField(max_length=100)
    tipo_vehiculo = models.CharField(max_length=100, blank=True, null=True)
    
    tipo_carga = models.CharField(max_length=100)
    peso_estimado = models.CharField(max_length=100, blank=True, null=True)
    mercaderia = models.TextField(verbose_name="Descripción de Mercadería")
    
    quiere_seguro = models.BooleanField(default=False)
    suma_asegurada = models.CharField(max_length=100, blank=True, null=True)
    cobertura_basica = models.CharField(max_length=100, blank=True, null=True)
    
    archivo_poliza = models.FileField(upload_to="polizas/", blank=True, null=True)
    aseguradora = models.CharField(max_length=100, blank=True, null=True)
    adicionales = models.TextField(blank=True, null=True, help_text="Coberturas adicionales detectadas")
    
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Cotización"
        verbose_name_plural = "Cotizaciones"
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f"{self.nombre} - {self.origen} a {self.destino}"
