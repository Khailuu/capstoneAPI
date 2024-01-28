function Cart () {
    this.listCart = [];

    this.addCart = (product) => {
        this.listCart.push(product);
    }

    this.finđIndexProduct = (id) => {
        var index = -1; 
        for(var i = 0; i<this.listCart.length; i++){
            if(id === this.listCart[i].id){
                index = i;
                break;
            }
        }
        if(index !== -1) {
            return index;
        }
        else return undefined;
    }

    this.deleteProductCart = (id, count) => {
        var index = this.finđIndexProduct(id);

        if(index !== -1){
            this.listCart.splice(index, 1);
            count--;
        }
        console.log(count);
        return count;
    }
}