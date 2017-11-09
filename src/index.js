import React from 'react'
import ReactDOMServer from 'react-dom/server'
import temp from 'temp'
import fs from 'fs'
import puppeteer from 'puppeteer'
import { PNG } from 'pngjs'
import makethen from 'makethen'
import contrast from 'get-contrast'

// Automatically track and cleanup files at exit
temp.track()

const content = `
  <style>
    body { margin: 0 }
  </style>
  <body>
    ${ReactDOMServer.renderToString(
      <button style={{ backgroundColor: 'white', color: 'black' }}>DARK</button>
    )}
  </body>
`
const htmlFilename = temp.path({ suffix: '.html' })
const imageFilename = temp.path({ suffix: '.png' })
const url = `file://${htmlFilename}`

const getAverageColor = (data) => data
  .reduce((result, current, index) => {
    result[index % 4] = result[index % 4] + current

    return result
  }, [0, 0, 0, 0])
  .map((channel) => channel / (data.length / 4))
  .map(Math.floor)

const toRGBA = (data) => `rgba(${data[0]},${data[1]},${data[2]},${data[3]/255})`

const doIt = async () => {
  console.log(htmlFilename, content)

  fs.writeFileSync(htmlFilename, content)

  const browser = await puppeteer.launch()
  const chrome = await browser.newPage()
  await chrome.goto(url)

  const element = await chrome.$('button')

  const textColor = await chrome.evaluate((element) => {
    return window.getComputedStyle(element).getPropertyValue('color')
  }, element)

  await chrome.evaluate((element) => {
    element.style.color = 'transparent'
  }, element)

  const screenshot = await element.screenshot()

  const png = new PNG({ filterType: 4 })
  const parse = makethen(png.parse.bind(png))

  const parsedData = await parse(screenshot)
  const backgroundAverageColor = toRGBA(getAverageColor(
    parsedData.data
  ))

  console.log(
    backgroundAverageColor,
    textColor,
    contrast.ratio(backgroundAverageColor, textColor),
    contrast.score(backgroundAverageColor, textColor),
    contrast.isAccessible(backgroundAverageColor, textColor)
  )


  await chrome.close()

  console.log('image', imageFilename)
  fs.writeFileSync(imageFilename, screenshot)
}

doIt().then(() => console.log('done'), error => console.log('ERROR', error))
