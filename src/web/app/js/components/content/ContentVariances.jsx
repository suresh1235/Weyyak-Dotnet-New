import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Button} from 'react-bootstrap';
import ContentVariance from 'components/content/ContentVariance';

/**
 * The class defines a content variances data of a content
 */
@observer class ContentVariances extends Component {
  constructor (...args) {
    super (...args);
    const {store} = this.props;
    this.addItem = store.addItem.bind (store);
  }

  /**
     * @see Component#render()
     */
  render () {
    const {store, scrollToExpandedVariance, plansStore} = this.props;
    const videoContentIdCollection = store.data.map (
      variance => variance.videoContentId
    );    
    return (
      <div className="forms">
        {store.data.map ((variance, index) => {
          const isExpanded = store.expandedVariances[index];
          return (
            <ContentVariance
              store={store}
              plansStore={plansStore}
              variance={variance}
              index={index}
              videoContentIds={videoContentIdCollection}
              key={index}
              expanded={isExpanded}
              ref={variance => (this.variance = variance)}
              scrollToVariance={isExpanded && scrollToExpandedVariance}
            />
          );
        })}
        {/* Content Variances Disabled */}
         <div className="text-right">
                    <Button
                        disabled={store.hasMaxAmountReached}
                        onClick={this.addItem}>Add Variance</Button>
        </div> 
      </div>
    );
  }
}

export default ContentVariances;
