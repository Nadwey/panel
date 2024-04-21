import styled from 'styled-components';
import tw from 'twin.macro';

export default styled.div<{ $hoverable?: boolean }>`
    ${tw`flex rounded-xl no-underline text-zinc-200 items-center bg-zinc-900/50 border-zinc-900 p-5 border border-transparent transition-colors duration-150 overflow-hidden`};

    ${props => props.$hoverable !== false && tw`hover:border-zinc-800`};
`;
