import createError from 'http-errors';
import * as contactsService from '../services/contacts.js';

export const getAllContacts = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      type,
      isFavourite,
    } = req.query;

    const result = await contactsService.getAllContacts({
      page: parseInt(page),
      perPage: parseInt(perPage),
      sortBy,
      sortOrder,
      type,
      isFavourite,
      userId: req.user._id,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;

  const contact = await contactsService.getContactById(contactId, req.user._id);

  if (!contact) throw createError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContact = async (req, res) => {
  const contact = await contactsService.createContact({
    ...req.body,
    userId: req.user._id,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const updateContact = async (req, res) => {
  const { contactId } = req.params;

  const contact = await contactsService.updateContact(
    contactId,
    req.body,
    req.user._id,
  );

  if (!contact) throw createError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
};

export const deleteContact = async (req, res) => {
  const { contactId } = req.params;

  const deleted = await contactsService.deleteContact(contactId, req.user._id);

  if (!deleted) throw createError(404, 'Contact not found');

  res.status(204).send();
};
