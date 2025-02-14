import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import performPasswordReset from '@/api/auth/performPasswordReset';
import { httpErrorToHuman } from '@/api/http';
import LoginFormContainer from '@/components/auth/LoginFormContainer';
import { Actions, useStoreActions } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { Formik, FormikHelpers } from 'formik';
import { object, ref, string } from 'yup';
import Field from '@/components/elements/Field';
import Input from '@/components/elements/Input';
import tw from 'twin.macro';
import { Button } from '../elements/button';
import { Size } from '../elements/button/types';

interface Values {
    password: string;
    passwordConfirmation: string;
}

function ResetPasswordContainer() {
    const [email, setEmail] = useState('');

    const { clearFlashes, addFlash } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    const parsed = new URLSearchParams(location.search);
    if (email.length === 0 && parsed.get('email')) {
        setEmail(parsed.get('email') || '');
    }

    const params = useParams<'token'>();

    const submit = ({ password, passwordConfirmation }: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes();
        performPasswordReset(email, { token: params.token ?? '', password, passwordConfirmation })
            .then(() => {
                // @ts-expect-error this is valid
                window.location = '/';
            })
            .catch(error => {
                console.error(error);

                setSubmitting(false);
                addFlash({ type: 'error', title: 'Error', message: httpErrorToHuman(error) });
            });
    };

    return (
        <Formik
            onSubmit={submit}
            initialValues={{
                password: '',
                passwordConfirmation: '',
            }}
            validationSchema={object().shape({
                password: string()
                    .required('A new password is required.')
                    .min(8, 'Your new password should be at least 8 characters in length.'),
                passwordConfirmation: string()
                    .required('Your new password does not match.')
                    .oneOf([ref('password'), null], 'Your new password does not match.'),
            })}
        >
            {({ isSubmitting }) => (
                <LoginFormContainer title={'Reset Password'} css={tw`w-full flex`}>
                    <div>
                        <label>Email</label>
                        <Input value={email} $isLight disabled />
                    </div>
                    <div css={tw`mt-6`}>
                        <Field
                            light
                            label={'New Password'}
                            name={'password'}
                            type={'password'}
                            description={'Passwords must be at least 8 characters in length.'}
                        />
                    </div>
                    <div css={tw`mt-6`}>
                        <Field light label={'Confirm New Password'} name={'passwordConfirmation'} type={'password'} />
                    </div>
                    <div css={tw`mt-6`}>
                        <Button size={Size.Large} type={'submit'} disabled={isSubmitting} loading={isSubmitting}>
                            Reset Password
                        </Button>
                    </div>
                    <div css={tw`mt-6 text-center`}>
                        <Link
                            to={'/auth/login'}
                            css={tw`text-xs text-zinc-500 tracking-wide no-underline uppercase hover:text-zinc-600`}
                        >
                            Return to Login
                        </Link>
                    </div>
                </LoginFormContainer>
            )}
        </Formik>
    );
}

export default ResetPasswordContainer;
