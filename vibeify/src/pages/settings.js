import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import Modal from 'react-modal'


class SettingsPage extends Component {
  state = {
    showModal: false
  }
  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };
  showModal() {
    this.setState({showModal: true})
  }

  render() {
    if (!this.props.show) {
      return null;
    }
    return (
      <Modal>
        
      </Modal>
    );
  }
}

export default SettingsPage