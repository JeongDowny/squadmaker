import { AppNavigation } from "@/features/navigation/components/app-navigation";
import { MockDataSeeder } from "@/features/persistence/components/mock-data-seeder";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MockDataSeeder />
      <AppNavigation />
      {children}
    </>
  );
}
