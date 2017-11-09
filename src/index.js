const React = require('react')
const temp = require('temp')
const fs = require('fs')
const { Chrome } = require('navalia')
const ReactDOMServer = require('react-dom/server')
const Button = require('@klarna/bubble-ui').Button

// Automatically track and cleanup files at exit
temp.track()

const content = ReactDOMServer.renderToString(<Button.Primary>Regular</Button.Primary>)
const htmlFilename = temp.path({ suffix: '.html' })
const imageFilename = temp.path({ suffix: '.png' })
const url = `file://${htmlFilename}`

const doIt = async () => {
  console.log(htmlFilename, content)

  fs.writeFileSync(htmlFilename, content)

  const chrome = new Chrome()
  await chrome.goto(url)

  const screenshot = await chrome.screenshot('body')

  await chrome.done()
  await chrome.kill()

  console.log('image', imageFilename)
  fs.writeFileSync(imageFilename, screenshot)
}

doIt().then(() => console.log('done'), error => console.log('ERROR', error))
