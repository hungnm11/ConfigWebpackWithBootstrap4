import React from 'react';
import HeaderUI from '../components/header';
import BodyUI from '../components/contents';
import FooterUI from '../components/footer';

class Container extends React.Component {
  render() {
    return (
      <div>
        <HeaderUI />
        <BodyUI />
        <FooterUI />
      </div>
    )
  }
}

export default Container;