import { memo } from 'react';
import * as React from 'react';
import tw from 'twin.macro';
import isEqual from 'react-fast-compare';

interface Props {
    icon?: React.ReactNode;
    title: string | React.ReactNode;
    className?: string;
    children: React.ReactNode;
}

const TitledGreyBox = ({ icon, title, children, className }: Props) => (
    <div css={tw`rounded-xl shadow-md bg-zinc-900/50 border border-zinc-900`} className={className}>
        <div css={tw`rounded-xl px-3 pt-3`}>
            {typeof title === 'string' ? (
                <p css={tw`text-sm font-bold`}>
                    {icon}
                    {title}
                </p>
            ) : (
                title
            )}
        </div>
        <div css={tw`p-3`}>{children}</div>
    </div>
);

export default memo(TitledGreyBox, isEqual);
