const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const chatPanel = document.querySelector("#chat-panel");
const chatLauncher = document.querySelector(".chat-launcher");
const chatMessages = document.querySelector("#chat-messages");
const chatForm = document.querySelector("#chat-form");
const chatInput = document.querySelector("#chat-input");

document.documentElement.classList.add("js-enabled");
document.querySelector("#current-year").textContent = new Date().getFullYear();

menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Abrir menú" : "Cerrar menú");
    navLinks.classList.toggle("is-open", !isExpanded);
});

navLinks.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menú");
        navLinks.classList.remove("is-open");
    }
});

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll(".reveal, .service-card").forEach((element) => {
        element.classList.add("reveal");
        revealObserver.observe(element);
    });
} else {
    document.querySelectorAll(".reveal, .service-card").forEach((element) => {
        element.classList.add("is-visible");
    });
}

const heroCard = document.querySelector(".hero-logo-card");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (heroCard && window.matchMedia("(pointer: fine)").matches && !reducedMotion.matches) {
    heroCard.addEventListener("pointermove", (event) => {
        const bounds = heroCard.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        heroCard.style.transform = `rotateY(${x * 18 - 4}deg) rotateX(${-y * 14 + 3}deg) rotateZ(-3deg)`;
    });

    heroCard.addEventListener("pointerleave", () => {
        heroCard.style.transform = "";
    });
}

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    formStatus.textContent = "¡Gracias! La información quedó validada en esta demostración, pero todavía no se envió. Para recibir solicitudes, hace falta conectar un servicio de correo o backend.";
    formStatus.classList.remove("is-error");
    formStatus.classList.add("is-success");
    contactForm.reset();
});

function setChatOpen(isOpen) {
    chatPanel.hidden = !isOpen;
    chatLauncher.setAttribute("aria-expanded", String(isOpen));
    chatLauncher.setAttribute("aria-label", isOpen ? "Cerrar asistente de TecnoPata" : "Abrir asistente de TecnoPata");

    if (isOpen) chatInput.focus();
}

chatLauncher.addEventListener("click", () => {
    setChatOpen(chatPanel.hidden);
});

document.querySelector(".chat-close").addEventListener("click", () => setChatOpen(false));

document.querySelector(".ask-agent").addEventListener("click", () => setChatOpen(true));

function normalizeQuestion(value) {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function getAgentReply(question) {
    const text = normalizeQuestion(question);

    if (/hola|buenos dias|buenas tardes|buenas noches|saludos/.test(text)) {
        return "¡Hola! Puedo contarte sobre agentes de IA, desarrollo web, sistemas, seguridad y soporte técnico. ¿Qué servicio te interesa?";
    }
    if (/whatsapp|agente|inteligencia artificial|\bia\b|automatiz/.test(text)) {
        return "Desarrollamos agentes conversacionales que ayudan con la atención y automatización de tareas, con posibilidad de integrarse con WhatsApp. El alcance se define según tu negocio y las plataformas que quieras conectar.";
    }
    if (/web|pagina|sitio/.test(text)) {
        return "Creamos páginas web adaptables y sistemas a la medida, enfocados en las necesidades y objetivos de cada proyecto.";
    }
    if (/sistema|software|aplicacion|plataforma/.test(text)) {
        return "Desarrollamos sistemas y aplicaciones para organizar procesos, datos y operaciones. Para orientarte mejor, cuéntanos qué proceso deseas resolver.";
    }
    if (/camara|vigilancia|seguridad|acceso/.test(text)) {
        return "Ofrecemos instalación de cámaras de videovigilancia y soluciones de control de acceso. La opción adecuada depende del espacio y la cobertura que necesitas.";
    }
    if (/soporte|tecnico|mantenimiento|repar/.test(text)) {
        return "Brindamos soporte técnico y mantenimiento para ayudarte a mantener tus equipos y sistemas funcionando. Comparte en el formulario qué equipo o problema necesitas atender.";
    }
    if (/cotiz|precio|costo|presupuesto|contact/.test(text)) {
        return "Para solicitar una cotización, usa el formulario de contacto y describe tu proyecto. Esta web es una demostración y el formulario aún no envía solicitudes; hay que conectarlo a un servicio para recibirlas.";
    }
    if (/servicio|ofrecen|hacen/.test(text)) {
        return "En TecnoPata ofrecemos agentes de IA con integración con WhatsApp, sistemas a la medida, páginas web, cámaras de videovigilancia, control de acceso y soporte técnico.";
    }

    return "Puedo orientarte sobre agentes de IA y WhatsApp, sistemas, páginas web, videovigilancia, control de acceso o soporte. Cuéntame un poco más o consulta la sección de preguntas frecuentes.";
}

function appendChatMessage(message, sender) {
    const bubble = document.createElement("div");
    bubble.className = `chat-message ${sender}-message`;
    bubble.textContent = message;
    chatMessages.append(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function submitQuestion(question) {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;

    appendChatMessage(cleanQuestion, "user");
    appendChatMessage(getAgentReply(cleanQuestion), "agent");
}

chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    submitQuestion(chatInput.value);
    chatForm.reset();
    chatInput.focus();
});

document.querySelectorAll(".chat-suggestions button").forEach((button) => {
    button.addEventListener("click", () => submitQuestion(button.dataset.question));
});
