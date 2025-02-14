import type { ReactNode } from 'react';
import { useContext } from 'react';
import tw from 'twin.macro';

import ModalContext from '@/context/ModalContext';
import asModal from '@/hoc/asModal';
import { Button } from './button';
import { Variant } from './button/types';

interface Props {
    children: ReactNode;

    title: string;
    buttonText: string;
    onConfirmed: () => void;
    showSpinnerOverlay?: boolean;
}

function ConfirmationModal({ title, children, buttonText, onConfirmed }: Props) {
    const { dismiss } = useContext(ModalContext);

    return (
        <>
            <h2 css={tw`text-2xl mb-6`}>{title}</h2>
            <div css={tw`text-zinc-300`}>{children}</div>

            <div css={tw`flex flex-wrap items-center justify-end mt-8`}>
                <Button
                    variant={Variant.Secondary}
                    onClick={() => dismiss()}
                    css={tw`w-full sm:w-auto border-transparent`}
                >
                    Cancel
                </Button>
                <Button.Danger css={tw`w-full sm:w-auto mt-4 sm:mt-0 sm:ml-4`} onClick={() => onConfirmed()}>
                    {buttonText}
                </Button.Danger>
            </div>
        </>
    );
}

export default asModal<Props>(props => ({
    showSpinnerOverlay: props.showSpinnerOverlay,
}))(ConfirmationModal);
