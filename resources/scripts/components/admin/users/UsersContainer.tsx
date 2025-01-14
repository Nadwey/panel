import { Fragment, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { useGetUsers } from '@/api/admin/users';
import type { UUID } from '@/api/definitions';
import { Transition } from '@/components/elements/transitions';
import { Button } from '@/components/elements/button';
import Checkbox from '@/components/elements/inputs/Checkbox';
import InputField from '@/components/elements/inputs/InputField';
import UserTableRow from '@/components/admin/users/UserTableRow';
import TFootPaginated from '@/components/elements/table/TFootPaginated';
import type { User } from '@definitions/admin';
import extractSearchFilters from '@/helpers/extractSearchFilters';
import useDebouncedState from '@/plugins/useDebouncedState';
import { Shape } from '@/components/elements/button/types';
import { IconLifebuoy, IconLockOpen, IconPlus, IconTrash } from '@tabler/icons-react';

const filters = ['id', 'uuid', 'external_id', 'username', 'email'] as const;

function UsersContainer() {
    const [search, setSearch] = useDebouncedState('', 500);
    const [selected, setSelected] = useState<UUID[]>([]);
    const { data: users } = useGetUsers(
        extractSearchFilters(search, filters, {
            splitUnmatched: true,
            returnUnmatched: true,
        }),
    );

    useEffect(() => {
        document.title = 'Admin | Users';
    }, []);

    const onRowChange = (user: User, checked: boolean) => {
        setSelected(state => {
            return checked ? [...state, user.uuid] : selected.filter(uuid => uuid !== user.uuid);
        });
    };

    const selectAllChecked = users && users.items.length > 0 && selected.length > 0;
    const onSelectAll = () =>
        setSelected(state => (state.length > 0 ? [] : users?.items.map(({ uuid }) => uuid) || []));

    return (
        <div>
            <div className="mb-4 flex justify-end">
                <NavLink to="/admin/users/new">
                    <Button className="shadow focus:ring-offset-2 focus:ring-offset-zinc-800">
                        Add User <IconPlus className="ml-2 h-5 w-5" />
                    </Button>
                </NavLink>
            </div>

            <div className="relative flex items-center bg-zinc-900/50 border-b border-zinc-900 rounded-t px-4 py-3">
                <div className="mr-6">
                    <Checkbox
                        checked={selectAllChecked}
                        disabled={!users?.items.length}
                        indeterminate={selected.length !== users?.items.length}
                        onChange={onSelectAll}
                    />
                </div>
                <div className="flex-1">
                    <InputField
                        type="text"
                        name="filter"
                        placeholder="Begin typing to filter..."
                        className="w-56 focus:w-96"
                        onChange={e => setSearch(e.currentTarget.value)}
                    />
                </div>
                <Transition.Fade as={Fragment} show={selected.length > 0} duration="duration-75">
                    <div className="absolute top-0 left-0 flex h-full w-full items-center justify-end space-x-4 rounded-t 0 px-4">
                        <div className="flex-1">
                            <Checkbox
                                checked={selectAllChecked}
                                indeterminate={selected.length !== users?.items.length}
                                onChange={onSelectAll}
                            />
                        </div>
                        <Button.Text shape={Shape.IconSquare}>
                            <IconLifebuoy className="h-4 w-4" />
                        </Button.Text>
                        <Button.Text shape={Shape.IconSquare}>
                            <IconLockOpen className="h-4 w-4" />
                        </Button.Text>
                        <Button.Text shape={Shape.IconSquare}>
                            <IconTrash className="h-4 w-4" />
                        </Button.Text>
                    </div>
                </Transition.Fade>
            </div>
            <table className="min-w-full rounded bg-zinc-900/50">
                <thead className="border-b border-zinc-900">
                    <tr>
                        <th scope="col" className="w-8" />
                        <th scope="col" className="w-full px-6 py-2 text-left">
                            Email
                        </th>
                        <th scope="col" />
                        <th scope="col" />
                    </tr>
                </thead>
                <tbody>
                    {users?.items.map(user => (
                        <UserTableRow
                            key={user.uuid}
                            user={user}
                            selected={selected.includes(user.uuid)}
                            onRowChange={onRowChange}
                        />
                    ))}
                </tbody>
                {users ? <TFootPaginated span={4} pagination={users.pagination} /> : null}
            </table>
        </div>
    );
}

export default UsersContainer;
