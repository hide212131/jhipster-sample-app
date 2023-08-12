import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, Form, Input } from 'reactstrap';
import { Translate, translate, ValidatedTextInput, isEmail, registerReactstrap } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FieldValues, useForm } from 'react-hook-form';

import { locales, languages } from 'app/config/translation';
import { getUser, getRoles, updateUser, createUser, reset } from './user-management.reducer';
import { useAppDispatch, useAppSelector } from 'app/config/store';

export const UserManagementUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { login } = useParams<'login'>();
  const isNew = login === undefined;

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getUser(login));
    }
    dispatch(getRoles());
    return () => {
      dispatch(reset());
    };
  }, [login]);

  const handleClose = () => {
    navigate('/admin/user-management');
  };

  const saveUser = values => {
    if (isNew) {
      dispatch(createUser(values));
    } else {
      dispatch(updateUser(values));
    }
    handleClose();
  };

  const isInvalid = false;
  const user = useAppSelector(state => state.userManagement.user);
  const loading = useAppSelector(state => state.userManagement.loading);
  const updating = useAppSelector(state => state.userManagement.updating);
  const authorities = useAppSelector(state => state.userManagement.authorities);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, touchedFields },
    reset: resetAsyncForm,
  } = useForm({ mode: 'onTouched' });

  useEffect(() => {
    resetAsyncForm({
      id: user?.id,
      login: user?.login,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      activated: user?.activated,
      langKey: user?.langKey,
      authorities: user?.authorities,
    } as FieldValues);
  }, [user]);

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h1>
            <Translate contentKey="userManagement.home.createOrEditLabel">Create or edit a User</Translate>
          </h1>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
            <Form onSubmit={handleSubmit(saveUser)}>
              {user.id ? (
                <ValidatedTextInput
                  register={register}
                  touchedFields={touchedFields}
                  errors={errors}
                  setValue={setValue}
                  nameIdCy="id"
                  validate={{
                    required: true,
                  }}
                  readOnly
                  labelPlaceholderKey="global.field.id"
                />
              ) : null}
              <ValidatedTextInput
                register={register}
                touchedFields={touchedFields}
                errors={errors}
                setValue={setValue}
                nameIdCy="login"
                validate={{
                  required: translate('register.messages.validate.login.required'),
                  pattern: {
                    value: /^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$/,
                    message: translate('register.messages.validate.login.pattern'),
                  },
                  minLength: {
                    value: 1,
                    message: translate('register.messages.validate.login.minlength'),
                  },
                  maxLength: {
                    value: 50,
                    message: translate('register.messages.validate.login.maxlength'),
                  },
                }}
                labelPlaceholderKey="userManagement.login"
              />
              <ValidatedTextInput
                register={register}
                touchedFields={touchedFields}
                errors={errors}
                setValue={setValue}
                nameIdCy="firstName"
                validate={{
                  maxLength: {
                    value: 50,
                    message: translate('entity.validation.maxlength', { max: 50 }),
                  },
                }}
                labelPlaceholderKey="userManagement.firstName"
              />
              <ValidatedTextInput
                register={register}
                touchedFields={touchedFields}
                errors={errors}
                setValue={setValue}
                nameIdCy="lastName"
                validate={{
                  maxLength: {
                    value: 50,
                    message: translate('entity.validation.maxlength', { max: 50 }),
                  },
                }}
                labelPlaceholderKey="userManagement.lastName"
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
                  minLength: {
                    value: 5,
                    message: translate('global.messages.validate.email.minlength'),
                  },
                  maxLength: {
                    value: 254,
                    message: translate('global.messages.validate.email.maxlength'),
                  },
                  validate: v => isEmail(v) || translate('global.messages.validate.email.invalid'),
                }}
                labelPlaceholderKey="global.form.email.label"
                inputPlaceholderKey="global.form.email.placeholder"
              />
              <Input type="checkbox" name="activated" check {...registerReactstrap(register, 'activated')} disabled={!user.id} />
              {translate('userManagement.activated')}
              <Input type="select" name="langKey" label={translate('userManagement.langKey')} {...registerReactstrap(register, 'langKey')}>
                {locales.map(locale => (
                  <option value={locale} key={locale}>
                    {languages[locale].name}
                  </option>
                ))}
              </Input>
              <Input
                type="select"
                name="authorities"
                multiple
                label={translate('userManagement.profiles')}
                {...registerReactstrap(register, 'authorities')}
              >
                {authorities.map(role => (
                  <option value={role} key={role}>
                    {role}
                  </option>
                ))}
              </Input>
              <Button tag={Link} to="/admin/user-management" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" type="submit" disabled={isInvalid || updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default UserManagementUpdate;
