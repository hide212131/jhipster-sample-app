/**
 * Provides utility functions and components for simplifying the testing setup
 * for React components and Redux stores.
 */
import React, { PropsWithChildren } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { RenderOptions, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PreloadedState, ReducersMapObject, combineReducers, configureStore } from '@reduxjs/toolkit';
import { translate } from 'react-jhipster';
import * as pluralize from 'pluralize';

import { IRootState } from 'app/config/store';
import { registerLocale } from 'app/config/translation';
import errorMiddleware from 'app/config/error-middleware';
import notificationMiddleware from 'app/config/notification-middleware';
import sharedReducers from 'app/shared/reducers';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

/**
 * Configures a Redux store for testing with optional reducers and preloaded state.
 * @see {@link src/main/webapp/app/config/store.ts}
 * @param {ReducersMapObject} reducers - Additional reducers to include in the store.
 * @param {any} preloadedState - The initial state to preload into the store.
 * @returns The configured store.
 */
export const setupStore = (reducers: ReducersMapObject, preloadedState: any) =>
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
 * Extended render options for testing.
 * @see {@link https://redux.js.org/usage/writing-tests#setting-up-a-reusable-test-render-function}
 *
 * @property {PreloadedState<IRootState>} [preloadedState] - Optional preloaded state for the Redux store.
 * @property {ReturnType<typeof setupStore>} [store] - Optional Redux store to use.
 * @property {ReducersMapObject} reducers - Additional reducers to be included in the Redux store.
 * @property {string} initialEntry - Initial URL for the entity being tested.
 * @property {string} entityName - Name of the entity being tested; used for translation keys.
 */
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<IRootState>;
  store?: ReturnType<typeof setupStore>;
  reducers: ReducersMapObject;
  initialEntry: string;
  entityName: string;
}

/**
 * Renders a React component with providers for testing.
 * @see {@link https://redux.js.org/usage/writing-tests#setting-up-a-reusable-test-render-function}
 */
export const renderWithProviders = (
  ui: React.ReactElement,
  {
    reducers,
    preloadedState,
    initialEntry,
    entityName,
    store = setupStore(reducers, preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions,
) => {
  const Wrapper = ({ children }: PropsWithChildren<object>): JSX.Element => (
    <>
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/${initialEntry}`]}>
          <ErrorBoundaryRoutes>{children}</ErrorBoundaryRoutes>
        </MemoryRouter>
      </Provider>
      <ToastContainer className="toastify-container" toastClassName="toastify-toast" />
    </>
  );

  /**
   * Retrieves a DOM element by its label text, derived from Testing Library's getByLabelText query.
   * @see {@link https://testing-library.com/docs/queries/bylabeltext/}
   *
   * @param {string} key - The key identifying the form's input field (can be singular or plural).
   * @returns The DOM element associated with the label text.
   *
   * The label text used to query the element is generated based on the provided `key` argument.
   * It matches the text located in `src/main/webapp/i18n/${lang}/${entityName}.json` under the key `myReactApp.${entityName}.${key}`.
   */
  const getByLabelTextKey = (key: string) => renderResult.getByLabelText(translateWithPluralizeKey(key));

  /**
   * Retrieves a DOM element by its text content, derived from Testing Library's getByText query.
   * @see {@link https://testing-library.com/docs/queries/bytext/}
   *
   * @param {string} key - The key identifying the form's input field (can be singular or plural).
   * @returns The DOM element associated with the text content.
   *
   * The text content used to query the element is generated based on the provided `key` argument.
   * It matches the text located in `src/main/webapp/i18n/${lang}/${entityName}.json` under the key `myReactApp.${entityName}.${key}`.
   */
  const getByTextKey = (key: string) => renderResult.getByText(translateWithPluralizeKey(key));

  /**
   * Sets the text for an input element identified by a label text key.
   * @param {string} key - The key identifying the form's input field (can be singular or plural).
   * @param {string} text - The text to set in the input.
   */
  const setText = async (key: string, text: string) => {
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
  const setForm = async (data: object) => {
    for (const [key, value] of Object.entries(data)) {
      await setText(key, value);
    }
  };

  /**
   * Translates a key based on the entity's field.
   * @param {string} key - The key identifying the form's input field (can be singular or plural).
   * @returns Translated string.
   */
  const translateWithPluralizeKey = (key: string) => {
    const translated = translate(`myReactApp.${entityName}.${key}`);
    if (translated.includes('translation-not-found')) {
      return translate(`myReactApp.${entityName}.${pluralize.singular(key)}`);
    } else {
      return translated;
    }
  };

  registerLocale(store);
  const renderResult = render(ui, { wrapper: Wrapper, ...renderOptions });
  const renderResultWithAccessor = {
    getByLabelTextKey,
    getByTextKey,
    setForm,
    ...renderResult,
  };
  return { store, ...renderResultWithAccessor };
};
