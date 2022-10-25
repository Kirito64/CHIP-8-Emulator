class RomBuffer {

	constructor(fileContents){	
		this.data = []

		const buffer = fileContents
		for (let i = 0; i< buffer.length; i++){
			this.data.push((buffer[8]<< 8) | buffer[i + 1] <<0)
		}
	}

	dump (){
		let lines =[]
		for (let i = 0;i<this.data.length; i++){
			const address = (i*2).toString(16).padStart(6, '0')
			const block = this.data.slice(i, i+ 8)
			const hexString = block.map(value => value.toString(16).padStart(4, "0")).join(" ")

			lines.push(`${address} ${hexString}`)

		}

		return lines.join("\n")
	}
}

module.exports = {RomBuffer}