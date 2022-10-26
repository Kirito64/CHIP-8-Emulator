const instructions = [
    {
        id: "CLR",
        name: "clear",
        pattern: 0x00e0,
        mask: 0x00f0,
        arguments: []
    },
    {
        id: "RET",
        name: "return",
        pattern: 0x00ee,
        mask: 0x00ff,
        arguments: []
    },
    {
        id: "JMP_NNN",
        name: "jump to NNN",
        pattern: 0x1000,
        mask: 0xf000,
        arguments: [
            {mask: 0x0fff, shift: 0, type: "A"},
        ]
    },
    {
        id: "CALL_NNN",
        name: "call subroutine at NNN",
        pattern: 0x2000,
        mask: 0xf000,
        arguments: [
            {mask: 0x0fff, shift: 0, type: "A"},
        ]
    },
    {
        id: "SE_VX_NN",
        name: "skip next instruction",
        pattern: 0x3000,
        mask: 0xf000,
        arguments: [
            {mask: 0x0f00, shift: 8, type: "R"},
            {mask: 0x00ff, shift: 0, type: "N"}
        ]
    },
    {
        id: "SNE_VX_NN",
        name: "skip NOT next instruction",
        pattern: 0x4000,
        mask: 0xf000,
        arguments: [
            {mask: 0x0f00, shift: 8, type: "R"},
            {mask: 0x00ff, shift: 0, type: "N"}
        ]
    },
    {
        id: "SE_VX_VY",
        name: "SKIP next instruction",
        pattern: 0x5000,
        mask: 0xf000,
        arguments: [
            {mask: 0x0f00, shift: 8, type: "R"},
            {mask: 0x00f0, shift: 4, type: "R"}
        ]
    },
    {
        id: "LD_VX_NN",
        name: "Load Vx with NN",
        pattern: 0x6000,
        mask: 0xf000,
        arguments: [
            {mask: 0x0f00, shift: 8, type: "R"},
            {mask: 0x00ff, shift: 0, type: "N"}
        ]
    },
    {
        id: "ADD_VX_NN",
        name: "ADD NN to Vx",
        pattern: 0x7000,
        mask: 0xf000,
        arguments: [
            {mask: 0x0f00, shift: 8, type: "R"},
            {mask: 0x00ff, shift: 0, type: "N"}
        ]
    },
    {
        id: "SE_VX_VY",
        name: "Load Vx with value at Vy",
        pattern: 0x8000,
        mask: 0xf00f,
        arguments: [
            {mask: 0x0f00, shift: 8, type: "R"},
            {mask: 0x00f0, shift: 4, type: "R"}
        ]
    },
    {
        id: "OR_VX_VY",
        name: "Bitwise OR of Vx and Vy",
        pattern: 0x8001,
        mask: 0xf00f,
        arguments: [
            {mask: 0x0f00, shift: 8, type: "R"},
            {mask: 0x00f0, shift: 4, type: "R"}
        ]
    },
    {
        id: "AND_VX_VY",
        name: "Bitwise AND of Vx and Vy",
        pattern: 0x8002,
        mask: 0xf00f,
        arguments: [
            {mask: 0x0f00, shift: 8, type: "R"},
            {mask: 0x00f0, shift: 4, type: "R"}
        ]
    },
    {
        id: "XOR_VX_VY",
        name: "Bitwise XOR of Vx and Vy",
        pattern: 0x8003,
        mask: 0xf00f,
        arguments: [
            {mask: 0x0f00, shift: 8, type: "R"},
            {mask: 0x00f0, shift: 4, type: "R"}
        ]
    },
    {
        id: "ADD_VX_VY",
        name: "ADD Vy to Vx",
        pattern: 0x8004,
        mask: 0xf00f,
        arguments: [
            {mask: 0x0f00, shift: 8, type: "R"},
            {mask: 0x00f0, shift: 4, type: "R"}
        ]
    },
    {
        id: "SUB_VX_VY",
        name: "Subtract Vy from Vx",
        pattern: 0x8005,
        mask: 0xf00f,
        arguments: [
            {mask: 0x0f00, shift: 8, type: "R"},
            {mask: 0x00f0, shift: 4, type: "R"}
        ]
    },
    {
        id: "SHR_VX_VY",
        name: "RIGHT shift Vx by 1 or Vy",
        pattern: 0x8006,
        mask: 0xf00f,
        arguments: [
            {mask: 0x0f00, shift: 8, type: "R"},
            {mask: 0x00f0, shift: 4, type: "R"}
        ]
    },
    {
        id: "SUBN_VX_VY",
        name: "Subtract Vx from Vy",
        pattern: 0x8007,
        mask: 0xf00f,
        arguments: [
            {mask: 0x0f00, shift: 8, type: "R"},
            {mask: 0x00f0, shift: 4, type: "R"}
        ]
    },
    {
        id: "SHL_VX_VY",
        name: "left shift Vx by 1 or Vy",
        pattern: 0x800e,
        mask: 0xf00f,
        arguments: [
            {mask: 0x0f00, shift: 8, type: "R"},
            {mask: 0x00f0, shift: 4, type: "R"}
        ]
    },
    {
        id: "SNE_VX_VY",
        name: "skip next instruction if Vx != Vy",
        pattern: 0x9000,
        mask: 0xf000,
        arguments: [
            {mask: 0x0f00, shift: 8, type: "R"},
            {mask: 0x00f0, shift: 4, type: "R"}
        ]
    },
    {
        id: "LD_I_NNN",
        name: "load index with NNN addr",
        pattern: 0xa000,
        mask: 0xf000,
        arguments: [
            {mask: 0x0fff, shift: 0, type: "A"}
        ]
    }, 
    {
        id: "JMP_V0_NNN",
        name: "Jumpt to address NNN + V0",
        pattern: 0xb000,
        mask: 0xf000,
        arguments:[
            {mask: 0x0fff, shift: 0, type: "A"}
        ]
    },
    {
        id: "RND_VX_NN",
        name: "set Vx to random number bitwise and with NN",
        pattern: 0xc000,
        mask: 0xf000,
        arguments:[
            {mask: 0x0f00, shift: 8, type: "R"},
            {mask: 0x00ff, shift: 0, type: "N"}
        ]
    },
    {
        id: "DRW_VX_VY_N",
        name: "draw nbye sride at memoryy location I at Vx,Vy",
        pattern: 0xd000,
        mask: 0xf000,
        arguments:[
            {mask: 0x0f00, shift: 8, type: "R"},
            {mask: 0x00f0, shift: 4, type: "R"},
            {mask: 0x000f, shift: 0, type: "N"}
        ]
    },
    {
        id: "SKP_VX",
        name: "If key VX pressed skip next",
        pattern: 0xe09e,
        mask: 0xf0ff,
        arguments:[
            {mask: 0x0f00, shift: 8, type: "R"}
        ]
    },
    {
        id: "SKNP_VX",
        name: "If key VX NOT pressed skip next",
        pattern: 0xe0a1,
        mask: 0xf0ff,
        arguments:[
            {mask: 0x0f00, shift: 8, type: "R"}
        ]
    },
    {
        id: "LD_VX_DT",
        name: "Load Vx with DT",
        pattern: 0xf007,
        mask: 0xf0ff,
        arguments:[
            {mask: 0x0f00, shift: 8, type: "R"}
        ]
    },
    {
        id: "LD_VX_K",
        name: "wait for key press and store value of key in Vx",
        pattern: 0xf00a,
        mask: 0xf0ff,
        arguments:[
            {mask: 0x0f00, shift: 8, type: "R"}
        ]
    },
    {
        id: "LD_DT_VX",
        name: "Load DT with VX",
        pattern: 0xf015,
        mask: 0xf0ff,
        arguments:[
            {mask: 0x0f00, shift: 8, type: "R"}
        ]
    },
    {
        id: "LD_ST_VX",
        name: "Load ST with VX",
        pattern: 0xf018,
        mask: 0xf0ff,
        arguments:[
            {mask: 0x0f00, shift: 8, type: "R"}
        ]
    },
    {
        id: "ADD_I_VX",
        name: "add vx to i",
        pattern: 0xf01e,
        mask: 0xf0ff,
        arguments:[
            {mask: 0x0f00, shift: 8, type: "R"}
        ]
    },
    {
        id: "LD_F_VX",
        name: "Set I to the location of sprite for digit Vx",
        pattern: 0xf029,
        mask: 0xf0ff,
        arguments:[
            {mask: 0x0f00, shift: 8, type: "R"}
        ]
    },
    {
        id: "LD_B_VX",
        name: "store BCD of Vx in memory Location I, I+1",
        pattern: 0xf033,
        mask: 0xf0ff,
        arguments:[
            {mask: 0x0f00, shift: 8, type: "R"}
        ]
    },
    {
        id: "LD_[I]_VX",
        name: "store v0 to vx in memory starting at address I. I is then set to I + x + 1",
        pattern: 0xf055,
        mask: 0xf0ff,
        arguments:[
            {mask: 0x0f00, shift: 8, type: "R"}
        ]
    },
    {
        id: "LD_VX_DT",
        name: "Loads V0 to Vx in memory starting at address I. I is then set to I + x + 1",
        pattern: 0xf065,
        mask: 0xf0ff,
        arguments:[
            {mask: 0x0f00, shift: 8, type: "R"}
        ]
    },

]

disassembleOpCode = (op)=>{
   console.log(op.toString(16)) 
    const instruction = instructions.find((instruction)=>(op&instruction.mask)===instruction.pattern)
    if(!instruction)
        throw new Error("Invalid Istruction OpCode " + op)
    const args = instruction.arguments.map((arg)=>{
        return(
            (op&arg.mask)>>arg.shift
        )
    })
    console.log(instruction)
    return {instruction, args}
}

module.exports = {
    disassembleOpCode,
    instructions
}