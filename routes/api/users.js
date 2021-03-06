const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const normalize = import('normalize-url');
const { validationResult, check } = require('express-validator');

const User = require('../../models/User');

// @route POST api/users
// @desc Register user
// @access Public
router.post(
	'/',
	check('name', "Name field can't be empty").notEmpty(),
	check('email', 'Invalid Email').isEmail(),
	check('password', 'Entered password length must be atleast 6 chars').isLength(
		{ min: 6 }
	),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, password } = req.body;

		try {
			let user = await User.findOne({ email });
			if (user) {
				return res.status(400).json({
					errors: [
						{
							msg: 'User Already Exists',
						},
					],
				});
			}

			const avatar = normalize(
				gravatar.url(email, {
					s: '200',
					r: 'pg',
					d: 'mm',
				}),
				{ forceHttps: true }
			);

			user = new User({ name, email, avatar, password });

			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);

			await user.save();

			const payload = {
				user: {
					id: user.id,
				},
			};

			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{
					expiresIn: 360000,
				},
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
		} catch (err) {
			console.error(err.message);
			req.status(500).send('Server Error');
		}
	}
);

module.exports = router;
