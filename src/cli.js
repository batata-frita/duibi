#!/usr/bin/env node
import meow from 'meow'
import chalk from 'chalk'
import termImg from 'term-img';
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
.then((result) => {
	console.log(chalk.magenta('Background'))
	termImg(result.backgroundScreenshotPath, { fallback: () => {} })
	console.log(chalk.cyan('• screenshot:'), result.backgroundScreenshotPath)
	console.log(chalk.cyan('• average color:'), result.backgroundAverageColor)
	console.log(chalk.magenta('\nText'))
	termImg(result.containerScreenshotPath, { fallback: () => {} })
	console.log(chalk.cyan('• screenshot:'), result.containerScreenshotPath)
	console.log(chalk.cyan('• color:'), result.foregroundColor)
	console.log(chalk.magenta('\nReport'))
	console.log(chalk.cyan('• color contrast ratio:'), result.ratio)
	console.log(chalk.cyan('• a11y score:'), result.score)
	console.log(chalk.cyan('• is accessible:'), result.isAccessible ? '✅' : '❌')

	if (!result.isAccessible) {
		process.exit(1)
	}
})
.catch((error) => {
	console.error(error)
	process.exit(1)
})
