import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import cookie from 'react-cookie';
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
    setTimeout(() => cookie.save('phoneNumberSaved', true), 3000);
  }

  renderPhoneNumberForm() {
    const { submitted } = this.state;

    if (!cookie.load('phoneNumberSaved')) {
      return (
        <Col xs={12} md={8} mdOffset={2}>
          <h3 className="text-center">
            <small>
              Receive notifications via text messages:
            </small>
          </h3>
          {
            submitted ?
            <h4 className="text-success text-center">Awesome! We will be in touch soon!</h4> :
            <HomePhoneNumber onSubmit={this.submitPhoneNumber.bind(this)} />
          }
        </Col>
      );
    }

    return false;
  }

  render() {
    const styles = require('./Home.scss');

    return (
      <Grid fluid>
        <Helmet title="Home"/>
        <Row className={`text-center ${styles.header}`}>
          <Col xs={12} md={8} mdOffset={2}>
            <h1>
              Driver smarter. Make more money
            </h1>
            <h3>
              <small>
                Make sure you're at the right place when surge starts; drive less and make more money.
              </small>
            </h3>
          </Col>
          {this.renderPhoneNumberForm()}
        </Row>
        <Row>
          <Col xs={12} md={6} mdOffset={3}>
            <EventsFeed />
          </Col>
        </Row>
      </Grid>
    );
  }
}
