const React = require('react')
const temp = require('temp')
const fs = require('fs')
const puppeteer = require('puppeteer')
const ReactDOMServer = require('react-dom/server')
const Button = require('@klarna/bubble-ui').Button

// Automatically track and cleanup files at exit
temp.track()

const content = `
  <style>
    body { margin: 0 }
  </style>
  <body>
    ${ReactDOMServer.renderToString(<Button.Primary>Regular</Button.Primary>)}
  </body>
`
const htmlFilename = temp.path({ suffix: '.html' })
const imageFilename = temp.path({ suffix: '.png' })
const url = `file://${htmlFilename}`

const doIt = async () => {
  console.log(htmlFilename, content)

  fs.writeFileSync(htmlFilename, content)

  const browser = await puppeteer.launch()
  const chrome = await browser.newPage()
  await chrome.goto(url)

  const element = await chrome.$('button')
  const screenshot = await element.screenshot()

  await chrome.close()

  console.log('image', imageFilename)
  fs.writeFileSync(imageFilename, screenshot)
}

doIt().then(() => console.log('done'), error => console.log('ERROR', error))
