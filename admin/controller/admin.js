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
// render Product List
const renderProductList = (productList) => {
    let htmlContent =''
    
    for( let i = 0; i < productList.length; i++){
        let prd = productList[i]
        htmlContent += `
        <tr>
            <td>${prd.id}</td>
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
            <button id="btnCapNhat" type="button" class="btn btn-success m-1" onclick='' data-toggle="modal" data-target="#myModal"><i class="fa fa-edit"></i></button>
            <button id="btnXoa" type="button" class="btn btn-danger m-1" data-dismiss="modal" onclick=''><i class="fa fa-trash"></i></button>
            </td>
        </tr>
        `
    }
    console.log("htmlContent: ", htmlContent);
    getElmntId('tblDanhSachSP').innerHTML = htmlContent
}