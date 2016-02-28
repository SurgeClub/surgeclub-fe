import React, { Component, PropTypes } from 'react';
// import qs from 'qs';
import { firebase as firebaseConnect } from 'redux-react-firebase';

import HomePhoneNumber from 'components/forms/HomePhoneNumber';
import EventsFeed from 'components/EventsFeed';

import Helmet from 'react-helmet';

@firebaseConnect()
export default class Home extends Component {
  static propTypes = {
    firebase: PropTypes.object
  }
  state = {
    submitted: false
  }

  submitPhoneNumber(form) {
    const { firebase } = this.props;
    const { phoneNumber } = form;

    firebase.push('/users', { phoneNumber }).then(() => this.setState({submitted: true}));
  }

  render() {
    const styles = require('./Home.scss');
    const { submitted } = this.state;

    return (
      <div className={styles.mainContainer}>
        <Helmet title="Home"/>
          <div className={styles.brandingLanguage}>
            <h1>
              Driver smarter. Make more money
            </h1>
            <span>
                Make sure youre at the right place when surge starts; drive less and make more money.
            </span>

          </div>
            {
              submitted ?
              <h4 className="text-success text-center">Awesome! We will be in touch soon!</h4> :
              <div className={styles.phoneContainer}>
                <HomePhoneNumber onSubmit={this.submitPhoneNumber.bind(this)} />
              </div>
            }

        <div className={styles.eventsFeedContainer}>
          <EventsFeed />
        </div>

      </div>


    );
  }
}
