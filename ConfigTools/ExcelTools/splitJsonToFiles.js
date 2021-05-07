const fs = require('fs')
const PATH = require('path')

let arg = process.argv.splice(2)

if(arg.length < 1)
{
	console.log('arg is null')
	return
}

if(!fs.existsSync(arg[0]))
{
	console.log(arg[0], ' is not exists')
	return
}


let result
try
{
	result = fs.readFileSync(arg[0])
	result = result.toString()
}
catch
{
	console.log('read file error')
	return
}

let jsonObj
try
{
	jsonObj = JSON.parse(result)
	let dir = PATH.dirname(arg[0]) + PATH.sep
	for(let i in jsonObj)
	{
		let table = jsonObj[i]
		fs.writeFileSync(dir + i + '.json', JSON.stringify(table))
		console.log(i, ' ok')
	}
	fs.unlinkSync(arg[0])
}
catch
{
	console.log('json parse error')
}