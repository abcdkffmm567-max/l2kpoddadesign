const STORAGE_KEY = "l2k_topup_admin_data_v1";

const defaultData = {
  siteName: "L2K CREATIONS TOP UP STORE",
  tagline: "Fast top ups • Trusted service • Gamer style UI",
  logo: "",
  banner: "",
  heroTitle: "Top Up Store for Free Fire & Gaming Services",
  heroText: "Manage logo, ad banner, diamond prices and pack logos from the admin panel. Everything saves in your browser with localStorage.",
  whatsapp: "94770682507",
  games: [
    {
      id: "freefire",
      name: "Free Fire",
      description: "Open the dedicated FreeFireSG page with diamond packs and uploadable pack logos.",
      image: "",
      href: "FreeFireSG.html",
      priceLabel: "Diamond Packs"
    },
    {
      id: "website",
      name: "Website Design",
      description: "Promote your website, graphic design, banners and social posts.",
      image: "",
      href: "#",
      priceLabel: "Custom Price"
    },
    {
      id: "boost",
      name: "Boost Services",
      description: "Add your own service cards later from admin by editing the data file.",
      image: "",
      href: "#",
      priceLabel: "Trusted"
    }
  ],
  packs: [
    { name: "110 Diamonds", price: 150, logo: "" },
    { name: "225 Diamonds", price: 300, logo: "" },
    { name: "470 Diamonds", price: 620, logo: "" },
    { name: "1000 Diamonds", price: 1250, logo: "" },
    { name: "2000 Diamonds", price: 2450, logo: "" },
    { name: "Weekly Card", price: 450, logo: "" }
  ]
};

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultData, ...JSON.parse(raw) } : structuredClone(defaultData);
  } catch {
    return structuredClone(defaultData);
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function money(v){
  const n = Number(v || 0);
  return `LKR ${n.toLocaleString("en-LK")}`;
}

function toDataUrlInput(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function escapeHtml(str){
  return String(str ?? "").replace(/[&<>"']/g, s => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
  }[s]));
}

function applySiteShell(data){
  const siteNameEls = document.querySelectorAll("[data-site-name]");
  siteNameEls.forEach(el => el.textContent = data.siteName);

  const taglineEls = document.querySelectorAll("[data-tagline]");
  taglineEls.forEach(el => el.textContent = data.tagline);

  const logoImgEls = document.querySelectorAll("[data-logo-img]");
  const logoTextEls = document.querySelectorAll("[data-logo-text]");
  logoImgEls.forEach(img => {
    if (data.logo) {
      img.src = data.logo;
      img.style.display = "block";
    } else {
      img.removeAttribute("src");
      img.style.display = "none";
    }
  });
  logoTextEls.forEach(el => {
    el.textContent = (data.siteName || "L2K").split(" ").map(w => w[0] || "").join("").slice(0,4);
  });

  const bannerImgs = document.querySelectorAll("[data-banner-img]");
  const bannerPlaceholders = document.querySelectorAll("[data-banner-placeholder]");
  bannerImgs.forEach(img => {
    if (data.banner) {
      img.src = data.banner;
      img.style.display = "block";
    } else {
      img.removeAttribute("src");
      img.style.display = "none";
    }
  });
  bannerPlaceholders.forEach(el => {
    el.style.display = data.banner ? "none" : "block";
  });
}

function renderHome() {
  const data = loadData();
  applySiteShell(data);

  const heroTitle = document.querySelector("[data-hero-title]");
  const heroText = document.querySelector("[data-hero-text]");
  if (heroTitle) heroTitle.textContent = data.heroTitle;
  if (heroText) heroText.textContent = data.heroText;

  const games = document.querySelector("[data-games]");
  if (games) {
    games.innerHTML = data.games.map(g => `
      <a class="card" href="${escapeHtml(g.href || '#')}" ${g.id === "freefire" ? "" : ""}>
        <div class="thumb">
          ${g.image ? `<img src="${g.image}" alt="${escapeHtml(g.name)}">` : `<div class="placeholder"><div style="font-size:42px;opacity:.8">🎮</div></div>`}
        </div>
        <div class="body">
          <h4>${escapeHtml(g.name)}</h4>
          <p>${escapeHtml(g.description)}</p>
          <div class="meta">
            <span class="badge">${escapeHtml(g.priceLabel)}</span>
            <span class="badge">Open</span>
          </div>
        </div>
      </a>
    `).join("");
  }
}

function renderFreeFire() {
  const data = loadData();
  applySiteShell(data);

  const packGrid = document.querySelector("[data-pack-grid]");
  if (packGrid) {
    packGrid.innerHTML = data.packs.map((p, idx) => `
      <div class="pack">
        <div class="flex-between">
          <div class="icon">
            ${p.logo ? `<img src="${p.logo}" alt="${escapeHtml(p.name)}">` : `<span style="font-size:26px">💎</span>`}
          </div>
          <span class="pill">${idx + 1}</span>
        </div>
        <div>
          <h5>${escapeHtml(p.name)}</h5>
          <div class="sub">Diamond pack</div>
        </div>
        <div class="price">${money(p.price)}</div>
        <div class="small-muted">Update this from the admin panel.</div>
      </div>
    `).join("");
  }
}

function renderAdmin() {
  const data = loadData();
  applySiteShell(data);

  const form = document.querySelector("#adminForm");
  const msg = document.querySelector("#saveMsg");
  if (!form) return;

  form.siteName.value = data.siteName || "";
  form.tagline.value = data.tagline || "";
  form.heroTitle.value = data.heroTitle || "";
  form.heroText.value = data.heroText || "";
  form.whatsapp.value = data.whatsapp || "";

  const logoPreview = document.querySelector("#logoPreview");
  const bannerPreview = document.querySelector("#bannerPreview");
  if (logoPreview && data.logo) logoPreview.src = data.logo;
  if (bannerPreview && data.banner) bannerPreview.src = data.banner;

  const gameTable = document.querySelector("#gameTableBody");
  const packTable = document.querySelector("#packTableBody");

  function bindUpload(input, preview, key) {
    input.addEventListener("change", async () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const url = await toDataUrlInput(file);
      data[key] = url;
      if (preview) {
        preview.src = url;
        preview.style.display = "block";
      }
      saveData(data);
      applySiteShell(data);
    });
  }

  const logoInput = document.querySelector("#logoFile");
  const bannerInput = document.querySelector("#bannerFile");
  bindUpload(logoInput, logoPreview, "logo");
  bindUpload(bannerInput, bannerPreview, "banner");

  function renderGames() {
    gameTable.innerHTML = data.games.map((g, i) => `
      <tr>
        <td>
          <input data-game-field="name" data-index="${i}" type="text" value="${escapeHtml(g.name)}">
        </td>
        <td>
          <input data-game-field="description" data-index="${i}" type="text" value="${escapeHtml(g.description)}">
        </td>
        <td>
          <input data-game-field="href" data-index="${i}" type="text" value="${escapeHtml(g.href)}">
        </td>
        <td>
          <input data-game-file="${i}" type="file" accept="image/*">
          <div class="small-muted" style="margin-top:6px">${g.image ? "Image uploaded" : "No image"}</div>
        </td>
      </tr>
    `).join("");
  }

  function renderPacks() {
    packTable.innerHTML = data.packs.map((p, i) => `
      <tr>
        <td><input data-pack-field="name" data-index="${i}" type="text" value="${escapeHtml(p.name)}"></td>
        <td><input data-pack-field="price" data-index="${i}" type="number" value="${escapeHtml(p.price)}"></td>
        <td>
          <input data-pack-file="${i}" type="file" accept="image/*">
          <div class="small-muted" style="margin-top:6px">${p.logo ? "Logo uploaded" : "No logo"}</div>
        </td>
      </tr>
    `).join("");
  }

  renderGames();
  renderPacks();

  gameTable.addEventListener("change", async (e) => {
    const target = e.target;
    const idx = target.dataset.gameIndex ? Number(target.dataset.gameIndex) : Number(target.dataset.index);
    if (target.matches('input[data-game-field]')) {
      const field = target.dataset.gameField;
      data.games[idx][field] = target.value;
      saveData(data);
      applySiteShell(data);
    }
    if (target.matches('input[data-game-file]')) {
      const file = target.files && target.files[0];
      if (!file) return;
      data.games[idx].image = await toDataUrlInput(file);
      saveData(data);
      renderGames();
      applySiteShell(data);
    }
  });

  packTable.addEventListener("change", async (e) => {
    const target = e.target;
    const idx = Number(target.dataset.index);
    if (target.matches('input[data-pack-field]')) {
      const field = target.dataset.packField;
      data.packs[idx][field] = field === "price" ? Number(target.value) : target.value;
      saveData(data);
      applySiteShell(data);
    }
    if (target.matches('input[data-pack-file]')) {
      const file = target.files && target.files[0];
      if (!file) return;
      data.packs[idx].logo = await toDataUrlInput(file);
      saveData(data);
      renderPacks();
      applySiteShell(data);
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    data.siteName = form.siteName.value.trim();
    data.tagline = form.tagline.value.trim();
    data.heroTitle = form.heroTitle.value.trim();
    data.heroText = form.heroText.value.trim();
    data.whatsapp = form.whatsapp.value.trim();
    saveData(data);
    applySiteShell(data);
    if (msg) msg.textContent = "Saved to this browser successfully.";
    setTimeout(() => msg && (msg.textContent = ""), 2400);
  });

  document.querySelector("#resetData")?.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  if (body.dataset.page === "home") renderHome();
  if (body.dataset.page === "freefire") renderFreeFire();
  if (body.dataset.page === "admin") renderAdmin();
});
