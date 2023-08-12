import React, { useEffect } from 'react';
import { Button, Col, Row, Form, Input } from 'reactstrap';
import { Translate, translate, ValidatedTextInput, isEmail } from 'react-jhipster';
import { toast } from 'react-toastify';

import { locales, languages } from 'app/config/translation';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getSession } from 'app/shared/reducers/authentication';
import { saveAccountSettings, reset } from './settings.reducer';
import { DefaultValues, FieldValues, useForm } from 'react-hook-form';

export const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const account = useAppSelector(state => state.authentication.account);
  const successMessage = useAppSelector(state => state.settings.successMessage);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, touchedFields },
    reset: resetAsyncForm,
  } = useForm({ mode: 'onTouched' });

  useEffect(() => {
    resetAsyncForm({
      firstName: account?.firstName,
      lastName: account?.lastName,
      email: account?.email,
      langKey: account?.langKey,
    } as FieldValues);
  }, [account]);

  useEffect(() => {
    dispatch(getSession());
    return () => {
      dispatch(reset());
    };
  }, []);

  useEffect(() => {
    if (successMessage) {
      toast.success(translate(successMessage));
    }
  }, [successMessage]);

  const handleValidSubmit = values => {
    dispatch(
      saveAccountSettings({
        ...account,
        ...values,
      }),
    );
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="settings-title">
            <Translate contentKey="settings.title" interpolate={{ username: account.login }}>
              User settings for {account.login}
            </Translate>
          </h2>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <Form id="settings-form" onSubmit={handleSubmit(handleValidSubmit)}>
            <ValidatedTextInput
              register={register}
              touchedFields={touchedFields}
              errors={errors}
              setValue={setValue}
              nameIdCy="firstName"
              validate={{
                required: translate('settings.messages.validate.firstname.required'),
                minLength: { value: 1, message: translate('settings.messages.validate.firstname.minlength') },
                maxLength: { value: 50, message: translate('settings.messages.validate.firstname.maxlength') },
              }}
              labelPlaceholderKey="settings.form.firstname"
              inputPlaceholderKey="settings.form.firstname.placeholder"
            />
            <ValidatedTextInput
              register={register}
              touchedFields={touchedFields}
              errors={errors}
              setValue={setValue}
              nameIdCy="lastName"
              validate={{
                required: translate('settings.messages.validate.lastname.required'),
                minLength: { value: 1, message: translate('settings.messages.validate.lastname.minlength') },
                maxLength: { value: 50, message: translate('settings.messages.validate.lastname.maxlength') },
              }}
              labelPlaceholderKey="settings.form.lastname"
              inputPlaceholderKey="settings.form.lastname.placeholder"
            />
            <ValidatedTextInput
              register={register}
              touchedFields={touchedFields}
              errors={errors}
              setValue={setValue}
              nameIdCy="email"
              type="email"
              validate={{
                required: translate('global.messages.validate.email.required'),
                minLength: { value: 5, message: translate('global.messages.validate.email.minlength') },
                maxLength: { value: 254, message: translate('global.messages.validate.email.maxlength') },
                validate: v => isEmail(v) || translate('global.messages.validate.email.invalid'),
              }}
              labelPlaceholderKey="global.form.email.label"
              inputPlaceholderKey="global.form.email.placeholder"
            />

            <Input type="select" id="langKey" name="langKey" label={translate('settings.form.language')} data-cy="langKey">
              {locales.map(locale => (
                <option value={locale} key={locale}>
                  {languages[locale].name}
                </option>
              ))}
            </Input>
            <Button color="primary" type="submit" data-cy="submit">
              <Translate contentKey="settings.form.button">Save</Translate>
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default SettingsPage;
