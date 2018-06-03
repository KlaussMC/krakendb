const fs = require('fs')

module.exports = (function() {
	var functions = {
		fromFile: scriptName => {
			var code = fs.readFileSync(scriptName, 'utf8')
			var tokens = []
			var lines = code.split("\n")
			var tmp;
			for (let i = 0; i < lines.length; i++) {
				tmp = lines.split(" ")
				tokens.push(tmp)
			}

			functions.run(tokens)
		},
		run: code => {
			var outputBuffer = [];

			for (let i in tokens) {
				var a = 0;
				while (i < i.length) {
					var tok = i[a]
					switch (tok) {
						case "get":
							outputBuffer.push(i[a++])
							a++;
							return
					}
				}
			}
		}
	}
	return functions;
})()
