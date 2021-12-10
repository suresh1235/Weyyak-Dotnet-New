/** The application routes definition */
export default {
    ROOT: '/',
    NOT_FOUND: '*',
    LOGIN: '/login',
    LOGOUT: '/logout',
    RESET_PASSWORD: '/reset-password',
    PASSWORD: '/password',
    USERS: '/users',
    DEVICES: '/devices',
    EDITORS: '/editors',
    ONE_TIER_CONTENT: '/one-tier-content',
    EDIT_ONE_TIER_CONTENT: '/one-tier-content/:contentId',
    ADD_VARIANCE: '/one-tier-content/:contentId/variance/add',
    EDIT_VARIANCE: '/one-tier-content/:contentId/variance/:varianceId',
    MANAGE_CONTENT: '/manage-content',
    MULTI_TIER_CONTENT_TITLE: '/multi-tier-content-title',
    EDIT_TITLE: '/multi-tier-content-title/:contentId/editTitle',
    MULTI_TIER_CONTENT_SEASON: '/multi-tier-content-season',
    MULTI_TIER_CONTENT_SEASON_VARIANCE: '/multi-tier-content-season/variance',
    ADD_SEASON: '/multi-tier-content-season/:contentId',
    EDIT_SEASON: '/multi-tier-content-season/:seasonId/editSeason',
    EDIT_SEASON_VARIANCE:'/multi-tier-content-season/:seasonId/seasonvariance',
    MULTI_TIER_CONTENT_EPISODE: '/multi-tier-content-episode',
    ADD_EPISODE: '/multi-tier-content-episode/:contentId/season/:seasonId/addEpisode',
    EDIT_EPISODE: '/multi-tier-content-episode/:episodeId',
    SEARCH_DEMO: '/search-demo',
    PAGES_MANAGEMENT: '/pages-management',
    CREATE_PAGE: '/page',
    EDIT_PAGE: '/page/:pageId',
    PLAYLISTS_MANAGEMENT: '/playlists-management',
    CREATE_PLAYLIST: '/playlist',
    EDIT_PLAYLIST: '/playlist/:playlistId',
    SLIDERS_MANAGEMENT: '/sliders-management',
    CREATE_SLIDER: '/slider',
    EDIT_SLIDER: '/slider/:sliderId'
};
