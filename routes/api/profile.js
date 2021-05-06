const express = require("express");
const request = require("request");
const config = require("config");
const router = express.Router();
const auth = require("../../middleware/auth");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

const { check, validationResult } = require("express-validator");

//@route GET api/profile/me
//@desc get current user profile
//@access Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "No user profile" });
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Profile: Server Error" });
  }
});

//@route GET api/profile/
//@desc update/create current user profile
//@access Private

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    let profileFields = {};
    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills)
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    console.log(profileFields.skills);

    // build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
        // return res.status(400).json({ msg: "No user profile" });
      }
      //Create
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile); //resond with profile
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: "Profile, create: Server Error" });
    }
  }
);

//@route GET api/profile/:user_id
//@desc get all user profiles
//@access public
router.get("/user/:user_id", async (req, res) => {
    try {

        const profile = await Profile.findOne({ user: req.params.user_id })
        .populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({msg: 'profile not found'});
        }
        
        res.json(profile);
        
    } catch (error) {
        console.error(error.message);
        if(error.kind === 'ObjectId') {
            return res.status(400).json({msg: '(2) profile not found'});     
        }
      res.status(500).json({ msg: "Profile, get single: Server Error" });
    }

});

//@route GET api/profile
//@desc get all user profiles
//@access public
router.get("/", async (req, res) => {
    try {

        const profiles = await Profile.find()
        .populate('user', ['name', 'avatar']);
        res.json(profiles);
        
    } catch (error) {
      res.status(500).json({ msg: "Profile, get all: Server Error" });
    }

});

//@route DELETE api/profile
//@Delete user profile
//@access Private
router.delete("/", auth, async (req, res) => {
    try {
        //Remove profile
        //todo remove user posts
        await Profile.findOneAndRemove({user: req.user.id});
        //remove user
        await User.findOneAndRemove({_id: req.user.id});
        res.json({msg: 'Uaer removed'});
        
    } catch (error) {
      res.status(500).send('Server delete profile error')
    }

});


//@route  PUT api/profile/experience
//@desc   add profile experience
//@access Private
router.put("/experience", [auth, [
    check('title', 'tittle is required').not().isEmpty(),
    check('company', 'company is required').not().isEmpty(),
    check('from', 'from date is required').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }
    try {
        //Remove profile
        //todo remove user posts
        let userProfile = await Profile.findOne({user: req.user.id});
        userProfile.experience.unshift(newExp);
        
        await userProfile.save();
        res.json(userProfile);
        
    } catch (error) {
      res.status(500).send('Server update profile experience error')
    }

});
//@route  delete api/profile/experience/:exp_id
//@desc   delete profile experience
//@access Private
router.delete("/experience/:exp_id", auth, async (req, res) => {

    try {
        //Remove profile
        const userProfile = await Profile.findOne({user: req.user.id});

        //Get remove index
        const removeIndex = userProfile.experience.map(exp => exp.id).indexOf
        (req.params.exp_id);

        userProfile.experience.splice(removeIndex, 1);//splice removes
        
        await userProfile.save();

        res.json(userProfile);
    } catch (error) {
      res.status(500).send('Server delete profile experience error')
    }

});

// ----------------------------education-----------------------------------
//@route  PUT api/profile/education
//@desc   add education experience
//@access Private
router.put("/education", [auth, [
    check('school', 'school is required').not().isEmpty(),
    check('degree', 'degree is required').not().isEmpty(),
    check('fieldofstudy', 'field of study date is required').not().isEmpty(),
    check('from', 'from date is required').not().isEmpty(),
    // check('to', 'to date is required').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }
    try {
        let userProfile = await Profile.findOne({user: req.user.id});
        userProfile.education.unshift(newEdu);
        
        await userProfile.save();
        res.json(userProfile);
        
    } catch (error) {
      res.status(500).send('Server update profile education error')
    }

});

//@route  delete api/profile/education/:edu_id
//@desc   delete profile education
//@access Private
router.delete("/education/:edu_id", auth, async (req, res) => {

    try {
        //Remove profile
        const userProfile = await Profile.findOne({user: req.user.id});

        //Get remove index
        const removeIndex = userProfile.education.map(edu => edu.id).indexOf
        (req.params.edu_id);

        userProfile.education.splice(removeIndex, 1);//splice removes
        
        await userProfile.save();

        res.json(userProfile);
    } catch (error) {
      res.status(500).send('Server delete profile education error')
    }

});

//-------------------github stuff--------------------------
//@route  GET api/profile/github/:username
//@desc   Get user repos from github
//@access Public
router.get("/github/:username", async (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&
            sort=created:asc&client_id=${config.get('githubClientID')}
            &client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: {'user-agent': 'node.js' }
        }

        request(options, (error, response, body) => {
            if(error) console.error(error);

            if(response.statusCode !== 200) {
                return res.status(404).send('no github profile found');
            }
            res.json(JSON.parse(body));

        });
    } catch (error) {
      res.status(500).send('Server: get github user error')
    }

});

module.exports = router;
