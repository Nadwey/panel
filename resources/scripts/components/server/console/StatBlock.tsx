import classNames from 'classnames';
import type { ReactNode } from 'react';
import { useFitText } from '@flyyer/use-fit-text';

import CopyOnClick from '@/components/elements/CopyOnClick';

import styles from './style.module.css';

interface StatBlockProps {
    title: string;
    copyOnClick?: string;
    color?: string | undefined;
    icon: React.FC<any>;
    children: ReactNode;
    className?: string;
}

function StatBlock({ title, copyOnClick, icon: Icon, color, className, children }: StatBlockProps) {
    const { fontSize, ref } = useFitText({ minFontSize: 8, maxFontSize: 500 });

    return (
        <CopyOnClick text={copyOnClick}>
            <div className={classNames(styles.stat_block, 'bg-zinc-900/50 border border-zinc-900', className)}>
                <div className={classNames(styles.status_bar, color || 'bg-zinc-700')} />
                <div className={classNames(styles.icon)}>
                    <Icon className={color} />
                </div>
                <div className={'flex w-full flex-col justify-center overflow-hidden'}>
                    <p className={'font-header text-xs leading-tight text-zinc-200 md:text-sm'}>{title}</p>
                    <div
                        ref={ref}
                        className={'h-[1.75rem] w-full truncate font-semibold text-zinc-50'}
                        style={{ fontSize }}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </CopyOnClick>
    );
}

export default StatBlock;
