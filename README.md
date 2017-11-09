# duibi

[![Build Status](https://travis-ci.org/batata-frita/duibi.svg)](https://travis-ci.org/batata-frita/duibi)
[![npm version](https://badge.fury.io/js/duibi.svg)](https://badge.fury.io/js/duibi)

Library and tool to check colour contrast accessibility of elements in a web pages.

# Usage

Install:

```
npm install --save duibi
```

And use it as a library:

```js
import duibi from '..'

duibi({
  url: 'https://www.klarna.com/se/',
  containerSelector: '.block-hero__title',
}).then(result => console.log('done', result), error => console.log('error', error))
```

The `result` object contains:

```js
{
  backgroundAverageColor: 'rgba(255,255,255,1)',
  foregroundColor: 'rgb(217, 177, 177)',
  ratio: 1.931200716492237,
  score: 'F',
  isAccessible: false,
  backgroundScreenshotPath: '/var/folders/gm/bnfrz1.1dw45.png',
  containerScreenshotPath: '/var/folders/gm/36100-1rbuk51.ftfb.png',
}
```
