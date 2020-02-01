import React, { Component } from 'react';
import { Button, ButtonGroup, Modal } from '@material-ui/core';

class SettingsPage extends Component {
  state = {
    current: this.playlists()
  }
  render() {
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <div style={modalStyle} className={classes.paper}>
          <h2 id="simple-modal-title">Text in a modal</h2>
          <p id="simple-modal-description">
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </p>
          <SimpleModal />
        </div>
      </Modal>
    );
  }
}

export default SettingsPage