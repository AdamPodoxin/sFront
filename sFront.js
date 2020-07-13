export const createElementFromTemplate = (
  templatePath,
  variables,
  insertAtElement,
  callback = null
) => {
  let xhr = new XMLHttpRequest();
  xhr.onload = () => {
    let responseText = xhr.responseText;

    let elementObject = createElementObject(
      responseText,
      variables,
      insertAtElement,
      callback
    );
  };

  xhr.open("GET", templatePath);
  xhr.send();
};

export const createElementObject = (
  rawHTML,
  variables,
  insertAtElement,
  callback = null
) => {
  let elementObject = {
    rawHTML,
    insertAtElement,
    callback,

    get element() {
      let formattedElement = this.rawHTML;

      for (let key in this._variables) {
        const keyInRes = `$${key}`;
        formattedElement = formattedElement.replace(
          keyInRes,
          this._variables[key]
        );
      }

      return formattedElement;
    },

    get variables() {
      return this._variables;
    },
    set variables(v) {
      insertAtElement.innerHTML = insertAtElement.innerHTML.replace(
        this.element.trim(),
        ""
      );

      this._variables = v;
      renderElement(this);
    },
  };

  elementObject._variables = variables;
  renderElement(elementObject);

  if (elementObject.callback !== null) callback(elementObject);

  return elementObject;
};

export const renderElement = (elementObject) => {
  elementObject.insertAtElement.innerHTML += elementObject.element;
};
