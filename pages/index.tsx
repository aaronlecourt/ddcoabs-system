import { useState, useEffect } from 'react';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import connectMongo from '../utils/connectMongo';
import { getSession } from 'next-auth/react';
import styles from '../styles/pages/home.module.scss';
import PatientLayout from '../layouts/PatientLayout';
import DentistLayout from '../layouts/DentistLayout';
import useAuthGuard from '../guards/auth.guard';
import CustomCalendar from '../components/CustomCalendar';
import Appointment from '../components/Appointment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCancel, faChevronDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { IAppointment } from './interfaces/IAppointment';

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  const session = await getSession(context);

  try {
    await connectMongo();

    if (!session) {
      return {
        props: { isConnected: false },
      };
    }

    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/global/appointment`);
    const data = await response.json();
    console.log('appointments data ', data);

    return {
      props: { isConnected: true, initialAppointmentData: data || [] },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false },
    };
  }
};

export default function Home({
  isConnected,
  initialAppointmentData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log(' ehhehehe ', initialAppointmentData);
  const { session, status } = useAuthGuard();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState(initialAppointmentData)
  const [showCancelAppointment, setShowCancelAppointment] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const router = useRouter();

  const onCancelAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowCancelAppointment(true);
  }

  const cancelAppointment = () => {
    const user = session.user

    if (user) {
      fetch(`/api/${user.role}/appointment/cancel/${selectedAppointment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: '',
      })
        .then(async (response) => {
          const responseMsg = await response.json()
          if (!response.ok) {
            alert('appointment cancel failed: ' + JSON.stringify(responseMsg))
          } else {
            alert('Appointment Cancel Successful')
            window.location.href = '/'
          }
        })
        .catch(error => {
          alert('Appointment Cancel Failed');
          console.error('Error updating data:', error);
        });
    }
  }

  const renderContent = () => {
    return (
      <>
        {session && (
          <main className={`${styles.main} ${styles.mainLandingPage}`}>
            {/* separate into 2 services scroll 1 side */}
            <div className="">
            <Image
              src='/logo_dark.png'
              alt='logo'
              width={415}
              height={100}
            />
            <br />
            <div className={styles.sub}>
            <h2 className={styles.subHeader}>About the Clinic</h2>
            <p>
              The DentalFix Dental Clinic is a family-owned and newly founded business in the fourth week of January 2023. It is established through thorough planning, hard work, and with the help of Dr. Sheela Mae De Jesus’ parents. Considering the factors such as the population in the area, central business district, and the location of their laboratory, they have decided to establish and rent a space for their dental clinic in a building near the University of Baguio where Dr. De Jesus graduated Doctor of Medicine in Dentistry (DMD) last 2019. 
            </p>
            <br />
            <div>
            <h2 className={styles.subHeader}>Operating Hours</h2>
            <p>
              Monday - Friday: 8:00 AM - 6:00 PM
              <br />
              Saturday - Sunday: Closed
            </p>
            </div>
            </div>
            </div>
          </main>
        )}
      </>
    )
  }
// Inside your Home component
const [selectedFilter, setSelectedFilter] = useState('Today'); // State to track selected filter

const filterAppointmentsByStatus = (status: string) => {
  const currentDate = new Date().toDateString(); // Get today's date

  const filteredAppointments = initialAppointmentData.filter((appointment: IAppointment) => {
    if (status === 'All') {
      return true; // Show all appointments when 'All' is selected
    } else if (status === 'Today') {
      const appointmentDate = new Date(appointment.date).toDateString();
      return appointmentDate === currentDate; // Show appointments for today's date
    }
    return appointment.status === status; // Filter by other statuses
  });

  setAppointments(filteredAppointments); // Update the appointments state with the filtered list
};

// UseEffect to filter appointments for 'Today' when the component mounts
useEffect(() => {
  filterAppointmentsByStatus('Today');
}, []);


  const renderDentistContent = () => {
    return (
      <>
        {session && (
          <main className={styles.main}>
            <h1 className={styles.title}>Hello Dr. {session.user?.name}!</h1>
            <div className={styles.container}>
              <section>
                <div className={styles.filters}>
                  <div className={styles.filters__search}>
                    <input type='text' className={styles.filters__searchInput} placeholder='Search appointment...' />
                    <FontAwesomeIcon icon={faSearch} width={24} height={24} color={'#737373'} />
                  </div>
                  <div className={styles.filters__sort}>
                    <span className={styles.filters__sortTitle}>Sort By:</span>
                    <div className={styles.filters__sortDropdown}>
                      <span>Latest</span>
                      <FontAwesomeIcon icon={faChevronDown} width={24} height={24} color={'#737373'} />
                    </div>
                  </div>
                </div>
                <div className={styles.appointments}>
                {/* // Inside your renderDentistContent function, attach onClick handlers to the filter items */}
                <div className={styles.appointments__filters}>
  <div
    className={`${styles.appointments__filtersItemToday} ${selectedFilter === 'Today' ? styles.appointments__filtersItemSelected : ''}`}
    onClick={() => {
      setSelectedFilter('Today');
      filterAppointmentsByStatus('Today');
    }}
  >
    Today
  </div>
  <div
    className={`${styles.appointments__filtersItemPending} ${selectedFilter === 'Pending' ? styles.appointments__filtersItemSelected : ''}`}
    onClick={() => {
      setSelectedFilter('Pending');
      filterAppointmentsByStatus('Pending');
    }}
  >
    Pending
  </div>
  <div
    className={`${styles.appointments__filtersItemConfirmed} ${selectedFilter === 'Confirmed' ? styles.appointments__filtersItemSelected : ''}`}
    onClick={() => {
      setSelectedFilter('Confirmed');
      filterAppointmentsByStatus('Confirmed');
    }}
  >
    Confirmed
  </div>
  <div
    className={`${styles.appointments__filtersItemRescheduled} ${selectedFilter === 'Rescheduled' ? styles.appointments__filtersItemSelected : ''}`}
    onClick={() => {
      setSelectedFilter('Rescheduled');
      filterAppointmentsByStatus('Rescheduled');
    }}
  >
    Rescheduled
  </div>
  <div
    className={`${styles.appointments__filtersItemCanceled} ${selectedFilter === 'Canceled' ? styles.appointments__filtersItemSelected : ''}`}
    onClick={() => {
      setSelectedFilter('Canceled');
      filterAppointmentsByStatus('Canceled');
    }}
  >
    Canceled
  </div>
  <div
    className={`${styles.appointments__filtersItemDone} ${selectedFilter === 'Done' ? styles.appointments__filtersItemSelected : ''}`}
    onClick={() => {
      setSelectedFilter('Done');
      filterAppointmentsByStatus('Done');
    }}
  >
    Done
  </div>
  <div
    className={`${styles.appointments__filtersItemAll} ${selectedFilter === 'All' ? styles.appointments__filtersItemSelected : ''}`}
    onClick={() => {
      setSelectedFilter('All');
      filterAppointmentsByStatus('All');
    }}
  >
    All
  </div>
</div>

{/* // Update the appointment list to use the filtered appointments */}
{appointments && appointments.length > 0 ? (
  <>
    {appointments.map((appointment: any, index: number) => (
      <Appointment key={index} appointment={appointment} onCancelAppointment={onCancelAppointment} />
    ))}
  </>
) : (
  <div className={styles.appointments__empty}>There are no appointments</div>
)}

                </div>
              </section>
              <section className={styles.rightContainer}>
                  <div className={styles.Calendar}>
                  <CustomCalendar
                    selectable={false}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                  />
                  </div>
                </section>
            </div>
          </main>
        )}
      </>
    )
  }

  return (
    <>
      {(status !== 'loading' && session) && (
        session.user?.role === 'patient' ? (
          <PatientLayout>
            {renderContent()}
          </PatientLayout>
        ) : (
          <DentistLayout>
            {renderDentistContent()}
          </DentistLayout>
        )
      )
      }
    </>
  )
}
