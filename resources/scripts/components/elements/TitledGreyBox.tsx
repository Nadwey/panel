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
    <div css={tw`rounded shadow-md bg-neutral-700`} className={className}>
        <div css={tw`bg-neutral-900 rounded-t p-3 border-b border-black`}>
            {typeof title === 'string' ? (
                <p css={tw`text-sm uppercase`}>
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
