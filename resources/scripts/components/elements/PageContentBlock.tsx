import type { ReactNode } from 'react';
import { useEffect } from 'react';
import tw from 'twin.macro';

import ContentContainer from '@/components/elements/ContentContainer';
import FlashMessageRender from '@/components/FlashMessageRender';

export interface PageContentBlockProps {
    children?: ReactNode;

    title?: string;
    className?: string;
    showFlashKey?: string;
}

function PageContentBlock({ title, showFlashKey, className, children }: PageContentBlockProps) {
    useEffect(() => {
        if (title) {
            document.title = title;
        }
    }, [title]);

    return (
        <>
            <ContentContainer css={tw`my-6`} className={className}>
                {showFlashKey && <FlashMessageRender byKey={showFlashKey} css={tw`mb-4`} />}
                {children}
            </ContentContainer>
            {/* 
            <ContentContainer css={tw`mb-4`}>
                <p css={tw`text-center text-zinc-500 text-xs`}>
                    <a
                        rel={'noopener nofollow noreferrer'}
                        href={'https://pterodactyl.io'}
                        target={'_blank'}
                        css={tw`no-underline text-zinc-500 hover:text-zinc-300`}
                    >
                        Pterodactyl&reg;
                    </a>
                    &nbsp;&copy; 2015 - {new Date().getFullYear()}
                </p>
            </ContentContainer> */}
        </>
    );
}

export default PageContentBlock;
