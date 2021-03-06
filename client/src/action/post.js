import api from '../utils/api';
import { setAlert } from './alert';
import {
	UPDATE_LIKES,
	GET_POSTS,
	POST_ERROR,
	DELETE_POST,
	ADD_POST,
	GET_POST,
	ADD_COMMENT,
	REMOVE_COMMENT,
} from './types';

//Get all posts
export const getPosts = () => async (dispatch) => {
	try {
		const res = await api.get('/api/posts');

		dispatch({
			type: GET_POSTS,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

//Add a like
export const addLike = (postId) => async (dispatch) => {
	try {
		const res = await api.put(`/api/posts/like/${postId}`);

		dispatch({
			type: UPDATE_LIKES,
			payload: { id: postId, likes: res.data },
		});
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

//Remove a like
export const removeLike = (postId) => async (dispatch) => {
	try {
		const res = await api.put(`/api/posts/unlike/${postId}`);

		dispatch({
			type: UPDATE_LIKES,
			payload: { id: postId, likes: res.data },
		});
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

//Delete a post
export const deletePost = (postId) => async (dispatch) => {
	try {
		await api.delete(`/api/posts/${postId}`);

		dispatch({
			type: DELETE_POST,
			payload: postId,
		});

		dispatch(setAlert('Post Removed', 'success'));
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

//Add post
export const addPost = (formData) => async (dispatch) => {
	try {
		const res = await api.post(`/api/posts`, formData);

		dispatch({
			type: ADD_POST,
			payload: res.data,
		});

		dispatch(setAlert('Post Created', 'success'));
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

//Get a post
export const getPost = (postId) => async (dispatch) => {
	try {
		const res = await api.get(`/api/posts/${postId}`);

		dispatch({
			type: GET_POST,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

//Add comment
export const addComment = (postId, formData) => async (dispatch) => {
	try {
		const res = await api.post(`/api/posts/comment/${postId}`, formData);

		dispatch({
			type: ADD_COMMENT,
			payload: res.data,
		});

		dispatch(setAlert('Comment Added', 'success'));
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

//Delete a comment
export const deleteComment = (postId, commentId) => async (dispatch) => {
	try {
		await api.delete(`/api/posts/comment/${postId}/${commentId}`);

		dispatch({
			type: REMOVE_COMMENT,
			payload: commentId,
		});

		dispatch(setAlert('Comment Removed', 'success'));
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};
