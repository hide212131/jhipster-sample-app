import { ICountry } from 'app/shared/model/country.model';

export const payloadData: ICountry = {
  countryName: 'happy-go-lucky',
  region: { id: 0 },
};

export const formData = {
  countryName: 'happy-go-lucky',
  region: '0',
};

export const payloadDataPartical: ICountry = {
  countryName: 'yum',
};

export const formDataPartical = {
  countryName: 'yum',
};

export const payloadDataParticalUpdated: ICountry = {
  countryName: 'under an',
};

export const formDataParticalUpdated = {
  countryName: 'under an',
};

export const preloadedState = {
  region: {
    entities: [{ id: 0 }],
  },
  location: {
    entities: [{ id: 1 }],
  },
};
