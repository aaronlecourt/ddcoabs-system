import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSession } from "next-auth/react"

export default function useAuthGuard() {
  const { data: session, status }: any = useSession();
  const router = useRouter();
  const authPaths = [
    '/login',
    '/register'
  ]

  const nonDentistRoutes = [
    '/book' 
  ]

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      console.log(router)
      if (!authPaths.includes(router.pathname)) {
        router.push('/login');
      }
    } else {
      // TODO: Check User if profile is completed, if not, redirect to /profile
      let profileCompleted = true;
      if (!profileCompleted) {
        router.push('/profile');
      }

      if (session.user.role == 'dentist' && nonDentistRoutes.includes(router.pathname)) {
        router.push('/');
      }
    }

  }, [status]);

  return { session, status };
}