import dayjs from 'dayjs';

import { APP_LOCAL_DATETIME_FORMAT } from 'app/config/constants';

// It is better to change the name here to something like `convertDayToLocalString` to avoid confusion.
export const convertDateTimeFromServer = (date?: dayjs.Dayjs): string | null => (date ? date.format(APP_LOCAL_DATETIME_FORMAT) : null);

// It is better to change the name here to something like `convertLocalStringToDay` to avoid confusion.
export const convertDateTimeToServer = (date?: string): dayjs.Dayjs | null => (date ? dayjs(date) : null);

export const displayDefaultDateTime = () => dayjs().startOf('day').format(APP_LOCAL_DATETIME_FORMAT);
