import type { Actions } from 'easy-peasy';
import { useStoreActions } from 'easy-peasy';
import { useState } from 'react';
import deleteNode from '@/api/admin/nodes/deleteNode';
import { Button } from '@/components/elements/button';
import ConfirmationModal from '@/components/elements/ConfirmationModal';
import type { ApplicationStore } from '@/state';
import { Size } from '@/components/elements/button/types';
import { IconTrash } from '@tabler/icons-react';

interface Props {
    nodeId: number;
    onDeleted: () => void;
}

export default ({ nodeId, onDeleted }: Props) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const { clearFlashes, clearAndAddHttpError } = useStoreActions(
        (actions: Actions<ApplicationStore>) => actions.flashes,
    );

    const onDelete = () => {
        setLoading(true);
        clearFlashes('node');

        deleteNode(nodeId)
            .then(() => {
                setLoading(false);
                onDeleted();
            })
            .catch(error => {
                console.error(error);
                clearAndAddHttpError({ key: 'node', error });

                setLoading(false);
                setVisible(false);
            });
    };

    return (
        <>
            <ConfirmationModal
                visible={visible}
                title={'Delete node?'}
                buttonText={'Yes, delete node'}
                onConfirmed={onDelete}
                showSpinnerOverlay={loading}
                onModalDismissed={() => setVisible(false)}
            >
                Are you sure you want to delete this node?
            </ConfirmationModal>

            <Button.Danger type="button" size={Size.Small} onClick={() => setVisible(true)}>
                <IconTrash />
            </Button.Danger>
        </>
    );
};
