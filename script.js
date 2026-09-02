function getItemTotal(unitPrice, itemQuantity) {
  return unitPrice * itemQuantity;
}

function getDiscount(subTotal) {
  if (subTotal >= 5000) {
    return subTotal * 0.10;
  } else if (subTotal >= 3000) {
    return subTotal * 0.07;
  } else if (subTotal >= 1000) {
    return subTotal * 0.05;
  } else {
    return 0;
  }
}

function getShippingCost(deliveryChoice) {
  switch (Number(deliveryChoice)) {
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

const findDiscountPercent = (subTotal) => {
  if (subTotal >= 5000) return 10;
  if (subTotal >= 3000) return 7;
  if (subTotal >= 1000) return 5;
  return 0;
};

const showMoney = (value) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

const SHIPPING_NAMES = {
  1: "Store Pickup",
  2: "Standard Delivery",
  3: "Express Delivery"
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    getItemTotal,
    getDiscount,
    getShippingCost
  };
}

if (typeof document !== "undefined") {

  const nameField = document.getElementById("customerName");
  const itemNumberField = document.getElementById("productCount");
  const itemArea = document.getElementById("productsContainer");
  const shippingField = document.getElementById("deliveryOption");
  const messageBox = document.getElementById("validationMessage");
  const computeButton = document.getElementById("calculateBtn");
  const summaryBox = document.getElementById("orderSummary");

  const createItemInputs = () => {
    itemArea.innerHTML = "";

    const itemNumber = parseInt(itemNumberField.value);

    if (isNaN(itemNumber) || itemNumber <= 0) {
      return;
    }

    for (let item = 0; item < itemNumber; item++) {
      const itemBox = document.createElement("div");

      itemBox.innerHTML = `
        <label for="productName-${item}">Product Name</label>
        <input type="text" id="productName-${item}">

        <label for="productPrice-${item}">Price</label>
        <input type="number" id="productPrice-${item}">

        <label for="productQuantity-${item}">Quantity</label>
        <input type="number" id="productQuantity-${item}">
      `;

      itemArea.appendChild(itemBox);
    }
  };

  itemNumberField.addEventListener("input", createItemInputs);

  const getItemInfo = (itemIndex) => {
    const itemNameField = document.getElementById(`productName-${itemIndex}`);
    const itemPriceField = document.getElementById(`productPrice-${itemIndex}`);
    const itemQuantityField = document.getElementById(`productQuantity-${itemIndex}`);

    const itemName = itemNameField ? itemNameField.value.trim() : "";
    const itemPrice = parseFloat(
      itemPriceField ? itemPriceField.value : NaN
    );
    const itemQuantity = parseFloat(
      itemQuantityField ? itemQuantityField.value : NaN
    );

    const validItem =
      itemName !== "" &&
      !isNaN(itemPrice) &&
      itemPrice > 0 &&
      !isNaN(itemQuantity) &&
      itemQuantity > 0;

    if (!validItem) {
      return null;
    }

    return {
      name: itemName,
      price: itemPrice,
      quantity: itemQuantity,
      total: getItemTotal(itemPrice, itemQuantity)
    };
  };

  const displayItem = (item, position) => `
    <p>
      ${position + 1}. ${item.name}<br>
      Price: ₱${showMoney(item.price)}<br>
      Quantity: ${item.quantity}<br>
      Amount: ₱${showMoney(item.total)}
    </p>
  `;

  computeButton.addEventListener("click", () => {
    messageBox.textContent = "";
    summaryBox.innerHTML = "";

    const customer = nameField.value.trim();
    const totalItems = parseInt(itemNumberField.value);

    if (
      !isNaN(totalItems) &&
      totalItems > 0 &&
      itemArea.children.length !== totalItems
    ) {
      createItemInputs();
    }

    if (customer === "") {
      messageBox.textContent = "Please enter the customer name.";
      return;
    }

    if (isNaN(totalItems) || totalItems <= 0) {
      messageBox.textContent = "Please enter a valid number of products.";
      return;
    }

    const itemList = [];

    for (let position = 0; position < totalItems; position++) {
      const itemData = getItemInfo(position);

      if (itemData === null) {
        messageBox.textContent =
          `Please enter valid values for Product ${position + 1}.`;
        return;
      }

      itemList.push(itemData);
    }

    const subTotal = itemList.reduce(
      (sum, item) => sum + item.total,
      0
    );

    const itemHTML = itemList
      .map((item, position) => displayItem(item, position))
      .join("");

    const discountValue = getDiscount(subTotal);
    const discountPercent = findDiscountPercent(subTotal);
    const shippingValue = getShippingCost(shippingField.value);
    const shippingType =
      SHIPPING_NAMES[Number(shippingField.value)];

    const amountDue =
      subTotal - discountValue + shippingValue;

    summaryBox.innerHTML = `
      <h2>ORDER SUMMARY</h2>
      <p>Customer: ${customer}</p>
      ${itemHTML}
      <p>Subtotal: ₱${showMoney(subTotal)}</p>
      <p>Discount Rate: ${discountPercent}%</p>
      <p>Discount Amount: ₱${showMoney(discountValue)}</p>
      <p>Delivery Type: ${shippingType}</p>
      <p>Delivery Fee: ₱${showMoney(shippingValue)}</p>
      <p>Final Amount: ₱${showMoney(amountDue)}</p>
    `;
  });

}