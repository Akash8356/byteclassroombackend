const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentRegistrationSchema = new mongoose.Schema({
    profession: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true}, // Remove unique constraint
    contact: { type: String, required: true },
    interests: { type: [String], required: true },
    password: { type: String, required: true },
    img: { type: String },
    byteId: { type: String, unique: true, required: true }, // Keep this unique
});

// Virtual field for confirmPassword (not stored in DB)
studentRegistrationSchema.virtual('confirmPassword')
    .get(function () { return this._confirmPassword; })
    .set(function (value) { this._confirmPassword = value; });

studentRegistrationSchema.pre('save', function (next) {
    // Check if password matches confirmPassword
    if (this.password !== this._confirmPassword) {
        return next(new Error('Passwords do not match'));
    }

    // Hash the password before saving
    bcrypt.hash(this.password, 10, (err, hashedPassword) => {
        if (err) return next(err);
        this.password = hashedPassword; // Set the hashed password
        next(); // Proceed to save the document
    });
});

// Export as studentRegistration model
module.exports = mongoose.model('studentRegistration', studentRegistrationSchema);
