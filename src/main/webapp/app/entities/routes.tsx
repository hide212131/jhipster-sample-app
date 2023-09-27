import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import { ReducersMapObject, combineReducers } from '@reduxjs/toolkit';

import getStore from 'app/config/store';

import entitiesReducers from './reducers';

import Employee from './employee';
import Location from './location';
import Task from './task';
import Department from './department';
import Job from './job';
import Region from './region';
import JobHistory from './job-history';
import Country from './country';
/* jhipster-needle-add-route-import - JHipster will add routes here */

export default () => {
  const store = getStore();
  store.injectReducer('myreactapp', combineReducers(entitiesReducers as ReducersMapObject));
  return (
    <div>
      <ErrorBoundaryRoutes>
        {/* prettier-ignore */}
        <Route path="employee/*" element={<Employee />} />
        <Route path="location/*" element={<Location />} />
        <Route path="task/*" element={<Task />} />
        <Route path="department/*" element={<Department />} />
        <Route path="job/*" element={<Job />} />
        <Route path="region/*" element={<Region />} />
        <Route path="job-history/*" element={<JobHistory />} />
        <Route path="country/*" element={<Country />} />
        {/* jhipster-needle-add-route-path - JHipster will add routes here */}
      </ErrorBoundaryRoutes>
    </div>
  );
};
