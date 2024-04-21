import { memo, useState } from 'react';
import RenameFileModal from '@/components/server/files/RenameFileModal';
import { ServerContext } from '@/state/server';
import { join } from 'pathe';
import deleteFiles from '@/api/server/files/deleteFiles';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import copyFile from '@/api/server/files/copyFile';
import Can from '@/components/elements/Can';
import getFileDownloadUrl from '@/api/server/files/getFileDownloadUrl';
import useFlash from '@/plugins/useFlash';
import { FileObject } from '@/api/server/files/loadDirectory';
import useFileManagerSwr from '@/plugins/useFileManagerSwr';
import compressFiles from '@/api/server/files/compressFiles';
import decompressFiles from '@/api/server/files/decompressFiles';
import isEqual from 'react-fast-compare';
import ChmodFileModal from '@/components/server/files/ChmodFileModal';
import { Dialog } from '@/components/elements/dialog';
import { Dropdown } from '@/components/elements/dropdown';
import {
    IconArrowUp,
    IconCode,
    IconDotsVertical,
    IconDownload,
    IconFiles,
    IconPackage,
    IconPackageExport,
    IconPencil,
    IconTrash,
} from '@tabler/icons-react';

type ModalType = 'rename' | 'move' | 'chmod';

const FileDropdownMenu = ({ file }: { file: FileObject }) => {
    const [showSpinner, setShowSpinner] = useState(false);
    const [modal, setModal] = useState<ModalType | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const uuid = ServerContext.useStoreState(state => state.server.data!.uuid);
    const { mutate } = useFileManagerSwr();
    const { clearAndAddHttpError, clearFlashes } = useFlash();
    const directory = ServerContext.useStoreState(state => state.files.directory);

    const doDeletion = async () => {
        clearFlashes('files');

        // For UI speed, immediately remove the file from the listing before calling the deletion function.
        // If the delete actually fails, we'll fetch the current directory contents again automatically.
        await mutate(files => files!.filter(f => f.key !== file.key), false);

        deleteFiles(uuid, directory, [file.name]).catch(error => {
            mutate();
            clearAndAddHttpError({ key: 'files', error });
        });
    };

    const doCopy = () => {
        setShowSpinner(true);
        clearFlashes('files');

        copyFile(uuid, join(directory, file.name))
            .then(() => mutate())
            .catch(error => clearAndAddHttpError({ key: 'files', error }))
            .then(() => setShowSpinner(false));
    };

    const doDownload = () => {
        setShowSpinner(true);
        clearFlashes('files');

        getFileDownloadUrl(uuid, join(directory, file.name))
            .then(url => {
                // @ts-expect-error this is valid
                window.location = url;
            })
            .catch(error => clearAndAddHttpError({ key: 'files', error }))
            .then(() => setShowSpinner(false));
    };

    const doArchive = () => {
        setShowSpinner(true);
        clearFlashes('files');

        compressFiles(uuid, directory, [file.name])
            .then(() => mutate())
            .catch(error => clearAndAddHttpError({ key: 'files', error }))
            .then(() => setShowSpinner(false));
    };

    const doUnarchive = () => {
        setShowSpinner(true);
        clearFlashes('files');

        decompressFiles(uuid, directory, file.name)
            .then(() => mutate())
            .catch(error => clearAndAddHttpError({ key: 'files', error }))
            .then(() => setShowSpinner(false));
    };

    return (
        <>
            <Dialog.Confirm
                open={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                title={`Delete ${file.isFile ? 'File' : 'Directory'}`}
                confirm={'Delete'}
                onConfirmed={doDeletion}
            >
                You will not be able to recover the contents of&nbsp;
                <span className={'font-semibold text-slate-50'}>{file.name}</span> once deleted.
            </Dialog.Confirm>
            {modal ? (
                modal === 'chmod' ? (
                    <ChmodFileModal
                        visible
                        appear
                        files={[{ file: file.name, mode: file.modeBits }]}
                        onDismissed={() => setModal(null)}
                    />
                ) : (
                    <RenameFileModal
                        visible
                        appear
                        files={[file.name]}
                        useMoveTerminology={modal === 'move'}
                        onDismissed={() => setModal(null)}
                    />
                )
            ) : null}
            <SpinnerOverlay visible={showSpinner} fixed size={'large'} />

            <Dropdown>
                <Dropdown.Button className="px-2">
                    <IconDotsVertical />
                </Dropdown.Button>
                <Can action={'file.update'}>
                    <Dropdown.Item icon={<IconPencil />} onClick={() => setModal('rename')}>
                        Rename
                    </Dropdown.Item>
                    <Dropdown.Item icon={<IconArrowUp />} onClick={() => setModal('move')}>
                        Move
                    </Dropdown.Item>
                    <Dropdown.Item icon={<IconCode />} onClick={() => setModal('chmod')}>
                        Permissions
                    </Dropdown.Item>
                </Can>
                {file.isFile && (
                    <Can action={'file.create'}>
                        <Dropdown.Item icon={<IconFiles />} onClick={doCopy}>
                            Copy
                        </Dropdown.Item>
                    </Can>
                )}
                <Dropdown.Gap />
                {file.isArchiveType() ? (
                    <Can action={'file.create'}>
                        <Dropdown.Item icon={<IconPackageExport />} onClick={doUnarchive}>
                            Unarchive
                        </Dropdown.Item>
                    </Can>
                ) : (
                    <Can action={'file.archive'}>
                        <Dropdown.Item icon={<IconPackage />} onClick={doArchive}>
                            Archive
                        </Dropdown.Item>
                    </Can>
                )}
                {file.isFile && (
                    <Dropdown.Item icon={<IconDownload />} onClick={doDownload}>
                        Download
                    </Dropdown.Item>
                )}
                <Dropdown.Gap />
                <Can action={'file.delete'}>
                    <Dropdown.Item danger icon={<IconTrash />} onClick={() => setShowConfirmation(true)}>
                        Delete
                    </Dropdown.Item>
                </Can>
            </Dropdown>
        </>
    );
};

export default memo(FileDropdownMenu, isEqual);
