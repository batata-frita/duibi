import React from 'react'
import ReactDOMServer from 'react-dom/server'
import duibi from '..'

duibi({
  url: 'https://www.klarna.com/se/',
  containerSelector: '.block-hero__title',
}).then(result => console.log('done', result), error => console.log('ERROR', error))