import * as sFront from "../../sFront.js";

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

  sFront.registerElement(contactTemplatePath, "custom-contact");
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
  sFront.deleteElementFromDOM(id);
};

const submitContactPrompt = () => {
  let variables = {
    name: nameInput.value,
    phone: phoneInput.value,
  };

  if (promptMode == "add") {
    const newContact = `<custom-contact name="${nameInput.value}" phone="${phoneInput.value}"></custom-contact>`;
    contactsDiv.insertAdjacentHTML("beforeend", newContact);

    sFront.scanForElements("custom-contact");
  } else if (promptMode == "edit") {
    sFront.getElementObjectById(editingId).variables = variables;
  }

  nameInput.value = "";
  phoneInput.value = "";

  contactPrompt.style.display = "none";
};
