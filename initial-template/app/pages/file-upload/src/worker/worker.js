import VideoProcessor from "./videoProcessor.js"
import MP4Demuxer from "./mp4Demuxer.js"
import CanvasRender from "./canvasRender.js"
import WebMWriter from "./../deps/webm-writer2.js"
import Service from "./service.js"

const qvgaConstraints = {
    width: 320,
    height: 240
}

const vgaConstraints = {
    width: 640,
    height: 480
}

const hdConstraints = {
    width: 1280,
    height: 720
}

//configs required by webCodec
const encoderConfig = {
    //config type of resolution
    ...qvgaConstraints,

    // bit rate that will be read each time, 10e6 = 1 mega/segundo
    bitrate: 10e6,

    //config for WebM format
    codec: 'vp09.00.10.08',
    pt: 4,
    hardwareAcceleration: 'prefer-software',

    // config for MP4 format
    // codec: 'avc1.42002A',
    // pt: 1,
    // hardwareAcceleration: 'prefer-hardware',
    // avc: { format: 'annexb' }
}

const webmWriterConfig = {
    ...qvgaConstraints,
    codec: 'VP9',
    width: encoderConfig.width,
    height: encoderConfig.height,
    bitrate: encoderConfig.bitrate
}
const mp4Demuxer = new MP4Demuxer()
const service = new Service({
    url: 'http://localhost:3000'
    
})
const videoProcessor = new VideoProcessor({
    mp4Demuxer,
    webMWriter: new WebMWriter(webmWriterConfig),
    service,
})

onmessage = async ({ data }) => {
    const renderFrame = new CanvasRender(data.canvas).getRender()
    await videoProcessor.start({
        file: data.file,
        renderFrame,
        encoderConfig,
        sendMessage(message){ 
            self.postMessage(message)
        }
    })
    
    // self.postMessage({
    //     status: 'done'
    // })
}