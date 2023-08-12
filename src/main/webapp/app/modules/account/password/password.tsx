import React, { useState, useEffect } from 'react';
import { Translate, translate, ValidatedTextInput } from 'react-jhipster';
import { Button, Col, Form, Row } from 'reactstrap';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getSession } from 'app/shared/reducers/authentication';
import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';
import { savePassword, reset } from './password.reducer';
import { useForm } from 'react-hook-form';

export const PasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, touchedFields },
  } = useForm({ mode: 'onTouched' });
  useEffect(() => {
    dispatch(reset());
    dispatch(getSession());
    return () => {
      dispatch(reset());
    };
  }, []);

  const handleValidSubmit = data => {
    dispatch(savePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword }));
  };

  const account = useAppSelector(state => state.authentication.account);
  const successMessage = useAppSelector(state => state.password.successMessage);
  const errorMessage = useAppSelector(state => state.password.errorMessage);

  useEffect(() => {
    if (successMessage) {
      toast.success(translate(successMessage));
    } else if (errorMessage) {
      toast.error(translate(errorMessage));
    }
    dispatch(reset());
  }, [successMessage, errorMessage]);

  const updateNewPassword = event => {
    setNewPassword(event.target.value);
    setValue('newPassword', event.target.value, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="password-title">
            <Translate contentKey="password.title" interpolate={{ username: account.login }}>
              Password for {account.login}
            </Translate>
          </h2>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <Form id="password-form" onSubmit={handleSubmit(handleValidSubmit)}>
            <ValidatedTextInput
              register={register}
              touchedFields={touchedFields}
              errors={errors}
              setValue={setValue}
              nameIdCy="currentPassword"
              validate={{ required: translate('global.messages.validate.newpassword.required') }}
              labelPlaceholderKey="global.form.currentpassword.label"
              inputPlaceholderKey="global.form.currentpassword.placeholder"
              type="password"
            />
            <ValidatedTextInput
              register={register}
              touchedFields={touchedFields}
              errors={errors}
              setValue={setValue}
              nameIdCy="newPassword"
              validate={{
                required: translate('global.messages.validate.newpassword.required'),
                minLength: { value: 4, message: translate('global.messages.validate.newpassword.minlength') },
                maxLength: { value: 50, message: translate('global.messages.validate.newpassword.maxlength') },
              }}
              labelPlaceholderKey="global.form.newpassword.label"
              inputPlaceholderKey="global.form.newpassword.placeholder"
              type="password"
              updateValueOverrideMethod={updateNewPassword}
            />
            <PasswordStrengthBar password={newPassword} />
            <ValidatedTextInput
              register={register}
              touchedFields={touchedFields}
              errors={errors}
              setValue={setValue}
              nameIdCy="confirmPassword"
              validate={{
                required: translate('global.messages.validate.confirmpassword.required'),
                minLength: { value: 4, message: translate('global.messages.validate.confirmpassword.minlength') },
                maxLength: { value: 50, message: translate('global.messages.validate.confirmpassword.maxlength') },
                validate: v => v === newPassword || translate('global.messages.error.dontmatch'),
              }}
              labelPlaceholderKey="global.form.confirmpassword.label"
              inputPlaceholderKey="global.form.confirmpassword.placeholder"
              type="password"
            />
            <Button color="success" type="submit" data-cy="submit">
              <Translate contentKey="password.form.button">Save</Translate>
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default PasswordPage;
