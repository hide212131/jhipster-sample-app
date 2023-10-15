import React from 'react';
import { cleanup, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Route } from 'react-router-dom';
import { TranslatorContext, translate } from 'react-jhipster';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import RegionUpdate from './region-update';
import translation from 'i18n/en/region.json';
import { displayDefaultDateTime } from 'app/shared/util/date-utils';
import region from 'app/entities/region/region.reducer';
import { renderWithProviders } from '../entities-test-utils';
import {
  payloadData,
  payloadDataPartical,
  formDataPartical,
  formData,
  payloadDataParticalUpdated,
  formDataParticalUpdated,
  preloadedState,
} from './region.test-samples';

const server = setupServer(
  rest.get('/api/regions/1', (_req, res, ctx) => res(ctx.status(200), ctx.json({ id: 1, ...payloadData }))),
  rest.get('/api/regions/2', (_req, res, ctx) => res(ctx.status(200), ctx.json({ id: 2, ...payloadDataPartical }))),
  rest.get('/api/countries', null),
);

beforeAll(() => {
  TranslatorContext.registerTranslations('en', translation);
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
  cleanup();
});

afterAll(() => server.close());

const renderComponent = initialEntry =>
  renderWithProviders(
    <>
      {/* Required for `navigate('/region');`. */}
      <Route index path="/region/*" element={<span>Navigated to Regions</span>} />
      <Route path="new" element={<RegionUpdate />} />
      <Route path=":id">
        <Route path="edit" element={<RegionUpdate />} />
      </Route>
    </>,
    {
      reducers: { region },
      preloadedState,
      initialEntry,
      entityName: 'region',
    },
  );

describe('RegionUpdate Component Test Suite', () => {
  it('should render new RegionUpdate', async () => {
    // WHEN
    const { getByTextKey, getByLabelTextKey } = renderComponent('new');

    // THEN
    await waitFor(() => {
      expect(getByTextKey('home.createOrEditLabel')).toBeInTheDocument();
    });
  });

  it('should POST with only required fields for new registration and handle success', async () => {
    // GIVEN
    let requestError = null;
    server.use(
      rest.post('/api/regions', async (req, res, ctx) => {
        try {
          const payload = await req.json();
          expect(payload).toMatchObject(payloadDataPartical);
          return res(ctx.status(200), ctx.set('app-alert', 'myReactApp.region.created'), ctx.set('app-params', '1'), ctx.json(payloadData));
        } catch (e) {
          requestError = e;
          return res(ctx.status(500));
        }
      }),
    );

    // WHEN
    const { setForm, getByRole, findByText } = renderComponent('new');
    await waitFor(async () => {
      await setForm(formDataPartical);
      fireEvent.click(getByRole('button', { name: /save/i }));
    });

    // THEN
    try {
      expect(await findByText(translate('myReactApp.region.created', { param: '1' }))).toBeInTheDocument();
    } catch (e) {
      throw requestError ?? e;
    }
  });

  it('should POST with all fields for new registration and handle success', async () => {
    // GIVEN
    let requestError = null;
    server.use(
      rest.post('/api/regions', async (req, res, ctx) => {
        try {
          const payload = await req.json();
          expect(payload).toMatchObject(payloadData);
          return res(ctx.status(200), ctx.set('app-alert', 'myReactApp.region.created'), ctx.set('app-params', '1'), ctx.json(payloadData));
        } catch (e) {
          requestError = e;
          return res(ctx.status(500));
        }
      }),
    );

    // WHEN
    const { setForm, getByRole, findByText } = renderComponent('new');
    await waitFor(async () => {
      await setForm(formData);
      fireEvent.click(getByRole('button', { name: /save/i }));
    });

    // THEN
    try {
      expect(await findByText(translate('myReactApp.region.created', { param: '1' }))).toBeInTheDocument();
    } catch (e) {
      throw requestError ?? e;
    }
  });

  it('should POST for new registration and fail', async () => {
    // GIVEN
    server.use(
      rest.post('/api/regions', async (req, res, ctx) => {
        return res(ctx.status(500));
      }),
    );

    // WHEN
    const { setForm, getByRole, findAllByText } = renderComponent('new');
    await waitFor(async () => {
      await setForm(formDataPartical);
      fireEvent.click(getByRole('button', { name: /save/i }));
    });

    // THEN
    expect((await findAllByText('Network Error')).length).toBeGreaterThanOrEqual(1);
  });

  it('should render update RegionUpdate', async () => {
    const { getByLabelTextKey } = renderComponent('2/edit');
    await waitFor(() => {
      for (const [key, value] of Object.entries(formDataPartical)) {
        expect(getByLabelTextKey(key)).toHaveValue(value);
      }
    });
  });

  it('should PUT for update and succeed', async () => {
    // GIVEN
    let requestError = null;
    server.use(
      rest.put('/api/regions/2', async (req, res, ctx) => {
        const payload = await req.json();
        try {
          expect(payload).toMatchObject({ id: 2, ...payloadData, ...payloadDataParticalUpdated });
          return res(ctx.status(200), ctx.set('app-alert', 'myReactApp.region.updated'), ctx.set('app-params', '2'), ctx.json(payloadData));
        } catch (e) {
          requestError = e;
          return res(ctx.status(500));
        }
      }),
    );

    // WHEN
    const { getByLabelTextKey, setForm, getByRole, findByText } = renderComponent('2/edit');
    await waitFor(() => {
      for (const [key, value] of Object.entries(formDataPartical)) {
        expect(getByLabelTextKey(key)).toHaveValue(value);
      }
    });

    await waitFor(async () => {
      await setForm(formData);
      await setForm(formDataParticalUpdated);
      fireEvent.click(getByRole('button', { name: /save/i }));
    });

    // THEN
    try {
      expect(await findByText(translate('myReactApp.region.updated', { param: '2' }))).toBeInTheDocument();
    } catch (e) {
      throw requestError ?? e;
    }
  });

  it('should PUT for update and fail', async () => {
    // GIVEN
    server.use(
      rest.put('/api/regions/2', async (req, res, ctx) => {
        return res(ctx.status(500));
      }),
    );

    // WHEN
    const { setForm, getByRole, findAllByText } = renderComponent('2/edit');
    await waitFor(async () => {
      await setForm(formDataParticalUpdated);
      fireEvent.click(getByRole('button', { name: /save/i }));
    });

    // THEN
    expect((await findAllByText('Network Error')).length).toBeGreaterThanOrEqual(1);
  });

  it(' should cancel and go back', async () => {
    // WHEN
    const { getByRole, findByText } = renderComponent('2/edit');
    await waitFor(() => {
      fireEvent.click(getByRole('link', { name: /back/i }));
    });

    // THEN
    expect(await findByText('Navigated to Regions')).toBeInTheDocument();
  });
});
