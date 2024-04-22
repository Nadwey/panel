import { useState } from 'react';
import { Subuser } from '@/state/server/subusers';
import RemoveSubuserButton from '@/components/server/users/RemoveSubuserButton';
import EditSubuserModal from '@/components/server/users/EditSubuserModal';
import Can from '@/components/elements/Can';
import { useStoreState } from 'easy-peasy';
import tw from 'twin.macro';
import GreyRowBox from '@/components/elements/GreyRowBox';
import { IconPencil, IconShield, IconUserExclamation } from '@tabler/icons-react';

interface Props {
    subuser: Subuser;
}

export default ({ subuser }: Props) => {
    const uuid = useStoreState(state => state.user!.data!.uuid);
    const [visible, setVisible] = useState(false);

    return (
        <GreyRowBox css={tw`mb-2`}>
            <EditSubuserModal subuser={subuser} visible={visible} onModalDismissed={() => setVisible(false)} />
            <div css={tw`w-10 h-10 rounded-full bg-white border-2 border-zinc-800 overflow-hidden hidden md:block`}>
                <img css={tw`w-full h-full`} src={`${subuser.image}?s=400`} />
            </div>
            <div css={tw`ml-4 flex-1 overflow-hidden`}>
                <p css={tw`text-sm truncate`}>{subuser.email}</p>
            </div>
            <div css={tw`ml-4 flex flex-col items-center`}>
                <p css={tw`font-medium text-center`}>
                    {subuser.twoFactorEnabled ? <IconShield /> : <IconUserExclamation color="red" />}
                </p>
                <p css={tw`text-2xs text-zinc-500 uppercase hidden md:block`}>2FA Enabled</p>
            </div>
            <div css={tw`ml-4 hidden md:block`}>
                <p css={tw`font-medium text-center`}>
                    {subuser.permissions.filter(permission => permission !== 'websocket.connect').length}
                </p>
                <p css={tw`text-2xs text-zinc-500 uppercase`}>Permissions</p>
            </div>
            {subuser.uuid !== uuid && (
                <>
                    <Can action={'user.update'}>
                        <button
                            type={'button'}
                            aria-label={'Edit subuser'}
                            css={tw`block text-sm p-1 md:p-2 text-zinc-500 hover:text-zinc-100 transition-colors duration-150 mx-4`}
                            onClick={() => setVisible(true)}
                        >
                            <IconPencil />
                        </button>
                    </Can>
                    <Can action={'user.delete'}>
                        <RemoveSubuserButton subuser={subuser} />
                    </Can>
                </>
            )}
        </GreyRowBox>
    );
};
