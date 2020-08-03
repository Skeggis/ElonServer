const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const { isEmailRegistered, createUserHandler, getUserByEmailHandler, signInWithGoogleHandler } = require('../handlers/usersHandler.js')


async function googleLogin(req, res) {
    const { email = '', googleId = '', name = '', photoUrl = '' } = req.body

    if (!(email && googleId)) {
        return res.status(400).json({
            success: false,
            message: "Client error",
            errors: ["Please fill all fields"]
        })
    }

    const user = {
        email,
        googleId,
        name,
        photoUrl
    }

    const result = await signInWithGoogleHandler(user)

    if (!result.success) {
        return res.status(401).json(result)
    }

    return res.status(200).json(result)

    
}

async function login(req, res) {
    const { email = '', password = '' } = req.body

    if (!(email && password)) {
        return res.status(400).json({
            success: false,
            message: "Client error",
            errors: ["Please fill all fields"]
        })
    }

    const result = await getUserByEmailHandler(email)

    if (!result.success) {
        return res.status(401).json(result)
    }

    if(await comparePasswords(password, result.user.password)){
        return res.status(200).json(result)
    }

    return res.status(401).json({success: false, errors: ["Email or password are incorrect"]})

    
}

async function signUp(req, res) {
    const { email = '', password = '', confirmPassword = '' } = req.body

    const errors = []

    if (!(email && password && confirmPassword)) { errors.push("Please fill all fields") }

    if (password != confirmPassword) { errors.push("Passwords do not match") }

    if (password.length < 8) { errors.push("Password must be at least 8 characters") }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Client error",
            errors
        })
    }

    if (await isEmailRegistered(email)) {
        errors.push("Email is already registered")
        return res.status(400).json({
            success: false,
            message: "Client error",
            errors
        })
    }

    const user = {
        email,
        password,
        uuid: uuidv4(),
    }

    const hashedPassword = await hashPassword(user)
    if (!hashedPassword) { return res.status(500).json({ success: false, errors: ["Something went HORRIBLY wrong"] }) }

    user.password = hashedPassword

    const result = await createUserHandler(user);

    if (!result.success) { return result.status(500).json(result) }

    return res.status(200).json(result)
}

async function logout(req, res) {
    //TODO: Do something.
    res.status(200).json({ success: true })
}

async function comparePasswords(password, hashedPassword) {
    const isPassword = await new Promise((resolve, reject) => {
        if (!hashedPassword || !password) { resolve(false) }
        bcrypt.compare(password, hashedPassword, function (err, isMatch) {
            if (err) reject(err)
            resolve(isMatch)
        })
    })
    return isPassword
}

async function hashPassword(user) {

    const password = user.password
    const saltRounds = 10;

    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) reject(err)
            resolve(hash)
        });
    })

    return hashedPassword
}


router.post('/signUp', signUp);
router.post('/login', login)
router.post('/logout', logout)
router.post('/googleLogin', googleLogin)

module.exports = router;