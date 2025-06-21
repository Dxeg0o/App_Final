import { redirect } from 'next/navigation';
import DashboardClient from '@/components/DashboardClient';
import { auth0 } from '@/lib/auth0';

export default async function DashboardPage() {
  const session = await auth0.getSession();
  if (!session) {
    return redirect('/auth/login?returnTo=/dashboard');
  }
  return <DashboardClient />;
}
