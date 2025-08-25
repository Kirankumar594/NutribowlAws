import express from 'express';
import {
  createContact,
  getContacts,
  getContactById,
  updateContactStatus,
  deleteContact
} from '../controllers/ContactController.js';

const router = express.Router();

// Create a new contact
router.post('/', createContact);

// Get all contacts
router.get('/', getContacts);

// Get single contact
router.get('/:id', getContactById);

// Update contact status
router.put('/:id/status', updateContactStatus);

// Delete contact
router.delete('/:id', deleteContact);

export default router;