import { observable, action, toJS, asMap } from 'mobx';

import Store from 'stores/Store';
import endpoints from 'transport/endpoints';
import { getSetterName } from 'components/core/Utils';

/**
 *  Content genres store
 */
class ContentGenresStore extends Store {
    /** Content genres list */
    @observable
    genres = null;
    @observable
    subgenres = asMap();
    /** Custom data observable object */
    @observable
    data = [];

    /**
     * Set genre value
     * @param {Number} index - genre index
     * @param {String} value - genre value
     */
    @action
    setGenreValue(index, value) {
        this.data.length && this.data[index] && (this.data[index].genreId = value);
        this.data.length && this.data[index] && (this.data[index].subgenresId = null);
    }

    /**
     * Set subgenres value
     * @param {Number} index - genre index
     * @param {Array} value - genre value
     */
    @action
    setSubgenresValue(index, value) {
        this.data[index].subgenresId = value;
    }

    /**
     * Add empty item to gentes list
     * @param {Objext} index - item template
     */
    @action
    addNewItem(item) {
        this.data.push(item);
    }

    /**
     * Removes item from gentes list
     * @param {Number} index - genre index
     */
    @action
    removeItem(index) {
        this.data.splice(index,1)
    }

    /**
     * Set genres
     * @param {Array} genres - list of genres
     */
    @action
    setGenres(genres) {
        this.genres = genres;
    }
    /**
     * Set subgenres
     * @param {Array} genreId - id of parent genre
     * @param {Array} subgenres - list of subgenres
     */
    @action
    setSubgenres(genreId, subgenres) {
        this.subgenres.set(genreId, subgenres);
    }
    /**
     * Adds observable to some object
     * @param {String} to - object to add observable to
     * @param {String} name - observable name
     * @param {String} val - initial value
     */
    addObservale(to, name, val) {
        this[to][name] = observable(val || null);
    }
    /**
     * Set data
     * @param {Array} data - list of genres
     */
    @action
    setRepeaterData(data) {
        this.data = data;
    }

    getRepeaterData() {
        return toJS(this.data);
    }
    /**
     * Fetch possible genres
     * @returns {Promise} a call api promise
     */
    fetchGenres() {
        return this.Transport.callApi(endpoints.GET_GENRES).then(res => {
            this.setGenres.call(this, res.data);
        });
    }
    /**
     * Fetch possible subgenres
     * @param {String} id - genre id
     * @returns {Promise} a call api promise
     */
    fetchSubgenres(id) {
        return this.Transport.callApi(endpoints.GET_SUBGENRES, null, [id]).
            then(res => {
                this.setSubgenres.call(this, id, res.data);
            });
    }

    /**
     * Retrieve normalized data object for the store
     * @returns {Object} normalized data
     */
    getData() {
        return this.data;
    }

    /**
     * Empties all props in data object
     */
    @action
    clearData() {
        this.data.splice(0, 2).map((value, key) => {
            this.setGenreValue(key, '');
        });
    }
}

export default ContentGenresStore;
