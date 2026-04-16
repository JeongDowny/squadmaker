import { AppNavigation } from "@/features/navigation/components/app-navigation";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppNavigation />
      {children}
    </>
  );
}
