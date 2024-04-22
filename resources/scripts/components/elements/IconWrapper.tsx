import { Icon, IconProps } from '@tabler/icons-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

export default function ({
    icon: Icon,
    ...props
}: {
    icon: ForwardRefExoticComponent<Omit<IconProps, 'ref'> & RefAttributes<Icon>>;
}) {
    if (Icon) return <Icon {...props} />;
    return null;
}
