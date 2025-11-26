const BASES = {
    "BDP_100": "10.64.160.233:49100",
    "BDP_200": "10.64.160.230:49200",
    "BDP_300": "10.64.160.230:49300",
    "BDP_400": "10.64.160.230:49400",
    "BDP_500": "10.64.160.236:49500",
    "BDP_600": "10.64.160.235:49600",
    "BDP_700": "10.64.160.235:49707",
    "BDP_800": "10.64.160.233:49800",
    "BDP_900": "10.64.160.233:49900",
    "BDP_1000": "10.64.160.235:49001",
    "BDP_1100": "10.64.160.233:49011",
    "BDP_1200": "10.64.160.230:49012",
    "BDP_1300": "10.64.160.230:49013",
    "BDP_1400": "10.64.160.230:49014",
    "BDP_1500": "10.64.160.235:49015",
    "BDP_1600": "10.64.160.235:49016",
    "BDP_1700": "10.64.160.235:49017",
    "BDP_1800": "10.64.160.235:49018",
    "BDP_1900": "10.64.160.235:49019",
    "BDP_2000": "10.64.160.233:49020",
    "BDP_2100": "10.64.160.233:49021",
    "BDP_2200": "10.64.160.236:49022",
    "BDP_2300": "10.64.160.230:49230",
    "BDP_2400": "10.64.160.230:49240",
    "BDP_2500": "10.64.160.230:49250",
    "BDP_2600": "10.64.160.233:49026",
    "BDP_2700": "10.64.160.235:49027",
    "BDP_2800": "10.64.160.233:49280",
    "BDP_2900": "10.64.160.233:49290",
    "BDP_3000": "10.64.160.235:49030",
    "BDP_3100": "10.64.160.230:43100",
    "BDP_3200": "10.64.160.233:49032",
    "BDP_3300": "10.64.160.233:49033",
    "BDP_3400": "10.64.160.233:49034",
    "BDP_3500": "10.64.160.233:49035",
    "BDP_3600": "10.64.160.236:49036",
    "BDP_3700": "10.64.160.233:49037",
    "BDP_3800": "10.64.160.235:49038",
    "BDP_3900": "10.64.160.236:49039",
    "BDP_YIELD": "10.64.160.230:49021"
};


// Variável global para controle de inicialização
let sistemaInicializado = false;

// Inicialização quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    if (sistemaInicializado) {
        console.log('⚠️ Sistema já inicializado, ignorando...');
        return;
    }
    
    console.log('🚀 DOM Carregado - Iniciando sistema...');
    sistemaInicializado = true;
    
    inicializarBases();
    adicionarEventListeners();
    
    // Inicializar a contagem de bases selecionadas
    updateSelection('usuario');
    updateSelection('perfil');
    updateSelection('inativacao');
    
    // Configurar a validação do campo "Novo Usuário"
    configurarVarreduraUsuario();
    
    // Inicializar funcionalidade de alterar perfil
    inicializarAlterarPerfil();
});

// Inicializar as bases nos selects
function inicializarBases() {
    const usuarioContainer = document.getElementById("bases-container");
    const perfilContainer = document.getElementById("bases-container-perfil");
    const inativacaoContainer = document.getElementById("bases-container-inativacao");
    const selectBaseOrigem = document.getElementById("base_origem");
    
    // Limpar containers
    if (usuarioContainer) usuarioContainer.innerHTML = '';
    if (perfilContainer) perfilContainer.innerHTML = '';
    if (inativacaoContainer) inativacaoContainer.innerHTML = '';
    if (selectBaseOrigem) selectBaseOrigem.innerHTML = '<option value="">Selecione a base origem</option>';
    
    // Preencher bases para todas as seções
    Object.keys(BASES).forEach(base => {
        // Para seleção de bases destino (usuário)
        if (usuarioContainer) {
            const divUsuario = document.createElement("div");
            divUsuario.className = "checkbox-item";
            divUsuario.innerHTML = `
                <input type="checkbox" id="usuario_${base}" name="base" value="${base}" onchange="updateSelection('usuario')">
                <label for="usuario_${base}">${base}</label>
            `;
            usuarioContainer.appendChild(divUsuario);
        }
        
        // Para seleção de bases destino (perfil)
        if (perfilContainer) {
            const divPerfil = document.createElement("div");
            divPerfil.className = "checkbox-item";
            divPerfil.innerHTML = `
                <input type="checkbox" id="perfil_${base}" name="base-perfil" value="${base}" onchange="updateSelection('perfil')">
                <label for="perfil_${base}">${base}</label>
            `;
            perfilContainer.appendChild(divPerfil);
        }
        
        // Para seleção de bases (inativação)
        if (inativacaoContainer) {
            const divInativacao = document.createElement("div");
            divInativacao.className = "checkbox-item";
            divInativacao.innerHTML = `
                <input type="checkbox" id="inativacao_${base}" name="base-inativacao" value="${base}" onchange="updateSelection('inativacao')">
                <label for="inativacao_${base}">${base}</label>
            `;
            inativacaoContainer.appendChild(divInativacao);
        }
        
        // Para seleção de base origem (perfil)
        if (selectBaseOrigem) {
            const optionOrigem = document.createElement("option");
            optionOrigem.value = base;
            optionOrigem.textContent = base;
            selectBaseOrigem.appendChild(optionOrigem);
        }
    });
}

// Adicionar event listeners
function adicionarEventListeners() {
    console.log('🔧 Configurando event listeners...');
    
    // Navegação por abas
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            showForm(target);
        });
    });
    



    
    // ✅ BOTÕES DE AÇÃO COM VERIFICAÇÃO DE EXISTÊNCIA
    const botoesConfig = [
        { id: 'criar-usuario', funcao: criarUsuario },
        { id: 'criar-perfil', funcao: criarPerfil },
        { id: 'buscar-usuario', funcao: buscarUsuario },
        { id: 'confirmar-inativacao', funcao: confirmarInativacao }
     
    ];
    
    botoesConfig.forEach(botao => {
        const elemento = document.getElementById(botao.id);
        if (elemento) {
            // Remove event listener antigo primeiro
            elemento.removeEventListener('click', botao.funcao);
            // Adiciona novo event listener
            elemento.addEventListener('click', botao.funcao);
            console.log(`✅ Listener adicionado: ${botao.id}`);
        } else {
            console.warn(`⚠️ Botão ${botao.id} não encontrado - IGNORANDO`);
        }
    });
    
    // Fechar modal ao clicar fora dele
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('loadingModal');
        if (modal && event.target === modal) {
            fecharModal();
        }
    });
    
    console.log('✅ Todos os event listeners configurados com sucesso');
}

// Alternar entre formulários
function showForm(formId) {
    // Esconder todos os formulários
    document.querySelectorAll('.form-container').forEach(form => {
        form.classList.remove('active');
    });
    
    // Mostrar o formulário selecionado
    const formAlvo = document.getElementById(formId);
    if (formAlvo) {
        formAlvo.classList.add('active');
    }
    
    // Atualizar abas ativas
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Encontrar e ativar a aba correspondente
    const activeTab = document.querySelector(`.tab[data-target="${formId}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Fecha todos os dropdowns abertos ao trocar de aba
    document.querySelectorAll('.multiselect.open').forEach(ms => ms.classList.remove('open'));
    
    // Limpa resultados ao trocar de aba
    if (formId !== 'inativar-form') {
        const resultadoBusca = document.getElementById("resultado-busca");
        const resultadoInativacao = document.getElementById("resultado-inativacao");
        if (resultadoBusca) resultadoBusca.style.display = "none";
        if (resultadoInativacao) resultadoInativacao.style.display = "none";
    }
}

// Alternar checkboxes
function toggleCheckboxes(type) {
    const checkboxes = document.getElementById(`checkboxes-${type}`);
    if (!checkboxes) return;
    
    const multiselect = checkboxes.parentElement;
    
    // Fechar outros multiselects abertos
    document.querySelectorAll('.multiselect.open').forEach(ms => {
        if (ms !== multiselect) {
            ms.classList.remove('open');
        }
    });
    
    // Alternar o atual
    multiselect.classList.toggle('open');
}

// Selecionar todas as bases
function toggleAll(type) {
    const checkboxes = document.querySelectorAll(`#checkboxes-${type} input[type="checkbox"]`);
    const selectAll = document.getElementById(`selectAll${type.charAt(0).toUpperCase() + type.slice(1)}`);
    
    if (!selectAll) return;
    
    checkboxes.forEach(checkbox => {
        if (checkbox.id !== `selectAll${type.charAt(0).toUpperCase() + type.slice(1)}`) {
            checkbox.checked = selectAll.checked;
        }
    });
    
    updateSelection(type);
}

// Atualizar contador de bases selecionadas
function updateSelection(type) {
    let checkboxesName, selectedBasesTextId, selectedCountId;
    
    switch(type) {
        case 'usuario':
            checkboxesName = 'base';
            selectedBasesTextId = 'selectedBasesText';
            selectedCountId = 'selectedCount';
            break;
        case 'perfil':
            checkboxesName = 'base-perfil';
            selectedBasesTextId = 'selectedBasesTextPerfil';
            selectedCountId = 'selectedCountPerfil';
            break;
        case 'inativacao':
            checkboxesName = 'base-inativacao';
            selectedBasesTextId = 'selectedBasesTextInativacao';
            selectedCountId = 'selectedCountInativacao';
            break;
        default:
            return;
    }
    
    const selected = document.querySelectorAll(`input[name="${checkboxesName}"]:checked`);
    const selectedBasesText = document.getElementById(selectedBasesTextId);
    const selectedCount = document.getElementById(selectedCountId);
    
    if (selectedBasesText && selectedCount) {
        if (selected.length === 0) {
            selectedBasesText.textContent = 'Selecionar bases';
        } else if (selected.length === 1) {
            selectedBasesText.textContent = selected[0].value;
        } else {
            selectedBasesText.textContent = `${selected.length} bases selecionadas`;
        }
        
        selectedCount.textContent = selected.length;
        
        // Atualiza também o checkbox "Selecionar Todas"
        const selectAllId = `selectAll${type.charAt(0).toUpperCase() + type.slice(1)}`;
        const selectAll = document.getElementById(selectAllId);
        if (selectAll) {
            const allCheckboxes = document.querySelectorAll(`input[name="${checkboxesName}"]`);
            selectAll.checked = selected.length === allCheckboxes.length;
            selectAll.indeterminate = selected.length > 0 && selected.length < allCheckboxes.length;
        }
    }
}





// ========== FUNÇÃO CRIAR USUÁRIO ==========
function criarUsuario() {
    // Limpar mensagens de erro anteriores
    limparErros('usuario');
    
    const usuario_origem = document.getElementById("usuario_origem")?.value.trim() || '';
    const usuario_destino = document.getElementById("usuario_destino")?.value.trim() || '';
    const nome_completo = document.getElementById("nome_completo")?.value.trim() || '';
    const email_suporte = document.getElementById("email_suporte")?.value.trim() || '';
    const usuario_ad = document.getElementById("usuario_ad")?.value.trim() || '';
    const basesSelecionadas = Array.from(document.querySelectorAll("input[name='base']:checked"))
                                .map(cb => cb.value);

    // Validar formulário
    if (!validarFormularioUsuario()) {
        return;
    }

    // VERIFICAÇÃO FINAL: Confirma que o usuário não existe em nenhuma base
    const errorDiv = document.getElementById("usuario_destino_error");
    if (errorDiv && errorDiv.style.color === 'red') {
        alert('Por favor, resolva o problema com o usuário destino antes de continuar.');
        document.getElementById("usuario_destino").focus();
        return;
    }

    // Limpa modal e resultado
    const loadingLista = document.getElementById("loadingLista");
    const resultadoUsuario = document.getElementById("resultado-usuario");
    if (loadingLista) loadingLista.innerHTML = "";
    if (resultadoUsuario) resultadoUsuario.innerHTML = "";

    // Mostra modal
    mostrarModal("Iniciando replicação...");

    fetch("/criar_usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            usuario_origem, 
            usuario_destino, 
            nome_completo, 
            email_suporte,
            usuario_ad,
            bases: basesSelecionadas
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.erro) {
            mostrarModal(` Erro: ${data.erro}`);
            setTimeout(() => fecharModal(), 3000);
            return;
        }

        // Atualiza modal base a base
        if (data.relatorio) {
            data.relatorio.forEach(item => {
                mostrarModal(`[${item.base}] ${item.mensagem}`);
            });
        }

        // Atualiza div de resultados final
        const resultadoDiv = document.getElementById("resultado-usuario");
        if (resultadoDiv && data.relatorio) {
            data.relatorio.forEach(item => {
                const div = document.createElement("div");
                div.classList.add("resultado-item");

                if (item.status === "sucesso") div.classList.add("sucesso");
                else if (item.status === "erro") div.classList.add("erro");
                else if (item.status === "aviso") div.classList.add("aviso");

                div.innerHTML = `<i class="fas fa-${getIconForStatus(item.status)}"></i> <strong>${item.base}:</strong> ${item.mensagem}`;
                resultadoDiv.appendChild(div);
            });
            resultadoDiv.style.display = "block";
        }
        
        // Fecha modal após 2 segundos
        setTimeout(() => fecharModal(), 2000);
    })
    .catch(err => {
        mostrarModal("❌ Erro: " + err.message);
        console.error(err);
        setTimeout(() => fecharModal(), 3000);
    });
}




// ========== CONFIGURAÇÃO DA VARREDURA DO USUÁRIO ==========
function configurarVarreduraUsuario() {
    const campoUsuarioDestino = document.getElementById("usuario_destino");
    
    if (campoUsuarioDestino) {
        console.log('✅ Configurando validação do usuário destino...');
        
        // Remove event listeners antigos primeiro
        const novoCampo = campoUsuarioDestino.cloneNode(true);
        campoUsuarioDestino.parentNode.replaceChild(novoCampo, campoUsuarioDestino);
        
        // Nova referência
        const campoAtual = document.getElementById("usuario_destino");
        
        // Evento blur - quando sai do campo
        campoAtual.addEventListener('blur', function() {
            const usuarioDestino = this.value.trim().toUpperCase();
            console.log('🔍 Blur disparado para:', usuarioDestino);
            if (usuarioDestino.length >= 3) {
                fazerVarreduraGlobal(usuarioDestino);
            }
        });
        
        // Evento keydown - Enter
        campoAtual.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const usuarioDestino = this.value.trim().toUpperCase();
                console.log('🔍 Enter disparado para:', usuarioDestino);
                if (usuarioDestino.length >= 3) {
                    fazerVarreduraGlobal(usuarioDestino);
                }
            }
        });
        
        console.log('🎯 Eventos de validação configurados com sucesso!');
    } else {
        console.error('❌ Campo usuario_destino não encontrado para configurar validação!');
    }
}

function atualizarDropdownBases(basesDisponiveis) {
    const select = document.getElementById("bases_selecionadas");
    if (!select) return;

    Array.from(select.options).forEach(option => {
        if (basesDisponiveis.includes(option.value)) {
            option.disabled = false;
            option.style.color = "#000"; // cor normal
        } else {
            option.disabled = true;
            option.style.color = "#aaa"; // cinza para desabilitado
        }
    });
}

function fazerVarreduraGlobal(usuarioDestino) {
    criarToastInterativo(`🔍 Verificando usuário ${usuarioDestino}...`, "info", 3000);

    fetch("/varredura_usuario_global", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_destino: usuarioDestino })
    })
    .then(response => {
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        return response.json();
    })
    .then(data => {
        if (data.erro) {
            criarToastInterativo(`❌ Erro: ${data.erro}`, "error", 5000);
            return;
        }

        const resultado = data.varredura;

        // Atualiza dropdown com bases disponíveis
        atualizarDropdownBases(resultado.bases_sem_usuario);

        if (resultado.bases_encontradas.length > 0) {
            criarToastInterativo(
                `❌ Usuário ${usuarioDestino} já existe!`,
                "error",
                8000,
                resultado.bases_encontradas,
                usuarioDestino
            );
        } else {
            criarToastInterativo(
                `✅ Usuário ${usuarioDestino} não existe em nenhuma base.`,
                "success",
                5000
            );
        }
    })
    .catch(error => {
        console.error("❌ Erro na requisição:", error);
        criarToastInterativo(`❌ Erro na requisição: ${error.message}`, "error", 5000);
    });
}


function sugerirNovoUsuarioGlobal(usuarioBase) {
    console.log('💡 Sugerindo novo usuário para:', usuarioBase);
    
    // Gera uma sugestão simples (você pode implementar lógica mais complexa)
    const sugestao = usuarioBase + 'A';
    const campoUsuario = document.getElementById("usuario_destino");
    if (campoUsuario) {
        campoUsuario.value = sugestao;
    }
    
    // Faz nova varredura com a sugestão
    setTimeout(() => {
        fazerVarreduraGlobal(sugestao);
    }, 500);
}





// ========== FUNÇÃO CRIAR PERFIL ==========
function criarPerfil() {
    // Limpar mensagens de erro
    limparErros('perfil');
    
    const perfil_origem = document.getElementById("perfil_origem")?.value.trim().toUpperCase() || '';
    const base_origem = document.getElementById("base_origem")?.value || '';
    const basesSelecionadas = Array.from(document.querySelectorAll("input[name='base-perfil']:checked"))
                                .map(cb => cb.value);

    // Validar formulário
    if (!validarFormularioPerfil()) {
        return;
    }

    // Limpar resultados anteriores
    const resultadoDiv = document.getElementById("resultado-perfil");
    if (resultadoDiv) resultadoDiv.innerHTML = "";
    
    // Mostrar loading
    mostrarModal("Validando perfil na base origem...");

    // Dados da requisição
    const dados = {
        perfil_origem: perfil_origem,
        base_origem: base_origem,
        bases_destino: basesSelecionadas
    };

    // Chamar backend
    fetch("/replicar_perfil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.erro || `Erro ${response.status}`); });
        }
        return response.json();
    })
    .then(data => {
        if (data.erro) {
            throw new Error(data.erro);
        }
        
        // Mostrar resultados
        const resultadoDiv = document.getElementById("resultado-perfil");
        if (resultadoDiv && data.relatorio) {
            data.relatorio.forEach(item => {
                const div = document.createElement("div");
                div.classList.add("resultado-item");
                
                if (item.status === "sucesso") div.classList.add("sucesso");
                else if (item.status === "erro") div.classList.add("erro");
                else if (item.status === "aviso") div.classList.add("aviso");
                
                div.innerHTML = `<i class="fas fa-${getIconForStatus(item.status)}"></i> <strong>${item.base}:</strong> ${item.mensagem}`;
                resultadoDiv.appendChild(div);
            });
            resultadoDiv.style.display = "block";
        }
        fecharModal();
    })
    .catch(error => {
        const resultadoDiv = document.getElementById("resultado-perfil");
        if (resultadoDiv) {
            resultadoDiv.innerHTML = `
                <div class="resultado-item erro">
                    <i class="fas fa-times-circle"></i> 
                    <strong>Erro:</strong> ${error.message}
                </div>
            `;
            resultadoDiv.style.display = "block";
        }
        fecharModal();
    });
}




// ========== BUSCAR USUÁRIO MÚLTIPLAS BASES ==========
function buscarUsuario() {
    if (!validarFormularioInativacao()) {
        return;
    }

    const basesSelecionadas = Array.from(document.querySelectorAll("input[name='base-inativacao']:checked"))
                                .map(cb => cb.value);
    const usuario = document.getElementById("usuario_inativar")?.value.trim().toUpperCase() || '';

    mostrarModal(`Buscando usuário em ${basesSelecionadas.length} bases...`);

    // array de promises para buscar em TODAS as bases simultaneamente
    const promises = basesSelecionadas.map(base => {
        return fetch("/buscar_usuario", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ base, usuario })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status} para base ${base}`);
            }
            return response.json();
        })
        .then(data => {
            return {
                base: base,
                data: data,
                error: null
            };
        })
        .catch(error => {
            return {
                base: base,
                data: null,
                error: error.message
            };
        });
    });

    // Aguardar TODAS as buscas serem concluídas
    Promise.all(promises)
    .then(results => {
        const resultadoBusca = document.getElementById("resultado-busca");
        if (!resultadoBusca) return;
        
        resultadoBusca.innerHTML = '';
        
        // Processar resultado de CADA base
        results.forEach(result => {
            const divBase = document.createElement("div");
            divBase.className = "base-resultado";
            divBase.style.border = "1px solid #ddd";
            divBase.style.padding = "15px";
            divBase.style.marginBottom = "10px";
            divBase.style.borderRadius = "5px";
            
            if (result.error) {
                divBase.innerHTML = `
                    <h4>Base: ${result.base}</h4>
                    <div class="user-info">
                        <div class="resultado-item erro">
                            <i class="fas fa-times-circle"></i> Erro: ${result.error}
                        </div>
                    </div>
                `;
            } else if (result.data.erro) {
                divBase.innerHTML = `
                    <h4>Base: ${result.base}</h4>
                    <div class="user-info">
                        <div class="resultado-item erro">
                            <i class="fas fa-times-circle"></i> ${result.data.erro}
                        </div>
                    </div>
                `;
            } else {
                divBase.innerHTML = `
                    <h4>Base: ${result.base}</h4>
                    <div class="user-info">
                        <p><strong>Nome:</strong> <span id="info-nome-${result.base}">${result.data.nome || usuario}</span></p>
                        <p><strong>Perfil:</strong> <span id="info-perfil-${result.base}">${result.data.perfil || 'N/A'}</span></p>
                        <p><strong>Setor:</strong> <span id="info-setor-${result.base}">${result.data.setor || 'N/A'}</span></p>
                        <p><strong>Status:</strong> <span id="info-status-${result.base}">
                            ${result.data.ativo ? 
                                '<span class="status-ativo">ATIVO</span>' : 
                                '<span class="status-inativo">INATIVO</span>'
                            }
                        </span></p>
                       
                    </div>
                `;
            }
            
            resultadoBusca.appendChild(divBase);
        });
        
        // Adicionar botão para inativar em TODAS as bases de uma vez
        const basesAtivas = results.filter(result => result.data && result.data.ativo);
        if (basesAtivas.length > 0) {
            const divInativarTodas = document.createElement("div");
            divInativarTodas.style.textAlign = "center";
            divInativarTodas.style.marginTop = "20px";
            divInativarTodas.innerHTML = `

            `;
            resultadoBusca.appendChild(divInativarTodas);
        }
        
        resultadoBusca.style.display = "block";
        const resultadoInativacao = document.getElementById("resultado-inativacao");
        if (resultadoInativacao) resultadoInativacao.style.display = "none";
        fecharModal();
    })
    .catch(error => {
        console.error("Erro geral:", error);
        const resultadoBusca = document.getElementById("resultado-busca");
        if (resultadoBusca) {
            resultadoBusca.innerHTML = `
                <div class="resultado-item erro">
                    <i class="fas fa-times-circle"></i> Erro na busca: ${error.message}
                </div>
            `;
            resultadoBusca.style.display = "block";
        }
        fecharModal();
    });
}




// ========== CONFIRMAR INATIVAÇÃO ==========
function confirmarInativacao() {
    const base = document.getElementById("base_inativacao")?.value || '';
    const usuario = document.getElementById("usuario_inativar")?.value.trim().toUpperCase() || '';

    if (!confirm(`Tem certeza que deseja inativar o usuário ${usuario} na base ${base}?`)) {
        return;
    }

    mostrarModal("Inativando usuário...");

    fetch("/inativar_usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base, usuario })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const resultadoDiv = document.getElementById("resultado-inativacao");
        if (!resultadoDiv) return;
        
        resultadoDiv.innerHTML = '';
        
        if (data.erro) {
            resultadoDiv.innerHTML = `
                <div class="resultado-item erro">
                    <i class="fas fa-times-circle"></i> ${data.erro}
                </div>
            `;
        } else {
            resultadoDiv.innerHTML = `
                <div class="resultado-item sucesso">
                    <i class="fas fa-check-circle"></i> ${data.mensagem}
                </div>
            `;
            // Atualiza o status para inativo
            const infoStatus = document.getElementById("info-status");
            if (infoStatus) {
                infoStatus.innerHTML = '<span class="status-inativo">INATIVO</span>';
            }
            const confirmarBtn = document.getElementById("confirmar-inativacao");
            if (confirmarBtn) confirmarBtn.style.display = "none";
        }
        resultadoDiv.style.display = "block";
        fecharModal();
    })
    .catch(err => {
        console.error("Erro:", err);
        fecharModal();
    });
}







//  FUNÇÕES DE INATIVAÇÃO PARA MÚLTIPLAS BASES 
function inativarBaseIndividual(base, usuario) {
    if (!confirm(`Tem certeza que deseja inativar o usuário ${usuario} na base ${base}?`)) {
        return;
    }

    mostrarModal(`Inativando usuário na base ${base}...`);

    fetch("/inativar_usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base, usuario })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const resultadoDiv = document.getElementById("resultado-inativacao");
        if (!resultadoDiv) return;
        
        resultadoDiv.innerHTML = '';
        
        if (data.erro) {
            resultadoDiv.innerHTML = `
                <div class="resultado-item erro">
                    <i class="fas fa-times-circle"></i> Base ${base}: ${data.erro}
                </div>
            `;
        } else {
            resultadoDiv.innerHTML = `
                <div class="resultado-item sucesso">
                    <i class="fas fa-check-circle"></i> Base ${base}: ${data.mensagem}
                </div>
            `;
            
            // Atualizar a interface - marcar como inativo
            const statusElement = document.getElementById(`info-status-${base}`);
            if (statusElement) {
                statusElement.innerHTML = '<span class="status-inativo">INATIVO</span>';
            }
            
            // Remover o botão de inativação individual
            const button = document.querySelector(`button[onclick="inativarBaseIndividual('${base}', '${usuario}')"]`);
            if (button) {
                button.outerHTML = '<p class="usuario-inativo"><i class="fas fa-ban"></i> Usuário inativado com sucesso</p>';
            }
        }
        resultadoDiv.style.display = "block";
        fecharModal();
    })
    .catch(err => {
        console.error("Erro:", err);
        const resultadoDiv = document.getElementById("resultado-inativacao");
        if (resultadoDiv) {
            resultadoDiv.innerHTML = `
                <div class="resultado-item erro">
                    <i class="fas fa-times-circle"></i> Erro: ${err.message}
                </div>
            `;
            resultadoDiv.style.display = "block";
        }
        fecharModal();
    });
}

function inativarEmTodasBases() {
    const basesSelecionadas = Array.from(document.querySelectorAll("input[name='base-inativacao']:checked"))
                                .map(cb => cb.value);
    const usuario = document.getElementById("usuario_inativar")?.value.trim().toUpperCase() || '';

    // Filtrar apenas bases que estão ativas (baseado na interface)
    const basesAtivas = basesSelecionadas.filter(base => {
        const statusElement = document.getElementById(`info-status-${base}`);
        return statusElement && statusElement.textContent.includes('ATIVO');
    });

    if (basesAtivas.length === 0) {
        alert('Não há usuários ativos para inativar nas bases selecionadas.');
        return;
    }

    if (!confirm(`Tem certeza que deseja inativar o usuário ${usuario} em ${basesAtivas.length} bases?\n\nBases: ${basesAtivas.join(', ')}`)) {
        return;
    }

    mostrarModal(`Inativando usuário em ${basesAtivas.length} bases...`);

    // Criar promises para inativar em todas as bases simultaneamente
    const promises = basesAtivas.map(base => {
        return fetch("/inativar_usuario", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ base, usuario })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            return {
                base: base,
                data: data,
                error: null
            };
        })
        .catch(error => {
            return {
                base: base,
                data: null,
                error: error.message
            };
        });
    });

    Promise.all(promises)
    .then(results => {
        const resultadoDiv = document.getElementById("resultado-inativacao");
        if (!resultadoDiv) return;
        
        resultadoDiv.innerHTML = '<h3>Resultado da Inativação em Múltiplas Bases:</h3>';
        
        results.forEach(result => {
            const div = document.createElement("div");
            div.classList.add("resultado-item");
            
            if (result.error || (result.data && result.data.erro)) {
                div.classList.add("erro");
                div.innerHTML = `<i class="fas fa-times-circle"></i> <strong>${result.base}:</strong> ${result.error || result.data.erro}`;
            } else {
                div.classList.add("sucesso");
                div.innerHTML = `<i class="fas fa-check-circle"></i> <strong>${result.base}:</strong> ${result.data.mensagem}`;
                
                // Atualizar a interface
                const statusElement = document.getElementById(`info-status-${result.base}`);
                if (statusElement) {
                    statusElement.innerHTML = '<span class="status-inativo">INATIVO</span>';
                }
                
                const button = document.querySelector(`button[onclick="inativarBaseIndividual('${result.base}', '${usuario}')"]`);
                if (button) {
                    button.outerHTML = '<p class="usuario-inativo"><i class="fas fa-ban"></i> Usuário inativado com sucesso</p>';
                }
            }
            
            resultadoDiv.appendChild(div);
        });
        
        resultadoDiv.style.display = "block";
        fecharModal();
    })
    .catch(err => {
        console.error("Erro:", err);
        fecharModal();
    });
}

// Função para ativar um usuário em uma base
function ativarBaseIndividual(base, usuario) {
    if (!confirm(`Tem certeza que deseja ativar o usuário ${usuario} na base ${base}?`)) return;

    mostrarModal(`Ativando usuário na base ${base}...`);

    fetch("/ativar_usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base, usuario })
    })
    .then(response => response.json())
    .then(data => {
        // Exibir toast de sucesso ou erro
        if (data.mensagem) {
            mostrarToast("success", `Base ${base}: ${data.mensagem}`);
            
            // Atualiza status do usuário no card
            const statusElement = document.getElementById(`info-status-${base}`);
            if (statusElement) statusElement.innerHTML = '<span class="status-ativo">ATIVO</span>';

            // Substitui botão de ativar pelo botão de inativar
            const button = document.querySelector(`button[onclick="ativarBaseIndividual('${base}', '${usuario}')"]`);
            if (button) {
                button.outerHTML = `
                    <button class="btn-inativar" onclick="inativarBaseIndividual('${base}', '${usuario}')">
                        <i class="fas fa-user-slash"></i> Inativar nesta base
                    </button>
                `;
            }
        } else if (data.erro) {
            mostrarToast("error", `Base ${base}: ${data.erro}`);
        }

        // Atualiza div de resultado geral
        const resultadoDiv = document.getElementById("resultado-inativacao");
        if (resultadoDiv) {
            resultadoDiv.style.display = "block";
        }
    })
    .catch(err => {
        mostrarToast("error", `Erro ao ativar usuário na base ${base}: ${err.message}`);
        console.error(err);
    })
    .finally(() => fecharModal());
}




function confirmarAtivacao() {
    const base = document.getElementById("base_inativacao")?.value || '';
    const usuario = document.getElementById("usuario_inativar")?.value.trim().toUpperCase() || '';

    if (!confirm(`Tem certeza que deseja ativar o usuário ${usuario} na base ${base}?`)) {
        return;
    }

    mostrarModal("Ativando usuário...");

    fetch("/ativar_usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base, usuario })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const resultadoDiv = document.getElementById("resultado-inativacao");
        if (!resultadoDiv) return;
        
        resultadoDiv.innerHTML = '';
        
        if (data.erro) {
            resultadoDiv.innerHTML = `
                <div class="resultado-item erro">
                    <i class="fas fa-times-circle"></i> ${data.erro}
                </div>
            `;
        } else {
            resultadoDiv.innerHTML = `
                <div class="resultado-item sucesso">
                    <i class="fas fa-check-circle"></i> ${data.mensagem}
                </div>
            `;
            // Atualiza o status para ativo
            const infoStatus = document.getElementById("info-status");
            if (infoStatus) {
                infoStatus.innerHTML = '<span class="status-ativo">ATIVO</span>';
            }
            const confirmarBtn = document.getElementById("confirmar-ativacao");
            if (confirmarBtn) confirmarBtn.style.display = "none";
            
            // Mostra o botão de inativação
            const inativarBtn = document.getElementById("confirmar-inativacao");
            if (inativarBtn) inativarBtn.style.display = "block";
        }
        resultadoDiv.style.display = "block";
        fecharModal();
    })
    .catch(err => {
        console.error("Erro:", err);
        fecharModal();
    });
}



function ativarBaseIndividual(base, usuario) {
    if (!confirm(`Tem certeza que deseja ativar o usuário ${usuario} na base ${base}?`)) {
        return;
    }

    mostrarModal(`Ativando usuário na base ${base}...`);

    fetch("/ativar_usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base, usuario })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const resultadoDiv = document.getElementById("resultado-inativacao");
        if (!resultadoDiv) return;
        
        resultadoDiv.innerHTML = '';
        
        if (data.erro) {
            resultadoDiv.innerHTML = `
                <div class="resultado-item erro">
                    <i class="fas fa-times-circle"></i> Base ${base}: ${data.erro}
                </div>
            `;
        } else {
            resultadoDiv.innerHTML = `
                <div class="resultado-item sucesso">
                    <i class="fas fa-check-circle"></i> Base ${base}: ${data.mensagem}
                </div>
            `;
            
            // Atualizar a interface - marcar como ativo
            const statusElement = document.getElementById(`info-status-${base}`);
            if (statusElement) {
                statusElement.innerHTML = '<span class="status-ativo">ATIVO</span>';
            }
            
            // Substituir o botão de ativação individual pelo de inativação
            const button = document.querySelector(`button[onclick="ativarBaseIndividual('${base}', '${usuario}')"]`);
            if (button) {
                button.outerHTML = `
                    <button class="btn-inativar" onclick="inativarBaseIndividual('${base}', '${usuario}')">
                        <i class="fas fa-user-slash"></i> Inativar nesta base
                    </button>
                `;
            }
        }
        resultadoDiv.style.display = "block";
        fecharModal();
    })
    .catch(err => {
        console.error("Erro:", err);
        const resultadoDiv = document.getElementById("resultado-inativacao");
        if (resultadoDiv) {
            resultadoDiv.innerHTML = `
                <div class="resultado-item erro">
                    <i class="fas fa-times-circle"></i> Erro: ${err.message}
                </div>
            `;
            resultadoDiv.style.display = "block";
        }
        fecharModal();
    });
}
//adicionei a funcionalidade acima 08/10/2025

function initInativacao() {
    const btn = document.getElementById("buscar-usuario-inativacao");
    if (btn) btn.addEventListener("click", buscarUsuario);
}
async function ativarEmTodasBases() {
    const basesSelecionadas = Array.from(document.querySelectorAll("input[name='base-inativacao']:checked"))
                                   .map(cb => cb.value);
    const usuario = document.getElementById("usuario_inativar")?.value.trim().toUpperCase() || '';

    // Filtrar apenas bases que estão inativas (baseado na interface)
    const basesInativas = basesSelecionadas.filter(base => {
        const statusElement = document.getElementById(`info-status-${base}`);
        return statusElement && statusElement.textContent.includes('INATIVO');
    });

    if (basesInativas.length === 0) {
        alert('Não há usuários inativos para ativar nas bases selecionadas.');
        return;
    }

    if (!confirm(`Tem certeza que deseja ativar o usuário ${usuario} em ${basesInativas.length} bases?\n\nBases: ${basesInativas.join(', ')}`)) {
        return;
    }

    mostrarModal(`Ativando usuário em ${basesInativas.length} bases...`);

    // Criar promises para ativar em todas as bases simultaneamente
    const promises = basesInativas.map(base => {
        return fetch("/ativar_usuario", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ base, usuario })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            return {
                base: base,
                data: data,
                error: null
            };
        })
        .catch(error => {
            return {
                base: base,
                data: null,
                error: error.message
            };
        });
    });

    Promise.all(promises)
    .then(results => {
        const resultadoDiv = document.getElementById("resultado-inativacao");
        if (!resultadoDiv) return;
        
        resultadoDiv.innerHTML = '<h3>Resultado da Ativação em Múltiplas Bases:</h3>';
        
        results.forEach(result => {
            const div = document.createElement("div");
            div.classList.add("resultado-item");
            
            if (result.error || (result.data && result.data.erro)) {
                div.classList.add("erro");
                div.innerHTML = `<i class="fas fa-times-circle"></i> <strong>${result.base}:</strong> ${result.error || result.data.erro}`;
            } else {
                div.classList.add("sucesso");
                div.innerHTML = `<i class="fas fa-check-circle"></i> <strong>${result.base}:</strong> ${result.data.mensagem}`;
                
                // Atualizar a interface
                const statusElement = document.getElementById(`info-status-${result.base}`);
                if (statusElement) {
                    statusElement.innerHTML = '<span class="status-ativo">ATIVO</span>';
                }
                
                // Substituir botão de ativar pelo botão de inativar
                const button = document.querySelector(`button[onclick="ativarBaseIndividual('${result.base}', '${usuario}')"]`);
                if (button) {
                    button.outerHTML = `
                        <button class="btn-inativar" onclick="inativarBaseIndividual('${result.base}', '${usuario}')">
                            <i class="fas fa-user-slash"></i> Inativar nesta base
                        </button>
                    `;
                }
            }
            
            resultadoDiv.appendChild(div);
        });
        
        resultadoDiv.style.display = "block";
        fecharModal();
    })
    .catch(err => {
        console.error("Erro:", err);
        fecharModal();
    });
}



//  FUNÇÕES DE VALIDAÇÃO 
function validarFormularioUsuario() {
    let valido = true;
    
    // Validar usuário origem
    const usuarioOrigem = document.getElementById("usuario_origem")?.value.trim() || '';
    if (!usuarioOrigem) {
        const errorElement = document.getElementById("usuario_origem_error");
        if (errorElement) errorElement.textContent = 'Usuário origem é obrigatório';
        valido = false;
    }
    
    // Validar usuário destino
    const usuarioDestino = document.getElementById("usuario_destino")?.value.trim() || '';
    if (!usuarioDestino) {
        const errorElement = document.getElementById("usuario_destino_error");
        if (errorElement) errorElement.textContent = 'Usuário destino é obrigatório';
        valido = false;
    }
    
    // Validar nome completo
    const nomeCompleto = document.getElementById("nome_completo")?.value.trim() || '';
    if (!nomeCompleto) {
        const errorElement = document.getElementById("nome_completo_error");
        if (errorElement) errorElement.textContent = 'Nome completo é obrigatório';
        valido = false;
    }
    
    // Validar email
    const emailSuporte = document.getElementById("email_suporte")?.value.trim() || '';
    if (!emailSuporte) {
        const errorElement = document.getElementById("email_suporte_error");
        if (errorElement) errorElement.textContent = 'E-mail de suporte é obrigatório';
        valido = false;
    } else if (!/\S+@\S+\.\S+/.test(emailSuporte)) {
        const errorElement = document.getElementById("email_suporte_error");
        if (errorElement) errorElement.textContent = 'E-mail inválido';
        valido = false;
    }
    
    // Validar bases selecionadas
    const basesSelecionadas = Array.from(document.querySelectorAll('input[name="base"]:checked'));
    if (basesSelecionadas.length === 0) {
        const errorElement = document.getElementById("bases_error");
        if (errorElement) errorElement.textContent = 'Selecione pelo menos uma base destino';
        valido = false;
    }
    
    return valido;
}

function validarFormularioPerfil() {
    let valido = true;
    
    // Validar base origem
    const baseOrigem = document.getElementById("base_origem")?.value || '';
    if (!baseOrigem) {
        const errorElement = document.getElementById("base_origem_error");
        if (errorElement) errorElement.textContent = 'Base origem é obrigatória';
        valido = false;
    }
    
    // Validar perfil origem
    const perfilOrigem = document.getElementById("perfil_origem")?.value.trim() || '';
    if (!perfilOrigem) {
        const errorElement = document.getElementById("perfil_origem_error");
        if (errorElement) errorElement.textContent = 'Perfil origem é obrigatório';
        valido = false;
    }
    
    // Validar bases destino
    const basesDestino = Array.from(document.querySelectorAll('input[name="base-perfil"]:checked'));
    if (basesDestino.length === 0) {
        const errorElement = document.getElementById("bases_perfil_error");
        if (errorElement) errorElement.textContent = 'Selecione pelo menos uma base destino';
        valido = false;
    }
    
    return valido;
}

function validarFormularioInativacao() {
    let valido = true;
    
    const basesSelecionadas = Array.from(document.querySelectorAll("input[name='base-inativacao']:checked"));
    const usuario = document.getElementById("usuario_inativar")?.value.trim() || '';
    
    // Limpar erros primeiro
    limparErros('inativar');
    
    // Validar bases selecionadas
    if (basesSelecionadas.length === 0) {
        const errorElement = document.getElementById("bases_inativacao_error");
        if (errorElement) {
            errorElement.textContent = 'Selecione pelo menos uma base';
            valido = false;
        }
    }
    
    // Validar usuário
    if (!usuario) {
        const errorElement = document.getElementById("usuario_inativar_error");
        if (errorElement) {
            errorElement.textContent = 'Informe o usuário';
            valido = false;
        }
    }
    
    return valido;
}










// FUNÇÕES AUXILIARES 
function limparErros(tipo) {
    try {
        const errorElements = document.querySelectorAll('.error-text');
        errorElements.forEach(el => {
            if (el && el.textContent !== null) {
                el.textContent = '';
            }
        });
        
        const errorIds = {
            'usuario': ['usuario_origem_error', 'usuario_destino_error', 'nome_completo_error', 'email_suporte_error', 'bases_error'],
            'perfil': ['base_origem_error', 'perfil_origem_error', 'bases_perfil_error'],
            'inativar': ['usuario_inativar_error', 'bases_inativacao_error']
        };
        
        if (errorIds[tipo]) {
            errorIds[tipo].forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = '';
                }
            });
        }
    } catch (error) {
        console.warn('Erro ao limpar mensagens de erro:', error);
    }
}

function mostrarModal(mensagem) {
    const loadingLista = document.getElementById("loadingLista");
    const loadingModal = document.getElementById("loadingModal");
    
    if (!loadingLista || !loadingModal) return;
    
    const item = document.createElement("li");
    item.innerText = mensagem;
    loadingLista.appendChild(item);
    loadingModal.style.display = "flex";
    
    setTimeout(() => {
        loadingModal.classList.add("show");
    }, 10);
}

function fecharModal() {
    const loadingModal = document.getElementById("loadingModal");
    const loadingLista = document.getElementById("loadingLista");
    
    if (loadingModal) {
        loadingModal.classList.remove("show");
        
        setTimeout(() => {
            loadingModal.style.display = "none";
            if (loadingLista) loadingLista.innerHTML = "";
        }, 300);
    }
}

function getIconForStatus(status) {
    switch(status) {
        case 'sucesso': return 'check-circle';
        case 'erro': return 'times-circle';
        case 'aviso': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

















// FUNÇÕES PARA ALTERAR PERFIL 

function inicializarAlterarPerfil() {
    console.log('🚀 Inicializando Alterar Perfil...');
    
    try {
        // Preenche as bases disponíveis
        preencherBasesDisponiveisAlteracaoPerfil();
        
        // Event listeners
        const btnConsultar = document.getElementById('consultar-perfil');
        const btnConfirmar = document.getElementById('confirmar-alteracao');
        
        if (btnConsultar) {
            btnConsultar.addEventListener('click', consultarPerfil);
        }
        
        if (btnConfirmar) {
            btnConfirmar.addEventListener('click', confirmarAlteracaoPerfil);
        }
        
        console.log('✅ Alterar Perfil inicializado com segurança.');
        
    } catch (error) {
        console.error('❌ Erro na inicialização do Alterar Perfil:', error);
    }
}




function preencherBasesDisponiveisAlteracaoPerfil() {
    const container = document.getElementById('bases-container-alteracao-perfil');
    if (!container) return;

    container.innerHTML = '';

    const bases = Object.keys(BASES || {});

    bases.forEach(nomeBase => {
        const checkboxId = `base_alteracao_perfil_${nomeBase.replace(/[^a-zA-Z0-9]/g, '_')}`;

        const checkboxItem = document.createElement('div');
        checkboxItem.className = 'checkbox-item';
        checkboxItem.innerHTML = `
            <input type="checkbox" id="${checkboxId}" name="bases_alteracao_perfil" value="${nomeBase}" onchange="atualizarContadorBaseAlteracaoPerfil()">
            <label for="${checkboxId}">${nomeBase}</label>
        `;

        container.appendChild(checkboxItem);
    });
}







function atualizarContadorBaseAlteracaoPerfil() {
    const checkboxesMarcados = document.querySelectorAll('input[name="bases_alteracao_perfil"]:checked');

    const contadorElement = document.getElementById('contador-base-alteracao');
    const selectedText = document.getElementById('selectedBaseTextAlteracao');
    const selectedCount = document.getElementById('selectedCountAlteracao');

    if (checkboxesMarcados.length === 1) {
        const baseSelecionada = checkboxesMarcados[0].value;
        if (contadorElement) {
            contadorElement.innerHTML = `<i class="fas fa-database"></i> Base selecionada: <strong>${baseSelecionada}</strong>`;
            contadorElement.style.background = '#e8f6f3';
            contadorElement.style.borderLeftColor = '#27ae60';
            contadorElement.style.color = '#27ae60';
        }
        if (selectedText) selectedText.textContent = baseSelecionada;
    } else if (checkboxesMarcados.length > 1) {
        if (contadorElement) {
            contadorElement.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Selecione apenas UMA base`;
            contadorElement.style.background = '#fef9e7';
            contadorElement.style.borderLeftColor = '#f39c12';
            contadorElement.style.color = '#f39c12';
        }
        if (selectedText) selectedText.textContent = `${checkboxesMarcados.length} bases selecionadas`;
    } else {
        if (contadorElement) {
            contadorElement.innerHTML = `<i class="fas fa-database"></i> Selecione uma base para alteração`;
            contadorElement.style.background = '#e8f4fd';
            contadorElement.style.borderLeftColor = '#3498db';
            contadorElement.style.color = '#2980b9';
        }
        if (selectedText) selectedText.textContent = 'Bases';
    }

    if (selectedCount) {
        selectedCount.textContent = checkboxesMarcados.length;
    }
}

function selecionarTodasBasesAlteracaoPerfil() {
    const checkboxes = document.querySelectorAll('input[name="bases_alteracao_perfil"]');
    checkboxes.forEach(cb => cb.checked = true);
    atualizarContadorBaseAlteracaoPerfil();
}

function limparSelecaoBaseAlteracaoPerfil() {
    const checkboxes = document.querySelectorAll('input[name="bases_alteracao_perfil"]');
    checkboxes.forEach(cb => cb.checked = false);
    atualizarContadorBaseAlteracaoPerfil();
}

function obterBaseSelecionadaAlteracaoPerfil() {
    const checkboxesMarcados = document.querySelectorAll('input[name="bases_alteracao_perfil"]:checked');
    
    if (checkboxesMarcados.length === 0) {
        throw new Error('Nenhuma base selecionada');
    }
    
    if (checkboxesMarcados.length > 1) {
        throw new Error('Selecione apenas UMA base para alteração');
    }
    
    return checkboxesMarcados[0].value;
}

async function consultarPerfil() {
    console.log('🔍 INICIANDO consultarPerfil()');
    
    let base;
    try {
        base = obterBaseSelecionadaAlteracaoPerfil();
        console.log('✅ Base selecionada:', base);
    } catch (error) {
        mostrarErroAlteracaoPerfil('base_alteracao_error', error.message);
        return;
    }
    
    const usuarioEspelho = document.getElementById('usuario_espelho_alteracao').value.trim().toUpperCase();
    const usuarioAlterar = document.getElementById('usuario_alterar').value.trim().toUpperCase();
    
    // Validações
    if (!usuarioEspelho) {
        mostrarErroAlteracaoPerfil('usuario_espelho_alteracao_error', 'Informe o usuário espelho');
        return;
    }
    if (!usuarioAlterar) {
        mostrarErroAlteracaoPerfil('usuario_alterar_error', 'Informe o usuário a alterar');
        return;
    }
    
    // Limpa erros
    limparErrosAlteracaoPerfil(['base_alteracao_error', 'usuario_espelho_alteracao_error', 'usuario_alterar_error']);
    
    // Mostra loading
    mostrarLoading('Consultando perfis...');
    
    try {
        const response = await fetch("/consultar_perfil_usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                base: base,
                usuario_espelho: usuarioEspelho,
                usuario_alterar: usuarioAlterar
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ erro: 'Erro desconhecido' }));
            throw new Error(errorData.erro || `Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.erro) {
            throw new Error(data.erro);
        }
        
        // Processa o resultado
        exibirResultadoConsultaAlteracao(data);
        
    } catch (error) {
        console.error('❌ Erro na consulta:', error);
        mostrarResultadoPerfil(`❌ Erro: ${error.message}`, 'erro');
    } finally {
        fecharLoading();
    }
}

async function confirmarAlteracaoPerfil() {
    let base;
    try {
        base = obterBaseSelecionadaAlteracaoPerfil();
    } catch (error) {
        mostrarResultadoPerfil(`❌ ${error.message}`, 'erro');
        return;
    }

    const usuarioEspelho = document.getElementById('usuario_espelho_alteracao').value.trim().toUpperCase();
    const usuarioAlterar = document.getElementById('usuario_alterar').value.trim().toUpperCase();
    const perfilNovo = document.getElementById('info-perfil-espelho').textContent;

    if (!perfilNovo || perfilNovo === 'Não encontrado') {
        mostrarResultadoPerfil('❌ Não é possível alterar o perfil. Perfil do usuário espelho não encontrado.', 'erro');
        return;
    }

    if (!confirm(`Deseja realmente alterar o perfil do usuário ${usuarioAlterar} para "${perfilNovo}" na base ${base}?`)) return;

    mostrarLoading('Alterando perfil...');

    try {
        const response = await fetch("/alterar_perfil_usuario", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                base: base, 
                usuario_espelho: usuarioEspelho, 
                usuario_alterar: usuarioAlterar, 
                perfil_novo: perfilNovo 
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.erro || 'Erro na alteração');

        mostrarResultadoPerfil(`✅ ${data.mensagem}`, 'sucesso');

        setTimeout(() => {
            document.getElementById('usuario_espelho_alteracao').value = '';
            document.getElementById('usuario_alterar').value = '';
            document.getElementById('resultado-consulta').style.display = 'none';
            limparSelecaoBaseAlteracaoPerfil();
        }, 3000);
    } catch (error) {
        console.error('Erro na alteração:', error);
        mostrarResultadoPerfil(`❌ Erro: ${error.message}`, 'erro');
    } finally {
        fecharLoading();
    }
}




function exibirResultadoConsultaAlteracao(data) {
    console.log('📊 Exibindo resultado da consulta:', data);
    
    const elementos = {
        resultado: document.getElementById('resultado-consulta'),
        base: document.getElementById('info-base-selecionada'),
        espelho: document.getElementById('info-usuario-espelho'),
        perfilEspelho: document.getElementById('info-perfil-espelho'),
        alterar: document.getElementById('info-usuario-alterar'),
        perfilAtual: document.getElementById('info-perfil-atual'),
        novoPerfil: document.getElementById('info-novo-perfil'),
        btnConfirmar: document.getElementById('confirmar-alteracao')
    };
    
    // Verifica se todos os elementos existem
    for (const [key, element] of Object.entries(elementos)) {
        if (!element && key !== 'btnConfirmar') {
            console.error(`❌ Elemento não encontrado: ${key}`);
            return;
        }
    }
    
    // Preenche as informações
    elementos.base.textContent = data.base || 'Não informada';
    elementos.espelho.textContent = data.usuario_espelho || 'Não informado';
    elementos.perfilEspelho.textContent = data.perfil_espelho || 'Não encontrado';
    elementos.alterar.textContent = data.usuario_alterar || 'Não informado';
    elementos.perfilAtual.textContent = data.perfil_atual || 'Não encontrado';
    elementos.novoPerfil.textContent = data.perfil_espelho || 'Não encontrado';
    
    // Mostra o resultado
    elementos.resultado.style.display = 'block';
    elementos.resultado.scrollIntoView({ behavior: 'smooth' });
    
    // Verifica se pode prosseguir
    if (elementos.btnConfirmar) {
        if (data.perfil_espelho && data.perfil_atual) {
            elementos.btnConfirmar.style.display = 'block';
            mostrarResultadoPerfil('✅ Consulta realizada. Verifique os dados e confirme a alteração.', 'sucesso');
        } else {
            elementos.btnConfirmar.style.display = 'none';
            if (!data.perfil_espelho) {
                mostrarResultadoPerfil('❌ Usuário espelho não encontrado ou sem perfil definido', 'erro');
            }
            if (!data.perfil_atual) {
                mostrarResultadoPerfil('❌ Usuário a alterar não encontrado ou sem perfil definido', 'erro');
            }
        }
    }
}





function mostrarResultadoPerfil(mensagem, tipo) {
    console.log(`📊 Resultado (${tipo}): ${mensagem}`);
    
    const resultadoDiv = document.getElementById('resultado-perfil');
    if (resultadoDiv) {
        resultadoDiv.classList.remove('sucesso', 'erro', 'aviso');
        resultadoDiv.classList.add(tipo);
        
        let icone = '';
        let estilo = '';
        
        switch(tipo) {
            case 'sucesso':
                icone = '✅';
                estilo = 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;';
                break;
            case 'erro':
                icone = '❌';
                estilo = 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;';
                break;
            default:
                icone = 'ℹ️';
                estilo = 'background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb;';
        }
        
        resultadoDiv.innerHTML = `
            <div style="${estilo} padding: 15px; border-radius: 5px; margin: 10px 0;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 18px;">${icone}</span>
                    <span style="font-weight: 500;">${mensagem}</span>
                </div>
            </div>
        `;
        
        resultadoDiv.style.display = 'block';
        resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        console.log(`🎯 FRONT-END: ${mensagem}`);
    } else {
        console.error('❌ Elemento resultado-perfil não encontrado no DOM');
        alert(`${tipo === 'erro' ? '❌' : '✅'} ${mensagem}`);
    }
}

function mostrarErroAlteracaoPerfil(elementId, mensagem) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = mensagem;
        element.style.color = '#dc3545';
        element.style.display = 'block';
    }
}

function limparErrosAlteracaoPerfil(ids) {
    if (!Array.isArray(ids)) return;
    
    ids.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = '';
            element.style.display = 'none';
        }
    });
}

function mostrarLoading(mensagem = 'Processando...') {
    const modal = document.getElementById('loadingModal');
    const lista = document.getElementById('loadingLista');
    lista.innerHTML = `<li>${mensagem}</li>`;
    modal.style.display = 'block';
}

function fecharLoading() {
    const modal = document.getElementById('loadingModal');
    modal.style.display = 'none';
}
const openTeamModal = document.getElementById('openTeamModal');
const teamModal = document.getElementById('teamModal');
const closeTeamModal = document.getElementById('closeTeamModal');

// abrir modal
openTeamModal.addEventListener('click', () => {
    teamModal.style.display = 'flex';
});

// fechar modal pelo botão
closeTeamModal.addEventListener('click', () => {
    teamModal.style.display = 'none';
});

// fechar modal clicando fora
window.addEventListener('click', (event) => {
    if(event.target === teamModal){
        teamModal.style.display = 'none';
    }
});














// ========== FUNÇÃO DE TESTE MANUAL (para debug) ==========
function testeManualVarredura() {
    const campo = document.getElementById("usuario_destino");
    const usuario = campo?.value.trim().toUpperCase() || "TESTE123";
    console.log('🧪 TESTE MANUAL ACIONADO:', usuario);
    fazerVarreduraGlobal(usuario);
}
let toastContainer = null;

function criarToastInterativo(mensagem, tipo = "info", duracao = 8000, bases = [], usuarioDestino = "") {
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "toast-container";
        toastContainer.style.position = "fixed";
        toastContainer.style.top = "20px";
        toastContainer.style.right = "20px";
        toastContainer.style.zIndex = 9999;
        document.body.appendChild(toastContainer);
    }

    // Limpa toast anterior
    toastContainer.innerHTML = "";

    const toast = document.createElement("div");
    toast.style.padding = "14px 20px";
    toast.style.borderRadius = "8px";
    toast.style.background = "#fff"; // Fundo branco
    toast.style.color = "#000"; // Texto preto
    toast.style.fontSize = "14px";
    toast.style.maxWidth = "420px";
    toast.style.border = "1px solid #ddd";
    toast.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    toast.style.transform = "translateY(-20px)";
    toast.style.display = "flex";
    toast.style.flexDirection = "column";
    toast.style.gap = "8px";
    toast.style.position = "relative";

    // 🔹 Bordas coloridas conforme tipo
    switch (tipo) {
        case "success":
            toast.style.borderLeft = "6px solid #4CAF50";
            break;
        case "error":
            toast.style.borderLeft = "6px solid #F44336";
            break;
        case "warning":
            toast.style.borderLeft = "6px solid #FFC107";
            break;
        default:
            toast.style.borderLeft = "6px solid #2196F3";
            break;
    }

    // Texto principal
    const mensagemDiv = document.createElement("div");
    mensagemDiv.innerHTML = mensagem;
    toast.appendChild(mensagemDiv);

    // 🔸 Se houver bases, adiciona detalhes e botões
    if (bases.length > 0) {
        const basesDiv = document.createElement("div");
        basesDiv.style.fontSize = "13px";
        basesDiv.style.background = "#f8f8f8";
        basesDiv.style.padding = "6px";
        basesDiv.style.borderRadius = "4px";
        basesDiv.innerHTML = `<strong>Bases encontradas:</strong> ${bases.join(", ")}`;
        toast.appendChild(basesDiv);

        // Botão sugerir novo usuário
        const btn = document.createElement("button");
        btn.textContent = "💡 Sugerir novo usuário";
        btn.style.background = "#ff9800";
        btn.style.color = "#fff";
        btn.style.border = "none";
        btn.style.padding = "6px 10px";
        btn.style.borderRadius = "4px";
        btn.style.cursor = "pointer";
        btn.addEventListener("click", () => {
            sugerirNovoUsuarioGlobal(usuarioDestino);
            toast.remove();
        });
        toast.appendChild(btn);

        // Botão copiar bases
        const btnCopy = document.createElement("button");
        btnCopy.textContent = "📋 Copiar nomes das bases";
        btnCopy.style.background = "#607d8b";
        btnCopy.style.color = "#fff";
        btnCopy.style.border = "none";
        btnCopy.style.padding = "6px 10px";
        btnCopy.style.borderRadius = "4px";
        btnCopy.style.cursor = "pointer";
        btnCopy.addEventListener("click", () => {
            navigator.clipboard.writeText(bases.join(", "));
            criarToastInterativo("✅ Bases copiadas para a área de transferência", "success", 3000);
        });
        toast.appendChild(btnCopy);
    }

    // Botão fechar
    const fechar = document.createElement("span");
    fechar.innerHTML = "&times;";
    fechar.style.position = "absolute";
    fechar.style.top = "8px";
    fechar.style.right = "12px";
    fechar.style.cursor = "pointer";
    fechar.style.fontWeight = "bold";
    fechar.style.fontSize = "18px";
    fechar.style.color = "#666";
    fechar.addEventListener("click", () => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(-20px)";
        setTimeout(() => toast.remove(), 300);
    });
    toast.appendChild(fechar);

    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
    });

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(-20px)";
        setTimeout(() => toast.remove(), 300);
    }, duracao);
}

// Função de varredura global atualizada
function fazerVarreduraGlobal(usuarioDestino) {
    criarToastInterativo(`🔍 Verificando usuário ${usuarioDestino}...`, "info", 3000);

    fetch("/varredura_usuario_global", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_destino: usuarioDestino })
    })
    .then(response => {
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        return response.json();
    })
    .then(data => {
        if (data.erro) {
            criarToastInterativo(`❌ Erro: ${data.erro}`, "error", 5000);
            return;
        }

        const resultado = data.varredura;

        if (resultado.bases_encontradas.length > 0) {
            criarToastInterativo(
                `❌ Usuário ${usuarioDestino} já existe!`,
                "error",
                8000,
                resultado.bases_encontradas,
                usuarioDestino
            );
        } else {
            criarToastInterativo(
                `✅ Usuário ${usuarioDestino} não existe em nenhuma base.`,
                "success",
                5000
            );
        }
    })
    .catch(error => {
        console.error("❌ Erro na requisição:", error);
        criarToastInterativo(`❌ Erro na requisição: ${error.message}`, "error", 5000);
    });
}


        // Funções do modal de escolha de perfil
        function abrirModalEscolha() {
            document.getElementById("modalEscolhaPerfil").style.display = "flex";
        }
        function fecharModalEscolha() {
            document.getElementById("modalEscolhaPerfil").style.display = "none";
        }
        function selecionarAcaoPerfil(acao) {
            fecharModalEscolha();
            document.getElementById("replicar-perfil-section").style.display = "none";
            document.getElementById("alterar-perfil-section").style.display = "none";
            if (acao === 'replicar') {
                document.getElementById("replicar-perfil-section").style.display = "block";
            } else if (acao === 'alterar') {
                document.getElementById("alterar-perfil-section").style.display = "block";
            }
        }
