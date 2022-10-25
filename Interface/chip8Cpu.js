const { instructions, disassembleOpCode } = require("./instructionset");

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

chip8_fontSet = [
  0xf0,
  0x90,
  0x90,
  0x90,
  0xf0, //0
  0x20,
  0x60,
  0x20,
  0x20,
  0x70, //1
  0xf0,
  0x10,
  0xf0,
  0x80,
  0xf0, //2
  0xf0,
  0x10,
  0xf0,
  0x10,
  0xf0, //3
  0x90,
  0x90,
  0xf0,
  0x10,
  0x10, //4
  0xf0,
  0x80,
  0xf0,
  0x10,
  0xf0, //5
  0xf0,
  0x80,
  0xf0,
  0x90,
  0xf0, //6
  0xf0,
  0x10,
  0x20,
  0x40,
  0x40, //7
  0xf0,
  0x90,
  0xf0,
  0x90,
  0xf0, //8
  0xf0,
  0x90,
  0xf0,
  0x10,
  0xf0, //9
  0xf0,
  0x90,
  0xf0,
  0x90,
  0x90, //A
  0xe0,
  0x90,
  0xe0,
  0x90,
  0xe0, //B
  0xf0,
  0x80,
  0x80,
  0x80,
  0xf0, //C
  0xe0,
  0x90,
  0x90,
  0x90,
  0xe0, //D
  0xf0,
  0x80,
  0xf0,
  0x80,
  0xf0, //E
  0xf0,
  0x80,
  0xf0,
  0x80,
  0x80,
];

class CPU {
  constructor(interface) {
    this.reset();
    this.interface = interface;
  }

  reset() {
    this.memory = new Uint8Array(4096);
    this.registers = new Uint8Array(16);
    this.stack = new Uint16Array(16);
    this.ST = 0;
    this.DT = 0;
    this.I = 0;
    this.SP = -1;
    this.PC = 0x200;
    this.halted = true;
    this.soundEnabled = false;
  }

  load(romBuffer) {
    // Reset the CPU every time it is loaded
    this.reset()

    // 0-80 in memory is reserved for font set
    for (let i = 0; i < FONT_SET.length; i++) {
      this.memory[i] = FONT_SET[i]
    }

    // Get ROM data from ROM buffer
    const romData = romBuffer.data
    let memoryStart = 0x200

    this.halted = false

    // Place ROM data in memory starting at 0x200
    // Since memory is stored in an 8-bit array and opcodes are 16-bit, we have
    // to store the opcodes across two indices in memory
    for (let i = 0; i < romData.length; i++) {
      // set the first index with the most significant byte (i.e., 0x1234 would be 0x12)
      this.memory[memoryStart + 2 * i] = romData[i] >> 8
      // set the second index with the least significant byte (i.e., 0x1234 would be 0x34)
      this.memory[memoryStart + 2 * i + 1] = romData[i] & 0x00ff
    }
  }
 

  _fetch = () => {
    return (this.memory[PC] << 8) | (this.memory[PC + 1] << 0);
  };

  _decode = (opcode) => {
    return disassembleOpCode(opcode);
  };

  _nextInstruction = () => {
    this.PC = this.PC + 2;
  };

  _skipInstructin = () => {
    this.PC = this.PC + 4;
  };

  _execute = (instruction) => {
    const { I, args } = instruction;

    switch (I.id) {
      case "CLS":
        this._nextInstruction();
        break;

      case "RET":
        //return from subroutine
        if (this.SP === -1) {
          this.halted = true;
          throw new Error("Stack Underflow");
        }

        this.PC = thi.stack[this.SP];
        this.SP--;
        break;
      case "JMP_NNN":
        this.PC = args[0];
        break;
      case "CALL_NNN":
        //call Subroutine
        if (this.SP === 15) {
          this.halted = true;
          throw new Error("Stack Overflow");
        }

        this.SP++;
        this.stack[this.SP] - this.PC + 2;
        this.PC = args[0];
        break;
      case "SE_VX_NN":
        if (this.registers[args[0]] === args[1]) this._skipInstructin();
        else this._nextInstruction();
        break;
      case "SNE_VX_NN":
        if (this.registers[args[0]] !== args[1]) this._skipInstructin();
        else this._nextInstruction();
        break;
      case "SE_VX_VY":
        if (this.registers[args[0]] === this.registers[args[1]])
          this._skipInstructin();
        else this._nextInstruction();
        break;
      case "LD_VX_NN":
        this.registers[args[0]] = args[1];
        this._nextInstruction();
        break;
      case "ADD_VX_NN":
        this.registers[args[0]] = this.registers[args[0]] + args[1];
        this._nextInstruction();
        break;
      case "LD_VX_VY":
        this.registers[args[0]] = this.registers[args[1]];
        this._nextInstruction();
        break;
      case "OR_VX_VY":
        this.registers[args[0]] =
          this.registers[args[0]] | this.registers[args[1]];
        this._nextInstruction();
        break;
      case "AND_VX_VY":
        this.registers[args[0]] =
          this.registers[args[0]] & this.registers[args[1]];
        this._nextInstruction();
        break;
      case "XOR_VX_VY":
        this.registers[args[0]] =
          this.registers[args[0]] ^ this.registers[args[1]];
        this._nextInstruction();
        break;
      case "ADD_VX_VY":
        this.registers[15] =
          this.registers[args[0]] + this.registers[args[1]] > 0xff ? 1 : 0;
        this.registers[args[0]] =
          this.registers[args[0]] + this.registers[args[1]];
        this._nextInstruction();
        break;
      case "SUB_VX_VY":
        this.registers[15] =
          this.registers[args[0]] > this.registers[args[1]] > 0xff ? 1 : 0;
        this.registers[args[0]] =
          this.registers[args[0]] - this.registers[args[1]];
        this._nextInstruction();
        break;
      case "SHR_VX_VY":
        this.registers[0xf] = this.registers[args[0]] & 1;
        this.registers[args[0]] >>= 1;
        this._nextInstruction();
        break;
      case "SUBN_VX_VY":
        this.registers[0xf] =
          this.registers[args[1]] > this.registers[args[0]] ? 1 : 0;
        this.registers[args[0]] =
          this.registers[args[1]] - this.registers[args[0]];
        this._nextInstruction();
        break;
      case "SHL_VX_VY":
        this.registers[0xf] = this.registers[args[0]] >> 7;
        this.registers[args[0]] <<= 1;
        this._nextInstruction();
        break;
      case "SNE_VX_VY":
        if (this.registers[args[0]] !== this.registers[args[1]])
          this._skipInstructin();
        else this._nextInstruction();
        break;
      case "LD_I_NNN":
        this.I = args[0];
        this._nextInstruction();
        break;
      case "JP_V0_NNN":
        this.PC = args[0] + this.registers[0];
        if (this.PC > 4096) {
          this.halted = true;
          throw new Error("Memory Over Bound");
        }
        break;
      case "RND_VX_NN":
        this.registers[args[0]] = getRandomInt(255) & args[1];
        this._nextInstruction();
        break;
      case "DRW_VX_VY_N":
        if (this.I > 4095 - args[2]) {
          this.halted = true;
          throw new Error("Memory out of bounds.");
        }

        this.registers[0xf] = 0;
        for (let i = 0; i < args[2]; i++) {
          let line = this.memory[this.I + i];
          for (let position = 0; position < 8; position++) {
            let value = line & (1 << (7 - position)) ? 1 : 0;
            let x = (this.registers[args[0]] + position) % DISPLAY_WIDTH;
            let y = (this.registers[args[1]] + i) % DISPLAY_HEIGHT;
            if (this.interface.drawPixel(x, y, value)) {
              this.registers[0xf] = 1;
            }
          }
        }
        this._nextInstruction();
        break;
      case "SKP_VX":
        if (this.interface.getKeys() & (1 << this.registers[args[0]])) {
          this._skipInstructin();
        } else {
          this._nextInstruction();
        }
        break;

      case "SKNP_VX":
        if (!(this.interface.getKeys() & (1 << this.registers[args[0]]))) {
          this._skipInstructin();
        } else {
          this._nextInstruction();
        }
        break;

      case "LD_VX_DT":
        this.registers[args[0]] = this.DT;
        this._nextInstruction();
        break;
      case "LD_VX_K":
        const keyPressed = this.interface.getKeys();

        if (!keyPressed) {
          return;
        }

        this.registers[args[0]] = keyPressed;
        this._nextInstruction();
        break;
      case "LD_DT_VX":
        this.DT = this.registers[args[0]];
        this._nextInstruction();
        break;

      case "LD_ST_VX":
        this.ST = this.registers[args[1]];
        if (this.ST > 0) {
          this.soundEnabled = true;
          this.interface.enableSound();
        }
        this._nextInstruction();
        break;

      case "ADD_I_VX":
        // Fx1E - Set I = I + Vx
        this.I = this.I + this.registers[args[1]];
        this._nextInstruction();
        break;

      case "LD_F_VX":
        // Fx29 - Set I = location of sprite for digit Vx
        if (this.registers[args[1]] > 0xf) {
          this.halted = true;
          throw new Error("Invalid digit.");
        }

        this.I = this.registers[args[1]] * 5;
        this._nextInstruction();
        break;

      case "LD_B_VX":
        // Fx33 - Store BCD representation of Vx in memory locations I, I+1, and I+2
        // BCD means binary-coded decimal
        // If VX is 0xef, or 239, we want 2, 3, and 9 in I, I+1, and I+2
        if (this.I > 4093) {
          this.halted = true;
          throw new Error("Memory out of bounds.");
        }

        let x = this.registers[args[1]];
        const a = Math.floor(x / 100); // for 239, a is 2
        x = x - a * 100; // subtract value of a * 100 from x (200)
        const b = Math.floor(x / 10); // x is now 39, b is 3
        x = x - b * 10; // subtract value of b * 10 from x (30)
        const c = Math.floor(x); // x is now 9

        this.memory[this.I] = a;
        this.memory[this.I + 1] = b;
        this.memory[this.I + 2] = c;

        this._nextInstruction();
        break;

      case "LD_I_VX":
        // Fx55 - Store registers V0 through Vx in memory starting at location I
        if (this.I > 4095 - args[1]) {
          this.halted = true;
          throw new Error("Memory out of bounds.");
        }

        for (let i = 0; i <= args[1]; i++) {
          this.memory[this.I + i] = this.registers[i];
        }

        this._nextInstruction();
        break;

      case "LD_VX_I":
        // Fx65 - Read registers V0 through Vx from memory starting at location I
        if (this.I > 4095 - args[0]) {
          this.halted = true;
          throw new Error("Memory out of bounds.");
        }

        for (let i = 0; i <= args[0]; i++) {
          this.registers[i] = this.memory[this.I + i];
        }

        this._nextInstruction();
        break;

      default:
        // Data word
        this.halted = true;
        throw new Error("Illegal instruction.");
    }
  }
}

module.exports = {
  CPU,
}