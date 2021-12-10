import { observable, action } from 'mobx';
import Store from 'stores/Store';
import endpoints from 'transport/endpoints';
import { getSetterName } from 'components/core/Utils'

/**
 * The Product Name Store
 */
class PlanNameStore extends Store {

    //selected product names
    @observable
    planNames = [];

    //available plans
    @observable
    subscriptionPlans = [];

    /**
     * Set products value
     * @param {Array} products - products list
     */
    @action
    setSubscriptionPlans(subscriptionPlans) {
        console.log(subscriptionPlans);
        this.subscriptionPlans = subscriptionPlans;
    }

    /**
     * Set selected product names
     * @param {Array} planNames - selected product names list
     */
    @action
    setPlanNames(planNames) {
        this.planNames = planNames;
    }

    /**
     * Fetch products
     * @returns {Promise} a call api promise
     */
    fetchItemSubcriptionPlans() {
        return this.Transport.callApi(endpoints.PLANS)
            .then(subscriptionPlans => {
                subscriptionPlans  && this.setSubscriptionPlans(subscriptionPlans)
            });
    }

    /**
     * Empty selected product names
     */
    @action
    clear() {
        this.planNames = []
    }

    /**
     * Retrieve product names
     * @returns {Object} selected product names
     */
    getPlanNames() {
        return this.planNames;
    }
}

export default PlanNameStore;
