const {instructions, disassembleOpCode} = require("./instructionset")

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

chip8_fontSet = [
    0xF0, 0x90, 0x90, 0x90, 0xF0, //0
    0x20, 0x60, 0x20, 0x20, 0x70, //1
    0xF0, 0x10, 0xF0, 0x80, 0xF0, //2
    0xF0, 0x10, 0xF0, 0x10, 0xF0, //3
    0x90, 0x90, 0xF0, 0x10, 0x10, //4
    0xF0, 0x80, 0xF0, 0x10, 0xF0, //5
    0xF0, 0x80, 0xF0, 0x90, 0xF0, //6
    0xF0, 0x10, 0x20, 0x40, 0x40, //7
    0xF0, 0x90, 0xF0, 0x90, 0xF0, //8
    0xF0, 0x90, 0xF0, 0x10, 0xF0, //9
    0xF0, 0x90, 0xF0, 0x90, 0x90, //A
    0xE0, 0x90, 0xE0, 0x90, 0xE0, //B
    0xF0, 0x80, 0x80, 0x80, 0xF0, //C
    0xE0, 0x90, 0x90, 0x90, 0xE0, //D
    0xF0, 0x80, 0xF0, 0x80, 0xF0, //E
    0xF0, 0x80, 0xF0, 0x80, 0x80
]


class CPU {
    constructor() {
        this.reset()
    }

    reset(){
        this.memory = new Uint8Array(4096)
        this.registers = new Uint8Array(16)
        this.stack = new Uint16Array(16)
        this.ST = 0
        this.DT = 0
        this.I = 0
        this.SP = -1
        this.PC = 0x200
        this.halted = true
        this.soundEnabled = false
    }

    _fetch = ()=>{
        return (this.memory[PC] << 8) | (this.memory[PC+1]<<0)
    }

    _decode = (opcode)=>{
        return disassembleOpCode(opcode)
    }

    _nextInstruction = ()=>{
        this.PC = this.PC + 2
    }

    _skipInstructin = ()=>{
        this.PC = this.PC + 4
    }

    _execute = (instruction)=>{
        const {I, args} = instruction

        switch(I.id){
            case 'CLS':
                
            this._nextInstruction()
            break;

            case 'RET':
                //return from subroutine 
                if(this.SP === -1){
                    this.halted = true;
                    throw new Error("Stack Underflow")
                }

                this.PC = thi.stack[this.SP]
                this.SP--
                break
            case "JMP_NNN":
                this.PC = args[0]
                break
            case "CALL_NNN":
                //call Subroutine
                if(this.SP === 15){
                    this.halted = true
                    throw new Error("Stack Overflow")
                }

                this.SP++
                this.stack[this.SP] - this.PC + 2
                this.PC = args[0]
                break
            case "SE_VX_NN":
                if(this.registers[args[0]] === args[1])
                    this._skipInstructin()
                else 
                    this._nextInstruction()
                break
            case "SNE_VX_NN":
                if(this.registers[args[0]] !== args[1])
                    this._skipInstructin()
                else 
                    this._nextInstruction()
                break
            case "SE_VX_VY":
                if(this.registers[args[0]] === this.registers[args[1]])
                    this._skipInstructin()
                else 
                    this._nextInstruction()
                break
            case "LD_VX_NN":
                this.registers[args[0]] = args[1]
                this._nextInstruction()
                break
            case "ADD_VX_NN":
                this.registers[args[0]] = this.registers[args[0]] + args[1]
                this._nextInstruction()
                break
            case "LD_VX_VY":
                this.registers[args[0]] = this.registers[args[1]]
                this._nextInstruction()
                break
            case "OR_VX_VY":
                this.registers[args[0]] = this.registers[args[0]]|this.registers[args[1]]
                this._nextInstruction()
                break 
            case "AND_VX_VY":
                this.registers[args[0]] = this.registers[args[0]]&this.registers[args[1]]
                this._nextInstruction()
                break 
            case "XOR_VX_VY":
                this.registers[args[0]] = this.registers[args[0]]^this.registers[args[1]]
                this._nextInstruction()
                break 
            case "ADD_VX_VY":
                this.registers[15] = this.registers[args[0]] + this.registers[args[1]] > 0xff ? 1 : 0
                this.registers[args[0]] = this.registers[args[0]]+this.registers[args[1]]
                this._nextInstruction()
                break 
            case "SUB_VX_VY":
                this.registers[15] = this.registers[args[0]] > this.registers[args[1]] > 0xff ? 1 : 0
                this.registers[args[0]] = this.registers[args[0]] - this.registers[args[1]]
                this._nextInstruction()
                break 
            case "SHR_VX_VY":
                this.registers[0xf] = this.registers[args[0]] & 1
                this.registers[args[0]] >>= 1
                this._nextInstruction()
                break
            case "SUBN_VX_VY":
                this.registers[0xf] = this.registers[args[1]] > this.registers[args[0]] ? 1 : 0
                this.registers[args[0]] = this.registers[args[1]] - this.registers[args[0]]
                this._nextInstruction()
                break
            case "SHL_VX_VY":
                this.registers[0xf] = this.registers[args[0]] >> 7
                this.registers[args[0]]<<=1
                this._nextInstruction()
                break
            case "SNE_VX_VY":
                if(this.registers[args[0]] !== this.registers[args[1]])
                    this._skipInstructin()
                else 
                    this._nextInstruction()
                break
            case "LD_I_NNN":
                this.I = args[0]
                this._nextInstruction()
                break
            case "JP_V0_NNN":
                this.PC = arg[0] + this.registers[0]
                if(this.PC > 4096){
                    this.halted = true 
                    throw new Error("Memory Over Bound")
                }
                break 
            case "RND_VX_NN":
                this.registers[args[0]] = getRandomInt(255)&args[1]
                this._nextInstruction()
                break
            case "DRW_VX_VY_N":
                if (this.I > 4095 - args[2]) {
                    this.halted = true
                    throw new Error('Memory out of bounds.')
                }
                //TODO COmplete this and next two instructions as per instructionset 
        }   

    }


}