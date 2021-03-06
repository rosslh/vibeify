import { drawKeyPoints, drawSkeleton } from "./utils";
import styles from "./cameraStyle.module.css";
import React, { Component } from "react";
import { Circle } from "rc-progress";
import similarity from "compute-cosine-similarity";
import * as posenet from "@tensorflow-models/posenet";
import Nav from "../../components/navBar";
import Player from "../../components/player";

class PoseNet extends Component {
  static defaultProps = {
    videoWidth: document.documentElement.clientWidth,
    videoHeight: document.documentElement.clientHeight,
    flipHorizontal: true,
    algorithm: "multi-pose",
    showVideo: true,
    minPoseConfidence: 0.1,
    minPartConfidence: 0.5,
    maxPoseDetections: 2,
    nmsRadius: 20,
    outputStride: 16,
    imageScaleFactor: 0.5,
    skeletonColor: "#ffadea",
    skeletonLineWidth: 6,
    updateRate: 5,
    slidingWindowSize: 80,
    loadingText: 'Loading...please be patient...'
  }

  constructor(props) {
    super(props, PoseNet.defaultProps);
    this.state = {
      prevPoses: null,
      slidingWindow: [],
      howActive: 0,
      culmActivity: 0,
      i: 0,
      shouldInitializePlaylist: false
    };
  }

  getCanvas = elem => {
    this.canvas = elem;
  };

  getVideo = elem => {
    this.video = elem;
  };

  async componentDidMount() {
    try {
      await this.setupCamera();
    } catch (error) {
      throw new Error(
        "This browser does not support video capture, or this device does not have a camera"
      );
    }

    try {
      this.posenet = await posenet.load();
    } catch (error) {
      throw new Error("PoseNet failed to load");
    } finally {
      setTimeout(() => {
        this.setState({ loading: false });
      }, 200);
    }

    this.detectPose();
  }

  async setupCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        "Browser API navigator.mediaDevices.getUserMedia not available"
      );
    }
    const { videoWidth, videoHeight } = this.props;
    const video = this.video;
    video.width = videoWidth;
    video.height = videoHeight;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: "user",
        width: videoWidth,
        height: videoHeight
      }
    });

    video.srcObject = stream;

    return new Promise(resolve => {
      video.onloadedmetadata = () => {
        video.play();
        resolve(video);
      };
    });
  }

  detectPose() {
    const { videoWidth, videoHeight } = this.props;
    const canvas = this.canvas;
    const canvasContext = canvas.getContext("2d");

    canvas.width = videoWidth;
    canvas.height = videoHeight;
    this.poseDetectionFrame(canvasContext);
  }

  cosinesimilarity(prevPoses, currentPoses) {
    if (prevPoses == null || currentPoses == null) {
      return 1;
    }
    // A list of lists, where each element is the vector representing an individuals position
    let prevPosesMatrix = [];
    prevPoses.forEach(({ score, keypoints }) => {
      let prevVec = [];
      if (keypoints !== undefined) {
        keypoints.forEach(({ score, part, position }) => {
          prevVec.push(position.x);
          prevVec.push(position.y);
        });
        prevPosesMatrix.push(prevVec);
      }
    });
    let currentPosesMatrix = [];
    currentPoses.forEach(({ i, keypoints }) => {
      let currentVec = [];
      if (keypoints !== undefined) {
        keypoints.forEach(({ i, j, position }) => {
          currentVec.push(position.x);
          currentVec.push(position.y);
        });
        currentPosesMatrix.push(currentVec);
      }
    });

    let cosinesimilarities = 0;
    for (let ind = 0; ind < prevPosesMatrix.length; ind++) {
      if (ind < currentPosesMatrix.length) {
        cosinesimilarities += similarity(
          prevPosesMatrix[ind],
          currentPosesMatrix[ind]
        );
      }
    }
    let avg = cosinesimilarities / prevPosesMatrix.length
    return Number.isNaN(avg) ? 1 : avg
  }

  howActive = (slidingWindow) => 300 - (this.mean(slidingWindow) + 1) * 150

  poseDetectionFrame(canvasContext) {
    const {
      imageScaleFactor,
      outputStride,
      minPoseConfidence,
      minPartConfidence,
      maxPoseDetections,
      nmsRadius,
      videoWidth,
      videoHeight,
      showVideo,
      updateRate,
      skeletonColor,
      slidingWindowSize,
      skeletonLineWidth,
    } = this.props
    const posenetModel = this.posenet
    const video = this.video

    const findPoseDetectionFrame = async () => {
      let poses = [];

      poses = await posenetModel.estimateMultiplePoses(
        video,
        imageScaleFactor,
        true,
        outputStride,
        maxPoseDetections,
        minPartConfidence,
        nmsRadius
      )
      poses.push(poses)
      if (this.state.i === 0) {
        const cosinesimilarity = this.cosinesimilarity(this.state.prevPoses, poses)
        let slidingWindow = this.state.slidingWindow
        slidingWindow.push(cosinesimilarity)
        slidingWindow = slidingWindow.length > slidingWindowSize ? slidingWindow.slice(-slidingWindowSize) : slidingWindow
        const activityScore = this.howActive(slidingWindow)
        let culm = this.state.culmActivity
        culm += (activityScore * 0.005)
        this.setState({ howActive: activityScore, culmActivity: culm, slidingWindow: slidingWindow, prevPoses: poses })
      }
      let i = this.state.i;
      i = (i + 1) % updateRate;
      this.setState({ i: i });

      canvasContext.clearRect(0, 0, videoWidth, videoHeight);

      if (showVideo) {
        canvasContext.save();
        canvasContext.drawImage(video, 0, 0, videoWidth, videoHeight);
        canvasContext.restore();
      }

      poses.forEach(({ score, keypoints }) => {
        if (score >= minPoseConfidence) {
          drawKeyPoints(
            keypoints,
            minPartConfidence,
            skeletonColor,
            canvasContext
          );
          drawSkeleton(
            keypoints,
            minPartConfidence,
            skeletonColor,
            skeletonLineWidth,
            canvasContext
          );
        }
      });
      requestAnimationFrame(findPoseDetectionFrame);
    };
    findPoseDetectionFrame();
  }
  findLabel() {
    if (this.state.howActive <= 2) {
      return ["Relax", 0];
    } else if (this.state.howActive > 2 && this.state.howActive <= 4) {
      return ["Chill", 1];
    } else if (this.state.howActive > 4 && this.state.howActive <= 10) {
      return ["Vibing", 2];
    } else if (this.state.howActive > 10 && this.state.howActive <= 30) {
      return ["Upbeat", 3];
    } else if (this.state.howActive > 30) {
      return ["Crazy", 4];
    }
  }
  mean = (arr) => {
    if (arr.length === 0)
      return 0
    let n = arr.length;
    let mean = arr.reduce((a, b) => a + b) / n;
    return mean
  }

  render() {
    let [label, bin] = this.findLabel()
    return (
      <div>
        <div>
          <Nav setShouldInitializePlaylist={(val) => this.setState({ shouldInitializePlaylist: val })} isLoggedIn={true} />
          <span className="player">
          </span>
          <span
            style={{
              color: "white",
              display: "flex",
              width: "100vw",
              height: "100vh",
              top: "50%",
              transform: "translateY(-50%)",
              position: "absolute",
              alignItems: "center",
              justifyContent: "center",
              zindex: -1
            }}
          >
            <h1 style={{ fontSize: "72px", color: "white" }}>
              {label}
            </h1>
            <img alt="" style={{ marginLeft: "20px", height: "80px", width: "110px" }} src={require(`../../assets/${label}.png`)} />
            <img
              alt=""
              style={{ zIndex: -1, position: "absolute", left: "0", right: "0" }}
              src={require(`../../assets/${label}Gradient.png`)}
            />
            <img
              alt=""
              style={{ zIndex: -1, position: "absolute", left: "0", right: "0" }}
              src={require(`../../assets/${label}Gradient.png`)}
            />
            <img
              alt=""
              style={{ zIndex: -1, position: "absolute", left: "0", right: "0" }}
              src={require(`../../assets/${label}Gradient.png`)}
            />
          </span>
          <video id={styles.videoNoShow} playsInline ref={this.getVideo} />
          <div>
            <canvas className={styles.webcam} ref={this.getCanvas} />
          </div>
          <div className={styles.activityMeter}>
            <Circle
              percent={this.state.howActive}
              strokeWidth="8"
              trailWidth="6"
              strokeColor="White"
              style={{ height: 60, width: 60 }}
            />
            <h1>Energy Score {this.state.howActive.toFixed(1).toLocaleString()}</h1>
            <h2>Avg Calories Burned {this.state.culmActivity.toFixed(1).toLocaleString()}</h2>
            <div className={styles.playerStyle}>
              <Player currentBin={bin} setShouldInitializePlaylist={(val) => this.setState({ shouldInitializePlaylist: val })} shouldInitializePlaylist={this.state.shouldInitializePlaylist} />
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default PoseNet;
