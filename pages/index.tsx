import { useState } from 'react';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import connectMongo from '../utils/connectMongo';
import { getSession } from "next-auth/react"
import styles from '../styles/pages/home.module.scss'
import PatientLayout from '../layouts/PatientLayout';
import DentistLayout from '../layouts/DentistLayout';
import useAuthGuard from '../guards/auth.guard';
import CustomCalendar from '../components/CustomCalendar';
import Appointment from '../components/Appointment';
import Modal from '../components/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCancel, faChevronDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import Button from '../components/Button';
import Image from 'next/image';
<<<<<<< Updated upstream
=======
import { useRouter } from 'next/router';
import { IAppointment } from './interfaces/IAppointment';
import { IUser } from './interfaces/IUser';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
>>>>>>> Stashed changes

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  const session = await getSession(context);

  try {
    await connectMongo();

    if (!session) {
      return {
        props: { isConnected: false },
      }
    }

    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/global/appointment`);
    const data = await response.json();
    console.log('appointments data ', data)

    return {
      props: { isConnected: true, initialAppointmentData: data || [] },
    }

  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}

export default function Home({
  isConnected,
  initialAppointmentData
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  console.log(' ehhehehe ', initialAppointmentData)
  const { session, status } = useAuthGuard();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState(initialAppointmentData)
  const [showCancelAppointment, setShowCancelAppointment] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)

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
            toast.error('appointment cancel failed: ' + JSON.stringify(responseMsg))
          } else {
            toast.success('Appointment Cancel Successful')
            window.location.href = '/'
          }
        })
        .catch(error => {
          toast.error('Appointment Cancel Failed');
          console.error('Error updating data:', error);
        });
    }
  }

<<<<<<< Updated upstream
=======
  const filterAppointmentsByStatus = (status: string) => {
    const currentDate = new Date().toDateString(); // Get today's date
  
    if (initialAppointmentData) {
      const filteredAppointments = initialAppointmentData.filter((appointment: IAppointment) => {
        const appointmentDate = new Date(appointment.date).toDateString();
  
        if (status === 'All') {
          return true; // Show all appointments when 'All' is selected
        } else if (status === 'Today') {
          return appointmentDate === currentDate; // Show appointments for today's date
        }
  
        return appointment.status === status; // Filter by other statuses
      });
  
      setFilteredAppointments(filteredAppointments); // Update the filteredAppointments state with the filtered list
    }
  };

  // UseEffect to filter appointments for 'Today' when the component mounts
    useEffect(() => {
      filterAppointmentsByStatus('Today');
      handleSortChange('Latest to Oldest');
    }, []);

    const countAppointmentsByStatus = (status: string) => {
      if (status === 'All') {
        return initialAppointmentData.length;
      }
      return initialAppointmentData.filter((appointment:IAppointment) => appointment.status === status).length;
    };
    
    const countAppointmentsForToday = () => {
      const currentDate = new Date().toDateString();
      return initialAppointmentData.filter((appointment: IAppointment) => {
        const appointmentDate = new Date(appointment.date).toDateString();
        return appointmentDate === currentDate;
      }).length;
    };

    const handleSearch = async (term: string) => {
      setSearchTerm(term);
    
      if (term.trim() !== '') {
        const appointmentsToSearch = filteredAppointments.length > 0 ? filteredAppointments : initialAppointmentData;
    
        const fetchedAppointments = await Promise.all(appointmentsToSearch.map(async (appointment: IAppointment) => {
          if (appointment.patientId) {
            const response = await fetch(`/api/global/user/${appointment.patientId}`);
            const patient = await response.json();
    
            return {
              ...appointment,
              patientName: patient ? patient.name || '' : '',
            };
          }
          return appointment;
        }));
    
        const filteredResults = fetchedAppointments.filter((appointment: IAppointment) => {
          const matchesPatientName = appointment.patientName?.toLowerCase().includes(term.toLowerCase());
          const matchesServiceName = appointment.dentistService.toLowerCase().includes(term.toLowerCase());
    
          return matchesPatientName || matchesServiceName;
        });
    
        setSearchResults(filteredResults as IAppointment[]);
      } else {
        setSearchResults([]); // Reset searchResults to an empty array when the search term is empty
      }
      
    };
    
    const renderAppointmentsByStatus = (appointmentsToMap: IAppointment[], status: string, searchTerm: string) => {
      let filteredAppointments = appointmentsToMap;
    
      if (status !== 'All') {
        filteredAppointments = appointmentsToMap.filter((appointment) => appointment.status === status);
      }
    
      if (status === 'Today') {
        const currentDate = new Date().toDateString();
        filteredAppointments = appointmentsToMap.filter((appointment: IAppointment) => {
          const appointmentDate = new Date(appointment.date).toDateString();
          return appointmentDate === currentDate;
        });
      }
    
      if (searchTerm.trim() !== '') {
        const searchResults = filteredAppointments.filter((appointment: IAppointment) => {
          const matchesPatientName = appointment.patientName?.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesServiceName = appointment.dentistService.toLowerCase().includes(searchTerm.toLowerCase());
    
          return matchesPatientName || matchesServiceName;
        });
    
        if (searchResults.length > 0) {
          filteredAppointments = searchResults;
        } else {
          filteredAppointments = [];
        }
      }
    
      // Pagination calculation
      const totalCount = filteredAppointments.length; // Total count after filtering
      const searchCount = searchResults.length; // Count of search results
    
      const totalCountForPagination = searchTerm.trim() !== '' ? searchCount : totalCount;
      const totalPages = Math.max(Math.ceil(totalCountForPagination / itemsPerPage), 1);
    
      const validatedCurrentPage = Math.min(currentPage, totalPages);
    
      const indexOfLastItem = validatedCurrentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentAppointments = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);
    
      return (
        <>
        <ToastContainer />
          {currentAppointments.length > 0 ? (
            <>
              {currentAppointments.map((appointment: IAppointment, index: number) => (
                <Appointment key={index} appointment={appointment} onCancelAppointment={onCancelAppointment} />
              ))}
              {renderPagination(totalPages, validatedCurrentPage)}
            </>
          ) : (
            <div className={styles.appointments__empty}>No matching appointments found</div>
          )}

        </>
      );
    };
    
    
    

    const handleFilterChange = (newFilter: string) => {
      if (newFilter !== selectedFilter) {
        setSelectedFilter(newFilter);
        filterAppointmentsByStatus(newFilter);
      }

      if (selectedSorting) {
        handleSortChange(selectedSorting);
      }
    };
    
    const handleSortChange = (sortOption: string) => {
      setSelectedSorting(sortOption);
      let sortedAppointments = [...filteredAppointments]; // Create a copy of filteredAppointments
    
      switch (sortOption) {
        case 'Oldest to Latest':
          sortedAppointments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          break;
        case 'Latest to Oldest':
          sortedAppointments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          break;
        case 'Alphabetical (A-Z)':
          sortedAppointments.sort((a, b) => a.dentistService.localeCompare(b.dentistService));
          break;
        case 'Alphabetical (Z-A)':
          sortedAppointments.sort((a, b) => b.dentistService.localeCompare(a.dentistService));
          break;
        case 'Pending First':
          const pendingAppointments = sortedAppointments.filter(appointment => appointment.status === 'Pending');
          const otherAppointments = sortedAppointments.filter(appointment => appointment.status !== 'Pending');
    
          pendingAppointments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          otherAppointments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
          sortedAppointments = [...pendingAppointments, ...otherAppointments];
          break;
        default:
          break;
      }
    
      setFilteredAppointments(sortedAppointments); // Update the state with the sorted array
    };

    const renderPagination = (totalPages: number, currentPage: number) => {
      const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
    
      return (
        <div className={styles.pagination}>
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            <FontAwesomeIcon icon={faChevronLeft} width={16} height={16} color={'#737373'} />
          </button>
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={currentPage === number ? styles.active : ''}
            >
              {number}
            </button>
          ))}
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
            <FontAwesomeIcon icon={faChevronRight} width={16} height={16} color={'#737373'} />
          </button>
        </div>
      );
    };
    
>>>>>>> Stashed changes
  const renderContent = () => {
    return (
      <>
      <ToastContainer />
        {session && (
          <main className={`${styles.main} ${styles.mainLandingPage}`}>
            <Image
              src='/logo.png'
              alt='logo'
              width={500}
              height={150}
            />
            <h1>Landing Page</h1>
          </main>
        )}
      </>
    )
  }

  const renderDentistContent = () => {
    return (
      <>
<<<<<<< Updated upstream
        <Modal open={showCancelAppointment} setOpen={setShowCancelAppointment} modalWidth={400} modalRadius={10}>
          <h3 className={styles.cancelTitle}>Cancel Appointment</h3>
          <div className={styles.cancelText}>
            <div style={{ width: '54px', height: '54px' }}>
              <FontAwesomeIcon icon={faCancel} size="3x" width={54} height={54} color={'#F01900'} />
            </div>
            <p>Please confirm the cancellation of this appointment.
              This action is not irreversible.</p>
          </div>
          <div className={styles.cancelActions}>
            <Button type='secondary' onClick={() => setShowCancelAppointment(false)}>No</Button>
            <Button onClick={cancelAppointment}>Yes</Button>
          </div>
        </Modal>
=======
      <ToastContainer />
>>>>>>> Stashed changes
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
                  <div className={styles.appointments__filters}>
                    <div className={`${styles.appointments__filtersItem} ${styles.appointments__filtersItemSelected}`}>All</div>
                    <div className={styles.appointments__filtersItem}>Confirmed</div>
                    <div className={styles.appointments__filtersItem}>Pending</div>
                    <div className={styles.appointments__filtersItem}>Today</div>
                  </div>
                  {appointments && appointments.length > 0 ?
                    <>
                      {appointments.map((appointment: any, index: number) =>
                        <Appointment key={index} appointment={appointment} onCancelAppointment={onCancelAppointment} />
                      )}
                    </>
                    :
                    <div className={styles.appointments__empty}>There are no appointments</div>
                  }
                </div>
              </section>
              <section>
                <CustomCalendar
                  selectable={false}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
              </section>
            </div>
          </main>
        )}
      </>
    )
  }

  return (
    <>
     <ToastContainer />
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
