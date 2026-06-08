from django.urls import path
from .views import ExtractPolicyView, SubmitQuoteView

urlpatterns = [
    path('api/extract-policy/', ExtractPolicyView.as_view(), name='extract-policy'),
    path('api/submit-quote/', SubmitQuoteView.as_view(), name='submit-quote'),
]
