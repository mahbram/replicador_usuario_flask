from flask import Flask, render_template, request, jsonify
from flask import Flask, render_template, request, redirect, url_for, session, flash
from db import (
    InativacaoService,  #  classe que contém ativar_usuario e inativar_usuario
    replicar_usuario, 
    replicar_perfil_para_destinos, 
    conectar_banco,
    BASES,
    varredura_usuario_global,
    sugerir_novo_usuario,
    alterar_perfil_usuario,
    consultar_perfil_usuarios,
)

from dotenv import load_dotenv

# Carrega variáveis do .env
load_dotenv()





app = Flask(__name__)
app.secret_key = 'chave_super_segura_123'


# Credenciais - em produção, use banco de dados ou variáveis de ambiente
ADMIN_USER =  'admin'
ADMIN_PASS =  '1234'

@app.route('/')
def home():
    if 'usuario' in session:
        return redirect(url_for('index'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if 'usuario' in session:
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '')
        
        if not username or not password:
            flash('Por favor, preencha todos os campos', 'danger')
            return render_template('login.html')
        
        if username == ADMIN_USER and password == ADMIN_PASS:
            session['usuario'] = username
            session.permanent = True
            flash(f'Bem-vindo, {username}!', 'success')
            return redirect(url_for('index'))
        else:
            flash('Usuário ou senha incorretos', 'danger')
            return render_template('login.html')
    
    return render_template('login.html')

@app.route('/index')
def index():
    """Página principal - APENAS para usuários autenticados"""
    if 'usuario' not in session:
        flash('Por favor, faça login para acessar o sistema', 'warning')
        return redirect(url_for('login'))
    return render_template('index.html', usuario=session['usuario'])

@app.route('/logout')
def logout():
    """Logout do usuário"""
    usuario = session.pop('usuario', None)
    if usuario:
        flash('Logout realizado com sucesso.', 'info')
    return redirect(url_for('login'))

@app.after_request
def after_request(response):
    if 'usuario' in session:
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
    return response

# ROTAS DE USUÁRIO
@app.route("/criar_usuario", methods=["POST"])
def criar_usuario():
    try:
        dados = request.get_json(force=True)
        print("📥 Dados recebidos:", dados)

        usuario_origem = dados.get("usuario_origem", "").strip().upper()
        usuario_destino = dados.get("usuario_destino", "").strip().upper()
        nome_completo = dados.get("nome_completo", "").strip()
        email_suporte = dados.get("email_suporte", "").strip()
        usuario_ad = dados.get("usuario_ad", "").strip()
        bases = dados.get("bases", [])

        # Validação
        if not all([usuario_origem, usuario_destino, nome_completo, email_suporte, usuario_ad]) or not bases:
            return jsonify({"erro": "Todos os campos são obrigatórios"}), 400

        # Chama função de replicação
        relatorio = replicar_usuario(
            usuario_origem, usuario_destino, nome_completo,
            email_suporte, usuario_ad, bases
        )

        return jsonify({"relatorio": relatorio}), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"erro": str(e)}), 500
    
    

@app.route("/varredura_usuario_global", methods=["POST"])
def varredura_usuario_global_route():
    """Rota para varredura global de usuário"""
    try:
        dados = request.get_json(force=True)
        usuario_destino = dados.get("usuario_destino", "").strip().upper()

        if not usuario_destino:
            return jsonify({"erro": "Usuário destino é obrigatório"}), 400

        resultado = varredura_usuario_global(usuario_destino)
        return jsonify({"varredura": resultado}), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"erro": str(e)}), 500
    
    
    

@app.route("/sugerir_usuario", methods=["POST"])
def sugerir_usuario_route():
    """Rota para sugerir novo username disponível"""
    try:
        dados = request.get_json(force=True)
        usuario_base = dados.get("usuario_base", "").strip().upper()

        if not usuario_base:
            return jsonify({"erro": "Usuário base é obrigatório"}), 400

        sugestao = sugerir_novo_usuario(usuario_base)
        return jsonify({"sugestao": sugestao}), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"erro": str(e)}), 500
    
    
    

# ROTAS DE PERFIL
@app.route("/replicar_perfil", methods=["POST"])
def replicar_perfil_route():
    try:
        data = request.get_json()
        print(f"📥 Dados recebidos: {data}")
        
        perfil_origem = data.get("perfil_origem", "").strip().upper()
        base_origem = data.get("base_origem", "")
        bases_destino = data.get("bases_destino", [])

        # Validações
        if not perfil_origem:
            return jsonify({"erro": "Informe o perfil origem"}), 400
        if not base_origem:
            return jsonify({"erro": "Selecione a base origem"}), 400
        if not bases_destino:
            return jsonify({"erro": "Selecione pelo menos uma base destino"}), 400

        if base_origem not in BASES:
            return jsonify({"erro": f"Base origem {base_origem} não encontrada"}), 400

        # Valida se o perfil existe na base origem
        host_origem = BASES[base_origem]
        host_orig, porta_orig = host_origem.split(":")
        
        print(f"🔍 Validando perfil {perfil_origem} na base origem {base_origem}...")
        conn_origem = conectar_banco(host_orig, porta_orig)
        
        if not conn_origem:
            return jsonify({"erro": f"Falha ao conectar na base origem {base_origem}"}), 500
        
        try:
            cursor_origem = conn_origem.cursor()
            cursor_origem.execute(
                "SELECT COUNT(*) FROM Usuario WHERE PerfilUsuario = ? AND Nome = ?",
                (perfil_origem, perfil_origem)
            )
            
            perfil_existe = cursor_origem.fetchone()[0] > 0
            
            if not perfil_existe:
                return jsonify({"erro": f"Perfil {perfil_origem} não encontrado na base origem {base_origem}"}), 400
                
            print(f"✅ Perfil {perfil_origem} encontrado na base origem")
            
        finally:
            conn_origem.close()

        # Replica para bases destino
        hosts_destino = {nome: BASES[nome] for nome in bases_destino if nome in BASES}
        
        if not hosts_destino:
            return jsonify({"erro": "Nenhuma base destino válida selecionada"}), 400

        relatorio = replicar_perfil_para_destinos(perfil_origem, host_origem, hosts_destino)
        return jsonify({"relatorio": relatorio})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"erro": f"Erro interno: {str(e)}"}), 500
    
    
    

@app.route("/consultar_perfil_usuarios", methods=["POST"])
def consultar_perfil_usuarios_route():
    """Consulta os perfis dos usuários espelho e a alterar"""
    try:
        dados = request.get_json(force=True)
        
        base = dados.get("base", "").strip()
        usuario_espelho = dados.get("usuario_espelho", "").strip().upper()
        usuario_alterar = dados.get("usuario_alterar", "").strip().upper()

        if not all([base, usuario_espelho, usuario_alterar]):
            return jsonify({"erro": "Todos os campos são obrigatórios"}), 400

        resultado = consultar_perfil_usuarios(base, usuario_espelho, usuario_alterar)
        return jsonify(resultado), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"erro": str(e)}), 500
    
    
    
    
    

@app.route("/alterar_perfil_usuario", methods=["POST"])
def alterar_perfil_usuario_route():
    """Altera o perfil de um usuário baseado no perfil de outro"""
    try:
        dados = request.get_json(force=True)
        
        base = dados.get("base", "").strip()
        usuario_espelho = dados.get("usuario_espelho", "").strip().upper()
        usuario_alterar = dados.get("usuario_alterar", "").strip().upper()
        perfil_novo = dados.get("perfil_novo", "").strip()

        if not all([base, usuario_espelho, usuario_alterar, perfil_novo]):
            return jsonify({"erro": "Todos os campos são obrigatórios"}), 400

        resultado = alterar_perfil_usuario(base, usuario_espelho, usuario_alterar, perfil_novo)
        return jsonify(resultado), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"erro": str(e)}), 500
    
    
    

#  ROTAS DE INATIVAÇÃO 
@app.route("/buscar_usuario", methods=["POST"])
def buscar_usuario_route():
    try:
        data = request.get_json()
        base = data.get("base")
        usuario = data.get("usuario", "").strip().upper()

        if not base or not usuario:
            return jsonify({"erro": "Base e usuário são obrigatórios"}), 400

        if base not in BASES:
            return jsonify({"erro": f"Base {base} não encontrada"}), 400

        host, porta = BASES[base].split(":")
        conn = conectar_banco(host, porta)
        
        if not conn:
            return jsonify({"erro": f"Falha ao conectar na base {base}"}), 500

        try:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT Nome, PerfilUsuario, CodSetor, Ativo FROM Usuario WHERE Nome = ?",
                (usuario,)
            )
            
            resultado = cursor.fetchone()
            if not resultado:
                return jsonify({"erro": f"Usuário {usuario} não encontrado na base {base}"}), 404
            
            nome, perfil, codsetor, ativo = resultado
            
            # Busca descrição do setor
            desc_setor = f"Setor {codsetor}"
            try:
                cursor.execute("SELECT Descricao FROM Setor WHERE CodSetor = ?", (codsetor,))
                setor_result = cursor.fetchone()
                if setor_result:
                    desc_setor = setor_result[0]
            except:
                pass
            
            return jsonify({
                "nome": nome,
                "perfil": perfil,
                "setor": desc_setor,
                "ativo": bool(ativo)
            })
            
        finally:
            conn.close()

    except Exception as e:
        return jsonify({"erro": f"Erro interno: {str(e)}"}), 500
    
    

@app.route('/inativar_usuario', methods=['POST'])
def inativar_usuario_route():
    """Inativa usuário em uma base específica"""
    try:
        data = request.get_json()
        base = data.get('base')
        usuario = data.get('usuario', '').strip().upper()

        if not base:
            return jsonify({"erro": "Base não fornecida"}), 400
        if not usuario:
            return jsonify({"erro": "Usuário não informado"}), 400

        resultado = InativacaoService.inativar_usuario(base, usuario)
        if resultado['status'] == 'sucesso':
            return jsonify({"mensagem": resultado['mensagem']}), 200
        else:
            return jsonify({"erro": resultado['mensagem']}), 400

    except Exception as e:
        return jsonify({"erro": f"Erro interno do servidor: {str(e)}"}), 500



import traceback

@app.route('/ativar_usuario', methods=['POST'])
def ativar_usuario_route():
    try:
        data = request.get_json()
        base = data.get('base')
        usuario = data.get('usuario', '').strip().upper()

        if not base or not usuario:
            return jsonify({"erro": "Base ou usuário não informados"}), 400

        resultado = InativacaoService.ativar_usuario(base, usuario)
        return jsonify(resultado), 200 if resultado['status']=="sucesso" else 400

    except Exception as e:
        traceback.print_exc()
        return jsonify({"erro": f"Erro interno: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)