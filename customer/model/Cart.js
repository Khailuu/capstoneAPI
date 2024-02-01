function Cart () {
    this.listCart = [];

    this.addCart = (product) => {
        this.listCart.push(product);
        console.log(this.listCart);
    }

    // this.finđIndexProduct = (id) => {
    //     var index = -1; 
    //     for(var i = 0; i<this.listCart.length; i++){
    //         if(id === this.listCart[i]){
    //             index = i;
    //             break;
    //         }
    //     }
    //     if(index !== -1) {
    //         return index;
    //     }
    //     else return undefined;
    // }

    this.deleteProductCart = (id) => {
        // var index = this.finđIndexProduct(id);   
        this.listCart.splice(id, 1);
    }
}