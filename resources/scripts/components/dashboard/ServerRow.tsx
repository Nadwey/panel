import { useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Server } from '@/api/server/getServer';
import getServerResourceUsage, { ServerPowerState, ServerStats } from '@/api/server/getServerResourceUsage';
import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import tw from 'twin.macro';
import GreyRowBox from '@/components/elements/GreyRowBox';
import Spinner from '@/components/elements/Spinner';
import styled from 'styled-components';

// Determines if the current value is in an alarm threshold so we can show it in red rather
// than the more faded default style.
const isAlarmState = (current: number, limit: number): boolean => limit > 0 && current / (limit * 1024 * 1024) >= 0.9;

function StatusText({ name, status, alarm }: { name: string; status: string; alarm: boolean }) {
    return (
        <div css={tw`flex flex-row gap-1`}>
            <span className={`font-bold ${alarm ? 'text-red-500' : 'text-zinc-500'}`}>{name}</span>
            <span className={`font-bold ${alarm ? 'text-red-500' : 'text-zinc-200'}`}>{status}</span>
        </div>
    );
}

const StatusIndicatorBox = styled(GreyRowBox)<{ $status: ServerPowerState | undefined }>`
    ${tw`flex flex-row justify-between relative`};

    ${({ $status }) =>
        !$status || $status === 'offline'
            ? tw`bg-gradient-to-l from-[#220000] to-zinc-950`
            : $status === 'running'
              ? tw`bg-gradient-to-l from-[#183500] to-zinc-950`
              : tw`bg-gradient-to-l from-[#292500] to-zinc-950`};

    & .status-bar-shadow {
        ${tw`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75`};

        ${({ $status }) =>
            !$status || $status === 'offline'
                ? tw`bg-red-500`
                : $status === 'running'
                  ? tw`bg-green-500`
                  : tw`bg-yellow-500`};
    }

    & .status-bar-indicator {
        ${tw`relative inline-flex rounded-full h-3 w-3`}
        ${({ $status }) =>
            !$status || $status === 'offline'
                ? tw`bg-red-500`
                : $status === 'running'
                  ? tw`bg-green-500`
                  : tw`bg-yellow-500`};
    }
`;

type Timer = ReturnType<typeof setInterval>;

export default ({ server, className }: { server: Server; className?: string }) => {
    const interval = useRef<Timer>(null) as React.MutableRefObject<Timer>;
    const [isSuspended, setIsSuspended] = useState(server.status === 'suspended');
    const [stats, setStats] = useState<ServerStats | null>(null);

    const getStats = () =>
        getServerResourceUsage(server.uuid)
            .then(data => setStats(data))
            .catch(error => console.error(error));

    useEffect(() => {
        setIsSuspended(stats?.isSuspended || server.status === 'suspended');
    }, [stats?.isSuspended, server.status]);

    useEffect(() => {
        // Don't waste a HTTP request if there is nothing important to show to the user because
        // the server is suspended.
        if (isSuspended) return;

        getStats().then(() => {
            interval.current = setInterval(() => getStats(), 30000);
        });

        return () => {
            interval.current && clearInterval(interval.current);
        };
    }, [isSuspended]);

    const alarms = { cpu: false, memory: false, disk: false };
    if (stats) {
        alarms.cpu = server.limits.cpu === 0 ? false : stats.cpuUsagePercent >= server.limits.cpu * 0.9;
        alarms.memory = isAlarmState(stats.memoryUsageInBytes, server.limits.memory);
        alarms.disk = server.limits.disk === 0 ? false : isAlarmState(stats.diskUsageInBytes, server.limits.disk);
    }

    return (
        <StatusIndicatorBox as={Link} to={`/server/${server.id}`} className={className} $status={stats?.status}>
            <div css={tw`flex items-center`}>
                <div>
                    <div css={tw`text-2xl font-extrabold flex gap-x-3 items-center`}>
                        <span>{server.name}</span>
                        <span css={tw`relative flex h-3 w-3`}>
                            <span className="status-bar-shadow"></span>
                            <span className="status-bar-indicator"></span>
                        </span>
                    </div>

                    <p css={tw`text-sm text-zinc-400`}>
                        {server.allocations
                            .filter(alloc => alloc.isDefault)
                            .map(allocation => (
                                <React.Fragment key={allocation.ip + allocation.port.toString()}>
                                    {allocation.alias || ip(allocation.ip)}:{allocation.port}
                                </React.Fragment>
                            ))}
                    </p>
                </div>
            </div>
            <div
                css={tw`sm:flex gap-4 items-baseline justify-center p-3 sm:block bg-zinc-900 hidden rounded-lg shadow shadow-zinc-950`}
            >
                {!stats || isSuspended ? (
                    isSuspended ? (
                        <div css={tw`flex-1 text-center`}>
                            <span css={tw`text-red-500`}>
                                {server.status === 'suspended' ? 'Suspended' : 'Connection Error'}
                            </span>
                        </div>
                    ) : server.isTransferring || server.status ? (
                        <div css={tw`flex-1 text-center`}>
                            <span css={tw`text-zinc-100`}>
                                {server.isTransferring
                                    ? 'Transferring'
                                    : server.status === 'installing'
                                      ? 'Installing'
                                      : server.status === 'restoring_backup'
                                        ? 'Restoring Backup'
                                        : 'Unavailable'}
                            </span>
                        </div>
                    ) : (
                        <Spinner size={'small'} />
                    )
                ) : (
                    <>
                        <div css={tw`flex justify-center`}>
                            <StatusText
                                name="CPU"
                                status={`${Math.round(stats.cpuUsagePercent)}%`}
                                alarm={alarms.cpu}
                            />
                        </div>
                        <div css={tw`flex justify-center`}>
                            <StatusText
                                name="RAM"
                                status={bytesToString(stats.memoryUsageInBytes)}
                                alarm={alarms.memory}
                            />
                        </div>
                        <div css={tw`flex justify-center`}>
                            <StatusText
                                name="Storage"
                                status={bytesToString(stats.diskUsageInBytes, 1)}
                                alarm={alarms.disk}
                            />
                        </div>
                    </>
                )}
            </div>
        </StatusIndicatorBox>
    );
};
