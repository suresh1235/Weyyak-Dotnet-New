import validationMessages from 'validations/validationMessages';
import MultiSelect from 'react-select';

import React, {Component} from 'react';
import moment from 'moment';
import ActionLink from 'components/core/ActionLink';
import appRoutes from 'components/app.routes.config';
import Action from 'components/core/Action';
import {
  buildFullSeasonName,
  buildFullName,
  getTranslation,
} from 'components/core/Utils';

import {FormControl} from 'react-bootstrap';
import constants from 'constants/constants';

const ONE_MEGABYTE = 1048576;
const TEN_MEGABYTES = 10485760;

/**
 *
 * Returns fields for multi tier content seasons
 * @param {store} object - current store
 */
export function getMultiTierSeasonGridLayout (store) {
  return {
    columns: [
      {
        name: 'Season title',
        key: 'transliteratedTitle',
        actions: item => [
          <span key="contentTitle" className="content-title ">
            {buildFullSeasonName (item.primaryInfo, item.translation, item.rights)}
          </span>,
        ],
      },
      {
        name: 'Status',
        key: 'status',
        actions: item => [
          <FormControl
            key="select"
            className="form-control"
            componentClass="select"
            onChange={this.handleChangeStatus.bind (this, item)}
            disabled={!item.statusCanBeChanged}
            value={item.status}
          >
            {store.parentStatuses &&
              store.parentStatuses.map ((option, index) => (
                <option key={index} value={option.id}>
                  {option.name}
                </option>
              ))}
          </FormControl>,
        ],
      },
      {
        name: 'Sub-State',
        key: 'subStatusName',
        className: 'text-center',
      },
      {
        name: 'Digital Rights Start Date',
        key: 'rights.digitalRightsStartDate',
        className: 'text-center',
        format: value => value && moment (value).format ('DD/MM/YYYY'),
      },
      {
        name: 'Digital Rights End Date',
        key: 'rights.digitalRightsEndDate',
        className: 'text-center',
        format: value => value && moment (value).format ('DD/MM/YYYY'),
      },
      {
        name: 'Rights Type',
        key: 'rights.rightsType',
        actions: item => [
          <FormControl
            key="select"
            className="form-control"
            componentClass="select"
            onChange={this.changeSelectValue.bind (
              this,
              'rights.digitalRightsType',
              item
            )}
            value={item.rights.digitalRightsType || ''}
          >
            {store.digitalRightsTypes &&
              store.digitalRightsTypes.map ((option, index) => (
                <option key={index} value={option.id} disabled={option.id != 1}>
                  {option.name}
                </option>
              ))}
          </FormControl>,
        ],
      },
      {
        name: 'Created By',
        key: 'createdBy',
      },
      {
        name: 'Actions',
        key: 'actions',
        actions: item => [

          <ActionLink
            key="plus"
            icon="plus"
            to={appRoutes.ADD_EPISODE
              .replace (':contentId', item.contentId)
              .replace (':seasonId', item.id)}
            title="Add episode"
          />,
          <ActionLink
            key="edit"
            icon="edit"
            to={appRoutes.EDIT_SEASON.replace (':seasonId', item.id)}
            title="Edit season"
          />,
          <Action
            key="remove"
            icon="remove"
            title="Delete season"
            onClick={this.handleDelete.bind (this, item)}
          />,
        ],
      },
    ],
  };
}

/**
 *
 * Returns fields for multi tier content episodes
 * @param {store} object - current store
 * @param {parentLevelData} object - parent level data
 */
export function getMultiTierEpisodeGridLayout (store, parentLevelData) {
  return {
    columns: [
      {
        name: 'Episode Title',
        key: 'transliteratedTitle',
        actions: item => [
          <span key="contentTitle" className="content-title ">
            {parentLevelData &&
              `${item.primaryInfo.transliteratedTitle}_${parentLevelData.primaryInfo.seasonNumber}${getTranslation (parentLevelData.translation)}_${item.primaryInfo.number}`}
          </span>,
        ],
      },
      {
        name: 'Status',
        key: 'status',
        actions: item => [
          <FormControl
            key="select"
            className="form-control"
            componentClass="select"
            onChange={this.handleChangeStatus.bind (this, item)}
            disabled={!item.statusCanBeChanged}
            value={item.status}
          >
            {store.parentStatuses &&
              store.parentStatuses.map ((option, index) => (
                <option key={index} value={option.id}>
                  {option.name}
                </option>
              ))}
          </FormControl>,
        ],
      },
      {
        name: 'Sub-State',
        key: 'subStatusName',
        className: 'text-center',
      },
      {
        name: 'Created By',
        key: 'createdBy',
      },
      {
        name: 'Actions',
        key: 'actions',
        actions: item => [
          <ActionLink
            key="edit"
            icon="edit"
            to={appRoutes.EDIT_EPISODE.replace (':episodeId', item.id)}
            title="Edit episode"
          />,
          <Action
            key="remove"
            icon="remove"
            title="Delete episode"
            onClick={this.handleDelete.bind (this, item)}
          />,
        ],
      },
    ],
  };
}
/**
 * Represents content fields configuration
 * @type {{primaryInfo: {fields: [*]}, contentGenres: {fields: [*]}}}
 */
export const OneTierContentFields = {
  primaryInfo: {
    fields: [
      [
        {
          name: 'contentType',
          type: 'select',
          options: 'contentTypes',
          optionValue: 'contentType',
          includeEmptyOption: true,
          optionLabel: function () {
            return `${this.englishName}_${this.arabicName}`;
          },
          label: 'Content Type **',
          validationRules: [
            {
              name: 'required',
              customMessage: validationMessages.specifyData,
              msgArgs: ['Content Type'],
            },
          ],
          key: 'contentType',
        },
        {
          name: 'notes',
          type: 'textarea',
          label: 'Notes',
          validationRules: [
            {
              name: 'dataInRange',
              customMessage: validationMessages.tooLong,
              args: [0, 80],
              msgArgs: ['Notes', 80],
            },
          ],
          key: 'notes',
        },
      ],
      [
        {
          name: 'originalTitle',
          type: 'text',
          label: 'Original Title',
          validationRules: [
            {
              name: 'dataInRange',
              customMessage: validationMessages.tooLong,
              args: [0, 255],
              msgArgs: ['Original Title', 255],
            },
          ],
          key: 'originalTitle',
        },
        {
          name: 'alternativeTitle',
          type: 'text',
          label: 'Alternative Title',
          validationRules: [
            {
              name: 'dataInRange',
              customMessage: validationMessages.tooLong,
              args: [0, 60],
              msgArgs: ['Alternative Title', 60],
            },
          ],
          key: 'alternativeTitle',
        },
        {
          name: 'arabicTitle',
          type: 'text',
          label: 'Arabic Title **',
          validationRules: [
            {
              name: 'required',
              customMessage: validationMessages.specifyData,
              msgArgs: ['Arabic Title'],
            },
            {
              name: 'dataInRange',
              customMessage: validationMessages.tooLong,
              args: [0, 25],
              msgArgs: ['Arabic Title', 25],
            },
          ],
          key: 'arabicTitle',
        },
        {
          name: 'transliteratedTitle',
          type: 'text',
          label: 'Transliterated Title **',
          validationRules: [
            {
              name: 'required',
              customMessage: validationMessages.specifyData,
              msgArgs: ['Transliterated Title'],
            },
            {
              name: 'dataInRange',
              customMessage: validationMessages.tooLong,
              args: [0, 25],
              msgArgs: ['Transliterated Title', 25],
            },
          ],
          key: 'transliteratedTitle',
        },
      ],
    ],
  },
  seoDetails: {
    fields: [
      [
        {
          name: 'englishMetaTitle',
          type: 'text',
          label: 'Meta-Title (English) *',
          validationRules: [
            {
              name: 'required',
              customMessage: validationMessages.mustBeFilled,
              msgArgs: ['The Meta-Title (English)'],
            },
            {
              name: 'dataInRange',
              customMessage: validationMessages.tooLong,
              args: [0, 70],
              msgArgs: ['The Meta-Title (English)', 70],
            },
          ],
          key: 'englishMetaTitle',
        },
        {
          name: 'englishMetaDescription',
          type: 'textarea',
          label: 'Meta Description (English) *',
          placeholder: `– Include searchable keywords within the description indicating the page content and that will enhance our page SEO–
– Example (EN): Weyyak| watch online movies, series, playes in Arabic –`,
          validationRules: [
            {
              name: 'required',
              customMessage: validationMessages.mustBeFilled,
              msgArgs: ['The Meta Description (English)'],
            },
            {
              name: 'dataInRange',
              customMessage: validationMessages.tooLong,
              args: [0, 188],
              msgArgs: ['The Meta Description (English)', 188],
            },
          ],
          key: 'englishMetaDescription',
        },
      ],
      [
        {
          name: 'arabicMetaTitle',
          type: 'text',
          label: 'Meta-Title (Arabic) *',
          validationRules: [
            {
              name: 'required',
              customMessage: validationMessages.mustBeFilled,
              msgArgs: ['The Meta-Title (Arabic)'],
            },
            {
              name: 'dataInRange',
              customMessage: validationMessages.tooLong,
              args: [0, 70],
              msgArgs: ['The Meta-Title (Arabic)', 70],
            },
          ],
          key: 'arabicMetaTitle',
        },
        {
          name: 'arabicMetaDescription',
          type: 'textarea',
          label: 'Meta Description (Arabic) *',
          placeholder: `– Include searchable keywords within the description indicating the page content and that will enhance our page SEO–
– Example (AR): وياك تمتع بمجموعة منوعة من المسلسلات والأفلام والبرامج بالعربي –`,
          validationRules: [
            {
              name: 'required',
              customMessage: validationMessages.mustBeFilled,
              msgArgs: ['The Meta Description (Arabic)'],
            },
            {
              name: 'dataInRange',
              customMessage: validationMessages.tooLong,
              args: [0, 188],
              msgArgs: ['The Meta Description (Arabic)', 188],
            },
          ],
          key: 'arabicMetaDescription',
        },
      ],
    ],
  },
  contentGenres: {
    fields: [
      {
        name: 'genreId',
        type: 'select',
        options: 'genres',
        optionValue: 'id',
        includeEmptyOption: true,
        optionLabel: function () {
          return `${this.englishName}_${this.arabicName}`;
        },
        label: 'Genre **',
        validationRules: [
          {
            name: 'required',
            customMessage: validationMessages.specifyData,
            msgArgs: ['Genre'],
          },
        ],
        key: 'genreId',
      },
      {
        name: 'subgenresId',
        type: 'select',
        options: 'subgenres.{genreId}',
        optionValue: 'id',
        multiple: true,
        optionLabel: function () {
          return `${this.englishName}_${this.arabicName}`;
        },
        label: 'Sub Genres **',
        validationRules: [
          {
            name: 'multipleSelect',
            customMessage: validationMessages.specifyData,
            msgArgs: ['at least one Sub Genre for the Genre'],
          },
        ],
        dynamicValueKey: 'genreId',
        key: 'subgenresId',
      },
    ],
  },
  aboutTheContent: {
    fields: [
      [
        {
          element: FormControl,
          elementType: 'select',
          label: 'Original Language **',
          props: {
            name: 'originalLanguage',
            type: 'select',
            key: 'originalLanguage',
            componentClass: 'select',
            validations: [
              {
                name: 'required',
                customMessage: validationMessages.specifyData,
                msgArgs: ['Original Language'],
              },
            ],
          },
          config: {
            emptyOption: true,
            optionsKey: 'originalLanguages',
            optionValue: 'code',
            optionLabel: function () {
              return `${this.englishName}_${this.arabicName}`;
            },
          },
        },
        {
          element: FormControl,
          elementType: 'select',
          label: 'supplier *',
          props: {
            name: 'supplier',
            type: 'select',
            key: 'supplier',
            componentClass: 'select',
            validations: [
              {
                name: 'required',
                customMessage: validationMessages.specifyData,
                msgArgs: ['Supplier'],
              },
            ],
          },
          config: {
            emptyOption: false,
            optionsKey: 'supplierS',
            optionValue: 'id',
            optionLabel: function () {
              return `${this.supplierName}`;
            },
          },
        },
        {
          element: FormControl,
          label: 'Acquisition Department',
          props: {
            name: 'acquisitionDepartment',
            type: 'text',
            key: 'acquisitionDepartment',
            validations: [
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 255],
                msgArgs: ['Acquisition Department', 255],
              },
            ],
          },
          config: {},
        },
        {
          element: FormControl,
          label: 'Synopsis (English) **',
          props: {
            name: 'englishSynopsis',
            componentClass: 'textarea',
            type: 'textarea',
            key: 'englishSynopsis',
            validations: [
              {
                name: 'required',
                customMessage: validationMessages.specifyData,
                msgArgs: ['Synopsis (English)'],
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 188],
                msgArgs: ['Synopsis (English)', 188],
              },
            ],
          },
          config: {},
        },
      ],
      [
        {
          element: MultiSelect,
          elementType: 'multiselect',
          label: 'Production Country',
          props: {
            name: 'productionCountries',
            type: 'select',
            key: 'productionCountries',
            componentClass: 'select',
            validations: [],
            multiple: true,
          },
          config: {
            emptyOption: true,
            optionsKey: 'productionCountriesList',
            optionValue: 'id',
            optionLabel: function () {
              return `${this.englishName}_${this.arabicName}`;
            },
          },
        },
        {
          element: FormControl,
          label: 'Production Year',
          props: {
            name: 'productionYear',
            type: 'text',
            key: 'productionYear',
            validations: [
              {
                name: 'numericRange',
                customMessage: validationMessages.numericRange,
                args: [1900, 2999],
                msgArgs: ['Production Year', 1900, 2999],
              },
            ],
          },
          config: {},
        },
        {
          element: FormControl,
          label: 'Production House',
          props: {
            name: 'productionHouse',
            type: 'text',
            key: 'productionHouse',
            validations: [
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 255],
                msgArgs: ['Production House', 255],
              },
            ],
          },
          config: {},
        },
        {
          element: FormControl,
          elementType: 'select',
          label: 'Age Group **',
          props: {
            name: 'ageGroup',
            type: 'select',
            key: 'ageGroup',
            componentClass: 'select',
            validations: [
              {
                name: 'required',
                customMessage: validationMessages.specifyData,
                msgArgs: ['Age Group'],
              },
            ],
          },
          config: {
            emptyOption: true,
            optionsKey: 'ageGroups',
            optionValue: 'id',
            optionLabel: function () {
              return `${this.englishName}_${this.arabicName}`;
            },
          },
        },
        {
          element: FormControl,
          label: 'Synopsis (Arabic) **',
          props: {
            name: 'arabicSynopsis',
            componentClass: 'textarea',
            type: 'textarea',
            key: 'arabicSynopsis',
            validations: [
              {
                name: 'required',
                customMessage: validationMessages.specifyData,
                msgArgs: ['Synopsis (Arabic)'],
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 174],
                msgArgs: ['Synopsis (Arabic)', 174],
              },
            ],
          },
          config: {},
        },
      ],
    ],
  },
  contentFields: {
    fields: [
      {
        name: 'posterImage',
        preview: true,
        dataType: constants.NON_TEXTUAL_DATA_TYPE.IMAGE,
        label: 'Poster Image *',
        fileParametersValidation: {
          resolution: resolution => '811x811' == resolution,
          type: type =>
            ['image/png', 'image/jpeg'].some (value => value == type),
          size: size => constants.ONE_MEGABYTE >= size,
        },
        validationMessages: {
          resolution: 'Image size should be 811x811 px',
          type: 'File format should be JPG or PNG',
          size: 'File size should be no more than 1Mb',
        },
        validationRules: [
          {
            name: 'required',
            customMessage: validationMessages.specifyData,
            msgArgs: ['Poster Image (to Publish the content)'],
          },
        ],
      },
      {
        name: 'detailsBackground',
        preview: true,
        dataType: constants.NON_TEXTUAL_DATA_TYPE.IMAGE,
        label: "Detail's page Background *",
        fileParametersValidation: {
          resolution: resolution => '2048x670' == resolution,
          type: type =>
            ['image/png', 'image/jpeg'].some (value => value == type),
          size: size => constants.ONE_MEGABYTE >= size,
        },
        validationMessages: {
          resolution: 'Image size should be 2048x670 px',
          type: 'File format should be JPG or PNG',
          size: 'File size should be no more than 1Mb',
        },
        validationRules: [
          {
            name: 'required',
            customMessage: validationMessages.specifyData,
            msgArgs: ["Detail's page Background (to Publish the content)"],
          },
        ],
      },
      {
        name: 'mobileDetailsBackground',
        preview: true,
        dataType: constants.NON_TEXTUAL_DATA_TYPE.IMAGE,
        label: "Mobile Detail's page Background *",
        fileParametersValidation: {
          resolution: resolution => '1125x540' == resolution,
          type: type =>
            ['image/png', 'image/jpeg'].some (value => value == type),
          size: size => constants.ONE_MEGABYTE >= size,
        },
        validationMessages: {
          resolution: 'Image size should be 1125x540 px',
          type: 'File format should be JPG or PNG',
          size: 'File size should be no more than 1Mb',
        },
        validationRules: [
          {
            name: 'required',
            customMessage: validationMessages.specifyData,
            msgArgs: [
              "Mobile Detail's page Background (to Publish the content)",
            ],
          },
        ],
      },
    ],
  },
  variance: {
    fields: {
      uploads: [
        {
          name: 'overlayPosterImage',
          preview: true,
          dataType: constants.NON_TEXTUAL_DATA_TYPE.IMAGE,
          label: 'Overlay Poster Image *',
          fileParametersValidation: {
            resolution: resolution => '811x811' == resolution,
            type: type =>
              ['image/png', 'image/jpeg'].some (value => value == type),
            size: size => ONE_MEGABYTE >= size,
          },
          validationMessages: {
            resolution: 'Image size should be 811x811 px',
            type: 'File format should be JPG or PNG',
            size: 'File size should be no more than 1Mb',
          },
          validationRules: [
            {
              name: 'required',
              customMessage: validationMessages.specifyData,
              msgArgs: ['Overlay Poster Image (to Publish the content)'],
            },
          ],
        },
        {
          name: 'dubbingScript',
          preview: true,
          dataType: constants.NON_TEXTUAL_DATA_TYPE.FILE,
          label: 'Dubbing Script',
          fileParametersValidation: {
            type: type => ['text/plain'].some (value => value == type),
            size: size => TEN_MEGABYTES >= size,
          },
          validationMessages: {
            type: 'File format should be TXT',
            size: 'File size should not exceed 10Mb',
          },
        },
        {
          name: 'subtitlingScript',
          preview: true,
          dataType: constants.NON_TEXTUAL_DATA_TYPE.FILE,
          label: 'Subtitling Script',
          fileParametersValidation: {
            type: type => ['text/plain'].some (value => value == type),
            size: size => TEN_MEGABYTES >= size,
          },
          validationMessages: {
            type: 'File format should be TXT',
            size: 'File size should not exceed 10Mb',
          },
        },
      ],
      rightsStartDate: {
        name: 'digitalRightsStartDate',
        label: 'Digital Rights-Start Date *',
        validations: [
          {
            name: 'required',
            customMessage: validationMessages.specifyData,
            msgArgs: ['Digital Rights-Start Date (to Publish the content)'],
          },
        ],
      },
      rightsEndDate: {
        name: 'digitalRightsEndDate',
        label: 'Digital Rights-End Date *',
        validations: [
          {
            name: 'required',
            customMessage: validationMessages.specifyData,
            msgArgs: ['Digital Rights-End Date (to Publish the content)'],
          },
        ],
      },
      scheduling: {
        name: 'scheduling',
        label: 'Date & Time',
        validations: [
          {
            name: 'dateTimeIsNotPast',
            msgArgs: ['Date & Time'],
          },
        ],
      },
      originType: {
        element: MultiSelect,
        elementType: 'multiselect',
        label: 'Language **',
        props: {
          name: 'languageType',
          type: 'select',
          componentClass: 'select',
          multiple: false,
          validations: [
            {
              name: 'required',
              customMessage: validationMessages.specifyData,
              msgArgs: ['Language'],
            },
          ],
        },
      },
      dubbingLanguage: {
        element: MultiSelect,
        elementType: 'multiselect',
        label: 'Dubbing Language **',
        props: {
          name: 'dubbingLanguage',
          type: 'select',
          componentClass: 'select',
          validations: [
            {
              name: 'required',
              customMessage: validationMessages.specifyData,
              msgArgs: ['Dubbing Language'],
            },
          ],
          multiple: false,
        },
      },
      subtitlingLanguage: {
        element: MultiSelect,
        elementType: 'multiselect',
        label: 'Subtitling Language **',
        props: {
          name: 'subtitling',
          type: 'select',
          componentClass: 'select',
          validations: [
            {
              name: 'required',
              customMessage: validationMessages.specifyData,
              msgArgs: ['Subtitling Language'],
            },
          ],
          multiple: false,
        },
      },
      dialect: {
        element: MultiSelect,
        elementType: 'multiselect',
        label: 'Dubbed Dialect **',
        props: {
          name: 'dubbingLanguage',
          type: 'select',
          componentClass: 'select',
          validations: [
            {
              name: 'required',
              customMessage: validationMessages.specifyData,
              msgArgs: ['Dubbed Dialect'],
            },
          ],
          multiple: false,
        },
      },
      rightsType: {
        element: MultiSelect,
        elementType: 'multiselect',
        label: 'Rights Type *',
        props: {
          name: 'digitalRightsType',
          type: 'select',
          componentClass: 'select',
          validations: [
            {
              name: 'required',
              customMessage: validationMessages.specifyData,
              msgArgs: ['Rights Type (to Publish the content)'],
            },
          ],
          multiple: false,
        },
      },
      subscriptionPlans: {
        element: MultiSelect,
        elementType: 'multiselect',
        label: 'Plans',
        props: {
          name: 'subscriptionPlans',
          type: 'select',
          componentClass: 'select',
          validations: [
            {
             
            },
          ],
          multiple: true,
        },
      },
      rightsRegion: {
        element: MultiSelect,
        elementType: 'multiselect',
        label: 'Rights Region *',
        props: {
          name: 'digitalRightsRegions',
          type: 'select',
          componentClass: 'select',
          validations: [
            {
              name: 'required',
              customMessage: validationMessages.specifyData,
              msgArgs: ['Rights Region (to Publish the content)'],
            },
          ],
          multiple: false,
        },
      },
      products: {
        element: MultiSelect,
        elementType: 'multiselect',
        label: 'Product Name',
        props: {
          name: 'product',
          type: 'select',
          componentClass: 'select',
          validations: [
            {
              name: 'required',
              customMessage: validationMessages.specifyData,
              msgArgs: ['Product Name'],
            },
          ],
          multiple: true,
        },
      },
      Trailers: [{
        element: FormControl,
        label: 'English Description',
        props: {
            name: "englishTitle",
            className: "form-control",
            type: 'text',
            validations: [
                // {
                //     name: 'required',
                //     customMessage: validationMessages.specifyData,
                //     msgArgs: ['English Title']
                // },
                {
                    name: 'dataInRange',
                    customMessage: validationMessages.tooLong,
                    args: [0, 256],
                    msgArgs: ['English Description', 256]
                },
            ],
            key: 'englishTitle'
        },
    },{
        element: FormControl,
        label: 'Arabic Description',
        props: {
            name: "arabicTitle",
            className: "form-control",
            type: 'text',
            validations: [
                // {
                //     name: 'required',
                //     customMessage: validationMessages.specifyData,
                //     msgArgs: ['Arabic Title']
                // },
                {
                    name: 'dataInRange',
                    customMessage: validationMessages.tooLong,
                    args: [0, 256],
                    msgArgs: ['Arabic Description', 256]
                }
            ],
            key: 'arabicTitle'
        },
    }],
    TrailerPoster:{
      key: 0,
      name: 'trailerposterImage',
      preview: true,
      dataType: constants.CONTENT.TRAILERS_POSTER.IMAGE,
      label: 'Trailer Poster Image',
      fileParametersValidation: {
        resolution: resolution => '1920x1080' == resolution,
        type: type =>
          ['image/png', 'image/jpeg'].some (value => value == type),
        size: size => ONE_MEGABYTE >= size,
      },
      validationMessages: {
        resolution: 'Image size should be 1920x1080 px',
        type: 'File format should be JPG or PNG',
        size: 'File size should be no more than 1Mb',
      },
      validationRules: [
        // {
        //   name: 'required',
        //   customMessage: validationMessages.specifyData,
        //   msgArgs: ['Trailer Poster Image (to Publish the content)'],
        // },
      ],
    },
      TrailerID: {
        element: FormControl,
        label: 'Trailer ID',
        props: {
            name: `videoTrailerId`,
            className: "form-control",
            type: 'text',
            validations: [
                // {
                //     name: 'required',
                //     customMessage: validationMessages.specifyData,
                //     msgArgs: ['Trailer ID']
                // },
                {
                    name: 'dataInRange',
                    customMessage: validationMessages.tooLong,
                    args: [0, 256],
                    msgArgs: ['Trailer ID', 256]
                }
            ],
            key: 'videoTrailerId'
        },
    },
    ValidateTrailersTitle: [{
      element: FormControl,
      label: 'English Description *',
      props: {
          name: "englishTitle",
          className: "form-control",
          type: 'text',
          validations: [
              {
                  name: 'required',
                  customMessage: validationMessages.specifyData,
                  msgArgs: ['English Description']
              },
              {
                  name: 'dataInRange',
                  customMessage: validationMessages.tooLong,
                  args: [0, 256],
                  msgArgs: ['English Description', 256]
              },
          ],
          key: 'englishTitle'
      },
  },{
      element: FormControl,
      label: 'Arabic Description *',
      props: {
          name: "arabicTitle",
          className: "form-control",
          type: 'text',
          validations: [
              {
                  name: 'required',
                  customMessage: validationMessages.specifyData,
                  msgArgs: ['Arabic Description']
              },
              {
                  name: 'dataInRange',
                  customMessage: validationMessages.tooLong,
                  args: [0, 256],
                  msgArgs: ['Arabic Description', 256]
              }
          ],
          key: 'arabicTitle'
      },
  }],
  ValidateTrailerPoster:{
    key: 0,
    name: 'trailerposterImage',
    preview: true,
    dataType: constants.CONTENT.TRAILERS_POSTER.IMAGE,
    label: 'Trailer Poster Image *',
    fileParametersValidation: {
      resolution: resolution => '1920x1080' == resolution,
      type: type =>
        ['image/png', 'image/jpeg'].some (value => value == type),
      size: size => ONE_MEGABYTE >= size,
    },
    validationMessages: {
      resolution: 'Image size should be 1920x1080 px',
      type: 'File format should be JPG or PNG',
      size: 'File size should be no more than 1Mb',
    },
    validationRules: [
      {
        name: 'required',
        customMessage: validationMessages.specifyData,
        msgArgs: ['Trailer Poster Image (to Publish the content)'],
      },
    ],
  },
      platforms: {
        name: 'publishingPlatforms',
        validations: [
          {          
            customMessage: validationMessages.specifyData,
            msgArgs: ['Where to Publish (to Publish the content)'],
          },
        ],
      },
    },
  },
};

export const MultiTierContentFields = {
  title: {
    primaryInfo: {
      fields: [
        [
          {
            name: 'contentType',
            type: 'select',
            options: 'contentTypes',
            optionValue: 'contentType',
            includeEmptyOption: true,
            optionLabel: function () {
              return `${this.englishName}_${this.arabicName}`;
            },
            label: 'Content Type *',
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.specifyData,
                msgArgs: ['Content Type'],
              },
            ],
            key: 'contentType',
          },
          {
            name: 'notes',
            type: 'textarea',
            label: 'Notes',
            validationRules: [
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 80],
                msgArgs: ['Notes', 80],
              },
            ],
            key: 'notes',
          },
        ],
        [
          {
            name: 'originalTitle',
            type: 'text',
            label: 'Original Title',
            validationRules: [
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 255],
                msgArgs: ['Original Title', 255],
              },
            ],
            key: 'originalTitle',
          },
          {
            name: 'alternativeTitle',
            type: 'text',
            label: 'Alternative Title',
            validationRules: [
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 60],
                msgArgs: ['Alternative Title', 60],
              },
            ],
            key: 'alternativeTitle',
          },
          {
            name: 'arabicTitle',
            type: 'text',
            label: 'Arabic Title *',
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.specifyData,
                msgArgs: ['Arabic Title'],
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 25],
                msgArgs: ['Arabic Title', 25],
              },
            ],
            key: 'arabicTitle',
          },
          {
            name: 'transliteratedTitle',
            type: 'text',
            label: 'Transliterated Title *',
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.specifyData,
                msgArgs: ['Transliterated Title'],
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 25],
                msgArgs: ['Transliterated Title', 25],
              },
            ],
            key: 'transliteratedTitle',
          },
        ],
      ],
    },

    seoDetails: {
      fields: [
        [
          {
            name: 'englishMetaTitle',
            type: 'text',
            label: 'Meta-Title (English) *',
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.mustBeFilled,
                msgArgs: ['The Meta-Title (English)'],
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 70],
                msgArgs: ['The Meta-Title (English)', 70],
              },
            ],
            key: 'englishMetaTitle',
          },
          {
            name: 'englishMetaDescription',
            type: 'textarea',
            label: 'Meta Description (English) *',
            placeholder: `– Include searchable keywords within the description indicating the page content and that will enhance our page SEO–
– Example (EN): Weyyak| watch online movies, series, playes in Arabic –`,
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.mustBeFilled,
                msgArgs: ['The Meta Description (English)'],
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 188],
                msgArgs: ['The Meta Description (English)', 188],
              },
            ],
            key: 'englishMetaDescription',
          },
        ],
        [
          {
            name: 'arabicMetaTitle',
            type: 'text',
            label: 'Meta-Title (Arabic) *',
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.mustBeFilled,
                msgArgs: ['The Meta-Title (Arabic)'],
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 70],
                msgArgs: ['The Meta-Title (Arabic)', 70],
              },
            ],
            key: 'arabicMetaTitle',
          },
          {
            name: 'arabicMetaDescription',
            type: 'textarea',
            label: 'Meta Description (Arabic) *',
            placeholder: `– Include searchable keywords within the description indicating the page content and that will enhance our page SEO–
– Example (AR): وياك تمتع بمجموعة منوعة من المسلسلات والأفلام والبرامج بالعربي –`,
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.mustBeFilled,
                msgArgs: ['The Meta Description (Arabic)'],
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 188],
                msgArgs: ['The Meta Description (Arabic)', 188],
              },
            ],
            key: 'arabicMetaDescription',
          },
        ],
      ],
    },

    contentGenres: {
      fields: [
        {
          name: 'genreId',
          type: 'select',
          options: 'genres',
          optionValue: 'id',
          includeEmptyOption: true,
          optionLabel: function () {
            return `${this.englishName}_${this.arabicName}`;
          },
          label: 'Genre *',
          validationRules: [
            {
              name: 'required',
              customMessage: validationMessages.specifyData,
              msgArgs: ['Genre'],
            },
          ],
          key: 'genreId',
        },
        {
          name: 'subgenresId',
          type: 'select',
          options: 'subgenres.{genreId}',
          optionValue: 'id',
          multiple: true,
          optionLabel: function () {
            return `${this.englishName}_${this.arabicName}`;
          },
          label: 'Sub Genres *',
          validationRules: [
            {
              name: 'multipleSelect',
              customMessage: validationMessages.specifyData,
              msgArgs: ['at least one Sub Genre for the Genre'],
            },
          ],
          dynamicValueKey: 'genreId',
          key: 'subgenresId',
        },
      ],
    },
  },
  season: {
    title: {
      element: MultiSelect,
      elementType: 'multiselect',
      label: 'Title *',
      props: {
        name: 'contentId',
        type: 'select',
        componentClass: 'select',
        multiple: false,
        validations: [
          {
            name: 'required',
            customMessage: validationMessages.specifyData,
            msgArgs: ['Title'],
          },
        ],
      },
    },
    primaryInfo: {
      fields: [
        [
          {
            name: 'seasonNumber',
            type: 'select',
            options: 'seasonNumbers',
            optionValue: 'seasonNumber',
            includeEmptyOption: true,
            optionLabel: function () {
              return this;
            },
            label: 'Season № *',
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.specifyData,
                msgArgs: ['Season'],
              },
            ],
            key: 'seasonNumber',
          },
          {
            name: 'notes',
            type: 'textarea',
            label: 'Notes',
            validationRules: [
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 80],
                msgArgs: ['Notes', 80],
              },
            ],
            key: 'notes',
          },
        ],
        [
          {
            name: 'originalTitle',
            type: 'text',
            label: 'Original Title',
            validationRules: [
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 255],
                msgArgs: ['Original Title', 255],
              },
            ],
            key: 'originalTitle',
          },
          {
            name: 'alternativeTitle',
            type: 'text',
            label: 'Alternative Title',
            validationRules: [
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 60],
                msgArgs: ['Alternative Title', 60],
              },
            ],
            key: 'alternativeTitle',
          },
          {
            name: 'arabicTitle',
            type: 'text',
            label: 'Arabic Title *',
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.specifyData,
                msgArgs: ['Arabic Title'],
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 25],
                msgArgs: ['Arabic Title', 25],
              },
            ],
            key: 'arabicTitle',
          },
          {
            name: 'transliteratedTitle',
            type: 'text',
            label: 'Transliterated Title *',
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.specifyData,
                msgArgs: ['Transliterated Title'],
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 25],
                msgArgs: ['Transliterated Title', 25],
              },
            ],
            key: 'transliteratedTitle',
          },
        ],
      ],
    },
    contentGenres: {
      fields: [
        {
          name: 'genres',
          type: 'select',
          options: 'genres',
          optionValue: 'id',
          includeEmptyOption: true,
          optionLabel: function () {
            return `${this.englishName}_${this.arabicName}`;
          },
          label: 'Genre *',
          validationRules: [
            {
              name: 'required',
              customMessage: validationMessages.specifyData,
              msgArgs: ['Genre'],
            },
          ],
          key: 'genreId',
        },
        {
          name: 'subgenres',
          type: 'select',
          options: 'subgenres.{genreId}',
          optionValue: 'id',
          multiple: true,
          optionLabel: function () {
            return `${this.englishName}_${this.arabicName}`;
          },
          label: 'Sub Genres *',
          validationRules: [
            {
              name: 'multipleSelect',
              customMessage: validationMessages.specifyData,
              msgArgs: ['at least one Sub Genre for the Genre'],
            },
          ],
          dynamicValueKey: 'genreId',
          key: 'subgenresId',
        },
      ],
    },
    aboutTheContent: {
      fields: [
        [
          {
            element: FormControl,
            elementType: 'select',
            label: 'Original Language *',
            props: {
              name: 'originalLanguage',
              type: 'select',
              key: 'originalLanguage',
              componentClass: 'select',
              validations: [
                {
                  name: 'required',
                  customMessage: validationMessages.specifyData,
                  msgArgs: ['Original Language'],
                },
              ],
            },
            config: {
              emptyOption: true,
              optionsKey: 'originalLanguages',
              optionValue: 'code',
              optionLabel: function () {
                return `${this.englishName}_${this.arabicName}`;
              },
            },
          },
          {
            element: FormControl,
            elementType: 'select',
            label: 'supplier *',
            props: {
              name: 'supplier',
              type: 'select',
              key: 'supplier',
              componentClass: 'select',
              validations: [
                {
                  name: 'required',
                  customMessage: validationMessages.specifyData,
                  msgArgs: ['Supplier'],
                },
              ],
            },
            config: {
              emptyOption: false,
              optionsKey: 'supplierS',
              optionValue: 'id',
              optionLabel: function () {
                return `${this.supplierName}`;
              },
            },
          },
          {
            element: FormControl,
            label: 'Acquisition Department',
            props: {
              name: 'acquisitionDepartment',
              type: 'text',
              key: 'acquisitionDepartment',
              validations: [
                {
                  name: 'dataInRange',
                  customMessage: validationMessages.tooLong,
                  args: [0, 255],
                  msgArgs: ['Acquisition Department', 255],
                },
              ],
            },
            config: {},
          },
          {
            element: FormControl,
            label: 'Synopsis (English) *',
            props: {
              name: 'englishSynopsis',
              componentClass: 'textarea',
              type: 'textarea',
              key: 'englishSynopsis',
              validations: [
                {
                  name: 'required',
                  customMessage: validationMessages.specifyData,
                  msgArgs: ['Synopsis (English)'],
                },
                {
                  name: 'dataInRange',
                  customMessage: validationMessages.tooLong,
                  args: [0, 188],
                  msgArgs: ['Synopsis (English)', 188],
                },
              ],
            },
            config: {},
          },
          {
            element: FormControl,
            label: 'Intro Duration *',
            props: {
              name: 'introDuration',
              type: 'text',
              key: 'introDuration',
              validations: [
                {
                  name: 'required',
                  customMessage: validationMessages.specifyData,
                  msgArgs: ['Intro Duration'],
                },
                {
                  name: 'minuteSeconds',
                  customMessage: validationMessages.enterTime,
                },
              ],
            },
            config: {},
          },
          {
            element: FormControl,
            label: 'Intro Start Time  *',
            props: {
              name: 'introStart ',
              type: 'text',
              key: 'introStart',
              validations: [
                {
                  name: 'required',
                  customMessage: validationMessages.specifyData,
                  msgArgs: ['Intro Start Time'],
                },
                {
                  name: 'hourMinuteSeconds',
                  customMessage: validationMessages.enterFullTime,
                },
              ],
            },
            config: {},
          },
         
        ],
        [
          {
            element: MultiSelect,
            elementType: 'multiselect',
            label: 'Production Country',
            props: {
              name: 'productionCountries',
              type: 'select',
              key: 'productionCountries',
              componentClass: 'select',
              validations: [],
              multiple: true,
            },
            config: {
              emptyOption: true,
              optionsKey: 'productionCountriesList',
              optionValue: 'id',
              optionLabel: function () {
                return `${this.englishName}_${this.arabicName}`;
              },
            },
          },
          {
            element: FormControl,
            label: 'Production Year',
            props: {
              name: 'productionYear',
              type: 'text',
              key: 'productionYear',
              validations: [
                {
                  name: 'numericRange',
                  customMessage: validationMessages.numericRange,
                  args: [1900, 2999],
                  msgArgs: ['Production Year', 1900, 2999],
                },
              ],
            },
            config: {},
          },
          {
            element: FormControl,
            label: 'Production House',
            props: {
              name: 'productionHouse',
              type: 'text',
              key: 'productionHouse',
              validations: [
                {
                  name: 'dataInRange',
                  customMessage: validationMessages.tooLong,
                  args: [0, 255],
                  msgArgs: ['Production House', 255],
                },
              ],
            },
            config: {},
          },
          {
            element: FormControl,
            elementType: 'select',
            label: 'Age Group *',
            props: {
              name: 'ageGroup',
              type: 'select',
              key: 'ageGroup',
              componentClass: 'select',
              validations: [
                {
                  name: 'required',
                  customMessage: validationMessages.specifyData,
                  msgArgs: ['Age Group'],
                },
              ],
            },
            config: {
              emptyOption: true,
              optionsKey: 'ageGroups',
              optionValue: 'id',
              optionLabel: function () {
                return `${this.englishName}_${this.arabicName}`;
              },
            },
          },
          {
            element: FormControl,
            label: 'Synopsis (Arabic) *',
            props: {
              name: 'arabicSynopsis',
              componentClass: 'textarea',
              type: 'textarea',
              key: 'arabicSynopsis',
              validations: [
                {
                  name: 'required',
                  customMessage: validationMessages.specifyData,
                  msgArgs: ['Synopsis (Arabic)'],
                },
                {
                  name: 'dataInRange',
                  customMessage: validationMessages.tooLong,
                  args: [0, 174],
                  msgArgs: ['Synopsis (Arabic)', 174],
                },
              ],
            },
            config: {},
          },
          {
            element: FormControl,
            label: 'Outro Duration  *',
            props: {
              name: 'outroDuration ',
              type: 'text',
              key: 'outroDuration',
              validations: [
                {
                  name: 'required',
                  customMessage: validationMessages.specifyData,
                  msgArgs: ['Outro Duration'],
                },
                {
                  name: 'minuteSeconds',
                  customMessage: validationMessages.enterTime,
                },
              ],
            },
            config: {},
          },
          {
            element: FormControl,
            label: 'Outro Start Time  *',
            props: {
              name: 'outroStart',
              type: 'text',
              key: 'outroStart',
              validations: [
                {
                  name: 'required',
                  customMessage: validationMessages.specifyData,
                  msgArgs: ['Outro Start Time '],
                },
                {
                  name: 'hourMinuteSeconds',
                  customMessage: validationMessages.enterFullTime,
                },
              ],
            },
            config: {},
          },

        ],
      ],
      
    },
    
    seoDetails: {
      fields: [
        [
          {
            name: 'englishMetaTitle',
            type: 'text',
            label: 'Meta-Title (English) *',
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.mustBeFilled,
                msgArgs: ['The Meta-Title (English)'],
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 70],
                msgArgs: ['The Meta-Title (English)', 70],
              },
            ],
            key: 'englishMetaTitle',
          },
          {
            name: 'englishMetaDescription',
            type: 'textarea',
            label: 'Meta Description (English) *',
            placeholder: `– Include searchable keywords within the description indicating the page content and that will enhance our page SEO–
– Example (EN): Weyyak| watch online movies, series, playes in Arabic –`,
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.mustBeFilled,
                msgArgs: ['The Meta Description (English)'],
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 188],
                msgArgs: ['The Meta Description (English)', 188],
              },
            ],
            key: 'englishMetaDescription',
          },
        ],
        [
          {
            name: 'arabicMetaTitle',
            type: 'text',
            label: 'Meta-Title (Arabic) *',
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.mustBeFilled,
                msgArgs: ['The Meta-Title (Arabic)'],
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 70],
                msgArgs: ['The Meta-Title (Arabic)', 70],
              },
            ],
            key: 'arabicMetaTitle',
          },
          {
            name: 'arabicMetaDescription',
            type: 'textarea',
            label: 'Meta Description (Arabic) *',
            placeholder: `– Include searchable keywords within the description indicating the page content and that will enhance our page SEO–
– Example (AR): وياك تمتع بمجموعة منوعة من المسلسلات والأفلام والبرامج بالعربي –`,
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.mustBeFilled,
                msgArgs: ['The Meta Description (Arabic)'],
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 188],
                msgArgs: ['The Meta Description (Arabic)', 188],
              },
            ],
            key: 'arabicMetaDescription',
          },
        ],
      ],
    },
    translation: {
      fields: {
        originType: {
          element: MultiSelect,
          elementType: 'multiselect',
          label: 'Language *',
          props: {
            name: 'languageType',
            type: 'select',
            componentClass: 'select',
            multiple: false,
            validations: [
              {
                name: 'required',
                customMessage: validationMessages.specifyData,
                msgArgs: ['Language'],
              },
            ],
          },
        },
        dubbingLanguage: {
          element: MultiSelect,
          elementType: 'multiselect',
          label: 'Dubbing Language *',
          props: {
            name: 'dubbingLanguage',
            type: 'select',
            componentClass: 'select',
            validations: [
              {
                name: 'required',
                customMessage: validationMessages.specifyData,
                msgArgs: ['Dubbing Language'],
              },
            ],
            multiple: false,
          },
        },
        subtitlingLanguage: {
          element: MultiSelect,
          elementType: 'multiselect',
          label: 'Subtitling Language *',
          props: {
            name: 'subtitling',
            type: 'select',
            componentClass: 'select',
            validations: [
              {
                name: 'required',
                customMessage: validationMessages.specifyData,
                msgArgs: ['Subtitling Language'],
              },
            ],
            multiple: false,
          },
        },
        dialect: {
          element: MultiSelect,
          elementType: 'multiselect',
          label: 'Dubbed Dialect *',
          props: {
            name: 'dubbingLanguage',
            type: 'select',
            componentClass: 'select',
            validations: [
              {
                name: 'required',
                customMessage: validationMessages.specifyData,
                msgArgs: ['Dubbed Dialect'],
              },
            ],
            multiple: false,
          },
        },
      },
    },
    contentFields: {
      fields: [
        {
          name: 'posterImage',
          preview: true,
          dataType: constants.NON_TEXTUAL_DATA_TYPE.IMAGE,
          label: 'Poster Image *',
          fileParametersValidation: {
            resolution: resolution => '811x811' == resolution,
            type: type =>
              ['image/png', 'image/jpeg'].some (value => value == type),
            size: size => constants.ONE_MEGABYTE >= size,
          },
          validationMessages: {
            resolution: 'Image size should be 811x811 px',
            type: 'File format should be JPG or PNG',
            size: 'File size should be no more than 1Mb',
          },
          validationRules: [
            {
              name: 'required',
              customMessage: validationMessages.specifyData,
              msgArgs: ['Poster Image'],
            },
          ],
        },
        {
          name: 'overlayPosterImage',
          preview: true,
          dataType: constants.NON_TEXTUAL_DATA_TYPE.IMAGE,
          label: 'Overlay Poster Image *',
          fileParametersValidation: {
            resolution: resolution => '811x811' == resolution,
            type: type =>
              ['image/png', 'image/jpeg'].some (value => value == type),
            size: size => constants.ONE_MEGABYTE >= size,
          },
          validationMessages: {
            resolution: 'Image size should be 811x811 px',
            type: 'File format should be JPG or PNG',
            size: 'File size should be no more than 1Mb',
          },
          validationRules: [
            {
              name: 'required',
              customMessage: validationMessages.specifyData,
              msgArgs: ['Overlay Poster Image'],
            },
          ],
        },
        {
          name: 'detailsBackground',
          preview: true,
          dataType: constants.NON_TEXTUAL_DATA_TYPE.IMAGE,
          label: "Detail's page Background *",
          fileParametersValidation: {
            resolution: resolution => '2048x670' == resolution,
            type: type =>
              ['image/png', 'image/jpeg'].some (value => value == type),
            size: size => constants.ONE_MEGABYTE >= size,
          },
          validationMessages: {
            resolution: 'Image size should be 2048x670 px',
            type: 'File format should be JPG or PNG',
            size: 'File size should be no more than 1Mb',
          },
          validationRules: [
            {
              name: 'required',
              customMessage: validationMessages.specifyData,
              msgArgs: ["Detail's page Background"],
            },
          ],
        },
        {
          name: 'mobileDetailsBackground',
          preview: true,
          dataType: constants.NON_TEXTUAL_DATA_TYPE.IMAGE,
          label: "Mobile Detail's page Background *",
          fileParametersValidation: {
            resolution: resolution => '1125x540' == resolution,
            type: type =>
              ['image/png', 'image/jpeg'].some (value => value == type),
            size: size => constants.ONE_MEGABYTE >= size,
          },
          validationMessages: {
            resolution: 'Image size should be 1125x540 px',
            type: 'File format should be JPG or PNG',
            size: 'File size should be no more than 1Mb',
          },
          validationRules: [
            {
              name: 'required',
              customMessage: validationMessages.specifyData,
              msgArgs: ["Mobile Detail's page Background"],
            },
          ],
        },
      ],
    },
    rightsSection: {
      fields: {
        rightsStartDate: {
          name: 'digitalRightsStartDate',
          label: 'Digital Rights-Start Date *',
          validations: [
            {
              name: 'required',
              customMessage: validationMessages.specifyData,
              msgArgs: ['Digital Rights-Start Date'],
            },
          ],
        },
        rightsEndDate: {
          name: 'digitalRightsEndDate',
          label: 'Digital Rights-End Date *',
          validations: [
            {
              name: 'required',
              customMessage: validationMessages.specifyData,
              msgArgs: ['Digital Rights-End Date'],
            },
          ],
        },
        rightsType: {
          element: MultiSelect,
          elementType: 'multiselect',
          label: 'Rights Type *',
          props: {
            name: 'digitalRightsType',
            type: 'select',
            componentClass: 'select',
            validations: [
              {
                name: 'required',
                customMessage: validationMessages.specifyData,
                msgArgs: ['Rights Type'],
              },
            ],
            multiple: false,
          },
        },       
        plansType: {
          element: MultiSelect,
          elementType: 'multiselect',
          label: 'Plans',
          props: {
            name: 'plansType',
            type: 'select',
            componentClass: 'select',
            validations: [
              { 
                name:'required',
                customMessage:validationMessages.specifyData,
              },
            ],
            multiple: true,
          },
        },
        rightsRegion: {
          element: MultiSelect,
          elementType: 'multiselect',
          label: 'Rights Region *',
          props: {
            name: 'digitalRightsRegions',
            type: 'select',
            componentClass: 'select',
            validations: [
              {
                name: 'required',
                customMessage: validationMessages.specifyData,
                msgArgs: ['Rights Region'],
              },
            ],
            multiple: false,
          },
        },
      },
    },
    products: {
      fields: {
        element: MultiSelect,
        elementType: 'multiselect',
        label: 'Product Name',
        props: {
          name: 'product',
          type: 'select',
          componentClass: 'select',
          validations: [
            {
              name: 'required',
              customMessage: validationMessages.specifyData,
              msgArgs: ['Product Name'],
            },
          ],
          multiple: true,
        },
      },
    },
    TrailerFields: {
      fields: {
        TrailerID: {
          element: FormControl,
          label: 'Trailer ID',
          props: {
              name: `videoTrailerId`,
              className: "form-control",
              type: 'text',
              validations: [
                  // {
                  //     name: 'required',
                  //     customMessage: validationMessages.specifyData,
                  //     msgArgs: ['Trailer ID']
                  // },
                  {
                      name: 'dataInRange',
                      customMessage: validationMessages.tooLong,
                      args: [0, 256],
                      msgArgs: ['Trailer ID', 256]
                  }
              ],
              key: 'videoTrailerId'
          },
         },
        TrailerPoster:{
          key: 0,
          name: 'trailerposterImage',
          preview: true,
          dataType: constants.CONTENT.TRAILERS_POSTER.IMAGE,
          label: 'Trailer Poster Image',
          fileParametersValidation: {
            resolution: resolution => '1920x1080' == resolution,
            type: type =>
              ['image/png', 'image/jpeg'].some (value => value == type),
            size: size => ONE_MEGABYTE >= size,
          },
          validationMessages: {
            resolution: 'Image size should be 1920x1080 px',
            type: 'File format should be JPG or PNG',
            size: 'File size should be no more than 1Mb',
          },
          validationRules: [
            // {
            //   name: 'required',
            //   customMessage: validationMessages.specifyData,
            //   msgArgs: ['Trailer Poster Image (to Publish the content)'],
            // },
          ],
        },
        Trailers: [{
          element: FormControl,
          label: 'English Description',
          props: {
              name: "englishTitle",
              className: "form-control",
              type: 'text',
              validations: [
                  // {
                  //     name: 'required',
                  //     customMessage: validationMessages.specifyData,
                  //     msgArgs: ['English Title']
                  // },
                  {
                      name: 'dataInRange',
                      customMessage: validationMessages.tooLong,
                      args: [0, 256],
                      msgArgs: ['English Description', 256]
                  },
              ],
              key: 'englishTitle'
          },  
      },{
          element: FormControl,
          label: 'Arabic Description',
          props: {
              name: "arabicTitle",
              className: "form-control",
              type: 'text',
              validations: [
                  // {
                  //     name: 'required',
                  //     customMessage: validationMessages.specifyData,
                  //     msgArgs: ['Arabic Title']
                  // },
                  {
                      name: 'dataInRange',
                      customMessage: validationMessages.tooLong,
                      args: [0, 256],
                      msgArgs: ['Arabic Description', 256]
                  }
              ],
              key: 'arabicTitle'
          },
      }],
      ValidateTrailersTitle: [{
        element: FormControl,
        label: 'English Description *',
        props: {
            name: "englishTitle",
            className: "form-control",
            type: 'text',
            validations: [
                {
                    name: 'required',
                    customMessage: validationMessages.specifyData,
                    msgArgs: ['English Description']
                },
                {
                    name: 'dataInRange',
                    customMessage: validationMessages.tooLong,
                    args: [0, 256],
                    msgArgs: ['English Description', 256]
                },
            ],
            key: 'englishTitle'
        },
    },{
        element: FormControl,
        label: 'Arabic Description *',
        props: {
            name: "arabicTitle",
            className: "form-control",
            type: 'text',
            validations: [
                {
                    name: 'required',
                    customMessage: validationMessages.specifyData,
                    msgArgs: ['Arabic Description']
                },
                {
                    name: 'dataInRange',
                    customMessage: validationMessages.tooLong,
                    args: [0, 256],
                    msgArgs: ['Arabic Description', 256]
                }
            ],
            key: 'arabicTitle'
        },
    }],
    ValidateTrailerPoster:{
      key: 0,
      name: 'trailerposterImage',
      preview: true,
      dataType: constants.CONTENT.TRAILERS_POSTER.IMAGE,
      label: 'Trailer Poster Image *',
      fileParametersValidation: {
        resolution: resolution => '1920x1080' == resolution,
        type: type =>
          ['image/png', 'image/jpeg'].some (value => value == type),
        size: size => ONE_MEGABYTE >= size,
      },
      validationMessages: {
        resolution: 'Image size should be 1920x1080 px',
        type: 'File format should be JPG or PNG',
        size: 'File size should be no more than 1Mb',
      },
      validationRules: [
        {
          name: 'required',
          customMessage: validationMessages.specifyData,
          msgArgs: ['Trailer Poster Image (to Publish the content)'],
        },
      ],
    }
      },
    },
    
  },
  episode: {
    title: {
      element: MultiSelect,
      elementType: 'multiselect',
      label: 'Title *',
      props: {
        name: 'contentId',
        type: 'select',
        componentClass: 'select',
        multiple: false,
        validations: [
          {
            name: 'required',
            customMessage: validationMessages.specifyData,
            msgArgs: ['Title'],
          },
        ],
      },
    },
    season: {
      element: MultiSelect,
      elementType: 'multiselect',
      label: 'Season *',
      props: {
        name: 'seasonId',
        type: 'select',
        componentClass: 'select',
        multiple: false,
        validations: [
          {
            name: 'required',
            customMessage: validationMessages.specifyData,
            msgArgs: ['Season'],
          },
        ],
      },
    },
    primaryInfo: {
      fields: [
        [
          {
            name: 'number',
            type: 'text',
            label: 'Episode № *',
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.specifyData,
                msgArgs: ['Episode Number'],
              },
              {
                name: 'dataInRangeInteger',
                args: [1, 100000],
                msgArgs: ['Episode Number', 1, 100000],
              },
              {
                name: 'unique',
                dynamicArgs: 'savedEpisodesAndTitles',
                formScope: true,
                msgArgs: ['Episode with this Number', 'Season'],
                customMessage: validationMessages.unique,
              },
            ],
            key: 'number',
          },

          {
            name: 'videoContentId',
            element: FormControl,
            label: 'Content ID *',
            type: 'text',
            props: {
              name: 'videoContentId',
              className: 'form-control',
              type: 'text',
              validations: [
                {
                  name: 'required',
                  customMessage: validationMessages.specifyData,
                  msgArgs: ['Content ID'],
                },
                {
                  name: 'dataInRange',
                  customMessage: validationMessages.tooLong,
                  args: [0, 256],
                  msgArgs: ['Content ID', 256],
                },
                // {
                //     name: 'transcoding',
                //     server: true
                // }
              ],
              key: 'videoContentId',
            },
            key: 'videoContentId',
          },

          {
            name: 'notes',
            type: 'textarea',
            label: 'Notes',
            validationRules: [
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 80],
                msgArgs: ['Notes', 80],
              },
            ],
            key: 'notes',
          },
          {
            name: 'synopsisEnglish',
            type: 'textarea',
            label: 'Synopsis (English) *',
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.specifyData,
                msgArgs: ['Synopsis (English)'],
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 188],
                msgArgs: ['Synopsis (English)', 188],
              },
            ],
            key: 'synopsisEnglish',
          },
          {
            name: 'introStart',
            type: 'text',
            label: 'Intro Start Time ',
            validationRules: [
              {
                name: 'minuteSecondsoptional',
                customMessage: validationMessages.enterTime,
              },
            ],
            key: 'introStart',
          },
          
        ],
        [
          {
            name: 'originalTitle',
            type: 'text',
            label: 'Original Title',
            validationRules: [
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 255],
                msgArgs: ['Original Title', 255],
              },
            ],
            key: 'originalTitle',
          },
          {
            name: 'alternativeTitle',
            type: 'text',
            label: 'Alternative Title',
            validationRules: [
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 60],
                msgArgs: ['Alternative Title', 60],
              },
            ],
            key: 'alternativeTitle',
          },
          {
            name: 'arabicTitle',
            type: 'text',
            label: 'Arabic Title *',
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.specifyData,
                msgArgs: ['Arabic Title'],
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 25],
                msgArgs: ['Arabic Title', 25],
              },
            ],
            key: 'arabicTitle',
          },
          {
            name: 'transliteratedTitle',
            type: 'text',
            label: 'Transliterated Title *',
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.specifyData,
                msgArgs: ['Transliterated Title'],
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 25],
                msgArgs: ['Transliterated Title', 25],
              },
            ],
            key: 'transliteratedTitle',
          },
          {
            name: 'synopsisArabic',
            type: 'textarea',
            label: 'Synopsis (Arabic) *',
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.specifyData,
                msgArgs: ['Synopsis (Arabic)'],
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 174],
                msgArgs: ['Synopsis (Arabic)', 174],
              },
            ],
            key: 'synopsisArabic',
          },
          {
            name: 'outroStart',
            type: 'text',
            label: 'Outro Start Time',
            validationRules: [
              {
                name: 'hourMinuteSecondsoptional',
                customMessage: validationMessages.enterFullTime,
              },
            ],
            key: 'outroStart',
          },
        ],
      ],
    },
    seoDetails: {
      fields: [
        [
          {
            name: 'englishMetaTitle',
            type: 'text',
            label: 'Meta-Title (English) *',
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.mustBeFilled,
                msgArgs: ['The Meta-Title (English)'],
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 70],
                msgArgs: ['The Meta-Title (English)', 70],
              },
            ],
            key: 'englishMetaTitle',
          },
          {
            name: 'englishMetaDescription',
            type: 'textarea',
            label: 'Meta Description (English) *',
            placeholder: `– Include searchable keywords within the description indicating the page content and that will enhance our page SEO–
– Example (EN): Weyyak| watch online movies, series, playes in Arabic –`,
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.mustBeFilled,
                msgArgs: ['The Meta Description (English)'],
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 188],
                msgArgs: ['The Meta Description (English)', 188],
              },
            ],
            key: 'englishMetaDescription',
          },
        ],
        [
          {
            name: 'arabicMetaTitle',
            type: 'text',
            label: 'Meta-Title (Arabic) *',
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.mustBeFilled,
                msgArgs: ['The Meta-Title (Arabic)'],
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 70],
                msgArgs: ['The Meta-Title (Arabic)', 70],
              },
            ],
            key: 'arabicMetaTitle',
          },
          {
            name: 'arabicMetaDescription',
            type: 'textarea',
            label: 'Meta Description (Arabic) *',
            placeholder: `– Include searchable keywords within the description indicating the page content and that will enhance our page SEO–
– Example (AR): وياك تمتع بمجموعة منوعة من المسلسلات والأفلام والبرامج بالعربي –`,
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.mustBeFilled,
                msgArgs: ['The Meta Description (Arabic)'],
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 188],
                msgArgs: ['The Meta Description (Arabic)', 188],
              },
            ],
            key: 'arabicMetaDescription',
          },
        ],
      ],
    },
    nonTextualData: {
      fields: [
        {
          name: 'posterImage',
          preview: true,
          dataType: constants.NON_TEXTUAL_DATA_TYPE.IMAGE,
          label: 'Poster Image *',
          fileParametersValidation: {
            resolution: resolution => '811x811' == resolution,
            type: type =>
              ['image/png', 'image/jpeg'].some (value => value == type),
            size: size => ONE_MEGABYTE >= size,
          },
          validationMessages: {
            resolution: 'Image size should be 811x811 px',
            type: 'File format should be JPG or PNG',
            size: 'File size should be no more than 1Mb',
          },
          validationRules: [
            {
              name: 'required',
              customMessage: validationMessages.specifyData,
              msgArgs: ['Poster Image'],
            },
          ],
        },
        {
          name: 'dubbingScript',
          preview: true,
          dataType: constants.NON_TEXTUAL_DATA_TYPE.FILE,
          label: 'Dubbing Script',
          fileParametersValidation: {
            type: type => ['text/plain'].some (value => value == type),
            size: size => TEN_MEGABYTES >= size,
          },
          validationMessages: {
            type: 'File format should be TXT',
            size: 'File size should not exceed 10Mb',
          },
        },
        {
          name: 'subtitlingScript',
          preview: true,
          dataType: constants.NON_TEXTUAL_DATA_TYPE.FILE,
          label: 'Subtitling Script',
          fileParametersValidation: {
            type: type => ['text/plain'].some (value => value == type),
            size: size => TEN_MEGABYTES >= size,
          },
          validationMessages: {
            type: 'File format should be TXT',
            size: 'File size should not exceed 10Mb',
          },
        },
      ],
    },
    rightsSection: {
      fields: {
        rightsStartDate: {
          name: 'digitalRightsStartDate',
          label: 'Digital Rights-Start Date *',
          disabled: true,
          showIcon: false,
          validations: [
            {
              name: 'required',
              customMessage: validationMessages.specifyData,
              msgArgs: ['Digital Rights-Start Date'],
            },
          ],
        },
        rightsEndDate: {
          name: 'digitalRightsEndDate',
          label: 'Digital Rights-End Date *',
          showIcon: false,
          disabled: true,
          validations: [
            {
              name: 'required',
              customMessage: validationMessages.specifyData,
              msgArgs: ['Digital Rights-End Date'],
            },
          ],
        },
        rightsType: {
          element: MultiSelect,
          elementType: 'multiselect',
          label: 'Rights Type *',
          props: {
            name: 'digitalRightsType',
            type: 'select',
            componentClass: 'select',
            disabled: true,
            validations: [
              {
                name: 'required',
                customMessage: validationMessages.specifyData,
                msgArgs: ['Rights Type'],
              },
            ],
            multiple: false,
          },
        },
        plansType: {
          element: MultiSelect,
          elementType: 'multiselect',
          label: 'Plans',
          props: {
            name: 'plansType',
            type: 'select',
            componentClass: 'select',
            validations: [
              {
                
              },
            ],
            multiple: true,
          },
        },
        rightsRegion: {
          element: MultiSelect,
          elementType: 'multiselect',
          label: 'Rights Region *',
          props: {
            name: 'digitalRightsRegions',
            type: 'select',
            componentClass: 'select',
            disabled: true,
            validations: [
              {
                name: 'required',
                customMessage: validationMessages.specifyData,
                msgArgs: ['Rights Region'],
              },
            ],
            multiple: false,
          },
        },
      },
    },
    scheduling: {
      name: 'scheduling',
      label: 'Date & Time',
      validations: [
        {
          name: 'dateTimeIsNotPast',
          msgArgs: ['Date & Time'],
        },
      ],
    },
    platforms: {
      name: 'publishingPlatforms',
      validations: [
        {
          name: 'required',
          customMessage: validationMessages.specifyData,
          msgArgs: ['Where to Publish'],
        },
      ],
    },  
    
  },
};

export const SiteManagement = {
  playlistCreator: {
    playlistDetails: {
      fields: [
        [
          {
            name: 'englishTitle',
            type: 'text',
            label: 'Playlist English Title *',
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.mustBeFilled,
                msgArgs: ['Playlist English Title'],
              },
              {
                name: 'consistNotOnlySpecialSymbols',
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 65],
                msgArgs: ['Playlist English Title', 65],
              },
            ],
            key: 'englishTitle',
          },
        ],
        [
          {
            name: 'arabicTitle',
            type: 'text',
            label: 'Playlist Arabic Title *',
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.mustBeFilled,
                msgArgs: ['Playlist Arabic Title'],
              },
              {
                name: 'consistNotOnlySpecialSymbols',
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 65],
                msgArgs: ['Playlist Arabic Title', 65],
              },
            ],
            key: 'arabicTitle',
          },
        ],
      ],
    },
    seoDetails: {
      fields: [
        [
          {
            name: 'englishMetaTitle',
            type: 'text',
            label: 'Meta-Title (English) *',
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.mustBeFilled,
                msgArgs: ['The Meta-Title (English)'],
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 70],
                msgArgs: ['The Meta-Title (English)', 70],
              },
            ],
            key: 'englishMetaTitle',
          },
          {
            name: 'englishMetaDescription',
            type: 'textarea',
            label: 'Meta Description (English) *',
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.mustBeFilled,
                msgArgs: ['The Meta Description (English)'],
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 188],
                msgArgs: ['The Meta Description (English)', 188],
              },
            ],
            key: 'englishMetaDescription',
          },
        ],
        [
          {
            name: 'arabicMetaTitle',
            type: 'text',
            label: 'Meta-Title (Arabic) *',
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.mustBeFilled,
                msgArgs: ['The Meta-Title (Arabic)'],
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 70],
                msgArgs: ['The Meta-Title (Arabic)', 70],
              },
            ],
            key: 'arabicMetaTitle',
          },
          {
            name: 'arabicMetaDescription',
            type: 'textarea',
            label: 'Meta Description (Arabic) *',
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.mustBeFilled,
                msgArgs: ['The Meta Description (Arabic)'],
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 188],
                msgArgs: ['The Meta Description (Arabic)', 188],
              },
            ],
            key: 'arabicMetaDescription',
          },
        ],
      ],
    },
    scheduling: {
      fields: {
        schedulingStartDate: {
          name: 'schedulingStartDate',
          label: 'Start Date',
        },
        schedulingEndDate: {
          name: 'schedulingEndDate',
          label: 'End Date',
        },
        validationField: {
          name: 'validationField',
        },
      },
    },
    pages: {
      fields: {
        id: 'playlist-pages',
        multi: true,
        optionKeys: {
          valueKey: 'id',
        },
        formatLabel: function (item) {
          const platforms = item.isHome && !!item.availableOn
            ? `(${item.availableOn})`
            : '';
          return `${item.isDisabled ? '(hidden)' : ''} ${item.englishTitle} ${platforms}`;
        },
        label: 'Select page title:',
        placeholder: 'Select pages',
      },
    },
    publishOn: {
      platforms: {
        label: 'Where to Publish *',
        name: 'publishingPlatforms',
        validations: [
          {
            name: 'required',
            customMessage: validationMessages.specifyData,
            msgArgs: ['Where to Publish'],
          },
        ],
      },
      regions: {
        label: 'Page Regions *',
        props: {
          name: 'regions',
          placeholder: 'Search Regions...',
          validations: [
            {
              name: 'required',
              customMessage: validationMessages.specifyData,
              msgArgs: ['Page Regions'],
            },
          ],
        },
      },
    },
  },
  pageCreator: {
    pageDetails: {
      fields: [
        [
          {
            name: 'englishTitle',
            type: 'text',
            label: 'Page English Title *',
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.mustBeFilled,
                msgArgs: ['Page English Title'],
              },
              {
                name: 'urlSafeCharacters',
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 50],
                msgArgs: ['Page English Title', 50],
              },
            ],
            key: 'englishTitle',
          },
        ],
        [
          {
            name: 'arabicTitle',
            type: 'text',
            label: 'Page Arabic Title *',
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.mustBeFilled,
                msgArgs: ['Page Arabic Title'],
              },
              {
                name: 'urlSafeCharacters',
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 50],
                msgArgs: ['Page Arabic Title', 50],
              },
            ],
            key: 'arabicTitle',
          },
        ],
      ],
      orderNumberField: {
        element: FormControl,
        elementType: 'select',
        label: 'Order Within The Menu *',
        props: {
          name: 'pageOrderNumber',
          type: 'select',
          key: 'pageOrderNumber',
          componentClass: 'select',
          validations: [
            {
              name: 'selectRequired',
              customMessage: validationMessages.specifyData,
              msgArgs: ['Order Within The Menu'],
            },
          ],
        },
        children: [],
        config: {
          optionsKey: 'pagesOrderNumbers',
          optionValue: 'pageOrderNumber',
          optionLabel: function () {
            if (!!this.englishTitle)
              return `${this.pageOrderNumber} (${this.englishTitle})`;
            else return this.pageOrderNumber;
          },
          emptyOption: false,
        },
      },
      playlistsField: {
        id: 'page-playlists',
        multi: true,
        optionKeys: {
          valueKey: 'id',
        },
        formatLabel: function (item) {
          return `${item.isDisabled ? '(hidden)' : ''} ${item.englishTitle}_${item.arabicTitle}`;
        },
        label: 'Playlists',
        placeholder: 'Select playlists',
      },
    },
    contentFields: {
      fields: [
        {
          name: 'menuPosterImage',
          preview: true,
          dataType: constants.NON_TEXTUAL_DATA_TYPE.IMAGE,
          label: 'Poster Image *',
          fileParametersValidation: {
            resolution: resolution => '222x394' == resolution,
            type: type =>
              ['image/png', 'image/jpeg'].some (value => value == type),
            size: size => constants.ONE_MEGABYTE >= size,
          },
          validationMessages: {
            resolution: 'Image size should be 222x394 px',
            type: 'File format should be JPG or PNG',
            size: 'File size should be no more than 1Mb',
          },
          validationRules: [
            {
              name: 'required',
              customMessage: validationMessages.specifyData,
              msgArgs: ['Poster Image to publish the page.'],
            },
          ],
        },
        {
          name: 'mobileMenuPosterImage',
          preview: true,
          dataType: constants.NON_TEXTUAL_DATA_TYPE.IMAGE,
          label: "Mobile's Poster Image   *",
          fileParametersValidation: {
            resolution: resolution => '160x290' == resolution,
            type: type =>
              ['image/png', 'image/jpeg'].some (value => value == type),
            size: size => constants.ONE_MEGABYTE >= size,
          },
          validationMessages: {
            resolution: 'Image size should be 160x290 px',
            type: 'File format should be JPG or PNG',
            size: 'File size should be no more than 1Mb',
          },
          validationRules: [
            {
              name: 'required',
              customMessage: validationMessages.specifyData,
              msgArgs: ["Mobile's Poster Image to publish the page."],
            },
          ],
        },
        {
          name: 'mobileMenu',
          preview: true,
          dataType: constants.NON_TEXTUAL_DATA_TYPE.IMAGE,
          label: "Menu Image *",
          fileParametersValidation: {
            resolution: resolution => '61x60' == resolution,
            type: type =>
              ['image/png', 'image/jpeg'].some (value => value == type),
            size: size => constants.ONE_MEGABYTE >= size,
          },
          validationMessages: {
            resolution: 'Image size should be 61x60 px',
            type: 'File format should be JPG or PNG',
            size: 'File size should be no more than 1Mb',
          },
          validationRules: [
            {
              name: 'required',
              customMessage: validationMessages.specifyData,
              msgArgs: [
                "Menu Image to publish the page.",
              ],
            },
          ],
        },
      ],
    },
    seoDetails: {
      fields: [
        [
          {
            name: 'englishPageFriendlyUrl',
            type: 'text',
            label: 'Page Friendly URL (English) *',
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.mustBeFilled,
                msgArgs: ['The Page Friendly URL (English) *'],
              },
            ],
            key: 'englishPageFriendlyUrl',
            disabled: true,
          },
          {
            name: 'englishMetaTitle',
            type: 'text',
            label: 'Meta-Title (English) *',
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.mustBeFilled,
                msgArgs: ['The Meta-Title (English)'],
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 70],
                msgArgs: ['The Meta-Title (English)', 70],
              },
            ],
            key: 'englishMetaTitle',
          },
          {
            name: 'englishMetaDescription',
            type: 'textarea',
            label: 'Meta Description (English) *',
            placeholder: `– Include searchable keywords within the description indicating the page content and that will enhance our page SEO–
– Example (EN): Weyyak| watch online movies, series, playes in Arabic –`,
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.mustBeFilled,
                msgArgs: ['The Meta Description (English)'],
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 188],
                msgArgs: ['The Meta Description (English)', 188],
              },
            ],
            key: 'englishMetaDescription',
          },
        ],
        [
          {
            name: 'arabicPageFriendlyUrl',
            type: 'text',
            label: 'Page Friendly URL (Arabic) *',
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.mustBeFilled,
                msgArgs: ['The Page Friendly URL (Arabic) *'],
              },
            ],
            key: 'arabicPageFriendlyUrl',
            disabled: true,
          },
          {
            name: 'arabicMetaTitle',
            type: 'text',
            label: 'Meta-Title (Arabic) *',
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.mustBeFilled,
                msgArgs: ['The Meta-Title (Arabic)'],
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 70],
                msgArgs: ['The Meta-Title (Arabic)', 70],
              },
            ],
            key: 'arabicMetaTitle',
          },
          {
            name: 'arabicMetaDescription',
            type: 'textarea',
            label: 'Meta Description (Arabic) *',
            placeholder: `– Include searchable keywords within the description indicating the page content and that will enhance our page SEO–
– Example (AR): وياك تمتع بمجموعة منوعة من المسلسلات والأفلام والبرامج بالعربي –`,
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.mustBeFilled,
                msgArgs: ['The Meta Description (Arabic)'],
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 188],
                msgArgs: ['The Meta Description (Arabic)', 188],
              },
            ],
            key: 'arabicMetaDescription',
          },
        ],
      ],
    },
    publishOn: {
      platforms: {
        label: 'Where to Publish *',
        name: 'publishingPlatforms',
        validations: [
          {
            name: 'required',
            customMessage: validationMessages.specifyData,
            msgArgs: ['Where to Publish'],
          },
        ],
      },
      regions: {
        label: 'Page Regions *',
        props: {
          name: 'regions',
          placeholder: 'Search Regions...',
          validations: [
            {
              name: 'required',
              customMessage: validationMessages.specifyData,
              msgArgs: ['Page Regions'],
            },
          ],
        },
      },
    },
    pageSliders: {
      defaultSlider: {
        id: 'page-default-slider',
        name: 'defaultSliderId',
        multi: false,
        optionKeys: {
          valueKey: 'id',
        },
        formatLabel: function (item) {
          return `${item.isDisabled ? '(hidden)' : ''} ${item.name}`;
        },
        label: 'Default slider *',
        placeholder: 'Select slider',
        validations: [
          {
            name: 'required',
            customMessage: validationMessages.specifyData,
            msgArgs: ['Default Slider *'],
          },
        ],
      },
      sliders: {
        id: 'page-sliders',
        multi: true,
        optionKeys: {
          valueKey: 'id',
        },
        formatLabel: function (item) {
          return `${item.isDisabled ? '(hidden)' : ''} ${item.name}`;
        },
        label: 'Sliders',
        placeholder: 'Select sliders',
      },
    },
  },
  sliderCreator: {
    sliderDetails: {
      fields: [
        [
          {
            name: 'name',
            type: 'text',
            label: 'Slider Name *',
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.mustBeFilled,
                msgArgs: ['The Slider Name'],
              },
              {
                name: 'dataInRange',
                customMessage: validationMessages.tooLong,
                args: [0, 50],
                msgArgs: ['The Slider Name', 50],
              },
              {
                name: 'urlSafeCharactersEnglish',
              },
            ],
            key: 'name',
          },
          {
            name: 'type',
            type: 'select',
            options: 'types',
            optionValue: 'id',
            includeEmptyOption: true,
            optionLabel: function () {
              return `${this.name}`;
            },
            label: 'Slider Type *',
            validationRules: [
              {
                name: 'required',
                customMessage: validationMessages.specifyData,
                msgArgs: ['The Slider Type'],
              },
            ],
            key: 'type',
          },
          {
            name: 'publishingPlatform',
            type: 'select',
            options: 'publishingPlatformsList',
            optionValue: 'id',
            includeEmptyOption: true,
            emptyOption: '– Select Preview Layout –',
            optionLabel: function () {
              return `${this.name}`;
            },
            label: 'Preview Layout',
            validationRules: [],
            key: 'publishingPlatform',
          },
        ],
      ],
    },
    assignPlaylists: {
      blackArea: {
        id: 'slider-black-area-playlist',
        name: 'blackAreaPlaylistId',
        label: 'Black Area *',
        placeholder: '-- Select Playlist --',
        validations: [
          {
            name: 'required',
            customMessage: validationMessages.choose,
            msgArgs: ['playlist', 'Black Area'],
          },
        ],
      },
      redArea: {
        id: 'slider-red-area-playlist',
        name: 'redAreaPlaylistId',
        label: 'Red Area *',
        placeholder: '-- Select Playlist --',
        validations: [
          {
            name: 'required',
            customMessage: validationMessages.choose,
            msgArgs: ['playlist', 'Red Area'],
          },
        ],
      },
      greenArea: {
        id: 'slider-green-area-playlist',
        name: 'greenAreaPlaylistId',
        label: 'Green Area *',
        placeholder: '-- Select Playlist --',
        validations: [
          {
            name: 'required',
            customMessage: validationMessages.choose,
            msgArgs: ['playlist', 'Green Area'],
          },
        ],
      },
    },
    pages: {
      id: 'slider-pages',
      multi: true,
      optionKeys: {
        valueKey: 'id',
        clearableKey: item => !item.isDefault,
      },
      formatLabel: function (item) {
        const platforms = item.isHome && !!item.availableOn
          ? `(${item.availableOn})`
          : '';
        return `${item.isDisabled ? '(hidden)' : ''} ${item.englishTitle} ${platforms}`;
      },
      label: 'Attach to page',
      placeholder: 'Select pages',
    },
    publishOn: {
      platforms: {
        label: 'Where to Publish *',
        name: 'publishingPlatforms',
        validations: [
          {
            name: 'required',
            customMessage: validationMessages.specifyData,
            msgArgs: ['Where to Publish'],
          },
        ],
      },
      regions: {
        label: 'Slider Regions *',
        props: {
          name: 'regions',
          placeholder: 'Search Regions...',
          validations: [
            {
              name: 'required',
              customMessage: validationMessages.specifyData,
              msgArgs: ['Slider Regions'],
            },
          ],
        },
      },
    },
    scheduling: {
      fields: {
        schedulingStartDate: {
          name: 'schedulingStartDate',
          label: 'Start Date *',
          validations: [
            {
              name: 'required',
              customMessage: validationMessages.specifyData,
              msgArgs: ['Scheduling Start Date'],
            },
          ],
        },
        schedulingEndDate: {
          name: 'schedulingEndDate',
          label: 'End Date *',
          validations: [
            {
              name: 'required',
              customMessage: validationMessages.specifyData,
              msgArgs: ['Scheduling End Date'],
            },
          ],
        },
      },
    },
  },
};
