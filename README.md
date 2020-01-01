# HappyNewYear

A little scene with the christmas tree using [A-Frame](https://github.com/aframevr/aframe), [AR.js](https://github.com/jeromeetienne/AR.js) and [Hammer.js](https://github.com/hammerjs/hammer.js).


## Demonstration
Demonstration can be seen here: [Link](https://cyoq.github.io/HappyNewYear/) with this [pattern marker](https://github.com/cyoq/HappyNewYear/blob/master/marker/pattern-marker.png)
![demo](miscellaneous/demo.gif)


## How to use it
In the downloaded folder run:
```
npm i
```
Project uses webpack bundler. Webpack development server runs on https://localhost:8080. In order to start development mode, run:
```
npm run dev
```
To build the project run:
```
npm run build
```
All built files are placed into the dist folder, excepting index.html which is placed into the root folder.


## A big thanks to:

  * [takashi](https://codepen.io/tksiiii/pen/MRjWzv?editors=1010) for showing how to create snow particles.
  * Piotr Adam Milewski's answer on [Stackoverflow](https://stackoverflow.com/questions/50197836/looking-for-a-way-in-aframe-to-rotate-and-scale-a-model-via-touch-when-rendered) how to rotate model in AR.js.

