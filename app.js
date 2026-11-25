const PROJECTS = {
  chat: {
    category: "Inteligencia Artificial & RAG",
    title: "Chat Multiusuario con Memoria Inteligente",
    summary:
      "Asistente conversacional en Python capaz de sostener conversaciones independientes por usuario, recordar hechos relevantes entre sesiones mediante embeddings vectoriales y controlar dinámicamente la ventana de tokens.",
    highlights: [
      "Aislamiento completo por user_id con base vectorial ChromaDB y checkpoints SQLiteSaver por hilo.",
      "Extracción automática de recuerdos clasificados (personal, profesional, preferencias) usando PydanticOutputParser.",
      "Gestión eficiente del contexto mediante trim_messages (tope de 4.000 tokens) antes de invocar Google Gemini 2.5 Flash.",
      "Interfaz interactiva en Streamlit para alternar usuarios y auditar la memoria semántica en vivo."
    ],
    stack: ["Python", "LangGraph", "LangChain", "Google Gemini", "ChromaDB", "SQLite", "Pydantic", "Streamlit"],
    proof: "RAG + StateGraph + Memoria Transversal",
    repoUrl: "https://github.com/agusardiles2202/chat_multiusuario_con_memoria"
  },
  logistica: {
    category: "Arquitectura de Software & Patrones GoF",
    title: "Aplicación de Logística e Inventario",
    summary:
      "Sistema de escritorio integral para gestionar la cadena logística entre un Centro de Distribución (CD) y múltiples locales comerciales, garantizando trazabilidad física de bultos, remitos y punto de venta.",
    highlights: [
      "Segregación estricta del inventario en 4 baldes: Disponible, Reservado, En Tránsito y Rechazado (mermas).",
      "Ciclo de vida del bulto con patrón State: ningún producto se vende sin verificación intacta del precinto en destino.",
      "Implementación de 5 patrones: Singleton (SQLite), Factory Method (medios de pago), Observer (UI Tkinter reactiva), State y 9 DAOs.",
      "Validación de CUIT por Módulo 11, notas de crédito en devoluciones y transacciones atómicas."
    ],
    stack: ["Python 3.12", "SQLite3", "Tkinter / ttk", "Pytest", "Patrón DAO", "Singleton", "Factory Method", "Observer", "State"],
    proof: "181 / 181 tests automatizados (pytest)",
    repoUrl: "https://github.com/agusardiles2202/aplicacion-logistica"
  },
  microservicios: {
    category: "Backend Distribuido & Cloud",
    title: "Plataforma de Logística en Microservicios",
    summary:
      "Backend distribuido en Java 21 y Spring Boot 3.5 para administrar solicitudes de transporte de contenedores, cálculo de rutas tentativas con Google Maps, gestión de depósitos y tarifas dinámicas con seguridad centralizada.",
    highlights: [
      "4 microservicios desacoplados: ms-apigateway (WebFlux), ms-solicitud, ms-contenedor y ms-tarifa.",
      "Autenticación y autorización RBAC con Keycloak 23 (OAuth2 / JWT) validada en el API Gateway.",
      "Cálculo geográfico de distancias con Google Maps Distance Matrix API y compatibilidad de camiones por peso/volumen.",
      "Orquestación reproducible con Docker Compose, PostgreSQL 17 y documentación interactiva Swagger / OpenAPI."
    ],
    stack: ["Java 21", "Spring Boot 3.5", "Spring Cloud Gateway", "Keycloak OAuth2/JWT", "PostgreSQL 17", "Docker Compose", "JPA / Hibernate", "Swagger"],
    proof: "4 Microservicios + Keycloak + PostgreSQL 17",
    repoUrl: "https://github.com/agusardiles2202/plataforma-logistica-microservicios"
  }
};

const STACK_ITEMS = [
  { name: "Python", desc: "POO, arquitecturas limpias, scripts e IA aplicada.", cat: "backend" },
  { name: "Java 21 & Spring Boot", desc: "APIs REST, JPA/Hibernate y microservicios.", cat: "backend" },
  { name: "Spring Cloud Gateway", desc: "Enrutamiento reactivo WebFlux y filtro JWT.", cat: "backend" },
  { name: "Patrones de Diseño", desc: "DAO, Singleton, Factory Method, Observer y State.", cat: "backend" },
  { name: "LangChain & LangGraph", desc: "Orquestación con StateGraph y flujos con memoria.", cat: "ia" },
  { name: "RAG & ChromaDB", desc: "Embeddings vectoriales y recuperación semántica.", cat: "ia" },
  { name: "Google Gemini & OpenAI", desc: "Integración de LLMs y extracción con Pydantic.", cat: "ia" },
  { name: "PostgreSQL & SQLite", desc: "Modelado relacional, SQL y transacciones atómicas.", cat: "infra" },
  { name: "Docker & Compose", desc: "Contenerización multi-servicio y healthchecks.", cat: "infra" },
  { name: "Keycloak (OAuth2 / JWT)", desc: "Autenticación federada y control de roles RBAC.", cat: "infra" },
  { name: "Pytest & Git/GitHub", desc: "Suites unitarias/integración y control de versiones.", cat: "infra" },
  { name: "React, Streamlit & Tkinter", desc: "Interfaces web reactivas y apps de escritorio.", cat: "frontend" }
];

let currentProject = "chat";
let chatStep = 0;
let logisticsState = {
  estado: "PREPARADO",
  disponibleCD: 50,
  reservado: 10,
  enTransito: 0,
  disponibleLocal: 12,
  rechazado: 0,
  log: "Bulto B-001 armado con 10 unidades desde el CD. Stock pasado a Reservado."
};
let selectedRoute = "solicitud";
let showDiagram = false;

const detailPanel = document.getElementById("projectDetailPanel");
const labPanel = document.getElementById("interactiveLab");
const stackGrid = document.getElementById("stackGrid");

function renderProjectDetail(key) {
  const p = PROJECTS[key];
  detailPanel.innerHTML = `
    <div>
      <span class="proj-category">${p.category}</span>
      <h3>${p.title}</h3>
      <p class="proj-summary">${p.summary}</p>
      <ul class="proj-highlights">
        ${p.highlights.map(item => `<li>${item}</li>`).join("")}
      </ul>
      <div class="tech-pills">
        ${p.stack.map(t => `<span class="tech-pill">${t}</span>`).join("")}
      </div>
    </div>
    <div class="proj-footer">
      <span class="proof-badge">${p.proof}</span>
      <a href="${p.repoUrl}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
        Ver repositorio en GitHub
      </a>
    </div>
  `;
}

function renderChatLab() {
  const nodes = [
    {
      tag: "NODO 01 · LangGraph",
      title: "Recuperación RAG",
      fn: "memory_retrieval_node",
      console: `<span class="console-line-key">[ChromaDB · user_id="agustina"]</span> Buscando similitud semántica (k=3)...\n<span class="console-line-ok">✔ Recuerdo recuperado (importancia 5/5):</span> [profesional] "Prefiere Python y Java Spring Boot para arquitectura backend."\n<span class="console-line-ok">✔ Recuerdo recuperado (importancia 4/5):</span> [personal] "Cursa 4.º año de Ingeniería en Sistemas en UTN FRC."`
    },
    {
      tag: "NODO 02 · Gemini 2.5",
      title: "Generación LLM",
      fn: "conversation_node",
      console: `<span class="console-line-key">[trim_messages]</span> Ventana optimizada: 642 / 4000 tokens.\n<span class="console-line-key">[Prompt Dinámico]</span> Inyectando contexto recuperado en SystemMessage.\n<span class="console-line-ok">✔ Respuesta generada (Gemini 2.5 Flash):</span> "Para tu nuevo proyecto te sugiero Python con FastAPI/DAO o Java Spring Boot si buscás microservicios, aprovechando tu experiencia en UTN."`
    },
    {
      tag: "NODO 03 · Pydantic + SQLite",
      title: "Extracción Memoria",
      fn: "memory_extraction",
      console: `<span class="console-line-key">[PydanticOutputParser]</span> Evaluando hechos nuevos de la conversación...\n<span class="console-line-ok">✔ ExtractedMemory(category="profesional", importance=4)</span> guardada en ChromaDB.\n<span class="console-line-ok">✔ Checkpoint thread_id="chat_01"</span> persistido en SQLiteSaver.`
    }
  ];

  const active = nodes[chatStep];
  labPanel.innerHTML = `
    <div>
      <div class="lab-header">
        <div>
          <div class="lab-title">Simulador de Pipeline LangGraph + RAG</div>
          <div class="lab-subtitle">Hacé clic en cada nodo para inspeccionar el flujo real del grafo</div>
        </div>
      </div>
      <div class="node-pipeline" style="margin-top: 14px;">
        ${nodes.map((n, idx) => `
          <button type="button" class="pipe-node ${idx === chatStep ? "active" : ""}" data-chat-step="${idx}">
            <span class="pipe-node-tag">${n.tag}</span>
            <span class="pipe-node-name">${n.title}</span>
            <span class="pipe-node-fn">${n.fn}</span>
          </button>
        `).join("")}
      </div>
    </div>
    <pre class="lab-console">${active.console}</pre>
    <div class="lab-controls">
      <button type="button" class="lab-btn" id="nextChatStep">Ejecutar siguiente nodo</button>
    </div>
  `;

  labPanel.querySelectorAll("[data-chat-step]").forEach(btn => {
    btn.addEventListener("click", () => {
      chatStep = Number(btn.dataset.chatStep);
      renderChatLab();
    });
  });

  document.getElementById("nextChatStep").addEventListener("click", () => {
    chatStep = (chatStep + 1) % nodes.length;
    renderChatLab();
  });
}

function renderLogisticaLab() {
  const s = logisticsState;
  const isOk = s.estado === "VERIFICADO";
  const isWarn = s.estado === "RECHAZADO";

  labPanel.innerHTML = `
    <div>
      <div class="lab-header">
        <div>
          <div class="lab-title">Máquina de Estados &amp; 4 Baldes de Stock</div>
          <div class="lab-subtitle">Estado actual del bulto B-001 (10 u.): <strong>${s.estado}</strong></div>
        </div>
        <button type="button" class="lab-btn" id="resetLogistica">Reiniciar flujo</button>
      </div>

      <div class="bucket-grid" style="margin-top: 14px;">
        <div class="bucket-box">
          <span class="bucket-label">CD Disponible</span>
          <span class="bucket-val">${s.disponibleCD}</span>
        </div>
        <div class="bucket-box">
          <span class="bucket-label">CD Reservado</span>
          <span class="bucket-val">${s.reservado}</span>
        </div>
        <div class="bucket-box">
          <span class="bucket-label">En Tránsito</span>
          <span class="bucket-val">${s.enTransito}</span>
        </div>
        <div class="bucket-box ${isOk ? "highlight-ok" : ""} ${isWarn ? "highlight-warn" : ""}">
          <span class="bucket-label">${isWarn ? "Rechazado" : "Local Disp."}</span>
          <span class="bucket-val">${isWarn ? s.rechazado : s.disponibleLocal}</span>
        </div>
      </div>
    </div>

    <div class="lab-console">
      <span class="console-line-key">[Observer · GuiRefreshObserver]</span> ${s.log}\n<span class="console-line-ok">Regla de integridad:</span> El stock nunca pasa a Disponible en local sin verificación física del precinto.
    </div>

    <div class="lab-controls">
      <button type="button" class="lab-btn ${s.estado === "PRECINTADO" ? "active" : ""}" data-log-action="precintar" ${s.estado !== "PREPARADO" ? "disabled" : ""}>1. Precintar bulto</button>
      <button type="button" class="lab-btn ${s.estado === "EN_TRANSITO" ? "active" : ""}" data-log-action="despachar" ${s.estado !== "PRECINTADO" ? "disabled" : ""}>2. Despachar remito</button>
      <button type="button" class="lab-btn ${s.estado === "RECIBIDO" ? "active" : ""}" data-log-action="recibir" ${s.estado !== "EN_TRANSITO" ? "disabled" : ""}>3. Recibir en local</button>
      <button type="button" class="lab-btn ${s.estado === "VERIFICADO" ? "active" : ""}" data-log-action="verificar" ${s.estado !== "RECIBIDO" ? "disabled" : ""}>4a. Precinto intacto</button>
      <button type="button" class="lab-btn danger ${s.estado === "RECHAZADO" ? "active" : ""}" data-log-action="rechazar" ${s.estado !== "RECIBIDO" ? "disabled" : ""}>4b. Precinto roto</button>
    </div>
  `;

  document.getElementById("resetLogistica").addEventListener("click", () => {
    logisticsState = {
      estado: "PREPARADO",
      disponibleCD: 50,
      reservado: 10,
      enTransito: 0,
      disponibleLocal: 12,
      rechazado: 0,
      log: "Bulto B-001 armado con 10 unidades desde el CD. Stock pasado a Reservado."
    };
    renderLogisticaLab();
  });

  labPanel.querySelectorAll("[data-log-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.logAction;
      if (action === "precintar") {
        logisticsState.estado = "PRECINTADO";
        logisticsState.log = "Precinto único #PR-8841 asignado en CD. Listo para despacho.";
      } else if (action === "despachar") {
        logisticsState.estado = "EN_TRANSITO";
        logisticsState.reservado = 0;
        logisticsState.enTransito = 10;
        logisticsState.log = "Remito RMT-004 emitido. 10 unidades movidas de Reservado → En Tránsito.";
      } else if (action === "recibir") {
        logisticsState.estado = "RECIBIDO";
        logisticsState.log = "Arribo registrado en sucursal destino. Pendiente de verificación física (aún no vendible).";
      } else if (action === "verificar") {
        logisticsState.estado = "VERIFICADO";
        logisticsState.enTransito = 0;
        logisticsState.disponibleLocal = 22;
        logisticsState.log = "Precinto intacto verificado ✔. Las 10 unidades pasan a Disponible en Local (12 → 22).";
      } else if (action === "rechazar") {
        logisticsState.estado = "RECHAZADO";
        logisticsState.enTransito = 0;
        logisticsState.rechazado = 10;
        logisticsState.log = "Alerta: Precinto violado ✖. Las 10 unidades derivan a Rechazado/Merma y quedan bloqueadas para POS.";
      }
      renderLogisticaLab();
    });
  });
}

function renderMicroserviciosLab() {
  const routes = {
    solicitud: {
      endpoint: "POST /api/solicitudes/rutas-tentativas",
      role: "ROLE_OPERADOR (JWT Keycloak)",
      target: "ms-solicitud (:8084) + GeoService",
      output: `<span class="console-line-key">[1] ms-apigateway (:8080)</span> Token JWT validado contra tpi-realm (Keycloak :8081).\n<span class="console-line-key">[2] ms-solicitud (:8084)</span> Consultando depósitos en ms-contenedor (:8083) y tarifas en ms-tarifa (:8085).\n<span class="console-line-ok">[3] GeoService</span> Calculando distancias vía Google Maps Distance Matrix API.\n<span class="console-line-ok">✔ 200 OK:</span> Rutas tentativas devueltas con costo estimado de combustible, peajes y estadía.`
    },
    contenedor: {
      endpoint: "GET /api/contenedores/pendientes",
      role: "ROLE_ADMIN / ROLE_OPERADOR",
      target: "ms-contenedor (:8083) -> PostgreSQL 17",
      output: `<span class="console-line-key">[1] ms-apigateway (:8080)</span> Autoridad extraída: ROLE_OPERADOR.\n<span class="console-line-key">[2] ms-contenedor (:8083)</span> Consulta JPA sobre PostgreSQL 17 (tp_backend_db).\n<span class="console-line-ok">✔ 200 OK:</span> Listado de contenedores con ubicación actual, peso/volumen y costo diario de depósito.`
    },
    tarifa: {
      endpoint: "GET /api/tarifas/vigente",
      role: "ROLE_ADMIN (JWT Keycloak)",
      target: "ms-tarifa (:8085) -> PostgreSQL 17",
      output: `<span class="console-line-key">[1] ms-apigateway (:8080)</span> Enrutando /api/tarifas/** → http://ms-tarifa:8085.\n<span class="console-line-key">[2] TarifaService</span> Buscando vigencia actual (fecha_vigencia_desde <= hoy).\n<span class="console-line-ok">✔ 200 OK:</span> Tarifa vigente: litro combustible $850.50 | cargo gestión tramo $1500.00.`
    }
  };

  const active = routes[selectedRoute];
  labPanel.innerHTML = `
    <div>
      <div class="lab-header">
        <div>
          <div class="lab-title">Inspector de API Gateway &amp; Microservicios</div>
          <div class="lab-subtitle">Trazado de seguridad Keycloak + enrutamiento Docker Compose</div>
        </div>
        <button type="button" class="lab-btn ${showDiagram ? "active" : ""}" id="toggleDiagramBtn">
          ${showDiagram ? "Ver consola" : "Ver diagrama"}
        </button>
      </div>

      <div class="lab-controls" style="margin-top: 14px;">
        <button type="button" class="lab-btn ${selectedRoute === "solicitud" ? "active" : ""}" data-route="solicitud">ms-solicitud</button>
        <button type="button" class="lab-btn ${selectedRoute === "contenedor" ? "active" : ""}" data-route="contenedor">ms-contenedor</button>
        <button type="button" class="lab-btn ${selectedRoute === "tarifa" ? "active" : ""}" data-route="tarifa">ms-tarifa</button>
      </div>
    </div>

    ${showDiagram ? `
      <div class="arch-diagram-box">
        <img src="assets/diagrama_contenedores.jpg" alt="Diagrama de contenedores de la plataforma de microservicios">
      </div>
    ` : `
      <div class="lab-console">
        <div><span class="console-line-key">Request:</span> ${active.endpoint}</div>
        <div><span class="console-line-key">Auth:</span> ${active.role} → ${active.target}</div>
        <hr style="border:none; border-top: 1px solid rgba(148,163,184,0.2); margin: 8px 0;">
        <pre style="white-space: pre-wrap; font-family: inherit;">${active.output}</pre>
      </div>
    `}
  `;

  document.getElementById("toggleDiagramBtn").addEventListener("click", () => {
    showDiagram = !showDiagram;
    renderMicroserviciosLab();
  });

  labPanel.querySelectorAll("[data-route]").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedRoute = btn.dataset.route;
      showDiagram = false;
      renderMicroserviciosLab();
    });
  });
}

function selectProject(key) {
  currentProject = key;
  document.querySelectorAll(".tab-btn").forEach(btn => {
    const active = btn.dataset.project === key;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", String(active));
  });

  renderProjectDetail(key);
  if (key === "chat") renderChatLab();
  if (key === "logistica") renderLogisticaLab();
  if (key === "microservicios") renderMicroserviciosLab();
}

function renderStack(filter = "all") {
  const items = filter === "all" ? STACK_ITEMS : STACK_ITEMS.filter(i => i.cat === filter);
  stackGrid.innerHTML = items.map(item => `
    <div class="stack-item">
      <h3>${item.name}</h3>
      <p>${item.desc}</p>
    </div>
  `).join("");
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    toast.hidden = true;
  }, 2400);
}

async function copyEmail(email) {
  try {
    await navigator.clipboard.writeText(email);
    showToast("Correo copiado: " + email);
  } catch {
    showToast("Correo: " + email);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  selectProject("chat");
  renderStack("all");

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => selectProject(btn.dataset.project));
  });

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderStack(btn.dataset.filter);
    });
  });

  document.getElementById("copyEmailHero").addEventListener("click", e => copyEmail(e.currentTarget.dataset.email));
  document.getElementById("copyEmailFooter").addEventListener("click", e => copyEmail(e.currentTarget.dataset.email));

  const cvModal = document.getElementById("cvModal");
  document.getElementById("openCvBtn").addEventListener("click", () => {
    cvModal.hidden = false;
    cvModal.setAttribute("aria-hidden", "false");
  });
  document.getElementById("closeCvBtn").addEventListener("click", () => {
    cvModal.hidden = true;
    cvModal.setAttribute("aria-hidden", "true");
  });
  cvModal.addEventListener("click", e => {
    if (e.target === cvModal) {
      cvModal.hidden = true;
      cvModal.setAttribute("aria-hidden", "true");
    }
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !cvModal.hidden) {
      cvModal.hidden = true;
      cvModal.setAttribute("aria-hidden", "true");
    }
  });
});
