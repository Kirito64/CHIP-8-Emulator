const r = require("raylib")
const fs = require("fs")

const {CPU} = require("./Interface/chip8Cpu")
const {RomBuffer} = require("./Interface/RomBuffer")
const {TerminalCPUInterface} = require("./Interface/TerminalCpuInterface")

const {DISPLAY_WIDTH, DISPLAY_HEIGHT} = require("./data/ScreenHeight")

const {getNativeKeyMap} = require("./data/keyMapnative")

const fileContents = fs.readFileSync(process.argv.slice(2)[0])

if(!fileContents) throw new Error("Error in Reading Error")

const multiplier = 10
const screenWidth = DISPLAY_WIDTH * multiplier
const screenHeight = DISPLAY_HEIGHT * multiplier
console.log(TerminalCPUInterface)

const cpuInterface = new TerminalCPUInterface()

const cpu = new CPU(cpuInterface)
const rombuffer = new RomBuffer(fileContents)


fs.writeFileSync("rom.txt", rombuffer.dump())
cpu.load(rombuffer)
r.InitWindow(screenWidth, screenHeight, "Chip8")
r.SetTargetFPS(60)
r.ClearBackground(r.BLACK)

const nativeKeyMap = getNativeKeyMap(r)
let timer = 0;

while (!r.WindowShouldClose()) {
  timer++
  if (timer % 5 === 0) {
    cpu.tick()
    timer = 0
  }

  let keyDownIndices = 0
  // Run through all possible keys
  for (let i = 0; i < nativeKeyMap.length; i++) {
    const currentKey = nativeKeyMap[i]
    // If key is already down, add index to key down map
    // This will also lift up any keys that aren't pressed
    if (r.IsKeyDown(currentKey)) {
      keyDownIndices |= 1 << i
    }
  }

  // Set all pressed keys
  cpu.interface.setKeys(keyDownIndices)

  cpu.step()

  r.BeginDrawing()

  cpu.interface.frameBuffer.forEach((y, i) => {
    y.forEach((x, j) => {
      if (x) {
        r.DrawRectangleRec(
          {
            x: j * multiplier,
            y: i * multiplier,
            width: multiplier,
            height: multiplier,
          },
          r.GREEN
        )
      } else {
        r.DrawRectangleRec(
          {
            x: j * multiplier,
            y: i * multiplier,
            width: multiplier,
            height: multiplier,
          },
          r.BLACK
        )
      }
    })
  })

  r.EndDrawing()
}

r.CloseWindow()

