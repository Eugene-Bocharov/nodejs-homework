const fs = require('fs').promises;
const path = require('path');
const { v4 } = require('uuid')


const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const contacts = await fs.readFile(contactsPath)
  return JSON.parse(contacts)
}

const getContactById = async (contactId) => {
  const contacts = await fs.readFile(contactsPath)
  contact = JSON.parse(contacts).find((item) => item.id === contactId)
  return contact;
}

const removeContact = async (contactId) => {
  const contacts = JSON.parse(await fs.readFile(contactsPath));
  const deletedContact = contacts.find((item) => item.id === contactId)
  if (deletedContact) {
    filteredContacts = contacts.filter((item) => item.id !== contactId);
    fs.writeFile(contactsPath, JSON.stringify(filteredContacts))
  }
  return deletedContact;
}

const addContact = async (body) => {
  const newContact = { ...body, id: v4() }
  const contacts = JSON.parse(await fs.readFile(contactsPath));
  contacts.push(newContact)
  fs.writeFile(contactsPath, JSON.stringify(contacts))
  return newContact
}

const updateContact = async (contactId, body) => {
  const contacts = JSON.parse(await fs.readFile(contactsPath));
  const shouldUpdateContact = contacts.find((item) => item.id === contactId);

  filteredContacts = contacts.filter((item) => item.id !== contactId);
  const updatedContact = { ...shouldUpdateContact, ...body }
  filteredContacts.push(updatedContact)
  fs.writeFile(contactsPath, JSON.stringify(filteredContacts))
  return updatedContact
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
