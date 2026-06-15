// Dashboard logic for dummy notes, modal state, palette shortcuts, filters, notifications, and ambient effects.
(function () {
  const body = document.body;
  const loader = document.getElementById("pageLoader");
  const particlesRoot = document.getElementById("particles");
  const notesGrid = document.getElementById("notesGrid");
  const emptyState = document.getElementById("emptyState");
  const searchInput = document.getElementById("searchInput");
  const filterButtons = document.querySelectorAll(".filter-button");
  const palette = document.getElementById("commandPalette");
  const commandInput = document.getElementById("commandInput");
  const notifications = document.getElementById("notifications");
  const modal = document.getElementById("noteModal");
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const themeButtons = document.querySelectorAll("[data-theme-toggle]");
  const typingTarget = document.getElementById("dashboardTyping");
  const openPaletteButton = document.getElementById("openPaletteButton");
  const dockPaletteButton = document.getElementById("dockPaletteButton");
  const notifyButton = document.getElementById("notifyButton");
  const commandItems = document.querySelectorAll(".command-item");

  const notes = [
    {
      id: 1,
      title: "Rain Market Memory",
      excerpt: "A corridor of neon umbrellas, steam, and reflected color that felt unreal.",
      body: "I wandered through the market long after I had a reason to stay. Every storefront flickered in electric blues and violet reds, turning puddles into mirrors. I kept thinking that memory itself might just be light hitting the right angle.",
      category: "memory",
      mood: "Electric",
      date: "May 12, 2026"
    },
    {
      id: 2,
      title: "Future Self Draft",
      excerpt: "Notes to the version of me who has already shipped the hard thing.",
      body: "If you are reading this from the other side of the challenge, I hope you remember that progress was built in quiet evenings. Not in giant heroic moments, but in patient returns to the work.",
      category: "reflection",
      mood: "Focused",
      date: "May 10, 2026"
    },
    {
      id: 3,
      title: "Interface Idea 9A",
      excerpt: "Journal cards that drift like satellites and expand with cinematic blur.",
      body: "The interface should feel less like software and more like entering a memory chamber. Navigation needs to disappear into the atmosphere until it is needed, then glow back into relevance.",
      category: "idea",
      mood: "Curious",
      date: "May 9, 2026"
    },
    {
      id: 4,
      title: "2:13 AM Clarity",
      excerpt: "Some thoughts arrive only after the rest of the world lowers its volume.",
      body: "I noticed tonight that silence is not the absence of sound. It is a different interface for attention. The note I needed all week showed up the moment I stopped trying to force it.",
      category: "reflection",
      mood: "Calm",
      date: "May 7, 2026"
    },
    {
      id: 5,
      title: "Metro Window Glow",
      excerpt: "My reflection looked like a ghost superimposed on the city.",
      body: "The train window doubled everything: buildings, strangers, and myself. For a second it felt like I was watching two timelines travel together, one outside and one inward.",
      category: "memory",
      mood: "Dreamy",
      date: "May 4, 2026"
    },
    {
      id: 6,
      title: "Creative Reset Protocol",
      excerpt: "Step away, dim the room, return with one question instead of seven.",
      body: "The best reset is usually simpler than the dramatic one I imagine. Water, darkness, one honest question, and a notebook that does not demand perfection.",
      category: "idea",
      mood: "Grounded",
      date: "May 2, 2026"
    }
  ];

  let activeFilter = "all";

  const theme = localStorage.getItem("neon-theme") || "dark";
  body.classList.toggle("theme-light", theme === "light");
  body.classList.toggle("theme-dark", theme !== "light");

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const isLight = body.classList.toggle("theme-light");
      body.classList.toggle("theme-dark", !isLight);
      localStorage.setItem("neon-theme", isLight ? "light" : "dark");
      pushNotification("Theme Updated", `Switched to ${isLight ? "light" : "dark"} mode.`);
    });
  });

  function hideLoader() {
    window.setTimeout(() => loader?.classList.add("is-hidden"), 800);
  }

  function createParticles(count) {
    if (!particlesRoot) return;
    for (let i = 0; i < count; i += 1) {
      const particle = document.createElement("span");
      particle.className = "particle";
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${14 + Math.random() * 18}s`;
      particle.style.animationDelay = `${Math.random() * -16}s`;
      particle.style.opacity = (0.18 + Math.random() * 0.56).toFixed(2);
      particle.style.transform = `scale(${0.5 + Math.random()})`;
      particlesRoot.appendChild(particle);
    }
  }

  function runTypingEffect() {
    if (!typingTarget) return;
    const lines = [
      "Type Ctrl+K to move through the memory field.",
      "Search by mood, title, or category to surface hidden notes.",
      "Every note below is dummy data designed for interaction polish."
    ];

    let lineIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      const current = lines[lineIndex];
      typingTarget.textContent = current.slice(0, charIndex);

      if (!deleting) {
        charIndex += 1;
        if (charIndex > current.length) {
          deleting = true;
          window.setTimeout(tick, 1200);
          return;
        }
      } else {
        charIndex -= 1;
        if (charIndex < 0) {
          deleting = false;
          lineIndex = (lineIndex + 1) % lines.length;
          charIndex = 0;
        }
      }

      window.setTimeout(tick, deleting ? 25 : 45);
    }

    tick();
  }

  function renderNotes() {
    const query = searchInput.value.trim().toLowerCase();
    const filtered = notes.filter((note) => {
      const matchesFilter = activeFilter === "all" || note.category === activeFilter;
      const matchesQuery = [note.title, note.excerpt, note.mood, note.category]
        .join(" ")
        .toLowerCase()
        .includes(query);
      return matchesFilter && matchesQuery;
    });

    notesGrid.innerHTML = filtered.map((note) => `
      <article class="note-card" data-note-id="${note.id}" tabindex="0">
        <div class="note-card__top">
          <span class="note-card__badge">${note.category}</span>
          <span class="note-card__mood">${note.mood}</span>
        </div>
        <h3>${note.title}</h3>
        <p class="note-card__excerpt">${note.excerpt}</p>
        <div class="note-card__bottom">
          <span>${note.date}</span>
          <span>Open</span>
        </div>
      </article>
    `).join("");

    emptyState.classList.toggle("hidden", filtered.length > 0);

    document.querySelectorAll(".note-card").forEach((card) => {
      card.addEventListener("click", () => openModal(Number(card.dataset.noteId)));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openModal(Number(card.dataset.noteId));
        }
      });

      // Microinteraction: cards subtly react to pointer position.
      card.addEventListener("pointermove", (event) => {
        const bounds = card.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 8;
        const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -8;
        card.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  function openModal(id) {
    const note = notes.find((entry) => entry.id === id);
    if (!note) return;

    document.getElementById("modalCategory").textContent = note.category;
    document.getElementById("modalTitle").textContent = note.title;
    document.getElementById("modalMood").textContent = note.mood;
    document.getElementById("modalDate").textContent = note.date;
    document.getElementById("modalBody").textContent = note.body;

    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  }

  function pushNotification(title, text) {
    const notice = document.createElement("article");
    notice.className = "notification";
    notice.innerHTML = `<strong>${title}</strong><p>${text}</p>`;
    notifications.appendChild(notice);
    window.setTimeout(() => notice.remove(), 4000);
  }

  function togglePalette(forceOpen) {
    const shouldOpen = typeof forceOpen === "boolean"
      ? forceOpen
      : palette.classList.contains("hidden");

    palette.classList.toggle("hidden", !shouldOpen);
    palette.setAttribute("aria-hidden", String(!shouldOpen));

    if (shouldOpen) {
      commandInput.focus();
    }
  }

  function applyCommand(command) {
    if (command === "theme") {
      themeButtons[0]?.click();
    }
    if (command === "notify") {
      pushNotification("Memory Pulse", "A fresh insight has been queued for review.");
    }
    if (command === "focus") {
      activeFilter = "reflection";
      filterButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.filter === "reflection");
      });
      renderNotes();
      pushNotification("Reflection Mode", "Filtered the journal grid to reflections.");
    }
    if (command === "clear") {
      activeFilter = "all";
      searchInput.value = "";
      filterButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.filter === "all");
      });
      renderNotes();
    }

    togglePalette(false);
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      filterButtons.forEach((item) => item.classList.toggle("active", item === button));
      renderNotes();
    });
  });

  searchInput.addEventListener("input", renderNotes);
  notifyButton.addEventListener("click", () => {
    pushNotification("Sync Complete", "Three memory shards were indexed successfully.");
  });
  openPaletteButton.addEventListener("click", () => togglePalette(true));
  dockPaletteButton.addEventListener("click", () => togglePalette(true));
  sidebarToggle.addEventListener("click", () => sidebar.classList.toggle("collapsed"));

  commandItems.forEach((item) => {
    item.addEventListener("click", () => applyCommand(item.dataset.command));
  });

  document.addEventListener("click", (event) => {
    const closeModalTrigger = event.target.closest("[data-close-modal]");
    const closePaletteTrigger = event.target.closest("[data-close-palette]");
    if (closeModalTrigger) closeModal();
    if (closePaletteTrigger) togglePalette(false);
  });

  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      togglePalette();
    }
    if (event.key === "Escape") {
      closeModal();
      togglePalette(false);
    }
  });

  commandInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const raw = commandInput.value.trim().toLowerCase();
      if (raw.includes("theme")) applyCommand("theme");
      else if (raw.includes("notify") || raw.includes("alert")) applyCommand("notify");
      else if (raw.includes("reflection")) applyCommand("focus");
      else applyCommand("clear");
      commandInput.value = "";
    }
  });

  createParticles(40);
  runTypingEffect();
  renderNotes();
  hideLoader();
  pushNotification("Welcome Back", "The Neon Journal dashboard is live.");
})();
