export default class CanvasRender {
    #canvas
    #ctx

    /**@param {HTMLCanvasElement} canvas  */
    constructor(canvas) {
        this.#canvas = canvas
        this.#ctx = canvas.getContext('2d')
    }

    /**@param {VideoFrame} frame  */
    draw(frame) {
        const { displayHeight, displayWidth } = frame

        this.#canvas.width = displayWidth
        this.#canvas.height = displayHeight
        this.#ctx.drawImage(
            frame,
            //cordenadas de onde inicia o frame no elemento
            0,
            0,
            //width e height do frame que esta sendo mostrado
            displayWidth,
            displayHeight
        )
        frame.close()
    }

    getRender() {
        const renderer = this
        let pendingFrame = null
        return frame => {
            const renderAnimationFrame = () => {
                renderer.draw(pendingFrame)
                pendingFrame = null
            }

            if(!pendingFrame) {
                requestAnimationFrame(renderAnimationFrame)
            } else {
                pendingFrame.close()
            }

            pendingFrame = frame;
        }
    }

}