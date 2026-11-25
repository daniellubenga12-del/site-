const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".nav");

menuButton.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

const loginModal = document.querySelector(".login-modal");
const loginOpenButtons = document.querySelectorAll(".login-open");
const loginCloseButtons = document.querySelectorAll(".login-close");
const loginForm = document.querySelector(".login-form");
const loginMessage = document.querySelector(".login-message");

const openLogin = () => {
  loginModal.hidden = false;
  document.body.style.overflow = "hidden";
  document.querySelector("#login-email").focus();
};

const accountIcon = document.querySelector(".account-icon-button:not(.login-open-mobile)");
const savedSellerAccount = JSON.parse(localStorage.getItem("kivuSellerAccount") || "null");
if (savedSellerAccount && accountIcon) {
  accountIcons.forEach((icon) => {
    icon.classList.add("connected");
    icon.setAttribute("title", `Compte vendeur : ${savedSellerAccount.shopName}`);
    icon.setAttribute("aria-label", `Compte vendeur connecté : ${savedSellerAccount.shopName}`);
  });
}

const closeLogin = () => {
  loginModal.hidden = true;
  document.body.style.overflow = "";
  (accountIcon || loginOpenButtons[0]).focus();
};

loginOpenButtons.forEach((button) => button.addEventListener("click", openLogin));
loginCloseButtons.forEach((button) => button.addEventListener("click", closeLogin));

loginModal.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLogin();
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const mode = loginForm.dataset.mode;
  const email = loginForm.elements.email.value.trim();

  if (mode === "register") {
    const shopName = loginForm.elements.shopName.value.trim();
    if (!shopName) {
      loginMessage.textContent = "Indiquez le nom de votre boutique.";
      return;
    }
    localStorage.setItem("kivuSellerAccount", JSON.stringify({ shopName, email }));
    accountIcons.forEach((icon) => {
      icon.classList.add("connected");
      icon.setAttribute("title", `Compte vendeur : ${shopName}`);
      icon.setAttribute("aria-label", `Compte vendeur créé : ${shopName}`);
    });
    loginMessage.textContent = `Compte vendeur créé pour ${shopName}.`;
  } else {
    const account = JSON.parse(localStorage.getItem("kivuSellerAccount") || "null");
    if (account && account.email === email) {
      loginMessage.textContent = `Bienvenue, ${account.shopName}.`;
      accountIcons.forEach((icon) => {
        icon.classList.add("connected");
        icon.setAttribute("title", `Compte vendeur : ${account.shopName}`);
        icon.setAttribute("aria-label", `Compte vendeur connecté : ${account.shopName}`);
      });
    } else {
      loginMessage.textContent = "Aucun compte vendeur trouvé avec cet email.";
    }
  }
});

document.querySelectorAll(".seller-account-open").forEach((button) => {
  button.addEventListener("click", () => {
    openLogin();
    document.querySelector('.account-tab[data-account-mode="register"]').click();
  });
});

document.querySelectorAll(".account-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".account-tab").forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    const mode = tab.dataset.accountMode;
    loginForm.dataset.mode = mode;
    document.querySelector(".register-only").hidden = mode !== "register";
    document.querySelector("#seller-name").required = mode === "register";
    document.querySelector(".account-submit").innerHTML = mode === "register"
      ? 'Créer mon compte <span>↗</span>'
      : 'Se connecter <span>↗</span>';
    loginMessage.textContent = "";
  });
});

document.querySelectorAll(".heart-button").forEach((button) => {
  button.addEventListener("click", () => {
    const active = button.classList.toggle("active");
    button.textContent = active ? "♥" : "♡";
  });
});

let cartCount = 0;
const cartItems = [];
const cartDrawer = document.querySelector(".cart-drawer");
const cartList = document.querySelector(".cart-items");
const cartCountElement = document.querySelector(".cart-count");
const cartTotalElement = document.querySelector(".cart-total");

const updateCart = () => {
  cartCountElement.textContent = String(cartItems.length);
  cartTotalElement.textContent = `${cartItems.reduce((total, item) => total + item.price, 0)} $`;

  if (cartItems.length === 0) {
    cartList.innerHTML = '<p class="cart-empty">Votre panier est vide.</p>';
    return;
  }

  cartList.innerHTML = cartItems.map((item) => `
    <article class="cart-item">
      <img src="${item.image}" alt="">
      <p><b>${item.name}</b><span>${item.details}</span></p>
      <strong>${item.price} $</strong>
    </article>
  `).join("");
};

const bindAddCartButton = (button) => {
  button.addEventListener("click", () => {
    if (button.disabled) return;
    const card = button.closest(".market-product-card");
    const price = Number(button.closest("div").querySelector("strong").textContent.replace("$", "").trim());
    cartCount += 1;
    cartItems.push({
      name: card.querySelector("h3").textContent,
      details: card.querySelector(".market-product-info > p").textContent,
      price,
      image: card.querySelector(".market-product-image img").getAttribute("src")
    });
    button.textContent = "Réservé";
    button.disabled = true;
    button.setAttribute("aria-label", `${cartCount} pièce(s) réservée(s)`);
    card.querySelector(".market-product-image > span").textContent = "Réservée";
    updateCart();
  });
};

document.querySelectorAll(".add-cart").forEach(bindAddCartButton);

document.querySelector(".cart-button").addEventListener("click", () => {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
});

document.querySelectorAll(".cart-backdrop, .cart-close").forEach((button) => {
  button.addEventListener("click", () => {
    cartDrawer.classList.remove("open");
    cartDrawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  });
});

document.querySelectorAll(".category-filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".category-filter").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const category = button.dataset.category;
    document.querySelectorAll(".market-product-card").forEach((card) => {
      card.hidden = category !== "all" && card.dataset.category !== category;
    });
    document.querySelector("#acheteurs").scrollIntoView({ behavior: "smooth" });
  });
});

const paymentSection = document.querySelector(".payment-section");
const visaForm = document.querySelector(".visa-form");
const mobileForm = document.querySelector(".mobile-form");

document.querySelector(".cart-checkout").addEventListener("click", () => {
  if (cartItems.length === 0) {
    cartList.innerHTML = '<p class="cart-empty">Ajoutez une pièce avant de continuer.</p>';
    return;
  }
  paymentSection.hidden = false;
});

document.querySelectorAll('input[name="payment"]').forEach((input) => {
  input.addEventListener("change", () => {
    const isVisa = input.value === "visa";
    visaForm.hidden = !isVisa;
    mobileForm.hidden = isVisa;
  });
});

document.querySelector(".confirm-payment").addEventListener("click", () => {
  const selected = document.querySelector('input[name="payment"]:checked');
  const label = selected.closest("label").querySelector("b").textContent;
  document.querySelector(".confirm-payment").textContent = `Paiement ${label} prêt`;
});

const sellerToggle = document.querySelector(".seller-add-toggle");
const sellerForm = document.querySelector(".seller-add-form");
const sellerList = document.querySelector(".seller-list");
const sellerDashboard = document.querySelector(".seller-dashboard");

sellerToggle.addEventListener("click", () => {
  const isOpen = !sellerForm.hidden;
  sellerForm.hidden = isOpen;
  sellerList.hidden = !isOpen;
  sellerDashboard.classList.toggle("form-open", !isOpen);
  sellerToggle.textContent = isOpen ? "+ Ajouter une pièce" : "× Fermer";
});

sellerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(sellerForm);
  const photo = sellerForm.elements.photo.files[0];
  if (!photo) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const name = data.get("productName").trim();
    const category = data.get("category");
    const size = data.get("size").trim() || "Taille unique";
    const condition = data.get("condition");
    const price = Number(data.get("price"));
    const margin = Number(data.get("margin"));

    const buyerCard = document.createElement("article");
    buyerCard.className = "market-product-card";
    buyerCard.dataset.category = category;
    buyerCard.innerHTML = `
      <button class="heart-button" type="button" aria-label="Ajouter aux favoris">♡</button>
      <div class="market-product-image image-fashion"><span>Pièce unique</span><img src="${reader.result}" alt="${name}"></div>
      <div class="market-product-info"><p>T-shirt · ${size} · ${condition}</p><h3>${name}</h3><div><strong>${price} $</strong><button class="add-cart" type="button">Réserver</button></div></div>
    `;
    document.querySelector(".market-product-grid").appendChild(buyerCard);
    bindAddCartButton(buyerCard.querySelector(".add-cart"));

    buyerCard.querySelector(".heart-button").addEventListener("click", (event) => {
      const active = event.currentTarget.classList.toggle("active");
      event.currentTarget.textContent = active ? "♥" : "♡";
    });

    const sellerRow = document.createElement("div");
    sellerRow.className = "dashboard-row";
    sellerRow.innerHTML = `<img class="dash-thumb" src="${reader.result}" alt=""><p><b>${name}</b><span>${size} · 1 disponible</span></p><strong>${price} $</strong><small class="seller-margin">Marge privée : ${margin} $</small>`;
    sellerList.appendChild(sellerRow);

    document.querySelector("#seller-product-count").textContent =
      String(Number(document.querySelector("#seller-product-count").textContent) + 1);

    sellerForm.reset();
    sellerForm.hidden = true;
    sellerList.hidden = false;
    sellerDashboard.classList.remove("form-open");
    sellerToggle.textContent = "+ Ajouter une pièce";
  });
  reader.readAsDataURL(photo);
});

const marketSearch = document.querySelector(".market-search");
const searchInput = document.querySelector("#search-product");

marketSearch.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchInput.value.trim().toLowerCase();
  document.querySelectorAll(".market-product-card").forEach((card) => {
    card.hidden = query !== "" && !card.textContent.toLowerCase().includes(query);
  });
  document.querySelector("#acheteurs").scrollIntoView({ behavior: "smooth" });
});
