const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");

const auth = require('../../middleware/auth');
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");


const User = require('../../models/User');

//

//@route POST api/auth
//@desc Authenticate user and get token
//@access Public
router.post(
    "/",
    [
      check("email", "Please include valid email").isEmail(),
      check("password", "Password is required").exists()
    ],
    async (req, res) => {
      const errors =  validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({errors: errors.array()});//bad req
      }
      console.log(req.body);
       const { email, password } = req.body; 
       try {
      //See if user exists
      let user = await User.findOne({ email });
      
      if (!user) {
         return res.status(400).json({errors : [{ msg: 'Invalid Credentials' }] });
      }
    
    //check password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({errors : [{ msg: 'Invalid Credentials' }] });
      }

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

//@route        GET api/auth
//@desc         Test route
//@access       Public
router.get('/', auth, async (req, res) => {
    // res.send('Auth Route')
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.log(err.message);
        res.status(500).send('server error from auth js')
    }
});


module.exports = router;