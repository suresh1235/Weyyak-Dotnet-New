import endpoints from 'transport/endpoints';
import { httpMethod } from './httpConstants';

/** The api calls details */
export default {
    [endpoints.AUTHENTICATE]: {
        url: '/api/oauth2/token',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'application/x-www-form-urlencoded'
            }),
            body: {
                grant_type: 'password'
            }
        }
    },
    [endpoints.CREATE_ONE_TIER_DRAFT]: {
        url: '/api/contents/onetier/draft',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.CREATE_ONE_TIER_PUBLISHED]: {
        url: '/api/contents/onetier/published',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.CREATE_MULTI_TIER_TITLE_PUBLISHED]: {
        url: '/api/contents/multitier/published',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.CREATE_MULTI_TIER_TITLE_DRAFT]: {
        url: '/api/contents/multitier/draft',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.CREATE_MULTI_TIER_SEASON_PUBLISHED]: {
        url: '/api/seasons/published',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.CREATE_MULTI_TIER_SEASON_DRAFT]: {
        url: '/api/seasons/draft',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.CREATE_MULTI_TIER_EPISODE_PUBLISHED]: {
        url: '/api/episodes/published',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.CREATE_MULTI_TIER_EPISODE_DRAFT]: {
        url: '/api/episodes/draft',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.RESET_PASSWORD_REQUEST]: {
        url: '/api/admin/reset_password_emails',
        settings: {
            method: httpMethod.PUT,
            headers: new Headers({
                'content-type': 'application/json'
            })
        }
    },
    [endpoints.UPDATE_PASSWORD_REQUEST]: {
        url: '/api/admin/password',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'application/json'
            })
        }
    },
    [endpoints.UPDATE_PASSWORD_FIRST_LOGIN]: {
        url: '/api/admin/password',
        settings: {
            method: httpMethod.PUT,
            headers: new Headers({
                'content-type': 'application/json'
            })
        }
    },
    [endpoints.INVALIDATE]: {
        url: '/api/oauth2/logout',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.GET_USERS_DETAILS]: {
        url: '/api/users?offset=0&limit=50',
        private: true
    },
    [endpoints.GET_USERS_FILTERS]: {
        url: '/api/users/filters',
        private: true
    },
    [endpoints.GET_GENRES]: {
        url: '/api/genres',
        private: true
    },
    [endpoints.GET_SUBGENRES]: {
        url: '/api/genres/{0}/subgenres',
        private: true
    },
    [endpoints.GET_DIALECTS]: {
        url: '/api/languages/{0}/dialects',
        private: true
    },
    [endpoints.GET_DUBBING]: {
        url: '/api/languages/dubbing',
        private: true
    },
    [endpoints.GET_SUBTITLING]: {
        url: '/api/languages/subtitling',
        private: true
    },
    [endpoints.GET_DIGITAL_RIGHTS_TYPES]: {
        url: '/api/content/digitalrights/types',
        private: true
    },
    [endpoints.GET_DIGITAL_RIGHTS_REGIONS]: {
        url: '/api/content/digitalrights/regions/all',
        private: true
    },
    [endpoints.GET_PRODUCTS]: {
        url: '/api/content/productnames',
        private: true
    },
    [endpoints.GET_ONE_TIER_CONTENT_TYPES]: {
        url: '/api/contenttypes/onetier',
        private: true
    },
    [endpoints.GET_MULTI_TIER_CONTENT_TYPES]: {
        url: '/api/contenttypes/multitier',
        private: true
    },
    [endpoints.GET_MULTI_TIER_CONTENT_TITLES]: {
        url: '/api/contents/multitier/titles',
        private: true
    },
    [endpoints.GET_MULTI_TIER_CONTENT_TITLE]: {
        url: '/api/contents/multitier/{0}',
        private: true
    },
    [endpoints.GET_ONE_TIER_CONTENT]: {
        url: '/api/contents/onetier/{0}',
        private: true
    },
    [endpoints.DELETE_ONE_TIER_CONTENT]: {
        url: '/api/contents/onetier/{0}',
        settings: {
            method: httpMethod.DELETE,
        },
        private: true
    },
    [endpoints.VARIANCES.DELETE_ITEM]: {
        url: '/api/contentvariances/{0}',
        settings: {
            method: httpMethod.DELETE,
        },
        private: true
    },
    [endpoints.DELETE_MULTI_TIER_CONTENT]: {
        url: '/api/contents/multitier/{0}',
        settings: {
            method: httpMethod.DELETE,
        },
        private: true
    },
    [endpoints.GET_DIGITAL_RIGHTS_TYPES]: {
        url: '/api/content/digitalrights/types',
        private: true
    },
    [endpoints.GET_DIGITAL_RIGHTS_REGIONS]: {
        url: '/api/content/digitalrights/regions/all',
        private: true
    },
    [endpoints.GET_LANGUAGES_ORIGINAL]: {
        url: '/api/languages/original',
        private: true
    },
    [endpoints.GET_LANGUAGES_ORIGIN_TYPES]: {
        url: '/api/languages/origintypes',
        private: true
    },
    [endpoints.GET_AGE_GROUPS]: {
        url: '/api/agegroups',
        private: true
    },
    [endpoints.GET_ACTORS]: {
        url: '/api/actors',
        private: true
    },
    [endpoints.GET_WRITERS]: {
        url: '/api/writers',
        private: true
    },
    [endpoints.GET_DIRECTORS]: {
        url: '/api/directors',
        private: true
    },
    [endpoints.GET_SINGERS]: {
        url: '/api/singers',
        private: true
    },
    [endpoints.GET_MUSIC_COMPOSERS]: {
        url: '/api/musiccomposers',
        private: true
    },
    [endpoints.GET_SONG_WRITERS]: {
        url: '/api/songwriters',
        private: true
    },
    [endpoints.GET_TAGS]: {
        url: '/api/textualdatatags',
        private: true
    },
    [endpoints.GET_PUBLISHING_PLATFORMS]: {
        url: '/api/publishingplatforms',
        private: true
    },
    [endpoints.SET_PUBLISHING_PLATFORMS]: {
      url: '/api/publishingplatforms',
      settings: {
        method: httpMethod.POST,
        headers: new Headers({
            'content-type': 'application/json'
        })
      },
      private: true
    },
    [endpoints.UPDATE_ONE_TIER_PUBLISHED]: {
        url: '/api/contents/onetier/published/{0}',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.UPDATE_ONE_TIER_DRAFT]: {
        url: '/api/contents/onetier/draft/{0}',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.UPDATE_USERS_DETAILS]: {
        url: '/api/users/{0}',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.UPDATE_OTC_STATUS]: {
        url: '/api/contents/onetier/{0}/status/{1}',
        settings: {
            method: httpMethod.POST,
        },
        private: true
    },
    [endpoints.UPDATE_MTC_STATUS]: {
        url: '/api/contents/multitier/{0}/status/{1}',
        settings: {
            method: httpMethod.POST,
        },
        private: true
    },
    [endpoints.VARIANCES.UPDATE_STATUS]: {
        url: '/api/contentvariances/{0}/status/{1}',
        settings: {
            method: httpMethod.POST,
        },
        private: true
    },
    [endpoints.VARIANCES.UPDATE_RIGHTS_AVAILABILITY]: {
        url: '/api/contentvariances/{0}/digitalrightsregion/{1}',
        settings: {
            method: httpMethod.POST,
        },
        private: true
    },
    [endpoints.VARIANCES.UPDATE_RIGHTS_TYPE]: {
        url: '/api/contentvariances/{0}/digitalrightstype/{1}',
        settings: {
            method: httpMethod.POST,
        },
        private: true
    },

    // [endpoints.UPDATE_MULTI_TIER_SEASON_VARIANCE]: {
    //     url: '/api/seasons/published/{0}',
    //     settings: {
    //         method: httpMethod.POST,
    //         headers: new Headers({
    //             'content-type': 'application/json'
    //         })
    //     },
    //     private: true
    // },

    [endpoints.UPDATE_MULTI_TIER_SEASON_PUBLISHED]: {
        url: '/api/seasons/published/{0}/',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.UPDATE_MULTI_TIER_SEASON_PUBLISHED_VARIENCE]: {
        url: '/api/seasons/published',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.UPDATE_MULTI_TIER_SEASON_DRAFT]: {
        url: '/api/seasons/draft/{0}',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.UPDATE_MULTI_TIER_EPISODE_PUBLISHED]: {
        url: '/api/episodes/published/{0}',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.UPDATE_MULTI_TIER_EPISODE_DRAFT]: {
        url: '/api/episodes/draft/{0}',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.UPDATE_MULTI_TIER_TITLE_DRAFT]: {
        url: '/api/contents/multitier/draft/{0}',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.UPDATE_MULTI_TIER_TITLE_PUBLISHED]: {
        url: '/api/contents/multitier/published/{0}',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.SAVE_NON_TEXTUAL_IMAGES]: {
        url: '/api/nontextual/content/{0}',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'multipart/form-data'
            })
        },
        private: true
    },
    [endpoints.SEASONS.GET_CONTENT_PAGE]: {
        url: '/api/seasons?contentId={0}&offset={1}&limit=10',
        private: true
    },
    [endpoints.SEASONS.DELETE_ITEM]: {
        url: '/api/seasons/{0}',
        settings: {
            method: httpMethod.DELETE,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.SEASONS.UPDATE_STATUS]: {
        url: '/api/seasons/{0}/status/{1}',
        settings: {
            method: httpMethod.POST,
        },
        private: true
    },
    [endpoints.SEASONS.UPDATE_RIGHTS_AVAILABILITY]: {
        url: '/api/seasons/{0}/digitalrightsregion/{1}',
        settings: {
            method: httpMethod.POST,
        },
        private: true
    },
    [endpoints.SEASONS.UPDATE_RIGHTS_TYPE]: {
        url: '/api/seasons/{0}/digitalrightstype/{1}',
        settings: {
            method: httpMethod.POST,
        },
        private: true
    },
    [endpoints.GET_EPISODES_DATA]: {
        url: '/api/episodes/{0}',
        private: true
    },
    [endpoints.EPISODES.GET_CONTENT_PAGE]: {
        url: '/api/episodes?seasonId={0}&offset={1}&limit=10',
        private: true
    },
    [endpoints.EPISODES.DELETE_ITEM]: {
        url: '/api/episodes/{0}',
        settings: {
            method: httpMethod.DELETE,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.EPISODES.UPDATE_STATUS]: {
        url: '/api/episodes/{0}/status/{1}',
        settings: {
            method: httpMethod.POST,
        },
        private: true
    },
    [endpoints.EPISODES.UPDATE_RIGHTS_AVAILABILITY]: {
        url: '/api/episodes/{0}/digitalrightsregion/{1}',
        settings: {
            method: httpMethod.POST,
        },
        private: true
    },
    [endpoints.EPISODES.UPDATE_RIGHTS_TYPE]: {
        url: '/api/episodes/{0}/digitalrightstype/{1}',
        settings: {
            method: httpMethod.POST,
        },
        private: true
    },
    [endpoints.GET_SEASON_DATA]: {
        url: '/api/seasons/{0}',
        private: true
    },
    [endpoints.GET_MANAGE_CONTENT]: {
        url: '/api/contents?offset=0&limit=50',
        private: true
    },
    [endpoints.GET_CONTENT_PARENT_STATUSES]: {
        url: '/api/content/displaystatuses',
        private: true
    },
    [endpoints.GET_COUNTRY_NAMES]: {
        url: '/api/countries',
        private: true
    },
    [endpoints.GET_LANGUAGE_NAMES]: {
        url: '/api/languages',
        private: true
    },
    [endpoints.GET_USER_DEVICES]: {
        url: '/api/devices/limit',
        private: true
    },
    [endpoints.UPDATE_USER_DEVICES]: {
        url: '/api/devices/limit',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.EXPORT_USERS_DETAILS]: {
        url: '/api/users/export?type=xlsx',
        private: true
    },
	[endpoints.GET_USER_RATINGS]: {
        url: '/api/users/{0}/ratings?offset=0&limit=10',
        private: true
    },
    [endpoints.GET_USERS_RATINGS_FILTERS]: {
        url: 'api/ratings/filters',
        private: true
    },
    [endpoints.GET_USER_ACTIVITIES]: {
        url: '/api/users/{0}/viewactivities?offset=0&limit=10',
        private: true
    },
    [endpoints.GET_USERS_ACTIVITIES_FILTERS]: {
        url: '/api/viewactivities/filters',
        private: true
    },
    [endpoints.GET_WATCHING_ISSUES]: {
        url: '/api/viewactivities/{0}/watchingissues',
        private: true
    },
    [endpoints.GET_EDITORS]: {
        url: '/api/admins?offset=0&limit=50',
        private: true
    },
    [endpoints.TRANSCODIN_SERVER_VALIDATION]: {
        url: '/api/playbackitems?videoContentId={0}',
        ownErrorHandling: true,
        private: true
    },
    [endpoints.CREATE_EDITOR]: {
        url: '/api/admins',
        settings: {
            method: httpMethod.PUT,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.UPDATE_EDITOR]: {
        url: '/api/admin/{0}',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.DELETE_EDITOR]: {
        url: '/api/admins/{0}',
        settings: {
            method: httpMethod.DELETE,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.CREATE_ACTOR]: {
        url: '/api/actors',
        settings: {
            method: httpMethod.PUT,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.CREATE_WRITER]: {
        url: '/api/writers',
        settings: {
            method: httpMethod.PUT,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.CREATE_DIRECTOR]: {
        url: '/api/directors',
        settings: {
            method: httpMethod.PUT,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.CREATE_SINGER]: {
        url: '/api/singers',
        settings: {
            method: httpMethod.PUT,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.CREATE_MUSIC_COMPOSER]: {
        url: '/api/musiccomposers',
        settings: {
            method: httpMethod.PUT,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.CREATE_SONG_WRITER]: {
        url: '/api/songwriters',
        settings: {
            method: httpMethod.PUT,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.CREATE_TAG]: {
        url: '/api/textualdatatags',
        settings: {
            method: httpMethod.PUT,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.PLAYLISTS.GET_PLAYLIST]: {
        url: '/api/playlists/{0}',
        private: true
    },
    [endpoints.PLAYLISTS.CREATE_PLAYLIST]: {
        url: '/api/playlists',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.PLAYLISTS.UPDATE_PLAYLIST]: {
        url: '/api/playlists/{0}',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.PLAYLISTS.GET_PLAYLIST_FILTERS]: {
        url: '/api/playlist/sourceitems/searchfilters',
        private: true
    },
    [endpoints.PLAYLISTS.GET_PLAYLIST_SOURCE_ITEMS]: {
        url: '/api/playlist/sourceitems?offset=0&limit=10',
        private: true
    },
    [endpoints.GET_SEARCH_DEMO_DATA]: {
        url: '/api/contents/demo?offset=0&limit=50',
        private: true
    },
    [endpoints.PLAYLISTS.GET_DYNAMIC_GROUP_ITEMS]: {
        url: '/api/playlist/dynamicgroupitems?offset=0&limit=10',
        private: true
    },
    [endpoints.PLAYLISTS.GET_PLAYLIST_TYPES]: {
        url: '/api/playlist/sourceitems/types',
        private: true
    },
    [endpoints.PLAYLISTS.GET_PLAYLISTS]: {
        url: '/api/playlists?searchText={0}&offset={1}&limit={2}',
        private: true
    },
    [endpoints.PLAYLISTS.GET_PLAYLISTS_SUMMARY]: {
        url: '/api/playlists/summary?searchText={0}&offset={1}&limit={2}&excludeHidden={3}',
        private: true
    },
    [endpoints.PLAYLISTS.CHANGE_PLAYLIST_AVAILABILITY]: {
        url: '/api/playlists/{0}/available',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.PLAYLISTS.DELETE_PLAYLIST]: {
        url: '/api/playlists/{0}',
        settings: {
            method: httpMethod.DELETE,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.PLAYLISTS.GET_PLAYLIST_INVALIDATION_NOTIFICATIONS]: {
        url: '/api/playlists/notifications',
        private: true
    },
    [endpoints.PAGES.GET_PAGE]: {
        url: '/api/pages/{0}',
        private: true
    },
    [endpoints.PAGES.CREATE_PAGE]: {
        url: '/api/pages',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.PAGES.UPDATE_PAGE]: {
        url: '/api/pages/{0}',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.PAGES.GET_PAGES_SUMMARY]: {
        url: '/api/pages/summary?searchText={0}&offset={1}&limit={2}',
        private: true
    },
    [endpoints.PAGES.GET_PAGES_ORDERED]: {
        url: '/api/pages/ordered',
        private: true
    },
    [endpoints.PAGES.UPDATE_PAGES_ORDERED]: {
      url: '/api/pages/ordered',
      settings: {
        method: httpMethod.POST,
        headers: new Headers({
            'content-type': 'application/json'
        })
    },
      private: true
    },
    [endpoints.PAGES.GET_PAGES]: {
        url: '/api/pages?searchText={0}&offset={1}&limit={2}',
        private: true
    },
    [endpoints.PAGES.DELETE_PAGE]: {
        url: '/api/pages/{0}',
        settings: {
            method: httpMethod.DELETE,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.PAGES.CHANGE_PAGE_AVAILABILITY]: {
        url: '/api/pages/{0}/available',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.PAGES.GET_PAGE_REGION]: {
        url: '/api/pages/{0}/region',
        private: true
    },
    [endpoints.SLIDERS.GET_SLIDER_TYPES]: {
        url: '/api/slider/types',
        private: true
    },
    [endpoints.SLIDERS.CREATE_SLIDER]: {
        url: '/api/sliders',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.SLIDERS.UPDATE_SLIDER]: {
        url: '/api/sliders/{0}',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.SLIDERS.GET_SLIDER]: {
        url: '/api/sliders/{0}',
        private: true
    },
    [endpoints.SLIDERS.GET_SLIDER_PREVIEW_LAYOUTS]: {
        url: '/api/slider/previewlayouts',
        private: true
    },
    [endpoints.SLIDERS.GET_SLIDERS_SUMMARY]: {
        url: '/api/sliders/summary?searchText={0}&offset={1}&limit={2}',
        private: true
    },
    [endpoints.SLIDERS.GET_SLIDERS]: {
        url: '/api/sliders?searchText={0}&offset={1}&limit={2}',
        private: true
    },
    [endpoints.SLIDERS.DELETE_SLIDER]: {
        url: '/api/sliders/{0}',
        settings: {
            method: httpMethod.DELETE,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.SLIDERS.CHANGE_SLIDER_AVAILABILITY]: {
        url: '/api/sliders/{0}/available',
        settings: {
            method: httpMethod.POST,
            headers: new Headers({
                'content-type': 'application/json'
            })
        },
        private: true
    },
    [endpoints.SLIDERS.GET_SLIDER_REGION]: {
        url: '/api/sliders/{0}/region',
        private: true
    },
    [endpoints.SLIDERS.GET_SLIDER_INVALIDATION_NOTIFICATIONS]: {
        url: '/api/sliders/notifications',
        private: true
    },
    [endpoints.PLANS]: {
        url: '/api/subscription/plan',
        private: true
    }
};
