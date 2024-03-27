import { useContext, useEffect } from 'react';
import { CheckIcon, ExclamationTriangleIcon, InformationCircleIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { DialogContext, DialogIconProps, styles } from './';

const icons = {
    danger: ShieldExclamationIcon,
    warning: ExclamationTriangleIcon,
    success: CheckIcon,
    info: InformationCircleIcon,
};

export default ({ type, position, className }: DialogIconProps) => {
    const { setIcon, setIconPosition } = useContext(DialogContext);

    useEffect(() => {
        const Icon = icons[type];

        setIcon(
            <div className={classNames(styles.dialog_icon, styles[type], className)}>
                <Icon className={'h-6 w-6'} />
            </div>,
        );
    }, [type, className]);

    useEffect(() => {
        setIconPosition(position);
    }, [position]);

    return null;
};
