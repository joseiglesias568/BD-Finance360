import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionToken } from '@/lib/auth';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get('session')?.value;
  if (!token || !(await verifySessionToken(token))) {
    redirect('/login');
  }
  return <>{children}</>;
}
