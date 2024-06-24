import SmallScreenOverlay from '~/app/(interview)/interview/_components/SmallScreenOverlay';
import '~/styles/interview.scss';

export const metadata = {
  title: 'Network Canvas Fresco - Interview',
  description: 'Interview',
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden overscroll-none bg-[--nc-background] text-[--nc-text]">
      <SmallScreenOverlay />
      {children}
    </main>
  );
}

export default RootLayout;
