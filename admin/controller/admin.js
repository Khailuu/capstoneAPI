// khởi tạo lớp services
let services = new Services()

// get Element
const getElmntId = (id) => {
    return document.getElementById(id)
}

// get product list
const getProductList = () => {
    let promise = services.getPrd()
    promise.then((data)=>{
        // console.log("data: ", data);
        renderProductList(data.data)
    })

    .catch((error)=>{
        console.log("error: ", error);
    })
}
getProductList()

// get data from Form
const getDataFromForm = () => {
    
    let name = getElmntId('name').value
    console.log("name: ", name);
    let price = getElmntId('price').value
    let screen = getElmntId('screen').value
    let backCamera = getElmntId('backCamera').value
    let frontCamera = getElmntId('frontCamera').value
    let img = getElmntId('image').value
    let desc = getElmntId('description').value
    let type = getElmntId('type').value

    const product = new Product(name,price,screen,backCamera,frontCamera,img,desc,type)

    return product

}
// render Product List
const renderProductList = (productList) => {
    let htmlContent =''
    
    for( let i = 0; i < productList.length; i++){
        let prd = productList[i]
        htmlContent += `
        <tr>
            <td>${i + 1}</td>
            <td>${prd.name}</td>
            <td>${prd.price}</td>
            <td>${prd.screen}</td>
            <td>${prd.backCamera}</td>
            <td>${prd.frontCamera}</td>
            <td>
                <img src="${prd.img}" alt="" class="img-fluid">
            </td>
            <td>${prd.desc}</td>
            <td>${prd.type}</td>
            <td>
            <button id="btnEdit" type="button" class="btn btn-success m-1" onclick='editProduct(${prd.id})' data-toggle="modal" data-target="#myModal"><i class="fa fa-edit"></i></button>
            <button id="btnDelete" type="button" class="btn btn-danger m-1" data-dismiss="modal" onclick='deleteProduct(${prd.id})'><i class="fa fa-trash"></i></button>
            </td>
        </tr>
        `
    }
    getElmntId('tblDanhSachSP').innerHTML = htmlContent
}


// Thêm nút save và cancel khi nhấn add new product
getElmntId('btnThemSP').onclick = () => {
    getElmntId('modal-footer').innerHTML = `
            <button id="btnSave" type="button" class="btn btn-success m-1" onclick='saveProduct()'>Save</button>
            <button id="btnCancel" type="button" class="btn btn-danger m-1" onclick='cancelFunct()'>Cancel</button>
            </td>
    `
}

// Cancel and clear function
const cancelFunct = () => {
    getElmntId('btnClose').click();
    getElmntId('formLogin').reset();

}

// show product into form
const showProductOnForm = (product) => {
    getElmntId('name').value = product.name
    getElmntId('price').value = product.price
    getElmntId('screen').value = product.screen
    getElmntId('backCamera').value = product.backCamera
    getElmntId('frontCamera').value = product.frontCamera
    getElmntId('image').value = product.img
    getElmntId('description').value = product.desc
    getElmntId('type').value = product.type
}
// edit product
const editProduct = (id) =>{
    getElmntId('modal-footer').innerHTML = `
            <button id="btnUpdate" type="button" class="btn btn-success m-1" onclick='updateProduct(${id})'>Update</button>
            <button id="btnCancel" type="button" class="btn btn-danger m-1" onclick='cancelFunct()'>Cancel</button>
            </td>
    `
    const promise = services.getPrdDetailById(id)
    .then((data)=>{
        console.log("data: ", data.data);
        showProductOnForm(data.data)
    })

    .catch((error)=>{
        console.log("error: ", error);
    })

    // const product = 
}

// Save product into mock api
const saveProduct = () => {
    let product = getDataFromForm()
    const promise = services.addPrd(product)
    .then((data)=>{
        getProductList()
    })

    .catch((error)=>{
        console.log("error: ", error);
    })
    
    cancelFunct()
}

// Delete Product
const deleteProduct = (id) => {
    const promise = services.deletePrd(id)
    .then((data)=>{
        getProductList()
    })

    .catch((error)=>{
        console.log("error: ", error);
    })
}

// Update Product
const updateProduct = (id) => {
    const product = getDataFromForm()
    const promise = services.editPrd(id, product)
    .then((data)=>{
        getProductList()
    })

    .catch((error)=>{
        console.log("error: ", error);
    })
    cancelFunct()
}