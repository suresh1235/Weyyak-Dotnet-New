import {observable, action, isObservableArray} from 'mobx';

import Store from 'stores/Store';
import endpoints from 'transport/endpoints';
import { getSetterName } from 'components/core/Utils';

/**
 * The Cast store.
 */
class CastStore extends Store {
    /** Content actors */
    @observable
    actorsList = null;

    /** Content writers */
    @observable
    writersList = null;

    /** Content directors */
    @observable
    directorsList = null;

    /** Custom data observable object */
    @observable
    data = {
        mainActorId: '',
        mainActressId: '',
        actors: [],
        writers: [],
        directors: []
    };

    /**
     * Set cast data object
     * @param {Object} cast
     */
    @action
    setData(cast) {
        this.data = cast;
    }

    /**
     * Set actors
     * @param {Array} actors - list of actors
     */
    @action
    setActorsList(actors) {
        this.actorsList = actors;
    }

    /**
     * Set writers
     * @param {Array} writers - list of writers
     */
    @action
    setWritersList(writers) {
        this.writersList = writers;
    }

    /**
     * Set directors
     * @param {Array} directors - list of directors
     */
    @action
    setDirectorsList(directors) {
        this.directorsList = directors;
    }

    /**
     * Set data main actor
     * @param {String} actor - actor
     */
    @action
    setMainActorId(actor) {
        this.data.mainActorId = actor ? actor.value : '';
    }

    /**
     * Set data main actress
     * @param {Object} actress - actress
     */
    @action
    setMainActressId(actress) {
        (actress && actress.value) &&
            (this.data.mainActorId = this.data.mainActorId ? this.data.mainActorId : ' ');
        this.data.mainActressId = (actress && actress.value) ? actress.value : '';
    }

    /**
     * Set data actors
     * @param {Array} actors - list of actors
     */
    @action
    setActors(actors) {
        this.data.actors = actors.map(actor => actor.value);
    }

    /**
     * Set data writer
     * @param {Array} writers - list of writers
     */
    @action
    setWriters(writers) {
        this.data.writers = writers.map(writer => writer.value);
    }

    /**
     * Set data directors
     * @param {Array} directors - list of directors
     */
    @action
    setDirectors(directors) {
        this.data.directors = directors.map(director => director.value);
    }

    /**
     * Fetch actors
     * @returns {Promise} a call api promise
     */
    fetchActors() {
        return this.Transport.callApi(endpoints.GET_ACTORS).then(res => {
            this.setActorsList.call(this, res.data);
        });
    }

    /**
     * Fetch writers
     * @returns {Promise} a call api promise
     */
    fetchWriters() {
        return this.Transport.callApi(endpoints.GET_WRITERS).then(res => {
            this.setWritersList.call(this, res.data);
        });
    }

    /**
     * Fetch directors
     * @returns {Promise} a call api promise
     */
    fetchDirectors() {
        return this.Transport.callApi(endpoints.GET_DIRECTORS).then(res => {
            this.setDirectorsList.call(this, res.data);
        });
    }

    /**
     * Create new actor
     * @param {Object} actorData - actor data object
     * @returns {Promise} a call api promise
     */
    createActor(actorData) {
        return this.Transport.callApi(endpoints.CREATE_ACTOR, actorData).then(this.fetchActors.bind(this));
    }

    /**
     * Create new writer
     * @param {Object} writerData - writer data object
     * @returns {Promise} a call api promise
     */
    createWriter(writerData) {
        return this.Transport.callApi(endpoints.CREATE_WRITER, writerData).then(this.fetchWriters.bind(this));
    }

    /**
     * Create new writer
     * @param {Object} directorData - director data object
     * @returns {Promise} a call api promise
     */
    createDirector(directorData) {
        return this.Transport.callApi(endpoints.CREATE_DIRECTOR, directorData).then(this.fetchDirectors.bind(this));
    }

    /**
     * Retrieve normalized data object for the store
     * @returns {Object} normalized data
     */
    @action
    getData() {
        this.data.mainActorId = this.data.mainActorId && this.data.mainActorId.replace(' ', '');
        return this.data;
    }

    /**
     * Empties all props in data object
     */
    clearData() {
        Object.keys(this.data).forEach((prop)=>{
            if (typeof(this.data[prop]) == 'object') {
                this[getSetterName(prop)]([]);
            } else {
                this[getSetterName(prop)]('');
            }
        });
    }

    /**
     * Gets store property
     *
     * @param key
     * @returns {*}
     */
    getStoreProperty(key) {
        const property = this.hasOwnProperty(key) ? this[key] : this.data[key];

        return isObservableArray(property) ? property.peek() : property;
    }
}

export default CastStore;
