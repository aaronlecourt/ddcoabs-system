import { useState, useEffect } from "react";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
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
import { IAppointment } from "./interfaces/IAppointment";
import { IUser } from "./interfaces/IUser";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const filterBy= ['Select All', 'Today', 'Pending', 'Confirmed', 'Rescheduled', 'Done', 'Walk In', 'Start Date End Date']
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);

    const handleFilterSelection = (filter: string) => {
        if (filter === 'Select All'){
          if (selectedFilters.length === filterBy.length - 1) {
            setSelectedFilters([]); // Uncheck all if 'All' was previously checked
          } else {
            setSelectedFilters(filterBy.filter((item) => item !== 'Select All'));
          }
        }
         else if (selectedFilters.includes(filter)) {
          setSelectedFilters(selectedFilters.filter((selectedFilter) => selectedFilter !== filter));
        } else {
          setSelectedFilters([...selectedFilters, filter]);
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
  
    const renderContent = () => {
      console.log("Appointments:", appointments);
      
      return (
        <>
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
                            {filterBy.map((filter) => (
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
                                <td><Button> Show More </Button></td>
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