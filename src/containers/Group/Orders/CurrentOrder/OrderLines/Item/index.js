import React, { Component, PropTypes } from 'react';

import { getProductName } from 'presenters/product';

class Item extends Component {
  static propTypes = {
    orderLine: PropTypes.object.isRequired,
  }

  render() {
    const { orderLine } = this.props;

    return (
      <tr>
        <td>{orderLine.name}</td>
        <td>{orderLine.price}</td>
        <td>{getProductName(orderLine.unit)}</td>
      </tr>
    );
  }
}

export default Item;
