import React, { Component, PropTypes } from 'react';
import {reduxForm} from 'redux-form';
import { Input, Button } from 'react-bootstrap';

@reduxForm({
  form: 'home-phone-number',
  fields: ['phoneNumber']
})
export default class HomePhoneNumber extends Component {
  static propTypes = {
    active: PropTypes.string,
    fields: PropTypes.object.isRequired,
    dirty: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    valid: PropTypes.bool.isRequired
  }

  render() {
    const {
      fields: {phoneNumber},
      handleSubmit
      } = this.props;

    return (
      <form className="form-inline text-center" onSubmit={handleSubmit}>
        <Input
          type="tel"
          {...phoneNumber} />
        <Button bsStyle="default" onClick={handleSubmit} className="margin-sm-left">
          Submit
        </Button>
      </form>
    );
  }
}
