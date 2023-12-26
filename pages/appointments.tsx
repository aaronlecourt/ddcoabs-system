import { useState, useEffect } from "react";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import connectMongo from "../utils/connectMongo";
import { getSession } from "next-auth/react";
import styles from "../styles/pages/home.module.scss";
import PatientLayout from "../layouts/PatientLayout";
import DentistLayout from "../layouts/DentistLayout";
import useAuthGuard from "../guards/auth.guard";
import CustomCalendar from "../components/CustomCalendar";
import Appointment from "../components/Appointment";
import Modal from "../components/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCancel,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button";
import { IAppointment } from "./interfaces/IAppointment";
import { IUser } from "./interfaces/IUser";

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  const session = await getSession(context);
  try {
    await connectMongo();

    if (!session) {
      return {
        props: { isConnected: false },
      };
    }

    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/global/appointment`
    );
    const data = await response.json();

    // Filter appointments for the logged-in user based on their ID
    const loggedInUserId = (session.user as IUser).id;
    console.log("loggedInUserId:", loggedInUserId);
    const filteredAppointments = data.filter((appointment: IAppointment) => {
      return appointment.patientId?.toString() === loggedInUserId;
    });

    return {
      props: {
        isConnected: true,
        initialAppointmentData: filteredAppointments || [],
      },
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
  console.log(" Run: ", initialAppointmentData);
  const { session, status } = useAuthGuard();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState(initialAppointmentData);
  const [showCancelAppointment, setShowCancelAppointment] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const loggedInUserId = session?.user?.id;

  const [selectedFilter, setSelectedFilter] = useState('Today'); // Set 'Today' as the default filter for the patient's section
  const [selectedSorting, setSelectedSorting] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState<IAppointment[]>(initialAppointmentData);
  const [searchResults, setSearchResults] = useState<IAppointment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const sortBy = ['Latest to Oldest', 'Oldest to Latest', 'Alphabetical (A-Z)', 'Alphabetical (Z-A)', 'Pending First'];

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  // const totalPages = Math.max(Math.ceil(filteredAppointments.length / itemsPerPage), 1);

  const onCancelAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowCancelAppointment(true);
  };

  const cancelAppointment = () => {
    const user = session.user;

    if (user) {
      fetch(`/api/dentist/appointment/cancel/${selectedAppointment._id}`, {
        // fetch(`/api/${user.role}/appointment/cancel/${selectedAppointment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: "",
      })
        .then(async (response) => {
          const responseMsg = await response.json();
          if (!response.ok) {
            alert("appointment cancel failed: " + JSON.stringify(responseMsg));
          } else {
            alert("Appointment Cancel Successful");
            window.location.href = "/";
          }
        })
        .catch((error) => {
          alert("Appointment Cancel Failed");
          console.error("Error updating data:", error);
        });
    }
  };

  // const filterAppointmentsByStatus = (status: string) => {
  //   const currentDate = new Date().toDateString(); // Get today's date

  //   if (initialAppointmentData) {
  //     const filteredAppointments = initialAppointmentData.filter(
  //       (appointment: IAppointment) => {
  //         const appointmentDate = new Date(appointment.date).toDateString();

  //         if (status === "All") {
  //           return true; // Show all appointments when 'All' is selected
  //         } else if (status === "Today") {
  //           return appointmentDate === currentDate; // Show appointments for today's date
  //         }

  //         return appointment.status === status; // Filter by other statuses
  //       }
  //     );

  //     setFilteredAppointments(filteredAppointments); // Update the filteredAppointments state with the filtered list
  //   }
  // };

  // // UseEffect to filter appointments for 'Today' when the component mounts
  // useEffect(() => {
  //   filterAppointmentsByStatus("Today");
  //   handleSortChange("Latest to Oldest");
  // }, []);

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
      // handleSortChange('Latest to Oldest');
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
          {currentAppointments.length > 0 ? (
            <>
              {currentAppointments.map((appointment: IAppointment, index: number) => (
                <Appointment key={index} appointment={appointment} onCancelAppointment={onCancelAppointment} isPatient={true} />
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

  const renderContent = () => {
    console.log("Appointments:", appointments);
    return (
      <>
        <Modal
          open={showCancelAppointment}
          setOpen={setShowCancelAppointment}
          modalWidth={400}
          modalRadius={10}
        >
          <h3 className={styles.cancelTitle}>Cancel Appointment</h3>
          <div className={styles.cancelText}>
            <div style={{ width: "54px", height: "54px" }}>
              <FontAwesomeIcon
                icon={faCancel}
                size="3x"
                width={54}
                height={54}
                color={"#F01900"}
              />
            </div>
            <p>
              Please confirm the cancellation of this appointment. This action
              is not irreversible.
            </p>
          </div>
          <input
            type="text"
            className={styles.cancelReason}
            placeholder="Enter your reason for cancelling..."
          />
          <div className={styles.cancelActions}>
            <Button
              type="secondary"
              onClick={() => setShowCancelAppointment(false)}
            >
              No
            </Button>
            <Button onClick={cancelAppointment}>Yes</Button>
          </div>
        </Modal>
        {session && (
          <main className={styles.main}>
            <h1 className={styles.title}>Hello {session.user?.name}!</h1>
            <div className={styles.container}>
              <section>
                <div className={styles.filters}>
                  <div className={styles.filters__search}>
                    <input
                      type="text"
                      className={styles.filters__searchInput}
                      placeholder="Search appointment..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                    <FontAwesomeIcon
                      icon={faSearch}
                      width={24}
                      height={24}
                      color={"#737373"}
                    />
                  </div>
                  <div className={styles.filters__sort}>
                    <span className={styles.filters__sortTitle}>Sort By:</span>
                    <div className={styles.filters__sortDropdown}>
                    <select onChange={(e) => handleSortChange(e.target.value)}>
                      {sortBy.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    </div>
                  </div>
                  {/* <div className={styles.filters__sort}>
                    <span className={styles.filters__sortTitle}>Sort By:</span>
                    <div className={styles.filters__sortDropdown}>
                      <span>Latest</span>
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        width={24}
                        height={24}
                        color={"#737373"}
                      />
                    </div>
                  </div> */}
                </div>
                <div className={styles.appointments}>
                  <div className={styles.appointments__filters}>
                    <div
                      className={`${styles.appointments__filtersItemToday} ${
                        selectedFilter === "Today"
                          ? styles.appointments__filtersItemSelected
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedFilter("Today");
                        handleFilterChange("Today");
                      }}
                    >
                      Today
                      {countAppointmentsForToday() > 0 && (
                        <div className={`badge ${styles.badge}`}>
                          {countAppointmentsForToday()}
                        </div>
                      )}
                    </div>
                    <div
                      className={`${styles.appointments__filtersItemPending} ${
                        selectedFilter === "Pending"
                          ? styles.appointments__filtersItemSelected
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedFilter("Pending");
                        handleFilterChange("Pending");
                      }}
                    >
                      Pending
                      {countAppointmentsByStatus("Pending") > 0 && (
                        <div className={`badge ${styles.badge}`}>
                          {countAppointmentsByStatus("Pending")}
                        </div>
                      )}
                    </div>
                    <div
                      className={`${
                        styles.appointments__filtersItemConfirmed
                      } ${
                        selectedFilter === "Confirmed"
                          ? styles.appointments__filtersItemSelected
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedFilter("Confirmed");
                        handleFilterChange("Confirmed");
                      }}
                    >
                      Confirmed
                      {countAppointmentsByStatus("Confirmed") > 0 && (
                        <div className={`badge ${styles.badge}`}>
                          {countAppointmentsByStatus("Confirmed")}
                        </div>
                      )}
                    </div>
                    <div
                      className={`${
                        styles.appointments__filtersItemRescheduled
                      } ${
                        selectedFilter === "Rescheduled"
                          ? styles.appointments__filtersItemSelected
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedFilter("Rescheduled");
                        handleFilterChange("Rescheduled");
                      }}
                    >
                      Rescheduled
                      {countAppointmentsByStatus("Rescheduled") > 0 && (
                        <div className={`badge ${styles.badge}`}>
                          {countAppointmentsByStatus("Rescheduled")}
                        </div>
                      )}
                    </div>
                    {/* <div
                      className={`${styles.appointments__filtersItemCanceled} ${
                        selectedFilter === "Canceled"
                          ? styles.appointments__filtersItemSelected
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedFilter("Canceled");
                        handleFilterChange("Canceled");
                      }}
                    >
                      Canceled
                      {countAppointmentsByStatus("Canceled") > 0 && (
                        <div className={`badge ${styles.badge}`}>
                          {countAppointmentsByStatus("Canceled")}
                        </div>
                      )}
                    </div> */}
                    <div
                      className={`${styles.appointments__filtersItemDone} ${
                        selectedFilter === "Done"
                          ? styles.appointments__filtersItemSelected
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedFilter("Done");
                        handleFilterChange("Done");
                      }}
                    >
                      Done
                      {countAppointmentsByStatus("Done") > 0 && (
                        <div className={`badge ${styles.badge}`}>
                          {countAppointmentsByStatus("Done")}
                        </div>
                      )}
                    </div>
                    <div
                      className={`${styles.appointments__filtersItemAll} ${
                        selectedFilter === "All"
                          ? styles.appointments__filtersItemSelected
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedFilter("All");
                        handleFilterChange("All");
                      }}
                    >
                      All
                      {countAppointmentsByStatus("All") > 0 && (
                        <div className={`badge ${styles.badge}`}>
                          {countAppointmentsByStatus("All")}
                        </div>
                      )}
                    </div>
                  </div>
                  {renderAppointmentsByStatus(
                    filteredAppointments,
                    selectedFilter,
                    searchTerm
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
    );
  };

  const renderDentistContent = () => {
    return (
      <>
        {session && (
          <main className={styles.main}>
            <div className={styles.container}>HOLD THE APPOINTMENTS</div>
          </main>
        )}
      </>
    );
  };

  return (
    <>
      {status !== "loading" &&
        session &&
        (session.user?.role === "patient" ? (
          <PatientLayout>{renderContent()}</PatientLayout>
        ) : (
          <DentistLayout>{renderDentistContent()}</DentistLayout>
        ))}
    </>
  );
}
