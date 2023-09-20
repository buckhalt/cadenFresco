'use client';

import { Loader2 } from 'lucide-react';
import { trpc } from '~/app/_trpc/client';
import { Button } from '~/components/ui/Button';
import { useSession } from '~/contexts/SessionPrivider';

const UserMenu = () => {
  const { session, isLoading } = useSession();

  const utils = trpc.useContext();

  const { mutate: doSignout, isLoading: isSigningOut } =
    trpc.session.signOut.useMutation({
      onSuccess: async () => {
        await utils.session.get.refetch();
        window.location.reload();
      },
    });

  return (
    <div className="flex flex-row items-center gap-6">
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {session && <span>{session?.user.username}</span>}
      <Button
        onClick={() => void doSignout()}
        disabled={isLoading || isSigningOut}
      >
        {isSigningOut && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Sign out
      </Button>
    </div>
  );
};

export default UserMenu;
