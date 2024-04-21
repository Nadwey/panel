import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import tw from 'twin.macro';
import styled from 'styled-components';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Avatar from '@/components/Avatar';
import { IconLogout, IconStack2, IconTool } from '@tabler/icons-react';

const RightNavigation = styled.div`
    & .navigation-link,
    & a {
        ${tw`flex flex-row gap-x-2 justify-start font-medium w-full border-l-2 border-l-transparent no-underline text-zinc-100 px-6 py-2 cursor-pointer transition-all duration-150`};
    }

    & .active {
        ${tw`text-sky-400 border-l-sky-400`};
    }
`;

export default () => {
    const name = useStoreState((state: ApplicationStore) => state.settings.data!.name);
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const onTriggerLogout = () => {
        setIsLoggingOut(true);

        http.post('/auth/logout').finally(() => {
            // @ts-expect-error this is valid
            window.location = '/';
        });
    };

    return (
        <div className="overflow-x-auto bg-zinc-950 border-r border-r-zinc-900 shadow-md shrink-0 h-dvh sticky left-0 top-0">
            <SpinnerOverlay visible={isLoggingOut} />
            <div className="flex flex-col pb-4 h-full">
                <div>
                    <Link
                        to="/"
                        className="py-4 px-10 block font-inter font-black text-3xl text-zinc-200 no-underline transition-colors duration-150 hover:text-zinc-100"
                    >
                        {name}
                    </Link>
                </div>
                <RightNavigation className="flex flex-col flex-1 justify-between">
                    <div>
                        <NavLink to="/" end>
                            <IconStack2 className="inline-block" /> Servers
                        </NavLink>
                    </div>

                    <div className="flex flex-col gap-y-3">
                        {rootAdmin && (
                            <NavLink to="/admin" rel="noreferrer">
                                <IconTool className="inline-block" /> Admin
                            </NavLink>
                        )}

                        <NavLink to="/account">
                            <span className="flex h-6 w-6 items-center">
                                <Avatar.User />
                            </span>
                            You
                        </NavLink>

                        <button className="navigation-link" onClick={onTriggerLogout}>
                            <IconLogout className="inline-block" />
                            Sign out
                        </button>
                    </div>
                </RightNavigation>
            </div>
        </div>
    );
};
