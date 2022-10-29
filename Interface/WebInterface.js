const blessed = require('blessed')
const keyMap = require("../data/keyMap")
const {CPUInterface} = require("./CPUInterface")

const DISPLAY_HEIGHT = 32
const DISPLAY_WIDTH = 64
const COLOR = "#ffffff"
const multiplier = 10;

class WebCPUInterface {
	constructor(){


        this.frameBuffer = this._createFrameBuffer()
        this.screen = document.querySelector("canvas")
		this.screenWidth = DISPLAY_WIDTH * multiplier
		this.screenHeight = DISPLAY_HEIGHT * multiplier
		this.context = this.screen.getContext("2d")
		this.context.fillStyle = "black"
		this.context.fillRect(0, 0, this.screen.width, this.screen.height)

        //key replated 
        this.keys = 0
        this.keyPressed = undefined
        //Sound Disabled for now 
        this.soundEnabled = false 
		

        // Exit the Emulator 
        this.screen.key(['excape', 'C-c'], ()=>{
            process.exit(0)
        })

        //KeyPress event 

        this.screen.on("keypress", (_, key)=>{
			
            const keyIndex = keyMap.indexOf(key.full)
            if(keyIndex>-1){
                this._setKeys(keyIndex)
            }
        })

        setInterval(()=>{
            this._resetKeys()
        }, 100)

    }

    _createFrameBuffer() {

        let frameBuffer = []

        for(let i = 0; i<DISPLAY_WIDTH; i++){
            frameBuffer.push([])
            for(let j = 0; j<DISPLAY_HEIGHT; j++){
                frameBuffer[i].push(0)
            }
        }

        return frameBuffer
    }

    _resetKeys(){
        this.keys = 0
        this.keyPressed = undefined
    }
    
    setKeys(keyIndex) {
        let keyMask = 1 << keyIndex
    
        this.keys = this.keys | keyMask
        this.keyPressed = keyIndex
    }

    drawPixel(){
         // If collision, will return true
    const collision = this.frameBuffer[y][x] & value
    // Will XOR value to position x, y
    this.frameBuffer[y][x] ^= value

    if (this.frameBuffer[y][x]) {
      this.context.fillStyle = COLOR
      this.context.fillRect(
        x * this.multiplier,
        y * this.multiplier,
        this.multiplier,
        this.multiplier
      )
    } else {
      this.context.fillStyle = 'black'
      this.context.fillRect(
        x * this.multiplier,
        y * this.multiplier,
        this.multiplier,
        this.multiplier
      )
    }

    return collision

    }
    waitKey() {
        // Get and reset key
        const keyPressed = this.keyPressed
        this.keyPressed = undefined

        return keyPressed
    } 

    getKeys() {
        return this.keys
    }

    clearDisplay() {
        this.frameBuffer = this._createFrameBuffer()
		this.context.fillStyle = 'black'
		this.context.fillRect(0, 0, this.screen.width, this.screen.height)
    }

    enableSound() {
        this.soundEnabled = true
    }

    disableSound() {
        this.soundEnabled = false
    }

}

module.exports = {WebCPUInterface}