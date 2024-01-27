function Services () {
    this.baseUrl = "https://65afb8932f26c3f2139b97b2.mockapi.io/Products";

    this.getPrd = () => {
        return axios({
            url: this.baseUrl,
            method: "GET"
        })
    }

    this.getPrdId = (prdID) => {
        return axios({
            url: `${this.baseUrl}/${prdID}`,
            method: "GET"
        })
    }

    this.addPrd = (payLoad) => {
        return axios({
            url: this.baseUrl,
            method: "POST",
            data: payLoad,
        })
    }

    this.deletePrd = (prdID) => {
        return axios({
            url: `${this.baseUrl}/${prdID}`,
            method: "DELETE",
        })
    }

    this.getPrdDetailById = (prdID) => {
        return axios({
            url: `${this.baseUrl}/${prdID}`,
            method: "GET",
        })
    }

    this.editPrd = (prdID, payLoad) => {
        return axios({
            url: `${this.baseUrl}/${prdID}`,
            method: "PUT",
            data: payLoad
        })
    }
}