import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import thunk from 'redux-thunk'
import {createStore, compose, applyMiddleware} from "redux";
import {rootReducer} from "./redux/reducers/rootReducer"
import {Provider} from "react-redux";

const store = createStore(rootReducer, compose(applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App/>
        </Provider>
    </React.StrictMode>
);

