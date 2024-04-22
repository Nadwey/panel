import type { ForwardRefExoticComponent, ReactNode, RefAttributes } from 'react';
import tw from 'twin.macro';

import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { Icon, IconProps } from '@tabler/icons-react';

interface Props {
    icon?: ForwardRefExoticComponent<Omit<IconProps, 'ref'> & RefAttributes<Icon>>; // bruh
    isLoading?: boolean;
    title: string | ReactNode;
    className?: string;
    noPadding?: boolean;
    children: ReactNode;
    button?: ReactNode;
}

const AdminBox = ({ icon: Icon, title, className, isLoading, children, button, noPadding }: Props) => (
    <div css={tw`relative border border-zinc-900 rounded-md bg-zinc-900/50`} className={className}>
        <SpinnerOverlay visible={isLoading || false} />
        <div css={tw`flex flex-row rounded-md px-4 xl:px-5 py-3`}>
            {typeof title === 'string' ? (
                <div css={tw`text-sm font-bold flex flex-row items-center justify-center gap-x-1`}>
                    {Icon && (
                        <span css={tw`text-zinc-300`}>
                            <Icon />
                        </span>
                    )}
                    {title}
                </div>
            ) : (
                title
            )}
            {button}
        </div>
        <div css={[!noPadding && tw`px-4 xl:px-5 py-5`]}>{children}</div>
    </div>
);

export default AdminBox;
