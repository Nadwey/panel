import { PropsWithChildren, useState } from 'react';
import { Link, NavLink, NavLinkProps } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import tw, { theme } from 'twin.macro';
import styled from 'styled-components';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Avatar from '@/components/Avatar';
import { IconLogout, IconStack2, IconTool, IconUser } from '@tabler/icons-react';

const RightNavigation = styled.div`
    & .navigation-link {
        ${tw`flex flex-row gap-x-2 justify-start font-medium w-full border-l-2 border-l-transparent no-underline text-neutral-100 px-6 py-2 cursor-pointer transition-all duration-150`};
    }

    & .navigation-link-active {
        ${tw`text-sky-400 border-l-sky-400`};
    }
`;

function NavbarLink({ children, ...props }: NavLinkProps) {
    return (
        <NavLink
            className={({ isActive }) => (isActive ? 'navigation-link navigation-link-active' : 'navigation-link')}
            {...props}
        >
            {children}
        </NavLink>
    );
}

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
        <div className="overflow-x-auto bg-zinc-950 border-r border-r-zinc-900 shadow-md shrink-0">
            <SpinnerOverlay visible={isLoggingOut} />
            <RightNavigation className="h-full flex flex-col pb-4">
                <div>
                    <Link
                        to="/"
                        className="py-4 px-10 block font-inter font-bold text-3xl text-neutral-200 no-underline transition-colors duration-150 hover:text-neutral-100"
                    >
                        {name}
                    </Link>
                </div>
                <div className="flex flex-col flex-1 justify-between">
                    {/* <SearchContainer /> */}
                    <NavbarLink to="/" end>
                        <IconStack2 className="inline-block" /> Servers
                    </NavbarLink>

                    <div className="flex flex-col gap-y-3">
                        {rootAdmin && (
                            <NavbarLink to="/admin" rel="noreferrer">
                                <IconTool className="inline-block" /> Admin
                            </NavbarLink>
                        )}

                        <NavbarLink to="/account">
                            <span className='flex h-6 w-6 items-center'>
                            <Avatar.User />
                            </span>
                             You
                        </NavbarLink>

                        <button className="navigation-link" onClick={onTriggerLogout}>
                            <IconLogout className="inline-block" />
                            Sign out
                        </button>
                    </div>
                </div>
            </RightNavigation>
        </div>
    );
};
