import { useEffect, useState } from 'react';
import styles from '../styles/pages/services.module.scss'
import styles1 from '../styles/pages/home.module.scss'
import DentistLayout from '../layouts/DentistLayout';
import useAuthGuard from '../guards/auth.guard';
import Button from '../components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faSearch } from '@fortawesome/free-solid-svg-icons';

interface User {
  _id: string;
  name: string;
  email: number;
  contactNumber: string;
  role: string;
  isArchived: boolean;
}

export default function Accounts() {
  const { session, status } = useAuthGuard();
  const [users, setUsers] = useState<User[]>([])


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

  const renderContent = () => {
    return (
      <>

      <section>
        <div className={styles1.filters}>
          <div className={styles1.filters__search}>
            <input type='text' className={styles1.filters__searchInput} placeholder='Search account...' />
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
      </section>


        {session && (
          <main className={styles.main}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Email Address</th>
                  <th>Mobile Number</th>
                  <th>User Type</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => 
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.contactNumber}</td>
                    <td>{user.role}</td>
                    <td> <Button> Archive </Button></td>
                  </tr>
                )}
              </tbody>
            </table>
          </main>
        )}
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
