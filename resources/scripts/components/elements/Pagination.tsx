import * as React from 'react';
import { PaginatedResult } from '@/api/http';
import tw from 'twin.macro';
import styled from 'styled-components';
import { IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react';
import { Button } from './button';
import { Variant } from './button/types';

interface RenderFuncProps<T> {
    items: T[];
    isLastPage: boolean;
    isFirstPage: boolean;
}

interface Props<T> {
    data: PaginatedResult<T>;
    showGoToLast?: boolean;
    showGoToFirst?: boolean;
    onPageSelect: (page: number) => void;
    children: (props: RenderFuncProps<T>) => React.ReactNode;
}

const Block = styled(Button)`
    ${tw`p-0 w-10 h-10`}

    &:not(:last-of-type) {
        ${tw`mr-2`};
    }
`;

function Pagination<T>({ data: { items, pagination }, onPageSelect, children }: Props<T>) {
    const isFirstPage = pagination.currentPage === 1;
    const isLastPage = pagination.currentPage >= pagination.totalPages;

    const pages = [];

    // Start two spaces before the current page. If that puts us before the starting page default
    // to the first page as the starting point.
    const start = Math.max(pagination.currentPage - 2, 1);
    const end = Math.min(pagination.totalPages, pagination.currentPage + 5);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return (
        <>
            {children({ items, isFirstPage, isLastPage })}
            {pages.length > 1 && (
                <div css={tw`mt-4 flex justify-center`}>
                    {(pages?.[0] ?? 0) > 1 && !isFirstPage && (
                        <Block variant={Variant.Secondary} onClick={() => onPageSelect(1)}>
                            <IconChevronsLeft />
                        </Block>
                    )}
                    {pages.map(i => (
                        <Block
                            variant={pagination.currentPage !== i ? Variant.Secondary : Variant.Primary}
                            key={`block_page_${i}`}
                            onClick={() => onPageSelect(i)}
                        >
                            {i}
                        </Block>
                    ))}
                    {(pages?.[4] ?? 0) < pagination.totalPages && !isLastPage && (
                        <Block variant={Variant.Secondary} onClick={() => onPageSelect(pagination.totalPages)}>
                            <IconChevronsRight />
                        </Block>
                    )}
                </div>
            )}
        </>
    );
}

export default Pagination;
