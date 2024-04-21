import { Menu } from '@headlessui/react';
import classNames from 'classnames';
import type { ReactNode } from 'react';

import styles from './style.module.css';
import { IconChevronDown } from '@tabler/icons-react';

interface Props {
    className?: string;
    animate?: boolean;
    children: ReactNode;
}

function DropdownButton({ className, animate = true, children }: Props) {
    return (
        <Menu.Button className={classNames(styles.button, className ?? 'px-4')}>
            {typeof children === 'string' ? (
                <>
                    <span className="mr-2">{children}</span>
                    <IconChevronDown aria-hidden="true" data-animated={animate.toString()} />
                </>
            ) : (
                children
            )}
        </Menu.Button>
    );
}

export { DropdownButton };
