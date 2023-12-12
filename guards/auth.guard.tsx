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

  const patientRoutes = [
    '/',
    '/profile',
    '/book',
  ]

  const dentistRoutes = [
    '/',
    '/profile',
    '/confirmation',
    '/reschedule',
    '/services'
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
      } else {
        if (session.user.role == 'patient' && !patientRoutes.includes(router.pathname)) {
          router.push('/');
        }

        if (session.user.role == 'dentist' && !dentistRoutes.includes(router.pathname)) {
          router.push('/');
        }
      }
    }

  }, [status]);

  return { session, status };
}