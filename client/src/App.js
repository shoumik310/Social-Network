import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import AppRoutes from './components/routing/AppRoutes';
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
						<Route path='*' element={<AppRoutes />} />
					</Routes>
				</Fragment>
			</Router>
		</Provider>
	);
};

export default App;
