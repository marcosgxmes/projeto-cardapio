const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItensContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

//abrir modal
cartBtn.addEventListener("click", () => {
  updateCartModal();
  cartModal.style.display = "flex";
});

closeModalBtn.addEventListener("click", () => {
  cartModal.style.display = "none";
});

//fechar modal clicando fora
cartModal.addEventListener("click", (event) => {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

//add ao carrinho
menu.addEventListener("click", (event) => {
  let parentButton = event.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));

    addToCart(name, price);
  }
});

//função add to cart
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartModal();
}

//att cart
function updateCartModal() {
  cartItensContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );

    cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>

            <div>
                <button class="remove-btn" data-name="${item.name}">
                    Remover
                </buuton>
            </div>
        </div>
    `;

    total += item.price * item.quantity;

    cartItensContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pr-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCounter.innerHTML = cart.length;
}

//remover item do carrinho
cartItensContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-btn")) {
    const name = event.target.getAttribute("data-name");

    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }

    cart.splice(index, 1);
    updateCartModal();
  }
}

//checar input do endereço
addressInput.addEventListener("input", (event) => {
  let inputValue = event.target.value;

  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
  }
});

// Finalizar pedido
checkoutBtn.addEventListener("click", () => {
  const isOpen = checkOpen();
  if (!isOpen) {
    Toastify({
      text: "Fechado no momento!",
      duration: 3000,
      gravity: "top",
      position: "left",
      stopOnFocus: true,
      style: {
        background: "#ef4444",
      },
    }).showToast();

    return;
  }

  if (cart.length === 0) return;
  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }

  // Enviar pedido para aí whatsapp

  const cartItems = cart
    .map((item) => {
      return `${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price} |`;
    })
    .join("");

  const message = encodeURIComponent(cartItems);
  const phone = "11948995770";

  window.open(
    `https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`,
    "_blank"
  );

  cart.length = 0;
  updateCartModal();
});

//verificar se o comercio esta aberto
function checkOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora < 22;
}

const itemSpan = document.getElementById("date-span");
const isOpen = checkOpen();

if (isOpen) {
  itemSpan.classList.remove("bg-red-500");
  itemSpan.classList.add("bg-green-600");
} else {
  itemSpan.classList.remove("bg-green-600");
  itemSpan.classList.add("bg-red-500");
}
