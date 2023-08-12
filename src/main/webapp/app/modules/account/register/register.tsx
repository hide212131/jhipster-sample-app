import React, { useState, useEffect } from 'react';
import { Translate, translate, ValidatedTextInput, isEmail } from 'react-jhipster';
import { Row, Col, Alert, Button, Form } from 'reactstrap';
import { toast } from 'react-toastify';

import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { handleRegister, reset } from './register.reducer';
import { useForm } from 'react-hook-form';

export const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, touchedFields },
  } = useForm({ mode: 'onTouched' });
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();

  useEffect(
    () => () => {
      dispatch(reset());
    },
    [],
  );

  const currentLocale = useAppSelector(state => state.locale.currentLocale);

  const handleValidSubmit = data => {
    dispatch(handleRegister({ login: data.username, email: data.email, password: data.firstPassword, langKey: currentLocale }));
  };

  const updatePassword = event => {
    setPassword(event.target.value);
    setValue('firstPassword', event.target.value, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
  };
  const successMessage = useAppSelector(state => state.register.successMessage);

  useEffect(() => {
    if (successMessage) {
      toast.success(translate(successMessage));
    }
  }, [successMessage]);

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h1 id="register-title" data-cy="registerTitle">
            <Translate contentKey="register.title">Registration</Translate>
          </h1>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <Form id="register-form" onSubmit={handleSubmit(handleValidSubmit)}>
            <ValidatedTextInput
              register={register}
              touchedFields={touchedFields}
              errors={errors}
              setValue={setValue}
              nameIdCy="username"
              validate={{
                required: translate('register.messages.validate.login.required'),
                pattern: {
                  value: /^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$/,
                  message: translate('register.messages.validate.login.pattern'),
                },
                minLength: { value: 1, message: translate('register.messages.validate.login.minlength') },
                maxLength: { value: 50, message: translate('register.messages.validate.login.maxlength') },
              }}
              labelPlaceholderKey="global.form.username.label"
              inputPlaceholderKey="global.form.username.placeholder"
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
            <ValidatedTextInput
              register={register}
              touchedFields={touchedFields}
              errors={errors}
              setValue={setValue}
              nameIdCy="firstPassword"
              type="password"
              validate={{
                required: translate('global.messages.validate.newpassword.required'),
                minLength: { value: 4, message: translate('global.messages.validate.newpassword.minlength') },
                maxLength: { value: 50, message: translate('global.messages.validate.newpassword.maxlength') },
              }}
              labelPlaceholderKey="global.form.newpassword.label"
              inputPlaceholderKey="global.form.newpassword.placeholder"
              updateValueOverrideMethod={updatePassword}
            />
            <PasswordStrengthBar password={password} />
            <ValidatedTextInput
              register={register}
              touchedFields={touchedFields}
              errors={errors}
              setValue={setValue}
              nameIdCy="secondPassword"
              type="password"
              validate={{
                required: translate('global.messages.validate.confirmpassword.required'),
                minLength: { value: 4, message: translate('global.messages.validate.confirmpassword.minlength') },
                maxLength: { value: 50, message: translate('global.messages.validate.confirmpassword.maxlength') },
                validate: v => v === password || translate('global.messages.error.dontmatch'),
              }}
              labelPlaceholderKey="global.form.confirmpassword.label"
              inputPlaceholderKey="global.form.confirmpassword.placeholder"
            />
            <Button id="register-submit" color="primary" type="submit" data-cy="submit">
              <Translate contentKey="register.form.button">Register</Translate>
            </Button>
          </Form>
          <p>&nbsp;</p>
          <Alert color="warning">
            <span>
              <Translate contentKey="global.messages.info.authenticated.prefix">If you want to </Translate>
            </span>
            <a className="alert-link">
              <Translate contentKey="global.messages.info.authenticated.link"> sign in</Translate>
            </a>
            <span>
              <Translate contentKey="global.messages.info.authenticated.suffix">
                , you can try the default accounts:
                <br />- Administrator (login=&quot;admin&quot; and password=&quot;admin&quot;)
                <br />- User (login=&quot;user&quot; and password=&quot;user&quot;).
              </Translate>
            </span>
          </Alert>
        </Col>
      </Row>
    </div>
  );
};

export default RegisterPage;
