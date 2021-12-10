export default {
    USERS_MANAGEMENT: 'Users Management',
    MANAGE_USERS_DETAILS: 'Manage Users Details',
    DEVICES_CONFIGURATION: 'Devices Configuration',
    UPDATE_NOTIFICATION_MESSAGE: 'Changes have been successfully saved.',
    TITLE_NOTIFICATION_MESSAGE: 'Title have been successfully saved.',
    SEASON_NOTIFICATION_MESSAGE: 'Season has been successfully saved.',
    EPISODE_NOTIFICATION_MESSAGE: 'Episode has been successfully saved.',
    EXPORT_NOTICATION_MESSAGE:"Email sent.",
    EDITORS_MANAGEMENT: 'Editors Management',
    EDITORS: 'Manage Editors',
    CREATE_USER_NOTIFICATION_MESSAGE: 'New Back Office User was successfully created.',
    DELETE_USER_NOTIFICATION_MESSAGE: 'User has been successfully deleted.',
    CONTENT_MANAGEMENT: 'Content Management',
    MANAGE_CONTENT: 'Manage Content',
    CREATE_N_SCHEDULE_CONTENT: 'Create & Schedule content',
    ONE_TIER_CONTENT: 'One Tier Content',
    MULTI_TIER_CONTENT_TITLE: 'Multi Tier Content Title',
    MULTI_TIER_CONTENT_SEASON: 'Multi Tier Content Season',
    MULTI_TIER_CONTENT_EPISODE: 'Multi Tier Content Episode',
    SITE_MANAGEMENT: 'Site Management',
    PAGES_MANAGEMENT: 'Pages Management',
    CREATE_PAGE: 'Create Page',
    PLAYLISTS_MANAGEMENT: 'Playlists Management',
    CREATE_PLAYLIST: 'Create Playlist',
    SLIDERS_MANAGEMENT: 'Sliders Management',
    CREATE_SLIDER: 'Create Slider',
    SEASONS_ARE_EMPTY: 'There are no Seasons created yet',
    EPISODES_ARE_EMPTY: 'There are no Episodes created yet',
    CANNOT_ADD_MORE: 'Cannot add more platforms',
    CANNOT_DELETE_EMPTY: 'Cannot delete empty item',
    ONE_MEGABYTE: 1048576,
    TEN_MEGABYTES: 10485760,

    LEAVE_CONFIRMATION: {
        TITLE: `Cancel Changes`,
        TEXT: `You are about to leave the page with unsaved changes.
                Your changes will be lost.
                Are you sure you want to proceed?`
    },
    TITLE_CONFIRMATION: {
        TITLE: `Confirmation`,
        TEXT: `You are about to move this season to a new title. This process cannot be undone. Are you sure you want to proceed?`
    },

    POPUPS: {
        SHARED: {
            CANCEL: 'NO',
            CONFIRM: 'YES',
            OK: 'OK',
        },
        CANCEL: {
            TITLE: 'Cancel Changes',
            BODY: 'Are you sure you want to cancel changes?'
        },
        SAVE_DRAFT: {
            TITLE: 'Save Draft',
            BODY: 'This content is published now. Are you sure you want to unpublish it and Save as a Draft?'
        },
        DELETE: {
            TITLE: 'Deleting "{0}"',
            ALLOW_BODY: 'Are you sure you want to delete "{0}"?',
            REJECT_BODY: 'You can not delete "{0}". {1}'
        },
        AVAILABILITY: {
            TITLE: 'Changing "{0}" availability',
            SHOW_BODY: 'Are you sure you want to show "{0}" item?',
            HIDE_BODY: 'Are you sure you want to hide "{0}" item?'
        },
        REGIONS: {
            TITLE: 'Region for "{0}"'
        },
    },

    environment: {
        DEV: 'dev',
        PROD: 'prod'
    },

    LANGUAGES: {
        DATA: {
            ARABIC: {
                CODE: 'ar',
                PREFIX: 'A'
            }
        },
        TYPES: {
            ORIGINAL: {
                NAME: 'Original'
            },
            DUBBED: {
                NAME: 'Dubbed'
            },
            SUBTITLED: {
                NAME: 'Subtitled'
            }
        }
    },

    CONTENT: {
        CONTENT_VARIANCES: {
            MIN_AMOUNT: 1,
            MAX_AMOUNT: 10
        },
        VARIANCE_TRAILERS:{
            MIN_AMOUNT: 0,
            MAX_AMOUNT: 6
        },
        TRAILERS_POSTER: {
            IMAGE: 2
        },
        STATUSES: {
            PUBLISHED: 1,
            DRAFT: 3
        },
        TIERS: {
            ONE_TIER:     {
                NAME: "OneTier",
                ID: 1
            },
            MULTI_TIER:     {
                NAME: "MultiTier",
                ID: 2
            }
        }
    },
    MULTISELECT_SEARCH: {
        SEARCH_LIMIT: 10
    },
    SLIDER_TYPE: {
        LAYOUT_A: 1,
        LAYOUT_B: 2,
        LAYOUT_C: 3
    },
    NON_TEXTUAL_DATA_TYPE: {
        FILE: 1,
        IMAGE: 2
    }
};
