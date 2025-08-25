import Contact from '../models/ContactModal.js';

// Create a new contact
export const createContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const newContact = new Contact({
      name,
      email,
      phone: phone || '', // Make phone optional
      subject,
      message
    });

    const savedContact = await newContact.save();
    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: savedContact
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Server error occurred'
    });
  }
};

// Get all contacts
export const getContacts = async (req, res) => {
  try {
    const { status } = req.query;
    
    let filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    const contacts = await Contact.find(filter).sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single contact by ID
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update contact status
export const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a contact
export const deleteContact = async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!deletedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};