import { Schedule } from '@/api/server/schedules/getServerSchedules';
import { format } from 'date-fns';
import Can from '@/components/elements/Can';
import tw from 'twin.macro';
import ScheduleCronRow from '@/components/server/schedules/ScheduleCronRow';
import DeleteScheduleButton from './DeleteScheduleButton';
import EditScheduleModal from './EditScheduleModal';
import { useState } from 'react';
import EditScheduleButton from './EditScheduleButton';
import RunScheduleButton from './RunScheduleButton';
import { IconCalendar } from '@tabler/icons-react';

export default ({ schedule }: { schedule: Schedule }) => {
    const [visible, setVisible] = useState(false);

    return (
        <>
            <EditScheduleModal schedule={schedule} visible={visible} onModalDismissed={() => setVisible(false)} />
            <div css={tw`hidden md:block`}>
                <IconCalendar />
            </div>
            <div css={tw`flex-1 md:ml-4`}>
                <p>{schedule.name}</p>
                <p css={tw`text-xs text-zinc-400`}>
                    Last run at: {schedule.lastRunAt ? format(schedule.lastRunAt, "MMM do 'at' h:mma") : 'never'}
                </p>
            </div>
            <div>
                <p
                    css={[
                        tw`py-1 px-3 rounded text-xs uppercase text-white sm:hidden`,
                        schedule.isActive ? tw`bg-green-600` : tw`bg-zinc-400`,
                    ]}
                >
                    {schedule.isActive ? 'Active' : 'Inactive'}
                </p>
            </div>
            <ScheduleCronRow cron={schedule.cron} css={tw`mx-auto sm:mx-8 w-full sm:w-auto mt-4 sm:mt-0`} />
            <div>
                <p
                    css={[
                        tw`py-1 px-3 rounded text-xs uppercase text-white hidden sm:block`,
                        schedule.isActive && !schedule.isProcessing ? tw`bg-green-600` : tw`bg-zinc-400`,
                    ]}
                >
                    {schedule.isProcessing ? 'Processing' : schedule.isActive ? 'Active' : 'Inactive'}
                </p>
            </div>
            <div css={tw`ml-8 space-x-2`}>
                <Can action={'schedule.update'}>
                    <EditScheduleButton schedule={schedule} />
                </Can>
                <Can action={'schedule.execute'}>
                    <RunScheduleButton schedule={schedule} />
                </Can>
                <Can action={'schedule.delete'}>
                    <DeleteScheduleButton scheduleId={schedule.id} />
                </Can>
            </div>
        </>
    );
};
