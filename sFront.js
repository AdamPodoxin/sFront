let registeredElements = [],
  scannedIds = [],
  generatedElements = [];

const createElementFromTemplate = (
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

const createElementObject = (
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

    get element() {
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

const updateCustomElement = (elementName) => {
  const elementsOfTag = document.getElementsByTagName(elementName);
  const rElement = registeredElements.filter(
    (e) => e.elementName == elementName
  )[0];

  Array.from(elementsOfTag).forEach((element) => {
    if (scannedIds.includes(element.getAttribute("id"))) return;
    updateSingleElement(element, rElement.callback);
  });
};

export const updateSingleElement = (element, callback = null) => {
  let variables = {};
  let attributes = element.attributes;

  let templatePath = registeredElements.filter(
    (e) => e.elementName.toLowerCase() == element.tagName.toLowerCase()
  )[0].templatePath;

  for (let i = 0; i < attributes.length; i++) {
    variables[attributes[i].name] = attributes[i].value;
  }

  createElementFromTemplate(
    templatePath,
    variables,
    element,
    (elementObject) => {
      element.setAttribute("id", elementObject.id);

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

      scannedIds.push(elementObject.id);
      if (callback != null) callback(elementObject);
    }
  );
};

export const scanForElements = (elementName) => {
  if (elementName == null) {
    Array.from(registeredElements).forEach((element) => {
      updateCustomElement(element.elementName);
    });
  } else {
    updateCustomElement(elementName);
  }
};

export const registerElement = (templatePath, elementName, callback = null) => {
  const newElement = {
    templatePath,
    elementName,
    callback,
  };

  registeredElements.push(newElement);
  scanForElements(elementName);
};

export const renderElement = (elementObject) => {
  const thisElement = document.getElementById(elementObject.id);

  if (thisElement === null) {
    elementObject.insertAtElement.insertAdjacentHTML(
      "beforeend",
      elementObject.element
    );
  } else {
    thisElement.innerHTML = elementObject.element;
  }
};

export const deleteElementFromDOM = (id) => {
  document.getElementById(id).remove();

  const deleteElement = generatedElements.filter(
    (element) => element.id == id
  )[0];
  const deleteIndex = generatedElements.indexOf(deleteElement);
  generatedElements.splice(deleteIndex, 1);
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
