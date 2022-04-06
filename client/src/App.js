import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/routing/PrivateRoute';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './action/auth';
import './App.css';

//Redux
import { Provider } from 'react-redux';
import store from './store';

if (localStorage.getItem('token')) {
	setAuthToken(localStorage.getItem('token'));
}

const App = () => {
	useEffect(() => store.dispatch(loadUser()), []);
	return (
		<Provider store={store}>
			<Router>
				<Fragment>
					<Navbar />
					<Routes>
						<Route exact path='/' element={<Landing />} />
					</Routes>
					<section className='container'>
						<Alert />
						<Routes>
							<Route exact path='/register' element={<Register />} />
							<Route exact path='/login' element={<Login />} />
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
						</Routes>
					</section>
				</Fragment>
			</Router>
		</Provider>
	);
};

export default App;
