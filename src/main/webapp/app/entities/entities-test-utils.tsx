/**
 * Provides utility functions and components for simplifying the testing setup
 * for React components and Redux stores.
 */
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { translate } from 'react-jhipster';
import errorMiddleware from 'app/config/error-middleware';
import notificationMiddleware from 'app/config/notification-middleware';
import { ReducersMapObject, Store, combineReducers, configureStore } from '@reduxjs/toolkit';
import sharedReducers from 'app/shared/reducers';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import React from 'react';

/**
 * Configures a Redux store for testing with optional reducers and preloaded state.
 * see 'src/main/webapp/app/config/store.ts'.
 * @param {ReducersMapObject} reducers - Additional reducers to include in the store.
 * @param {any} preloadedState - The initial state to preload into the store.
 * @returns The configured store.
 */
export const configureTestStore = (reducers: ReducersMapObject, preloadedState: any) =>
  configureStore({
    preloadedState,
    reducer: combineReducers({ ...sharedReducers, ...reducers }),
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these field paths in all actions
          ignoredActionPaths: ['payload.config', 'payload.request', 'payload.headers', 'error', 'meta.arg'],
        },
      }).concat(errorMiddleware, notificationMiddleware),
  });

/**
 * A wrapper component for testing that includes necessary providers and initial setup.
 * @param {object} props - The component props.
 * @param {Store} props.store - The Redux store.
 * @param {string} props.initialEntry - The initial route for the MemoryRouter.
 * @param {React.ReactNode} props.children - The child components to render.
 */
export const TestComponent = ({ store, initialEntry, children }: { store: Store; initialEntry: string; children: React.ReactNode }) => (
  <>
    <ToastContainer className="toastify-container" toastClassName="toastify-toast" />
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/${initialEntry}`]}>
        <ErrorBoundaryRoutes>{children}</ErrorBoundaryRoutes>
      </MemoryRouter>
    </Provider>
  </>
);

/**
 * Gets an element by its label text key.
 * @param {string} key - The key used for translation.
 * @returns The DOM element.
 */
export const getByLabelTextKey = (key: string) => screen.getByLabelText(translate(`myReactApp.employee.${key}`));

/**
 * Gets an element by its text key.
 * @param {string} key - The key used for translation.
 * @returns The DOM element.
 */
export const getByTextKey = (key: string) => screen.getByText(translate(`myReactApp.employee.${key}`));

/**
 * Sets the text for an input element identified by a label text key.
 * @param {string} key - The key used for translation to identify the input.
 * @param {string} text - The text to set in the input.
 */
export const setText = async (key: string, text: string) => {
  const input = getByLabelTextKey(key);
  await userEvent.click(input);
  try {
    await userEvent.clear(input); // Clear existing text
    await userEvent.type(input, text); // Type new text
  } catch {
    // If it's a select input, select the option instead
    await userEvent.selectOptions(input, text);
  }
};

/**
 * Sets the form data by iterating through an object of key-value pairs.
 * @param {object} data - The form data as an object.
 */
export const setForm = async (data: object) => {
  for (const [key, value] of Object.entries(data)) {
    await setText(key, value);
  }
};
