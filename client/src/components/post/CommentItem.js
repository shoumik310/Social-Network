import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import formatDate from '../../utils/formatDate';
import { deleteComment } from '../../action/post';

const CommentItem = ({
	postId,
	comment: { _id, user, avatar, name, text, date },
	auth,
	deleteComment,
}) => (
	<div className='post bg-white p-1 my-1'>
		<div>
			<Link to={`/profile/${user}`}>
				<img className='round-img' src={avatar} alt='' />
				<h4>{name}</h4>
			</Link>
		</div>
		<div>
			<p className='my-1'>{text}</p>
			<p className='post-date'>Posted on {formatDate(date)}</p>
			{!auth.loading && user === auth.user._id && (
				<button
					onClick={() => deleteComment(postId, _id)}
					type='button'
					class='btn btn-danger'
				>
					<i class='fas fa-times'></i>
				</button>
			)}
		</div>
	</div>
);

CommentItem.propTypes = {
	postId: PropTypes.string.isRequired,
	comment: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	deleteComment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { deleteComment })(CommentItem);
