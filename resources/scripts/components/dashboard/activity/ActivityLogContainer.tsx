import { useEffect, useState } from 'react';
import { ActivityLogFilters, useActivityLogs } from '@/api/account/activity';
import { useFlashKey } from '@/plugins/useFlash';
import PageContentBlock from '@/components/elements/PageContentBlock';
import FlashMessageRender from '@/components/FlashMessageRender';
import { Link } from 'react-router-dom';
import PaginationFooter from '@/components/elements/table/PaginationFooter';
import Spinner from '@/components/elements/Spinner';
import { styles as btnStyles } from '@/components/elements/button/index';
import classNames from 'classnames';
import ActivityLogEntry from '@/components/elements/activity/ActivityLogEntry';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import useLocationHash from '@/plugins/useLocationHash';
import { IconCircleX, IconDeviceDesktop } from '@tabler/icons-react';

export default () => {
    const { hash } = useLocationHash();
    const { clearAndAddHttpError } = useFlashKey('account');
    const [filters, setFilters] = useState<ActivityLogFilters>({ page: 1, sorts: { timestamp: -1 } });
    const { data, isValidating, error } = useActivityLogs(filters, {
        revalidateOnMount: true,
        revalidateOnFocus: false,
    });

    useEffect(() => {
        setFilters(value => ({ ...value, filters: { ip: hash.ip, event: hash.event } }));
    }, [hash]);

    useEffect(() => {
        clearAndAddHttpError(error);
    }, [error]);

    return (
        <PageContentBlock title={'Account Activity Log'}>
            <FlashMessageRender byKey={'account'} />
            {(filters.filters?.event || filters.filters?.ip) && (
                <div className={'mb-2 flex justify-end'}>
                    <Link
                        to={'#'}
                        className={classNames(btnStyles.button, btnStyles.text, 'w-full sm:w-auto')}
                        onClick={() => setFilters(value => ({ ...value, filters: {} }))}
                    >
                        Clear Filters <IconCircleX className={'ml-2 h-4 w-4'} />
                    </Link>
                </div>
            )}
            {!data && isValidating ? (
                <Spinner centered />
            ) : (
                <div>
                    {data?.items.map(activity => (
                        <ActivityLogEntry key={activity.id} activity={activity}>
                            {typeof activity.properties.useragent === 'string' && (
                                <Tooltip content={activity.properties.useragent} placement={'top'}>
                                    <span>
                                        <IconDeviceDesktop />
                                    </span>
                                </Tooltip>
                            )}
                        </ActivityLogEntry>
                    ))}
                </div>
            )}
            {data && (
                <PaginationFooter
                    pagination={data.pagination}
                    onPageSelect={page => setFilters(value => ({ ...value, page }))}
                />
            )}
        </PageContentBlock>
    );
};
