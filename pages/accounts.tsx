import { useEffect, useRef, useState } from 'react';
import styles from '../styles/pages/services.module.scss'
import styles1 from '../styles/pages/home.module.scss'
import DentistLayout from '../layouts/DentistLayout';
import useAuthGuard from '../guards/auth.guard';
import Button from '../components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive, faBoxArchive, faChevronDown, faFileArchive, faFolder, faPencil, faSearch } from '@fortawesome/free-solid-svg-icons';
import { UpdateProfileFormData } from '../types/profile';
import Modal from '../components/Modal';
import ArchiveButton from '../components/ArchiveButton';
import { fileURLToPath } from 'url';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import User from '../models/User';
import CancelButton from '../components/CancelButton';

interface User {
  _id: string;
  name: string;
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
  const roles = ['patient', 'dentist', 'employee'];
  
  // SEARCH
  const [searchQuery, setSearchQuery] = useState('');
  
  const sortedUser = users.filter((user) =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log('Filtered Users:', sortedUser);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    console.log('Search Query:', e.target.value);
  };  

  // SORT BY
  const sortBy= ['Oldest to Latest', 'Latest to Oldest', 'Alphabetical (A-Z)', 'Alphabetical (Z-A)']
  const [selectedSort, setSelectedSort] = useState('');

  const handleSortChange = (sort: any) => {

    setSelectedSort(sort);
    let sortedUsers = [...users]

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
          sortedUsers.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'Alphabetical (Z-A)':
          sortedUsers.sort((a, b) => b.name.localeCompare(a.name));
          break;
        default:
          break;
      }
      setUsers(sortedUsers);
  };

  //FILTER
  const filterBy= ['Select All', 'Dentist', 'Employee', 'Patient', 'Male', 'Female', 'Minor', 'Adult']
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleFilterSelection = (filter: string) => {
    if (filter === 'Select All'){
      if (selectedFilters.length === filterBy.length - 1) {
        setSelectedFilters([]); // Uncheck all if 'Select All' was previously checked
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

  const filteredBySelectedFilters = users.filter((user) => {
    if (selectedFilters.length === 0) {
      return true;
    } else {
      if (selectedFilters.includes('Dentist') && user.role === 'dentist') {
        return true;
      }
      if (selectedFilters.includes('Employee') && user.role === 'employee') {
        return true;
      }
      if (selectedFilters.includes('Patient') && user.role === 'patient') {
        return true;
      }
      if (selectedFilters.includes('Male') && user.sex === 'M') {
        return true;
      }
      if (selectedFilters.includes('Female') && user.sex === 'F') {
        return true;
      }
      if (selectedFilters.includes('Minor') && user.age < 18) {
        return true;
      }
      if (selectedFilters.includes('Adult') && user.age >= 18) {
        return true;
      }
    }
    return false;
  });
  

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
    name: '',
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
    updatedUsers[index].role = selectedRole ;
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
        alert('Update failed: ' + JSON.stringify(error));
      } else {
        const updatedUser = await response.json();
        console.log('User role updated: ', updatedUser);
        setShowValiUser(false);
        setShowValiUserPatient(false);
  
        setUsers((prevServices) =>
          prevServices.map((prevService) =>
            prevService._id === updatedUser._id ? updatedUser : prevService
          )
        );
      }
    } catch (error) {
      alert('Update failed');
      console.error('Error updating service:', error);
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
          alert('Update failed: ' + JSON.stringify(error));
        } else {
          const updatedUser = await response.json();
          console.log('User updated: ', updatedUser);
          setShowArchiveUser(false); 

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
        alert('Update failed');
        console.error('Error updating service:', error);
      });
  }
  

  const renderContent = () => {
    return (
      <>
      {/* MODAL FOR ARCHIVE */}
      <Modal open={showArchiveUser} setOpen={setShowArchiveUser} modalWidth={400} modalRadius={10}>
          <h3 className={styles1.cancelTitle}> WARNING! </h3>
          <p> Are you sure you want to archive this user?</p>
          <input type='hidden' name = "_id" value={updateUserFormData._id}/>
          <div className={styles1.cancelActions}>
            <Button type='secondary' onClick={() => setShowArchiveUser(false)}>No</Button>
            <Button onClick={archiveUser} type = "submit">Yes</Button>
          </div>
        </Modal>

        {/* MODAL FOR ADMIN/EMPLOYEE VALIDATION */}
        <Modal open={showValiUser} setOpen={setShowValiUser} modalWidth={400} modalRadius={10}>
          <h3 className={styles1.cancelTitle}> WARNING! </h3>
          <p> Are you sure you want this user to be an admin or employee?</p>
          <input type='hidden' name = "_id" value={updateUserFormData._id}/>
          <div className={styles1.cancelActions}>
            <Button type='secondary' onClick={() => setShowValiUser(false)}>No</Button>
            <Button onClick={(e: any) => updateUserRole(e, updateUserFormData._id)} type = "submit">Yes</Button>
          </div>
        </Modal>

        {/* MODAL FOR PATIENT VALIDATION */}
        <Modal open={showValiUserPatient} setOpen={setShowValiUserPatient} modalWidth={400} modalRadius={10}>
          <h3 className={styles1.cancelTitle}> WARNING! </h3>
          <p> Are you sure you want this user to be a patient? </p>
          <input type='hidden' name = "_id" value={updateUserFormData._id}/>
          <div className={styles1.cancelActions}>
            <Button type='secondary' onClick={() => setShowValiUserPatient(false)}>No</Button>
            <Button onClick={(e: any) => updateUserRole(e, updateUserFormData._id)} type = "submit">Yes</Button>
          </div>
        </Modal>

      <section className={styles.main}>
        <div className={styles.servicecrud}>
        <div className={styles1.filters}>
          <div className={styles1.filters__search}>
            <input type='text' className={styles1.filters__searchInput} placeholder='Search account name...'
            value={searchQuery}
            onChange={handleSearchChange}/>
            <FontAwesomeIcon icon={faSearch} width={24} height={24} color={'#737373'} />
          </div>
          <div className={styles1.filters__sort}>
            <span className={styles1.filters__sortTitle}>Sort By:</span>
            <div className={styles1.filters__sortDropdown}>
              <select
                id = "sortSelect"
                value={selectedSort}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                {sortBy.map((sort) => (
                <option key = {sort} value = {sort}>
                    {sort}
                </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles1.filters__sort}>
            <span className={styles1.filters__sortTitle}>Filter:</span>
            <div className={styles1.filters__sortDropdown}>
              {filterBy.map((filter) => (
                <label key={filter}>
                  <input
                    type="checkbox"
                    value={filter}
                    onChange={() => handleFilterSelection(filter)}
                    checked={selectedFilters.includes(filter) || (filter === 'Select All' && selectedFilters.length === filterBy.length - 1)}
                  />
                  {filter}
                </label>
              ))}
            </div>
          </div>
          <div className={styles1.filters__sortDropdown}>
            <Button type='secondary'> Generate Report </Button>
          </div>
        </div>
        {session && (
          <main>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Contact Number </th>
                  <th>Email Address</th>
                  <th>Age</th>
                  <th>Sex</th>
                  <th>User Role</th>
                  <th>Appointment Record </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
               {/* THIS IS FOR FILTER */}
                {filteredBySelectedFilters.length > 0 ? (
                  filteredBySelectedFilters
                  .filter((user) =>
                    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((user, index) => (
                      <tr key={user._id}>
                        <td>{index + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.contactNumber}</td>
                        <td>{user.email}</td>
                        <td>{user.age}</td>
                        <td>{user.sex === 'M' ? 'Male' : 'Female'}</td>
                        <td className={styles1.filters__sortDropdown}>
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
                        </td>
                        <td>
                          {(user.role !== 'dentist' || tempRoles[user._id] === 'dentist') && (
                            <Button> Show More </Button>
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
                              onUpdateUser(user, 'archiveUser')}}>
                              <FontAwesomeIcon
                                icon={faFileArchive}
                                width={24}
                                height={24}
                                color={'#ffffff'}
                              />
                            </ArchiveButton>
                          )}
                          
                        </td>
                      </tr>
                    ))
                ) : 
                // THIS IS FOR SEARCHING - just named it sort
                sortedUser.length > 0 ? (
                  sortedUser.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td>{user.name}</td>
                      <td>{user.contactNumber}</td>
                      <td>{user.email}</td>
                      <td> {user.age }</td>
                      <td> {user.sex === 'M' ? 'Male' : 'Female'}</td>
                      <td className={styles1.filters__sortDropdown}>
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
                      </td>
                      <td>
                          {(user.role !== 'dentist' || tempRoles[user._id] === 'dentist') && (
                            <Button> Show More </Button>
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
                              onUpdateUser(user, 'archiveUser')}}>
                              <FontAwesomeIcon
                                icon={faFileArchive}
                                width={24}
                                height={24}
                                color={'#ffffff'}
                              />
                            </ArchiveButton>
                          )}
                      </td>
                    </tr>
                    )) 
                  ) : (
                    // GENERAL VIEWING
                  users.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td>{user.name}</td>
                      <td>{user.contactNumber}</td>
                      <td>{user.email}</td>
                      <td> {user.age }</td>
                      <td> {user.sex === 'M' ? 'Male' : 'Female'}</td>
                      <td className={styles1.filters__sortDropdown}>
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
                      </td>
                      <td>
                        {(user.role !== 'dentist' || tempRoles[user._id] === 'dentist') && (
                          <Button> Show More </Button>
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
                              onUpdateUser(user, 'archiveUser')}}>
                              <FontAwesomeIcon
                                icon={faFileArchive}
                                width={24}
                                height={24}
                                color={'#ffffff'}
                              />
                            </ArchiveButton>
                          )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </main>
        )}
        </div>
      </section>

      </>
    )
  }

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
