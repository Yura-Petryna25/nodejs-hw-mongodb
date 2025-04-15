import ContactsCollection from '../db/models/Contact.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  type,
  isFavourite,
}) => {
  const skip = (page - 1) * perPage;
  const sortDirection = sortOrder === 'desc' ? -1 : 1;

  const filter = {};
  if (type) {
    filter.contactType = type;
  }
  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite === 'true';
  }

  const totalItems = await ContactsCollection.countDocuments(filter);
  const contacts = await ContactsCollection.find(filter)
    .sort({ [sortBy]: sortDirection })
    .skip(skip)
    .limit(Number(perPage));

  return {
    data: contacts,
    page: Number(page),
    perPage: Number(perPage),
    totalItems,
    totalPages: Math.ceil(totalItems / perPage),
    hasPreviousPage: page > 1,
    hasNextPage: page < Math.ceil(totalItems / perPage),
  };
};

export const getContactById = (id) => ContactsCollection.findById(id);

export const createContact = (data) => ContactsCollection.create(data);

export const updateContact = (id, data) =>
  ContactsCollection.findByIdAndUpdate(id, data, { new: true });

export const deleteContact = (id) => ContactsCollection.findByIdAndDelete(id);
