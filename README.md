# sFront: <ins>s</ins>imple <ins>Front</ins>-end

sFront is a **component-based**, front-end, JavaScript library. Make templating easier.

sFront strives for **easy integration**, **simplicity**, and **understandable syntax**.

<br>

Inspired by [React](https://github.com/facebook/react).

<br>

### Installation

1.  - Download or clone the [`sFront.js`](https://github.com/AdamPodoxin/sFront/blob/master/sFront.js) file to your project
      **OR**
    - Use the [sFront CDN](https://adampodoxin.github.io/sFront/sFront.js)
2.  Create a new `JavaScript (.js)` file which you will use for interacting with sFront
3.  Inlcude this file in your `HTML (.html/.htm)` file using a `<script>` tag
4.  Ensure that the `<script>` tag has the `type` attribute set to `module` (i.e. `<script type="module" src="..."></script>`)

### Integration

In your `JavaScript (.js)` file, either:

- Import all of sFront by stating:

  ```javascript
  import * as sFront from "sFront.js";
  ```

  You can name the sFront variable whatever you want, but ensure that you point to the correct path when importing.

  **OR**

- Import the desired sFront methods from the sFront file
  i.e.

  ```javascript
  import { registerElement } from "sFront.js";
  ```

- If using the [sFront CDN](https://adampodoxin.github.io/sFront/sFront.js), import from `https://adampodoxin.github.io/sFront/sFront.js` instead of a local file.

### Examples

Examples of how to use sFront can be seen in the [examples](https://github.com/AdamPodoxin/sFront/tree/master/examples) folder of the [GitHub repository](https://github.com/AdamPodoxin/sFront). The [contacts list example](https://github.com/AdamPodoxin/sFront/tree/master/examples/contactList) shows the perfect way to easily use templates with sFront.
