import * as sFront from "https://adampodoxin.github.io/sFront/sFront.js";

const contactTemplatePath = "contact.html";

let contactPrompt, contactsDiv, nameInput, phoneInput;

let promptMode = "add",
  editingId = "";

window.onload = () => {
  contactPrompt = document.querySelector("#contact-prompt");
  contactsDiv = document.querySelector("#contacts");
  nameInput = document.querySelector("#name-input");
  phoneInput = document.querySelector("#phone-input");

  sFront.registerFunctionsInWindow({
    editContact,
    deleteContact,
    addContact,
    submitContactPrompt,
  });
};

const addContact = () => {
  promptMode = "add";
  contactPrompt.style.display = "block";
};

const editContact = (id) => {
  editingId = id;
  promptMode = "edit";
  contactPrompt.style.display = "block";

  let variables = { ...sFront.getElementObjectById(editingId).variables };
  nameInput.value = variables.name;
  phoneInput.value = variables.phone;
};

const deleteContact = (id) => {
  sFront.deleteElementFromDOMById(id);
};

const submitContactPrompt = () => {
  let variables = {
    name: nameInput.value,
    phone: phoneInput.value,
  };

  if (promptMode == "add") {
    sFront.createElementFromTemplate(
      contactTemplatePath,
      variables,
      contactsDiv
    );
  } else if (promptMode == "edit") {
    sFront.getElementObjectById(editingId).variables = variables;
  }

  nameInput.value = "";
  phoneInput.value = "";

  contactPrompt.style.display = "none";
};
