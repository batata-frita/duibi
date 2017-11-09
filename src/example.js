import React from 'react'
import ReactDOMServer from 'react-dom/server'
import duibi from '.'

duibi({
  html: `
        <style>
          body { margin: 0 }
        </style>
        <body>
          ${ReactDOMServer.renderToString(
            <button style={{ backgroundColor: 'white', color: 'black' }}>DARK</button>
          )}
        </body>
      `,
  containerSelector: 'button',
}).then(result => console.log('done', result), error => console.log('ERROR', error))
