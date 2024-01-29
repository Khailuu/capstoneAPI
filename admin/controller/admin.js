function getEle(id) {
  return document.getElementById(id);
}
var services = new Services();
var validation = new Validation();
var productList;

//get product from input
function getProductFromInput(isAdd) {
  var name = getEle("name").value;
  var price = getEle("price").value;
  var screen = getEle("screen").value;
  var backCamera = getEle("backCamera").value;
  var frontCamera = getEle("frontCamera").value;
  var image = getEle("image").value;
  var desc = getEle("description").value;
  var type = getEle("type").value;
  var promise = services.getPrd()
  var isValid = true;
  // debugger;
  if (isAdd) {
    // debugger;
    isValid &= validation.checkNull(
      name,
      "tbName",
      "Please enter name in the designated field"
      ) &&
      promise.then((res)=>{
        isValid &= validation.checkNameExist(
          name, res.data, "tbName", "Name exist!"
        )
        console.log(res.data);
      })
      
    }
    
  isValid &= validation.checkNull(price, "tbPrice", "Please enter price in the designated field ") &&
  validation.checkPattern(price, "tbPrice", "Please enter price is number", /^[0-9]+$/);
  isValid &= validation.checkNull(screen, "tbScreen", "Please enter screen in the designated field ");
  isValid &= validation.checkNull(backCamera, "tbBackCamera", "Please enter back camera in the designated field ");
  isValid &= validation.checkNull(frontCamera, "tbFrontCamera", "Please enter front camera in the designated field ");
  isValid &= validation.checkNull(image, "tbImage", "Please enter image url in the designated field ");
  isValid &= validation.checkNull(desc, "tbDesc", "Please enter description in the designated field ");
  isValid &= validation.checkType("type", "tbType", "Please enter type in the designated field ")

  if (!isValid) {
    return null;
  }

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
  var product = getProductFromInput(true);

  if (product) {
    var promise = services.addPrd(product);

    promise.then(() => {
      getProductList();
      document.querySelector(".modal-header button").click();
      resetInput();
    });
    promise.catch((err) => {
      console.log(err);
    });
  }
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
                    <img class="img-fluid" style="width: 100px; height: 100px; object-fit:contain;" src=${
                      product.img
                    } alt="abc" />
                </td>
                <td>${product.desc}</td>
                <td>${product.type}</td>
                <td>
                    <button class="btn btn-success" data-toggle="modal" data-target="#myModal" style="min-width: 80px" onclick="btnEdit(${
                      product.id
                    })">Edit</button>
                    <button class="mt-2 btn btn-danger" style="min-width: 80px" onclick="deleteProduct(${
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
    console.log(product.type);
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
    resetInput();
  });

  promise.catch((err) => {
    console.log(err);
  });
}

//search product by name
function searchByName() {
  getEle("search").onkeyup = () => {
    var valueSearch = getEle("search").value;
    console.log(valueSearch);
    var valueSearchTolower = valueSearch.toLowerCase();
    
    var promise = services.getPrd()

    promise.then((res) => {
      var cartSearch = [];
      var cartList = res.data
      for(var i = 0; i < cartList.length; i++) {
        var prd = cartList[i];
        var prdLowerCase = prd.name.toLowerCase();
  
        if(prdLowerCase.indexOf(valueSearchTolower) !== -1) {
          cartSearch.push(prd);
        }
      }
      renderProductList(cartSearch);
    }) 
    promise.then((err)=> {
      console.log(err);
    })
  }
}

searchByName()

function resetInput() {
  getEle("name").value = "";
  getEle("price").value = "";
  getEle("screen").value = "";
  getEle("backCamera").value = "";
  getEle("frontCamera").value = "";
  getEle("image").value = "";
  getEle("description").value = "";
  getEle("type").value = "";
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
function sortByPrice() {
  var selectedType = getEle("sortByPrice").value;
  var promise = services.getPrd();

  promise.then((res) => {
    var productList1 = res.data;

    if (selectedType === "low") {
      // Sort by price from low to high
      productList1.sort((a, b) => a.price*1 - b.price*1);
    } else if (selectedType === "high") {
      // Sort by price from high to low
      productList1.sort((a, b) => b.price*1 - a.price*1);
    }

    renderProductList(productList1);
  });
  promise.catch((err)=>{
    console.log(err);
  })
}



getEle("filter").addEventListener("change", filterProductType);

getEle("sortByPrice").addEventListener("change", sortByPrice);
