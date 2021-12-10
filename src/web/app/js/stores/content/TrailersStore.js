import { observable, action, toJS, asMap } from 'mobx';
import Store from 'stores/Store';
import endpoints from 'transport/endpoints';
import constants from 'constants/constants';
import { getSetterName } from 'components/core/Utils';

/**
 *  Content Trailer store
 */
class TrailersStore extends Store {
  
    /** Custom data observable object */
    @observable
    data = [{
            englishTitle: '',
            arabicTitle: '',
            videoTrailerId: '',
            trailerposterImage: ''
        }]

     /**
     * Trailer Image uploading visual indicator
     */
    @observable
    TrailerPosterUploadStatus =[{
        trailerposterImage: '',
        }
    ]
    /**
     * Image metadata for request
     */
    TrailerMetadataMap = {
        trailerposterImage: 'trailer-poster-image'
    };    

        
    /**
     * Retrieve normalized data object for the store
     * @returns {Object} normalized data
     */
    @action
    getData() {
        return this.data;
    }

    @action
    setData(TrailerNum,TrailerKey,value){
        this.data[TrailerNum][TrailerKey] = value;
    }

 

    /**
     * Add empty item to trailers list
     * @param {Objext} index - item template
     */
    @action
    addNewTrailer(item) {
        let template = {
            englishTitle: '',
            arabicTitle: '',
            videoTrailerId: '',
            trailerposterImage: ''
        }

        let TrailerStatusTemplate = {
            trailerposterImage: '',
        }

        this.data.push(template);
        this.TrailerPosterUploadStatus.push(TrailerStatusTemplate);
    }
    

      /**
     * Removes item from trailers list
     * @param {Number} index - genre index
     */
    @action
    removeTrailerItem(index) {
        this.data.splice(index,1)
        this.TrailerPosterUploadStatus.splice(index,1);
    }


    
    hasMaxTrailerReached(index){
        return this.data.length === constants.CONTENT.VARIANCE_TRAILERS.MAX_AMOUNT;
    }

    /**
     * Checks whether min amount of variance Trailer was exceeded
     */
   
   hasMinTrailerExceeded(index){
        return this.data.length > constants.CONTENT.VARIANCE_TRAILERS.MIN_AMOUNT;
    }

     /**
     * Retrieve file upload status.
     * @returns {String} - file upload status.
     */
    getTrailerUploadStatus(TrailerNum) {
        // console.log(toJS(this.TrailerPosterUploadStatus))
        return toJS(this.TrailerPosterUploadStatus[TrailerNum]);
    }

    // Trailer related image upload Functions ...............

    /**
     * Uploads file to server.
     * @param {String} name - name of field.
     * @param {Object} file - file which will be uploaded to the server.
     */
    @action
    TrailerUpdateFile(TrailerNum, name, file) {
        this.Transport.callApi(endpoints.SAVE_NON_TEXTUAL_IMAGES, {
            file
        }, this.TrailerMetadataMap[name]).then(this.handleErrors)
            .then(response => {
                this.setTrailerUploadStatus(TrailerNum, name, 'success', response.data)
            })
            .catch(error => {
                this.setTrailerUploadStatus(TrailerNum, name, 'failed')
            });
    }

    /**
     * Change upload status.
     * @param {String} name - name of field.
     * @param {String} status - name of current status.
     * @param {Object} response - data from server.
     */
    @action
    setTrailerUploadStatus(trailerIndex, name, status, id) {
        this.data[trailerIndex][name] = id;
        this.TrailerPosterUploadStatus[trailerIndex][name] = status;
    }

    /**
     * Resets field.
     * @param {String} name - name of field.
     */
    @action
    resetTrailerField(trailerIndex, name) {
        this.data[trailerIndex][name] = '';
        this.setTrailerUploadStatus(trailerIndex, name, null)
    }

     /**
     * Error handler
     * @param {Object} response - response from the server.
     * @returns {Object} - response from the server..
     */
    handleErrors(response) {
        if (!response.data) {
            throw Error(response.statusText);
        }
        return response;
    }


    @action
    setRepeaterData(data,TrailerUploadStatus) {
        this.data = data;
        this.TrailerPosterUploadStatus = TrailerUploadStatus
    }

    getRepeaterData() {
        return toJS(this.data);
    }
 

    /**
     * Empties all props in data object
     */
    @action
    clearData() {
        this.data = [{
            englishTitle: '',
            arabicTitle: '',
            videoTrailerId: '',
            trailerposterImage: ''
        }]
    }
}

export default TrailersStore;

