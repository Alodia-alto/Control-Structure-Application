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
    switch (option) {
        case "1":
            return 0;
        case "2":
            return 80;
        case "3":
            return 150;
        default:
            return 0;
    }
}

const customerName = document.getElementById("customerName");
const productCount = document.getElementById("productCount");
const productsContainer = document.getElementById("productsContainer");
const deliveryOption = document.getElementById("deliveryOption");
const calculateBtn = document.getElementById("calculateBtn");
const validationMessage = document.getElementById("validationMessage");
const orderSummary = document.getElementById("orderSummary");

productCount.addEventListener("input", function () {

    const count = Number(productCount.value);

    productsContainer.innerHTML = "";
    validationMessage.textContent = "";
    orderSummary.innerHTML = "";

    if (Number.isInteger(count) && count > 0) {

        for (let i = 0; i < count; i++) {

            const productBox = document.createElement("div");

            productBox.className = "product-box";

            productBox.innerHTML = `
                <h3 class="product-title">
                    Product ${i + 1}
                </h3>

                <div class="form-group">
                    <label for="productName-${i}">
                        Product Name
                    </label>

                    <input
                        type="text"
                        id="productName-${i}"
                        placeholder="Enter product name"
                    >
                </div>

                <div class="form-group">
                    <label for="productPrice-${i}">
                        Price
                    </label>

                    <input
                        type="number"
                        id="productPrice-${i}"
                        min="0"
                        step="0.01"
                        placeholder="Enter price"
                    >
                </div>

                <div class="form-group">
                    <label for="productQuantity-${i}">
                        Quantity
                    </label>

                    <input
                        type="number"
                        id="productQuantity-${i}"
                        min="1"
                        step="1"
                        placeholder="Enter quantity"
                    >
                </div>
            `;

            productsContainer.appendChild(productBox);
        }
    }
});

calculateBtn.addEventListener("click", function () {

    validationMessage.textContent = "";
    orderSummary.innerHTML = "";

    const name = customerName.value.trim();

    if (name === "") {

        validationMessage.textContent =
            "Please enter the Customer Name.";

        customerName.focus();

        return;
    }

    const count = Number(productCount.value);

    if (
        productCount.value === "" ||
        !Number.isInteger(count) ||
        count <= 0
    ) {

        validationMessage.textContent =
            "Please enter a valid positive Number of Products.";

        productCount.focus();

        return;
    }

    let subtotal = 0;
    let productDetails = "";

    for (let i = 0; i < count; i++) {

        const productNameInput =
            document.getElementById("productName-" + i);

        const productPriceInput =
            document.getElementById("productPrice-" + i);

        const productQuantityInput =
            document.getElementById("productQuantity-" + i);

        const productName =
            productNameInput.value.trim();

        const price =
            Number(productPriceInput.value);

        const quantity =
            Number(productQuantityInput.value);

        if (productName === "") {

            validationMessage.textContent =
                "Please enter the Product Name for Product " +
                (i + 1) + ".";

            productNameInput.focus();

            return;
        }

        if (
            productPriceInput.value === "" ||
            !Number.isFinite(price) ||
            price <= 0
        ) {

            validationMessage.textContent =
                "Please enter a valid positive Price for Product " +
                (i + 1) + ".";

            productPriceInput.focus();

            return;
        }

        if (
            productQuantityInput.value === "" ||
            !Number.isInteger(quantity) ||
            quantity <= 0
        ) {

            validationMessage.textContent =
                "Please enter a valid positive Quantity for Product " +
                (i + 1) + ".";

            productQuantityInput.focus();

            return;
        }

        const itemAmount =
            calculateItemAmount(price, quantity);

        subtotal += itemAmount;

        productDetails += `
            <div class="summary-product">

                <strong>
                    ${i + 1}. ${productName}
                </strong>

                <div>
                    Price: ₱${price.toFixed(2)}
                </div>

                <div>
                    Quantity: ${quantity}
                </div>

                <div>
                    Amount: ₱${itemAmount.toFixed(2)}
                </div>

            </div>
        `;
    }

    const discount =
        calculateDiscount(subtotal);

    let discountRate = 0;

    if (subtotal >= 5000) {
        discountRate = 10;
    } else if (subtotal >= 3000) {
        discountRate = 7;
    } else if (subtotal >= 1000) {
        discountRate = 5;
    } else {
        discountRate = 0;
    }

    const selectedOption =
        deliveryOption.value;

    const deliveryFee =
        getDeliveryFee(selectedOption);

    let deliveryType = "";

    switch (selectedOption) {

        case "1":
            deliveryType = "Store Pickup";
            break;

        case "2":
            deliveryType = "Standard Delivery";
            break;

        case "3":
            deliveryType = "Express Delivery";
            break;

        default:
            deliveryType = "Store Pickup";
    }

    const finalAmount =
        subtotal - discount + deliveryFee;

    orderSummary.innerHTML = `

        <h2>ORDER SUMMARY</h2>

        <p>
            <strong>Customer:</strong>
            ${name}
        </p>

        <br>

        ${productDetails}

        <div class="summary-line">
            <strong>Subtotal:</strong>
            <span>₱${subtotal.toFixed(2)}</span>
        </div>

        <div class="summary-line">
            <strong>Discount Rate:</strong>
            <span>${discountRate}%</span>
        </div>

        <div class="summary-line">
            <strong>Discount Amount:</strong>
            <span>₱${discount.toFixed(2)}</span>
        </div>

        <div class="summary-line">
            <strong>Delivery Type:</strong>
            <span>${deliveryType}</span>
        </div>

        <div class="summary-line">
            <strong>Delivery Fee:</strong>
            <span>₱${deliveryFee.toFixed(2)}</span>
        </div>

        <div class="summary-line final-amount">
            <strong>Final Amount:</strong>
            <span>₱${finalAmount.toFixed(2)}</span>
        </div>
    `;
});