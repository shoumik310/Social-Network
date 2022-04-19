import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from '../routing/PrivateRoute';
import Login from '../auth/Login';
import Register from '../auth/Register';
import Alert from '../layout/Alert';
import Dashboard from '../dashboard/Dashboard';
import CreateProfile from '../profile-forms/CreateProfile';
import EditProfile from '../profile-forms/EditProfile';
import AddExperience from '../profile-forms/AddExperience';
import AddEducation from '../profile-forms/AddEducation';
import Profiles from '../profiles/Profiles';
import Profile from '../profile/Profile';
import Posts from '../posts/Posts';
import Post from '../post/Post';
import { NotFound } from '../layout/NotFound';

const AppRoutes = () => {
	return (
		<section className='container'>
			<Alert />
			<Routes>
				<Route exact path='/register' element={<Register />} />
				<Route exact path='/login' element={<Login />} />
				<Route exact path='/profiles' element={<Profiles />} />
				<Route exact path='/profile/:id' element={<Profile />} />
				<Route
					exact
					path='/dashboard'
					element={
						<PrivateRoute>
							<Dashboard />
						</PrivateRoute>
					}
				/>
				<Route
					exact
					path='/create-profile'
					element={
						<PrivateRoute>
							<CreateProfile />
						</PrivateRoute>
					}
				/>
				<Route
					exact
					path='/edit-profile'
					element={
						<PrivateRoute>
							<EditProfile />
						</PrivateRoute>
					}
				/>
				<Route
					exact
					path='/add-experience'
					element={
						<PrivateRoute>
							<AddExperience />
						</PrivateRoute>
					}
				/>
				<Route
					exact
					path='/add-education'
					element={
						<PrivateRoute>
							<AddEducation />
						</PrivateRoute>
					}
				/>
				<Route
					exact
					path='/posts'
					element={
						<PrivateRoute>
							<Posts />
						</PrivateRoute>
					}
				/>
				<Route
					exact
					path='/posts/:id'
					element={
						<PrivateRoute>
							<Post />
						</PrivateRoute>
					}
				/>
				<Route path='*' element={<NotFound />} />
			</Routes>
		</section>
	);
};

export default AppRoutes;
