import { ILocation } from 'app/shared/model/location.model';

export const payloadData: ILocation = {
  streetAddress: 'valid',
  postalCode: 'which mechanically ah',
  city: 'Jacobsonside',
  stateProvince: 'snarf yippee',
  country: { id: 0 },
};

export const formData = {
  streetAddress: 'valid',
  postalCode: 'which mechanically ah',
  city: 'Jacobsonside',
  stateProvince: 'snarf yippee',
  country: '0',
};

export const payloadDataPartical: ILocation = {
  streetAddress: 'wherever failing',
  postalCode: 'innocently woot',
};

export const formDataPartical = {
  streetAddress: 'wherever failing',
  postalCode: 'innocently woot',
};

export const payloadDataParticalUpdated: ILocation = {
  postalCode: 'extinction',
  stateProvince: 'instead because woefully',
};

export const formDataParticalUpdated = {
  postalCode: 'extinction',
  stateProvince: 'instead because woefully',
};

export const preloadedState = {
  country: {
    entities: [{ id: 0 }],
  },
  department: {
    entities: [{ id: 1 }],
  },
};
