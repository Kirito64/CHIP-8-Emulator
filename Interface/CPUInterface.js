class CPUInterface{

    constructor(){
        if(new.target === CPUInterface)
            throw new TypeError("Cant Instatiate abstract class")
    }

    clearDisplay(){
        throw new TypeError("Must Be implemented in the inherited class")
    }

    waitKey(){
        throw new TypeError("Must Be implemented in the inherited class")
    }

    getKeys(){
        throw new TypeError("Must Be implemented in the inherited class")
    }

    drawPixel(){
        throw new TypeError("Must Be implemented in the inherited class")
    }

    setKeys(){
        throw new TypeError("Must Be implemented in the inherited class")
    }

    resetKeys(){
        throw new TypeError("Must Be implemented in the inherited class")
    }

}

module.exports = {CPUInterface}