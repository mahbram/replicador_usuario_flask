Replicador de Usuários - Flask
Aplicação desenvolvida em Python + Flask para automatizar processos internos de replicação de usuários e auxílio a rotinas administrativas.
O projeto foi criado com foco em organização, segurança e facilidade de manutenção.
Tecnologias
Python 3
Flask
HTML / CSS (Jinja2)
Virtualenv
Estrutura do Projeto
replicador_usuario_flask/
├── app.py            # Aplicação principal
├── templates/        # Páginas HTML
├── static/           # CSS e arquivos estáticos
├── requirements.txt  # Dependências
└── README.md         # Documentação


Como executar
1. Clone o repositório
git clone https://github.com/mahbram/replicador_usuario_flask.git
cd replicador_usuario_flask
2. Crie o ambiente virtual
python -m venv .venv
Ative:
PowerShell:
.venv\Scripts\Activate.ps1
3. Instale as dependências
pip install -r requirements.txt
4. Configure o arquivo .env
Crie um arquivo .env na raiz do projeto:
DB_HOST=xxx
DB_USER=xxx
DB_PASSWORD=xxx
SECRET_KEY=alguma_chave_secreta
5. Execute o projeto
python app.py


