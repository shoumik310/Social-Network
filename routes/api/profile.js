const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const request = require('request');
const config = require('config');
const axios = require('axios');
const normalize = import('normalize-url');
const { validationResult, check } = require('express-validator');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route GET api/profile/me
// @desc Get current user's profile
// @access Private
router.get('/me', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id }).populate(
			'user',
			['name', 'avatar']
		);
		if (!profile) {
			return res.status(400).json({ msg: 'There is no profile for this user' });
		}

		res.json(profile);
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server Error');
	}
});

// @route POST api/profile
// @desc Create or update a profile
// @access Private
router.post(
	'/',
	auth,
	check('status', 'Status is required').notEmpty(),
	check('skills', 'Skills is required').notEmpty(),
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
			twitter,
			facebook,
			linkedin,
			instagram,
		} = req.body;

		const profileFields = {
			user: req.user.id,
			company,
			location,
			website: website === '' ? '' : normalize(website, { forceHttps: true }),
			bio,
			skills: Array.isArray(skills)
				? skills
				: skills.split(',').map((skill) => ' ' + skill.trim()),
			status,
			githubusername,
		};

		// Build social object and add to profileFields
		const socialFields = { youtube, twitter, instagram, linkedin, facebook };
		for (const [key, value] of Object.entries(socialFields)) {
			if (value.length > 0) {
				socialFields[key] = normalize(value, { forceHttps: true });
			}
		}
		profileFields.social = socialFields;

		console.log(profileFields);

		try {
			profile = await Profile.findOneAndUpdate(
				{ user: req.user.id },
				{ $set: profileFields },
				{ new: true, upsert: true }
			);

			res.json(profile);
		} catch (error) {
			console.error(error.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route GET api/profile
// @desc Get all profiles
// @access Public
router.get('/', async (req, res) => {
	try {
		const profiles = await Profile.find().populate('user', ['name', 'avatar']);
		res.json(profiles);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route GET api/profile/user/:user_id
// @desc Get profile by user id
// @access Public
router.get('/user/:user_id', async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.params.user_id,
		}).populate('user', ['name', 'avatar']);

		if (!profile) {
			return res.status(400).json({ msg: 'Profile Not Found' });
		}

		res.json(profile);
	} catch (err) {
		console.error(err.message);
		if (err.kind == 'ObjectId') {
			return res.status(400).json({ msg: 'Profile Not Found' });
		}
		res.status(500).send('Server Error');
	}
});

// @route DELETE api/profile
// @desc Delete user, profile and posts
// @access Private
router.delete('/', auth, async (req, res) => {
	try {
		//Delete Posts
		await Post.deleteMany({ user: req.user.id });

		//Deleting Profile
		await Profile.findOneAndDelete({
			user: req.user.id,
		});

		//Deleting User
		await User.findOneAndDelete({
			_id: req.user.id,
		});

		res.json({ msg: 'User Deleted' });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route PUT api/profile/experience
// @desc Adding Experience to profile
// @access Private
router.put(
	'/experience',
	auth,
	check('title', 'Title is Required').notEmpty(),
	check('company', 'Company is Required').notEmpty(),
	check('from', 'From Date is Required').notEmpty(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { title, company, location, from, to, current, description } =
			req.body;

		const newExp = { title, company, location, from, to, current, description };
		try {
			const profile = await Profile.findOne({ user: req.user.id });

			profile.experience.unshift(newExp);

			await profile.save();

			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route DELETE api/profile/experience/:exp_id
// @desc Deleting Experience from profile
// @access Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });

		//get remove index
		profile.experience = profile.experience.filter(
			(exp) => exp.id !== req.params.exp_id
		);

		await profile.save();

		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route PUT api/profile/education
// @desc Adding Education to profile
// @access Private
router.put(
	'/education',
	auth,
	check('school', 'School is Required').notEmpty(),
	check('degree', 'Degree is Required').notEmpty(),
	check('fieldofstudy', 'Field of Study is Required').notEmpty(),
	check('from', 'From Date is Required').notEmpty(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { school, degree, fieldofstudy, from, to, current, description } =
			req.body;

		const newEdu = {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description,
		};

		try {
			const profile = await Profile.findOne({ user: req.user.id });

			profile.education.unshift(newEdu);

			await profile.save();

			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route DELETE api/profile/education/:edu_id
// @desc Deleting Education from profile
// @access Private
router.delete('/education/:edu_id', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });

		//Getting remove Index
		profile.education = profile.education.filter(
			(edu) => edu.id !== req.params.edu_id
		);

		await profile.save();

		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route GET api/profile/github/:username
// @desc Get user repos from github
// @access Public
router.get('/github/:username', async (req, res) => {
	try {
		const uri = encodeURI(
			`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
		);
		const headers = {
			'user-agent': 'node.js',
			Authorization: `token ${config.get('githubToken')}`,
		};

		const gitHubResponse = await axios.get(uri, { headers });
		return res.json(gitHubResponse.data);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
