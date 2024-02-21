function Validation() {
    this.nullCheck = (data, elementId, errorMessage) => {
        if(!data.toString().length){
            getElmntId(elementId).innerHTML = errorMessage
            return false
        }
        getElmntId(elementId).innerHTML = ''
        return true
    }

    this.patternCheck = (data, pattern, elementId, errorMessage) => {
        if(!data.toString().match(pattern)){
            getElmntId(elementId).innerHTML = errorMessage
            return false
        }
        getElmntId(elementId).innerHTML = ''
        return true
    }

    this.checkSelect = (index, elementId, errorMessage) => {
        if(!index){
            getElmntId(elementId).innerHTML = errorMessage
            return false
        }
        getElmntId(elementId).innerHTML = ''
        return true
    }
}