// khởi tạo lớp services
let services = new Services()

// get Element
const getElmntId = (id) => {
    return document.getElementById(id)
}

// get product list
const getProductList = () => {
    let promise = services.getPrd()
    promise.then((data) => {
        // console.log("data: ", data);
        let filtCon = getElmntId('filter').value
        let sortCon = getElmntId('sortByPrice').value

        let productList = productFilterSort(filtCon, sortCon, data.data)

        renderProductList(productList)
    })

        .catch((error) => {
            console.log("error: ", error);
        })
}
getProductList()

// get data from Form
const getDataFromForm = () => {
    const val = new Validation()
    let flag = true
    let product = null

    let name = getElmntId('name').value
    flag &= val.nullCheck(name, 'tbName', 'Name must not be null!')

    let price = getElmntId('price').value * 1
    flag &= val.nullCheck(price, 'tbPrice', 'Price must not be null!') && val.patternCheck(price, /^[0-9]+$/, 'tbPrice', 'Price must be number!')

    let screen = getElmntId('screen').value
    flag &= val.nullCheck(screen, 'tbScreen', 'Screen must not be null!')

    let backCamera = getElmntId('backCamera').value
    flag &= val.nullCheck(backCamera, 'tbBackCamera', 'Back CMR must not be null!')

    let frontCamera = getElmntId('frontCamera').value
    flag &= val.nullCheck(frontCamera, 'tbFrontCamera', 'Font CMR must not be null!')

    let img = getElmntId('image').value
    flag &= val.nullCheck(img, 'tbImage', 'Image must not be null!')

    let desc = getElmntId('description').value

    let type = getElmntId('type').value
    const index = getElmntId('type').selectedIndex
    flag &= val.checkSelect(index, 'tbType', 'Please select phone type!')

    if (flag) {
        product = new Product(name, price, screen, backCamera, frontCamera, img, desc, type)
    }


    return product

}
// render Product List
const renderProductList = (productList) => {
    let htmlContent = ''

    for (let i = 0; i < productList.length; i++) {
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
    divs = document.getElementsByClassName('sp-thongbao');

    [].slice.call(divs).forEach(function (div) {
        div.innerHTML = '';
    });

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
const editProduct = (id) => {
    getElmntId('modal-footer').innerHTML = `
            <button id="btnUpdate" type="button" class="btn btn-success m-1" onclick='updateProduct(${id})'>Update</button>
            <button id="btnCancel" type="button" class="btn btn-danger m-1" onclick='cancelFunct()'>Cancel</button>
            </td>
    `
    const promise = services.getPrdDetailById(id)
        .then((data) => {
            console.log("data: ", data.data);
            showProductOnForm(data.data)
        })

        .catch((error) => {
            console.log("error: ", error);
        })

    // const product = 
}

// Save product into mock api
const saveProduct = () => {
    let product = getDataFromForm()
    if (product) {
        const promise = services.addPrd(product)
            .then((data) => {
                getProductList()
            })

            .catch((error) => {
                console.log("error: ", error);
            })

        cancelFunct()
    }

}

// Delete Product
const deleteProduct = (id) => {
    const flag = confirm('Are you sure to delete!')
    if (flag) {
        const promise = services.deletePrd(id)
            .then((data) => {
                getProductList()
            })

            .catch((error) => {
                console.log("error: ", error);
            })
    }
}

// Update Product
const updateProduct = (id) => {
    const product = getDataFromForm()
    if (product) {
        const promise = services.editPrd(id, product)
            .then((data) => {
                getProductList()
            })

            .catch((error) => {
                console.log("error: ", error);
            })
        cancelFunct()
    }
}

// Search product
getElmntId('search').onkeyup = function () {
    var valueSearch = getElmntId('search').value
    var valueSearchLowerCase = valueSearch.toLowerCase()

    let productList
    let productListSearch = []
    let promise = services.getPrd()

    promise.then((data) => {
        let filtCon = getElmntId('filter').value
        let sortCon = getElmntId('sortByPrice').value

        let productList = productFilterSort(filtCon, sortCon, data.data)

        // Duyệt mảng 
        for (let i = 0; i < productList.length; i++) {
            let product = productList[i]
            var productName = product.name.toLowerCase()
            if (productName.indexOf(valueSearchLowerCase) !== -1) {
                productListSearch.push(product)
            }
        }
        renderProductList(productListSearch)

    })

        .catch((error) => {
            console.log("error: ", error);
        })

}

// Process product list by filter and sort

const productFilterSort = (filtCon, sortCon, productList) => {
    let arrFilter
    if (filtCon != 'all') {
        arrFilter = productList.filter((value) => value.type == filtCon)
    } else {
        arrFilter = productList
    }
    if (sortCon == 'low') {

        // A compare function that compares the age property of two objects
        function compareByAge(a, b) {
            return a.price - b.price;
        }

        // Sort the array by age in ascending order
        arrFilter.sort(compareByAge);
    }
    if (sortCon == 'high') {
        // A compare function that compares the age property of two objects
        function compareByAge(a, b) {
            return b.price - a.price;
        }

        // Sort the array by age in ascending order
        arrFilter.sort(compareByAge);
    }
    return arrFilter
}

// Action when selecting sort and filter
getElmntId('filter').onchange = () => {
    getElmntId('search').value = ''
    getProductList()
}

getElmntId('sortByPrice').onchange = () => {
    getElmntId('search').value = ''
    getProductList()
}