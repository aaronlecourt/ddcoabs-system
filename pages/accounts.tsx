import { useEffect, useRef, useState } from 'react';
import styles from '../styles/pages/services.module.scss'
import styles1 from '../styles/pages/home.module.scss'
import printableStyles from '../styles/pages/accounts.module.scss'
import DentistLayout from '../layouts/DentistLayout';
import useAuthGuard from '../guards/auth.guard';
import Button from '../components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive, faBoxArchive, faChevronDown, faChevronLeft, faChevronRight, faFileArchive, faFolder, faPencil, faSearch } from '@fortawesome/free-solid-svg-icons';
import { UpdateProfileFormData } from '../types/profile';
import Modal from '../components/Modal';
import ArchiveButton from '../components/ArchiveButton';
import { fileURLToPath } from 'url';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import User from '../models/User';
import CancelButton from '../components/CancelButton';
import RecordInfo from '../components/RecordInfo';
import Image from 'next/image';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: number;
  age: number;
  sex: string;
  tempRole: string;
  role: string;
  createdAt: string;
  isArchived: boolean;
}

export default function Accounts() {
  const { session, status } = useAuthGuard();
  const [users, setUsers] = useState<User[]>([])
  const [sortedUsers, setSortedUsers] = useState<User[]>([])
  const roles = ['patient', 'dentist', 'employee'];

  // SEARCH
  const [searchQuery, setSearchQuery] = useState('');

  const searchedUser = users.filter((user) =>
    (`${user.firstName} ${user.lastName}`).toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log('Filtered Users:', searchedUser);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    console.log('Search Query:', e.target.value);
  };

  // FOR PAGINATION
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  const totalPages = Math.max(
    Math.ceil(searchedUser.length / itemsPerPage),
    1
  );


  // SORT BY
  const sortBy = ['Oldest to Latest', 'Latest to Oldest', 'Alphabetical (A-Z)', 'Alphabetical (Z-A)']
  const [selectedSort, setSelectedSort] = useState('');

  const handleSortChange = (sort: any) => {

    setSelectedSort(sort);
    let sortedUsers = [...users]

    switch (sort) {
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
        sortedUsers.sort((a, b) => (`${a.firstName} ${a.lastName}`).localeCompare(`${b.firstName} ${b.lastName}`));
        break;
      case 'Alphabetical (Z-A)':
        sortedUsers.sort((a, b) => (`${b.firstName} ${b.lastName}`).localeCompare(`${a.firstName} ${a.lastName}`));
        break;
      default:
        break;
    }
    setUsers(sortedUsers);
  };

  //FILTER
  const filterBy = ['All', 'Dentist', 'Employee', 'Patient', 'Male', 'Female', 'Minor', 'Adult']
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleFilterSelection = (filter: string) => {
    if (filter === 'All') {
      if (selectedFilters.length === filterBy.length - 1) {
        setSelectedFilters([]); // Uncheck all if 'All' was previously checked
      } else {
        setSelectedFilters(filterBy.filter((item) => item !== 'All'));
      }
    }
    else if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((selectedFilter) => selectedFilter !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const filteredBySelectedFilters = users.filter((user) => {
    if (selectedFilters.length === 0) {
      return true; // If no filters selected, show all records
    } else {
      // Check if the user matches all selected filters
      return selectedFilters.every((filter) => {
        if (filter === 'Dentist' && user.role === 'dentist') {
          return true;
        }
        if (filter === 'Employee' && user.role === 'employee') {
          return true;
        }
        if (filter === 'Patient' && user.role === 'patient') {
          return true;
        }
        if (filter === 'Male' && user.sex === 'M') {
          return true;
        }
        if (filter === 'Female' && user.sex === 'F') {
          return true;
        }
        if (filter === 'Minor' && (user.age > 1 && user.age < 18)) {
          return true;
        }
        if (filter === 'Adult' && user.age >= 18) {
          return true;
        }
        return false; // Return false if the user doesn't match a filter
      });
    }
  });
  
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const queryParams = `?search=${searchQuery}&filter=${selectedFilters}`; // Include search and filter parameters
        const response = await fetch(`api/dentist/accounts/role${queryParams}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        
        const data: User[] = await response.json();
        setUsers(data);
  
        const totalPages = Math.max(Math.ceil(data.length / itemsPerPage), 1);
        if (currentPage > totalPages) {
          setCurrentPage(totalPages);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
  
    fetchAccounts();
  }, [searchQuery, selectedFilters, currentPage]);

  //FOR USER TABLE
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('api/dentist/accounts/role');
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data: User[] = await response.json();

        setUsers(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchUsers();
  }, []);

  // Update the table whenever 'services' state changes
  useEffect(() => {
  }, [users]); // Add 'services' to the dependency arr

  const [updateUserFormData, setUpdateUserFormData] = useState<UpdateProfileFormData>({
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: 0,
    age: 0,
    sex: '',
    role: '',
    createdAt: '',
    isArchived: false,
  })

  const [showArchiveUser, setShowArchiveUser] = useState(false)
  const [showValiUser, setShowValiUser] = useState(false)
  const [showValiUserPatient, setShowValiUserPatient] = useState(false)

  // UPDATE USER ROLE BUTTONS
  const onUpdateUser = (user: User, buttonName: string) => {

    if (buttonName === 'updateRole') {
      const userId = user._id;
      const selectedRole = tempRoles[userId] || user.role;
      console.log("UPDATED ROLE: ", selectedRole)

      setUpdateUserFormData({
        ...user,
        role: selectedRole,
        isArchived: user.isArchived,
      });

      setShowValiUser(true);

    } else if (buttonName === 'archiveUser') {

      setShowArchiveUser(true);

      setUpdateUserFormData({
        ...user,
        isArchived: true
      });

    } else if (buttonName === 'updateRolePatient') {
      setShowValiUserPatient(true);
      setUpdateUserFormData({
        ...user,
        role: 'patient'
      });

      // updateUserRole(undefined, user._id);
    }

  };

  // ROLE UPDATE
  const [tempRoles, setTempRoles] = useState<Record<string, string>>({});

  const handleRoleChange = (selectedRole: string, userId: string, index: number) => {
    setTempRoles((prevRoles) => ({
      ...prevRoles,
      [userId]: selectedRole,
    }));

    console.log('Temp roles after selection:', selectedRole);
    console.log('ID after update:', userId);
    console.log('Updated Temp Roles:', tempRoles);
    const updatedUsers = [...users];
    updatedUsers[index].role = selectedRole;
  };

  //UPDATE USER ROLE
  const updateUserRole = async (e: any, userId: string) => {
    if (e) {
      e.preventDefault();
    }

    const updatedData = { ...updateUserFormData, _id: userId };

    try {
      const response = await fetch(`/api/dentist/accounts/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error('Update role failed: ' + JSON.stringify(error));
      } else {
        const updatedUser = await response.json();
        console.log('User role updated: ', updatedUser);
        setShowValiUser(false);
        setShowValiUserPatient(false);
        toast.success ('User role updated successfully!')
        setTimeout(() => {
          window.location.href = '/accounts';
        }, 5000);
        setUsers((prevServices) =>
          prevServices.map((prevService) =>
            prevService._id === updatedUser._id ? updatedUser : prevService
          )
        );
      }
    } catch (error) {
      toast.error('Update role failed');
      console.error('Error updating role:', error);
    }

  };

  //ARCHIVES USER
  const archiveUser = async (e: any) => {
    e.preventDefault();

    const updatedData = { ...updateUserFormData };
    updatedData.isArchived = true;

    setUpdateUserFormData(updatedData);

    console.log('Update User Form Data:', updatedData);

    fetch(`/api/dentist/accounts/archive`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    })
      .then(async (response) => {
        if (!response.ok) {
          const error = await response.json();
          toast.error('Archiving failed: ' + JSON.stringify(error));
        } else {
          const updatedUser = await response.json();
          console.log('User updated: ', updatedUser);
          setShowArchiveUser(false); 
          toast.success ('User archived successfully!')
          setTimeout(() => {
            window.location.href = '/accounts';
          }, 5000);
            setUsers((prevUsers) =>
            prevUsers.map((prevUser) =>
              prevUser._id === updatedUser._id ? updatedUser : prevUser
            )
          );

          setUsers((prevServices) =>
            prevServices.filter((service) => service._id !== updatedUser._id)
          );

        }
      })
      .catch((error) => {
        toast.error('Update failed');
        console.error('Error updating service:', error);
      });
  }

  const [showRecordInfo, setShowRecordInfo] = useState(false)
  const [recordInfo, setRecordInfo] = useState(null)
  const [isGenerateReport, setIsGenerateReport] = useState(false)
  const [appointments, setAppointments] = useState([])

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

  const formatDate = (date: any) => {
    const d = new Date(date)
    const options: any = {
      year: "numeric",
      month: "long",
      day: "numeric"
    };
    return d.toLocaleDateString('en', options);
  }

  const showPatientRecord = (user: any) => {
    setRecordInfo(user)
    setShowRecordInfo(true)
  }

  const medicalHistory = (appointment: any) => {
    const details = appointment.details;
    delete details.physicianName;
    delete details.officeAddress;
    delete details.specialty;
    delete details.officeNumber;
    delete details.previousDentist;
    delete details.previousTreatment;
    delete details.lastDentalVisit;
    if (Array.isArray(details.others)) {
      details.others = details.others.join(', ');
    }

    return details;
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
          {data.map((recordInfo: any) => <div key={recordInfo._id}>
            <div className={printableStyles.record}>
              <h3 className={printableStyles.title}>Patient Information Record</h3>
              <div className={printableStyles.information__content}>
                <div className={printableStyles.information__contentRow}>
                  <div className={printableStyles.information__data}>
                    <label>Name: </label>
                    <span>{recordInfo.lastName}, {recordInfo.firstName}</span>
                  </div>
                  <div className={printableStyles.information__data}>
                    <label>Contact Number: </label>
                    <span>{recordInfo.contactNumber}</span>
                  </div>
                </div>
                <div className={printableStyles.information__contentRow}>
                  <div className={printableStyles.information__data}>
                    <label>Sex: </label>
                    <span>{recordInfo.sex == 'M' ? 'Male' : 'Female'}</span>
                  </div>
                  <div className={printableStyles.information__data}>
                    <label>Email: </label>
                    <span>{recordInfo.email}</span>
                  </div>
                </div>
                <div className={printableStyles.information__contentRow}>
                  <div className={printableStyles.information__data}>
                    <label>Date of Birth: </label>
                    <span>{formatDate(recordInfo.dateOfBirth)}</span>
                  </div>
                  <div className={printableStyles.information__data}>
                    <label>Emergency Contact: </label>
                    <span>{recordInfo.guardianName}</span>
                  </div>
                </div>
                <div className={printableStyles.information__contentRow}>
                  <div className={printableStyles.information__data}>
                    <label>Age: </label>
                    <span>{recordInfo.age}</span>
                  </div>
                  <div className={printableStyles.information__data}>
                    <label>Contact Number: </label>
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
            <div>
              <h3 className={printableStyles.title}>Appointment Record</h3>
              <div className={`${printableStyles.information} ${printableStyles.informationAppointmentsPrintable}`}>
                {appointments.filter((i: any) => i.patientId == recordInfo._id).length > 0 ? appointments.filter((i: any) => i.patientId == recordInfo._id).map((appointment: any) =>
                  <div key={appointment._id} className={printableStyles.printable__information__appointment}>
                    <div className={`${printableStyles.information__appointment__body} ${printableStyles.information__appointment__body__printable}`}>
                      <div className={printableStyles.information__content}>
                        <div className={printableStyles.information__contentTitle}>Appointment Details</div>
                        <div className={printableStyles.information__contentRow}>
                          <div className={printableStyles.information__data}>
                            <label>Service: </label>
                            <span>{appointment.dentistService}</span>
                          </div>
                          <div className={printableStyles.information__data}>
                            <label>Price: </label>
                            <span>{appointment.price}</span>
                          </div>
                        </div>
                        <div className={printableStyles.information__contentRow}>
                          <div className={printableStyles.information__data}>
                            <label>Date: </label>
                            <span>{formatDate(appointment.date)}</span>
                          </div>
                          <div className={printableStyles.information__data}>
                            <label>Payment Method: </label>
                            <span>{appointment.paymentMethod}</span>
                          </div>
                        </div>
                        <div className={printableStyles.information__contentRow}>
                          <div className={printableStyles.information__data}>
                            <label>Time: </label>
                            <span>{appointment.startTime}:00 {appointment.timeUnit} - {appointment.endTime}:00 {appointment.timeUnit}</span>
                          </div>
                        </div>
                      </div>
                      <div className={printableStyles.information__content}>
                        <div className={printableStyles.information__contentTitle}>Medical History</div>
                        <div className={printableStyles.information__contentRow}>
                          <div className={printableStyles.information__data}>
                            <label>Name of Physician: </label>
                            <span>{appointment.physicianName}</span>
                          </div>
                          <div className={printableStyles.information__data}>
                            <label>Specialty: </label>
                            <span>{appointment.details.specialty}</span>
                          </div>
                        </div>
                        <div className={printableStyles.information__contentRow}>
                          <div className={printableStyles.information__data}>
                            <label>Office Address: </label>
                            <span>{appointment.details.officeAddress}</span>
                          </div>
                          <div className={printableStyles.information__data}>
                            <label>Office Number: </label>
                            <span>N/A</span>
                          </div>
                        </div>
                        {Object.keys(medicalHistory(appointment)).map((key, index) =>
                          <div key={index}
                            className={printableStyles.information__contentRow}>
                            <div className={printableStyles.information__data}>
                              <label>{index + 1}. {convertToTitleCase(key)}</label>
                            </div>
                            <div className={printableStyles.information__data}>
                              <span>{appointment.details[key].toString().toUpperCase()}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className={printableStyles.information__content}>
                        <div className={printableStyles.information__contentTitle}>Dental History</div>
                        <div className={printableStyles.information__contentRow}>
                          <div className={printableStyles.information__data}>
                            <label>Previous Dentist: </label>
                            <span>{appointment.details.previousDentist}</span>
                          </div>
                          <div className={printableStyles.information__data}>
                            <label>Service Availed: </label>
                            <span>{appointment.details.previousTreatment}</span>
                          </div>
                        </div>
                        <div className={printableStyles.information__contentRow}>
                          <div className={printableStyles.information__data}>
                            <label>Last Dental Visit: </label>
                            <span>{appointment.details.lastDentalVisit}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>) : <>No Appointments</>}
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
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = searchedUser.slice(startIndex, endIndex);

    let content;
    if (searchedUser.length === 0) {
      content = (
        <>
          <table className={styles.table}>
            <tbody>
              <td>No services were found.</td>
            </tbody>
          </table>
          <div>{renderPagination()}</div>
        </>
      );
    } else {
      content = (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Contact Number</th>
                <th> Email Address </th>
                <th> Age </th>
                <th> Sex </th>
                <th> User Role </th>
                <th> Appointment Record </th>
                <th> Action </th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                    <td>{user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : ''}</td>
                    <td>{user.contactNumber}</td>
                    <td>{user.email}</td>
                    <td>{user.age}</td>
                    <td>{user.sex === 'M' ? 'Male' : 'Female'}</td>
                    {!isPrinting ? <td className={styles1.filters__sortDropdown}>
                      <select
                        // value={user.role}
                        value={
                          tempRoles[user._id] !== undefined
                            ? tempRoles[user._id]
                            : user.role
                        }
                        onChange={(e) => handleRoleChange(e.target.value, user._id, index)}
                        onBlur={() => {
                          setTempRoles((prevRoles) => {
                            const updatedRoles = { ...prevRoles };
                            delete updatedRoles[user._id];
                            return updatedRoles;
                          });
                        }}
                      >
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td> : <td>{tempRoles[user._id] !== undefined
                            ? tempRoles[user._id]
                            : user.role
                          }</td>}
                    {!isPrinting &&
                      <>
                        <td>
                          {(user.role !== 'dentist' || tempRoles[user._id] === 'dentist') && (
                            <CancelButton onClick={() => showPatientRecord(user)}> Show More </CancelButton>
                          )}
                        </td>
                        <td className={styles1.tableAction}>
                          <Button
                            type='secondary'
                            onClick={(e: any) => {
                              const userId = user._id;
                              const selectedRole = tempRoles[userId] || user.role;;
                              console.log("userId: ", userId)
                              console.log("selectedRole: ", selectedRole)
                              console.log("Temp role: ", tempRoles[userId])

                              if (selectedRole === 'dentist' || selectedRole === 'employee') {
                                console.log('Showing modal for admin or employee users');
                                setShowValiUser(true);
                                onUpdateUser(user, 'updateRole');
                              } else {
                                setShowValiUserPatient(true);
                                onUpdateUser(user, 'updateRolePatient');
                              }
                            }}
                          >
                            Update Role
                          </Button>
                          {(user.role !== 'dentist' || tempRoles[user._id] === 'dentist') && (
                            <ArchiveButton onClick={(e: any) => {
                              const selectedRole = e.target.value;
                              onUpdateUser(user, 'archiveUser')
                            }}>
                              <FontAwesomeIcon
                                icon={faFileArchive}
                                width={24}
                                height={24}
                                color={'#ffffff'}
                              />
                            </ArchiveButton>
                          )}

                        </td>
                      </>}
                  
                </tr>
              ))}
            </tbody>
          </table>
          <div>{renderPagination()}</div>
        </>
      );
    }

    return (
      
      <>
        {isGenerateReport ?
          <Modal open={printableModal} setOpen={setPrintableModal} withCloseButton onClose={onClosePrintable} modalHeight={700} modalWidth={900} modalRadius={10} padding={'0'}>
            {renderPrintable(filteredBySelectedFilters.length > 0 ? filteredBySelectedFilters.filter((user) =>
              (`${user.firstName} ${user.lastName}`).toLowerCase().includes(searchQuery.toLowerCase())
            ) : searchedUser.length > 0 ? searchedUser : users)}
          </Modal> : <>
            {/* MODAL FOR ARCHIVE */}
            <Modal open={showArchiveUser} setOpen={setShowArchiveUser} modalWidth={400} modalRadius={10}>
              <h3 className={styles1.cancelTitle}> WARNING! </h3>
              <p> Are you sure you want to archive this user?</p>
              <input type='hidden' name="_id" value={updateUserFormData._id} />
              <div className={styles1.cancelActions}>
                <CancelButton onClick={() => setShowArchiveUser(false)}>No</CancelButton>
                <Button onClick={archiveUser} type="submit">Yes</Button>
              </div>
            </Modal>

            {/* MODAL FOR ADMIN/EMPLOYEE VALIDATION */}
            <Modal open={showValiUser} setOpen={setShowValiUser} modalWidth={400} modalRadius={10}>
              <h3 className={styles1.cancelTitle}> WARNING! </h3>
              <p> Are you sure you want this user to be an admin or employee?</p>
              <input type='hidden' name="_id" value={updateUserFormData._id} />
              <div className={styles1.cancelActions}>
                <CancelButton onClick={() => setShowValiUser(false)}>No</CancelButton>
                <Button onClick={(e: any) => updateUserRole(e, updateUserFormData._id)} type="submit">Yes</Button>
              </div>
            </Modal>

            {/* MODAL FOR PATIENT VALIDATION */}
            <Modal open={showValiUserPatient} setOpen={setShowValiUserPatient} modalWidth={400} modalRadius={10}>
              <h3 className={styles1.cancelTitle}> WARNING! </h3>
              <p> Are you sure you want this user to be a patient? </p>
              <input type='hidden' name="_id" value={updateUserFormData._id} />
              <div className={styles1.cancelActions}>
                <Button type='secondary' onClick={() => setShowValiUserPatient(false)}>No</Button>
                <Button onClick={(e: any) => updateUserRole(e, updateUserFormData._id)} type="submit">Yes</Button>
              </div>
            </Modal>

            {/* MODAL FOR RECORD INFO */}
            <RecordInfo open={showRecordInfo} setOpen={setShowRecordInfo} recordInfo={recordInfo} />

            <section className={styles1.main}>
              <div className={styles1.servicecrud}>
                <div className={styles1.filters}>
                  <div className={styles1.filters__search}>
                    <input type='text' className={styles1.filters__searchInput} placeholder='Search account name...'
                      value={searchQuery}
                      onChange={handleSearchChange} />
                    <FontAwesomeIcon icon={faSearch} width={24} height={24} color={'#737373'} />
                  </div>
                  <div className={styles1.filters__sort}>
                    <span className={styles1.filters__sortTitle}>Sort By:</span>
                    <div className={styles1.filters__sortDropdown}>
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
                  <div className={styles1.filters__sort}>
                    <span className={styles1.filters__sortTitle}>Filter:</span>
                    <div className={styles1.filters__sortDetails}>
                      {filterBy.map((filter) => (
                        <label key={filter}>
                          <input
                            type="checkbox"
                            value={filter}
                            onChange={() => handleFilterSelection(filter)}
                            checked={selectedFilters.includes(filter) || (filter === 'All' && selectedFilters.length === filterBy.length - 1)}
                          />
                          {filter}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className={styles1.filters__sortGenrep}>
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
                          <th>Full Name</th>
                          <th>Contact Number </th>
                          <th>Email Address</th>
                          <th>Age</th>
                          <th>Sex</th>
                          <th>User Role</th>
                          {!isPrinting && <th>Appointment Record </th>}
                          {!isPrinting && <th>Action</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {/* THIS IS FOR FILTER */}
                        {filteredBySelectedFilters.length > 0 ? (
                          filteredBySelectedFilters
                            .filter((user) =>
                              (`${user.firstName} ${user.lastName}`).toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((user, index) => (
                              <tr key={user._id}>
                                <td>{index + 1}</td>
                                <td>{user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : ''}</td>
                                <td>{user.contactNumber}</td>
                                <td>{user.email}</td>
                                <td>{user.age}</td>
                                <td>{user.sex === 'M' ? 'Male' : 'Female'}</td>
                                {!isPrinting ? <td className={styles1.filters__sortDropdown}>
                                  <select
                                    // value={user.role}
                                    value={
                                      tempRoles[user._id] !== undefined
                                        ? tempRoles[user._id]
                                        : user.role
                                    }
                                    onChange={(e) => handleRoleChange(e.target.value, user._id, index)}
                                    onBlur={() => {
                                      setTempRoles((prevRoles) => {
                                        const updatedRoles = { ...prevRoles };
                                        delete updatedRoles[user._id];
                                        return updatedRoles;
                                      });
                                    }}
                                  >
                                    {roles.map((role) => (
                                      <option key={role} value={role}>
                                        {role}
                                      </option>
                                    ))}
                                  </select>
                                </td> : <td>{tempRoles[user._id] !== undefined
                                        ? tempRoles[user._id]
                                        : user.role
                                      }</td>}
                                {!isPrinting &&
                                  <>
                                    <td>
                                      {(user.role !== 'dentist' || tempRoles[user._id] === 'dentist') && (
                                        <CancelButton onClick={() => showPatientRecord(user)}> Show More </CancelButton>
                                      )}
                                    </td>
                                    <td className={styles1.tableAction}>
                                      <Button
                                        type='secondary'
                                        onClick={(e: any) => {
                                          const userId = user._id;
                                          const selectedRole = tempRoles[userId] || user.role;;
                                          console.log("userId: ", userId)
                                          console.log("selectedRole: ", selectedRole)
                                          console.log("Temp role: ", tempRoles[userId])

                                          if (selectedRole === 'dentist' || selectedRole === 'employee') {
                                            console.log('Showing modal for admin or employee users');
                                            setShowValiUser(true);
                                            onUpdateUser(user, 'updateRole');
                                          } else {
                                            setShowValiUserPatient(true);
                                            onUpdateUser(user, 'updateRolePatient');
                                          }
                                        }}
                                      >
                                        Update Role
                                      </Button>
                                      {(user.role !== 'dentist' || tempRoles[user._id] === 'dentist') && (
                                        <ArchiveButton onClick={(e: any) => {
                                          const selectedRole = e.target.value;
                                          onUpdateUser(user, 'archiveUser')
                                        }}>
                                          <FontAwesomeIcon
                                            icon={faFileArchive}
                                            width={24}
                                            height={24}
                                            color={'#ffffff'}
                                          />
                                        </ArchiveButton>
                                      )}

                                    </td>
                                  </>}
                              </tr>
                            ))
                        ) :
                          // THIS IS FOR SEARCHING - just named it sort
                          searchedUser.length > 0 ? (
                            searchedUser.map((user, index) => (
                              <tr key={user._id}>
                                <td>{index + 1}</td>
                                <td>{`${user.firstName || ''} ${user.lastName || ''}`}</td>
                                <td>{user.contactNumber}</td>
                                <td>{user.email}</td>
                                <td> {user.age}</td>
                                <td> {user.sex === 'M' ? 'Male' : 'Female'}</td>
                                {!isPrinting ? <td className={styles1.filters__sortDropdown}>
                                  <select
                                    // value={user.role}
                                    value={
                                      tempRoles[user._id] !== undefined
                                        ? tempRoles[user._id]
                                        : user.role
                                    }
                                    onChange={(e) => handleRoleChange(e.target.value, user._id, index)}
                                    onBlur={() => {
                                      setTempRoles((prevRoles) => {
                                        const updatedRoles = { ...prevRoles };
                                        delete updatedRoles[user._id];
                                        return updatedRoles;
                                      });
                                    }}
                                  >
                                    {roles.map((role) => (
                                      <option key={role} value={role}>
                                        {role}
                                      </option>
                                    ))}
                                  </select>
                                </td> : <td>{tempRoles[user._id] !== undefined
                                        ? tempRoles[user._id]
                                        : user.role
                                      }</td>}
                                {!isPrinting &&
                                  <>
                                    <td>
                                      {(user.role !== 'dentist' || tempRoles[user._id] === 'dentist') && (
                                        <CancelButton onClick={() => showPatientRecord(user)}> Show More </CancelButton>
                                      )}
                                    </td>
                                    <td className={styles1.tableAction}>
                                      <Button
                                        type='secondary'
                                        onClick={(e: any) => {
                                          const userId = user._id;
                                          const selectedRole = tempRoles[userId] || user.role;;
                                          console.log("userId: ", userId)
                                          console.log("selectedRole: ", selectedRole)
                                          console.log("Temp role: ", tempRoles[userId])

                                          if (selectedRole === 'dentist' || selectedRole === 'employee') {
                                            console.log('Showing modal for admin or employee users');
                                            setShowValiUser(true);
                                            onUpdateUser(user, 'updateRole');
                                          } else {
                                            setShowValiUserPatient(true);
                                            onUpdateUser(user, 'updateRolePatient');
                                          }
                                        }}
                                      >
                                        Update Role
                                      </Button>
                                      {(user.role !== 'dentist' || tempRoles[user._id] === 'dentist') && (
                                        <ArchiveButton onClick={(e: any) => {
                                          const selectedRole = e.target.value;
                                          onUpdateUser(user, 'archiveUser')
                                        }}>
                                          <FontAwesomeIcon
                                            icon={faFileArchive}
                                            width={24}
                                            height={24}
                                            color={'#ffffff'}
                                          />
                                        </ArchiveButton>
                                      )}
                                    </td>
                                  </>
                                }
                              </tr>
                            ))
                          ) : (
                            // GENERAL VIEWING
                            users.map((user, index) => (
                              <tr key={user._id}>
                                <td>{index + 1}</td>
                                <td>{`${user.firstName} ${user.lastName}`}</td>
                                <td>{user.contactNumber}</td>
                                <td>{user.email}</td>
                                <td> {user.age}</td>
                                <td> {user.sex === 'M' ? 'Male' : 'Female'}</td>
                                {!isPrinting ? <td className={styles1.filters__sortDropdown}>
                                  <select
                                    // value={user.role}
                                    value={
                                      tempRoles[user._id] !== undefined
                                        ? tempRoles[user._id]
                                        : user.role
                                    }
                                    onChange={(e) => handleRoleChange(e.target.value, user._id, index)}
                                    onBlur={() => {
                                      setTempRoles((prevRoles) => {
                                        const updatedRoles = { ...prevRoles };
                                        delete updatedRoles[user._id];
                                        return updatedRoles;
                                      });
                                    }}
                                  >
                                    {roles.map((role) => (
                                      <option key={role} value={role}>
                                        {role}
                                      </option>
                                    ))}
                                  </select>
                                </td> : <td>{tempRoles[user._id] !== undefined
                                        ? tempRoles[user._id]
                                        : user.role
                                      }</td>}
                                {!isPrinting &&
                                  <>
                                    <td>
                                      {(user.role !== 'dentist' || tempRoles[user._id] === 'dentist') && (
                                        <CancelButton onClick={() => showPatientRecord(user)}> Show More </CancelButton>
                                      )}
                                    </td>
                                    <td className={styles1.tableAction}>
                                      <Button
                                        type='secondary'
                                        onClick={(e: any) => {
                                          const userId = user._id;
                                          const selectedRole = tempRoles[userId] || user.role;;
                                          console.log("userId: ", userId)
                                          console.log("selectedRole: ", selectedRole)
                                          console.log("Temp role: ", tempRoles[userId])

                                          if (selectedRole === 'dentist' || selectedRole === 'employee') {
                                            console.log('Showing modal for admin or employee users');
                                            setShowValiUser(true);
                                            onUpdateUser(user, 'updateRole');
                                          } else {
                                            setShowValiUserPatient(true);
                                            onUpdateUser(user, 'updateRolePatient');
                                          }
                                        }}
                                      >
                                        Update Role
                                      </Button>
                                      {(user.role !== 'dentist' || tempRoles[user._id] === 'dentist') && (
                                        <ArchiveButton onClick={(e: any) => {
                                          const selectedRole = e.target.value;
                                          onUpdateUser(user, 'archiveUser')
                                        }}>
                                          <FontAwesomeIcon
                                            icon={faFileArchive}
                                            width={24}
                                            height={24}
                                            color={'#ffffff'}
                                          />
                                        </ArchiveButton>
                                      )}
                                    </td>
                                  </>
                                }
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

  const renderPagination = () => {
    const pageNumbers = Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );

    const handlePageChange = (pageNumber: any) => {
      setCurrentPage(pageNumber);
    };

    return (
      <div className={styles1.pagination}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
            width={16}
            height={16}
            color={"#737373"}
          />
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={currentPage === number ? styles1.active : ""}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <FontAwesomeIcon
            icon={faChevronRight}
            width={16}
            height={16}
            color={"#737373"}
          />
        </button>
      </div>
    );
  };

  return (
    <>
      <ToastContainer />
      {(status !== 'loading' && session) && (
        <DentistLayout>
          {renderContent()}
        </DentistLayout>
      )
      }
    </>
  )
}
