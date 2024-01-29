function getEle(id) {
  return document.getElementById(id);
}

var service = new Services();
var cartInstance = new Cart();
var cartItem1 = new Cart();
var cartItem2 = new Cart();
var countCart;
var priceChange;
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
                      <button class="minus-button" id="minus-button-1">-</button>
                      <input type="number" id="qty-input-1" class="qty-input" step="1" min="1" max="1000" name="qty-input" value="1" pattern="[0-9]*" title="Quantity" inputmode="numeric">
                      <button class="plus-button" id="plus-button-1">+</button>
                      <input type="hidden" name="item-price" id="item-price-1" value="12.00">
                    </span>
                    <span class="price">${product.price}</span> 
                  </span>
                </span>
              </a>
              <a href="#remove" class="remove-button"><span class="remove-icon" onclick="deleteProductCart(${product.id})">X</span></a>
            </li>
    `;
  }

  getEle("tblCart").innerHTML = content;
}



function addToCart(id) {
  var promise = service.getPrdId(id);

  promise.then((res) => {
    cartInstance.addCart(res.data); // Add the product to the cart list
    // gán lại id product cart khi add vào mảng cart
    var count = 0;
    for (var i = 0; i < cartInstance.listCart.length; i++) {
      res.data.id = i;
      count++;
    }
    countCart = count;
    getEle("countCart").innerHTML = count;
    setLocalStorage();
    renderCartList(cartInstance.listCart);
  });

  promise.catch((err) => {});
}

function deleteProductCart(id) {
  // debugger
  countCart = cartInstance.deleteProductCart(id, countCart);
  getEle("countCart").innerHTML = countCart;
  renderCartList(cartInstance.listCart);
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
function calculatePrice(basePrice, step) {
  return basePrice * step;
}

function setLocalStorage() {
  var dataCount = JSON.stringify(countCart);
  var dataStr = JSON.stringify(cartInstance.listCart);
  var price = JSON.stringify(priceChange);
  localStorage.setItem("price", price);
  localStorage.setItem("count", dataCount);
  localStorage.setItem("cart", dataStr);
}

function getLocalStorage() {
  var data = localStorage.getItem("cart");
  var count = localStorage.getItem("count");
  var price = localStorage.getItem("price");

  if (data !== null) {
    var parseCount = JSON.parse(count);
    var parseData = JSON.parse(data);
    var parsePrice = JSON.parse(price);
    cartInstance.listCart = parseData;
    countCart = parseCount;
    priceChange = parsePrice;

    getEle("countCart").innerHTML = countCart;
    renderCartList(cartInstance.listCart);
  }
}

getLocalStorage();
