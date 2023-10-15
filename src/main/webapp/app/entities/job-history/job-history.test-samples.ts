import { IJobHistory } from 'app/shared/model/job-history.model';

export const payloadData: IJobHistory = {
  startDate: '2023-09-24T11:15:00.000Z',
  endDate: '2023-09-23T19:33:00.000Z',
  language: 'ENGLISH',
  job: { id: 0 },
  department: { id: 1 },
  employee: { id: 2 },
};

export const formData = {
  startDate: '2023-09-24T20:15',
  endDate: '2023-09-24T04:33',
  language: 'ENGLISH',
  job: '0',
  department: '1',
  employee: '2',
};

export const payloadDataPartical: IJobHistory = {
  language: 'SPANISH',
};

export const formDataPartical = {
  language: 'SPANISH',
};

export const payloadDataParticalUpdated: IJobHistory = {
  startDate: '2023-09-23T19:09:00.000Z',
};

export const formDataParticalUpdated = {
  startDate: '2023-09-24T04:09',
};

export const preloadedState = {
  job: {
    entities: [{ id: 0 }],
  },
  department: {
    entities: [{ id: 1 }],
  },
  employee: {
    entities: [{ id: 2 }],
  },
};
