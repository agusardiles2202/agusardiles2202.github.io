const PROJECTS = {
  chat: {
    category: "Inteligencia Artificial & RAG",
    title: "Chat Multiusuario con Memoria IA",
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
    repoUrl: "https://github.com/agusardiles2202/chat_multiusuario_con_memoria",
    screenshot: "assets/screenshot_chat.png",
    screenshotAlt: "Interfaz del chat multiusuario con memoria semántica en Streamlit"
  },
  logistica: {
    category: "Arquitectura de Software & Patrones GoF",
    title: "Sistema de Gestión de Locales Comerciales — Inventario, Logística y POS",
    summary:
      "Sistema de escritorio integral para gestionar la cadena logística entre un Centro de Distribución (CD) y múltiples locales comerciales: trazabilidad de bultos con precinto, punto de venta polimórfico y control de stock en 4 baldes.",
    highlights: [
      "Segregación estricta del inventario en 4 baldes: Disponible, Reservado, En Tránsito y Rechazado (mermas).",
      "Ciclo de vida del bulto con patrón State: ningún producto se vende sin verificación intacta del precinto en destino.",
      "Implementación de 5 patrones: Singleton (SQLite), Factory Method (medios de pago), Observer (UI Tkinter reactiva), State y 9 DAOs.",
      "Validación de CUIT por Módulo 11, notas de crédito en devoluciones y transacciones atómicas."
    ],
    stack: ["Python 3.12", "SQLite3", "Tkinter / ttk", "Pytest", "Patrón DAO", "Singleton", "Factory Method", "Observer", "State"],
    proof: "181 / 181 tests automatizados (pytest)",
    repoUrl: "https://github.com/agusardiles2202/aplicacion-logistica",
    screenshot: "assets/screenshot_logistica.png",
    screenshotAlt: "Pantalla principal: tabla de bultos en tránsito y 4 baldes de stock del sistema de locales"
  },
  microservicios: {
    category: "Backend Distribuido & Cloud",
    title: "Plataforma de Transporte de Contenedores — Microservicios, Docker y Keycloak",
    summary:
      "Backend distribuido en Java 21 y Spring Boot 3.5 para administrar solicitudes de transporte de contenedores entre depósitos: calcula rutas tentativas con Google Maps, gestiona estadías y aplica tarifas dinámicas con seguridad centralizada.",
    highlights: [
      "4 microservicios desacoplados: ms-apigateway (WebFlux), ms-solicitud, ms-contenedor y ms-tarifa.",
      "Autenticación y autorización RBAC con Keycloak 23 (OAuth2 / JWT) validada en el API Gateway.",
      "Cálculo geográfico de distancias con Google Maps Distance Matrix API y compatibilidad de camiones por peso/volumen.",
      "Orquestación reproducible con Docker Compose, PostgreSQL 17 y documentación interactiva Swagger / OpenAPI."
    ],
    stack: ["Java 21", "Spring Boot 3.5", "Spring Cloud Gateway", "Keycloak OAuth2/JWT", "PostgreSQL 17", "Docker Compose", "JPA / Hibernate", "Swagger"],
    proof: "4 Microservicios + Keycloak + PostgreSQL 17",
    repoUrl: "https://github.com/agusardiles2202/plataforma-logistica-microservicios",
    screenshot: "assets/diagrama_contenedores.jpg",
    screenshotAlt: "Diagrama de contenedores de la plataforma de microservicios con Keycloak y Docker"
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

function renderProjectScreenshot(key) {
  const p = PROJECTS[key];
  labPanel.innerHTML = `
    <div class="project-screenshot-wrap">
      <img
        src="${p.screenshot}"
        alt="${p.screenshotAlt}"
        class="project-screenshot"
        loading="lazy"
        onerror="this.style.display='none';"
      >
      <div class="screenshot-caption">${p.screenshotAlt}</div>
    </div>
  `;
}

function selectProject(key) {
  currentProject = key;
  document.querySelectorAll(".tab-btn").forEach(btn => {
    const active = btn.dataset.project === key;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", String(active));
  });

  renderProjectDetail(key);
  renderProjectScreenshot(key);
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
