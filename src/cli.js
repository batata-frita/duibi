#!/usr/bin/env node
import meow from 'meow'
import duibi from '.'

const cli = meow(`
	Usage
	  $ duibi <url> <container selector> <text selector>

	Examples
	  $ duibi 'https://klarna.com/' '.container' 'span'
`)

duibi({
	url: cli.input[0],
	containerSelector: cli.input[1],
	textSelector: cli.input[2]
})
.then(console.log)
.catch((error) => {
	console.error(error)
	process.exit(1)
})
