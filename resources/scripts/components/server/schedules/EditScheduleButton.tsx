import { Schedule } from '@/api/server/schedules/getServerSchedules';
import { useState } from 'react';
import EditScheduleModal from './EditScheduleModal';
import { IconPencil } from '@tabler/icons-react';
import { Button } from '@/components/elements/button';
import { Variant } from '@/components/elements/button/types';

interface Props {
    schedule?: Schedule;
}

export default ({ schedule }: Props) => {
    const [visible, setVisible] = useState(false);

    return (
        <>
            <EditScheduleModal schedule={schedule} visible={visible} onModalDismissed={() => setVisible(false)} />
            <Button.Danger
                variant={Variant.Secondary}
                onClick={e => {
                    e.preventDefault();
                    setVisible(true);
                }}
            >
                <IconPencil height={'1rem'} />
            </Button.Danger>
        </>
    );
};
