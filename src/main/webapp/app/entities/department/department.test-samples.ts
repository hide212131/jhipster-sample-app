import { IDepartment } from 'app/shared/model/department.model';

export const payloadData: IDepartment = {
  departmentName: 'seldom',
  location: { id: 0 },
};

export const formData = {
  departmentName: 'seldom',
  location: '0',
};

export const payloadDataPartical: IDepartment = {
  departmentName: 'outside disallow till',
};

export const formDataPartical = {
  departmentName: 'outside disallow till',
};

export const payloadDataParticalUpdated: IDepartment = {
  departmentName: 'bountiful gee kindly',
};

export const formDataParticalUpdated = {
  departmentName: 'bountiful gee kindly',
};

export const preloadedState = {
  location: {
    entities: [{ id: 0 }],
  },
  jobHistory: {
    entities: [{ id: 1 }],
  },
};
