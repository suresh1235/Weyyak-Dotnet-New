import React, {Component, PropTypes} from 'react';
import cloneDeep from 'lodash.clonedeep';
import FieldWrapper from 'components/core/FieldWrapper';
import {SiteManagement} from '../../../constants/contentFields';
import constants from 'constants/constants';
import Notification from 'components/core/Notification';
import FormValidationWrapper from 'components/core/FormValidationWrapper';
import * as UTILS from 'components/core/Utils';
import {observer, inject} from 'mobx-react';
import {sendUpdateNotification} from 'components/core/Utils';
import {Col, Row, Button} from 'react-bootstrap';

const EMPTY_PLATFORM_PAGE_ORDER_INDEX = 100;
/**
 * The class defines a page constructor of site
 */
@inject ('appStore')
@observer
class PageOrderNumberSelect extends Component {
  /** The component properties */
  static propTypes = {
    store: PropTypes.object.isRequired,
    editMode: PropTypes.bool,
  };

  static defaultProps = {
    editMode: false,
  };

  /**
   * Construct one tier management component
   * @param {Object} props - a component's arguments
   */
  constructor (props) {
    super (props);

    this.selectPlatform = this.selectPlatform.bind (this);
    this.onDelete = this.onDelete.bind (this);
    this.onAdd = this.onAdd.bind (this);
    this.onSave = this.onSave.bind (this);
    this.pageOrderData = [];
    // this.getPagesOrderNumbers = this.getPagesOrderNumbers.bind (this);
    this.handlePageOrderNumberChanged = this.handlePageOrderNumberChanged.bind (
      this
    );

    this.pageId = UTILS.getPageId (window.location.href);
    props.store.setPageId (this.pageId);
  }

  handlePageOrderNumberChanged (value, i) {
    this.pageOrderData[i].changedPageOrderNumber = parseInt (value);
    const publishingPlatformsOrder = this.convertPageOrderToPublishingPlatforms ();
    this.props.store.setPublishingPlatformsOrder (publishingPlatformsOrder);
  }

  selectPlatform (platformId, isChecked, index) {

    if (isChecked) {
      const platformIndex = this.pageOrderData[index].platforms.indexOf (
        platformId
      );
      if (index !== -1) {
        this.pageOrderData[index].platforms.splice (platformIndex, 1);
        this.pageOrderData[index].removedPlatforms.push (platformId);
      }
    } else {
      const {store: {getPublishingPlatformsOrder}} = this.props;
      const publishingPlatformsOrder = cloneDeep (getPublishingPlatformsOrder);
      // console.log (
      //  'publishingPlatformsOrder: ',
      //  publishingPlatformsOrder.publishingPlatformOrderedDetails['8']
      // );
      // If empty data, fill it accordingly
      if (
        this.pageOrderData[index].platforms.length === 1 &&
        this.pageOrderData[index].platforms[0] ===
          EMPTY_PLATFORM_PAGE_ORDER_INDEX
      ) {
        this.pageOrderData[index].platforms[0] = platformId;
        this.pageOrderData[index].order =
          publishingPlatformsOrder.publishingPlatformOrderedDetails[platformId];
        const currentPage = this.getCurrentPageData (
          this.pageOrderData[index].order.length + 1
        );
        this.pageOrderData[index].order.push (currentPage);
      } else {
        // Allow checking only if this platform does not have this menu
        let pageIndex = publishingPlatformsOrder.publishingPlatformOrderedDetails[
          platformId
        ].findIndex (ele => ele.pageId === this.pageId);
        // console.log('pageIndex:', pageIndex);

        if (pageIndex === -1) {
          this.pageOrderData[index].platforms.push (platformId);
          const removedPlatformIndex = this.pageOrderData[
            index
          ].removedPlatforms.indexOf (platformId);
          if (removedPlatformIndex !== -1) {
            this.pageOrderData[index].removedPlatforms.splice (
              platformIndex,
              1
            );
          }
        }
      }
    }
    const publishingPlatformsOrder = this.convertPageOrderToPublishingPlatforms ();
    this.props.store.setPublishingPlatformsOrder (publishingPlatformsOrder);
  }

  getCurrentPageData (pageOrderNumber) {
    const data = {
      pageId: this.pageId,
      englishTitle: this.props.englishTitle,
      pageOrderNumber: pageOrderNumber,
      isHome: false,
    };
    return data;
  }

  onSave () {
    // console.log ('onSave');
    const {
      store: {getPublishingPlatformsOrder},
      updateOrderWithinMenu,
    } = this.props;
    let publishingPlatformsOrder = cloneDeep (getPublishingPlatformsOrder);
    delete publishingPlatformsOrder.publishingPlatformOrderedDetails[
      EMPTY_PLATFORM_PAGE_ORDER_INDEX
    ];
    this.props.store.setPublishingPlatformsOrder (publishingPlatformsOrder);
    if (updateOrderWithinMenu) {
      updateOrderWithinMenu ();
    }
  }

  onAdd () {
    const {
      publishOn: {publishingPlatforms: {publishingPlatformsList}},
    } = this.props;
    let count = 0;
    for (let i = 0; i < this.pageOrderData.length; i++) {
      count += this.pageOrderData[i].platforms.length;
    }
    if (count === publishingPlatformsList.length) {
      const {appStore} = this.props;
      appStore.setDisableNotificationReset (true);
      appStore.setNotification (
        Notification.Notifications.validation,
        constants.CANNOT_ADD_MORE
      );
      return;
    }

    const copy = cloneDeep (this.pageOrderData[0]);
    copy.platforms = [EMPTY_PLATFORM_PAGE_ORDER_INDEX];
    this.pageOrderData.push (copy);
    const publishingPlatformsOrder = this.convertPageOrderToPublishingPlatforms ();
    this.props.store.setPublishingPlatformsOrder (publishingPlatformsOrder);
  }

  onDelete (i) {
    const {store: {getOriginalPublishingPlatformsOrder}} = this.props;

    if (this.pageOrderData.length !== 0) {
      if (
        this.pageOrderData.length === 1 &&
        this.pageOrderData[0].platforms[0] === EMPTY_PLATFORM_PAGE_ORDER_INDEX
      ) {
        const {appStore} = this.props;
        appStore.setDisableNotificationReset (true);
        appStore.setNotification (
          Notification.Notifications.validation,
          constants.CANNOT_DELETE_EMPTY
        );
        return;
      }
      const platforms = this.pageOrderData[i].platforms;
      if (this.pageOrderData.length > 0) {
        this.pageOrderData = UTILS.removeElementFromArray (
          this.pageOrderData,
          i
        );
      }
      const publishingPlatformsOrder = this.convertPageOrderToPublishingPlatforms ();
      const originalPublishingPlatformsOrder = cloneDeep (
        getOriginalPublishingPlatformsOrder
      );
      // console.log (
      //   'originalPublishingPlatformsOrder0: ',
      //   publishingPlatformsOrder.publishingPlatformOrderedDetails[0][5]
      // );
      if (platforms && platforms.length > 0) {
        for (let j = 0; j < platforms.length; j++) {
          //TODO if this page did not exist in original, replace with original
          const originalIndex = originalPublishingPlatformsOrder.publishingPlatformOrderedDetails[
            platforms[j]
          ].findIndex (ele => ele.pageId === this.pageId);

          if (-1 === originalIndex) {
            publishingPlatformsOrder.publishingPlatformOrderedDetails[
              platforms[j]
            ] =
              originalPublishingPlatformsOrder.publishingPlatformOrderedDetails[
                platforms[j]
              ];
            continue;
          }

          const index = originalPublishingPlatformsOrder.publishingPlatformOrderedDetails[
            platforms[j]
          ].findIndex (ele => ele.pageId === this.pageId);
          publishingPlatformsOrder.publishingPlatformOrderedDetails[
            platforms[j]
          ] =
            originalPublishingPlatformsOrder.publishingPlatformOrderedDetails[
              platforms[j]
            ];
          if (index !== -1) {
            publishingPlatformsOrder.publishingPlatformOrderedDetails[
              platforms[j]
            ] = UTILS.removeElementFromArray (
              publishingPlatformsOrder.publishingPlatformOrderedDetails[
                platforms[j]
              ],
              index
            );
            for (
              let k = index;
              k <
              publishingPlatformsOrder.publishingPlatformOrderedDetails[j]
                .length;
              k++
            ) {
              publishingPlatformsOrder.publishingPlatformOrderedDetails[j][
                k
              ].pageOrderNumber =
                publishingPlatformsOrder.publishingPlatformOrderedDetails[j][k]
                  .pageOrderNumber - 1;
            }
          }
        }
      }
      // console.log (
      //   'originalPublishingPlatformsOrder1: ',
      //   publishingPlatformsOrder.publishingPlatformOrderedDetails[0][5]
      // );

      this.props.store.setPublishingPlatformsOrder (publishingPlatformsOrder);
    }
  }

  convertPageOrderToPublishingPlatforms () {
    const {
      store: {getPublishingPlatformsOrder, getOriginalPublishingPlatformsOrder},
    } = this.props;
    const publishingPlatformsOrder = cloneDeep (getPublishingPlatformsOrder);
    const originalPublishingPlatformsOrder = cloneDeep (
      getOriginalPublishingPlatformsOrder
    );

    // console.log (
    //   'originalPublishingPlatformsOrder2: ',
    //   publishingPlatformsOrder.publishingPlatformOrderedDetails[0][5]
    // );

    if (this.pageOrderData && this.pageOrderData.length > 0) {
      let emptyDataFound = false;
      for (let i = 0; i < this.pageOrderData.length; i++) {
        const pageOrderDataItem = this.pageOrderData[i];
        const platforms = pageOrderDataItem.platforms;
        const removedPlatforms = pageOrderDataItem.removedPlatforms;
        if (
          pageOrderDataItem.initialPageOrderNumber !==
          pageOrderDataItem.changedPageOrderNumber
        ) {
          const initialPageOrderNumber =
            pageOrderDataItem.initialPageOrderNumber;
          const changedPageOrderNumber =
            pageOrderDataItem.changedPageOrderNumber;
          const initialIndex = pageOrderDataItem.order.findIndex (
            ele => ele.pageOrderNumber === initialPageOrderNumber
          );
          const changedIndex = pageOrderDataItem.order.findIndex (
            ele => ele.pageOrderNumber === changedPageOrderNumber
          );
          UTILS.arraymove (pageOrderDataItem.order, initialIndex, changedIndex);
          let start = changedIndex;
          let end = initialIndex;
          if (initialPageOrderNumber < changedPageOrderNumber) {
            // Going towards last
            start = initialIndex;
            end = changedIndex;
            const newPageOrder =
              pageOrderDataItem.order[changedIndex - 1].pageOrderNumber;
            pageOrderDataItem.order[
              changedIndex
            ].pageOrderNumber = newPageOrder;

            for (let j = start; j < end; j++) {
              pageOrderDataItem.order[j].pageOrderNumber =
                pageOrderDataItem.order[j].pageOrderNumber - 1;
            }
          } else {
            // Going towards first
            const newPageOrder = changedIndex !== 0
              ? pageOrderDataItem.order[changedIndex - 1].pageOrderNumber + 1
              : changedPageOrderNumber;
            pageOrderDataItem.order[
              changedIndex
            ].pageOrderNumber = newPageOrder;

            for (let j = start + 1; j <= end; j++) {
              pageOrderDataItem.order[j].pageOrderNumber =
                pageOrderDataItem.order[j].pageOrderNumber + 1;
            }
          }
        }
        for (let j = 0; j < platforms.length; j++) {
          if (EMPTY_PLATFORM_PAGE_ORDER_INDEX === platforms[j]) {
            emptyDataFound = true;
          }
          publishingPlatformsOrder.publishingPlatformOrderedDetails[
            platforms[j]
          ] =
            pageOrderDataItem.order;
        }
        for (let k = 0; k < removedPlatforms.length; k++) {
          // reset only if this platform did not contain current page
          const index = originalPublishingPlatformsOrder.publishingPlatformOrderedDetails[
            removedPlatforms[k]
          ].findIndex (ele => ele.pageId === this.pageId);
          publishingPlatformsOrder.publishingPlatformOrderedDetails[
            removedPlatforms[k]
          ] =
            originalPublishingPlatformsOrder.publishingPlatformOrderedDetails[
              removedPlatforms[k]
            ];
          if (index !== -1) {
            publishingPlatformsOrder.publishingPlatformOrderedDetails[
              removedPlatforms[k]
            ] = UTILS.removeElementFromArray (
              publishingPlatformsOrder.publishingPlatformOrderedDetails[
                removedPlatforms[k]
              ],
              index
            );
          }
        }
      }
      if (
        !emptyDataFound &&
        publishingPlatformsOrder.publishingPlatformOrderedDetails[
          EMPTY_PLATFORM_PAGE_ORDER_INDEX
        ]
      ) {
        delete publishingPlatformsOrder.publishingPlatformOrderedDetails[
          EMPTY_PLATFORM_PAGE_ORDER_INDEX
        ];
      }
    }
    // console.log (
    //   'originalPublishingPlatformsOrder3: ',
    //   publishingPlatformsOrder.publishingPlatformOrderedDetails[0][5]
    // );
    return publishingPlatformsOrder;
  }
  convertPublishingPlatformsToPageOrder (publishingPlatformsOrder) {
    this.pageOrderData = [];
    const {
      publishOn: {publishingPlatforms: {publishingPlatformsList}},
    } = this.props;

    if (
      publishingPlatformsOrder &&
      publishingPlatformsOrder.publishingPlatformOrderedDetails
    ) {
      if (
        publishingPlatformsOrder.publishingPlatformOrderedDetails[
          EMPTY_PLATFORM_PAGE_ORDER_INDEX
        ]
      ) {
        this.convertPublishingPlatformsToPageOrderArray (
          publishingPlatformsOrder,
          EMPTY_PLATFORM_PAGE_ORDER_INDEX
        );
      }
      for (let i = 0; i < publishingPlatformsList.length; i++) {
        if (
          publishingPlatformsOrder.publishingPlatformOrderedDetails[
            publishingPlatformsList[i].id
          ]
        ) {
          this.convertPublishingPlatformsToPageOrderArray (
            publishingPlatformsOrder,
            publishingPlatformsList[i].id
          );
        }
      }
    }
    if (this.pageOrderData.length === 0) {
      this.fillEmptyPageOrder ();
    }
  }

  convertPublishingPlatformsToPageOrderArray (
    publishingPlatformsOrder,
    platformIndex
  ) {
    const order =
      publishingPlatformsOrder.publishingPlatformOrderedDetails[platformIndex];
    const index = order.findIndex (ele => ele.pageId === this.pageId);
    if (index !== -1) {
      let added = false;
      for (let item of this.pageOrderData) {
        if (
          !item.platforms.includes (EMPTY_PLATFORM_PAGE_ORDER_INDEX) &&
          platformIndex != EMPTY_PLATFORM_PAGE_ORDER_INDEX &&
          JSON.stringify (item.order) === JSON.stringify (order)
        ) {
          item.platforms.push (platformIndex);
          added = true;
          continue;
        }
      }
      if (!added) {
        const data = {
          platforms: [platformIndex],
          removedPlatforms: [],
          order: order,
          initialPageOrderNumber: order[index].pageOrderNumber,
          changedPageOrderNumber: order[index].pageOrderNumber,
        };
        this.pageOrderData.push (data);
      }
    }
  }

  fillEmptyPageOrder () {
    this.pageOrderData = [
      {
        order: [],
        pageOrderNumber: 0,
        platforms: [EMPTY_PLATFORM_PAGE_ORDER_INDEX],
        removedPlatforms: [],
      },
    ];
  }

  /**
   * @see Component#render()
   */
  render () {
    const {
      publishOn: {publishingPlatforms: {publishingPlatformsList}},
      store: {getPublishingPlatformsOrder},
    } = this.props;

    this.convertPublishingPlatformsToPageOrder (getPublishingPlatformsOrder);

    const {
      pageDetails: {orderNumberField: orderNumberField},
    } = SiteManagement.pageCreator;

    const orderNumberFields = [];
    for (let i = 0; i < this.pageOrderData.length; i++) {
      const item = cloneDeep (orderNumberField);
      orderNumberFields.push (item);
    }

    return (
      <div>
        {this.pageOrderData.map ((ele, i) => {
          orderNumberFields[i].config.getOptions = () => ele.order;

          return (
            <div key={i}>
              <div className="page-order-number">
                <Row>
                  <FormValidationWrapper>
                    <div className="form-input-group">
                      <label>{'Select Platforms *'}</label>

                      <div className="multiple-checkbox-container">
                        {publishingPlatformsList &&
                          publishingPlatformsList.map ((platform, key) => {
                            const isChecked = ele.platforms.includes (
                              platform.id
                            );

                            return (
                              <Col
                                md={4}
                                key={key}
                                onMouseDown={() =>
                                  this.selectPlatform (
                                    platform.id,
                                    isChecked,
                                    i
                                  )}
                              >
                                <input
                                  type="checkbox"
                                  value={platform.id}
                                  label={platform.name}
                                  checked={isChecked}
                                />
                                <span>{platform.name}</span>
                              </Col>
                            );
                          })}
                      </div>
                    </div>
                  </FormValidationWrapper>
                </Row>

                <Row>
                  <FieldWrapper
                    key={ele}
                    fieldConfig={orderNumberFields[i]}
                    getStoreValue={() =>
                      this.pageOrderData[i].changedPageOrderNumber}
                    handleChange={e =>
                      this.handlePageOrderNumberChanged (e.target.value, i)}
                    isZeroValidValue={true}
                  />
                </Row>
              </div>
              <div className="text-right order-within-menu">
                <Button
                  className="add-button orange-button"
                  type="button"
                  onClick={() => this.onAdd ()}
                >
                  {'Add'}
                </Button>
                <Button
                  className="save-button orange-button"
                  type="button"
                  onClick={this.onSave}
                >
                  {'Save'}
                </Button>
                <Button
                  className="delete-button orange-button"
                  type="button"
                  onClick={() => this.onDelete (i)}
                >
                  {'Delete'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default PageOrderNumberSelect;
