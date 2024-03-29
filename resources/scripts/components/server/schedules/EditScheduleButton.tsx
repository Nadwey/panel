import { Schedule } from '@/api/server/schedules/getServerSchedules';
import { useState } from 'react';
import Button from '@/components/elements/Button';
import { PencilIcon } from '@heroicons/react/24/solid';
import EditScheduleModal from './EditScheduleModal';

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
                <PencilIcon height={'1rem'} />
            </Button>
        </>
    );
};
