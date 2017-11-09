import duibi from '..'

duibi({
  html: `
    <style>
      body { margin: 0 }
    </style>
    <body>
      <button style={{ backgroundColor: 'white', color: 'black' }}>DARK</button>
    </body>
  `,
  containerSelector: 'button',
}).then(result => console.log('done', result))
