const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// In-Memory Database for Grocery Items
let products = [
  {
    id: 1,
    name: 'Aashirvaad Superior MP Atta (5 kg)',
    category: 'Atta & Rice',
    price: 265,
    time: '8 mins',
    icon: '🌾',
  },
  {
    id: 2,
    name: 'Amul Taaza Fresh Toned Milk (500 ml)',
    category: 'Dairy & Eggs',
    price: 27,
    time: '9 mins',
    icon: '🥛',
  },
  {
    id: 3,
    name: 'Fresh Farm Red Onion (1 kg)',
    category: 'Vegetables',
    price: 42,
    time: '10 mins',
    icon: '🧅',
  },
  {
    id: 4,
    name: 'Maggi 2-Minute Instant Noodles (4 Pack)',
    category: 'Snacks',
    price: 56,
    time: '7 mins',
    icon: '🍜',
  },
  {
    id: 5,
    name: 'Cadbury Dairy Milk Silk Chocolate (150 g)',
    category: 'Sweets',
    price: 175,
    time: '8 mins',
    icon: '🍫',
  },
  {
    id: 6,
    name: 'Coca-Cola Zero Sugar Soft Drink Can (300 ml)',
    category: 'Beverages',
    price: 40,
    time: '8 mins',
    icon: '🥤',
  },
];

let orders = [];

// Main Web Application User Interface
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>DailyMart - 10-Minute Grocery Delivery Portal</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background-color: #f8fafc; margin: 0; padding-bottom: 80px; color: #0f172a; }
 
    /* Navigation Bar */
    .navbar { background-color: #ff5200; color: #ffffff; padding: 14px 24px; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .nav-container { max-width: 1050px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
    .brand-title { font-size: 24px; font-weight: 900; letter-spacing: -0.5px; }
    .brand-title span { color: #fef08a; }
    .nav-buttons { display: flex; gap: 12px; align-items: center; }
    .btn-nav { background: #ffffff; color: #ff5200; border: none; padding: 8px 16px; border-radius: 20px; font-weight: 700; cursor: pointer; font-size: 13px; }
    .btn-nav:hover { background: #fff7ed; }
    .user-tag { font-size: 13px; background: rgba(255, 255, 255, 0.2); padding: 7px 14px; border-radius: 20px; font-weight: 600; }
 
    /* Page Layout */
    .content-area { max-width: 1050px; margin: 0 auto; padding: 20px; }
 
    /* Delivery Address Bar */
    .address-card { background: #ffffff; padding: 14px 20px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; border: 1px solid #e2e8f0; }
    .address-details { font-size: 13px; }
    .address-details b { font-size: 14px; color: #0f172a; }
    .btn-change { background: none; border: 1px solid #ff5200; color: #ff5200; padding: 6px 14px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 12px; }
 
    /* Search Input */
    .search-field { width: 100%; padding: 14px 18px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 15px; outline: none; margin-bottom: 12px; }
    .search-field:focus { border-color: #ff5200; }
 
    /* Categories */
    .category-bar { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 16px; }
    .cat-pill { background: #ffffff; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 20px; font-size: 13px; cursor: pointer; font-weight: 600; white-space: nowrap; }
    .cat-pill.active { background: #ff5200; color: #ffffff; border-color: #ff5200; }
 
    /* Product Grid */
    .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 16px; }
    .product-card { background: #ffffff; border-radius: 12px; padding: 16px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; justify-content: space-between; }
    .time-label { font-size: 11px; font-weight: 800; color: #854d0e; background: #fef9c3; padding: 4px 8px; border-radius: 6px; width: fit-content; }
    .product-icon { font-size: 48px; text-align: center; margin: 12px 0; }
    .product-name { font-size: 14px; font-weight: 700; color: #1e293b; margin: 4px 0 8px 0; height: 38px; overflow: hidden; line-height: 1.3; }
    .price-action-row { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
    .product-price { font-size: 17px; font-weight: 800; color: #0f172a; }
    .btn-add-item { background: #ffffff; color: #16a34a; border: 1.5px solid #16a34a; padding: 7px 16px; border-radius: 8px; font-weight: 800; cursor: pointer; font-size: 13px; }
    .btn-add-item:hover { background: #16a34a; color: #ffffff; }
 
    /* Side Cart Drawer */
    .cart-drawer { position: fixed; top: 0; right: -420px; width: 100%; max-width: 400px; height: 100%; background: #ffffff; box-shadow: -4px 0 15px rgba(0,0,0,0.15); z-index: 300; transition: 0.3s; display: flex; flex-direction: column; }
    .cart-drawer.active { right: 0; }
    .cart-top { padding: 18px; background: #0f172a; color: #ffffff; display: flex; justify-content: space-between; align-items: center; }
    .cart-body { flex: 1; overflow-y: auto; padding: 16px; }
    .cart-line-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .cart-bottom { padding: 20px; background: #f8fafc; border-top: 1px solid #e2e8f0; }
 
    /* Modals */
    .overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: none; justify-content: center; align-items: center; z-index: 200; }
    .modal-box { background: #ffffff; padding: 24px; border-radius: 12px; width: 90%; max-width: 420px; box-shadow: 0 10px 25px rgba(0,0,0,0.15); }
    .modal-box h3 { margin-top: 0; color: #0f172a; }
    .modal-box input, .modal-box textarea, .modal-box select { width: 100%; padding: 10px; margin: 8px 0; border: 1px solid #cbd5e1; border-radius: 6px; }
    .btn-confirm { width: 100%; padding: 12px; background: #ff5200; color: #ffffff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; margin-top: 8px; }
 
    /* Notification Banner */
    .order-success-banner { display: none; background: #dcfce7; border: 1px solid #86efac; color: #166534; padding: 16px; border-radius: 10px; margin-bottom: 18px; text-align: center; }
  </style>
</head>
<body>
 
  <!-- Navigation Bar -->
  <div class="navbar">
    <div class="nav-container">
      <div class="brand-title">⚡ Daily<span>Mart</span> <small style="font-size:12px; font-weight:normal;">Express</small></div>
      <div class="nav-buttons">
        <span id="userStatus" class="user-tag">Welcome, Guest</span>
        <button id="loginTrigger" class="btn-nav" onclick="showModal('loginModal')">Customer Login</button>
        <button class="btn-nav" onclick="toggleCartDrawer()">🛒 Cart (<span id="cartBadgeCount">0</span>)</button>
      </div>
    </div>
  </div>
 
  <div class="content-area">
    <!-- Success Banner -->
    <div id="orderNotification" class="order-success-banner"></div>
 
    <!-- Address Details -->
    <div class="address-card">
      <div class="address-details">
        <div>⚡ <b>Delivery in 10 Minutes</b> to:</div>
        <div id="currentDeliveryAddress" style="color: #64748b;">University Campus Hostel, Block A, Room 302</div>
      </div>
      <button class="btn-change" onclick="showModal('addressModal')">Change Location</button>
    </div>
 
    <!-- Search Box -->
    <input type="text" id="filterKeyword" class="search-field" placeholder="Search for groceries, milk, snacks, vegetables..." onkeyup="executeSearch()">
 
    <!-- Category Filters -->
    <div class="category-bar">
      <button class="cat-pill active" onclick="applyCategory('All', this)">All Items</button>
      <button class="cat-pill" onclick="applyCategory('Dairy & Eggs', this)">Dairy & Eggs</button>
      <button class="cat-pill" onclick="applyCategory('Snacks', this)">Snacks</button>
      <button class="cat-pill" onclick="applyCategory('Vegetables', this)">Vegetables</button>
      <button class="cat-pill" onclick="applyCategory('Atta & Rice', this)">Atta & Rice</button>
      <button class="cat-pill" onclick="applyCategory('Beverages', this)">Beverages</button>
      <button class="cat-pill" onclick="applyCategory('Sweets', this)">Sweets</button>
    </div>
 
    <!-- Product Grid -->
    <h3 style="font-size: 17px; margin: 12px 0 16px 0; color: #334155;">Daily Essential Products</h3>
    <div class="product-grid" id="catalogDisplay"></div>
  </div>
 
  <!-- Slide-out Cart Drawer -->
  <div class="cart-drawer" id="shoppingCartDrawer">
    <div class="cart-top">
      <h3 style="margin: 0;">Order Summary (<span id="cartHeaderCount">0</span>)</h3>
      <button onclick="toggleCartDrawer()" style="background: none; border: none; color: #ffffff; font-size: 20px; cursor: pointer;">✕</button>
    </div>
    <div class="cart-body" id="cartContainer">
      <p style="text-align: center; color: #94a3b8; margin-top: 50px;">Your shopping cart is empty.</p>
    </div>
    <div class="cart-bottom">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
        <span>Item Total</span>
        <span id="subTotalDisplay">₹0</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 13px; color: #16a34a;">
        <span>Delivery Partner Fee</span>
        <span>FREE</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 16px; font-weight: 800; font-size: 18px;">
        <span>Total Payable</span>
        <span id="grandTotalDisplay">₹0</span>
      </div>
      <button class="btn-confirm" onclick="showModal('checkoutModal')">Proceed to Checkout</button>
    </div>
  </div>
 
  <!-- Modal 1: User Login -->
  <div class="overlay" id="loginModal">
    <div class="modal-box">
      <h3>Customer Account Login</h3>
      <input type="text" id="custName" placeholder="Full Name" required>
      <input type="tel" id="custPhone" placeholder="10-Digit Mobile Number" required>
      <button class="btn-confirm" onclick="processLogin()">Sign In / Continue</button>
      <button onclick="hideModal('loginModal')" style="width: 100%; background: none; border: none; margin-top: 8px; color: #64748b; cursor: pointer;">Cancel</button>
    </div>
  </div>
 
  <!-- Modal 2: Delivery Address -->
  <div class="overlay" id="addressModal">
    <div class="modal-box">
      <h3>Update Delivery Address</h3>
      <input type="text" id="addrLine1" placeholder="Flat No / Room No / Hostel Block" required>
      <textarea id="addrLine2" placeholder="Street Address, Landmark & Area" rows="3" required></textarea>
      <button class="btn-confirm" onclick="updateAddress()">Save Address</button>
      <button onclick="hideModal('addressModal')" style="width: 100%; background: none; border: none; margin-top: 8px; color: #64748b; cursor: pointer;">Cancel</button>
    </div>
  </div>
 
  <!-- Modal 3: Payment Checkout -->
  <div class="overlay" id="checkoutModal">
    <div class="modal-box">
      <h3>Payment & Order Placement</h3>
      <p style="font-size: 14px; color: #64748b;">Grand Total to Pay: <b id="payTotalAmount" style="color: #0f172a;">₹0</b></p>
      <label style="font-size: 13px; font-weight: 600; color: #475569;">Select Payment Method:</label>
      <select id="paymentSelection">
        <option value="UPI (Google Pay / PhonePe / Paytm)">UPI (Google Pay / PhonePe / Paytm)</option>
        <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
        <option value="Debit / Credit Card">Debit / Credit Card</option>
        <option value="Net Banking">Net Banking</option>
      </select>
      <button class="btn-confirm" style="background: #16a34a;" onclick="executeOrder()">Confirm Order & Pay</button>
      <button onclick="hideModal('checkoutModal')" style="width: 100%; background: none; border: none; margin-top: 8px; color: #64748b; cursor: pointer;">Cancel</button>
    </div>
  </div>
 
  <script>
    let globalCatalog = [];
    let cartStorage = [];
    let activeCustomer = null;
    let selectedCat = 'All';
 
    async function loadCatalog() {
      const res = await fetch('/api/products');
      globalCatalog = await res.json();
      displayProducts(globalCatalog);
    }
 
    function displayProducts(items) {
      const container = document.getElementById('catalogDisplay');
      if (items.length === 0) {
        container.innerHTML = '<p style="color:#64748b; grid-column: 1/-1;">No products found matching your criteria.</p>';
        return;
      }
      container.innerHTML = items.map(prod => \`
        <div class="product-card">
          <div class="time-label">⏱️ \${prod.time}</div>
          <div class="product-icon">\${prod.icon || '🛒'}</div>
          <div class="product-name">\${prod.name}</div>
          <div class="price-action-row">
            <div class="product-price">₹\${prod.price}</div>
            <button class="btn-add-item" onclick="addItemToCart(\${prod.id})">ADD</button>
          </div>
        </div>
      \`).join('');
    }
 
    function applyCategory(catName, btnElement) {
      selectedCat = catName;
      document.querySelectorAll('.cat-pill').forEach(btn => btn.classList.remove('active'));
      btnElement.classList.add('active');
      executeSearch();
    }
 
    function executeSearch() {
      const keyword = document.getElementById('filterKeyword').value.toLowerCase();
      const filtered = globalCatalog.filter(p => {
        const matchesCategory = (selectedCat === 'All' || p.category === selectedCat);
        const matchesSearch = p.name.toLowerCase().includes(keyword) || p.category.toLowerCase().includes(keyword);
        return matchesCategory && matchesSearch;
      });
      displayProducts(filtered);
    }
 
    function addItemToCart(id) {
      const item = globalCatalog.find(p => p.id === id);
      cartStorage.push(item);
      refreshCart();
    }
 
    function refreshCart() {
      document.getElementById('cartBadgeCount').innerText = cartStorage.length;
      document.getElementById('cartHeaderCount').innerText = cartStorage.length;
 
      const itemsList = document.getElementById('cartContainer');
      if (cartStorage.length === 0) {
        itemsList.innerHTML = '<p style="text-align: center; color: #94a3b8; margin-top: 50px;">Your shopping cart is empty.</p>';
        document.getElementById('subTotalDisplay').innerText = '₹0';
        document.getElementById('grandTotalDisplay').innerText = '₹0';
        return;
      }
 
      let total = 0;
      itemsList.innerHTML = cartStorage.map((prod, idx) => {
        total += prod.price;
        return \`
          <div class="cart-line-item">
            <div>
              <b>\${prod.name}</b>
              <div style="color: #64748b; font-size: 12px; margin-top: 2px;">₹\${prod.price}</div>
            </div>
            <button onclick="removeCartItem(\${idx})" style="background:none; border:none; color:#ef4444; font-weight:bold; cursor:pointer; font-size:16px;">✕</button>
          </div>
        \`;
      }).join('');
 
      document.getElementById('subTotalDisplay').innerText = '₹' + total;
      document.getElementById('grandTotalDisplay').innerText = '₹' + total;
      document.getElementById('payTotalAmount').innerText = '₹' + total;
    }
 
    function removeCartItem(index) {
      cartStorage.splice(index, 1);
      refreshCart();
    }
 
    function toggleCartDrawer() {
      document.getElementById('shoppingCartDrawer').classList.toggle('active');
    }
 
    function showModal(id) {
      if (id === 'checkoutModal' && cartStorage.length === 0) {
        alert('Your shopping cart is empty! Add items before checking out.');
        return;
      }
      document.getElementById(id).style.display = 'flex';
    }
 
    function hideModal(id) {
      document.getElementById(id).style.display = 'none';
    }
 
    function processLogin() {
      const name = document.getElementById('custName').value.trim();
      const phone = document.getElementById('custPhone').value.trim();
      if (!name || phone.length < 10) {
        alert('Please enter a valid Customer Name and a 10-digit Mobile Number.');
        return;
      }
      activeCustomer = { name, phone };
      document.getElementById('userStatus').innerText = 'Welcome, ' + name.split(' ')[0];
      document.getElementById('loginTrigger').innerText = 'Logout';
      document.getElementById('loginTrigger').onclick = () => location.reload();
      hideModal('loginModal');
      alert('Login successful! Welcome to DailyMart, ' + name);
    }
 
    function updateAddress() {
      const l1 = document.getElementById('addrLine1').value.trim();
      const l2 = document.getElementById('addrLine2').value.trim();
      if (!l1 || !l2) {
        alert('Please provide complete address details.');
        return;
      }
      document.getElementById('currentDeliveryAddress').innerText = l1 + ', ' + l2;
      hideModal('addressModal');
    }
 
    async function executeOrder() {
      const payOption = document.getElementById('paymentSelection').value;
      const addr = document.getElementById('currentDeliveryAddress').innerText;
      const finalAmount = cartStorage.reduce((acc, curr) => acc + curr.price, 0);
 
      const orderPayload = {
        customerName: activeCustomer ? activeCustomer.name : 'Guest Customer',
        itemCount: cartStorage.length,
        totalAmount: finalAmount,
        destinationAddress: addr,
        paymentGateway: payOption
      };
 
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
 
      hideModal('checkoutModal');
      toggleCartDrawer();
      cartStorage = [];
      refreshCart();
 
      const banner = document.getElementById('orderNotification');
      banner.style.display = 'block';
      banner.innerHTML = '🎉 <b>Order Placed Successfully via ' + payOption + '!</b> Estimated arrival: 10 minutes.';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
 
    loadCatalog();
  </script>
 
</body>
</html>
  `);
});

// RESTful API Endpoints
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/orders', (req, res) => {
  const generatedOrder = {
    orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
    ...req.body,
    orderStatus: 'Confirmed',
    createdAt: new Date().toISOString(),
  };
  orders.push(generatedOrder);
  console.log('New Order Recorded:', generatedOrder);
  res.status(201).json(generatedOrder);
});

app.listen(port, () => {
  console.log('DailyMart Server active on port ' + port);
});
