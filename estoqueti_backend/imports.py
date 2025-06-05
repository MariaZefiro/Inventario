from flask import Flask, send_from_directory, request, abort
from flask_cors import CORS
from config import app_ip
import os

# Domínios permitidos 
ALLOWED_ORIGINS = ["http://localhost:3000", "http://10.1.254.74:3000"]

#LOGIN
from login import login_bp

# USUÁRIOS
from usuarios.list_usuarios import list_usuarios_bp
from usuarios.edit_usuarios import edit_usuarios_bp

#ATIVOS
from ativos.list_ativos import list_all_bp
from ativos.list_categorias import list_categorias_bp
from ativos.cadastrar_ativo import cadastrar_ativo_bp
from ativos.editar_ativo import editar_ativo_bp
from ativos.delete_ativo import delete_ativo_bp
from ativos.list_barcode import list_barcode_bp
from ativos.controle_ativo import controle_ativo_bp
from ativos.alert import alert_bp

#ENTRADAS E SAÍDAS
from entradas_saidas.list_movimentacao import list_movimentacao_bp
from entradas_saidas.validador import validador_bp

#ADAPTADORES
from adaptadores.list_adaptadores import list_adaptadores_bp

#ARMAZENAMENTO
from armazenamento.list_armazenamento import list_armazenamento_bp

#CABOS
from cabos.list_cabos import list_cabos_bp

#DESKTOPS
from desktops.list_desktops import list_desktops_bp

#FONTES
from fontes.list_fontes import list_fontes_bp

#MEMORIAS
from memorias_ram.list_ram import list_ram_bp

#MONITORES
from monitores.list_monitores import list_monitores_bp

#NOTEBOOKS
from notebooks.list_notebooks import list_notebooks_bp

#NUCS
from nucs.list_nucs import list_nucs_bp

#PERIFERICOS
from perifericos.list_perifericos import list_perifericos_bp

#REDES
from redes.list_redes import list_redes_bp

#TELEFONIA
from telefonia.list_telefonia import list_telefonia_bp

#LOGS
from log import list_logs_bp

#FEEDBACKS
from feedback import feedback_bp

# Lista dos blueprints para registro
blueprints = [
    login_bp,
    list_adaptadores_bp,
    list_armazenamento_bp,
    list_cabos_bp,
    list_desktops_bp,
    list_fontes_bp,
    list_ram_bp,
    list_monitores_bp,
    list_notebooks_bp,
    list_nucs_bp,
    list_perifericos_bp,
    list_redes_bp,
    list_telefonia_bp,
    list_all_bp,
    list_categorias_bp,
    cadastrar_ativo_bp,
    list_logs_bp,
    feedback_bp,
    editar_ativo_bp,
    delete_ativo_bp,
    list_barcode_bp,
    controle_ativo_bp,
    list_usuarios_bp,
    edit_usuarios_bp,
    list_movimentacao_bp,
    validador_bp,
    alert_bp
]