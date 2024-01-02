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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCancel,
  faChevronLeft,
  faChevronRight,
  faSearch,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useRouter } from "next/router";
import { IAppointment } from "./interfaces/IAppointment";
import { IUser } from "./interfaces/IUser";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../components/Modal";
import Button from "../components/ArchiveButton";
import { Service } from "../types/services";

export default function Home() {
  const { session, status } = useAuthGuard();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<any>([]);
  const [showCancelAppointment, setShowCancelAppointment] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentFilter, setCurrentFilter] = useState<string>("Today");
  const [selectedSort, setSelectedSort] = useState<string>("Oldest to Latest");

  const router = useRouter();

  const sortBy = [
    "Oldest to Latest",
    "Latest to Oldest",
    "Alphabetical (A-Z)",
    "Alphabetical (Z-A)",
    "Pending First",
  ];

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/dentist/dentist-service");
      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }
      const data = await response.json();
      setServices(data); // Assuming the response directly contains an array of services
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const url = `/api/global/appointment?status=${currentFilter}&search=${searchTerm}&sortBy=${selectedSort}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();
      setAppointments(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchAppointments();
  }, [currentFilter, searchTerm]);

  // Function to count appointments by status for the logged-in user (PATIENT)
  const countUserAppointmentsByStatus = (status: string) => {
    if (status === "All") {
      return appointments.filter(
        (appointment: IAppointment) =>
          appointment.patientId === session.user?.id
      ).length;
    }
    return appointments.filter(
      (appointment: IAppointment) =>
        appointment.patientId === session.user?.id &&
        appointment.status === status
    ).length;
  };

  // Function to count appointments by status for the logged-in user (DENTIST)
  // const countDentistAppointmentsByStatus = (status: string) => {
  //   if (status === "All") {
  //     return appointments.filter(
  //       (appointment: IAppointment) => appointment.dentistId === session.user?.id
  //     ).length;
  //   }
  //   return appointments.filter(
  //     (appointment: IAppointment) =>
  //       appointment.dentistId === session.user?.id &&
  //       appointment.status === status
  //   ).length;
  // };

  const countAppointmentByStatus = (status: string) => {
    if (status === "Today") {
      return countAppointmentsForToday(); // Use the count for today's appointments
    }

    if (status === "All") {
      // Return the total count of appointments for all statuses
      return appointments.length;
    }

    // Return the count based on the specific status filter
    return appointments.filter(
      (appointment: IAppointment) => appointment.status === status
    ).length;
  };

  const countAppointmentsForToday = () => {
    const today = new Date().toLocaleDateString(); // Get today's date without time

    return appointments.filter((appointment: IAppointment) => {
      const appointmentDate = new Date(appointment.date).toLocaleDateString(); // Get appointment date without time

      return appointmentDate === today;
    }).length;
  };

  const onCancelAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowCancelAppointment(true);
  };

  const cancelAppointment = () => {
    const user = session.user;

    if (user) {
      fetch(`/api/${user.role}/appointment/cancel/${selectedAppointment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: "",
      })
        .then(async (response) => {
          const responseMsg = await response.json();
          if (!response.ok) {
            toast.error(
              "Appointment cancel failed: " + JSON.stringify(responseMsg)
            );
          } else {
            toast.success("Appointment successfully canceled");
            setTimeout(() => {
              window.location.href = "/";
            }, 3000);
          }
        })
        .catch((error) => {
          toast.error("Appointment Cancel Failed");
          console.error("Error updating data:", error);
        });
    }
  };

  const renderContent = () => {
    return (
      <>
        <ToastContainer />
        {session && (
          <main className={`${styles.main2} ${styles.main2LandingPage}`}>
            {/* separate into 2 services scroll 1 side */}
            <div className={styles.Home}>
              <div className={styles.sub}>
                <h1 className={styles.title}>Hello {session.user?.name}!</h1>
                <div className={styles.appointmentCounts}>
                  <h3>You have</h3>
                  <div className={styles.countContainer}>
                    <div className={styles.countContainerBox}>
                      <div>{countUserAppointmentsByStatus("Pending")}</div>
                      <span>Pending Appointments</span>
                    </div>
                    <div className={styles.countContainerBox}>
                      <div>{countUserAppointmentsByStatus("Confirmed")}</div>
                      <span>Confirmed Appointments</span>
                    </div>
                    <div className={styles.countContainerBox}>
                      <div>{countUserAppointmentsByStatus("Rescheduled")}</div>
                      <span>Rescheduled Appointments</span>
                    </div>
                    <div className={styles.countContainerBox}>
                      <div>{countUserAppointmentsByStatus("Done")}</div>
                      <span>Done Appointments</span>
                    </div>
                  </div>
                </div>
                <h2 className={styles.subHeader}>About the Clinic</h2>
                <p>
                  The DentalFix Dental Clinic is a family-owned and newly
                  founded business in the fourth week of January 2023. It is
                  established through thorough planning, hard work, and with the
                  help of Dr. Sheela Mae De Jesus’ parents. Considering the
                  factors such as the population in the area, central business
                  district, and the location of their laboratory, they have
                  decided to establish and rent a space for their dental clinic
                  in a building near the University of Baguio where Dr. De Jesus
                  graduated Doctor of Medicine in Dentistry (DMD) last 2019.
                </p>
                <br />
                <h2 className={styles.subHeader}>Operating Hours</h2>
                <p>
                  <b>Monday - Friday:</b> 8:00 AM - 6:00 PM
                  <br />
                  <b>Saturday - Sunday:</b> Closed
                </p>
              </div>

              <div className={styles.sub}>
                <h2 className={styles.subHeader}>Offered Services</h2>
                <div className={styles.servicesContainer}>
                  {loading && <p>Loading...</p>}
                  {!loading &&
                    services.map((service) => (
                      <div
                        key={service._id}
                        className={styles.servicesContainerCard}
                      >
                        <div className={styles.servicesContainerCardLabel}>
                          <span>{service.name}</span>
                          <span>P{parseFloat(service.price).toFixed(2)}</span>
                        </div>
                        <span>{service.description}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </main>
        )}
      </>
    );
  };

  const renderDentistContent = () => {
    // Function to fetch appointments with the search term
    const fetchAppointmentsWithSearchTerm = async (searchTerm: any) => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/global/appointment?search=${searchTerm}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }
        const data = await response.json();
        setAppointments(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      }
    };

    const handleSearch = (searchTermInput: string) => {
      setSearchTerm(searchTermInput);

      if (searchTermInput === "") {
        if (currentFilter !== "") {
          // Refetch appointments based on the current filter if the search term is empty
          handleStatusFilter(currentFilter);
        } else {
          // If there's no filter applied, fetch all appointments
          fetchAppointments();
        }
        return;
      }

      // Filter the appointments based on the search term within the already filtered appointments (if there's a filter)
      const filteredAppointments = currentFilter
        ? appointments.filter((appointment: IAppointment) => {
            // Check if the appointment matches the current filter and the search term
            return (
              appointment.status === currentFilter &&
              (appointment.dentistService
                ?.toLowerCase()
                .includes(searchTermInput.toLowerCase()) ||
                appointment.patientName
                  ?.toLowerCase()
                  .includes(searchTermInput.toLowerCase()))
              // Add other fields as needed for search
              // ...
            );
          })
        : appointments.filter((appointment: IAppointment) => {
            // Filter appointments based only on the search term when no filter is applied
            return (
              appointment.dentistService
                ?.toLowerCase()
                .includes(searchTermInput.toLowerCase()) ||
              appointment.patientName
                ?.toLowerCase()
                .includes(searchTermInput.toLowerCase())
              // Add other fields as needed for search
              // ...
            );
          });

      // Update the state with the filtered appointments
      setAppointments(filteredAppointments);
    };

    const handleStatusFilter = async (status: string) => {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/global/appointment?status=${status}&search=${searchTerm}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }

        const data = await response.json();
        setAppointments(data);
        setLoading(false);

        setCurrentFilter(status);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      }
    };

    const statusStyles: Record<string, string> = {
      All: styles.appointments__filtersItemAll,
      Today: styles.appointments__filtersItemToday,
      Pending: styles.appointments__filtersItemPending,
      Confirmed: styles.appointments__filtersItemConfirmed,
      Rescheduled: styles.appointments__filtersItemRescheduled,
      Canceled: styles.appointments__filtersItemCanceled,
      Done: styles.appointments__filtersItemDone,
      // ... other statuses
    };

    const statusBoxes = [
      "Today",
      "Pending",
      "Confirmed",
      "Rescheduled",
      "Done",
      "Canceled",
      "All",
    ];

    const renderStatusFilters = () => {
      const appointmentCountToday = countAppointmentsForToday();

      return statusBoxes.map((status, index) => {
        const appointmentCount =
          status === "Today"
            ? appointmentCountToday
            : countAppointmentByStatus(status);

        return (
          <div
            key={index}
            className={`${styles.statusFilter} ${statusStyles[status]} ${
              currentFilter === status
                ? styles.appointments__filtersItemSelected
                : ""
            }`}
            onClick={() => {
              setCurrentFilter(status);
              handleStatusFilter(status);
            }}
          >
            {status}
            {currentFilter === status && ( // Only display badge if current filter matches status
              <div className={`badge ${styles.badge}`}>{appointmentCount}</div>
            )}
          </div>
        );
      });
    };

    const handleSortChange = async (sortOption: string) => {
      try {
        setLoading(true);
        let url = `/api/global/appointment?status=${currentFilter}&search=${searchTerm}&sortBy=${sortOption}`;

        if (sortOption === "Pending First") {
          url = `/api/global/appointment?status=${currentFilter}&search=${searchTerm}&sortBy=${sortOption}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }

        const data = await response.json();
        setAppointments(data);
        setLoading(false);
        setSelectedSort(sortOption);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      }
    };

    return (
      <>
        {/* CANCEL MODAL */}
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

        <ToastContainer />
        {session && (
          <main className={styles.main2}>
            <h1 className={styles.title}>Hello Dr. {session.user?.name}!</h1>
            <div className={styles.container}>
              <section>
                <div className={styles.noteContainer}>
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    color={"#3AB286"}
                    width={30}
                    height={30}
                  />
                  <p className={styles.note}>
                    <span className={styles.noteText}>Note: </span>
                    Appointments inside{" "}
                    <span className={styles.noteBox}>these containers</span> are
                    walk-in appointments.
                  </p>
                </div>
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
                      <select
                        onChange={(e) => handleSortChange(e.target.value)}
                      >
                        {sortBy.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className={styles.appointments}>
                  <div className={styles.appointments__filters}>
                    <div
                      className={styles.appointments__filters__statusFilters}
                    >
                      {renderStatusFilters()}
                    </div>
                  </div>
                  <div>
                    {/* Appointment chart here */}
                    {appointments.length === 0 ? (
                      <div className={styles.appointments__empty}>
                        No matching appointments were found.
                      </div>
                    ) : (
                      appointments.map(
                        (appointment: IAppointment, index: number) => (
                          <Appointment
                            key={index}
                            appointment={appointment}
                            onCancelAppointment={onCancelAppointment}
                          />
                        )
                      )
                    )}
                  </div>
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

  return (
    <>
      <ToastContainer />
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
