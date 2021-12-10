import { observable, action, isObservableArray } from 'mobx';

import Store from 'stores/Store';
import endpoints from 'transport/endpoints';
import { getSetterName } from 'components/core/Utils';

/**
 * The Music store
 */
class MusicStore extends Store {
    /** Content singers */
    @observable
    singersList = null;

    /** Content musicComposers */
    @observable
    musicComposersList = null;

    /** Content songWriters */
    @observable
    songWritersList = null;

    /** Custom data observable object */
    @observable
    data = {
        singers: [],
        musicComposers: [],
        songWriters: [],
    };

    /**
     * Set music data object
     * @param {Object} music
     */
    @action
    setData(music) {
        this.data = music;
    }

    /**
     * Set singers
     * @param {Array} singers - list of singers
     */
    @action
    setSingersList(singers) {
        this.singersList = singers;
    }

    /**
     * Set musicComposers
     * @param {Array} musicComposers - list of musicComposers
     */
    @action
    setMusicComposersList(musicComposers) {
        this.musicComposersList = musicComposers;
    }

    /**
     * Set songWriters
     * @param {Array} songWriters - list of song writers
     */
    @action
    setSongWritersList(songWriters) {
        this.songWritersList = songWriters;
    }

    /**
     * Set data singer
     * @param {Array} singers - list of singers
     */
    @action
    setSingers(singers) {
        this.data.singers = singers.map(singer => singer.value);
    }

    /**
     * Set data musicComposer
     * @param {Array} musicComposers - list of music composers
     */
    @action
    setMusicComposers(musicComposers) {
        this.data.musicComposers = musicComposers.map(musicComposer => musicComposer.value);
    }

    /**
     * Set data songWriters
     * @param {Array} songWriters - list of songWriters
     */
    @action
    setSongWriters(songWriters) {
        this.data.songWriters = songWriters.map(songWriter => songWriter.value);
    }

    /**
     * Fetch singers
     * @returns {Promise} a call api promise
     */
    fetchSingers() {
        return this.Transport.callApi(endpoints.GET_SINGERS).then(res => {
            this.setSingersList.call(this, res.data);
        });
    }

    /**
     * Fetch music composers
     * @returns {Promise} a call api promise
     */
    fetchMusicComposers() {
        return this.Transport.callApi(endpoints.GET_MUSIC_COMPOSERS).then(res => {
            this.setMusicComposersList.call(this, res.data);
        });
    }

    /**
     * Fetch song writers
     * @returns {Promise} a call api promise
     */
    fetchSongWriters() {
        return this.Transport.callApi(endpoints.GET_SONG_WRITERS).then(res => {
            this.setSongWritersList.call(this, res.data);
        });
    }

    /**
     * Create new singer
     * @param {Object} singerData - singer data object
     * @returns {Promise} a call api promise
     */
    createSinger(singerData) {
        return this.Transport.callApi(endpoints.CREATE_SINGER, singerData).then(this.fetchSingers.bind(this));
    }

    /**
     * Create new music composer
     * @param {Object} mcData - music composer data object
     * @returns {Promise} a call api promise
     */
    createMusicComposer(mcData) {
        return this.Transport.callApi(endpoints.CREATE_MUSIC_COMPOSER, mcData)
            .then(this.fetchMusicComposers.bind(this));
    }

    /**
     * Create song writer
     * @param {Object} songWriterData - song writer data object
     * @returns {Promise} a call api promise
     */
    createSongWriter(songWriterData) {
        return this.Transport.callApi(endpoints.CREATE_SONG_WRITER, songWriterData)
            .then(this.fetchSongWriters.bind(this));
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
    clearData() {
        Object.keys(this.data).forEach((prop)=>{
            this[getSetterName(prop)]([]);
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

export default MusicStore;
