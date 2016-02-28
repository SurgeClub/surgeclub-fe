import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { firebase as firebaseConnect } from 'redux-react-firebase';
import { connect } from 'react-redux';
import moment from 'moment';

import { set } from 'redux/modules/firebase';

const styles = require('./style.scss');

@firebaseConnect()
@connect(
  (state, ownProps) => ({
    history: state.firebase.histories[ownProps.params.id]
  })
)
export default class History extends Component {
  static propTypes = {
    params: PropTypes.object,
    firebase: PropTypes.object,
    history: PropTypes.object,
    dispatch: PropTypes.func
  }

  state = {
    width: 500,
    height: 300
  }

  componentWillMount() {
    const { firebase, params, dispatch } = this.props;

    firebase.ref.child(`history/${params.id}`).on('value', (snapshot) => {
      dispatch(set(snapshot.val(), 'histories'));
    });
  }

  renderEvent() {
    const { history } = this.props;
    const rangeOfGraph = moment(history.uber[history.uber.length - 1].time).unix() - moment(history.uber[0].time).unix();
    const startTime = moment(history.start_time).unix();

    const diffPercentage = startTime - moment(history.uber[0].time).unix();
    console.log(diffPercentage);

    return (
      <div style={{position: 'absolute', left: diffPercentage}}>
        HERE
      </div>
    );
  }

  renderLyft() {
    const { history } = this.props;
    const { width, height } = this.state;

    return (
      <div className={styles.graph}>
        <Sparklines data={history.lyft.map(point => point.primetime)} width={width} height={height}>
          <SparklinesLine style={{ strokeWidth: 3, stroke: '#EA0B8C', fill: 'none' }} />
        </Sparklines>
      </div>
    );
  }

  renderUber() {
    const { history } = this.props;
    const { width, height } = this.state;

    return (
      <div className={styles.graph}>
        <Sparklines data={history.uber.map(point => point.surge)} width={width} height={height}>
          <SparklinesLine style={{ strokeWidth: 3, stroke: '#000', fill: 'none' }} />
        </Sparklines>
      </div>
    );
  }

  render() {
    const { history } = this.props;

    return (
      <Grid>
        <Row>
          <Col md={8} mdOffset={2}>
            {history && history.name}
          </Col>
          <Col md={8} mdOffset={2}>
            {history && this.renderUber()}
            {history && this.renderLyft()}
            {history && this.renderEvent()}
          </Col>
        </Row>
      </Grid>
    );
  }
}
