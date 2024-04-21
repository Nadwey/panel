import type { Actions } from 'easy-peasy';
import { useStoreActions } from 'easy-peasy';
import { useState } from 'react';
import { deleteRole } from '@/api/admin/roles';
import ConfirmationModal from '@/components/elements/ConfirmationModal';
import type { ApplicationStore } from '@/state';
import { Button } from '@/components/elements/button';
import { Size } from '@/components/elements/button/types';
import { IconTrash } from '@tabler/icons-react';

interface Props {
    roleId: number;
    onDeleted: () => void;
}

export default ({ roleId, onDeleted }: Props) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const { clearFlashes, clearAndAddHttpError } = useStoreActions(
        (actions: Actions<ApplicationStore>) => actions.flashes,
    );

    const onDelete = () => {
        setLoading(true);
        clearFlashes('role');

        deleteRole(roleId)
            .then(() => {
                setLoading(false);
                onDeleted();
            })
            .catch(error => {
                console.error(error);
                clearAndAddHttpError({ key: 'role', error });

                setLoading(false);
                setVisible(false);
            });
    };

    return (
        <>
            <ConfirmationModal
                visible={visible}
                title={'Delete role?'}
                buttonText={'Yes, delete role'}
                onConfirmed={onDelete}
                showSpinnerOverlay={loading}
                onModalDismissed={() => setVisible(false)}
            >
                Are you sure you want to delete this role?
            </ConfirmationModal>

            <Button.Danger type={'button'} size={Size.Small} onClick={() => setVisible(true)}>
                <IconTrash size={20} />
            </Button.Danger>
        </>
    );
};
