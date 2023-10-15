import { IJob } from 'app/shared/model/job.model';

export const payloadData: IJob = {
  jobTitle: 'National Interactions Assistant',
  minSalary: 8001,
  maxSalary: 25517,
  tasks: [{ id: 0 }],
  employee: { id: 1 },
};

export const formData = {
  jobTitle: 'National Interactions Assistant',
  minSalary: '8001',
  maxSalary: '25517',
  tasks: ['0'],
  employee: '1',
};

export const payloadDataPartical: IJob = {
  jobTitle: 'Regional Research Director',
};

export const formDataPartical = {
  jobTitle: 'Regional Research Director',
};

export const payloadDataParticalUpdated: IJob = {
  minSalary: 20280,
  maxSalary: 21927,
};

export const formDataParticalUpdated = {
  minSalary: '20280',
  maxSalary: '21927',
};

export const preloadedState = {
  task: {
    entities: [{ id: 0 }],
  },
  employee: {
    entities: [{ id: 1 }],
  },
  jobHistory: {
    entities: [{ id: 2 }],
  },
};
