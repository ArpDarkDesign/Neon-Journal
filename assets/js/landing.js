// Shared landing page setup for theme, particles, reveals, and hero interactions.
(function () {
  const body = document.body;
  const loader = document.getElementById("pageLoader");
  const particlesRoot = document.getElementById("particles");
  const typingTarget = document.getElementById("landingTyping");
  const dockLinks = Array.from(document.querySelectorAll(".dock__item[href^='#']"));
  const revealItems = document.querySelectorAll(".reveal");
  const themeButtons = document.querySelectorAll("[data-theme-toggle]");
  const lines = [
    "Decrypting fragments from your favorite midnight memories...",
    "Mapping thoughts into orbit-ready note constellations...",
    "Calibrating a quieter place to remember who you were..."
  ];

  const theme = localStorage.getItem("neon-theme") || "dark";
  body.classList.toggle("theme-light", theme === "light");
  body.classList.toggle("theme-dark", theme !== "light");

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const isLight = body.classList.toggle("theme-light");
      body.classList.toggle("theme-dark", !isLight);
      localStorage.setItem("neon-theme", isLight ? "light" : "dark");
    });
  });

  function hideLoader() {
    window.setTimeout(() => loader?.classList.add("is-hidden"), 750);
  }

  function createParticles(count) {
    if (!particlesRoot) return;
    for (let i = 0; i < count; i += 1) {
      const particle = document.createElement("span");
      particle.className = "particle";
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${12 + Math.random() * 16}s`;
      particle.style.animationDelay = `${Math.random() * -18}s`;
      particle.style.opacity = (0.18 + Math.random() * 0.6).toFixed(2);
      particle.style.transform = `scale(${0.6 + Math.random()})`;
      particlesRoot.appendChild(particle);
    }
  }

  function runTypingEffect(target, messages) {
    if (!target) return;
    let messageIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function tick() {
      const current = messages[messageIndex];
      target.textContent = current.slice(0, charIndex);

      if (!isDeleting) {
        charIndex += 1;
        if (charIndex > current.length) {
          isDeleting = true;
          window.setTimeout(tick, 1400);
          return;
        }
      } else {
        charIndex -= 1;
        if (charIndex < 0) {
          isDeleting = false;
          messageIndex = (messageIndex + 1) % messages.length;
          charIndex = 0;
        }
      }

      const delay = isDeleting ? 28 : 54;
      window.setTimeout(tick, delay);
    }

    tick();
  }

  function setupReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    }, { threshold: 0.16 });

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${index * 45}ms`;
      observer.observe(item);
    });
  }

  function setupDockSpy() {
    const sections = dockLinks
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        dockLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    }, { threshold: 0.45 });

    sections.forEach((section) => observer.observe(section));
  }

  function setupTiltCards() {
    document.querySelectorAll(".tilt-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const bounds = card.getBoundingClientRect();
        const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 10;
        const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -10;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  createParticles(34);
  runTypingEffect(typingTarget, lines);
  setupReveal();
  setupDockSpy();
  setupTiltCards();
  hideLoader();
})();
