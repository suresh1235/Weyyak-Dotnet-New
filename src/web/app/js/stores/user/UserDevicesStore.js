import Store from 'stores/Store';
import endpoints from 'transport/endpoints';

/**
 * The user's devices store
 */
class UserDevicesStore extends Store {

    /** The user's devices */
    userDevices = null;

    /**
     * Get a user's devices
     * @returns {Number} user's devices
     */
    get UserDevices() {
        return this.userDevices;
    }

    /**
     * Set a user's devices
     * @param {Number} userDevices - user's devices to be set
     */
    setUserDevices(userDevices) {
        this.userDevices = userDevices.data;
    }

    /**
     * Fetch an amount of user's devices
     * @returns {Promise} a call api promise
     */
    fetchUserDevices() {
        return this.Transport.callApi(endpoints.GET_USER_DEVICES).then(this.setUserDevices.bind(this));
    }

    /**
     * Update an amount of user's devices
     * @param {Number} devices - an amount of user's devices to be set
     * @returns {Promise} a call api promise
     */
    updateUserDevices(devices) {
        return this.Transport.callApi(endpoints.UPDATE_USER_DEVICES, { userDevicesLimit: devices }).
            then(this.setUserDevices.bind(this, { data: devices }));
    }
}

export default UserDevicesStore;