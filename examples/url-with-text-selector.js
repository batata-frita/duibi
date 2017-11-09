import duibi from '..'

duibi({
  url: 'https://www.klarna.com/se/',
  containerSelector: '#section-2 > div:nth-child(1) > div > div > p',
  textSelector: 'font',
}).then(result => console.log('done', result))
