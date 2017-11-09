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

export default async test => {
  const { containerSelector, html } = test

  const htmlFilename = temp.path({ suffix: '.html' })
  const imageFilename = temp.path({ suffix: '.png' })
  const url = `file://${htmlFilename}`

  fs.writeFileSync(htmlFilename, html)

  const browser = await puppeteer.launch()
  const chrome = await browser.newPage()
  await chrome.goto(url)

  const element = await chrome.$(containerSelector)

  const foregroundColor = await chrome.evaluate(element => {
    return window.getComputedStyle(element).getPropertyValue('color')
  }, element)

  await chrome.evaluate(element => {
    element.style.color = 'transparent'
  }, element)

  const screenshot = await element.screenshot()

  const png = new PNG({ filterType: 4 })
  const parse = makethen(png.parse.bind(png))

  const parsedData = await parse(screenshot)
  const backgroundAverageColor = toRGBA(getAverageColor(parsedData.data))

  await chrome.close()

  return {
    backgroundAverageColor,
    foregroundColor,
    ratio: contrast.ratio(backgroundAverageColor, foregroundColor),
    score: contrast.score(backgroundAverageColor, foregroundColor),
    isAccessible: contrast.isAccessible(backgroundAverageColor, foregroundColor),
  }
}

const getAverageColor = data =>
  data
    .reduce(
      (result, current, index) => {
        result[index % 4] = result[index % 4] + current

        return result
      },
      [0, 0, 0, 0]
    )
    .map(channel => channel / (data.length / 4))
    .map(Math.floor)

const toRGBA = data => `rgba(${data[0]},${data[1]},${data[2]},${data[3] / 255})`
