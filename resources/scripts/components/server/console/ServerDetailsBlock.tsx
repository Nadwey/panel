import classNames from 'classnames';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';

import { SocketEvent, SocketRequest } from '@/components/server/events';
import UptimeDuration from '@/components/server/UptimeDuration';
import StatBlock from '@/components/server/console/StatBlock';
import { bytesToString, mbToBytes } from '@/lib/formatters';
import { capitalize } from '@/lib/strings';
import { ServerContext } from '@/state/server';
import useWebsocketEvent from '@/plugins/useWebsocketEvent';
import { IconClock, IconCpu, IconDatabase, IconDeviceSdCard, IconDownload, IconUpload } from '@tabler/icons-react';

type Stats = Record<'memory' | 'cpu' | 'disk' | 'uptime' | 'rx' | 'tx', number>;

function getIconColor(value: number, max: number | null): string | undefined {
    const delta = !max ? 0 : value / max;

    if (delta > 0.8) {
        if (delta > 0.9) {
            return 'text-red-500';
        }
        return 'text-yellow-500';
    }

    return undefined;
}

function Limit({ limit, children }: { limit: string | null; children: ReactNode }) {
    return (
        <>
            {children}
            <span className={'ml-1 select-none text-[70%] text-zinc-400'}>/ {limit || <>&infin;</>}</span>
        </>
    );
}

function ServerDetailsBlock({ className }: { className?: string }) {
    const [stats, setStats] = useState<Stats>({ memory: 0, cpu: 0, disk: 0, uptime: 0, tx: 0, rx: 0 });

    const status = ServerContext.useStoreState(state => state.status.value);
    const connected = ServerContext.useStoreState(state => state.socket.connected);
    const instance = ServerContext.useStoreState(state => state.socket.instance);
    const limits = ServerContext.useStoreState(state => state.server.data!.limits);

    const textLimits = useMemo(
        () => ({
            cpu: limits?.cpu ? `${limits.cpu}%` : null,
            memory: limits?.memory ? bytesToString(mbToBytes(limits.memory)) : null,
            disk: limits?.disk ? bytesToString(mbToBytes(limits.disk)) : null,
        }),
        [limits],
    );

    useEffect(() => {
        if (!connected || !instance) {
            return;
        }

        instance.send(SocketRequest.SEND_STATS);
    }, [instance, connected]);

    useWebsocketEvent(SocketEvent.STATS, data => {
        let stats: any = {};
        try {
            stats = JSON.parse(data);
        } catch (e) {
            return;
        }

        setStats({
            memory: stats.memory_bytes,
            cpu: stats.cpu_absolute,
            disk: stats.disk_bytes,
            tx: stats.network.tx_bytes,
            rx: stats.network.rx_bytes,
            uptime: stats.uptime || 0,
        });
    });

    return (
        <div className={classNames('grid grid-cols-6 gap-2 md:gap-4', className)}>
            <StatBlock
                icon={IconClock}
                title={'Uptime'}
                color={getIconColor(status === 'running' ? 0 : status !== 'offline' ? 9 : 10, 10)}
            >
                {status === null ? (
                    'Offline'
                ) : stats.uptime > 0 ? (
                    <UptimeDuration uptime={stats.uptime / 1000} />
                ) : (
                    capitalize(status)
                )}
            </StatBlock>
            <StatBlock icon={IconCpu} title={'CPU Load'} color={getIconColor(stats.cpu, limits.cpu)}>
                {status === 'offline' ? (
                    <span className={'text-zinc-400'}>Offline</span>
                ) : (
                    <Limit limit={textLimits.cpu}>{stats.cpu.toFixed(2)}%</Limit>
                )}
            </StatBlock>
            <StatBlock
                icon={IconDatabase}
                title={'Memory'}
                color={getIconColor(stats.memory / 1024, limits.memory * 1024)}
            >
                {status === 'offline' ? (
                    <span className={'text-zinc-400'}>Offline</span>
                ) : (
                    <Limit limit={textLimits.memory}>{bytesToString(stats.memory)}</Limit>
                )}
            </StatBlock>
            <StatBlock
                icon={IconDeviceSdCard}
                title={'Disk'}
                color={getIconColor(stats.disk / 1024, limits.disk * 1024)}
            >
                <Limit limit={textLimits.disk}>{bytesToString(stats.disk)}</Limit>
            </StatBlock>
            <StatBlock icon={IconDownload} title={'Network (Inbound)'}>
                {status === 'offline' ? <span className={'text-zinc-400'}>Offline</span> : bytesToString(stats.rx)}
            </StatBlock>
            <StatBlock icon={IconUpload} title={'Network (Outbound)'}>
                {status === 'offline' ? <span className={'text-zinc-400'}>Offline</span> : bytesToString(stats.tx)}
            </StatBlock>
        </div>
    );
}

export default ServerDetailsBlock;
