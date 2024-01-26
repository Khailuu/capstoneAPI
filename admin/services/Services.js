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
}