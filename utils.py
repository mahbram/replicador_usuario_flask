from db import conectar_banco

def buscar_usuario(login, base):
    conn = conectar_banco(base)
    if not conn:
        return None
    cur = conn.cursor()
    cur.execute("SELECT login, nome, senha FROM usuario WHERE login = ?", (login,))
    usuario = cur.fetchone()
    cur.close()
    conn.close()
    return usuario

def criar_usuario(login, nome, senha, base):
    conn = conectar_banco(base)
    if not conn:
        return
    cur = conn.cursor()
    try:
        cur.execute("""
            INSERT INTO usuario (login, nome, senha)
            VALUES (?, ?, ?)
        """, (login, nome, senha))
        conn.commit()
        print(f"Usuário {login} criado na base {base}")
    except Exception as e:
        print(f"Erro ao criar usuário {login} na base {base}: {e}")
    finally:
        cur.close()
        conn.close()

def replicar_usuario(login, origem, destinos):
    usuario = buscar_usuario(login, origem)
    if not usuario:
        print(f"Usuário {login} não encontrado na base {origem}")
        return []

    replicadas = []
    for base in destinos:
        if base != origem:
            criar_usuario(*usuario, base)
            replicadas.append(base)
    return replicadas
