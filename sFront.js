export const createElementFromTemplate = (
  templatePath,
  variables,
  callback,
  insertAtElement = null
) => {
  let xhr = new XMLHttpRequest();
  xhr.onload = () => {
    let responseText = xhr.responseText;

    for (let key in variables) {
      const keyInRes = `$${key}`;
      responseText = responseText.replace(keyInRes, variables[key]);
    }

    if (insertAtElement !== null) insertAtElement.innerHTML += responseText;
    if (callback !== null) callback(responseText);
  };

  xhr.open("GET", templatePath);
  xhr.send();
};
