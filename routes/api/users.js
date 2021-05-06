const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const router = express.Router();
const { check, validationResult } = require("express-validator");

//add models
const User = require('../../models/User');

//@route GET api/users
//@desc Test route
//@access Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include valid email").isEmail(),
    check("password", "PLease enter password greater than 6").isLength({min: 6}),
  ],
  async (req, res) => {
    const errors =  validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});//bad req
    }
    console.log(req.body);
     const { name, email, password } = req.body; 
     try {
    //See if user exists
    let user = await User.findOne({ email });
    
    if (user) {
       return res.status(400).json({errors : [{ msg: 'user already exists' }] });
    }

    //get users gravatar
    const avatar = gravatar.url(email, {
        s: '200', //size
        r: 'pg', //restriction
        d: 'mm' //default, mm default image or 404
    })

    user = new User({
        name,
        email,
        password,
        avatar
    });

    //encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    
    //Return json web token
    const payload = {
        user: {
            id: user.id
        }
    }

    // res.send("User registered");

        //pas payload and secret
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn: 360000},
            (err, token) => {
                console.log(token)
                if(err) throw err;
                res.json({ token })
            }
        );

     } catch(e) {
        console.error(e.message);
        res.status(500).send('Server Error');
     }
  }
);

module.exports = router;
