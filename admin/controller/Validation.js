function Validation() {
    this.checkNull = (value, elementID, messageErr) => {
        if(value === ""){
            getEle(elementID).innerHTML= messageErr;
            return false;
        }
        getEle(elementID).innerHTML = "";
        return true;
    }

    this.checkPattern = (value, elementID, messageErr, pattern) => {
        if (value.match(pattern)) {
            getEle(elementID).innerHTML = "";
            return true;
          }
          getEle(elementID).innerHTML = messageErr;
          return false;
    }

    this.checkType = function(idTagSelect, elementID, messageErr){
        // console.log(getEle(`#${idTagSelect}`).selectedIndex);
        var selectedIndex = getEle(idTagSelect).selectedIndex;
        if(!selectedIndex) {
            getEle(elementID).innerHTML = messageErr;
            return false;
        }
        getEle(elementID).innerHTML = "";
        return true;
    }
}