import styled from 'styled-components';
import tw from 'twin.macro';

const SubNavigation = styled.div`
    ${tw`w-full overflow-x-auto flex flex-row justify-center text-sm p-2`};

    & a {
        ${tw`inline-block font-sans text-base rounded py-2 px-4 text-white no-underline whitespace-nowrap transition-all duration-150`};

        &:not(:first-of-type) {
            ${tw`ml-3`};
        }

        &:hover {
            ${tw`text-white`};
        }

        &:active,
        &.active {
            ${tw`bg-zinc-900`};
        }
    }
`;

export default SubNavigation;
