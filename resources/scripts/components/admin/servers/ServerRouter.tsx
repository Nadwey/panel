import { useEffect } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import tw from 'twin.macro';

import ServerManageContainer from '@/components/admin/servers/ServerManageContainer';
import ServerStartupContainer from '@/components/admin/servers/ServerStartupContainer';
import AdminContentBlock from '@/components/admin/AdminContentBlock';
import Spinner from '@/components/elements/Spinner';
import FlashMessageRender from '@/components/FlashMessageRender';
import { SubNavigation, SubNavigationLink } from '@/components/admin/SubNavigation';
import ServerSettingsContainer from '@/components/admin/servers/ServerSettingsContainer';
import useFlash from '@/plugins/useFlash';
import { useServerFromRoute } from '@/api/admin/server';
import { IconAdjustments, IconFolder, IconSettings, IconShieldExclamation, IconStack2 } from '@tabler/icons-react';
import ServerDatabasesContainer from './ServerDatabasesContainer';

export default () => {
    const params = useParams<'id'>();

    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { data: server, error, isValidating, mutate } = useServerFromRoute();

    useEffect(() => {
        mutate();
    }, []);

    useEffect(() => {
        if (!error) clearFlashes('server');
        if (error) clearAndAddHttpError({ key: 'server', error });
    }, [error]);

    if (!server || (error && isValidating)) {
        return (
            <AdminContentBlock showFlashKey={'server'}>
                <Spinner size={'large'} centered />
            </AdminContentBlock>
        );
    }

    return (
        <AdminContentBlock title={'Server - ' + server.name}>
            <FlashMessageRender byKey={'backups'} css={tw`mb-4`} />
            <div css={tw`w-full flex flex-row items-center mb-4`}>
                <div css={tw`flex flex-col flex-shrink`} style={{ minWidth: '0' }}>
                    <h2 css={tw`text-2xl text-zinc-50 font-header font-medium`}>{server.name}</h2>
                    <p css={tw`text-base text-zinc-400 whitespace-nowrap overflow-ellipsis overflow-hidden`}>
                        {server.uuid}
                    </p>
                </div>
            </div>

            <FlashMessageRender byKey={'server'} css={tw`mb-4`} />

            <SubNavigation>
                <SubNavigationLink to={`/admin/servers/${params.id}`} name={'Settings'} icon={<IconSettings />} />
                <SubNavigationLink
                    to={`/admin/servers/${params.id}/startup`}
                    name={'Startup'}
                    icon={<IconAdjustments />}
                />
                <SubNavigationLink
                    to={`/admin/servers/${params.id}/databases`}
                    name={'Databases'}
                    icon={<IconStack2 />}
                />
                <SubNavigationLink to={`/admin/servers/${params.id}/mounts`} name={'Mounts'} icon={<IconFolder />} />
                <SubNavigationLink
                    to={`/admin/servers/${params.id}/manage`}
                    name={'Manage'}
                    icon={<IconShieldExclamation />}
                />
            </SubNavigation>

            <Routes>
                <Route path="" element={<ServerSettingsContainer />} />
                <Route path="startup" element={<ServerStartupContainer />} />
                <Route path="databases" element={<ServerDatabasesContainer />} />
                <Route path="manage" element={<ServerManageContainer />} />
            </Routes>
        </AdminContentBlock>
    );
};
