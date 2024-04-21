import { Schedule } from '@/api/server/schedules/getServerSchedules';
import { useState } from 'react';
import Button from '@/components/elements/Button';
import EditScheduleModal from './EditScheduleModal';
import { IconPencil } from '@tabler/icons-react';

interface Props {
    schedule?: Schedule;
}

export default ({ schedule }: Props) => {
    const [visible, setVisible] = useState(false);

    return (
        <>
            <EditScheduleModal schedule={schedule} visible={visible} onModalDismissed={() => setVisible(false)} />
            <Button
                isSecondary
                color={'red'}
                onClick={e => {
                    e.preventDefault();
                    setVisible(true);
                }}
            >
                <IconPencil height={'1rem'} />
            </Button>
        </>
    );
};
