import { useEffect, useState } from 'react';
import styles from '../styles/pages/services.module.scss'
import styles1 from '../styles/pages/home.module.scss'
import DentistLayout from '../layouts/DentistLayout';
import useAuthGuard from '../guards/auth.guard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import { handleFormDataChange, handleFormEnter } from '../utils/form-handles';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { AddServicesFormData, ErrorAddServicesFormData, UpdateServicesFormData } from '../types/services';

interface Service {
  _id: string;
  name: string;
  price: string;
  description: string;
}

export default function Services() {
  const { session, status } = useAuthGuard();
  const [services, setServices] = useState<Service[]>([])
  const [showAddService, setShowAddService] = useState(false)
  const [showUpdateService, setShowUpdateService] = useState(false)

  useEffect(() => {
    const setServicesData = async () => {
      // let response = await fetch('api/dentist/dentist-service');
      // let data = await response.json() || [];

      // setServices(data)
      try {
        const response = await fetch('api/dentist/dentist-service');
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data: Service[] = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    }

    setServicesData()
  }, [])

  // TRIGGERS THE MODAL
  const onAddService = (appointment: any) => {
    setShowAddService(true);
  }

    // TRIGGERS THE MODAL aND INPUTS DATA FROM TABLE
    const onUpdateService = (service: Service) => {
      setUpdateServiceFormData({
        _id: service._id,
        name: service.name,
        price: service.price,
        description: service.description,
      }); // Set the data for the update form fields
      setShowUpdateService(true); // Open the update modal
    }

  const [errorFormData, setErrorFormData] = useState<ErrorAddServicesFormData>({
    name: { error: false, message: null },
    price: { error: false, message: null },
    description: { error: false, message: null }
  })

  const [serviceFormData, setServiceFormData] = useState<AddServicesFormData>({
    name: '',
    price: '',
    description: '',
  })

  const [updateServiceFormData, setUpdateServiceFormData] = useState<UpdateServicesFormData>({
    _id: '',
    name: '',
    price: '',
    description: '',
  })

  const handleService = (e: any) => {
    e.preventDefault();
  
    const apiUrl = updateServiceFormData._id ? `/api/dentist/dentist-service` : '/api/dentist/dentist-service';
    const requestData = updateServiceFormData._id ? updateServiceFormData : serviceFormData;
    const isUpdate = !!updateServiceFormData._id;
  
    fetch(apiUrl, {
      method: isUpdate ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then(async (response) => {
        if (!response.ok) {
          const error = await response.json();
          const action = isUpdate ? 'Update' : 'Registration';
          alert(`${action} failed: ${JSON.stringify(error)}`);
        } else {
          const responseData = await response.json();
          const action = isUpdate ? 'Service updated' : 'Service registered';
          console.log(`${action}: `, responseData);
          if (!isUpdate) {
            setShowAddService(false); // Close the modal after successful registration
            // Clear the form after adding a service if needed
            setServiceFormData({ name: '', price: '', description: '' });

            //DYNAMIC TABLE
            setServices(prevServices => [...prevServices, responseData]);
          } else {
            setShowUpdateService(false); // Close the modal after successful update
            setServices(prevServices =>
              prevServices.map(prevService =>
                prevService._id === responseData._id ? responseData : prevService
              )
            );
          }
        }
      })
      .catch(error => {
        const action = isUpdate ? 'Update' : 'Registration';
        alert(`${action} failed`);
        console.error(`Error ${action.toLowerCase()} service:`, error);
      });
  };

  //FOR ARCHIVE
  
  // FOR UPDATE BUTTON
  // const archiveService = async (serviceId)) => {
  //   e.preventDefault();

  //   fetch(`/api/dentist/dentist-service`, {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(updateServiceFormData),
  //   })
  //     .then(async (response) => {
  //       if (!response.ok) {
  //         const error = await response.json();
  //         alert('Update failed: ' + JSON.stringify(error));
  //       } else {
  //         const updatedService = await response.json();
  //         console.log('Service updated: ', updatedService);
  //         setShowUpdateService(false); // Close the modal after successful 
  //       }
  //     })
  //     .catch(error => {
  //       alert('Update failed');
  //       console.error('Error updating service:', error);
  //     });
  // }

  const renderContent = () => {
    return (
      <>
      <section>
        <div className={styles1.filters}>
          <div className={styles1.filters__search}>
            <input type='text' className={styles1.filters__searchInput} placeholder='Search appointment...' />
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
        {/* BUTTON TO TRIGGER THE MODAL */}
        <div>
          <button onClick={onAddService}> Add Service + </button>
        </div>
      </section>

      {/* ADD SERVICE */}

      <Modal open={showAddService} setOpen={setShowAddService} modalWidth={400} modalRadius={10}>
          <h3 className={styles1.cancelTitle}> Add Service </h3>
          <label> Service Name: </label>
          <div className={styles1.cancelText}>
            <div className={styles1.filters__search}>
              <input type='text' name = "name" className={styles1.filters__searchInput} value={serviceFormData.name} onChange={e => handleFormDataChange(e, setServiceFormData, setErrorFormData)}/>
            </div>
          </div>
          <label> Base Price:  </label>
          <div className={styles1.cancelText}>
            <div className={styles1.filters__search}>
              <input type='text' name = "price" className={styles1.filters__searchInput} value={serviceFormData.price} onChange={e => handleFormDataChange(e, setServiceFormData, setErrorFormData)}/>
            </div>
          </div>
          <label> Short Description: </label>
          <div className={styles1.cancelText}>
            <div className={styles1.filters__search}>
              <input type='textarea' name = "description" className={styles1.filters__searchInput} value={serviceFormData.description} onChange={e => handleFormDataChange(e, setServiceFormData, setErrorFormData)} />
            </div>
          </div>
          <div className={styles1.cancelActions}>
            <Button type='secondary' onClick={() => setShowAddService(false)}>Cancel</Button>
            <Button onClick={handleService} type = "submit">Submit</Button>
          </div>
        </Modal>

        {/* UPDATE SERVICE */}
        <Modal open={showUpdateService} setOpen={setShowUpdateService} modalWidth={400} modalRadius={10}>
          <h3 className={styles1.cancelTitle}> Update Service </h3>
          {/* ID IS HIDDEN */}
          <input type='hidden' name = "_id" value={updateServiceFormData._id}/>

          <label> Service Name: </label>
          <div className={styles1.cancelText}>
            <div className={styles1.filters__search}>
              <input type='text' name = "name" className={styles1.filters__searchInput} value={updateServiceFormData.name} onChange={e => handleFormDataChange(e, setUpdateServiceFormData, setErrorFormData)}/>
            </div>
          </div>

          <label> Base Price:  </label>
          <div className={styles1.cancelText}>
            <div className={styles1.filters__search}>
              <input type='text' name = "price" className={styles1.filters__searchInput} value={updateServiceFormData.price} onChange={e => handleFormDataChange(e, setUpdateServiceFormData, setErrorFormData)}/>
            </div>
          </div>

          <label> Short Description: </label>
          <div className={styles1.cancelText}>
            <div className={styles1.filters__search}>
              <input type='textarea' name = "description" className={styles1.filters__searchInput} value={updateServiceFormData.description} onChange={e => handleFormDataChange(e, setUpdateServiceFormData, setErrorFormData)} />
            </div>
          </div>
          <div className={styles1.cancelActions}>
            <Button type='secondary' onClick={() => setShowUpdateService(false)}>Cancel</Button>
            <Button onClick={handleService} type = "submit">Submit</Button>
          </div>
        </Modal>
      
        {session && (
          <main className={styles.main}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Service Name</th>
                  <th>Base Charge</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => 
                  <tr key={service._id}>
                    <td>{index + 1}</td>
                    <td>{service.name}</td>
                    <td>₱ {service.price}</td>
                    <td>{service.description}</td>
                    <td>
                      <Button onClick={() => onUpdateService(service)}>Edit</Button> 
                      <Button >Archive</Button>
                    </td>
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
