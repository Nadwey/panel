import type { Actions } from 'easy-peasy';
import { useStoreActions } from 'easy-peasy';
import { useState } from 'react';
import tw from 'twin.macro';

import { deleteUser } from '@/api/admin/users';
import ConfirmationModal from '@/components/elements/ConfirmationModal';
import type { ApplicationStore } from '@/state';
import { Button } from '@/components/elements/button';
import { Size } from '@/components/elements/button/types';

interface Props {
    userId: number;
    onDeleted: () => void;
}

export default ({ userId, onDeleted }: Props) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const { clearFlashes, clearAndAddHttpError } = useStoreActions(
        (actions: Actions<ApplicationStore>) => actions.flashes,
    );

    const onDelete = () => {
        setLoading(true);
        clearFlashes('user');

        deleteUser(userId)
            .then(() => {
                setLoading(false);
                onDeleted();
            })
            .catch(error => {
                console.error(error);
                clearAndAddHttpError({ key: 'user', error });

                setLoading(false);
                setVisible(false);
            });
    };

    return (
        <>
            <ConfirmationModal
                visible={visible}
                title={'Delete user?'}
                buttonText={'Yes, delete user'}
                onConfirmed={onDelete}
                showSpinnerOverlay={loading}
                onModalDismissed={() => setVisible(false)}
            >
                Are you sure you want to delete this user?
            </ConfirmationModal>

            <Button.Danger type={'button'} size={Size.Small} onClick={() => setVisible(true)}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    css={tw`h-5 w-5`}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                </svg>
            </Button.Danger>
        </>
    );
};
