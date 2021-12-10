import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import Notification from 'components/core/Notification';
import constants from 'constants/constants';

/**
 * Returns a validation message node
 * @param {Object} msg - a text message to be displayed
 * @returns {ReactNode} React node
 */
export function getValidationMessage (msg) {
  return <div className="bo-essel-error error">{msg}</div>;
}

/**
 * Utility function to properly build output string from source object based on buildMap
 * @param {String|Function} buildMap - builder function or object property name string
 * @param {Object} obj - source object
 * @returns {String} output string
 * */
export function buildString (buildMap, obj) {
  return buildMap instanceof Function ? buildMap.call (obj) : obj[buildMap];
}

export function formatString (string, ...params) {
  let formatedString = string;

  if (params && params.length > 0) {
    params.forEach ((param, index) => {
      formatedString = formatedString.replace (
        new RegExp (`\\{${index}\\}`),
        param
      );
    });
  }

  return formatedString;
}

export function getPageId (url) {
  try {
    const arr = url.split ('/');
    const pageId = arr[arr.length - 1];
    return pageId;
  } catch (e) {
    return null;
  }
}

/**
 * Move element in array from one position to another
 */
export function arraymove(arr, fromIndex, toIndex) {
  var element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}

/**
 * Get name of setter function by store prop name
 * @param {String} propName - property name in store
 * @param {String} [prefix=set] - optional prefix
 * @returns {String} setter function name
 */
export const getSetterName = (propName, prefix = 'set') =>
  `${prefix}${propName.charAt (0).toUpperCase ()}${propName.substr (1)}`;

/**
 * Get name of fetch function by store prop name
 * @param {String} propName - property name in store
 * @param {String} [prefix=fetch] - optional prefix
 * @returns {String} setter function name
 */
export const getFetcherName = (propName, prefix = 'fetch') =>
  `${prefix}${propName.charAt (0).toUpperCase ()}${propName.substr (1)}`;

/**
 * Builds full name
 * @param {String} transliteratedTitle - item transliterated title
 * @param {Object} translation - item translation
 * @returns {String} full season name
 */
export const getTranslation = translation =>
  `${translation.languageType != 'Original' ? `_${translation.languageType
        .charAt (0)
        .toUpperCase ()}` : ''}` +
  `${translation.dubbingLanguage ? translation.dubbingLanguage
        .charAt (0)
        .toUpperCase () : ''}` +
  `${translation.subtitlingLanguage ? translation.subtitlingLanguage
        .charAt (0)
        .toUpperCase () : ''}`;

/**
 * Builds full name
 * @param {String} transliteratedTitle - item transliterated title
 * @param {Object} translation - item translation
 * @returns {String} full season name
 */
export const buildFullName = (transliteratedTitle, translation, number) =>
  `${transliteratedTitle}\
    ${translation.languageType != 'Original' ? `_${translation.languageType
          .charAt (0)
          .toUpperCase ()}` : ''}\
    ${translation.dubbingLanguage ? translation.dubbingLanguage
          .charAt (0)
          .toUpperCase () : ''}\
    ${translation.subtitlingLanguage ? translation.subtitlingLanguage
          .charAt (0)
          .toUpperCase () : ''}\
    ${number ? `_${number}` : ''}`;

/**
 * Builds full season name
 * @param {Object} primaryInfo - item primary info
 * @param {Object} translation - item translation
 * @returns {String} full season name
 */
export const buildFullSeasonName = (primaryInfo, translation, rights) =>
  `${primaryInfo.transliteratedTitle}` +
  `_`+`${rights.digitalRightsType == 1?"A":"S"}`+`${primaryInfo.seasonNumber}` +
  `${translation.languageType != 'Original' ? `_${translation.languageType
        .charAt (0)
        .toUpperCase ()}` : ''}` +
  `${translation.dubbingLanguage ? translation.dubbingLanguage
        .charAt (0)
        .toUpperCase () : ''}` +
  `${translation.subtitlingLanguage ? translation.subtitlingLanguage
        .charAt (0)
        .toUpperCase () : ''}`;

/**
 * Scroll up to beginning of the page
 */
export const scrollUp = () => {
  window.scrollTo (0, 0);
};

/**
 * Scroll down from the header
 */
export const scrollDownFromHeader = () => {
  const header = document.getElementById ('header');
  header && window.scrollBy (0, -header.offsetHeight);
};

/**
 * Adds 'data-form-type' attribute from form.
 */
export const addDataSaveDraftAttr = node =>
  findDOMNode (node).setAttribute ('data-form-type', 'save-draft');

/**
 * Removes 'data-form-type attribute to form.
 */
export const removeDataSaveDraftAttr = node =>
  findDOMNode (node).removeAttribute ('data-form-type');

  /**
 * Check whether it is save draft
 * @param node
 */
export const isSaveDraft = form => form.getAttribute ('data-form-type');

/**
 * Send update notification
 * @param {Object} store - store
 */
export const sendUpdateNotification = store =>
  store.setNotification (
    Notification.Notifications.info,
    constants.UPDATE_NOTIFICATION_MESSAGE
  );

/**
 * Get first missed number in array of numbers
 * Get next number whether no missed
 * @param {Array} numbers - array of numbers
 * @returns {Number} - missed number
 */
export const getFirstMissedNumber = numbers => {
  let actualNumber = 1;
  if (numbers && numbers.length) {
    const uniqNumbers = numbers
      .sort ((a, b) => a - b)
      .filter ((item, index, arr) => index === arr.indexOf (item));
    uniqNumbers.some ((season, index, seasons) => {
      if (index > 0 && season - seasons[index - 1] > 1) {
        actualNumber = seasons[index - 1] + 1;
        return true;
      }
      return false;
    });

    if (actualNumber === 1) {
      actualNumber = uniqNumbers.length + 1;
    }

    if (uniqNumbers[0] != 1) {
      actualNumber = 1;
    }
  }
  return actualNumber;
};

/**
 * Remove element in the given index
 * @param {Array} - array 
 * @param {Number} - index 
 * @returns {Number} - array 
 */
export const removeElementFromArray = (array, index) => {
  if (index > -1) {
    array.splice (index, 1);
  }
  return array;
};
