import { useEffect, useState } from 'react';
import styles from '../styles/pages/services.module.scss'
import styles1 from '../styles/pages/home.module.scss'
import DentistLayout from '../layouts/DentistLayout';
import useAuthGuard from '../guards/auth.guard';
import Button from '../components/Button';
import Button2 from '../components/Button2';
import DeleteButton from '../components/DeleteButton';
import RestoreButton from '../components/RestoreButton';
import Modal from '../components/Modal';
import { UpdateServicesFormData } from '../types/services';
import { ArchiveProfileFormData } from '../types/profile';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleHalfStroke, faRefresh, faTrash } from "@fortawesome/free-solid-svg-icons";

interface Service {
  _id: string;
  name: string;
  price: number;
  type: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
}

interface Accounts {
  _id: string;
  name: string;
  email: string;
  contactNumber: number;
  sex: string;
  dateOfBirth: string;
  address: string;
  role: string;
  updatedAt: string;
  isArchived: boolean;
}

export default function ServiceRecords() {
  const { session, status } = useAuthGuard();
  const [services, setServices] = useState<Service[]>([])
  const [accounts, setAccounts] = useState<Accounts[]>([]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ];

  //SORT
  const filterBy= ['Oldest to Latest', 'Latest to Oldest', 'Alphabetical (A-Z)', 'Alphabetical (Z-A)']
  const [selectedFilter, setSelectedFilter] = useState('');

  //MODAL
  const [showDeleteService, setShowDeleteService] = useState(false)
  const [showRestoreService, setShowRestoreService] = useState(false)
  const [showDeleteAccount, setShowDeleteAccount] = useState(false)
  const [showRestoreAccount, setShowRestoreAccount] = useState(false)

  //FOR TABLE SWITCHING - ACCOUNTS IS DEFAULT
  const [selectedRecordType, setSelectedRecordType] = useState<'services' | 'accounts'>('accounts');
  const [showAccountsTable, setShowAccountsTable] = useState(false);

  //REFORMAT BIRTHDATE
  const renderDateOfBirth = (dob: string) => {
    const dateOfBirth = new Date(dob);
    const day = dateOfBirth.getDate();
    const month = monthNames[dateOfBirth.getMonth()];
    const year = dateOfBirth.getFullYear();
    return `${month} ${day}, ${year}`;
  };


  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('api/dentist/archive/service');
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data: Service[] = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    const fetchAccounts = async () => {
      try {
        const response = await fetch('api/dentist/archive/user');
        if (!response.ok) {
          throw new Error('Failed to fetch accounts');
        }
        const data: Accounts[] = await response.json();
        setAccounts(data);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    if (selectedRecordType === 'services') {
      setShowAccountsTable(false);
      fetchServices();
      
    } else {
      setShowAccountsTable(true);
      fetchAccounts();
    }
  }, [selectedRecordType]);

  const handleRecordTypeChange = (type: 'accounts' | 'services') => {
    setSelectedRecordType(type);
  };

  const [updateServiceFormData, setUpdateServiceFormData] = useState<UpdateServicesFormData>({
    _id: '',
    name: '',
    price: '',
    description: '',
    type: '',
    createdAt: '',
    updatedAt: '',
    isArchived: true,
  })

  const [updateAccountFormData, setUpdateAccountFormData] = useState<ArchiveProfileFormData>({
    _id: '',
    name: '',
    email: '',
    contactNumber: 0,
    sex: '',
    dateOfBirth: '',
    address: '',
    role: '',
    isArchived: true,
  })

  //SERVICE MODAL
  const onUpdateService = (service: Service, buttonName: string) => {
    
      if (buttonName === 'delete') {
        setShowDeleteService(true);
        setUpdateServiceFormData({
          _id: service._id,
          name: service.name,
          price: service.price.toString(),
          description: service.description,
          type: service.type,
          createdAt: service.createdAt,
          updatedAt: service.updatedAt,
          isArchived: service.isArchived
        });  

      } else if (buttonName === 'restore') {
        setShowRestoreService(true);
        setUpdateServiceFormData({
          _id: service._id,
          name: service.name,
          price: service.price.toString(),
          description: service.description,
          type: service.type,
          createdAt: service.createdAt,
          updatedAt: service.updatedAt,
          isArchived: false
        });
      }
  };

  //ACCOUNT MODAL
  const onUpdateAccount = (account: Accounts, buttonName: string) => {
    
    if (buttonName === 'delete') {
      setShowDeleteAccount(true);
      setUpdateAccountFormData({
        _id: account._id,
        name: account.name,
        email: account.email,
        contactNumber: account.contactNumber,
        sex: account.sex,
        dateOfBirth: account.dateOfBirth,
        address: account.address,
        role: account.role,
        isArchived: account.isArchived
      });  

    } else if (buttonName === 'restore') {
      setShowRestoreAccount(true);
      setUpdateAccountFormData({
        _id: account._id,
        name: account.name,
        email: account.email,
        contactNumber: account.contactNumber,
        sex: account.sex,
        dateOfBirth: account.dateOfBirth,
        address: account.address,
        role: account.role,
        isArchived: false
      });
    }
};

//FILTER
const handleFilterChange = (filter: any) => {

  setSelectedFilter(filter);

  if (selectedRecordType === 'services'){
    let updatedServices = [...services]

    switch(filter){
      case 'Oldest to Latest':
        updatedServices.sort((a, b) => {
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        });
        break;
      case 'Latest to Oldest':
        updatedServices.sort((a, b) => {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
        break;
      case 'Alphabetical (A-Z)':
        updatedServices.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Alphabetical (Z-A)':
        updatedServices.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setServices(updatedServices);
  } else if (selectedRecordType === 'accounts'){
    let updatedAccount = [...accounts]

    switch(filter){
      case 'Oldest to Latest':
        updatedAccount.sort((a, b) => {
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        });
        break;
      case 'Latest to Oldest':
        updatedAccount.sort((a, b) => {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
        break;
      case 'Alphabetical (A-Z)':
        updatedAccount.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Alphabetical (Z-A)':
        updatedAccount.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setAccounts(updatedAccount);
  }

};

//ACCOUNT OPTIONS
const deleteAccount = async (userId: string) => {
  try {
    const response = await fetch(`api/dentist/archive/user`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateAccountFormData),
    });

    if (!response.ok) {
      throw new Error('Failed to delete service');
    }else {
      const restoredAccount = await response.json();
      console.log('Account restored: ', restoredAccount);
      toast.success("Successfully deleted that account.")
      // If deletion is successful, update the services state by removing the deleted service
      setShowDeleteAccount(false);
      setAccounts((prevAccount) =>
        prevAccount.filter((accounts) => accounts._id !== updateAccountFormData._id)
      );
    }
  } catch (error) {
    console.error('Error deleting service:', error);
  }
};

const restoreAccount = async (userId: string) => {
  try {

    const response = await fetch(`api/dentist/archive/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateAccountFormData),
    });

    if (!response.ok) {
      throw new Error('Failed to restore account');
    } else {
      const restoredAccount = await response.json();
      console.log('Account restored: ', restoredAccount);
      toast.success("Successfully restored that account.")
      // If deletion is successful, update the services state by removing the deleted service
      setShowRestoreAccount(false);
      setAccounts((prevAccount) =>
        prevAccount.filter((accounts) => accounts._id !== updateAccountFormData._id)
      );
    }

    
  } catch (error) {
    console.error('Error deleting account:', error);
  }
};

//SERVICE OPTIONS
  const deleteService = async (serviceId: string) => {
    try {
      const response = await fetch(`api/dentist/archive/service`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateServiceFormData),
      });

      if (!response.ok) {
        throw new Error('Failed to delete service');
      } else {
        toast.success("Successfully deleted that service.")

        // If deletion is successful, update the services state by removing the deleted service
        setShowDeleteService(false);
        setServices((prevServices) =>
          prevServices.filter((service) => service._id !== updateServiceFormData._id)
        );
      }
      
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const restoreService = async (serviceId: string) => {
    try {

      const response = await fetch(`api/dentist/archive/service`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateServiceFormData),
      });

      if (!response.ok) {
        throw new Error('Failed to restore service');
      } else {
        toast.success("Service successfully restored.")
        // If deletion is successful, update the services state by removing the deleted service
        setShowRestoreService(false);
        setServices((prevServices) =>
          prevServices.filter((service) => service._id !== updateServiceFormData._id)
        );
      }

    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };
  
const renderContent = () => {
    return (
      <>
{/* ACCOUNTS MODALS */}
      {/* ACCOUNTS SERVICE */}
      <Modal open={showDeleteAccount} setOpen={setShowDeleteAccount} modalWidth={400} modalRadius={10}>
          <h3 className={styles1.cancelTitle}> WARNING! </h3>
          <p> Are you sure you want to DELETE this account with their records?</p>
          <input type='hidden' name = "_id" value={updateServiceFormData._id}/>
          <div className={styles1.cancelActions}>
            <Button type='secondary' onClick={() => setShowDeleteAccount(false)}>No</Button>
            <Button onClick={deleteAccount} type = "submit">Yes</Button>
          </div>
        </Modal>

        {/* ACCOUNTS SERVICE */}
      <Modal open={showRestoreAccount} setOpen={setShowRestoreAccount} modalWidth={400} modalRadius={10}>
          <h3 className={styles1.cancelTitle}> WARNING! </h3>
          <p> Are you sure you want to RESTORE this account with their records?</p>
          <input type='hidden' name = "_id" value={updateServiceFormData._id}/>
          <div className={styles1.cancelActions}>
            <Button type='secondary' onClick={() => setShowRestoreAccount(false)}>No</Button>
            <Button onClick={restoreAccount} type = "submit">Yes</Button>
          </div>
        </Modal>

{/* SERVICES MODALS */}
      {/* DELETE SERVICE */}
      <Modal open={showDeleteService} setOpen={setShowDeleteService} modalWidth={400} modalRadius={10}>
          <h3 className={styles1.cancelTitle}> WARNING! </h3>
          <p> Are you sure you want to DELETE this dental service?</p>
          <input type='hidden' name = "_id" value={updateServiceFormData._id}/>
          <div className={styles1.cancelActions}>
            <Button type='secondary' onClick={() => setShowDeleteService(false)}>No</Button>
            <Button onClick={deleteService} type = "submit">Yes</Button>
          </div>
        </Modal>

        {/* RESTORE SERVICE */}
      <Modal open={showRestoreService} setOpen={setShowRestoreService} modalWidth={400} modalRadius={10}>
          <h3 className={styles1.cancelTitle}> WARNING! </h3>
          <p> Are you sure you want to RESTORE this dental service?</p>
          <input type='hidden' name = "_id" value={updateServiceFormData._id}/>
          <div className={styles1.cancelActions}>
            <Button type='secondary' onClick={() => setShowRestoreService(false)}>No</Button>
            <Button onClick={restoreService} type = "submit">Yes</Button>
          </div>
        </Modal>

        {session && (
          <section className={styles1.main}>
          <div className={styles1.servicecrud}>
          <div className={styles1.filters1}> 
            <h4 className={styles1.filters__sortTitle}> Record Type: </h4>
            <Button2 onClick={() => handleRecordTypeChange('accounts')}> Accounts </Button2>
            <Button2 onClick={() => handleRecordTypeChange('services')}> Services </Button2>

            <h4 className={styles1.filters__sortTitle}> Sort By: </h4>
            <div className={styles1.filters__sortDropdown}>
              <select 
                id = "filterSelect"
                value={selectedFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
                >
                  {filterBy.map((filter) => (
                    <option key = {filter} value = {filter}>
                        {filter}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className={styles.main}>
            {showAccountsTable ? (
              <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th> Full Name </th>
                  <th> Email Address </th>
                  <th> Mobile Number </th>
                  <th> Sex </th>
                  <th> Date of Birth </th>
                  <th> Address </th>
                  <th> Action </th>
                </tr>
              </thead>
              <tbody>
                {accounts.length > 0 ? (
                  accounts.map((account, index) => (
                    <tr key={account._id}>
                      <td>{index + 1}</td>
                      <td> {account.name} </td>
                      <td> {account.email} </td>
                      <td> {account.contactNumber} </td>
                      <td> {account.sex == 'M' ? 'Male' : 'Female'} </td>
                      <td> {renderDateOfBirth(account.dateOfBirth)} </td>
                      <td> {account.address} </td>
                      <td className={styles1.cancelActions}> 
                        <RestoreButton onClick={() => onUpdateAccount(account, 'restore')} title="Restore Record">
                          <FontAwesomeIcon
                          icon={faRefresh}
                          width={24}
                          height={24}
                          color={"#ffffff"}
                          />
                        </RestoreButton>
                        <DeleteButton onClick={() => onUpdateAccount(account, 'delete')} title="Delete Record">
                          <FontAwesomeIcon
                            icon={faTrash}
                            width={24}
                            height={24}
                            color={"#ffffff"}
                            />
                        </DeleteButton>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9}>No archived accounts.</td>
                  </tr>
                )}
              </tbody>
            </table>
            ): (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Service Name</th>
                    <th>Base Charge</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {services.length > 0 ? (
                  services.map((service, index) => (
                    <tr key={service._id}>
                      <td>{index + 1}</td>
                      <td>{service.name}</td>
                      <td> P{service.price.toFixed(2)}</td>
                      <td> {service.type} </td>
                      <td>{service.description}</td>
                      <td className={styles1.cancelActions}> 
                        <RestoreButton onClick={() => onUpdateService(service, 'restore')} title="Restore Record">
                          <FontAwesomeIcon
                          icon={faRefresh}
                          width={24}
                          height={24}
                          color={"#ffffff"}
                          />
                        </RestoreButton>
                        <DeleteButton onClick={() => onUpdateService(service, 'delete')} title="Delete Record">
                          <FontAwesomeIcon
                            icon={faTrash}
                            width={24}
                            height={24}
                            color={"#ffffff"}
                            />
                        </DeleteButton>
                      </td>
                    </tr>
                    ))
                  ) : (
                    <tr>
                    <td colSpan={9}>No archived services.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
            
          </div>
          </div>
          </section>
        )}
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
