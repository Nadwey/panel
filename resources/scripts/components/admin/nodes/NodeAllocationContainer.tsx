import { useParams } from 'react-router-dom';
import tw from 'twin.macro';

import AdminBox from '@/components/admin/AdminBox';
import AllocationTable from '@/components/admin/nodes/allocations/AllocationTable';
import CreateAllocationForm from '@/components/admin/nodes/allocations/CreateAllocationForm';
import { IconCloudNetwork } from '@tabler/icons-react';

export default () => {
    const params = useParams<'id'>();

    return (
        <>
            <div css={tw`w-full grid grid-cols-12 gap-x-8`}>
                <div css={tw`w-full flex col-span-8`}>
                    <AllocationTable nodeId={Number(params.id)} />
                </div>

                <div css={tw`w-full flex col-span-4`}>
                    <AdminBox icon={IconCloudNetwork} title={'Allocations'} css={tw`h-auto w-full`}>
                        <CreateAllocationForm nodeId={Number(params.id)} />
                    </AdminBox>
                </div>
            </div>
        </>
    );
};
