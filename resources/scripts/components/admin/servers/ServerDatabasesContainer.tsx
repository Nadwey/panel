import { useParams } from 'react-router-dom';
import tw from 'twin.macro';

import ServerDatabasesTable from './databases/ServerDatabasesTable';

export default () => {
    const params = useParams<'id'>();

    return (
        <>
            <div css={tw`w-full`}>
                <ServerDatabasesTable serverId={Number(params.id)} />
            </div>
        </>
    );
};
