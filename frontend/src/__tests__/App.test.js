import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import App from '../App';

test('Renders the App component', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
});

test('Renders the Login route', () => {
  const { getByText } = render( // Destructure getByText from render
    <Provider store={store}>
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    </Provider>
  );

  expect(getByText('Employee Login')).toBeInTheDocument();
});

test('Renders the ViewOrganizations route', () => {
  const { getByText } = render( // Destructure getByText from render
    <Provider store={store}>
      <MemoryRouter initialEntries={['/viewOrganizations']}>
        <App />
      </MemoryRouter>
    </Provider>
  );

  expect(getByText('Organizations', { selector: 'h1' })).toBeInTheDocument();
});