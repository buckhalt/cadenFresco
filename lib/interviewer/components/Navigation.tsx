import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import ProgressBar from '~/lib/ui/components/ProgressBar';
import { cn } from '~/utils/shadcn';
import { getNavigationInfo } from '../selectors/session';

const NavigationButton = ({
  disabled,
  onClick,
  className,
  children,
}: {
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        `session-navigation__button m-4 flex h-[4.8rem] w-[4.8rem] basis-[4.8rem] cursor-pointer items-center justify-center rounded-full transition-all`,
        'hover:bg-[#4a4677]',
        disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent',
        className,
      )}
      role="button"
      tabIndex={0}
      onClick={!disabled ? onClick : undefined}
    >
      {children}
    </div>
  );
};

type NavigationProps = {
  moveBackward: () => void;
  moveForward: () => void;
  pulseNext: boolean;
  disabled: boolean;
  progress: number;
};

const Navigation = ({
  moveBackward,
  moveForward,
  pulseNext,
  disabled,
  progress,
}: NavigationProps) => {
  const { canMoveForward, canMoveBackward } = useSelector(getNavigationInfo);

  return (
    <div
      role="navigation"
      className={cn(
        'flex flex-shrink-0 flex-grow-0 items-center justify-between bg-[#36315f] [--nc-light-background:#4a4677]',
        'md:flex-col',
      )}
    >
      <NavigationButton
        onClick={moveBackward}
        disabled={disabled || !canMoveBackward}
      >
        <ChevronLeft
          className="h-[2.4rem] w-[2.4rem] md:rotate-90"
          strokeWidth="3px"
        />
      </NavigationButton>
      <div className="m-6 hidden flex-grow md:flex">
        <ProgressBar percentProgress={progress} />
      </div>
      <div className="m-6 flex flex-grow md:hidden">
        <ProgressBar percentProgress={progress} orientation="horizontal" />
      </div>
      <NavigationButton
        className={cn(
          'bg-[var(--nc-light-background)]',
          'hover:bg-[var(--nc-primary)]',
          pulseNext && 'animate-pulse bg-success',
        )}
        onClick={moveForward}
        disabled={disabled || !canMoveForward}
      >
        <ChevronRight
          className="h-[2.4rem] w-[2.4rem] md:rotate-90"
          strokeWidth="3px"
        />
      </NavigationButton>
    </div>
  );
};

export default Navigation;
