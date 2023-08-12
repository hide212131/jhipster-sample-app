import React, { useState, useEffect } from 'react';
import { Col, Row, Button, Form } from 'reactstrap';
import { Translate, translate, ValidatedTextInput } from 'react-jhipster';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import { handlePasswordResetFinish, reset } from '../password-reset.reducer';
import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { useForm } from 'react-hook-form';

export const PasswordResetFinishPage = () => {
  const dispatch = useAppDispatch();

  const [searchParams] = useSearchParams();
  const key = searchParams.get('key');
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, touchedFields },
  } = useForm({ mode: 'onTouched' });
  const [password, setPassword] = useState('');

  useEffect(
    () => () => {
      dispatch(reset());
    },
    [],
  );
  const successMessage = useAppSelector(state => state.passwordReset.successMessage);

  useEffect(() => {
    if (successMessage) {
      toast.success(translate(successMessage));
    }
  }, [successMessage]);

  const handleValidSubmit = data => {
    dispatch(handlePasswordResetFinish({ key: data.key, newPassword: data.newPassword }));
  };

  const updatePassword = event => {
    setPassword(event.target.value);
    setValue('newPassword', event.target.value, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
  };

  const getResetForm = () => {
    return (
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      <Form onSubmit={handleSubmit(handleValidSubmit)}>
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
          updateValueOverrideMethod={updatePassword}
        />
        <PasswordStrengthBar password={password} />
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
            validate: v => v === password || translate('global.messages.error.dontmatch'),
          }}
          labelPlaceholderKey="global.form.confirmpassword.label"
          inputPlaceholderKey="global.form.confirmpassword.placeholder"
          type="password"
        />
        <Button color="success" type="submit" data-cy="submit">
          <Translate contentKey="reset.finish.form.button">Validate new password</Translate>
        </Button>
      </Form>
    );
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="4">
          <h1>
            <Translate contentKey="reset.finish.title">Reset password</Translate>
          </h1>
          <div>{key ? getResetForm() : null}</div>
        </Col>
      </Row>
    </div>
  );
};

export default PasswordResetFinishPage;
