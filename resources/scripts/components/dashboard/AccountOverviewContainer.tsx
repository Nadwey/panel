import ContentBox from '@/components/elements/ContentBox';
import UpdatePasswordForm from '@/components/dashboard/forms/UpdatePasswordForm';
import UpdateEmailAddressForm from '@/components/dashboard/forms/UpdateEmailAddressForm';
import ConfigureTwoFactorForm from '@/components/dashboard/forms/ConfigureTwoFactorForm';
import PageContentBlock from '@/components/elements/PageContentBlock';
import tw from 'twin.macro';
import styled from 'styled-components';
import MessageBox from '@/components/MessageBox';
import { useLocation } from 'react-router-dom';

const Container = styled.div`
    ${tw`flex flex-wrap`};

    & > div {
        ${tw`w-full`};

        ${({ theme }) => theme.breakpoints.up('small')} {
            width: calc(50% - 1rem);
        }

        ${({ theme }) => theme.breakpoints.up('medium')} {
            ${tw`w-auto flex-1`};
        }
    }
`;

export default () => {
    const { state } = useLocation();

    return (
        <PageContentBlock title="Account Overview">
            {state?.twoFactorRedirect && (
                <MessageBox title="2-Factor Required" type="error">
                    Your account must have two-factor authentication enabled in order to continue.
                </MessageBox>
            )}

            <Container css={[tw`lg:grid lg:grid-cols-3 mb-10`, state?.twoFactorRedirect ? tw`mt-4` : tw`mt-10`]}>
                <ContentBox title="Update Password" showFlashes="account:password">
                    <UpdatePasswordForm />
                </ContentBox>

                <ContentBox css={tw`mt-8 sm:mt-0 sm:ml-8`} title="Update Email Address" showFlashes="account:email">
                    <UpdateEmailAddressForm />
                </ContentBox>

                <ContentBox css={tw`md:ml-8 mt-8 md:mt-0`} title="Two-Step Verification">
                    <ConfigureTwoFactorForm />
                </ContentBox>
            </Container>
        </PageContentBlock>
    );
};
