const StudentRegistration = require('./../models/StudentRegistration');
const bcrypt = require('bcryptjs');
const RegisterStudent = async (req, res, next) => {
    const { profession, name, email, contact, interests, password, confirmPassword } = req.body;

    try {
        // Validate input fields
        if (!email || !password || !confirmPassword || !profession|| !name|| !contact || !interests) {
            return res.json({
                status: 1,
                message: "Invalid request body!"
            });
        }

        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
            return res.json({
                status: 1,
                message: "Passwords do not match!"
            });
        }

        // Check if email already exists in the database
        const existingStudent = await StudentRegistration.findOne({ email:email });
        if (existingStudent) {
            return res.json({
                status: 1,
                message: "Email already exists!"
            });
        }

        // Create new student object


        let student = new StudentRegistration({
            profession: req.body.profession,
            name: req.body.name,
            email: req.body.email,  // Allow duplicates here
            contact: req.body.contact,
            interests: req.body.interests,
            password: req.body.password,
        });

           // Set confirmPassword
        student._confirmPassword = req.body.confirmPassword;
        // Creating unique byteId
        const timestamp = Date.now().toString();
        student.byteId = `BCI${timestamp}`; // Ensure it's unique for each entry
        // Save the student
        await student.save();

        // Send successful response
        return res.json({
            status: 0,
            message: "Student added successfully!",
            data: {
                profession,
                name,
                email,
                contact,
                interests,
                byteId: student.byteId
            }
        });
    } catch (error) {
        console.error('Error during registration:', error);

        return res.json({
            status: -1,
            message: "Something went wrong",
            error: error.message,
        });
    }
};

const LoginStudent = async (req, res, next) => {
    let loginDetails = {
        email: req.body.email,
        password: req.body.password
    };
    try {
        if (loginDetails.email && loginDetails.password) {
            const existingStudent = await StudentRegistration.findOne({ email: loginDetails.email });
            if (existingStudent) {
                // Convert the existingStudent document to a plain object
                const studentData = existingStudent.toObject();
                // Compare the entered password with the hashed password in the database
                bcrypt.compare(loginDetails.password, studentData.password, (err, isMatch) => {
                    if (err) return next(err);

                    if (!isMatch) {
                        return res.json({
                            status: 0,
                            message: "Invalid password",
                        });
                    }
                    const { password, ...result } = studentData;
                    return res.json({
                        status: 0,
                        message: "Student added successfully!",
                        data: result
                    });
                });
            } else {
                return res.json({
                    status: 1,
                    message: "Invalid email Id!"
                });
            }
        } else {
            return res.json({
                status: 1,
                message: "Invalid request body!"
            });
        }
    } catch (error) {
        console.error('Error during registration:', error);

        return res.json({
            status: -1,
            message: "Something went wrong",
            error: error.message,
        });
    }
};


module.exports = {
    RegisterStudent, LoginStudent
};
