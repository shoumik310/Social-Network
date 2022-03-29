const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');

// @route POST api/posts
// @desc Add new post
// @access Private
router.post(
	'/',
	auth,
	check('text', 'Text is required').notEmpty(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const user = await User.findById(req.user.id).select('-password');
			const newPost = new Post({
				text: req.body.text,
				user: req.user.id,
				name: user.name,
				avatar: user.avatar,
			});
			const post = await newPost.save();
			res.json({ post });
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route GET api/posts
// @desc Get all posts
// @access Private
router.get('/', auth, async (req, res) => {
	try {
		const posts = await Post.find().sort({ date: -1 });

		res.json({ posts });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route GET api/posts/:post_id
// @desc Get posts by id
// @access Private
router.get('/:post_id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.post_id);

		if (!post) {
			return res.status(404).json({ msg: 'Post Not Found' });
		}

		res.json({ post });
	} catch (err) {
		console.error(err.message);

		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post Not Found' });
		}

		res.status(500).send('Server Error');
	}
});

// @route DELETE api/posts/:post_id
// @desc Delete a post
// @access Private
router.delete('/:post_id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.post_id);

		if (!post) {
			return res.status(404).json({ msg: 'Post Not Found' });
		}

		//Check user
		if (post.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'User not Authorized' });
		}

		await post.delete();

		res.json({ msg: 'Post Deleted' });
	} catch (err) {
		console.error(err.message);

		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post Not Found' });
		}

		res.status(500).send('Server Error');
	}
});

// @route PUT api/posts/like/:post_id
// @desc Like a post
// @access Private
router.put('/like/:post_id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.post_id);
		if (!post) {
			return res.status(404).json({ msg: 'Post Not Found' });
		}

		//Check if post has already been liked
		if (
			post.likes.filter((like) => like.user.toString() === req.user.id)
				.length >= 1
		) {
			return res.status(400).json({ msg: 'Post Already Liked' });
		}

		post.likes.unshift({ user: req.user.id });
		await post.save();

		res.json(post.likes);
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post Not Found' });
		}
		res.status(500).send('Server Error');
	}
});

// @route PUT api/posts/unlike/:post_id
// @desc unlike a post
// @access Private
router.put('/unlike/:post_id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.post_id);
		if (!post) {
			return res.status(404).json({ msg: 'Post Not Found' });
		}

		//Check if post has not been liked
		if (
			post.likes.filter((like) => like.user.toString() === req.user.id).length <
			1
		) {
			return res.status(400).json({ msg: 'Post Not Liked' });
		}

		//Get remove index
		const removeIndex = post.likes
			.map((like) => like.id.toString())
			.indexOf(req.user.id);
		post.likes.splice(removeIndex, 1);
		await post.save();

		res.json(post.likes);
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post Not Found' });
		}
		res.status(500).send('Server Error');
	}
});

// @route PUT api/posts/comment/:post_id
// @desc Comment on a post
// @access Private
router.put(
	'/comment/:post_id',
	auth,
	check('text', 'Text is required').notEmpty(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const post = await Post.findById(req.params.post_id);
			if (!post) {
				return res.status(404).json({ msg: 'Post Not Found' });
			}

			const user = await User.findById(req.user.id).select('-password');
			const newComment = {
				text: req.body.text,
				user: req.user.id,
				name: user.name,
				avatar: user.avatar,
			};

			post.comments.unshift(newComment);

			await post.save();
			res.json(post.comments);
		} catch (err) {
			console.error(err.message);
			if (err.kind === 'ObjectId') {
				return res.status(404).json({ msg: 'Post Not Found' });
			}
			res.status(500).send('Server Error');
		}
	}
);

// @route DELETE api/posts/comment/:post_id/:comment_id
// @desc Delete comment from a post
// @access Private
router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.post_id);
		if (!post) {
			return res.status(404).json({ msg: 'Post Not Found' });
		}

		const commentIndex = post.comments
			.map((comment) => comment.id.toString())
			.indexOf(req.params.comment_id);
		if (commentIndex == -1) {
			return res.status(400).json({ msg: 'Comment Not Found' });
		}
		if (post.comments[commentIndex].user.toString() != req.user.id) {
			return res.status(401).json({ msg: 'User Not Authorized' });
		}

		post.comments.splice(commentIndex, 1);

		await post.save();
		res.json(post.comments);
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post Not Found' });
		}
		res.status(500).send('Server Error');
	}
});

module.exports = router;
