import { useCallback, useState } from 'react';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { Button } from '@/components/elements/button';
import triggerScheduleExecution from '@/api/server/schedules/triggerScheduleExecution';
import { ServerContext } from '@/state/server';
import useFlash from '@/plugins/useFlash';
import { Schedule } from '@/api/server/schedules/getServerSchedules';
import { IconPlayerPlay } from '@tabler/icons-react';

const RunScheduleButton = ({ schedule }: { schedule: Schedule }) => {
    const [loading, setLoading] = useState(false);
    const { clearFlashes, clearAndAddHttpError } = useFlash();

    const id = ServerContext.useStoreState(state => state.server.data!.id);
    const appendSchedule = ServerContext.useStoreActions(actions => actions.schedules.appendSchedule);

    const onTriggerExecute = useCallback(() => {
        clearFlashes('schedule');
        setLoading(true);
        triggerScheduleExecution(id, schedule.id)
            .then(() => {
                setLoading(false);
                appendSchedule({ ...schedule, isProcessing: true });
            })
            .catch(error => {
                console.error(error);
                clearAndAddHttpError({ error, key: 'schedules' });
            })
            .then(() => setLoading(false));
    }, []);

    return (
        <>
            <SpinnerOverlay visible={loading} size={'large'} />
            <Button
                color={'red'}
                disabled={schedule.isProcessing}
                onClick={e => {
                    e.preventDefault();
                    onTriggerExecute();
                }}
            >
                <IconPlayerPlay height="1rem" />
            </Button>
        </>
    );
};

export default RunScheduleButton;
