import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { firebase as firebaseConnect, helpers } from 'redux-react-firebase';
const { dataToJS } = helpers;

import HomePhoneNumber from 'components/forms/HomePhoneNumber';

import Helmet from 'react-helmet';

@firebaseConnect([
  'users'
])
@connect(
  ({ firebase }) => ({
    todos: dataToJS(firebase, 'users'),
  })
)
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
      <Grid className={styles.home} fluid>
        <Helmet title="Home"/>
        <Row>
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
        </Row>
      </Grid>
    );
  }
}
