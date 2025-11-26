import pyodbc

try:
    conn = pyodbc.connect(
        "DRIVER={SQL Anywhere 17};"
        "HOST=10.64.160.233:49100;"
        "DBN=Scgwin;"
        "UID=dba;"
        "PWD=sql;"
    )
    print("✅ Conectado com sucesso!")
    cursor = conn.cursor()
    cursor.execute("SELECT TOP 1 * FROM Usuario")
    for row in cursor.fetchall():
        print(row)
    conn.close()
except Exception as e:
    print("❌ Erro:", e)
