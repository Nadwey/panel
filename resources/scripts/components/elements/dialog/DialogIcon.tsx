import { useContext, useEffect } from 'react';
import classNames from 'classnames';
import { DialogContext, DialogIconProps, styles } from './';
import { IconAlertTriangle, IconCheck, IconInfoCircle, IconShieldExclamation } from '@tabler/icons-react';

const icons = {
    danger: IconShieldExclamation,
    warning: IconAlertTriangle,
    success: IconCheck,
    info: IconInfoCircle,
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
