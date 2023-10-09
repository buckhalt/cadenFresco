import { trpc } from '~/app/_trpc/server';
import AnonymousRecruitmentSwitch from './AnonymousRecruitmentSwitch';

const AnonymousRecruitment = async () => {
  const { allowAnonymousRecruitment } =
    await trpc.metadata.get.allSetupMetadata.query();

  return <AnonymousRecruitmentSwitch initialData={allowAnonymousRecruitment} />;
};

export default AnonymousRecruitment;
