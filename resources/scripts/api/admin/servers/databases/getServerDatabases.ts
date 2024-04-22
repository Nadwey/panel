import { useContext } from 'react';
import useSWR from 'swr';
import { createContext } from '@/api/admin';
import http, { FractalResponseData, getPaginationSet, PaginatedResult } from '@/api/http';
import { Database, rawDataToDatabase } from '../../databases/getDatabases';

export interface ServerDatabase {
    id: number;
    databaseHostId: number;
    serverId: number;
    name: string;
    username: string;
    password: string;
    remote: string;
    maxConnections: number;
    createdAt: Date;
    updatedAt: Date;

    relations: {
        host?: Database;
    };
}

export const rawDataToServerDatabase = ({ attributes }: FractalResponseData): ServerDatabase =>
    ({
        id: attributes.id,
        databaseHostId: attributes.database_host_id,
        serverId: attributes.server_id,
        name: attributes.name,
        username: attributes.username,
        // @ts-expect-error todo
        password: attributes.relationships?.password?.attributes?.password,
        remote: attributes.remote,
        maxConnections: attributes.max_connections,
        createdAt: new Date(attributes.created_at),
        updatedAt: new Date(attributes.updated_at),

        relations: {
            host:
                attributes.relationships?.host && attributes.relationships?.host.object !== 'null_resource'
                    ? rawDataToDatabase(attributes.relationships.host as FractalResponseData)
                    : undefined,
        },
    }) as ServerDatabase;

export interface Filters {
    id?: string;
    database?: string;
    username?: string;
}

export const Context = createContext<Filters>();

export default (serverId: number, include: string[] = []) => {
    const { page, filters, sort, sortDirection } = useContext(Context);

    const params = {};
    if (filters !== null) {
        Object.keys(filters).forEach(key => {
            // @ts-expect-error todo
            params['filter[' + key + ']'] = filters[key];
        });
    }

    if (sort !== null) {
        // @ts-expect-error todo
        params.sort = (sortDirection ? '-' : '') + sort;
    }

    return useSWR<PaginatedResult<ServerDatabase>>(
        ['serverDatabases', page, filters, sort, sortDirection],
        async () => {
            const { data } = await http.get(`/api/application/servers/${serverId}/databases`, {
                params: { include: include.join(','), page, ...params },
            });

            return {
                items: (data.data || []).map(rawDataToServerDatabase),
                pagination: getPaginationSet(data.meta.pagination),
            };
        },
    );
};
