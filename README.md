<div align="center">
  
<br />
 
<img src="https://raw.githubusercontent.com/Paol-imi/react-reparenting/master/website/static/logo/logo.png" width="25%" /><br /><br />
<img src="https://raw.githubusercontent.com/Paol-imi/react-reparenting/master/website/static/logo/reactreparenting.png" width="35%" />

<h1></h1>

**Simple**, **intuitive** and **configurable** tools to manage **reparenting** with [`React`](https://reactjs.org/)

[![npm](https://img.shields.io/npm/v/react-reparenting.svg?style=flat-square)](http://npm.im/react-reparenting)
[![React: Tools](https://img.shields.io/badge/React-Tools-26C9FF?style=flat-square&logo=react)](http://npm.im/react-reparenting)
[![Circle Ci](https://img.shields.io/circleci/build/github/Paol-imi/react-reparenting?style=flat-square)](https://app.circleci.com/pipelines/github/Paol-imi/react-reparenting)
[![Codecov](https://img.shields.io/codecov/c/github/paol-imi/react-reparenting?color=44cc11&logo=codecov&style=flat-square)](https://codecov.io/gh/Paol-imi/react-reparenting)
[![Code style: Prettier](https://img.shields.io/badge/Code_style-Prettier-ff69b4.svg?style=flat-square&logo=prettier)](https://prettier.io/)
[![Types: Typescript](https://img.shields.io/badge/Types-Typescript-red?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

<img src="https://raw.githubusercontent.com/Paol-imi/react-reparenting/master/website/static/gifs/reparenting.gif" width="68%" />

</div>

## What does it do? 🤨

Imagine that you have two Parent components, both with some Child components. To `transfer` a Child from one Parent to another, the components must be `re-rendered` with that Child in its new Parent. This procedure has obvious usability and performance `limits`, the transferred component is unmounted, re-mounted and loses its internal state, as well as all the nodes it has generated (such as a `<div>`).

React does not yet offer specific APIs to solve this problem, in many cases we try to deal with it using `Portals` and `refs`. This approach presents other problems, it is difficult to implement for large-scale apps and above all it does not give the feeling of being very `"Reactive"`. In fact, portals have been designed for other purposes, citing the documentation:

> Portals provide a first-class way to render children into a DOM node that exists outside the DOM hierarchy of the parent component.

This process is more related to the DOM, at `"React level"` the Child is still part of the same Parent. This is where `React-reparenting` intervenes.

This package offers `easy` and `intuitive` tools to solve this problem. With a few lines of code you will be able to transfer your components, without them being re-mounted or losing their internal state.

| ⚠️  | This is an experimental technology that interacts with React [**internals**](https://paol-imi.github.io/react-reparenting/docs/introduction#under-the-hood), you shouldn't rely on them in your production code. The React team could introduce breaking changes in future releases without following the semver rules. |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

## Documentation 📖

You can find the full documentation [**here**](https://paol-imi.github.io/react-reparenting).

## Examples 💡

Check out the [**examples**](https://paol-imi.github.io/react-reparenting/examples) available on Codesandbox.

## License ©

Copyright © 2020 [**Paolo Longo**](https://github.com/Paol-imi) • [**MIT license**](LICENSE).
