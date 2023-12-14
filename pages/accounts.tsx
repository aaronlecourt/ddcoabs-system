import { useEffect, useState } from 'react';
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

interface User {
  _id: string;
  name: string;
  email: number;
  contactNumber: number;
  role: string;
  isArchived: boolean;
}

export default function Accounts() {
  const { session, status } = useAuthGuard();
  const [users, setUsers] = useState<User[]>([])
  const roles = ['patient', 'dentist', 'employee'];
  // SEARCH
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleRoleChange = (e: any, index: any) => {
    const updatedUsers = [...users]; // Create a copy of the users array
    updatedUsers[index].role = e.target.value; // Update the role of the specific user at the given index
    setUsers(updatedUsers); // Update the state with the modified users array
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('api/dentist/accounts');
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
    role: '',
    isArchived: false,
  })

  const [showArchiveUser, setShowArchiveUser] = useState(false)
  const [showValiUser, setShowValiUser] = useState(false)

  const onUpdateUser = (user: User, buttonName: string) => {

      if (buttonName === 'updateRole') {
        setUpdateUserFormData({
          _id: user._id,
          name: user.name,
          email: user.email.toString(),
          contactNumber: user.contactNumber,
          role: user.role,
          isArchived: user.isArchived,
        }); // Set the data for the update form fields
        setShowValiUser(true); // Open the update modal
      } else if (buttonName === 'archiveUser') {
        setShowArchiveUser(true);

        setUpdateUserFormData({
          _id: user._id,
          name: user.name,
          email: user.email.toString(),
          contactNumber: user.contactNumber,
          role: user.role,
          isArchived: true
        });
         // Set the data for the update form fields

      } else if (buttonName === 'updateRolePatient') {
        setUpdateUserFormData({
          _id: user._id,
          name: user.name,
          email: user.email.toString(),
          contactNumber: user.contactNumber,
          role: user.role, // Set the role to 'patient'
          isArchived: user.isArchived,
        });

        updateUserRole(undefined, user._id);
      }
      
  };

  //UPDATE USER ROLE
  const updateUserRole = async (e: any, userId: string) => {
    if (e) {
      e.preventDefault();
    }

    const updatedData = { ...updateUserFormData, _id: userId }; // Include userId in the request body

    fetch(`/api/dentist/accounts`, {
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
          console.log('User role updated: ', updatedUser);
          setShowValiUser(false); // Close the modal after successful 

          setUsers(prevServices =>
            prevServices.map(prevService =>
              prevService._id === updatedUser._id ? updatedUser : prevService
            )
          );
        }
      })
      .catch(error => {
        alert('Update failed');
        console.error('Error updating service:', error);
      });

  };

  //ARCHIVES USER
  const archiveUser = async (e: any) => {
    e.preventDefault();

    const updatedData = { ...updateUserFormData };
    updatedData.isArchived = true;
  
    setUpdateUserFormData(updatedData);

    console.log('Update User Form Data:', updatedData);

    fetch(`/api/dentist/accounts`, {
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
          // Close the modal after successful update

          // Update the 'users' state with the modified 'updatedUser'
            setUsers((prevUsers) =>
            prevUsers.map((prevUser) =>
              prevUser._id === updatedUser._id ? updatedUser : prevUser
            )
          );
  
          // setUsers((prevUsers) =>
          // prevUsers.map((prevUsers) =>
          // prevUsers._id === updatedUser._id ? updatedUser : prevUsers
          //   ).filter((user) => user._id !== updatedUser._id)
          // );
  
          // Remove the updated service from the table
          // setUsers((prevServices) =>
          //   prevServices.filter((service) => service._id !== updatedUser._id)
          // );
  
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
          <input type='text' name = "_id" value={updateUserFormData._id}/>
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

      <section className={styles.main}>
        <div>
        <div className={styles1.filters}>
          <div className={styles1.filters__search}>
            <input type='text' className={styles1.filters__searchInput} placeholder='Search account...' value={searchQuery}
            onChange={handleSearchChange}/>
            <FontAwesomeIcon icon={faSearch} width={24} height={24} color={'#737373'} />
          </div>
          <div className={styles1.filters__sort}>
            <span className={styles1.filters__sortTitle}>Sort By:</span>
            <div className={styles1.filters__sortDropdown}>
              <span>Latest</span>
              <FontAwesomeIcon icon={faChevronDown} width={24} height={24} color={'#737373'} />
            </div>
          </div>
        </div>
        {session && (
          <main>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Email Address</th>
                  <th>Mobile Number</th>
                  <th>User Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                   filteredUsers.map((user, index) => (
                    <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.contactNumber}</td>
                    <td>
                      <select value = {user.role} onChange = {(e) => handleRoleChange(e, index)}>
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                      </select>
                    </td>
                    <td className={styles1.tableAction}> 
                      <ArchiveButton onClick={() => onUpdateUser(user, 'archiveUser')}>
                        <FontAwesomeIcon icon={faFileArchive} width={24} height={24} color={'#ffffff'} />
                      </ArchiveButton>
                      <Button onClick={(e: any) => {
                        if (user.role === 'dentist' || user.role === 'employee') {
                          setShowValiUser(true);
                          onUpdateUser(user, 'updateRole');
                          // Show the modal for admin or employee users
                        } else {
                          onUpdateUser(user, 'updateRolePatient');
                        }
                      }}> Update Role </Button>
                    </td>
                  </tr>
                   )) 
                ) : (
                users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.contactNumber}</td>
                    <td>
                      <select value = {user.role} onChange = {(e) => handleRoleChange(e, index)}>
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                      </select>
                    </td>
                    <td className={styles1.tableAction}> 
                      <ArchiveButton onClick={() => onUpdateUser(user, 'archiveUser')}>
                        <FontAwesomeIcon icon={faFileArchive} width={24} height={24} color={'#ffffff'} />
                      </ArchiveButton>
                      <Button onClick={(e: any) => {
                        if (user.role === 'dentist' || user.role === 'employee') {
                          setShowValiUser(true);
                          onUpdateUser(user, 'updateRole');
                          // Show the modal for admin or employee users
                        } else {
                          onUpdateUser(user, 'updateRolePatient');
                        }
                      }}> Update Role </Button>
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
      {(status !== 'loading' && session) && (
        <DentistLayout>
          {renderContent()}
        </DentistLayout>
      )
      }
    </>
  )
}
