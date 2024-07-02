import { ChevronDown, ChevronUp } from 'lucide-react';
import { useSelector } from 'react-redux';
import ProgressBar from '~/lib/ui/components/ProgressBar';
import { cn } from '~/utils/shadcn';
import { getNavigationInfo } from '../selectors/session';

const NavigationButton = ({
  disabled,
  onClick,
  className,
  ariaLabel,
  children,
}: {
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  ariaLabel?: string;
  children: React.ReactNode;
}) => {
  return (
    <button
      className={cn(
        `session-navigation__button m-4 flex h-[4.8rem] w-[4.8rem] basis-[4.8rem] cursor-pointer items-center justify-center rounded-full transition-all`,
        'hover:bg-[#4a4677]',
        disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent',
        'focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        className,
      )}
      tabIndex={disabled ? -1 : 0}
      onClick={!disabled ? onClick : undefined}
      aria-label={ariaLabel}
    >
      {children}
    </button>
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
      className="flex flex-shrink-0 flex-grow-0 flex-col items-center justify-between bg-[#36315f] [--nc-light-background:#4a4677]"
    >
      <NavigationButton
        onClick={moveBackward}
        disabled={disabled || !canMoveBackward}
        ariaLabel="Move backward"
      >
        <ChevronUp className="h-[2.4rem] w-[2.4rem]" strokeWidth="3px" />
      </NavigationButton>
      <div className="m-6 flex flex-grow">
        <ProgressBar percentProgress={progress} />
      </div>
      <NavigationButton
        className={cn(
          'bg-[var(--nc-light-background)]',
          'hover:bg-[var(--nc-primary)]',
          pulseNext && 'animate-pulse bg-success',
        )}
        onClick={moveForward}
        disabled={disabled || !canMoveForward}
        ariaLabel="Move forward"
      >
        <ChevronDown className="h-[2.4rem] w-[2.4rem]" strokeWidth="3px" />
      </NavigationButton>
    </div>
  );
};

export default Navigation;
