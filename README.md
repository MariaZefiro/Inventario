# 📦 Inventário de TI / IT Inventory System

> 🇧🇷 Versão em português (acima)  
> 🇺🇸 English version (below)

Sistema de inventário de ativos desenvolvido com **React** e **Python (Flask)**, com interface web para cadastro, consulta e gerenciamento de ativos. Possui leitura de código de barras para facilitar a localização de ativos, registro de ações (logs), dashboard informativo, controle de entradas e saídas supervisionadas, além de alertas de baixo estoque.


## 🔍 Visão Geral

Este projeto tem como objetivo facilitar o controle de ativos em um ambiente corporativo, permitindo o registro de informações como:

- Nome do ativo  
- Descrição 
- Categoria   
- Quantidade   
- Estado   
- Local   
- Serial Number   
- Campos adicionais conforme a categoria do ativo

## ⚙️ Tecnologias Utilizadas

- **Backend:** Python + Flask  
- **Frontend:** React + CSS  
- **Banco de Dados:** MariaDB  
- **Outros:** MUI (Joy UI)

## 🚀 Como Executar

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/MariaZefiro/Inventario.git
   cd Inventario
   ```

2. **Configure as variáveis necessárias:**
   ```bash
   cd estoqueti_backend
   ```
   Edite config.py com os dados do banco de dados e configuração de e-mail.

   ```bash
   cd estoqueti_frontend
   ```
   Edite o arquivo .env com o IP do backend e a chave secreta.

   ⚠️ Recomenda-se o uso do Vault ou variáveis de ambiente para armazenar segredos.


3. **Crie e ative o ambiente virtual (opcional):**
   ```bash
   python -m venv venv
   source venv/bin/activate      # Linux/macOS
   venv\Scripts\activate         # Windows
   ```

4. **Instale as dependências do backend:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Execute o backend:**
   ```bash
   python3 app.py
   ```

6. **Instale e execute o frontend:**
   ```bash
   cd estoqueti_frontend
   npm install
   npm start
   ```

7. **Acesse no navegador:**  
   [http://localhost:3000](http://localhost:3000)

## 👤 Usuário inicial
   Utilize o seguinte usuário para acesso inicial (segurança em choque 😁):

   - Login: maria_zefiro
   - Senha: senha_segura

## 📁 Estrutura do Projeto

```
Inventario/
├── estoqueti_backend/          # Pasta contendo o código Python 
│   ├── adaptadores/
│   ├── armazenamentos/
│   ├── ativos/
│   ├── barcodes/
│   ├── cabos/
│   ├── desktops/
│   ├── entradas_saida/
│   ├── fontes/
│   ├── memorias_ram/
│   ├── monitores/
│   ├── notebooks/
│   ├── nucs/
│   ├── perifericos/
│   ├── redes/
│   ├── telefonia/
│   ├── usuarios/
│   ├── app.py                  # Inicia a aplicação Flask
│   ├── config.py               # Configurações 
│   ├── db.py                   # Conexão e setup do banco
│   ├── feedback.py
│   ├── hash_passwords.py
│   ├── imports.py
│   ├── log.py
│   ├── login.py
│   ├── logs.log                # Log da aplicação
│   ├── requirements.txt        # Dependências do backend
│   └── send_email.py
│
├── estoqueti_frontend/         # Pasta contendo o frontend em React 
│   ├── public/                 # Arquivos públicos
│   └── src/                    # Código fonte
│       ├── components/
│       │   ├── Alert/
│       │   ├── Atividade/
│       │   ├── AtivosTable/
│       │   ├── ColorSchemeToggle/
│       │   ├── Config/
│       │   ├── Dashboard/
│       │   ├── EntradasSaida/
│       │   ├── Estoque/
│       │   ├── Gerenciar/
│       │   ├── Header/
│       │   ├── Home/
│       │   ├── Loader/
│       │   ├── Login/
│       │   ├── OrderTable/
│       │   ├── ParticlesBackground/
│       │   ├── Reporte/
│       │   ├── RowMenu/
│       │   ├── Sidebar/
│       │   └── TelaInicial/
│       ├── App.js
│       ├── App.test.js
│       ├── config.js
│       ├── index.css
│       ├── index.js
│       ├── logo.svg
│       ├── reportWebVitals.js
│       ├── routes.tsx
│       └── setupTests.js
│   ├── .env                      # Variáveis de ambiente
│   ├── .gitignore                # Ignorar node_modules, __pycache__ etc.
│   ├── package.json              # Dependências do frontend
│   ├── package-lock.json
├── banco.sql                     # Dump do banco
├── LICENSE
├── README.md                     # Documentação do projeto

```

## 🛠 Funcionalidades

- Cadastro, edição e exclusão de ativos
- Listagem com filtros e busca
- Controle de entradas e saídas supervisionadas
- Alertas de baixo estoque
- Exportação de dados em PDF
- Dashboards informativos
- Leitura de código de barras
- Interface intuitiva e responsiva (mobile)

## ✅ Requisitos

- Python 3.8+
- Navegador moderno (Chrome, Firefox, etc.)

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests com sugestões e melhorias.

## 📝 Licença

Este projeto está sob a licença [MIT](LICENSE).

---

## 📦 IT Inventory System

An asset inventory system developed with **React** and **Python (Flask)**, featuring a web interface for registering, querying, and managing assets. Includes barcode scanning, action logging, dashboards, check-in/out tracking, and low-stock alerts.

## 🔍 Overview

This project simplifies asset control in corporate environments, allowing you to register:

- Asset name  
- Description  
- Category  
- Quantity  
- Status  
- Location  
- Serial number  
- And category-specific fields

## ⚙️ Technologies Used

- **Backend:** Python + Flask  
- **Frontend:** React + CSS  
- **Database:** MariaDB  
- **Other:** MUI (Joy UI)

## 🚀 Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/MariaZefiro/Inventario.git
   cd Inventario

2. **Configure environment variables:**
   ```bash
   cd estoqueti_backend
   ```
   Edit config.py with DB/email settings.

   ```bash
   cd estoqueti_frontend
   ```
   Edit .env with backend IP and secret.

   ⚠️ Use Vault or env vars to store secrets securely.


3. **Create and activate virtual environment (optional):**
   ```bash
   python -m venv venv
   source venv/bin/activate      # Linux/macOS
   venv\Scripts\activate         # Windows
   ```

4. **Install backend dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run the backend:**
   ```bash
   python3 app.py
   ```

6. **Install and run the frontend:**
   ```bash
   cd estoqueti_frontend
   npm install
   npm start
   ```

7. **Access in browser:**  
   [http://localhost:3000](http://localhost:3000)

## 👤 Initial User
   Use the following user for initial access (security team in shock 😁):

   - Username: maria_zefiro
   - Password: senha_segura

## 📁 Estrutura do Projeto

- Note: Backend are named in Portuguese (e.g., ativos, usuarios, etc.)

```
Inventario/
├── estoqueti_backend/          # Folder containing the Python code 
│   ├── adaptadores/
│   ├── armazenamentos/
│   ├── ativos/
│   ├── barcodes/
│   ├── cabos/
│   ├── desktops/
│   ├── entradas_saida/
│   ├── fontes/
│   ├── memorias_ram/
│   ├── monitores/
│   ├── notebooks/
│   ├── nucs/
│   ├── perifericos/
│   ├── redes/
│   ├── telefonia/
│   ├── usuarios/
│   ├── app.py                  # Starts the Flask application
│   ├── config.py               # Configuration 
│   ├── db.py                   # Database connection and setup
│   ├── feedback.py
│   ├── hash_passwords.py
│   ├── imports.py
│   ├── log.py
│   ├── login.py
│   ├── logs.log                # Application log
│   ├── requirements.txt        # Backend dependencies
│   └── send_email.py
│
├── estoqueti_frontend/         # Folder containing the React frontend
│   ├── public/                 # Public files
│   └── src/                    # Source code
│       ├── components/
│       │   ├── Alert/
│       │   ├── Atividade/
│       │   ├── AtivosTable/
│       │   ├── ColorSchemeToggle/
│       │   ├── Config/
│       │   ├── Dashboard/
│       │   ├── EntradasSaida/
│       │   ├── Estoque/
│       │   ├── Gerenciar/
│       │   ├── Header/
│       │   ├── Home/
│       │   ├── Loader/
│       │   ├── Login/
│       │   ├── OrderTable/
│       │   ├── ParticlesBackground/
│       │   ├── Reporte/
│       │   ├── RowMenu/
│       │   ├── Sidebar/
│       │   └── TelaInicial/
│       ├── App.js
│       ├── App.test.js
│       ├── config.js
│       ├── index.css
│       ├── index.js
│       ├── logo.svg
│       ├── reportWebVitals.js
│       ├── routes.tsx
│       └── setupTests.js
│   ├── .env                      # Environment variables
│   ├── .gitignore                # Ignore node_modules, __pycache__, etc.
│   ├── package.json              # Frontend dependencies
│   ├── package-lock.json
├── banco.sql                     # Database dump
├── LICENSE
├── README.md                     # Project documentation

```

## 🛠 Funcionalidades

- Asset CRUD
- Search & filtering
- Supervised check-in/out
- Low-stock alerts
- PDF export
- Dashboards
- Barcode scanning
- Simple UI

## ✅ Requisitos

- Python 3.8+
- Modern browser (Chrome, Firefox, etc.)

## 🤝 Contribuições

Contributions are welcome! Open an issue or submit a pull request.

## 📝 Licença

Licensed under the [MIT](LICENSE).