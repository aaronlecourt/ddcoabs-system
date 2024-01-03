import { useState, useEffect } from "react";
import printableStyles from '../styles/pages/accounts.module.scss'
import connectMongo from "../utils/connectMongo";
import { getSession } from "next-auth/react";
import styles from "../styles/pages/home.module.scss";
import DentistLayout from "../layouts/DentistLayout";
import useAuthGuard from "../guards/auth.guard";
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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";
import RecordInfo from "../components/RecordInfo";

  interface Appointments {
    _id: string;
    patientName: string;
    date: Date;
    startTime: number;
    endTime: number;
    timeUnit: string;
    dentistService: number;
    contactNumber: string;
    status: string;
    createdAt: string;
    isWalkIn: boolean;
  }
  
  
  export default function Home( ){
    const { session, status } = useAuthGuard();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [appointments, setAppointments] = useState<Appointments[]>([])

    const [searchTerm, setSearchTerm] = useState('');
    const sortBy = ['Latest to Oldest', 'Oldest to Latest', 'Alphabetical (A-Z)', 'Alphabetical (Z-A)', 'Pending First'];
  
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    // const totalPages = Math.max(Math.ceil(filteredAppointments.length / itemsPerPage), 1);

    // FOR DATE CONVERSION
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };

    // FOR TIME CONVERSION
    const formatTime = (time?: number): string => {
        if (time === undefined) return ''; // Handle undefined time
        const hours = (time % 12 || 12).toString();
        return `${hours}:00`;
    }

    // SEARCH
    const [searchQuery, setSearchQuery] = useState('');

    const searchedAppointment = appointments.filter((appointment) => {
        const lowerCaseSearch = searchQuery.toLowerCase();
      
        const patientNameMatch = appointment.patientName?.toLowerCase().includes(lowerCaseSearch);
        
        // Search by date (month)
        const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(appointment.date)).toLowerCase();
        const dateMatch = month.includes(lowerCaseSearch);
      
        // Search by dental service
        const dentalServiceMatch = appointment.dentistService.toString().includes(lowerCaseSearch);
      
        // Search by start time
        const startTimeMatch = formatTime(appointment.startTime).includes(lowerCaseSearch);
      
        return patientNameMatch || dateMatch || dentalServiceMatch || startTimeMatch;
      });

      
    console.log('Searched Data:', searchedAppointment);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      console.log('Search Query:', e.target.value);
    }; 
      
    //FILTER
    const filterBy= ['Select All', 'Today', 'Pending', 'Confirmed', 'Rescheduled', 'Done', 'Walk In', 
    { label: 'Start Date', type: 'date', key: 'startDate' },
    { label: 'End Date', type: 'date', key: 'endDate' },]
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);

    const initialSelectedFilters: string[] = filterBy
      .filter((item) => typeof item === 'string' && item !== 'Select All')
      .map((item) => item as string);

    const startDateDisabled = !selectedFilters.includes('Start Date');
    const endDateDisabled = !selectedFilters.includes('End Date');

    const [startDateVisible, setStartDateVisible] = useState(false);
    const [endDateVisible, setEndDateVisible] = useState(false);
    
    const handleFilterSelection = (filter: string | { label: string; type: string; key: string }) => {
      if (typeof filter === 'string') {
        if (filter === 'Select All') {
          if (selectedFilters.length === filterBy.filter(item => typeof item === 'string').length) {
            setSelectedFilters([]); // Uncheck all if 'Select All' was previously checked
          } else {
            setSelectedFilters(filterBy.filter(item => typeof item === 'string') as string[]);
          }
        } else if (filter === 'Start Date' || filter === 'End Date') {
          if (selectedFilters.includes(filter)) {
            setSelectedFilters(selectedFilters.filter(selectedFilter => selectedFilter !== filter));
          } else {
            setSelectedFilters([...selectedFilters, filter]);
          }
        } else {
          if (selectedFilters.includes(filter)) {
            setSelectedFilters(selectedFilters.filter(selectedFilter => selectedFilter !== filter));
          } else {
            setSelectedFilters([...selectedFilters, filter]);
          }
        }
      } else {
        const dateFilter = filter as { label: string; type: string; key: string };
        if (dateFilter.key === 'startDate') {
          setStartDateVisible(!startDateVisible);
          setEndDateVisible(false);
        } else if (dateFilter.key === 'endDate') {
          setEndDateVisible(!endDateVisible);
          setStartDateVisible(false);
        }
      }
    };

      const filteredBySelectedFilters = appointments.filter((appointment) => {
        if (selectedFilters.length === 0) {
          return true;
        } else {
          if (selectedFilters.includes('Today') && appointment.status === 'Today') {
            return true;
          }
          if (selectedFilters.includes('Pending') && appointment.status === 'Pending') {
            return true;
          }
          if (selectedFilters.includes('Confirmed') && appointment.status === 'Confirmed') {
            return true;
          }
          if (selectedFilters.includes('Rescheduled') && appointment.status === 'Rescheduled') {
            return true;
          }
          if (selectedFilters.includes('Done') && appointment.status === 'Done') {
            return true;
          }
          if (selectedFilters.includes('Walk In') && appointment.isWalkIn === true) {
            return true;
          }
        }
        return false;
      });
      
      // FOR SORTING
      const [selectedSort, setSelectedSort] = useState('');
      const handleSortChange = (sort: any) => {

        setSelectedSort(sort);
        let sortedUsers = [...appointments]
    
          switch(sort){
            case 'Oldest to Latest':
              sortedUsers.sort((a, b) => {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
              });
              break;
            case 'Latest to Oldest':
              sortedUsers.sort((a, b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              });
              break;
            case 'Alphabetical (A-Z)':
              sortedUsers.sort((a, b) => a.patientName?.localeCompare(b.patientName));
              break;
            case 'Alphabetical (Z-A)':
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
            const response = await fetch('api/dentist/appointment-files');
            if (!response.ok) {
            throw new Error('Failed to fetch services');
            }
            const data: Appointments[] = await response.json();
    
            setAppointments(data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
        };
    
        fetchUsers();
    }, []); 

    // FOR SHOW MORE
    const showAppointmentRecord = (appointment: any) => {
      setRecordInfo(appointment)
      setShowRecordInfo(true)
    }

    // FOR SHOW RECORD AND GENERATE REPORT
    const [showRecordInfo, setShowRecordInfo] = useState(false)
    const [recordInfo, setRecordInfo] = useState(null)
    const [isGenerateReport, setIsGenerateReport] = useState(false)

    const convertToTitleCase = (str: string) => {
      let words = str.match(/[A-Z]?[a-z]+/g) || [];
      let titleCaseString = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      return titleCaseString;
    }

    const formatDate = (date: any) => {
      const d = new Date(date)
      const options: any = {
        year: "numeric",
        month: "long",
        day: "numeric"
      };
      return d.toLocaleDateString('en', options);
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
            {data.map((recordInfo: any) => <div key={recordInfo._id}>
              <div className={printableStyles.record}>
                <h3 className={printableStyles.title}>Appointment Information Record</h3>
                <div className={printableStyles.information__content}>
                  <div className={printableStyles.information__contentRow}>
                    <div className={printableStyles.information__data}>
                      <label>Patient Name: </label>
                      <span>{recordInfo.lastName}, {recordInfo.firstName}</span>
                    </div>
                    <div className={printableStyles.information__data}>
                      <label>Service: </label>
                      <span>{recordInfo.contactNumber}</span>
                    </div>
                    <div className={printableStyles.information__data}>
                      <label>Status: </label>
                      <span>{recordInfo.contactNumber}</span>
                    </div>
                  </div>
                  <div className={printableStyles.information__contentRow}>
                    <div className={printableStyles.information__data}>
                      <label>Date of Birth: </label>
                      <span>{formatDate(recordInfo.dateOfBirth)}</span>
                    </div>
                    <div className={printableStyles.information__data}>
                        <label>Time: </label>
                        {/* <span>{appointment.startTime}:00 {appointment.timeUnit} - {appointment.endTime}:00 {appointment.timeUnit}</span> */}
                      </div>
                  </div>
                  <div className={printableStyles.information__contentRow}>
                    <div className={printableStyles.information__data}>
                      <label>Form of Payment: </label>
                      <span>{recordInfo.age}</span>
                    </div>
                    <div className={printableStyles.information__data}>
                      <label>Amount to be Paid: </label>
                      <span>{recordInfo.guardianContactNumber}</span>
                    </div>
                  </div>
                  <div className={printableStyles.information__contentRow}>
                    <div className={printableStyles.information__data}>
                      <label>Religion: </label>
                      <span>{recordInfo.religion}</span>
                    </div>
                  </div>
                  <div className={printableStyles.information__contentRow}>
                    <div className={printableStyles.information__data}>
                      <label>Nationality: </label>
                      <span>{recordInfo.nationality}</span>
                    </div>
                  </div>
                  <div className={printableStyles.information__contentRow}>
                    <div className={printableStyles.information__data}>
                      <label>Home Address: </label>
                      <span>{recordInfo.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>)}
          </div>
          <div className={printableStyles.printable__print}>
            <Button type='secondary' onClick={print}>Print</Button>
          </div>
        </div>
      )
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
      const minDate = new Date('2023-01-01').toISOString().split('T')[0];
      const currentDate = new Date().toISOString().split('T')[0]; 
      
      return (
        <>

        {/* MODAL FOR RECORD INFO */}
        <RecordInfo open={showRecordInfo} setOpen={setShowRecordInfo} recordInfo={recordInfo} />
        
          {session && (
            <main className={styles.main2}>
              <h1 className={styles.title}>Appointments</h1>
              <div className={styles.container}>
                <section>
                  <div className={styles.filters}>
                    <div className={styles.filters__search}>
                    <input
                        type="text"
                        className={styles.filters__searchInput}
                        placeholder="Search appointment..."
                        value={searchQuery} // Update this line
                        onChange={handleSearchChange}
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
                    <div className={styles.filters__sort}>
                        <span className={styles.filters__sortTitle}>Filter:</span>
                        <div className={styles.filters__sortDetails}>
                            {/* {filterBy.map((filter) => (
                                <label key={filter}>
                                     {filter === 'Start Date' || filter === 'End Date' ? (
                                        <input
                                            type="date"
                                            value={filter === 'Start Date' ? (startDate ?? '') : (endDate ?? '')}
                                            onChange={(e) => {
                                                filter === 'Start Date' ? setStartDate(e.target.value) : setEndDate(e.target.value);
                                            }}
                                            min={filter === 'Start Date' ? '' : startDate ?? ''}
                                            style={{
                                                display:
                                                    selectedFilters.includes('Start Date') || selectedFilters.includes('End Date')
                                                        ? 'inline-block'
                                                        : 'none',
                                            }}
                                        />
                                    ) : (
                                        <input
                                            type="checkbox"
                                            value={filter}
                                            onChange={() => handleFilterSelection(filter)}
                                            checked={
                                                selectedFilters.includes(filter) ||
                                                (filter === 'All' && selectedFilters.length === filterBy.length - 1)
                                            }
                                        />
                                    )}
                                    {filter}
                                </label>
                            ))} */}
                          {/* {filterBy.map((filter, index) => (
                            <label key={index}>
                              {typeof filter === 'string' ? (
                                <input
                                    type="checkbox"
                                    value={filter}
                                    onChange={() => handleFilterSelection(filter)}
                                    checked={
                                        selectedFilters.includes(filter) ||
                                        (filter === 'All' && selectedFilters.length === filterBy.length - 1)
                                    }
                                />
                              ) : (
                                <div>
                                  {filter.label === 'Start Date' && startDateVisible && (
                                    <input
                                      type="date"
                                      value={startDate ?? ''}
                                      onChange={(e) => setStartDate(e.target.value)}
                                      min={minDate}
                                      max={currentDate}
                                      disabled={startDateDisabled}
                                      // Add any other attributes you need here
                                    />
                                  )}
                                  {filter.label === 'End Date' && endDateVisible && (
                                    <input
                                      type="date"
                                      value={endDate ?? ''}
                                      onChange={(e) => setEndDate(e.target.value)}
                                      min={minDate}
                                      max={currentDate}
                                      disabled={endDateDisabled}
                                      // Add any other attributes you need here
                                    />
                                  )}
                                </div>
                              )}
                              {typeof filter === 'string' ? filter : filter.label}
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
                value={endDate ?? ''}
                onChange={(e) => setEndDate(e.target.value)}
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
                  </div>
                </section>
              </div>

              <section>
                <table className={styles.table2}>
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>Patient Name</th>
                        <th>Date </th>
                        <th>Time</th>
                        <th>Service</th>
                        <th>Contact Number</th>
                        <th>Appointment Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {filteredBySelectedFilters.length > 0
                            ? filteredBySelectedFilters.map((appointment: any, index: any) => (
                                <tr key={appointment._id}>
                                <td>{index + 1}</td>
                                <td>{appointment.patientName}</td>
                                <td>{new Intl.DateTimeFormat('en-US', options).format(new Date(appointment.date))}</td>
                                <td>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)} {appointment.timeUnit}</td>
                                <td>{appointment.dentistService}</td>
                                <td>{appointment.contactNumber}</td>
                                <td><Button> Show More </Button></td>
                                </tr>
                            ))
                            : searchedAppointment.map((appointment: any, index: any) => (
                            <tr key={appointment._id}>
                            <td>{index + 1}</td>
                            <td>{appointment.patientName}</td>
                            <td>{new Intl.DateTimeFormat('en-US', options).format(new Date(appointment.date))}</td>
                            <td>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)} {appointment.timeUnit}</td>
                            <td>{appointment.dentistService}</td>
                            <td>{appointment.contactNumber}</td>
                            <td><Button> Show More </Button></td>
                            </tr>
                        ))} */}
                        
                        {searchQuery
                          ? searchedAppointment.map((appointment: any, index: any) => (
                              <tr key={appointment._id}>
                                <td>{index + 1}</td>
                                <td>{appointment.patientName}</td>
                                <td>{new Intl.DateTimeFormat('en-US', options).format(new Date(appointment.date))}</td>
                                <td>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)} {appointment.timeUnit}</td>
                                <td>{appointment.dentistService}</td>
                                <td>{appointment.contactNumber}</td>
                                <td><Button onClick={() => showAppointmentRecord(appointment)}> Show More </Button></td>
                              </tr>
                            ))
                          : filteredBySelectedFilters.map((appointment: any, index: any) => (
                              <tr key={appointment._id}>
                                <td>{index + 1}</td>
                                <td>{appointment.patientName}</td>
                                <td>{new Intl.DateTimeFormat('en-US', options).format(new Date(appointment.date))}</td>
                                <td>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)} {appointment.timeUnit}</td>
                                <td>{appointment.dentistService}</td>
                                <td>{appointment.contactNumber}</td>
                                <td><Button> Show More </Button></td>
                              </tr>
                            ))}
                    </tbody>

                </table>
              </section>

              <div className={styles.filters__sortGenrep}>
                  <Button type='secondary' onClick={openPrintableModal}> Generate Report </Button>
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
            <DentistLayout>{renderContent()}</DentistLayout>
          }
      </>
    );
  }