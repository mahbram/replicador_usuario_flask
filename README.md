# 🔄 Replicador de Usuários – Flask

Aplicação web corporativa desenvolvida em **Python e Flask** para automatizar processos internos de **replicação e gerenciamento de usuários**, auxiliando rotinas administrativas e garantindo padronização de acessos entre sistemas.

---

## 📌 Sobre o Projeto
Este projeto foi criado para atender cenários corporativos onde é necessário replicar usuários a partir de um **usuário espelho**, reduzindo erros manuais, retrabalho e inconsistências de permissões.

A aplicação possui **interface web** para operação administrativa e um **backend em Flask** responsável pelas regras de negócio e integrações.

---

## 🚀 Funcionalidades
- Criação de usuários com base em usuário espelho  
- Replicação de permissões e acessos  
- Interface web para operação administrativa  
- Estrutura organizada para fácil manutenção e evolução  

---

## 🛠️ Tecnologias Utilizadas
<p align="left">
  <img src="https://skillicons.dev/icons?i=python,flask,html,css,js,git,github,postgresql" />
</p>

---

## 🧱 Estrutura do Projeto
replicador_usuario_flask/
│
├── app.py # Aplicação principal Flask
├── templates/ # Templates HTML (Jinja2)
├── static/ # Arquivos estáticos (CSS, JS)
├── requirements.txt # Dependências do projeto
└── README.md # Documentação



---

▶️ Como Executar o Projeto
1️⃣ Clone o repositório
bash
git clone https://github.com/mahbram/replicador_usuario_flask.git
cd replicador_usuario_flask

2️⃣ Crie e ative o ambiente virtual
python -m venv .venv


Windows (PowerShell):

.venv\Scripts\Activate.ps1

3️⃣ Instale as dependências
pip install -r requirements.txt

4️⃣ Configure as variáveis de ambiente

Crie um arquivo .env na raiz do projeto:

DB_HOST=xxx
DB_USER=xxx
DB_PASSWORD=xxx
SECRET_KEY=alguma_chave_secreta

5️⃣ Execute a aplicação
python app.py
