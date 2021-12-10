import { observable, action } from 'mobx';
import Store from 'stores/Store';
import endpoints from 'transport/endpoints';
import { getSetterName } from 'components/core/Utils'

/**
 * The Product Name Store
 */
class ProductNameStore extends Store {

    //selected product names
    @observable
    productNames = [];

    //available products
    @observable
    products = null;

    /**
     * Set products value
     * @param {Array} products - products list
     */
    @action
    setProducts(products) {
        this.products = products;
    }

    /**
     * Set selected product names
     * @param {Array} productNames - selected product names list
     */
    @action
    setProductNames(productNames) {
        this.productNames = productNames;
    }

    /**
     * Fetch products
     * @returns {Promise} a call api promise
     */
    fetchItemProducts() {
        return this.Transport.callApi(endpoints.GET_PRODUCTS)
            .then(products => {
                products && products.data && this.setProducts(products.data)
            });
    }

    /**
     * Empty selected product names
     */
    @action
    clear() {
        this.productNames = []
    }

    /**
     * Retrieve product names
     * @returns {Object} selected product names
     */
    getProductNames() {
        return this.productNames;
    }
}

export default ProductNameStore;
