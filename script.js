
function calculateItemAmount(price, quantity) {
    return price * quantity;
}

function calculateDiscount(subtotal) {
    let discountRate = 0;

    if (subtotal >= 5000) {
        discountRate = 0.10;
    } else if (subtotal >= 3000) {
        discountRate = 0.07;
    } else if (subtotal >= 1000) {
        discountRate = 0.05;
    } else {
        discountRate = 0;
    }

    return subtotal * discountRate;
}

function getDeliveryFee(option) {
    let fee = 0;
    option = String(option);

    switch (option) {
        case "1":
        fee = 0;   
        break;
        case "2":
        fee = 80;  
        break;
        case "3":
        fee = 150; 
        break;
        default:
        fee = 0;
    }

    return fee;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateItemAmount,
        calculateDiscount,
        getDeliveryFee
    };
}


function generateProductFields() {
    const productCount = Number(document.getElementById("productCount").value);
    const container = document.getElementById("productsContainer");
    const validationMessage = document.getElementById("validationMessage");

    container.innerHTML = "";
    validationMessage.textContent = "";

    if (!productCount || productCount <= 0 || !Number.isInteger(productCount)) {
        validationMessage.textContent = "Please enter a valid positive number of products.";
        return;
    }

    let fieldsHTML = "";

    for (let i = 0; i < productCount; i++) {
        fieldsHTML += `
        <div class="product-block">
            <h3>Product ${i + 1}</h3>
            <label for="productName-${i}">Product Name</label>
            <input type="text" id="productName-${i}" placeholder="Product Name" />

            <label for="productPrice-${i}">Price</label>
            <input type="number" id="productPrice-${i}" placeholder="Price" />

            <label for="productQuantity-${i}">Quantity</label>
            <input type="number" id="productQuantity-${i}" placeholder="Quantity" />
        </div>
        `;
    }

    container.innerHTML = fieldsHTML;
}


function getDeliveryTypeName(option) {
    switch (option) {
        case "1": return "Store Pickup";
        case "2": return "Standard Delivery";
        case "3": return "Express Delivery";
        default: return "Unknown";
    }
}


function handleCalculateOrder() {
    const validationMessage = document.getElementById("validationMessage");
    const orderSummary = document.getElementById("orderSummary");
    validationMessage.textContent = "";
    orderSummary.style.display = "none";
    orderSummary.textContent = "";

    const customerName = document.getElementById("customerName").value.trim();
    const productCount = Number(document.getElementById("productCount").value);
    const deliveryOption = document.getElementById("deliveryOption").value;

    let errors = "";

    
    if (customerName === "") {
        errors += "Customer name is required.\n";
    }

    
    if (!productCount || productCount <= 0 || !Number.isInteger(productCount)) {
        errors += "Number of products must be a valid positive whole number.\n";
    }

    if (errors !== "") {
        validationMessage.textContent = errors;
        return;
    }

    let subtotal = 0;         
    let productDetailsText = "";

    
    for (let i = 0; i < productCount; i++) {
        const nameField = document.getElementById(`productName-${i}`);
        const priceField = document.getElementById(`productPrice-${i}`);
        const quantityField = document.getElementById(`productQuantity-${i}`);

        if (!nameField || !priceField || !quantityField) {
            errors += `Product ${i + 1} fields were not generated. Re-enter the number of products.\n`;
            continue;
        }

        const name = nameField.value.trim();
        const price = parseFloat(priceField.value);
        const quantity = Number(quantityField.value);

        if (name === "") {
            errors += `Product ${i + 1}: name is required.\n`;
        }
        if (isNaN(price) || price <= 0) {
            errors += `Product ${i + 1}: price must be a valid positive number.\n`;
        }
        if (isNaN(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
            errors += `Product ${i + 1}: quantity must be a valid positive whole number (no decimals).\n`;
        }

        if (name !== "" && !isNaN(price) && price > 0 && !isNaN(quantity) && quantity > 0 && Number.isInteger(quantity)) {
            const itemAmount = calculateItemAmount(price, quantity);
            subtotal += itemAmount; // accumulate subtotal

            productDetailsText += `${i + 1}. ${name}\n`;
            productDetailsText += `   Price: ₱${price.toFixed(2)}\n`;
            productDetailsText += `   Quantity: ${quantity}\n`;
            productDetailsText += `   Amount: ₱${itemAmount.toFixed(2)}\n\n`;
        }
    }

    if (errors !== "") {
        validationMessage.textContent = errors;
        return;
    }

    
    const discountAmount = calculateDiscount(subtotal);
    const discountRatePercent = subtotal > 0 ? Math.round((discountAmount / subtotal) * 100) : 0;
    const deliveryFee = getDeliveryFee(deliveryOption);
    const deliveryTypeName = getDeliveryTypeName(deliveryOption);
    const finalAmount = subtotal - discountAmount + deliveryFee;

    const summaryText =
        `MINI STORE CHECKOUT SYSTEM

        Customer: ${customerName}

        ${productDetailsText}ORDER SUMMARY
        Subtotal: ₱${subtotal.toFixed(2)}
        Discount Rate: ${discountRatePercent}%
        Discount Amount: ₱${discountAmount.toFixed(2)}
        Delivery Type: ${deliveryTypeName}
        Delivery Fee: ₱${deliveryFee.toFixed(2)}
        Final Amount: ₱${finalAmount.toFixed(2)}`;

    orderSummary.textContent = summaryText;
    orderSummary.style.display = "block";
}


if (typeof module === 'undefined' || !module.exports) {
    document.getElementById("productCount").addEventListener("input", generateProductFields);
    document.getElementById("productCount").addEventListener("change", generateProductFields);
    document.getElementById("calculateBtn").addEventListener("click", handleCalculateOrder);
}