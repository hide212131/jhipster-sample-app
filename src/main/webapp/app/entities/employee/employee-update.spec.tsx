import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Route } from 'react-router-dom';
import { TranslatorContext, translate } from 'react-jhipster';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import initStore from 'app/config/store';
import { registerLocale } from 'app/config/translation';
import EmployeeUpdate from './employee-update';
import translation from 'i18n/en/employee.json';
import { displayDefaultDateTime } from 'app/shared/util/date-utils';
import { reset } from './employee.reducer';
import { IEmployee } from 'app/shared/model/employee.model';
import employee from 'app/entities/employee/employee.reducer';
import { getByTextKey, getByLabelTextKey, setForm, configureTestStore, TestComponent } from '../entities-test-utils';

const formData = {
  firstName: 'Karson',
  lastName: 'Bins',
  email: 'Margarita_Hirthe@hotmail.com',
  phoneNumber: 'question yuck minus',
  hireDate: '2023-09-24T09:00',
  salary: '28065',
  commissionPct: '26272',
  manager: '4',
  department: '5',
};

const formDataPartical = {
  firstName: 'Karson',
  lastName: 'Bins',
};

const formDataParticalUpdated = {
  firstName: 'Updated',
  lastName: 'Updated2',
};

const payloadData: IEmployee = {
  firstName: 'Karson',
  lastName: 'Bins',
  email: 'Margarita_Hirthe@hotmail.com',
  phoneNumber: 'question yuck minus',
  hireDate: '2023-09-24T00:00:00.000Z',
  salary: 28065,
  commissionPct: 26272,
  manager: { id: 4 },
  department: { id: 5 },
};

const payloadDataPartical: IEmployee = {
  firstName: 'Karson',
  lastName: 'Bins',
};

const payloadDataParticalUpdated: IEmployee = {
  firstName: 'Updated',
  lastName: 'Updated2',
};

const server = setupServer(
  rest.get('/api/employees/1', (_req, res, ctx) => res(ctx.status(200), ctx.json({ id: 1, ...payloadData }))),
  rest.get('/api/employees/2', (_req, res, ctx) => res(ctx.status(200), ctx.json({ id: 2, ...payloadDataPartical }))),
  rest.get('/api/employees', null),
  rest.get('/api/departments', null),
  rest.get('/api/job-histories', null),
);

beforeAll(() => {
  TranslatorContext.registerTranslations('en', translation);
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
  cleanup();
  initStore().dispatch(reset());
});

afterAll(() => server.close());

const preloadedState = {
  department: {
    entities: [{ id: 5 }],
  },
  jobHistory: {
    entities: [{ id: 6 }],
  },
  employee: {
    entities: [{ id: 4 }],
    entity: {},
  },
};

const renderComponent = async initialEntry => {
  await waitFor(() => {
    const store = configureTestStore({ employee }, preloadedState);
    registerLocale(store);

    render(
      <TestComponent store={store} initialEntry={initialEntry}>
        {/* Required for `navigate('/employee');`. */}
        <Route index path="/employee/*" element={<span>Navigated to Employees</span>} />
        <Route path="new" element={<EmployeeUpdate />} />
        <Route path=":id">
          <Route path="edit" element={<EmployeeUpdate />} />
        </Route>
      </TestComponent>,
    );
  });
};

describe('EmployeeUpdate Component Test Suite', () => {
  it('should render new EmployeeUpdate', async () => {
    // WHEN
    await renderComponent('new');

    // THEN
    expect(getByTextKey('home.createOrEditLabel')).toBeInTheDocument();
    expect(getByLabelTextKey('hireDate')).toHaveValue(displayDefaultDateTime());
  });

  it('should POST with only required fields for new registration and handle success', async () => {
    // GIVEN
    let requestError = null;
    server.use(
      rest.post('/api/employees', async (req, res, ctx) => {
        try {
          const payload = await req.json();
          expect(payload).toMatchObject(payloadDataPartical);
          return res(
            ctx.status(200),
            ctx.set('app-alert', 'myReactApp.employee.created'),
            ctx.set('app-params', '1'),
            ctx.json(payloadData),
          );
        } catch (e) {
          requestError = e;
          return res(ctx.status(500));
        }
      }),
    );

    // WHEN
    await renderComponent('new');
    await setForm(formDataPartical);
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    // THEN
    try {
      expect(await screen.findByText(translate('myReactApp.employee.created', { param: '1' }))).toBeInTheDocument();
    } catch (e) {
      throw requestError ?? e;
    }
  });

  it('should POST with all fields for new registration and handle success', async () => {
    // GIVEN
    let requestError = null;
    server.use(
      rest.post('/api/employees', async (req, res, ctx) => {
        try {
          const payload = await req.json();
          expect(payload).toMatchObject(payloadData);
          return res(
            ctx.status(200),
            ctx.set('app-alert', 'myReactApp.employee.created'),
            ctx.set('app-params', '1'),
            ctx.json(payloadData),
          );
        } catch (e) {
          requestError = e;
          return res(ctx.status(500));
        }
      }),
    );

    // WHEN
    await renderComponent('new');
    await setForm(formData);
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    // THEN
    try {
      expect(await screen.findByText(translate('myReactApp.employee.created', { param: '1' }))).toBeInTheDocument();
    } catch (e) {
      throw requestError ?? e;
    }
  });

  it('should POST for new registration and fail', async () => {
    // GIVEN
    server.use(
      rest.post('/api/employees', async (req, res, ctx) => {
        return res(ctx.status(500));
      }),
    );

    // WHEN
    await renderComponent('new');
    await setForm(formDataPartical);
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    // THEN
    expect((await screen.findAllByText('Network Error')).length).toBeGreaterThanOrEqual(1);
  });

  it('should render update EmployeeUpdate', async () => {
    await renderComponent('2/edit');
    for (const [key, value] of Object.entries(formDataPartical)) {
      expect(getByLabelTextKey(key)).toHaveValue(value);
    }
  });

  it('should PUT for update and succeed', async () => {
    // GIVEN
    let requestError = null;
    server.use(
      rest.put('/api/employees/2', async (req, res, ctx) => {
        const payload = await req.json();
        try {
          expect(payload).toMatchObject({ id: 2, ...payloadData, ...payloadDataParticalUpdated });
          return res(
            ctx.status(200),
            ctx.set('app-alert', 'myReactApp.employee.updated'),
            ctx.set('app-params', '2'),
            ctx.json(payloadData),
          );
        } catch (e) {
          requestError = e;
          return res(ctx.status(500));
        }
      }),
    );

    // WHEN
    await renderComponent('2/edit');
    await setForm(formData);
    await setForm(formDataParticalUpdated);
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    // THEN
    try {
      expect(await screen.findByText(translate('myReactApp.employee.updated', { param: '2' }))).toBeInTheDocument();
    } catch (e) {
      throw requestError ?? e;
    }
  });

  it('should PUT for update and fail', async () => {
    // GIVEN
    server.use(
      rest.put('/api/employees/2', async (req, res, ctx) => {
        return res(ctx.status(500));
      }),
    );

    // WHEN
    await renderComponent('2/edit');
    await setForm(formDataParticalUpdated);
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    // THEN
    expect((await screen.findAllByText('Network Error')).length).toBeGreaterThanOrEqual(1);
  });

  it(' should cancel and go back', async () => {
    // WHEN
    await renderComponent('2/edit');
    fireEvent.click(screen.getByRole('link', { name: /back/i }));

    // THEN
    expect(await screen.findByText('Navigated to Employees')).toBeInTheDocument();
  });
});
