import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    contactId: {
      type: Number,
      unique: true, // Ensures unique values
    },
    name: {
      type: String,
      required: true,
    },
    email: {  
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to auto-increment contactId
contactSchema.pre('save', async function (next) {
  if (!this.contactId) {
    const lastContact = await Contact.findOne().sort({ contactId: -1 }); // Get the latest contactId
    this.contactId = lastContact ? lastContact.contactId + 1 : 1; // Increment or start from 1
  }
  next();
});

export const Contact = mongoose.model('Contact', contactSchema);
