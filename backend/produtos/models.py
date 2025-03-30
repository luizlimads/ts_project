from django.db import models

# Create your models here.

class Produto(models.Model):
    nome = models.CharField(max_length=100)
    categoria = models.CharField(
        max_length=20,
        choices=[('perecivel', 'Perecível'), ('nao_perecivel', 'Não Perecível')]
    )
    unidade = models.CharField(max_length=20)
    quantidade = models.FloatField()
    data_validade = models.DateField()

    def __str__(self):
        return f"{self.nome} - {self.quantidade} {self.unidade}"
