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
    '/appointments',
    '/book',
    '/reschedule/[id]',
  ]

  const dentistRoutes = [
    '/',
    '/profile',
    '/confirmation/[id]',
    '/reschedule/[id]',
    '/services',
    '/accounts',
    '/archives',
    '/appointments',
    '/emergency-booking'
  ]

  const [userProfile, setUserProfile] = useState<any>({})

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      if (!authPaths.includes(router.pathname)) {
        router.push('/home');
      }
    } else {
      getUserProfile();
    }

  }, [status]);

  useEffect(() => {
    if (Object.keys(userProfile).length == 0) return;

    const dentistRequiredFields = {
      name: null,
      dateOfBirth: null,
      email: null,
      sex: null,
      address: null,
      contactNumber: null,
    }

    const patientRequiredFields: any = {
      name: null,
      dateOfBirth: null,
      age: null,
      email: null,
      religion: null,
      nationality: null,
      sex: null,
      bloodType: null,
      address: null,
      contactNumber: null
    }

    const requiredFields = userProfile.role == 'dentist' ? dentistRequiredFields : patientRequiredFields;

    // Populate required fields from data
    for (const key in requiredFields) {
      if (Object.hasOwn(userProfile, key)) {
        requiredFields[key] = userProfile[key]
      }
    }
    console.log(requiredFields);
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