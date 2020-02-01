import {drawKeyPoints, drawSkeleton} from './utils'
import styles from './cameraStyle.module.css'
import React, {Component} from 'react'
import { Line } from 'rc-progress';
import similarity from 'compute-cosine-similarity'
import * as posenet from '@tensorflow-models/posenet'

class PoseNet extends Component {
  
  static defaultProps = {
    videoWidth: document.documentElement.clientWidth,
    videoHeight: document.documentElement.clientHeight,
    flipHorizontal: true,
    algorithm: 'multi-pose',
    showVideo: true,
    minPoseConfidence: 0.1,
    minPartConfidence: 0.5,
    maxPoseDetections: 2,
    nmsRadius: 20,
    outputStride: 16,
    imageScaleFactor: 0.5,
    skeletonColor: '#ffadea',
    skeletonLineWidth: 6,
    updateRate: 5,
    loadingText: 'Loading...please be patient...'
  }

  constructor(props) {
    super(props, PoseNet.defaultProps)
    this.state = {
      prevPoses: null,
      howActive: 0,
      i: 0
    };

  }

  getCanvas = elem => {
    this.canvas = elem
  }

  getVideo = elem => {
    this.video = elem
  }

  async componentDidMount() {
    try {
      await this.setupCamera()
    } catch (error) {
      throw new Error(
        'This browser does not support video capture, or this device does not have a camera'
      )
    }

    try {
      this.posenet = await posenet.load()
    } catch (error) {
      throw new Error('PoseNet failed to load')
    } finally {
      setTimeout(() => {
        this.setState({loading: false})
      }, 200)
    }

    this.detectPose()
  }

  async setupCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available'
      )
    }
    const {videoWidth, videoHeight} = this.props
    const video = this.video
    video.width = videoWidth
    video.height = videoHeight

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'user',
        width: videoWidth,
        height: videoHeight
      }
    })

    video.srcObject = stream

    return new Promise(resolve => {
      video.onloadedmetadata = () => {
        video.play()
        resolve(video)
      }
    })
  }

  detectPose() {
    const {videoWidth, videoHeight} = this.props
    const canvas = this.canvas
    const canvasContext = canvas.getContext('2d')

    canvas.width = videoWidth
    canvas.height = videoHeight
    this.poseDetectionFrame(canvasContext)
  }

  cosinesimilarity(prevPoses,currentPoses){
    if (prevPoses == null || currentPoses == null){
      return 1
    }
    // A list of lists, where each element is the vector representing an individuals position
    let prevPosesMatrix = []
    prevPoses.forEach(({score, keypoints}) => {
      let prevVec = []
      if (keypoints !== undefined){
        keypoints.forEach(({score,part,position}) =>{
          prevVec.push(position.x)
          prevVec.push(position.y)
        })
        prevPosesMatrix.push(prevVec)
      }
    })
    let currentPosesMatrix = []
    currentPoses.forEach(({i, keypoints}) => {
      let currentVec = []
      if (keypoints !== undefined){
        keypoints.forEach(({i,j,position}) =>{
          currentVec.push(position.x)
          currentVec.push(position.y)
        })
        currentPosesMatrix.push(currentVec)
      }
    })

    let cosinesimilarities = 0
    for (let ind = 0;ind<prevPosesMatrix.length; ind++){
      if (ind < currentPosesMatrix.length){
        cosinesimilarities += similarity(prevPosesMatrix[ind],currentPosesMatrix[ind])
      }

    }
    return cosinesimilarities/prevPosesMatrix.length
  }

  howActive = (prevPoses,currentPoses) => 100-(this.cosinesimilarity(prevPoses,currentPoses)+1)*50
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
      skeletonLineWidth,
      updateRate
      } = this.props
    const posenetModel = this.posenet
    const video = this.video

    const findPoseDetectionFrame = async () => {
      let poses = []

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
      if (this.state.i==0){
        this.setState({howActive: this.howActive(this.state.prevPoses,poses),prevPoses: poses})
      }
      let i = this.state.i
      i = (i+1)%updateRate
      this.setState({i:i})
      
      canvasContext.clearRect(0, 0, videoWidth, videoHeight)

      if (showVideo) {
        canvasContext.save()
        canvasContext.drawImage(video, 0, 0, videoWidth, videoHeight)
        canvasContext.restore()
      }

      poses.forEach(({score, keypoints}) => {
        if (score >= minPoseConfidence) {
            drawKeyPoints(
              keypoints,
              minPartConfidence,
              skeletonColor,
              canvasContext
            )
            drawSkeleton(
              keypoints,
              minPartConfidence,
              skeletonColor,
              skeletonLineWidth,
              canvasContext
            )
        }
      })
      requestAnimationFrame(findPoseDetectionFrame)
    }
    findPoseDetectionFrame()
  }

  render() {
    return (
      <div className>
        <div>
          <video id={styles.videoNoShow} playsInline ref={this.getVideo} />
          <div>
            <canvas className={styles.webcam} ref={this.getCanvas} />
          </div>
          <div className={styles.activityMeter}>
            <h1>{this.state.howActive.toLocaleString()}</h1>
            <Line percent={this.state.howActive} strokeWidth="4" strokeColor="#D3D3D3" />
          </div>
        </div>
      </div>
    )
  }
}

export default PoseNet