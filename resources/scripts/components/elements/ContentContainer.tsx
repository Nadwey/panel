import styled from 'styled-components';
import tw from 'twin.macro';

const ContentContainer = styled.div`
    max-width: 1200px;
    ${tw`mx-4`};

    ${({ theme }) => theme.breakpoints.up('xLarge')} {
        ${tw`mx-auto`};
    }
`;
ContentContainer.displayName = 'ContentContainer';

export default ContentContainer;
