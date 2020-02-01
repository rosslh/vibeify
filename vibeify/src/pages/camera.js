import React, { Component } from 'react';
import Webcam from "react-webcam";
import logo from '../logo.svg';

class CameraPage extends Component{
  state = {
    imageData: null,
    image_name: "",
    saveImage: false
  }

  setRef = (webcam) => {this.webcam = webcam}

  capture = () => {
    const imageSrc = this.webcam.getScreenshot()
    this.setState({
      imageData: imageSrc
    })
  };

  onClickRetake = (e) => {
    this.setState({
      imageData: null
    })
  }

  onClickSave = (e) => {
    this.setState((prev) => {
      return {saveImage : !prev.saveImage}
    })
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  render(){
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: 'user'
    };
    return (
      <div>
        <Webcam
          audio={false}
          height={350}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          width={350}
          videoConstraints={videoConstraints}
        />
        <div>
            <button onClick={this.capture}>
              Capture Photo
            </button>
          </div>
          {
            this.state.imageData ?
            <div>
              <p><img src={this.state.imageData}/></p>
            </div>
            :
            null
        }
      </div>
    )
  }
}

export default CameraPage