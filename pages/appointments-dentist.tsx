import { useState, useEffect } from "react";
import printableStyles from "../styles/pages/accounts.module.scss";
import connectMongo from "../utils/connectMongo";
import { getSession } from "next-auth/react";
import styles from "../styles/pages/home.module.scss";
import styles1 from "../styles/pages/services.module.scss";
import styles2 from "../components/Appointment/style.module.scss";
import DentistLayout from "../layouts/DentistLayout";
import useAuthGuard from "../guards/auth.guard";
import Appointment from "../components/Appointment";
import Modal from "../components/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../components/Button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import RecordInfo from "../components/RecordInfo";
import {
  faCalendar,
  faCancel,
  faCheckCircle,
  faCheckDouble,
  faChevronDown,
  faChevronRight,
  faClock,
  faEye,
  faFemale,
  faMale,
  faMoneyBill,
  faNoteSticky,
  faPencil,
  faUser,
  faWallet,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import APPOINTMENT_STATUS from "../constants/appointmentStatus";

interface AppointmentDetails {
  goodHealth: string;
  medicalTreatment: string;
  medicalTreatmentValue: string;
  illness: string;
  illnessValue: string;
  hospitalized: string;
  hospitalizedValue: string;
  medication: string;
  medicationValue: string;
  tobacco: string;
  alchohol: string;
  allergy: string;
  allergyValue: string;
  previousDentist: string;
  previousTreatment: string;
  lastDentalVisit: string;
  // Add more properties as per your object structure
}

interface Appointments {
  _id: string;
  patientName: string;
  date: Date;
  startTime: number;
  endTime: number;
  timeUnit: string;
  dentistService: number;
  contactNumber: string;
  details: AppointmentDetails;
  status: string;
  createdAt: string;
  isWalkIn: boolean;
  paymentMethod: string;
  price: string;
}

export default function Home() {
  const { session, status } = useAuthGuard();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointments[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const sortBy = [
    "Latest to Oldest",
    "Oldest to Latest",
    "Alphabetical (A-Z)",
    "Alphabetical (Z-A)",
    "Pending First",
  ];
  const [selectedAppointmentDetails, setSelectedAppointmentDetails] =
    useState<Appointments | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  // const totalPages = Math.max(Math.ceil(filteredAppointments.length / itemsPerPage), 1);

  // FOR DATE CONVERSION
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // FOR TIME CONVERSION
  const formatTime = (time?: number): string => {
    if (time === undefined) return ""; // Handle undefined time
    const hours = (time % 12 || 12).toString();
    return `${hours}:00`;
  };

  // SEARCH
  const [searchQuery, setSearchQuery] = useState("");

  const searchedAppointment = appointments.filter((appointment) => {
    const lowerCaseSearch = searchQuery.toLowerCase();

    const patientNameMatch = appointment.patientName
      ?.toLowerCase()
      .includes(lowerCaseSearch);

    // Search by date (month)
    const month = new Intl.DateTimeFormat("en-US", { month: "long" })
      .format(new Date(appointment.date))
      .toLowerCase();
    const dateMatch = month.includes(lowerCaseSearch);

    // Search by dental service
    const dentalServiceMatch = appointment.dentistService
      .toString()
      .includes(lowerCaseSearch);

    // Search by start time
    const startTimeMatch = formatTime(appointment.startTime).includes(
      lowerCaseSearch
    );

    return (
      patientNameMatch || dateMatch || dentalServiceMatch || startTimeMatch
    );
  });

  console.log("Searched Data:", searchedAppointment);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    console.log("Search Query:", e.target.value);
  };

  //FILTER
  const filterBy = [
    "Select All",
    "Today",
    "Pending",
    "Confirmed",
    "Rescheduled",
    "Canceled",
    "Done",
    "Walk In",
    { label: "Start Date", type: "date", key: "startDate" },
    { label: "End Date", type: "date", key: "endDate" },
  ];
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  // FOR SHOW RECORD AND GENERATE REPORT
  const [isGenerateReport, setIsGenerateReport] = useState(false);
  const initialSelectedFilters: string[] = filterBy
    .filter((item) => typeof item === "string" && item !== "Select All")
    .map((item) => item as string);

  const startDateDisabled = !selectedFilters.includes("Start Date");
  const endDateDisabled = !selectedFilters.includes("End Date");

  const [startDateVisible, setStartDateVisible] = useState(false);
  const [endDateVisible, setEndDateVisible] = useState(false);

  const handleFilterSelection = (
    filter: string | { label: string; type: string; key: string }
  ) => {
    if (typeof filter === "string") {
      if (filter === "Select All") {
        if (
          selectedFilters.length ===
          filterBy.filter((item) => typeof item === "string").length
        ) {
          setSelectedFilters([]); // Uncheck all if 'Select All' was previously checked
        } else {
          setSelectedFilters(
            filterBy.filter((item) => typeof item === "string") as string[]
          );
        }
      } else if (filter === "Start Date" || filter === "End Date") {
        if (selectedFilters.includes(filter)) {
          setSelectedFilters(
            selectedFilters.filter(
              (selectedFilter) => selectedFilter !== filter
            )
          );
        } else {
          setSelectedFilters([...selectedFilters, filter]);
        }
      } else {
        if (selectedFilters.includes(filter)) {
          setSelectedFilters(
            selectedFilters.filter(
              (selectedFilter) => selectedFilter !== filter
            )
          );
        } else {
          setSelectedFilters([...selectedFilters, filter]);
        }
      }
    } else {
      const dateFilter = filter as { label: string; type: string; key: string };
      if (dateFilter.key === "startDate") {
        setStartDateVisible(!startDateVisible);
        setEndDateVisible(false);
      } else if (dateFilter.key === "endDate") {
        setEndDateVisible(!endDateVisible);
        setStartDateVisible(false);
      }
    }
  };

  const filteredBySelectedFilters = appointments.filter((appointment) => {
    if (selectedFilters.length === 0) {
      return true;
    } else {
      if (selectedFilters.includes("Today") && appointment.status === "Today") {
        return true;
      }
      if (
        selectedFilters.includes("Pending") &&
        appointment.status === "Pending"
      ) {
        return true;
      }
      if (
        selectedFilters.includes("Confirmed") &&
        appointment.status === "Confirmed"
      ) {
        return true;
      }
      if (
        selectedFilters.includes("Rescheduled") &&
        appointment.status === "Rescheduled"
      ) {
        return true;
      }
      if (
        selectedFilters.includes("Canceled") &&
        appointment.status === "Canceled"
      ) {
        return true;
      }
      if (selectedFilters.includes("Done") && appointment.status === "Done") {
        return true;
      }
      if (
        selectedFilters.includes("Walk In") &&
        appointment.isWalkIn === true
      ) {
        return true;
      }
    }
    return false;
  });

  // FOR SORTING
  const [selectedSort, setSelectedSort] = useState("");
  const handleSortChange = (sort: any) => {
    setSelectedSort(sort);
    let sortedUsers = [...appointments];

    switch (sort) {
      case "Oldest to Latest":
        sortedUsers.sort((a, b) => {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        });
        break;
      case "Latest to Oldest":
        sortedUsers.sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        break;
      case "Alphabetical (A-Z)":
        sortedUsers.sort((a, b) => a.patientName?.localeCompare(b.patientName));
        break;
      case "Alphabetical (Z-A)":
        sortedUsers.sort((a, b) => b.patientName?.localeCompare(a.patientName));
        break;
      default:
        break;
    }
    setAppointments(sortedUsers);
  };

  //FOR APPOINTMENT TABLE
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("api/dentist/appointment-files");
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        const data: Appointments[] = await response.json();

        setAppointments(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchUsers();
  }, []);

  // FOR SHOW DETAILS
  const toggleModal = (appointment: any) => {
    setSelectedAppointmentDetails(appointment);
    setShowModal(!showModal);
  };

  const formattedDate = (appointmentDate: Date) => {
    return appointmentDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formattedTime = (appointment: any) => {
    const { status, startTime, endTime } = appointment;
    let { timeUnit } = appointment;
    timeUnit = timeUnit.toLowerCase();
    return status == APPOINTMENT_STATUS.pending || (!startTime && !endTime)
      ? timeUnit.toUpperCase()
      : timeUnit == "am"
      ? `${startTime}:00${timeUnit}-${endTime}:00${endTime == 12 ? "pm" : "am"}`
      : `${startTime == 12 ? 12 : startTime - 12}:00${timeUnit}-${
          endTime - 12
        }:00${timeUnit}`;
  };

  const formatDate = (date: any) => {
    const d = new Date(date);
    const options: any = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return d.toLocaleDateString("en", options);
  };

  const [showRecordInfo, setShowRecordInfo] = useState(false)
  const [recordInfo, setRecordInfo] = useState(null)

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/global/appointment");
      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }
      const data = await response.json();
      console.log(data)
      setAppointments(data)
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
    }
  };

  useEffect(() => {
    fetchAppointments()
  }, [])

  const showPatientRecord = (user: any) => {
    setRecordInfo(user)
    setShowRecordInfo(true)
  }

  const print = () => {
    // const contentToPrint = document.getElementById('printable');
    const contentToPrint = document.getElementById('printable-table');

    if (contentToPrint) {
      const printContents = contentToPrint.innerHTML;
      const originalContents = document.body.innerHTML;

      document.body.innerHTML = printContents;
      window.print();
      location.reload();
    }

  }

  const convertToTitleCase = (str: string) => {
    let words = str.match(/[A-Z]?[a-z]+/g) || [];
    let titleCaseString = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return titleCaseString;
  }

  const renderPrintable = (data: any) => {
    return (
      <div className={printableStyles.printable__container}>
        <div id='printable' className={printableStyles.printable}>
          <div className={printableStyles.printable__header}>
            <Image
              className={printableStyles.printable__logo}
              src='/logo.png'
              alt='logo'
              width={250}
              height={0}
            />
            <div>Address: 123 Blk 1 Lot 1 Street Name, Baranggay Name, Baguio City</div>
            <div>Contact No: +639123456789</div>
            <div>Email: dentalfix@dentalfix.com</div>
          </div>
        </div>
        <div className={printableStyles.printable__print}>
          <Button type='secondary' onClick={print}>Print</Button>
        </div>
      </div>
    )
  }

  const [printableModal, setPrintableModal] = useState(true)
  const [isPrinting, setIsPrinting] = useState(false)
  const onClosePrintable = () => {
    setIsGenerateReport(false)
    setPrintableModal(false)
  }

  useEffect(() => {
    if (isPrinting) print()

  }, [isPrinting])
  
  const openPrintableModal = () => {
    // setIsGenerateReport(true)
    // setPrintableModal(true)
    setIsPrinting(true)
  }

  const renderContent = () => {
    console.log("Appointments:", appointments);
    const minDate = new Date("2023-01-01").toISOString().split("T")[0];
    const currentDate = new Date().toISOString().split("T")[0];

    return (
      <>
        {/* MODAL FOR RECORD INFO */}
        {showModal && selectedAppointmentDetails && (
          <Modal
            open={toggleModal}
            setOpen={toggleModal}
            modalWidth={900}
            modalRadius={10}
          >
            {/* Render appointment details here */}
            <div className={styles2.apptDetails_Header}>
              <div>
                <h3>{selectedAppointmentDetails.dentistService}</h3>
              </div>
              <div
                className={`${styles2.appointments__status} 
              ${
                selectedAppointmentDetails.status ==
                APPOINTMENT_STATUS.confirmed
                  ? styles2.appointments__statusConfirmed
                  : selectedAppointmentDetails.status ==
                    APPOINTMENT_STATUS.canceled
                  ? styles2.appointments__statusCanceled
                  : selectedAppointmentDetails.status == APPOINTMENT_STATUS.done
                  ? styles2.appointments__statusDone
                  : selectedAppointmentDetails.status ==
                    APPOINTMENT_STATUS.rescheduled
                  ? styles2.appointments__statusRescheduled
                  : styles2.appointments__statusPending
              }`}
              >
                {selectedAppointmentDetails.status}
              </div>
              <div className={styles.apptDetails_User}>
                <div>
                  <FontAwesomeIcon icon={faUser} color={"#3AB286"} width={15} />
                  <span>
                    {" "}
                    {selectedAppointmentDetails.patientName || name || ""}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles2.apptDetails_Dateprice}>
              <div className={styles2.appointments__details__row}>
                <div className={styles2.appointments__details__rowItem}>
                  <FontAwesomeIcon
                    icon={faCalendar}
                    color={"#3AB286"}
                    width={15}
                  />
                  <span>
                    {formattedDate(new Date(selectedAppointmentDetails.date))}
                  </span>
                </div>
                <div className={styles2.appointments__details__rowItem}>
                  <FontAwesomeIcon
                    icon={faClock}
                    color={"#3AB286"}
                    width={15}
                  />
                  <span>{formattedTime(selectedAppointmentDetails)}</span>
                </div>
                <div className={styles2.appointments__details__rowItem}>
                  <FontAwesomeIcon
                    icon={faWallet}
                    color={"#3AB286"}
                    width={15}
                  />
                  <span>{selectedAppointmentDetails.paymentMethod}</span>
                </div>
                <div className={styles2.appointments__details__rowItem}>
                  <FontAwesomeIcon
                    icon={faMoneyBill}
                    color={"#3AB286"}
                    width={15}
                  />
                  <span>P{selectedAppointmentDetails.price}</span>
                </div>
              </div>

        {isGenerateReport ?
          <Modal open={printableModal} setOpen={setPrintableModal} withCloseButton onClose={onClosePrintable} modalHeight={700} modalWidth={900} modalRadius={10} padding={'0'}>
            {renderPrintable(filteredBySelectedFilters.length > 0 ? filteredBySelectedFilters.filter((user) =>
              (`${user.patientName}`).toLowerCase().includes(searchQuery.toLowerCase())
            ) : searchedAppointment.length > 0 ? searchedAppointment : appointments)}
          </Modal> : <>

            {/* MODAL FOR RECORD INFO */}
            <RecordInfo open={showRecordInfo} setOpen={setShowRecordInfo} recordInfo={recordInfo} />

            <section className={styles.main}>
              <div className={styles.servicecrud}>
                <div className={styles.filters}>
                  <div className={styles.filters__search}>
                    <input type='text' className={styles.filters__searchInput} placeholder='Search appointment...'
                      value={searchQuery}
                      onChange={handleSearchChange} />
                    <FontAwesomeIcon icon={faSearch} width={24} height={24} color={'#737373'} />
                  </div>
                  <div className={styles.filters__sort}>
                    <span className={styles.filters__sortTitle}>Sort By:</span>
                    <div className={styles.filters__sortDropdown}>
                      <select
                        id="sortSelect"
                        value={selectedSort}
                        onChange={(e) => handleSortChange(e.target.value)}
                      >
                        {sortBy.map((sort) => (
                          <option key={sort} value={sort}>
                            {sort}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className={styles.filters__sort}>
                    <span className={styles.filters__sortTitle}>Filter:</span>
                    <div className={styles.filters__sortDetails}>
                      {/* {filterBy.map((filter) => (
                        <label key={filter}>
                          <input
                            type="checkbox"
                            value={filter}
                            onChange={() => handleFilterSelection(filter)}
                            checked={selectedFilters.includes(filter) || (filter === 'All' && selectedFilters.length === filterBy.length - 1)}
                          />
                          {filter}
                        </label>
                      ))} */}

                      {filterBy.map((filter, index) => (
                        <div key={index}>
                          {typeof filter === 'string' ? (
                            <label>
                              <input
                                type="checkbox"
                                value={filter}
                                onChange={() => handleFilterSelection(filter)}
                                checked={
                                  selectedFilters.includes(filter) ||
                                  (filter === 'Select All' && selectedFilters.length === filterBy.filter(item => typeof item === 'string').length)
                                }
                              />
                              {filter}
                            </label>
                          ) : (
                            <div>
                              {filter.label === 'Start Date' && (
                                <>
                                  <label>
                                    <input
                                      type="checkbox"
                                      id="startDateFilter"
                                      checked={selectedFilters.includes(filter.label)}
                                      onChange={() => handleFilterSelection(filter)}
                                    />
                                    Start Date
                                  </label>
                                  {startDateVisible && (
                                    <input
                                      type="date" 
                                      value={startDate ?? ''}
                                      onChange={(e) => setStartDate(e.target.value)}
                                      min={minDate}
                                      max={currentDate}
                                      disabled={startDateDisabled}
                                    />
                                  )}
                                </>
                              )}
                              {filter.label === 'End Date' && (
                                <>
                                  <label>
                                    <input
                                      type="checkbox"
                                      id="endDateFilter"
                                      checked={selectedFilters.includes(filter.label)}
                                      onChange={() => handleFilterSelection(filter)}
                                    />
                                    End Date
                                  </label>
                                  {endDateVisible && (
                                    <input
                                      type="date"
                                      value={endDate ?? ""}
                                      onChange={(e) =>
                                        setEndDate(e.target.value)
                                      }
                                      min={minDate}
                                      max={currentDate}
                                      disabled={endDateDisabled}
                                    />
                                  )}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={styles.filters__sortGenrep}>
                    <Button type='secondary' onClick={openPrintableModal}> Generate Report </Button>
                  </div>
                </div>
                {session && (
                  <main id="printable-table">
                    {isPrinting && <div className={printableStyles.printable__header}>
                      <Image
                        className={printableStyles.printable__logo}
                        src='/logo.png'
                        alt='logo'
                        width={250}
                        height={0}
                      />
                      <div>Address: 123 Blk 1 Lot 1 Street Name, Baranggay Name, Baguio City</div>
                      <div>Contact No: +639123456789</div>
                      <div>Email: dentalfix@dentalfix.com</div>
                    </div>}
                    <table className={styles.table2}>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Patient Name</th>
                          <th> Date </th>
                          <th> Time </th>
                          <th> Service </th>
                          <th> Contact Number</th>
                          {!isPrinting && <th>Appointment Details </th>}
                        </tr>
                      </thead>
                      <tbody>
                        {/* THIS IS FOR FILTER */}
                        {searchQuery.length > 0 ? (
                          searchedAppointment
                            .filter((appointment) =>
                              (`${appointment.patientName}`).toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((appointment, index) => (
                              <tr key={appointment._id}>
                                <td>{index + 1}</td>
                                <td>{appointment.patientName ? `${appointment.patientName}` : ''}</td>
                                <td>{new Intl.DateTimeFormat('en-US', options).format(new Date(appointment.date))}</td>

                                <td>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)} {appointment.timeUnit}</td>
                                <td>{appointment.dentistService}</td>
                                <td>{appointment.contactNumber}</td>
                            
                                {!isPrinting && <td><Button> Show More </Button></td>}

                              </tr>
                            ))
                        ) : (
                            filteredBySelectedFilters.map((appointment, index) => (
                              <tr key={appointment._id}>
                                <td>{index + 1}</td>
                                <td>{appointment.patientName ? `${appointment.patientName}` : ''}</td>
                                <td>{new Intl.DateTimeFormat('en-US', options).format(new Date(appointment.date))}</td>

                                <td>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)} {appointment.timeUnit}</td>
                                <td>{appointment.dentistService}</td>
                                <td>{appointment.contactNumber}</td>
                            
                                {!isPrinting && <td><Button> Show More </Button></td>}
                              </tr>
                            ))
                          )}
                      </tbody>
                    </table>
                  </main>
                )}
              </div>
            </section>
          </>}
      </>
    )
  }

  // const renderPagination = () => {
  //   const pageNumbers = Array.from(
  //     { length: totalPages },
  //     (_, index) => index + 1
  //   );

  //   const handlePageChange = (pageNumber: any) => {
  //     setCurrentPage(pageNumber);
  //   };

  //   return (
  //     <div className={styles.pagination}>
  //       <button
  //         onClick={() => handlePageChange(currentPage - 1)}
  //         disabled={currentPage === 1}
  //       >
  //         <FontAwesomeIcon
  //           icon={faChevronLeft}
  //           width={16}
  //           height={16}
  //           color={"#737373"}
  //         />
  //       </button>
  //       {pageNumbers.map((number) => (
  //         <button
  //           key={number}
  //           onClick={() => handlePageChange(number)}
  //           className={currentPage === number ? styles.active : ""}
  //         >
  //           {number}
  //         </button>
  //       ))}
  //       <button
  //         onClick={() => handlePageChange(currentPage + 1)}
  //         disabled={currentPage === totalPages}
  //       >
  //         <FontAwesomeIcon
  //           icon={faChevronRight}
  //           width={16}
  //           height={16}
  //           color={"#737373"}
  //         />
  //       </button>
  //     </div>
  //   );
  // };
 
  
    return (
      <>
      <ToastContainer />
        {status !== "loading" &&
          session &&
            <DentistLayout>{renderContent()}</DentistLayout>
          }
      </>
    );
  };

  return (
    <>
      <ToastContainer />
      {status !== "loading" && session && (
        <DentistLayout>{renderContent()}</DentistLayout>
      )}
    </>
  );
}
