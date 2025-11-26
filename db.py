import pyodbc
import os
from dotenv import load_dotenv
import threading
import time

load_dotenv()

# Configuração das bases
BASES = {
    "BDP_100": "10.67.333.333:1234",

    
}

UID = os.getenv("UID")
PWD = os.getenv("PWD")

class DatabaseManager:
    @staticmethod
    def conectar_banco(host, porta):
        """Conecta a um host específico e retorna a conexão ou None em caso de erro"""
        try:
            conn = pyodbc.connect(
                f"DRIVER={{SQL Anywhere 17}};"
                f"HOST={host}:{porta};"
                f"DBN=Scgwin;"
                f"UID={UID};"
                f"PWD={PWD};"
            )
            return conn
        except Exception as e:
            print(f"❌ Erro ao conectar no host {host}:{porta}: {e}")
            return None

class UsuarioService:
    @staticmethod
    def varredura_usuario_global(usuario_destino):
        """
        Faz uma varredura em TODAS as bases para verificar se o usuário já existe
        """
        resultados = {}
        bases_encontradas = []
        lock = threading.Lock()
        
        def verificar_base(nome_base, endereco):
            try:
                host, porta = endereco.split(":")
                conn = DatabaseManager.conectar_banco(host, porta)
                
                if not conn:
                    with lock:
                        resultados[nome_base] = "Erro de conexão"
                    return
                
                try:
                    cursor = conn.cursor()
                    cursor.execute("SELECT COUNT(*) FROM Usuario WHERE Nome = ?", (usuario_destino,))
                    existe = cursor.fetchone()[0] > 0
                    
                    with lock:
                        resultados[nome_base] = {
                            'existe': existe,
                            'mensagem': 'Encontrado' if existe else 'Não encontrado'
                        }
                        if existe:
                            bases_encontradas.append(nome_base)
                            print(f"⚠️  Usuário {usuario_destino} encontrado na base {nome_base}")
                        else:
                            print(f"✅ Usuário {usuario_destino} não encontrado na base {nome_base}")
                            
                except Exception as e:
                    with lock:
                        resultados[nome_base] = {
                            'existe': False,
                            'mensagem': f'Erro: {str(e)}'
                        }
                    print(f"❌ Erro na base {nome_base}: {str(e)}")
                finally:
                    conn.close()
                    
            except Exception as e:
                with lock:
                    resultados[nome_base] = {
                        'existe': False,
                        'mensagem': f'Erro geral: {str(e)}'
                    }
                print(f"❌ Erro geral na base {nome_base}: {str(e)}")
        
        print(f"🔍 Iniciando varredura do usuário {usuario_destino} em {len(BASES)} bases...")
        
        # Executa verificações em paralelo
        threads = []
        for nome_base, endereco in BASES.items():
            thread = threading.Thread(target=verificar_base, args=(nome_base, endereco))
            threads.append(thread)
            thread.start()
        
        for thread in threads:
            thread.join(timeout=10)
        
        print(f"📊 Varredura concluída: {len(bases_encontradas)} bases com usuário existente")
        
        todas_bases = list(BASES.keys())
        bases_sem_usuario = [base for base in todas_bases if base not in bases_encontradas]
        
        return {
            'existe': len(bases_encontradas) > 0,
            'bases_encontradas': bases_encontradas,
            'bases_sem_usuario': bases_sem_usuario,
            'total_bases_verificadas': len(BASES),
            'detalhes': resultados
        }





    @staticmethod
    def varredura_usuario(usuario_destino, bases_selecionadas=None):
        """Faz uma varredura em bases específicas para verificar se o usuário já existe"""
        resultados = {}
        bases_encontradas = []
        lock = threading.Lock()
        
        def verificar_base_rapida(nome_base, endereco):
            try:
                host, porta = endereco.split(":")
                conn = DatabaseManager.conectar_banco(host, porta)
                
                if not conn:
                    with lock:
                        resultados[nome_base] = "Erro de conexão"
                    return
                
                try:
                    cursor = conn.cursor()
                    cursor.execute("SELECT COUNT(*) FROM Usuario WHERE Nome = ?", (usuario_destino,))
                    existe = cursor.fetchone()[0] > 0
                    
                    with lock:
                        resultados[nome_base] = existe
                        if existe:
                            bases_encontradas.append(nome_base)
                            
                except Exception as e:
                    with lock:
                        resultados[nome_base] = f"Erro: {str(e)}"
                finally:
                    conn.close()
                    
            except Exception as e:
                with lock:
                    resultados[nome_base] = f"Erro geral: {str(e)}"
        
        # Seleciona bases para verificação
        if bases_selecionadas:
            bases_verificar = {nome: BASES[nome] for nome in bases_selecionadas if nome in BASES}
        else:
            bases_verificar = BASES
        
        # Executa verificações em paralelo
        threads = []
        for nome_base, endereco in bases_verificar.items():
            thread = threading.Thread(target=verificar_base_rapida, args=(nome_base, endereco))
            threads.append(thread)
            thread.start()
        
        for thread in threads:
            thread.join(timeout=15)
        
        bases_sem_usuario = [base for base in bases_verificar.keys() if base not in bases_encontradas]
        
        return {
            'existe': len(bases_encontradas) > 0,
            'bases_encontradas': bases_encontradas,
            'bases_sem_usuario': bases_sem_usuario,
            'detalhes': resultados,
            'total_bases_verificadas': len(bases_verificar)
        }

    @staticmethod
    def sugerir_novo_usuario(usuario_base, bases_selecionadas=None):
        """Sugere um novo username disponível baseado no original"""
        sugestoes = [
            f"{usuario_base}1",
            f"{usuario_base}2",
            f"{usuario_base}_{int(time.time()) % 1000}",
            f"{usuario_base}01",
            f"{usuario_base}_{int(time.time()) % 100}"
        ]
        
        for sugestao in sugestoes:
            if bases_selecionadas:
                resultado = UsuarioService.varredura_usuario(sugestao, bases_selecionadas)
            else:
                resultado = UsuarioService.varredura_usuario_global(sugestao)
            
            if not resultado['existe']:
                print(f"💡 Sugestão disponível: {sugestao}")
                return sugestao
        
        sugestao_unica = f"{usuario_base}_{int(time.time())}"
        print(f"💡 Sugestão única: {sugestao_unica}")
        return sugestao_unica
    
    
    
    

    @staticmethod
    def replicar_usuario(usuario_origem, usuario_destino, nome_completo, email_suporte, usuario_ad, hosts_selecionados=None):
        """Replica a criação de usuário, pulando bases onde o usuário ou o AD já existem"""
        relatorio = []

        print(f"🔍 Verificando usuário {usuario_destino} nas bases selecionadas...")
        validacao = UsuarioService.varredura_usuario(usuario_destino, hosts_selecionados)
        
        if validacao['existe']:
            relatorio.append({
                "base": "SISTEMA",
                "status": "aviso",
                "mensagem": f"Usuário {usuario_destino} já existe em {len(validacao['bases_encontradas'])} base(s). Será criado apenas onde não existe."
            })
            print(f"⚠️ Usuário já existe em: {', '.join(validacao['bases_encontradas'])}")
            print(f"✅ Será criado em: {', '.join(validacao['bases_sem_usuario'])}")

        todas_bases = hosts_selecionados or list(BASES.keys())
        bases_para_criar = [base for base in todas_bases if base not in validacao['bases_encontradas']]

        if not bases_para_criar:
            relatorio.append({
                "base": "SISTEMA",
                "status": "erro",
                "mensagem": f"Usuário {usuario_destino} já existe em todas as bases selecionadas."
            })
            return relatorio

        print(f"🎯 Criando usuário em {len(bases_para_criar)} base(s): {', '.join(bases_para_criar)}")

        for i, nome_base in enumerate(bases_para_criar, 1):
            print(f"🔧 Processando base {i}/{len(bases_para_criar)}: {nome_base}")
            endereco = BASES.get(nome_base)
            if not endereco:
                relatorio.append({
                    "base": nome_base,
                    "status": "erro",
                    "mensagem": f"Base não encontrada: {nome_base}"
                })
                continue

            try:
                host, porta = endereco.split(":")
                conn = DatabaseManager.conectar_banco(host, porta)
            except Exception as e:
                relatorio.append({
                    "base": nome_base,
                    "status": "erro",
                    "mensagem": f"Endereço inválido: {e}"
                })
                continue

            if conn:
                try:
                    cursor = conn.cursor()
                    cursor.execute("SELECT COUNT(*) FROM Usuario WHERE Nome = ?", (usuario_origem,))
                    count_origem = cursor.fetchone()[0]

                    if count_origem == 0:
                        relatorio.append({
                            "base": nome_base,
                            "status": "aviso",
                            "mensagem": f"Usuário espelho {usuario_origem} não existe na base {nome_base}"
                        })
                        continue

                    cursor.execute("SELECT COUNT(*) FROM Usuario WHERE NomeUsuarioAD = ?", (usuario_ad,))
                    existe_ad = cursor.fetchone()[0] > 0

                    if existe_ad:
                        msg = f"O usuário AD '{usuario_ad}' já existe na base {nome_base}."
                        relatorio.append({
                            "base": nome_base,
                            "status": "aviso",
                            "mensagem": msg
                        })
                        print(f"⚠️ {msg}")
                        continue

                    cursor.execute("CALL Z_CriaUsuario (?, ?, ?, ?, ?)", (usuario_origem, usuario_destino, nome_completo, email_suporte, usuario_ad))
                    conn.commit()

                    relatorio.append({
                        "base": nome_base,
                        "status": "sucesso",
                        "mensagem": f"Usuário {usuario_destino} criado com sucesso em {nome_base}"
                    })
                    print(f"✅ Usuário {usuario_destino} criado com sucesso em {nome_base}")

                except Exception as e:
                    relatorio.append({
                        "base": nome_base,
                        "status": "erro",
                        "mensagem": str(e)
                    })
                    print(f"❌ Erro ao replicar em {nome_base}: {e}")
                finally:
                    conn.close()
            else:
                relatorio.append({
                    "base": nome_base,
                    "status": "erro",
                    "mensagem": "Falha de conexão"
                })

        sucessos = len([r for r in relatorio if r.get('status') == 'sucesso'])

        if validacao['bases_encontradas']:
            relatorio.append({
                "base": "SISTEMA",
                "status": "info",
                "mensagem": f"Usuário já existia nas bases: {', '.join(validacao['bases_encontradas'])}"
            })

        relatorio.append({
            "base": "SISTEMA",
            "status": "sucesso",
            "mensagem": f"Processo concluído! Usuário criado em {sucessos} base(s)."
        })

        return relatorio







class PerfilService:
    @staticmethod
    def replicar_perfil_para_destinos(perfil_origem, host_origem, hosts_destino):
        """Replica perfil com validação completa do setor"""
        relatorio = []

        # Conectar à base origem
        host_orig, porta_orig = host_origem.split(":")
        conn_origem = DatabaseManager.conectar_banco(host_orig, porta_orig)

        if not conn_origem:
            for nome_base in hosts_destino.keys():
                relatorio.append({
                    "base": nome_base,
                    "status": "erro",
                    "mensagem": "Falha ao conectar na base origem"
                })
            return relatorio

        try:
            cursor_origem = conn_origem.cursor()
            cursor_origem.execute(
                "SELECT Nome, Propriedades, Menus, CodSetor, NomeCompleto FROM Usuario WHERE PerfilUsuario = ? AND Nome = ?",
                (perfil_origem, perfil_origem)
            )
            resultado = cursor_origem.fetchone()

            if not resultado:
                for nome_base in hosts_destino.keys():
                    relatorio.append({
                        "base": nome_base,
                        "status": "erro",
                        "mensagem": "Perfil não encontrado na origem"
                    })
                return relatorio

            nome, propriedades, menus, codsetor_origem, nome_completo = resultado

            # Buscar dados do setor na origem, assim parametriza os codsetor
            cursor_origem.execute(
                "SELECT CodSetor, Descricao, AprovaPMM, SeqPadrao, Ativo, AprovaRQ FROM Setor WHERE CodSetor = ?",
                (codsetor_origem,)
            )
            setor_origem = cursor_origem.fetchone()
            descricao_setor_origem = setor_origem[1] if setor_origem else None

        except Exception as e:
            for nome_base in hosts_destino.keys():
                relatorio.append({
                    "base": nome_base,
                    "status": "erro",
                    "mensagem": f"Erro ao buscar dados: {str(e)}"
                })
            return relatorio
        finally:
            conn_origem.close()

        # Replica para cada base destino
        for nome_base, endereco in hosts_destino.items():
            try:
                host, porta = endereco.split(":")
                conn_destino = DatabaseManager.conectar_banco(host, porta)

                if not conn_destino:
                    relatorio.append({
                        "base": nome_base,
                        "status": "erro",
                        "mensagem": "Falha de conexão"
                    })
                    continue

                cursor_destino = conn_destino.cursor()

                # Verifica se o setor existe na base destino
                cursor_destino.execute(
                    "SELECT CodSetor FROM Setor WHERE Descricao = ?",
                    (descricao_setor_origem,)
                )
                resultado_destino = cursor_destino.fetchone()

                if resultado_destino:
                    codsetor_destino = resultado_destino[0]
                    setor_existe = True
                    mensagem_setor = f"Setor '{descricao_setor_origem}' encontrado"
                else:
                    setor_existe = False
                    cursor_destino.execute("SELECT MAX(CodSetor) FROM Setor")
                    max_codsetor = cursor_destino.fetchone()[0]
                    novo_codsetor = 1 if max_codsetor is None else max_codsetor + 1

                    dados_setor = [novo_codsetor, setor_origem[1], setor_origem[2], setor_origem[3], setor_origem[4], setor_origem[5]]
                    cursor_destino.execute(
                        "INSERT INTO Setor (CodSetor, Descricao, AprovaPMM, SeqPadrao, Ativo, AprovaRQ) VALUES (?, ?, ?, ?, ?, ?)",
                        dados_setor
                    )
                    conn_destino.commit()
                    codsetor_destino = novo_codsetor
                    mensagem_setor = f"Setor '{descricao_setor_origem}' criado com CodSetor {novo_codsetor}"

                # Verifica se o perfil já existe
                cursor_destino.execute("SELECT COUNT(*) FROM Usuario WHERE Nome = ?", (nome,))
                perfil_existe = cursor_destino.fetchone()[0] > 0

                if perfil_existe:
                    cursor_destino.execute(
                        "UPDATE Usuario SET Propriedades = ?, Menus = ?, CodSetor = ?, NomeCompleto = ?, PerfilUsuario = ? WHERE Nome = ?",
                        (propriedades, menus, codsetor_destino, nome_completo, perfil_origem, nome)
                    )
                    acao = "atualizado"
                else:
                    cursor_destino.execute(
                        "INSERT INTO Usuario (Nome, NomeCompleto, Propriedades, Menus, CodSetor, Ativo, PerfilUsuario) VALUES (?, ?, ?, ?, ?, 1, ?)",
                        (nome, nome_completo, propriedades, menus, codsetor_destino, perfil_origem)
                    )
                    acao = "criado"

                conn_destino.commit()

                if setor_existe:
                    mensagem = f"Perfil {nome} {acao} (Setor: {descricao_setor_origem})"
                else:
                    mensagem = f"Perfil {nome} {acao} - {mensagem_setor}"

                relatorio.append({
                    "base": nome_base,
                    "status": "sucesso",
                    "mensagem": mensagem
                })

                conn_destino.close()

            except Exception as e:
                relatorio.append({
                    "base": nome_base,
                    "status": "erro",
                    "mensagem": f"Erro: {str(e)}"
                })

        return relatorio

    @staticmethod
    def consultar_perfil_usuarios(nome_base, usuario_espelho, usuario_alterar):
        """Consulta os perfis dos usuários espelho e a alterar"""
        try:
            if nome_base not in BASES:
                return {"erro": f"Base {nome_base} não encontrada"}
            
            endereco = BASES[nome_base]
            host, porta = endereco.split(":")
            
            conn = DatabaseManager.conectar_banco(host, porta)
            if not conn:
                return {"erro": f"Falha ao conectar na base {nome_base}"}
            
            try:
                cursor = conn.cursor()
                
                # Consulta perfil do usuário espelho
                cursor.execute("SELECT PerfilUsuario FROM Usuario WHERE Nome = ?", (usuario_espelho,))
                resultado_espelho = cursor.fetchone()
                perfil_espelho = resultado_espelho[0] if resultado_espelho else None
                
                # Consulta perfil do usuário a alterar
                cursor.execute("SELECT PerfilUsuario FROM Usuario WHERE Nome = ?", (usuario_alterar,))
                resultado_alterar = cursor.fetchone()
                perfil_atual = resultado_alterar[0] if resultado_alterar else None
                
                return {
                    "usuario_espelho": usuario_espelho,
                    "perfil_espelho": perfil_espelho,
                    "usuario_alterar": usuario_alterar,
                    "perfil_atual": perfil_atual,
                    "base": nome_base
                }
                
            except Exception as e:
                return {"erro": f"Erro na consulta: {str(e)}"}
            finally:
                conn.close()
                
        except Exception as e:
            return {"erro": f"Erro geral: {str(e)}"}

    @staticmethod
    def alterar_perfil_usuario(nome_base, usuario_espelho, usuario_alterar, perfil_novo):
        """Altera o perfil de um usuário baseado no perfil de outro"""
        try:
            if nome_base not in BASES:
                return {"erro": f"Base {nome_base} não encontrada"}
            
            endereco = BASES[nome_base]
            host, porta = endereco.split(":")
            
            conn = DatabaseManager.conectar_banco(host, porta)
            if not conn:
                return {"erro": f"Falha ao conectar na base {nome_base}"}
            
            try:
                cursor = conn.cursor()
                
                # Verifica se o usuário a alterar existe
                cursor.execute("SELECT COUNT(*) FROM Usuario WHERE Nome = ?", (usuario_alterar,))
                if cursor.fetchone()[0] == 0:
                    return {"erro": f"Usuário {usuario_alterar} não encontrado na base {nome_base}"}
                
                # Atualiza o perfil do usuário
                cursor.execute("UPDATE Usuario SET PerfilUsuario = ? WHERE Nome = ?", (perfil_novo, usuario_alterar))
                conn.commit()
                
                # Verifica se a alteração foi bem sucedida
                cursor.execute("SELECT PerfilUsuario FROM Usuario WHERE Nome = ?", (usuario_alterar,))
                novo_perfil = cursor.fetchone()[0]
                
                return {
                    "mensagem": f"Perfil alterado com sucesso! Usuário {usuario_alterar} agora tem o perfil '{novo_perfil}'",
                    "usuario_alterar": usuario_alterar,
                    "perfil_anterior": perfil_novo,
                    "perfil_novo": novo_perfil,
                    "base": nome_base
                }
                
            except Exception as e:
                conn.rollback()
                return {"erro": f"Erro na alteração: {str(e)}"}
            finally:
                conn.close()
                
        except Exception as e:
            return {"erro": f"Erro geral: {str(e)}"}

class InativacaoService:
    @staticmethod
    def inativar_usuario(base, usuario):
        """Inativa usuário em uma base específica"""
        try:
            if base not in BASES:
                return {"status": "erro", "mensagem": f"Base {base} não encontrada"}
            
            host, porta = BASES[base].split(":")
            conn = DatabaseManager.conectar_banco(host, porta)
            if not conn:
                return {"status": "erro", "mensagem": f"Falha ao conectar na base {base}"}
            
            try:
                cursor = conn.cursor()
                cursor.execute("SELECT COUNT(*) FROM Usuario WHERE Nome = ?", (usuario,))
                if cursor.fetchone()[0] == 0:
                    return {"status": "erro", "mensagem": f"Usuário {usuario} não encontrado na base {base}"}
                
                # Inativa
                cursor.execute("UPDATE Usuario SET Ativo = 0 WHERE Nome = ?", (usuario,))
                conn.commit()
                
                return {"status": "sucesso", "mensagem": f"Usuário {usuario} inativado com sucesso na base {base}"}
                
            except Exception as e:
                conn.rollback()
                return {"status": "erro", "mensagem": f"Erro na inativação: {str(e)}"}
            finally:
                conn.close()
        except Exception as e:
            return {"status": "erro", "mensagem": f"Erro geral: {str(e)}"}

    @staticmethod
    def ativar_usuario(base, usuario):
        """Ativa usuário em uma base específica"""
        try:
            if base not in BASES:
                return {"status": "erro", "mensagem": f"Base {base} não encontrada"}
            
            host, porta = BASES[base].split(":")
            conn = DatabaseManager.conectar_banco(host, porta)
            if not conn:
                return {"status": "erro", "mensagem": f"Falha ao conectar na base {base}"}
            
            try:
                cursor = conn.cursor()
                cursor.execute("SELECT COUNT(*) FROM Usuario WHERE Nome = ?", (usuario,))
                if cursor.fetchone()[0] == 0:
                    return {"status": "erro", "mensagem": f"Usuário {usuario} não encontrado na base {base}"}
                
                # Ativa
                cursor.execute("UPDATE Usuario SET Ativo = 1 WHERE Nome = ?", (usuario,))
                conn.commit()
                
                return {"status": "sucesso", "mensagem": f"Usuário {usuario} ativado com sucesso na base {base}"}
                
            except Exception as e:
                conn.rollback()
                return {"status": "erro", "mensagem": f"Erro na ativação: {str(e)}"}
            finally:
                conn.close()
        except Exception as e:
            return {"status": "erro", "mensagem": f"Erro geral: {str(e)}"}

        
        
        
        
        
        

# Funções de interface para manter compatibilidade
def conectar_banco(host, porta):
    return DatabaseManager.conectar_banco(host, porta)

def varredura_usuario_global(usuario_destino):
    return UsuarioService.varredura_usuario_global(usuario_destino)

def varredura_usuario(usuario_destino, bases_selecionadas=None):
    return UsuarioService.varredura_usuario(usuario_destino, bases_selecionadas)

def sugerir_novo_usuario(usuario_base, bases_selecionadas=None):
    return UsuarioService.sugerir_novo_usuario(usuario_base, bases_selecionadas)

def replicar_usuario(usuario_origem, usuario_destino, nome_completo, email_suporte, usuario_ad, hosts_selecionados=None):
    return UsuarioService.replicar_usuario(usuario_origem, usuario_destino, nome_completo, email_suporte, usuario_ad, hosts_selecionados)

def replicar_perfil_para_destinos(perfil_origem, host_origem, hosts_destino):
    return PerfilService.replicar_perfil_para_destinos(perfil_origem, host_origem, hosts_destino)

def consultar_perfil_usuarios(nome_base, usuario_espelho, usuario_alterar):
    return PerfilService.consultar_perfil_usuarios(nome_base, usuario_espelho, usuario_alterar)

def alterar_perfil_usuario(nome_base, usuario_espelho, usuario_alterar, perfil_novo):
    return PerfilService.alterar_perfil_usuario(nome_base, usuario_espelho, usuario_alterar, perfil_novo)

def inativar_usuario(base, usuario):
    return InativacaoService.inativar_usuario(base, usuario)



def ativar_usuario(base, usuario):
    return InativacaoService.ativar_usuario(base, usuario)

