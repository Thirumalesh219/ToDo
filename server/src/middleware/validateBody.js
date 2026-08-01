const { body, validationResult } = require("express-validator");

const signupValidation = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Enter a valid email"),

    body("password1")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 4 })
        .withMessage("Password must be at least 4 characters"),

    body("password2")
        .notEmpty()
        .withMessage("Confirm password is required"),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.json({
                errors: errors.array()
            });
        }

        next();
    }
];


const loginValidation = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Enter a valid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.json({
                errors: errors.array()
            });
        }

        next();
    }
];


module.exports = {
    signupValidation,
    loginValidation
};