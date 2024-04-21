import type { Actions } from 'easy-peasy';
import { useStoreActions } from 'easy-peasy';
import { useState } from 'react';

import deleteAllocation from '@/api/admin/nodes/allocations/deleteAllocation';
import ConfirmationModal from '@/components/elements/ConfirmationModal';
import type { ApplicationStore } from '@/state';
import { Button } from '@/components/elements/button';
import { IconTrash } from '@tabler/icons-react';

interface Props {
    nodeId: number;
    allocationId: number;
    onDeleted?: () => void;
}

export default ({ nodeId, allocationId, onDeleted }: Props) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const { clearFlashes, clearAndAddHttpError } = useStoreActions(
        (actions: Actions<ApplicationStore>) => actions.flashes,
    );

    const onDelete = () => {
        setLoading(true);
        clearFlashes('allocation');

        deleteAllocation(nodeId, allocationId)
            .then(() => {
                setLoading(false);
                setVisible(false);
                if (onDeleted !== undefined) {
                    onDeleted();
                }
            })
            .catch(error => {
                console.error(error);
                clearAndAddHttpError({ key: 'allocation', error });

                setLoading(false);
                setVisible(false);
            });
    };

    return (
        <>
            <ConfirmationModal
                visible={visible}
                title={'Delete allocation?'}
                buttonText={'Yes, delete allocation'}
                onConfirmed={onDelete}
                showSpinnerOverlay={loading}
                onModalDismissed={() => setVisible(false)}
            >
                Are you sure you want to delete this allocation?
            </ConfirmationModal>

            <Button.Danger type={'button'} onClick={() => setVisible(true)}>
                <IconTrash size={20} />
            </Button.Danger>
        </>
    );
};
