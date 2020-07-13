export const createElementFromTemplate = (
  templatePath,
  variables,
  callback
) => {
  var xhr = new XMLHttpRequest();
  xhr.onload = () => {
    let responseText = xhr.responseText;

    for (let key in variables) {
      const keyInRes = `$${key}`;
      responseText = responseText.replace(keyInRes, variables[key]);
    }

    callback(responseText);
  };

  xhr.open("GET", templatePath);
  xhr.send();
};
