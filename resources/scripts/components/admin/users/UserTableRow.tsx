import { useState } from 'react';

import Checkbox from '@/components/elements/inputs/Checkbox';
import { Dropdown } from '@/components/elements/dropdown';
import { Dialog } from '@/components/elements/dialog';
import type { User } from '@definitions/admin';
import { IconBan, IconDotsVertical, IconLifebuoy, IconLockOpen, IconPencil, IconTrash } from '@tabler/icons-react';

interface Props {
    user: User;
    selected?: boolean;
    onRowChange: (user: User, selected: boolean) => void;
}

function UserTableRow({ user, selected, onRowChange }: Props) {
    const [visible, setVisible] = useState(false);

    return (
        <>
            <Dialog.Confirm
                title={'Delete account'}
                open={visible}
                onClose={() => setVisible(false)}
                onConfirmed={() => {
                    console.log('yeet');
                }}
            >
                This account will be permanently deleted.
            </Dialog.Confirm>

            <tr>
                <td className={'whitespace-nowrap'}>
                    <div className={'flex w-8 items-center justify-end'}>
                        <Checkbox checked={selected} onChange={e => onRowChange(user, e.currentTarget.checked)} />
                    </div>
                </td>
                <td className={'whitespace-nowrap py-4 pl-6'}>
                    <div className={'flex items-center'}>
                        <div className={'h-10 w-10'}>
                            <img src={user.avatarUrl} className={'h-10 w-10 rounded-full'} alt={'User avatar'} />
                        </div>
                        <div className={'ml-4'}>
                            <p className={'font-medium'}>{user.email}</p>
                            <p className={'text-sm text-zinc-400'}>{user.uuid}</p>
                        </div>
                    </div>
                </td>
                <td className={'whitespace-nowrap py-4 pl-2'}>
                    {user.isUsingTwoFactor && (
                        <span
                            className={
                                'rounded bg-green-100 px-2 py-0.5 text-xs font-semibold uppercase text-green-700'
                            }
                        >
                            2-FA Enabled
                        </span>
                    )}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                    <Dropdown>
                        <Dropdown.Button className="px-2">
                            <IconDotsVertical />
                        </Dropdown.Button>
                        <Dropdown.Item to={`/admin/users/${user.id}`} icon={<IconPencil />}>
                            Edit
                        </Dropdown.Item>
                        <Dropdown.Item icon={<IconLifebuoy />}>Reset Password</Dropdown.Item>
                        <Dropdown.Item icon={<IconLockOpen />} disabled={!user.isUsingTwoFactor}>
                            Disable 2-FA
                        </Dropdown.Item>
                        <Dropdown.Item icon={<IconBan />}>Suspend</Dropdown.Item>
                        <Dropdown.Gap />
                        <Dropdown.Item icon={<IconTrash />} onClick={() => setVisible(true)} danger>
                            Delete Account
                        </Dropdown.Item>
                    </Dropdown>
                </td>
            </tr>
        </>
    );
}

export default UserTableRow;
