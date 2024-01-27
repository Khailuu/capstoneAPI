function getEle(id) {
  return document.getElementById(id);
}
var services = new Services();
var productList;
//get product from input
function getProductFromInput() {
  var name = getEle("name").value;
  var price = getEle("price").value;
  var screen = getEle("screen").value;
  var backCamera = getEle("backCamera").value;
  var frontCamera = getEle("frontCamera").value;
  var image = getEle("image").value;
  var desc = getEle("description").value;
  var type = getEle("type").value;

  var product = new Products(
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    image,
    desc,
    type
  );

  return product;
}

//render product from input to screen
function renderProductFromInput() {
  var product = getProductFromInput();

  var promise = services.addPrd(product);

  promise.then(() => {
    getProductList();
    document.querySelector(".modal-header button").click();
  });
  promise.catch((err) => {
    console.log(err);
  });
}

//render product
function renderProductList(productList) {
  var content = "";
  for (var i = 0; i < productList.length; i++) {
    var product = productList[i];
    content += `
            <tr>
                <td>${i + 1}</td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.screen}</td>
                <td>${product.backCamera}</td>
                <td>${product.frontCamera}</td>
                <td>
                    <img class="img-fluid" style="width: 100px; height: 100px" src=${
                      product.img
                    } alt="abc" />
                </td>
                <td>${product.desc}</td>
                <td>${product.type}</td>
                <td>
                    <button class="btn btn-success" data-toggle="modal" data-target="#myModal" onclick="btnEdit(${
                      product.id
                    })">Edit</button>
                    <button class="btn btn-danger" onclick="deleteProduct(${
                      product.id
                    })">Delete</button>
                </td>
            </tr>
        `;
  }
  getEle("tblDanhSachSP").innerHTML = content;
}

getEle("btnThemSP").onclick = () => {
  getEle("modal-footer").innerHTML = `
        <button id="themSP" class="btn btn-success" onclick="renderProductFromInput()">Thêm sản phẩm</button>
    `;
};

//delete product
function deleteProduct(id) {
  var promise = services.deletePrd(id);

  promise.then(() => {
    getProductList();
  });
}

//edit product
function btnEdit(id) {
  var promise = services.getPrdDetailById(id);

  getEle("modal-footer").innerHTML = `
    <button id="themSP" class="btn btn-success" onclick="editProduct(${id})" data-toggle="modal" data-target="#myModal">Edit product</button>
    `;
  promise.then((res) => {
    var product = res.data;
    getEle("name").value = product.name;
    getEle("price").value = product.price;
    getEle("screen").value = product.screen;
    getEle("backCamera").value = product.backCamera;
    getEle("frontCamera").value = product.frontCamera;
    getEle("image").value = product.img;
    getEle("description").value = product.desc;
    getEle("type").value = product.type;
  });

  promise.catch((err) => {
    console.log(err);
  });
}

function editProduct(id) {
  // lấy thông tin sau khi edit
  var product = getProductFromInput();

  // call api edit product
  var promise = services.editPrd(id, product);

  promise.then((res) => {
    getProductList();
  });

  promise.catch((err) => {
    console.log(err);
  });
}

// call api
function getProductList() {
  var promise = services.getPrd();

  promise.then((res) => {
    productList = res.data;
    renderProductList(res.data);
  });
  promise.catch((err) => {
    console.log(err);
  });
}

getProductList();

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
getEle("filter").addEventListener("change", filterProductType);
