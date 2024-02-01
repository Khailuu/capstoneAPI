function getEle(id) {
  return document.getElementById(id);
}

var service = new Services();
var cartInstance = new Cart();
var basePrice = [];
var productList; // Thêm biến để lưu trữ danh sách sản phẩm gốc

// getProductList call API
function getProductList() {
  var promise = service.getPrd();

  promise.then((res) => {
    productList = res.data; // Lưu danh sách sản phẩm gốc
    renderProductList(productList);
  });

  promise.catch((err) => {
    console.log(err);
  });
}

// render product
function renderProductList(productList) {
  var htmlContent = "";

  for (var i = 0; i < productList.length; i++) {
    var product = productList[i];

    htmlContent += `
            <div class="col-12 col-xl-3 col-lg-3 col-sm-12 col-md-4 mt-4">
                <div class="card-group">
                    <div class="card">
                        <div class="text-center">
                            <img src="${product.img}" class="img-fluid mt-4" style="width: 240px" alt="" id="HinhSP">
                        </div>
                        <div class="card-body">
                            <h3 class="card-title">${product.price}$</h3>
                            <h3 class="card-title">${product.name}</h3>
                            <h5>${product.screen}</h5>
                            <p>${product.backCamera}</p>
                            <p>${product.frontCamera}</p>
                            <p class="card-text">${product.desc}</p>
                            <div class="card-footer d-flex justify-content-between">
                                <span class="card-text">${product.type}</span>
                                <span>
                                    <i class="fa-solid fa-cart-shopping" onclick="addToCart(${product.id})"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
  }

  // hiển thị table
  getEle("colSP").innerHTML = htmlContent;
}

// function filter
function filterProductType() {
  var selectedType = getEle("filter").value;
  var filteredProducts;

  if (selectedType === "all") {
    filteredProducts = productList;
  } else {
    filteredProducts = productList.filter(
      (product) => product.type.toLowerCase() === selectedType
    );
  }
  // call renderProductList again to render product list filter
  renderProductList(filteredProducts);
}

// render cart list
function renderCartList(productList) {
  var content = "";
  for (var i = 0; i < productList.length; i++) {
    var product = productList[i];
    content += `
      <li class="product">
              <a href="#" class="product-link">
                <span class="product-image">
                  <img src="${product.img}" alt="Product Photo">
                </span>
                <span class="product-details">
                  <h3>${product.name}</h3>
                  <span class="qty-price">
                    <span class="qty">
                      <button class="minus-button" id="minus-button-1" onclick="descreaseQuantityInCart(${i})">-</button>
                      <input type="number" id="qty-input-${i}" class="qty-input" step="1" min="1" max="1000" name="qty-input" value="${product.quantity}" pattern="[0-9]*" title="Quantity" inputmode="numeric">
                      <button class="plus-button" id="plus-button-1" onclick="increaseQuantityInCart(${i})">+</button>
                      <input type="hidden" name="item-price" id="item-price-1" value="12.00">
                    </span>
                    <span class="price" id="price-span-${i}">${product.price}</span> 
                  </span>
                </span>
              </a>
              <a href="#remove" class="remove-button"><span class="remove-icon" onclick="deleteProductInCart(${i})">X</span></a>
            </li>
    `;
  }

  getEle("tblCart").innerHTML = content;
}

function addToCart(id) {
  var promise = service.getPrdId(id);

  promise.then((res) => {
    
    // Check if the product is already in the cart
    var existingProductIndex = cartInstance.listCart.findIndex(
      (cartItem) => cartItem.id === res.data.id
    );

    if (existingProductIndex === -1) {
      // Product is not in the cart, add it
      // res.data.id = cartInstance.listCart.length; // Set a new unique ID for the new product
      res.data.quantity = 1; // Set the quantity for the new product
      cartInstance.listCart.push(res.data); // Add the product to the cart list
      basePrice.push(res.data.price);
    } else {
      // Product is already in the cart, increment its quantity
      cartInstance.listCart[existingProductIndex].quantity += 1;
      var price = getEle("price-span-" + existingProductIndex);
      cartInstance.listCart[existingProductIndex].price = basePrice[existingProductIndex] * cartInstance.listCart[existingProductIndex].quantity;
      price.innerHTML = cartInstance.listCart[existingProductIndex].price;    
    }

    getEle("countCartNav").style.display = "inline-block";
    getEle("countCartNav").innerHTML = cartInstance.listCart.length;;
    getEle("countCart").innerHTML = cartInstance.listCart.length;; // Update the count in the UI
    console.log(cartInstance.listCart);

    renderCartList(cartInstance.listCart); // Render the updated cart list
    setLocalStorage(); // Update local storage
    updateTotalPrice();
  });

  promise.catch((err) => {
    // Handle errors if needed
  });
  return basePrice
}

updateTotalPrice();

function calculateTotalPrice(cart) {
  var totalPrice = 0;

  for (var i = 0; i < cart.length; i++) {
    var product = cart[i];
    totalPrice += product.price; // Tính tổng giá trị dựa vào giá của sản phẩm và số lượng
  }

  console.log(totalPrice);
  localStorage.setItem("totalPrice", totalPrice);
  return totalPrice;
}

// Gọi hàm và cập nhật tổng giá trị trong giao diện người dùng
function updateTotalPrice() {
  var totalSpan = getEle("total-price");
  var total = calculateTotalPrice(cartInstance.listCart);
  totalSpan.innerHTML = total;
}

function increaseQuantityInCart(id) {
  cartInstance.listCart[id].quantity += 1;
  var qty = getEle("qty-input-" + id);
  var price = getEle("price-span-" + id);


  cartInstance.listCart[id].price = basePrice[id] * cartInstance.listCart[id].quantity;
  // price.innerHTML = newprice
  // console.log(newprice);
  price.innerHTML = cartInstance.listCart[id].price;
  qty.innerHTML = cartInstance.listCart[id].quantity;
  (cartInstance.listCart, id);
  renderCartList(cartInstance.listCart);
  updateTotalPrice();
  setLocalStorage(); // Update local storage
}

// function increaseQuantityInCart(id) {
//   var priceSpan = getEle("price-span-" +id);
//   var qtyInput = getEle("qty-input-1");
//   cartInstance.listCart.forEach((cartItem, index) => {
//     if(cartItem.id === index) {
//       cartInstance.listCart[index].quantity += 1;
//       qtyInput.value = cartInstance.listCart[index].quantity;
//       var basePrice = cartInstance.listCart[index].price;
//       var newPrice = calculatePrice(basePrice, cartInstance.listCart[index].quantity)
//       console.log(cartInstance.listCart[index]);
//       priceSpan.innerHTML = newPrice
//     }
//   })

//   console.log(cartInstance.listCart);
//   setLocalStorage()
// }
function descreaseQuantityInCart(id) {
  var price = getEle("price-span-" + id);
  cartInstance.listCart[id].quantity -= 1;
  cartInstance.listCart[id].price = basePrice[id] * cartInstance.listCart[id].quantity;
  price.innerHTML = cartInstance.listCart[id].price;
  var qty = getEle("qty-input-" + id);

  qty.innerHTML = cartInstance.listCart[id].quantity;
  renderCartList(cartInstance.listCart);
  updateTotalPrice();
  setLocalStorage(); // Update local storage
}

function deleteProductInCart(id) {
  // debugger
  cartInstance.deleteProductCart(id);
  basePrice.splice(id, 1);
  getEle("countCartNav").innerHTML = cartInstance.listCart.length;
  if(cartInstance.listCart.length === 0){
    getEle("countCartNav").style.display = "none";
  }
  getEle("countCart").innerHTML = cartInstance.listCart.length;;
  renderCartList(cartInstance.listCart);
  updateTotalPrice();
  setLocalStorage();
}

// add event onchange
getEle("filter").addEventListener("change", filterProductType);

getProductList();

$(document).ready(function ($) {
  // Declare the body variable
  var $body = $("body");

  // Function that shows and hides the sidebar cart
  $(".cart-button, .close-button, #sidebar-cart-curtain").click(function (e) {
    e.preventDefault();

    // Add the show-sidebar-cart class to the body tag
    $body.toggleClass("show-sidebar-cart");

    // Check if the sidebar curtain is visible
    if ($("#sidebar-cart-curtain").is(":visible")) {
      // Hide the curtain
      $("#sidebar-cart-curtain").fadeOut(500);
    } else {
      // Show the curtain
      $("#sidebar-cart-curtain").fadeIn(500);
    }
  });

  // Function that adds or subtracts quantity when a
  // plus or minus button is clicked
});

function resetCart() {
  basePrice = []
  cartInstance.listCart.splice(0, cartInstance.listCart.length)
  getEle("countCart").innerHTML = cartInstance.listCart.length;
  getEle("countCartNav").innerHTML = cartInstance.listCart.length;
  getEle("countCartNav").style.display = "none";
  getEle("total-price").innerHTML = 0;
  renderCartList(cartInstance.listCart)
  setLocalStorage()
}

function setLocalStorage() {
  var dataCount = JSON.stringify(cartInstance.listCart.length);
  var dataStr = JSON.stringify(cartInstance.listCart);
  var dataPrice = JSON.stringify(basePrice)
  localStorage.setItem("count", dataCount);
  localStorage.setItem("cart", dataStr);
  localStorage.setItem("price", dataPrice)
}

function getLocalStorage() {
  var data = localStorage.getItem("cart");
  var count = localStorage.getItem("count");
  var price = localStorage.getItem("price");
  var totalPrice = localStorage.getItem("totalPrice");
  if (data !== null) {
    var parseCount = JSON.parse(count);
    var parseData = JSON.parse(data);
    var parsePrice = JSON.parse(price);
    var parseTotalPrice = JSON.parse(totalPrice);
    cartInstance.listCart = parseData;
    cartInstance.listCart.length = parseCount;
    totalPrice = parseTotalPrice
    if(cartInstance.listCart.length > 0){
      getEle("countCartNav").style.display = "inline-block";
      getEle("countCartNav").innerHTML = cartInstance.listCart.length;;
      basePrice = parsePrice;
      updateTotalPrice();
    }
    getEle("countCart").innerHTML = cartInstance.listCart.length;
    renderCartList(cartInstance.listCart);
  }
}

getLocalStorage();