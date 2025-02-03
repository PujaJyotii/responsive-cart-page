document.addEventListener("DOMContentLoaded", () => {
  const cartItemsBody = document.getElementById("cart-items-body");
  const subtotalElement = document.getElementById("subtotal");
  const totalElement = document.getElementById("total");
  const checkoutButton = document.getElementById("checkout");

  let cartData = []; // Stores cart items
  let itemToRemove = null; // For tracking the item to remove

  // Fetch the cart data
  fetchCartData();

  // Function to fetch cart data
  async function fetchCartData() {
    const response = await fetch(
      "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889"
    ); // Replace with your actual API URL
    const data = await response.json();

    cartData = data.items;
    renderCartItems();
    updateCartTotals();
  }

  // Render cart items in the table
  function renderCartItems() {
    cartItemsBody.innerHTML = ""; // Clear previous cart items

    cartData.forEach((item, index) => {
      const cartItemRow = document.createElement("tr");

      cartItemRow.innerHTML = `
        <td>
          <img src="${item.image}" alt="${item.title}">
          <p>${item.title}</p>
        </td>
        <td>₹${formatCurrency(item.price)}</td>
        <td>
          <input type="number" value="${
            item.quantity
          }" data-index="${index}" min="1">
        </td>
        <td>₹${formatCurrency(item.price * item.quantity)}
        <i class="fa-solid fa-trash" data-index="${index}"></i></td>
    
          
        
      `;

      // Add event listener for quantity change
      cartItemRow
        .querySelector('input[type="number"]')
        .addEventListener("input", (e) => {
          updateQuantity(index, e.target.value);
        });

      // Add event listener for trash icon click
      cartItemRow.querySelector(".fa-trash").addEventListener("click", (e) => {
        const itemIndex = e.target.getAttribute("data-index");
        removeItem(itemIndex);
      });

      cartItemsBody.appendChild(cartItemRow);
    });
  }

  // Format currency in INR
  function formatCurrency(amount) {
    return amount.toLocaleString("en-IN");
  }

  // Update cart item quantity
  function updateQuantity(index, quantity) {
    const item = cartData[index];
    item.quantity = parseInt(quantity);
    renderCartItems();
    updateCartTotals();
  }

  // Update cart totals
  function updateCartTotals() {
    const subtotal = cartData.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const total = subtotal; // Assuming no additional taxes or discounts
    subtotalElement.textContent = `Subtotal: ₹${formatCurrency(subtotal)}`;
    totalElement.textContent = `Total: ₹${formatCurrency(total)}`;
  }

  // Checkout button functionality
  checkoutButton.addEventListener("click", () => {
    // Reset cart data
    cartData = [];
    renderCartItems();
    updateCartTotals();

    alert("Order placed!");
  });

  // Remove item from the cart
  function removeItem(index) {
    cartData.splice(index, 1); // Remove item at the given index
    renderCartItems(); // Re-render the updated cart
    updateCartTotals(); // Update the totals
  }
});
