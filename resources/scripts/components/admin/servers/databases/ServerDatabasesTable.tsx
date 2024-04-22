import getServerDatabases, {
    Context as ServerDatabasesContext,
    Filters,
} from '@/api/admin/servers/databases/getServerDatabases';
import AdminTable, {
    ContentWrapper,
    Loading,
    NoItems,
    Pagination,
    TableBody,
    TableHead,
    TableHeader,
    useTableHooks,
} from '../../AdminTable';
import { useContext, useEffect } from 'react';
import tw from 'twin.macro';
import useFlash from '@/plugins/useFlash';
import { NavLink } from 'react-router-dom';

interface Props {
    serverId: number;
    filters?: Filters;
}

function ServerDatabasesTable({ serverId, filters }: Props) {
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { setPage, setFilters, sort, setSort, sortDirection } = useContext(ServerDatabasesContext);
    const { data: databases, error, isValidating } = getServerDatabases(serverId, ['host']);

    const length = databases?.items?.length || 0;

    const onSearch = (query: string): Promise<void> => {
        return new Promise(resolve => {
            if (query.length < 1) setFilters(filters || null);
            else setFilters({ ...filters, database: query });
            return resolve();
        });
    };

    useEffect(() => {
        if (!error) {
            clearFlashes('serverDatabases');
            return;
        }

        clearAndAddHttpError({ key: 'serverDatabases', error });
    }, [error]);

    return (
        <div>
            <AdminTable>
                <ContentWrapper onSearch={onSearch}>
                    <Pagination data={databases} onPageSelect={setPage}>
                        <div css={tw`overflow-x-auto`}>
                            <table css={tw`w-full table-auto`}>
                                <TableHead noCheckboxHeader>
                                    <TableHeader
                                        name={'Name'}
                                        direction={sort === 'name' ? (sortDirection ? 1 : 2) : null}
                                        onClick={() => setSort('database')}
                                    />
                                    <TableHeader name={'Username'} />
                                    <TableHeader name={'Connections from'} />
                                    <TableHeader name={'Database Host'} />
                                </TableHead>

                                <TableBody>
                                    {databases !== undefined &&
                                        !error &&
                                        !isValidating &&
                                        length > 0 &&
                                        databases.items.map(database => (
                                            <tr key={database.id} css={tw`h-10 hover:bg-zinc-900`}>
                                                <td css={tw`pl-6`}>{database.name}</td>

                                                <td css={tw`pl-6`}>{database.username}</td>

                                                <td css={tw`pl-6`}>
                                                    {database.remote === '%' ? '% (Anywhere)' : database.remote}
                                                </td>

                                                <td css={tw`pl-6`}>
                                                    <NavLink
                                                        to={`/admin/databases/${database.relations.host?.id}`}
                                                        css={tw`text-primary-400 hover:text-primary-300`}
                                                    >
                                                        {database.relations.host?.name}
                                                    </NavLink>
                                                </td>
                                            </tr>
                                        ))}
                                </TableBody>
                            </table>

                            {databases === undefined || (error && isValidating) ? (
                                <Loading />
                            ) : length < 1 ? (
                                <NoItems />
                            ) : null}
                        </div>
                    </Pagination>
                </ContentWrapper>
            </AdminTable>
        </div>
    );
}

export default (props: Props) => {
    const hooks = useTableHooks<Filters>(props.filters);

    return (
        <ServerDatabasesContext.Provider value={hooks}>
            <ServerDatabasesTable {...props} />
        </ServerDatabasesContext.Provider>
    );
};
