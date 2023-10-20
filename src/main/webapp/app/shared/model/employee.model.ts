import { IDepartment } from 'app/shared/model/department.model';

export interface IEmployee {
  id?: number;
  firstName?: string | null;
  salary?: number | null;
  hireDate?: string | null;
  department?: IDepartment | null;
}

export const defaultValue: Readonly<IEmployee> = {};
