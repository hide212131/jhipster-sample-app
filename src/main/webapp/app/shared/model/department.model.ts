import { IEmployee } from 'app/shared/model/employee.model';

export interface IDepartment {
  id?: number;
  departmentName?: string;
  employees?: IEmployee[] | null;
}

export const defaultValue: Readonly<IDepartment> = {};
