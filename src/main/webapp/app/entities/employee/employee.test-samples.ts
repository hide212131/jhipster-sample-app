import { IEmployee } from 'app/shared/model/employee.model';

export const payloadData: IEmployee = {
  firstName: 'Eusebio',
  lastName: 'Koelpin-McKenzie',
  email: 'Susana_Witting86@hotmail.com',
  phoneNumber: 'yahoo',
  hireDate: '2023-09-23T17:40:00.000Z',
  salary: 3674,
  commissionPct: 25697,
  manager: { id: 0 },
  department: { id: 1 },
};

export const formData = {
  firstName: 'Eusebio',
  lastName: 'Koelpin-McKenzie',
  email: 'Susana_Witting86@hotmail.com',
  phoneNumber: 'yahoo',
  hireDate: '2023-09-24T02:40',
  salary: '3674',
  commissionPct: '25697',
  manager: '0',
  department: '1',
};

export const payloadDataPartical: IEmployee = {
  firstName: 'Jerry',
  lastName: 'Trantow',
  email: 'Nathanael.Ullrich69@hotmail.com',
  hireDate: '2023-09-23T21:34:00.000Z',
  salary: 3411,
};

export const formDataPartical = {
  firstName: 'Jerry',
  lastName: 'Trantow',
  email: 'Nathanael.Ullrich69@hotmail.com',
  hireDate: '2023-09-24T06:34',
  salary: '3411',
};

export const payloadDataParticalUpdated: IEmployee = {
  email: 'Colby78@hotmail.com',
  hireDate: '2023-09-23T21:31:00.000Z',
};

export const formDataParticalUpdated = {
  email: 'Colby78@hotmail.com',
  hireDate: '2023-09-24T06:31',
};

export const preloadedState = {
  employee: {
    entities: [{ id: 0 }],
    entity: {},
  },
  department: {
    entities: [{ id: 1 }],
  },
  jobHistory: {
    entities: [{ id: 2 }],
  },
};
