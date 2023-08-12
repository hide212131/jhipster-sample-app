import React, { useEffect } from 'react';
import { Translate, translate, ValidatedTextInput, isEmail } from 'react-jhipster';
import { Button, Alert, Col, Row, Form } from 'reactstrap';
import { toast } from 'react-toastify';

import { handlePasswordResetInit, reset } from '../password-reset.reducer';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { useForm } from 'react-hook-form';

export const PasswordResetInit = () => {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, touchedFields },
  } = useForm({ mode: 'onTouched' });

  useEffect(
    () => () => {
      dispatch(reset());
    },
    [],
  );

  const handleValidSubmit = data => {
    dispatch(handlePasswordResetInit(data.email));
  };

  const successMessage = useAppSelector(state => state.passwordReset.successMessage);

  useEffect(() => {
    if (successMessage) {
      toast.success(translate(successMessage));
    }
  }, [successMessage]);

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h1>
            <Translate contentKey="reset.request.title">Reset your password</Translate>
          </h1>
          <Alert color="warning">
            <p>
              <Translate contentKey="reset.request.messages.info">Enter the email address you used to register</Translate>
            </p>
          </Alert>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <Form onSubmit={handleSubmit(handleValidSubmit)}>
            <ValidatedTextInput
              register={register}
              touchedFields={touchedFields}
              errors={errors}
              setValue={setValue}
              nameIdCy="email"
              validate={{
                required: translate('global.messages.validate.email.required'),
                minLength: { value: 5, message: translate('global.messages.validate.email.minlength') },
                maxLength: { value: 254, message: translate('global.messages.validate.email.maxlength') },
                validate: v => isEmail(v) || translate('global.messages.validate.email.invalid'),
              }}
              labelPlaceholderKey="global.form.email.label"
              inputPlaceholderKey="global.form.email.placeholder"
              type="email"
            />
            <Button color="primary" type="submit" data-cy="submit">
              <Translate contentKey="reset.request.form.button">Reset password</Translate>
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default PasswordResetInit;
