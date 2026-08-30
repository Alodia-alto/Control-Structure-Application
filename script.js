function calculateItemAmount(price, quantity) {
  return price * quantity;
}

function calculateDiscount(subtotal) {
  if (subtotal >= 5000) {
    return subtotal * 0.10;
  } else if (subtotal >= 3000) {
    return subtotal * 0.07;
  } else if (subtotal >= 1000) {
    return subtotal * 0.05;
  } else {
    return 0;
  }
}

function getDeliveryFee(option) {
  switch (Number(option)) {
    case 1:
      return 0;
    case 2:
      return 80;
    case 3:
      return 150;
    default:
      return 0;
  }
}

function getDiscountRateLabel(subtotal) {
  if (subtotal >= 5000) return 10;
  if (subtotal >= 3000) return 7;
  if (subtotal >= 1000) return 5;
  return 0;
}

const customerNameInput = document.getElementById("customerName");
const productCountInput = document.getElementById("productCount");
const productsContainer = document.getElementById("productsContainer");
const deliveryOptionSelect = document.getElementById("deliveryOption");
const validationMessage = document.getElementById("validationMessage");
const calculateBtn = document.getElementById("calculateBtn");
const orderSummary = document.getElementById("orderSummary");

productCountInput.addEventListener("input", generateProductFields);

function generateProductFields() {
  productsContainer.innerHTML = "";
  const count = parseInt(productCountInput.value);

  if (isNaN(count) || count <= 0) {
    return;
  }

  for (let i = 0; i < count; i++) {
    const row = document.createElement("div");
    row.innerHTML = `
      <label for="productName-${i}">Product Name</label>
      <input type="text" id="productName-${i}">

      <label for="productPrice-${i}">Price</label>
      <input type="number" id="productPrice-${i}">

      <label for="productQuantity-${i}">Quantity</label>
      <input type="number" id="productQuantity-${i}">
    `;
    productsContainer.appendChild(row);
  }
}

calculateBtn.addEventListener("click", function () {
  validationMessage.textContent = "";
  orderSummary.innerHTML = "";

  const customerName = customerNameInput.value.trim();
  const productCount = parseInt(productCountInput.value);

  if (customerName === "") {
    validationMessage.textContent = "Please enter the customer name.";
    return;
  }

  if (isNaN(productCount) || productCount <= 0) {
    validationMessage.textContent = "Please enter a valid number of products.";
    return;
  }

  let subtotal = 0;
  let productDetailsHTML = "";

  for (let i = 0; i < productCount; i++) {
    const nameInput = document.getElementById(`productName-${i}`);
    const priceInput = document.getElementById(`productPrice-${i}`);
    const quantityInput = document.getElementById(`productQuantity-${i}`);

    const name = nameInput ? nameInput.value.trim() : "";
    const price = parseFloat(priceInput ? priceInput.value : NaN);
    const quantity = parseFloat(quantityInput ? quantityInput.value : NaN);

    const validPrice = !isNaN(price) && price > 0;
    const validQuantity = !isNaN(quantity) && quantity > 0;

    if (name === "" || !validPrice || !validQuantity) {
      validationMessage.textContent = `Please enter valid values for Product ${i + 1}.`;
      return;
    }

    const amount = calculateItemAmount(price, quantity);
    subtotal += amount;

    productDetailsHTML += `
      <p>
        ${i + 1}. ${name}<br>
        Price: ₱${price.toFixed(2)}<br>
        Quantity: ${quantity}<br>
        Amount: ₱${amount.toFixed(2)}
      </p>
    `;
  }

  const discountAmount = calculateDiscount(subtotal);
  const discountRate = getDiscountRateLabel(subtotal);
  const deliveryFee = getDeliveryFee(deliveryOptionSelect.value);

  const deliveryTypeNames = {
    1: "Store Pickup",
    2: "Standard Delivery",
    3: "Express Delivery"
  };
  const deliveryType = deliveryTypeNames[Number(deliveryOptionSelect.value)];

  const finalAmount = subtotal - discountAmount + deliveryFee;

  orderSummary.innerHTML = `
    <h2>ORDER SUMMARY</h2>
    <p>Customer: ${customerName}</p>
    ${productDetailsHTML}
    <p>Subtotal: ₱${subtotal.toFixed(2)}</p>
    <p>Discount Rate: ${discountRate}%</p>
    <p>Discount Amount: ₱${discountAmount.toFixed(2)}</p>
    <p>Delivery Type: ${deliveryType}</p>
    <p>Delivery Fee: ₱${deliveryFee.toFixed(2)}</p>
    <p>Final Amount: ₱${finalAmount.toFixed(2)}</p>
  `;
});