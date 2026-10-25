const WHATSAPP_NUMBER = "529211378601";
const DEFAULT_WHATSAPP_MESSAGE =
  "Hola, quiero cotizar una piñata con Los Pereztroikos.";

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const toast = document.querySelector("#site-toast");
let toastTimeout;

const revealTargets = document.querySelectorAll(
  ".hero-copy, .hero-art, .trust-inner, .section-heading, .filter-list, " +
    ".design-card, .design-copy, .quote-form, .about-photo, .about-copy, " +
    ".closing-inner, .footer-main > *",
);

if (
  revealTargets.length &&
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting || entry.target.hidden) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -36px 0px" },
  );

  revealTargets.forEach((target) => {
    target.classList.add("reveal-on-scroll");
    revealObserver.observe(target);
  });
}

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 3200);
}

function buildWhatsAppUrl(message) {
  const encodedMessage = encodeURIComponent(message);
  const phone = WHATSAPP_NUMBER.replace(/\D/g, "");
  const destination = phone ? `https://wa.me/${phone}` : "https://wa.me/";

  return `${destination}?text=${encodedMessage}`;
}

function closeMenu() {
  if (!menuToggle || !siteNav) return;

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menú");
  siteNav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute(
      "aria-label",
      isExpanded ? "Abrir menú" : "Cerrar menú",
    );
    siteNav.classList.toggle("is-open", !isExpanded);
    document.body.classList.toggle("menu-open", !isExpanded);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMenu();
  });
}

document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    window.open(
      buildWhatsAppUrl(link.dataset.message || DEFAULT_WHATSAPP_MESSAGE),
      "_blank",
      "noopener,noreferrer",
    );
    showToast("¡Qué emoción! Se está preparando tu mensaje para WhatsApp.");
  });
});

const filterButtons = document.querySelectorAll("[data-filter]");
const designCards = document.querySelectorAll(".design-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;

    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });

    designCards.forEach((card) => {
      const matchesFilter =
        selectedFilter === "todos" || card.dataset.category === selectedFilter;
      card.hidden = !matchesFilter;
    });
  });
});

document.querySelectorAll(".interest-button").forEach((button) => {
  button.addEventListener("click", () => {
    const design = button.dataset.design;
    const message = `Hola, me interesa una piñata de ${design}. ¿Me pueden compartir más información?`;

    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
    showToast(`¡Listo! Abrimos WhatsApp para preguntar por ${design}.`);
  });
});

const eventDateInput = document.querySelector("#event-date");
if (eventDateInput) {
  const today = new Date();
  const localToday = new Date(
    today.getTime() - today.getTimezoneOffset() * 60_000,
  )
    .toISOString()
    .slice(0, 10);

  eventDateInput.min = localToday;
}

const quoteForm = document.querySelector("#quote-form");
if (quoteForm) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!quoteForm.reportValidity()) return;

    const formData = new FormData(quoteForm);
    const type = formData.get("type");
    const size = formData.get("size");
    const date = formData.get("date");
    const idea = formData.get("idea")?.toString().trim();
    const formattedDate = new Date(`${date}T12:00:00`).toLocaleDateString(
      "es-MX",
      { day: "numeric", month: "long", year: "numeric" },
    );
    const message = [
      "¡Hola, Los Pereztroikos! Quiero cotizar una piñata.",
      `Tipo: ${type}.`,
      `Tamaño: ${size}.`,
      `Fecha estimada del evento: ${formattedDate}.`,
      idea ? `Mi idea: ${idea}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
    showToast("¡Tu mensaje está listo! Envíalo por WhatsApp para comenzar.");
  });
}

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());

const cookieBanner = document.querySelector("#cookie-banner");
const cookieChoiceKey = "pereztroikos-cookie-choice";

if (cookieBanner && !localStorage.getItem(cookieChoiceKey)) {
  cookieBanner.hidden = false;
}

cookieBanner?.querySelectorAll("[data-cookie-choice]").forEach((button) => {
  button.addEventListener("click", () => {
    localStorage.setItem(cookieChoiceKey, button.dataset.cookieChoice);
    cookieBanner.hidden = true;
  });
});
