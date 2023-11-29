import axios from 'axios';
import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { loadMoreDataWhenScrolled, parseHeaderForLinks } from 'react-jhipster';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { IQueryParams, createEntitySlice, EntityState, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { IEmployee, defaultValue } from 'app/shared/model/employee.model';
import dayjs from 'dayjs';

type RestOf<T extends IEmployee> = Omit<T, 'hireDate'> & {
  hireDate?: string | null;
};

type RestEmployee = RestOf<IEmployee>;

const initialState: EntityState<IEmployee> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

const apiUrl = 'api/employees';

// Actions

export const getEntities = createAsyncThunk('employee/fetch_entity_list', async ({ page, size, sort }: IQueryParams) => {
  const requestUrl = `${apiUrl}?${sort ? `page=${page}&size=${size}&sort=${sort}&` : ''}cacheBuster=${new Date().getTime()}`;
  return axios.get<RestEmployee[]>(requestUrl);
});

export const getEntity = createAsyncThunk(
  'employee/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`;
    return axios.get<RestEmployee>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const createEntity = createAsyncThunk(
  'employee/create_entity',
  async (entity: IEmployee, thunkAPI) => {
    return axios.post<RestEmployee>(apiUrl, convertFromClient(entity));
  },
  { serializeError: serializeAxiosError },
);

export const updateEntity = createAsyncThunk(
  'employee/update_entity',
  async (entity: IEmployee, thunkAPI) => {
    return axios.put<RestEmployee>(`${apiUrl}/${entity.id}`, convertFromClient(entity));
  },
  { serializeError: serializeAxiosError },
);

export const partialUpdateEntity = createAsyncThunk(
  'employee/partial_update_entity',
  async (entity: IEmployee, thunkAPI) => {
    return axios.patch<RestEmployee>(`${apiUrl}/${entity.id}`, convertFromClient(entity));
  },
  { serializeError: serializeAxiosError },
);

export const deleteEntity = createAsyncThunk(
  'employee/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`;
    return await axios.delete<RestEmployee>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

// slice

export const EmployeeSlice = createEntitySlice({
  name: 'employee',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(getEntity.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = convertFromServer(action.payload.data);
      })
      .addCase(deleteEntity.fulfilled, state => {
        state.updating = false;
        state.updateSuccess = true;
        state.entity = {};
      })
      .addMatcher(isFulfilled(getEntities), (state, action) => {
        const { data, headers } = action.payload;
        const links = parseHeaderForLinks(headers.link);

        return {
          ...state,
          loading: false,
          links,
          entities: loadMoreDataWhenScrolled(
            state.entities,
            data.map(restEmployee => convertFromServer(restEmployee)),
            links,
          ),
          totalItems: parseInt(headers['x-total-count'], 10),
        };
      })
      .addMatcher(isFulfilled(createEntity, updateEntity, partialUpdateEntity), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = convertFromServer(action.payload.data);
      })
      .addMatcher(isPending(getEntities, getEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.loading = true;
      })
      .addMatcher(isPending(createEntity, updateEntity, partialUpdateEntity, deleteEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
      });
  },
});

const convertFromClient = (employee: IEmployee): RestEmployee => {
  return cleanEntity({
    ...employee,
    hireDate: employee.hireDate?.toJSON() ?? null,
  });
};

const convertFromServer = (restEmployee: RestEmployee): IEmployee => {
  return {
    ...restEmployee,
    hireDate: restEmployee.hireDate ? dayjs(restEmployee.hireDate) : null,
  };
};

export const { reset } = EmployeeSlice.actions;

// Reducer
export default EmployeeSlice.reducer;
