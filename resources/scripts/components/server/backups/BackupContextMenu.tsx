import { useState } from 'react';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import getBackupDownloadUrl from '@/api/server/backups/getBackupDownloadUrl';
import useFlash from '@/plugins/useFlash';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import deleteBackup from '@/api/server/backups/deleteBackup';
import Can from '@/components/elements/Can';
import tw from 'twin.macro';
import getServerBackups from '@/api/swr/getServerBackups';
import { ServerBackup } from '@/api/server/types';
import { ServerContext } from '@/state/server';
import Input from '@/components/elements/Input';
import { restoreServerBackup } from '@/api/server/backups';
import http, { httpErrorToHuman } from '@/api/http';
import { Dialog } from '@/components/elements/dialog';
import { Dropdown } from '@/components/elements/dropdown';
import {
    ArrowDownTrayIcon,
    EllipsisVerticalIcon,
    BackwardIcon,
    LockClosedIcon,
    LockOpenIcon,
    TrashIcon,
} from '@heroicons/react/24/solid';

interface Props {
    backup: ServerBackup;
}

export default ({ backup }: Props) => {
    const uuid = ServerContext.useStoreState(state => state.server.data!.uuid);
    const setServerFromState = ServerContext.useStoreActions(actions => actions.server.setServerFromState);
    const [modal, setModal] = useState('');
    const [loading, setLoading] = useState(false);
    const [truncate, setTruncate] = useState(false);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { mutate } = getServerBackups();

    const doDownload = () => {
        setLoading(true);
        clearFlashes('backups');
        getBackupDownloadUrl(uuid, backup.uuid)
            .then(url => {
                // @ts-expect-error this is valid
                window.location = url;
            })
            .catch(error => {
                console.error(error);
                clearAndAddHttpError({ key: 'backups', error });
            })
            .then(() => setLoading(false));
    };

    const doDeletion = () => {
        setLoading(true);
        clearFlashes('backups');
        deleteBackup(uuid, backup.uuid)
            .then(
                async () =>
                    await mutate(
                        data => ({
                            ...data!,
                            items: data!.items.filter(b => b.uuid !== backup.uuid),
                            backupCount: data!.backupCount - 1,
                        }),
                        false,
                    ),
            )
            .catch(error => {
                console.error(error);
                clearAndAddHttpError({ key: 'backups', error });
                setLoading(false);
                setModal('');
            });
    };

    const doRestorationAction = () => {
        setLoading(true);
        clearFlashes('backups');
        restoreServerBackup(uuid, backup.uuid, truncate)
            .then(() =>
                setServerFromState(s => ({
                    ...s,
                    status: 'restoring_backup',
                })),
            )
            .catch(error => {
                console.error(error);
                clearAndAddHttpError({ key: 'backups', error });
            })
            .then(() => setLoading(false))
            .then(() => setModal(''));
    };

    const onLockToggle = () => {
        if (backup.isLocked && modal !== 'unlock') {
            return setModal('unlock');
        }

        http.post(`/api/client/servers/${uuid}/backups/${backup.uuid}/lock`)
            .then(
                async () =>
                    await mutate(
                        data => ({
                            ...data!,
                            items: data!.items.map(b =>
                                b.uuid !== backup.uuid
                                    ? b
                                    : {
                                          ...b,
                                          isLocked: !b.isLocked,
                                      },
                            ),
                        }),
                        false,
                    ),
            )
            .catch(error => alert(httpErrorToHuman(error)))
            .then(() => setModal(''));
    };

    return (
        <>
            <Dialog.Confirm
                open={modal === 'unlock'}
                onClose={() => setModal('')}
                title={`Unlock "${backup.name}"`}
                onConfirmed={onLockToggle}
            >
                This backup will no longer be protected from automated or accidental deletions.
            </Dialog.Confirm>
            <Dialog.Confirm
                open={modal === 'restore'}
                onClose={() => setModal('')}
                confirm={'Restore'}
                title={`Restore "${backup.name}"`}
                onConfirmed={() => doRestorationAction()}
            >
                <p>
                    Your server will be stopped. You will not be able to control the power state, access the file
                    manager, or create additional backups until completed.
                </p>
                <p css={tw`mt-4 -mb-2 bg-slate-700 p-3 rounded`}>
                    <label htmlFor={'restore_truncate'} css={tw`text-base flex items-center cursor-pointer`}>
                        <Input
                            type={'checkbox'}
                            css={tw`text-red-500! w-5! h-5! mr-2`}
                            id={'restore_truncate'}
                            value={'true'}
                            checked={truncate}
                            onChange={() => setTruncate(s => !s)}
                        />
                        Delete all files before restoring backup.
                    </label>
                </p>
            </Dialog.Confirm>
            <Dialog.Confirm
                title={`Delete "${backup.name}"`}
                confirm={'Continue'}
                open={modal === 'delete'}
                onClose={() => setModal('')}
                onConfirmed={doDeletion}
            >
                This is a permanent operation. The backup cannot be recovered once deleted.
            </Dialog.Confirm>
            <SpinnerOverlay visible={loading} fixed />
            {backup.isSuccessful ? (
                <Dropdown>
                    <Dropdown.Button className="px-2">
                        <EllipsisVerticalIcon />
                    </Dropdown.Button>
                    <Can action={'backup.download'}>
                        <Dropdown.Item icon={<ArrowDownTrayIcon />} onClick={doDownload}>
                            Download
                        </Dropdown.Item>
                    </Can>
                    <Can action={'backup.restore'}>
                        <Dropdown.Item icon={<BackwardIcon />} onClick={() => setModal('restore')}>
                            Restore
                        </Dropdown.Item>
                    </Can>
                    <Can action={'backup.delete'}>
                        <>
                            <Dropdown.Item
                                icon={backup.isLocked ? <LockClosedIcon /> : <LockOpenIcon />}
                                onClick={onLockToggle}
                            >
                                {backup.isLocked ? 'Unlock' : 'Lock'}
                            </Dropdown.Item>
                            {!backup.isLocked && (
                                <Dropdown.Item icon={<TrashIcon />} danger onClick={() => setModal('delete')}>
                                    Delete
                                </Dropdown.Item>
                            )}
                        </>
                    </Can>
                </Dropdown>
            ) : (
                <button onClick={() => setModal('delete')} css={tw`p-2`}>
                    <TrashIcon width={'1.2rem'} />
                </button>
            )}
        </>
    );
};
