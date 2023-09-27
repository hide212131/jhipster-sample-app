import employee from 'app/entities/employee/employee.reducer';
import location from 'app/entities/location/location.reducer';
import task from 'app/entities/task/task.reducer';
import department from 'app/entities/department/department.reducer';
import job from 'app/entities/job/job.reducer';
import region from 'app/entities/region/region.reducer';
import jobHistory from 'app/entities/job-history/job-history.reducer';
import country from 'app/entities/country/country.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  employee,
  location,
  task,
  department,
  job,
  region,
  jobHistory,
  country,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
