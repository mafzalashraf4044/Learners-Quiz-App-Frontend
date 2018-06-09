import React from 'react';
import ReactDOM from 'react-dom';

//Root Component
import App from './components/App';

//React Redux
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import { loadUsers } from './actions/userActions';
import { loadGroups } from './actions/groupActions';


//React Router for Browsers
import { BrowserRouter } from 'react-router-dom'

import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const store = configureStore();
store.dispatch(loadUsers());
store.dispatch(loadGroups());

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
