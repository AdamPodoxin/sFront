let generatedElements = [];

export const registerElement = (templatePath, elementName, callback = null) => {
  const elementsOfTag = document.getElementsByTagName(elementName);

  Array.from(elementsOfTag).forEach((element) => {
    const variables = {};
    const attributes = element.attributes;

    for (let i = 0; i < attributes.length; i++) {
      variables[attributes[i].name] = attributes[i].value;
    }

    createElementFromTemplate(
      templatePath,
      variables,
      element,
      (elementObject) => {
        element.setAttribute("sFront-id", elementObject.id);

        let observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type == "attributes") {
              let attributeName = mutation.attributeName;

              let mutatedVariables = elementObject.variables;
              mutatedVariables[attributeName] = element.getAttribute(
                attributeName
              );

              elementObject.variables = mutatedVariables;
            }
          });
        });

        observer.observe(element, { attributes: true });

        if (callback != null) callback(elementObject);
      }
    );
  });
};

export const createElementFromTemplate = (
  templatePath,
  variables,
  insertAtElement,
  callback = null
) => {
  let xhr = new XMLHttpRequest();
  xhr.onload = () => {
    let rawHTML = xhr.responseText.trim();
    createElementObject(rawHTML, variables, insertAtElement, callback);
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
  const id = Math.random().toString(36).substr(2, 9);

  let elementObject = {
    rawHTML,
    insertAtElement,
    callback,
    id,

    get elementWithoutSpan() {
      let formattedElement = this.rawHTML;

      for (let key in this._variables) {
        const keyInRes = `$${key}`;
        formattedElement = formattedElement
          .split(keyInRes)
          .join(this._variables[key]);
      }

      formattedElement = formattedElement.split("$id").join(this.id);

      return formattedElement;
    },

    get element() {
      return `<span class="sFront-generated" id="${id}">${this.elementWithoutSpan}</span>`;
    },

    get variables() {
      return this._variables;
    },
    set variables(v) {
      this._variables = { ...v };
      renderElement(this);
    },
  };

  elementObject._variables = { ...variables };
  generatedElements.push(elementObject);
  renderElement(elementObject);

  if (elementObject.callback !== null) callback(elementObject);

  return elementObject;
};

export const renderElement = (elementObject) => {
  const thisElement = document.getElementById(elementObject.id);

  if (thisElement === null) {
    elementObject.insertAtElement.insertAdjacentHTML(
      "beforeend",
      elementObject.element
    );
  } else {
    thisElement.innerHTML = elementObject.elementWithoutSpan;
  }
};

export const deleteElementFromDOM = (elementObject) => {
  document.getElementById(elementObject.id).remove();

  const deleteIndex = generatedElements.indexOf(elementObject);
  generatedElements.splice(deleteIndex, 1);
};

export const deleteElementFromDOMById = (id) => {
  const elementToDelete = getElementObjectById(id);
  deleteElementFromDOM(elementToDelete);
};

export const registerFunctionsInWindow = (functions) => {
  for (let key in functions) {
    window[key] = functions[key];
  }
};

export const getElementObjectById = (id) => {
  return generatedElements.filter(
    (elementObject) => elementObject.id === id
  )[0];
};
