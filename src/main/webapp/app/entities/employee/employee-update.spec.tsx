import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { TranslatorContext, translate } from 'react-jhipster';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import initStore from 'app/config/store';
import { registerLocale } from 'app/config/translation';
import EmployeeUpdate from './employee-update';
import translation from 'i18n/en/employee.json';
import { displayDefaultDateTime } from 'app/shared/util/date-utils';
import { ToastContainer } from 'react-toastify';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import { reset } from './employee.reducer';
import { IEmployee } from 'app/shared/model/employee.model';

const formData = {
  firstName: 'Karson',
  lastName: 'Bins',
  email: 'Margarita_Hirthe@hotmail.com',
  phoneNumber: 'question yuck minus',
  hireDate: '2023-09-24T09:00',
  salary: '28065',
  commissionPct: '26272',
  // jobs: null,
  manager: '4',
  department: '5',
  jobHistory: '6',
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
  id: 1,
  firstName: 'Karson',
  lastName: 'Bins',
  email: 'Margarita_Hirthe@hotmail.com',
  phoneNumber: 'question yuck minus',
  hireDate: '2023-09-24T00:00:00Z',
  salary: 28065,
  commissionPct: 26272,
  jobs: [{ id: 2 }, { id: 3 }],
  manager: { id: 4 },
  department: { id: 5 },
  jobHistory: { id: 6 },
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
  rest.get('/api/employees/1', (_req, res, ctx) => res(ctx.status(200), ctx.json(payloadData))),
  rest.get('/api/employees', (_req, res, ctx) => res(ctx.status(200), ctx.json([{ id: 4 }]))),
  rest.get('/api/departments', (_req, res, ctx) => res(ctx.status(200), ctx.json([{ id: 5 }]))),
  rest.get('/api/job-histories', (_req, res, ctx) => res(ctx.status(200), ctx.json([{ id: 6 }]))),
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

const renderComponent = async initialEntry => {
  await waitFor(() => {
    const store = initStore();
    registerLocale(store);

    render(
      <>
        <Provider store={store}>
          <MemoryRouter initialEntries={[`/${initialEntry}`]}>
            <ErrorBoundaryRoutes>
              {/* Required for `navigate('/employee');`. */}
              <Route index path="/employee/*" element={<span>Navigated to Employees</span>} />
              <Route path="new" element={<EmployeeUpdate />} />
              <Route path=":id">
                <Route path="edit" element={<EmployeeUpdate />} />
              </Route>
            </ErrorBoundaryRoutes>
          </MemoryRouter>
        </Provider>
        <ToastContainer className="toastify-container" toastClassName="toastify-toast" />
      </>,
    );
  });
};

describe('EmployeeUpdate Component Test Suite', () => {
  it('should render EmployeeUpdate component for new registration', async () => {
    // WHEN
    await renderComponent('new');

    // THEN
    expect(getByTextKey('home.createOrEditLabel')).toBeInTheDocument();
    expect(getByLabelTextKey('hireDate')).toHaveValue(displayDefaultDateTime());
  });

  it('should send POST request on save button click for new registration and handle successful response', async () => {
    // GIVEN
    server.use(
      rest.post('/api/employees', async (req, res, ctx) => {
        const payload = await req.json();
        expect(payload).toMatchObject(payloadData);
        return res(ctx.status(200), ctx.set('app-alert', 'myReactApp.employee.created'), ctx.set('app-params', '1'), ctx.json(payloadData));
      }),
    );

    // WHEN
    await renderComponent('new');
    await setForm(formData);
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    // THEN
    expect(await screen.findByText(translate('myReactApp.employee.created', { param: '1' }))).toBeInTheDocument();
  });

  it('should send POST request on save button click for new registration and handle error response ', async () => {
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

  it('should render EmployeeUpdate component for updating an employee', async () => {
    await renderComponent('1/edit');
    for (const [key, value] of Object.entries(formDataPartical)) {
      expect(getByLabelTextKey(key)).toHaveValue(value);
    }
  });

  it('should send PUT request on update button click and handle successful response', async () => {
    // GIVEN
    server.use(
      rest.put('/api/employees/1', async (req, res, ctx) => {
        const payload = await req.json();
        expect(payload).toMatchObject(payloadDataParticalUpdated);
        return res(ctx.status(200), ctx.set('app-alert', 'myReactApp.employee.updated'), ctx.set('app-params', '1'), ctx.json(payloadData));
      }),
    );

    // WHEN
    await renderComponent('1/edit');
    await setForm(formDataParticalUpdated);
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    // THEN
    expect(await screen.findByText(translate('myReactApp.employee.updated', { param: '1' }))).toBeInTheDocument();
  });

  it('should send PUT request on update button click and handle error response', async () => {
    // GIVEN
    server.use(
      rest.put('/api/employees/1', async (req, res, ctx) => {
        return res(ctx.status(500));
      }),
    );

    // WHEN
    await renderComponent('1/edit');
    await setForm(formDataParticalUpdated);
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    // THEN
    expect((await screen.findAllByText('Network Error')).length).toBeGreaterThanOrEqual(1);
  });

  it('should cancel and navigate back when the back button is clicked', async () => {
    // WHEN
    await renderComponent('1/edit');
    fireEvent.click(screen.getByRole('link', { name: /back/i }));

    // THEN
    expect(await screen.findByText('Navigated to Employees')).toBeInTheDocument();
  });
});

const getByLabelTextKey = (key: string) => screen.getByLabelText(translate(`myReactApp.employee.${key}`));
const getByTextKey = (key: string) => screen.getByText(translate(`myReactApp.employee.${key}`));
const setText = async (key: string, text: string) => {
  const input = getByLabelTextKey(key);
  await userEvent.click(input);
  try {
    await userEvent.clear(input);
    await userEvent.type(input, text);
  } catch {
    await userEvent.selectOptions(input, text);
  }
};
const setForm = async (data: object) => {
  for (const [key, value] of Object.entries(data)) {
    await setText(key, value);
  }
};
