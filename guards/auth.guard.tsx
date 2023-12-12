import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
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

  const [userProfile, setUserProfile] = useState<any>({})

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      if (!authPaths.includes(router.pathname)) {
        router.push('/login');
      }
    } else {
      getUserProfile();
    }

  }, [status]);

  useEffect(() => {
    if (Object.keys(userProfile).length == 0) return;

    const requiredFields: any = {
      name: null,
      dateOfBirth: null,
      age: null,
      email: null,
      religion: null,
      nationality: null,
      sex: null,
      bloodType: null,
      address: null,
      contactNumber: null,
    }

    // Populate required fields from data
    for (const key in requiredFields) {
      if (Object.hasOwn(userProfile, key)) {
        requiredFields[key] = userProfile[key]
      }
    }

    const emptyFields = Object.keys(requiredFields).filter((key: any) => !requiredFields[key]);

    if (emptyFields.length > 0) {
      router.push('/profile');
    } else {
      if (session.user.role == 'patient' && !patientRoutes.includes(router.pathname)) {
        router.push('/');
      }

      if (session.user.role == 'dentist' && !dentistRoutes.includes(router.pathname)) {
        router.push('/');
      }
    }
  }, [userProfile])

  const getUserProfile = async () => {
    const response = await fetch(`/api/global/user/${session.user?.id}`);
    const responseJson = await response.json();
    setUserProfile(responseJson);
  }

  return { session, status };
}