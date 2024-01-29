function Validation() {
  this.checkNull = (value, elementID, messageErr) => {
    if (value === "") {
      getEle(elementID).innerHTML = messageErr;
      return false;
    }
    getEle(elementID).innerHTML = "";
    return true;
  };

  this.checkPattern = (value, elementID, messageErr, pattern) => {
    if (value.match(pattern)) {
      getEle(elementID).innerHTML = "";
      return true;
    }
    getEle(elementID).innerHTML = messageErr;
    return false;
  };

  this.checkType = function (idTagSelect, elementID, messageErr) {
    var selectedIndex = getEle(idTagSelect).selectedIndex;
    if (!selectedIndex) {
      getEle(elementID).innerHTML = messageErr;
      return false;
    }
    getEle(elementID).innerHTML = "";
    return true;
  };

  
  this.checkNameExist = (value, productList, elementID, messageErr) => {
    
    var index = -1;
    for (var i = 0; i < productList.length; i++) {
        console.log(productList[i].name.trim().replace(/\s+/g, '').toLowerCase());
        console.log(value);
      if (productList[i].name.trim().replace(/\s+/g, '').toLowerCase() === value.trim().replace(/\s+/g, '').toLowerCase()) {
        index = i;
        break;
      }
    }

    if (index === -1) {
      getEle(elementID).innerHTML = "";
      return true;
    }
    getEle(elementID).innerHTML = messageErr;
    return false;
  };
}
