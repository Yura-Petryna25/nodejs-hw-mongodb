import ContactsCollection from '../db/models/Contact.js';

export const getContacts = async (query) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = query;

  const filter = {};

  if (type) {
    filter.contactType = type;
  }

  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite === 'true';
  }

  const skip = (Number(page) - 1) * Number(perPage);
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const [contacts, totalItems] = await Promise.all([
    ContactsCollection.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(perPage)),
    ContactsCollection.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / Number(perPage));

  return {
    data: contacts,
    page: Number(page),
    perPage: Number(perPage),
    totalItems,
    totalPages,
    hasPreviousPage: Number(page) > 1,
    hasNextPage: Number(page) < totalPages,
  };
};

export const getContactById = (id) => ContactsCollection.findById(id);

export const createContact = (data) => ContactsCollection.create(data);

export const updateContact = (id, data) =>
  ContactsCollection.findByIdAndUpdate(id, data, { new: true });

export const deleteContact = (id) => ContactsCollection.findByIdAndDelete(id);
