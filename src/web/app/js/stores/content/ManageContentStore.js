import { observable, action } from 'mobx';
import Store from 'stores/Store';
import endpoints from 'transport/endpoints';
import constants from 'constants/constants';
import { getTranslation, buildFullName, buildFullSeasonName } from 'components/core/Utils';

/**
 * The Manage Content store.
 */
class ManageContentStore extends Store {
    @observable
    contentData = {};
    digitalRightsTypes = [];
    digitalRightsRegions = [];
    parentStatuses = [];

    /**
     * Converts multilevel arrays into one-level arrays
     * Sets manage content grid data
     * @param {Object} manageContentData - manage content grid data.
     */
    @action
    setManageContentGrid(manageContentData) {
        if (!manageContentData) {
            this.contentData = null;
            return;
        }
        const {pagination, data} = manageContentData;
        const formattedManageContentData = {};
        const flattenContentData = [];

        formattedManageContentData.pagination = pagination;
        formattedManageContentData.data = flattenContentData;

        data && data.forEach(item => {
            if (item.type === constants.CONTENT.TIERS.ONE_TIER.ID) {
                const flatContent = this.getOTCFlatContent(item);
                flattenContentData.push(flatContent);
                flatContent.expanded && flattenContentData.push(...flatContent.children);
            } else {
                const flatContent = this.getMTCFlatContent(item);
                flattenContentData.push(flatContent);
            }
        });

        this.contentData = formattedManageContentData;
    }

    /**
     * Update content by id
     * @param {String} contentId - content id
     * @param {Object} newContent - new content item
     */
    @action
    updateContentById(contentId, newContent) {
        const data = this.contentData.data;
        let contentIndex = data.findIndex(item => item.id === contentId);

        if (contentIndex > -1 && newContent.type === constants.CONTENT.TIERS.ONE_TIER.ID) {
            const newFlatContent = this.getOTCFlatContent(newContent);

            newFlatContent.expanded = data[contentIndex].expanded;
            data.splice(contentIndex, 1, newFlatContent);

            const children = newFlatContent.children;
            newFlatContent.expanded && data.splice(contentIndex + 1, children.length, ...newFlatContent.children);
        }

        if (contentIndex > -1 && newContent.type === constants.CONTENT.TIERS.MULTI_TIER.ID) {
            const newFlatContent = this.getMTCFlatContent(newContent);

            newFlatContent.expanded = data[contentIndex].expanded;
            data.splice(contentIndex, 1, newFlatContent);

            newFlatContent.expanded && newFlatContent.children.forEach(season => {
                contentIndex = contentIndex + 1;
                season.expanded = data[contentIndex].expanded;
                data.splice(contentIndex, 1, season);
                season.expanded && season.children.forEach(episode => {
                    contentIndex = contentIndex + 1;
                    data.splice(contentIndex, 1, episode);
                });
            });
        }
    }

    /**
     * Shows or hides child rows.
     * @param {Object} item - current row data.
     */
    @action
    toggleExpand(item) {
        let {data} = this.contentData;

        item.expanded = !item.expanded;
        const currentContentIndex = data.indexOf(item);
        const nextContentIndex = currentContentIndex + 1;

        if (item.expanded) {
            data.splice(nextContentIndex, 0, ...item.children);
        } else {
            let nextSameLevelIndex = this.getSameLevelContentIndex(data, item.level, currentContentIndex);
            const childrenCount =  nextSameLevelIndex !== -1 ?
                nextSameLevelIndex - nextContentIndex
                : item.level == 0
                    ? data.length - currentContentIndex - 1
                    : data[currentContentIndex].children.length;
            this.collapseContent(item);
            data.splice(nextContentIndex, childrenCount);
        }
    }

    /**
     * Set rights type
     * @param {Object} content - content object
     * @param {Number} value - rights type value
     */
    @action
    setRightsType(content, value) {
        content.rights.digitalRightsType = value;
    }

    /**
     * Sets digital types
     * @param {Object} response - digital types data.
     */
    @action
    setDigitalRightsTypes(response) {
        this.digitalRightsTypes = response.data;
    }

    /**
     * Sets digital regions
     * @param {Object} response - digital regions data.
     */
    @action
    setDigitalRightsRegions(response) {
        this.digitalRightsRegions = response.data;
    }

    /**
     * Sets parent statuses
     * @param {Object} response - digital regions data.
     */
    @action
    setParentStatuses(response) {
        this.parentStatuses = response.data;
    }

    /**
     * Delete variance
     * @param {String} contentId - content id
     */
    @action
    deleteContent(contentId) {
        const data = this.contentData.data;

        data.filter(item => item.id === contentId ||
                           (item.level === 1 && item.parent.id === contentId) ||
                           (item.level === 2 && item.parent.parent.id === contentId))
            .forEach(item => {
           data.splice(data.indexOf(item), 1);
        });
    }

    /**
     * Delete variance
     * @param {String} varianceId - variance id
     */
    @action
    deleteVariance(contentId, varianceId) {
        const data = this.contentData.data;

        const variance = data.find(item => item.level === 1 && item.id === varianceId);
        const content = data.find(item => item.level === 0 && item.id === contentId);
        data.splice(data.indexOf(variance), 1);

        const varianceIndex = content.children.findIndex(item => item.id === varianceId);
        content.children.splice(varianceIndex, 1);
    }

     /**
     * Delete season from data
     * @param {String} contentId - content id
     * @param {String} seasonId - season id
     */
    @action
    deleteSeason(contentId, seasonId) {
        const data = this.contentData.data;
        const content = data.find(item => item.level === 0 && item.id === contentId);

        data.filter(item => item.level === 1 && item.id === seasonId ||
                            item.level === 2 && item.parent.id === seasonId)
            .forEach(item => {
                data.splice(data.indexOf(item), 1);
            });

        const seasonIndex = content.children.findIndex(item => item.id === seasonId);
        content.children.splice(seasonIndex, 1);
    }

    /**
     * Delete episode from data
     * @param {String} seasonId - content id
     * @param {String} seasonId - season id
     * @param {String} episodeId - episode id
     */
    @action
    deleteEpisode(contentId, seasonId, episodeId) {
        const data = this.contentData.data;

        const content = data.find(item => item.level === 0 && item.id === contentId);
        const season = data.find(item => item.level === 1 && item.id === seasonId);
        const episode = data.find(item => item.level === 2 && item.id === episodeId);

        data.splice(data.indexOf(episode), 1);

        const seasonInContent = content.children.find(item => item.id === seasonId);
        const episodeIndex = seasonInContent.children.findIndex(item => item.id === episodeId);
        seasonInContent.children.splice(episodeIndex, 1);

        const episodeIndexInSeason = season.children.findIndex(item => item.id === episodeId);
        season.children.splice(episodeIndexInSeason, 1);
    }

    /**
     * Collapse content
     * @param {Object} item - item to collapse
     */
    collapseContent(item) {
        const { level, children } = item;
        level === 0 && children && children.forEach(child => child.expanded = false);
    }

    /**
     * Get content index with the same level
     * @param {Array} data - content data array
     * @param {Number} level - content level
     * @param {Number} currentContentIndex - content index
     * @returns {number} content index with the same level
     */
    getSameLevelContentIndex(data, level, currentContentIndex) {
        let nextSameLevelIndex = -1;
        for (let index = ++currentContentIndex; index < data.length; index++ ) {

            let hasCommonParent = level === 0 ||
                                         (data[index].level !== 0 && data[index].parent.id === data[currentContentIndex].parent.id);

            if (hasCommonParent && data[index].level === level)  {
                nextSameLevelIndex = index;
                break;
            }
        }
        return nextSameLevelIndex;
    }

    /**
     * Create root flat content
     * @param {Object} content - content item
     * @returns {Object} root flat content
     */
    createRootFlatContent(content) {
        const { id, createdBy, status, statusCanBeChanged, subStatusName, transliteratedTitle, type } = content;
        return {
            level: 0,
            expanded: false,
            contentTitle: transliteratedTitle,
            id,
            createdBy,
            status,
            statusCanBeChanged,
            subStatusName,
            transliteratedTitle,
            type,
            children: null
        };
    }

    /**
     * Get flat one tier content content
     * @param {Object} item - content item
     * @returns {Object} flat content item
     */
    getOTCFlatContent(item) {
        const content = this.createRootFlatContent(item);
        content.children = this.getFlatVariance(item.contentVariances, content);
        return content;
    }

    /**
     * Get flat multi tier content content
     * @param {Object} item - content item
     * @returns {Object} flat content item
     */
    getMTCFlatContent(item) {
        const content = this.createRootFlatContent(item);
        content.children = this.getFlatSeasons(item.contentSeasons, content);
        return content;
    }

    /**
     * Get content title
     * @param {Object} item - content item
     * @param (Object) child - child content
     * @returns {string} content title
     */
    getContentTitle(item, child) {
        return `${item.transliteratedTitle}` + `_` + `${child.digitalRightsType == 1?"A":"S"}` +
        `${child.dubbingLanguage ? `_D${child.dubbingLanguage.charAt(0).toUpperCase()}` : ''}` +
        `${child.subtitlingLanguage ? `_S${child.subtitlingLanguage.charAt(0).toUpperCase()}` : ''}`
    }

    /**
     * Get season content title
     * @param {Object} season - season
     * @returns {String} season content title
     */
    getSeasonContentTitle(season) {
        const { primaryInfo, translation, rights } = season;
        return buildFullSeasonName(primaryInfo, translation, rights);
    }

    /**
     * Get episode content title
     * @param {Object} season - season
     * @param {Object} episode - season's episode
     * @returns {String} episode content title
     */
    getEpisodeContentTitle(season, episode) {
        const { primaryInfo: { seasonNumber }, translation } = season;
        const { primaryInfo: { number, transliteratedTitle } } = episode;
        return `${transliteratedTitle}_${seasonNumber}${getTranslation(translation)}_${number}`;
    }

    /**
     * Get flat seasons
     * @param {Array} seasons - seasons
     * @param {Object} parent - seasons's parent content
     * @returns {Array} flat seasons
     */
    getFlatSeasons(seasons, parent) {
        return seasons.map(season => {
            const content = Object.assign({
                parent: parent,
                level: parent.level + 1,
                type: parent.type,
                expanded: false,
                episodes: null,
                contentTitle: this.getSeasonContentTitle(season)
            }, season);
            content.children = this.getEpisodeChildren(season.episodes, content);
            return content;
        });
    }

    /**
     * Get flat variances
     * @param {Array} variances - variances
     * @param {Object} parent - variance's parent content
     * @returns {Array} flat variances
     */
    getFlatVariance(variances, parent) {
        return variances.map(child => {
            const { id, createdBy, digitalRightsEndDate, digitalRightsStartDate, digitalRightsType, dubbingDialectId,
                dubbingLanguage, schedulingDateTime, status, statusCanBeChanged, subStatusName, subtitlingLanguage
            } = child;
            return {
                id,
                parent: parent,
                level: parent.level + 1,
                type: parent.type,
                createdBy,
                rights: {
                    digitalRightsEndDate,
                    digitalRightsStartDate,
                    digitalRightsType,
                },
                dubbingDialectId,
                dubbingLanguage,
                schedulingDateTime,
                status,
                statusCanBeChanged,
                subStatusName,
                subtitlingLanguage,
                contentTitle: this.getContentTitle(parent, child)
            };
        });
    }

    /**
     * Get flat Episode children
     * @param {Array} episodes - episodes
     * @param {Object} parent - episode's parent content
     * @returns {Array} flat episodes
     */
    getEpisodeChildren(episodes, parent) {
        return episodes.map(episode => (
            Object.assign({
                parent: parent,
                level: parent.level + 1,
                type: parent.type,
                contentTitle: this.getEpisodeContentTitle(parent, episode)
            }, episode)));
    }

    /**
     * @param {String} contentId
     * @returns {Promise} - a call api promise
     */
    fetchDeleteContent(contentId) {
        return this.Transport.callApi(endpoints.DELETE_ONE_TIER_CONTENT, null, [contentId])
            .then(this.deleteContent.bind(this, contentId));
    }

    /**
     * Delete variance
     * @param {String} contentId - content id
     * @param {String} varianceId - variance id
     * @returns {Promise} - a call api promise
     */
    @action
    fetchDeleteVariance(contentId, varianceId) {
        return this.Transport.callApi(endpoints.VARIANCES.DELETE_ITEM, null, [varianceId])
            .then(this.deleteVariance.bind(this, contentId, varianceId));
    }

    /**
     * @param {String} contentId
     * @returns {Promise} - a call api promise
     */
    fetchDeleteMultiTierContent(contentId) {
        return this.Transport.callApi(endpoints.DELETE_MULTI_TIER_CONTENT, null, [contentId])
            .then(this.deleteContent.bind(this, contentId));
    }

    /**
     * @param {String} contentId
     * @param {String} seasonId
     * @returns {Promise} - a call api promise
     */
    fetchDeleteSeason(contentId, seasonId) {
        return this.Transport.callApi(endpoints.SEASONS.DELETE_ITEM, null, [seasonId])
            .then(this.deleteSeason.bind(this, contentId, seasonId));
    }

    /**
     * @param {String} contentId
     * @param {String} seasonId
     * @param {String} episodeId
     * @returns {Promise} - a call api promise
     */
    fetchDeleteEpisode(contentId, seasonId, episodeId) {
        return this.Transport.callApi(endpoints.EPISODES.DELETE_ITEM, null, [episodeId])
            .then(this.deleteEpisode.bind(this, contentId, seasonId, episodeId));
    }

    /**
     * Fetch update variance status
     * @param {String} contentId - content id
     * @param {String} varianceId - variance id
     * @param {String} status - status
     */
    fetchUpdateStatus(contentId, itemId, status, enpoint) {
        return this.Transport.callApi(enpoint, null, [itemId, status])
            .then(() => {
                return this.Transport.callApi(endpoints.GET_MANAGE_CONTENT, null, {
                    id: contentId,
                    offset: 0,
                    limit: 1,
                })
            })
            .then(content => {
                content && content.data && content.data.length && this.updateContentById(contentId, content.data[0]);
            })
    }

    /**
     * Fetch manage content data.
     * @returns {Promise} a call api promise
     */
    fetchManageContentData(params) {
        this.setManageContentGrid(null);
        return this.Transport.callApi(endpoints.GET_MANAGE_CONTENT, null, params).then(res => {
            this.setManageContentGrid(res);
        });
    }

    /**
     * Fetch rights type.
     * @returns {Promise} a call api promise
     */
    fetchDigitalRightsTypes() {
        return this.Transport.callApi(endpoints.GET_DIGITAL_RIGHTS_TYPES)
            .then(this.setDigitalRightsTypes.bind(this));
    }

    /**
     * Fetch rights regions.
     * @returns {Promise} a call api promise
     */
    fetchDigitalRightsRegions() {
        return this.Transport.callApi(endpoints.GET_DIGITAL_RIGHTS_REGIONS)
            .then(this.setDigitalRightsRegions.bind(this));
    }

    /**
     * Fetch parent statuses.
     * @returns {Promise} a call api promise
     */
    fetchParentStatuses() {
        return this.Transport.callApi(endpoints.GET_CONTENT_PARENT_STATUSES)
            .then(this.setParentStatuses.bind(this));
    }

    /**
     * Update content item digital rights type
     * @param {String} id
     * @param {String} level
     * @param {Number} value
     */
    fetchUpdateDigitalRightsType(item, value) {
        let itemType = this.getItemType(item);
        return this.Transport.callApi(endpoints[itemType].UPDATE_RIGHTS_TYPE, null, [item.id, value]);
    }


    getItemType(item) {
        return item && item.type && item.level === 1 &&
               item.type === constants.CONTENT.TIERS.ONE_TIER.ID ?
               'VARIANCES' :
               'SEASONS';
    }

    /**
     * Get content data
     * @returns {Object} content data
     */
    getData() {
        return this.contentData;
    }
}

export default ManageContentStore;
