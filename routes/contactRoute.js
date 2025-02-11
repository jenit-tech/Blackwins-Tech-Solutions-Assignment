import express from 'express';
import { Contact } from '../models/contactModel.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').notEmpty().withMessage('Email is required'),
    body('phoneNumber').notEmpty().withMessage('Phone number is required'),
    body('address').notEmpty().withMessage('Address is required'),
  ],
  async (request, response) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
      }

      const { name, email, phoneNumber, address } = request.body;

      
      const lastContact = await Contact.findOne().sort({ contactId: -1 });
      const newContactId = lastContact ? lastContact.contactId + 1 : 1;

      const newContact = new Contact({
        contactId: newContactId,
        name,
        email,
        phoneNumber,
        address,
      });

      const contact = await newContact.save();

      return response.status(201).json({
        message: 'Contact created successfully',
        contact: {
          _id: contact._id,
          contactId: contact.contactId,
          name: contact.name,
          email: contact.email,
          phoneNumber: contact.phoneNumber,
          address: contact.address,
          createdAt: contact.createdAt,
          updatedAt: contact.updatedAt,
        },
      });
    } catch (error) {
      console.log(error.message);
      response.status(500).json({ message: error.message });
    }
  }
);




router.get('/', async (request, response) => {
  try {
    const contacts = await Contact.find({}).sort({ contactId: 1 });

    
    const formattedContacts = contacts.map(contact => ({
      _id: contact._id,
      contactId: contact.contactId, 
      name: contact.name,
      email: contact.email,
      phoneNumber: contact.phoneNumber,
      address: contact.address,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
      __v: contact.__v
    }));

    return response.status(200).json({
      count: formattedContacts.length,
      data: formattedContacts,
    });

  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});



router.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const contact = await Contact.findById(id);

    if (!contact) {
      return response.status(404).json({ message: 'Contact not found' });
    }

    const formattedContact = {
      _id: contact._id,
      contactId: contact.contactId, 
      name: contact.name,
      email: contact.email,
      phoneNumber: contact.phoneNumber,
      address: contact.address,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
      __v: contact.__v
    };

    return response.status(200).json(formattedContact);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});



router.put(
  '/:id',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('phoneNumber').notEmpty().withMessage('Phone number is required'),
    body('address').notEmpty().withMessage('Address is required'),
  ],
  async (request, response) => {
    try {
      
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
      }

      const { id } = request.params;
      const { name, email, phoneNumber, address } = request.body;

      const contact = await Contact.findById(id);

      if (!contact) {
        return response.status(404).json({ message: 'Contact not found' });
      }

     
      contact.name = name;
      contact.email = email;
      contact.phoneNumber = phoneNumber;
      contact.address = address;

      const updatedContact = await contact.save();

      return response.status(200).json({
        message: 'Contact updated successfully',
        contact: {
          _id: updatedContact._id,
          contactId: updatedContact.contactId,
          name: updatedContact.name,
          email: updatedContact.email,
          phoneNumber: updatedContact.phoneNumber,
          address: updatedContact.address,
          createdAt: updatedContact.createdAt,
          updatedAt: updatedContact.updatedAt,
          __v: updatedContact.__v,
        },
      });
    } catch (error) {
      console.log(error.message);
      response.status(500).json({ message: error.message });
    }
  }
);







router.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return response.status(404).json({ message: 'Contact not found' });
    }

    return response.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
