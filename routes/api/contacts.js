const express = require("express");

const router = express.Router();

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");
const Joi = require("joi");

const schema = Joi.object({
  name: Joi.required(),
  email: Joi.required(),
  phone: Joi.required(),
});

router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  res.status(200).json(contacts);
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId);
    if (!contact) throw new Error();
    res.status(200).json(contact);
  } catch (err) {
    res.status(404).json({ message: "Not found" });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const validatedBody = schema.validate(req.body);
    if (validatedBody.error)
      throw new Error(
        `missing required ${validatedBody.error.details[0].path[0]} field`
      );
    const newContact = await addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(404).json({ message: err.message });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const deletedContact = await getContactById(req.params.contactId);
    if (!deletedContact) throw new Error();
    removeContact(req.params.contactId);
    res.status(200).json({ "message": "contact deleted" })
  } catch (err) {
    res.status(404).json({ "message": "Not found" })
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const validatedBody = schema.validate(req.body);
    if (validatedBody.error) throw new Error(`missing fields`);

    const shouldUpdateContact = await getContactById(req.params.contactId);
    if (!shouldUpdateContact) throw new Error('Not found');

    const newContact = await updateContact(req.params.contactId, req.body);
    res.status(200).json(newContact);
  } catch (err) {
    res.status(404).json({ "message": err.message })
  }
});

module.exports = router;
