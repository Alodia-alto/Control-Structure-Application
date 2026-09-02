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

const getDiscountRateLabel = (subtotal) => {
  if (subtotal >= 5000) return 10;
  if (subtotal >= 3000) return 7;
  if (subtotal >= 1000) return 5;
  return 0;
};

const formatCurrency = (amount) =>
  amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

const DELIVERY_TYPE_NAMES = {
  1: "Store Pickup",
  2: "Standard Delivery",
  3: "Express Delivery"
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { calculateItemAmount, calculateDiscount, getDeliveryFee };
}

if (typeof document !== "undefined") {

const customerNameInput = document.getElementById("customerName");
const productCountInput = document.getElementById("productCount");
const productsContainer = document.getElementById("productsContainer");
const deliveryOptionSelect = document.getElementById("deliveryOption");
const validationMessage = document.getElementById("validationMessage");
const calculateBtn = document.getElementById("calculateBtn");
const orderSummary = document.getElementById("orderSummary");

const generateProductFields = () => {
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
};

productCountInput.addEventListener("input", generateProductFields);

const readProductRow = (index) => {
  const nameInput = document.getElementById(`productName-${index}`);
  const priceInput = document.getElementById(`productPrice-${index}`);
  const quantityInput = document.getElementById(`productQuantity-${index}`);

  const name = nameInput ? nameInput.value.trim() : "";
  const price = parseFloat(priceInput ? priceInput.value : NaN);
  const quantity = parseFloat(quantityInput ? quantityInput.value : NaN);

  const isValid = name !== "" && !isNaN(price) && price > 0 && !isNaN(quantity) && quantity > 0;
  if (!isValid) return null;

  return { name, price, quantity, amount: calculateItemAmount(price, quantity) };
};

const renderProductLine = ({ name, price, quantity, amount }, index) => `
  <p>
    ${index + 1}. ${name}<br>
    Price: ₱${formatCurrency(price)}<br>
    Quantity: ${quantity}<br>
    Amount: ₱${formatCurrency(amount)}
  </p>
`;

calculateBtn.addEventListener("click", () => {
  validationMessage.textContent = "";
  orderSummary.innerHTML = "";

  const customerName = customerNameInput.value.trim();
  const productCount = parseInt(productCountInput.value);

  if (!isNaN(productCount) && productCount > 0 &&
      productsContainer.children.length !== productCount) {
    generateProductFields();
  }

  if (customerName === "") {
    validationMessage.textContent = "Please enter the customer name.";
    return;
  }

  if (isNaN(productCount) || productCount <= 0) {
    validationMessage.textContent = "Please enter a valid number of products.";
    return;
  }

  const products = [];
  for (let i = 0; i < productCount; i++) {
    const product = readProductRow(i);
    if (product === null) {
      validationMessage.textContent = `Please enter valid values for Product ${i + 1}.`;
      return;
    }
    products.push(product);
  }

  const subtotal = products.reduce((accumulator, product) => accumulator + product.amount, 0);

  const productDetailsHTML = products
    .map((product, index) => renderProductLine(product, index))
    .join("");

  const discountAmount = calculateDiscount(subtotal);
  const discountRate = getDiscountRateLabel(subtotal);
  const deliveryFee = getDeliveryFee(deliveryOptionSelect.value);
  const deliveryType = DELIVERY_TYPE_NAMES[Number(deliveryOptionSelect.value)];
  const finalAmount = subtotal - discountAmount + deliveryFee;

  orderSummary.innerHTML = `
    <h2>ORDER SUMMARY</h2>
    <p>Customer: ${customerName}</p>
    ${productDetailsHTML}
    <p>Subtotal: ₱${formatCurrency(subtotal)}</p>
    <p>Discount Rate: ${discountRate}%</p>
    <p>Discount Amount: ₱${formatCurrency(discountAmount)}</p>
    <p>Delivery Type: ${deliveryType}</p>
    <p>Delivery Fee: ₱${formatCurrency(deliveryFee)}</p>
    <p>Final Amount: ₱${formatCurrency(finalAmount)}</p>
  `;
});

} 