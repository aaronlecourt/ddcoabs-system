import { useEffect, useState } from 'react';
import styles from '../styles/pages/services.module.scss'
import DentistLayout from '../layouts/DentistLayout';
import useAuthGuard from '../guards/auth.guard';
<<<<<<< Updated upstream
=======
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive, faBoxArchive, faChevronDown, faChevronLeft, faChevronRight, faFileArchive, faFolder, faPencil, faSearch } from '@fortawesome/free-solid-svg-icons';
import { handleFormDataChange, handleFormEnter } from '../utils/form-handles';
import Modal from '../components/Modal';
import EditButton from '../components/EditButton';
import ArchiveButton from '../components/ArchiveButton';
import Button from '../components/Button';
import { AddServicesFormData, ErrorAddServicesFormData, UpdateServicesFormData } from '../types/services';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
>>>>>>> Stashed changes

interface Service {
  name: string;
  price: number;
  description: string;
}

export default function Services() {
  const { session, status } = useAuthGuard();
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    const setServicesData = async () => {
      let response = await fetch('api/dentist/dentist-service');
      let data = await response.json() || [];

      setServices(data)
    }

    setServicesData()
  }, [])

<<<<<<< Updated upstream
=======
  const addService = async (e: any) => {
    e.preventDefault();

    try {
      const apiUrl = '/api/dentist/dentist-service';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceFormData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const responseData = await response.json();
      console.log('Service registered:', responseData);

      setShowAddService(false);

      setServices([...services, responseData]);

      clearModal();
    } catch (error) {
      toast.error('Adding Service failed');
      console.error('Error adding service:', error);
    }
  };

  const updateService = async (e: any) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`/api/dentist/dentist-service`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateServiceFormData),
      });
  
      if (!response.ok) {
        const error = await response.json();
        toast.error('Update failed: ' + JSON.stringify(error));
      } else {
        const updatedService = await response.json();
        console.log('Service updated: ', updatedService);
  
        setShowUpdateService(false);
  
        // Update the services array
        setServices((prevServices) =>
          prevServices.map((prevService) =>
            prevService._id === updatedService._id ? updatedService : prevService
          )
        );
  
        // Update the sortedServices array and apply sorting
        let updatedSortedServices = [...sortedServices];
        updatedSortedServices = updatedSortedServices.map((prevService) =>
          prevService._id === updatedService._id ? updatedService : prevService
        );
  
        switch (selectedFilter) {
          case 'Oldest to Latest':
            updatedSortedServices.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            break;
          case 'Latest to Oldest':
            updatedSortedServices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case 'Alphabetical (A-Z)':
            updatedSortedServices.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'Alphabetical (Z-A)':
            updatedSortedServices.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case 'Price (Lowest to Highest)':
            updatedSortedServices.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            break;
          case 'Price (Highest to Lowest)':
            updatedSortedServices.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            break;
          default:
            break;
        }
  
        setSortedServices(updatedSortedServices);
  
        clearModal();
  
        // Add alert here
        toast.success('Service updated successfully!');
      }
    } catch (error) {
      toast.error('Updating service failed');
      console.error('Error updating service:', error);
    }
  };
  
  
  const filterBy = [
    'Oldest to Latest',
    'Latest to Oldest',
    'Alphabetical (A-Z)',
    'Alphabetical (Z-A)',
    'Price (Lowest to Highest)',
    'Price (Highest to Lowest)',
  ];
  
  const archiveService = async (e: any) => {
    try {
      const response = await fetch(`/api/dentist/dentist-service`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateServiceFormData),
      });
  
      if (!response.ok) {
        const error = await response.json();
        toast.error('Archive service failed: ' + JSON.stringify(error));
      } else {
        const updatedService = await response.json();
        console.log('Service updated: ', updatedService);
  
        setShowArchiveService(false);
  
        setServices((prevServices) =>
          prevServices.map((prevService) =>
            prevService._id === updatedService._id ? updatedService : prevService
          )
        );
  
        setServices((prevServices) =>
          prevServices.filter((service) => service._id !== updatedService._id)
        );
  
        clearModal();
      }
    } catch (error) {
      toast.error('Updating service failed');
      console.error('Error updating service:', error);
    }
  };
  
  
>>>>>>> Stashed changes
  const renderContent = () => {
    return (
      <>
<<<<<<< Updated upstream
        {session && (
          <main className={styles.main}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Service Name</th>
                  <th>Base Charge</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => 
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>{service.name}</td>
                    <td>P {service.price.toFixed(2)}</td>
                    <td>{service.description}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </main>
        )}
=======
      <ToastContainer/>
        <section className={styles.main}>
          <div className={styles1.servicecrud}>
            <div className={styles1.filters}>
              <div className={styles1.filters__search}>
                <input
                  type='text'
                  className={styles1.filters__searchInput}
                  placeholder='Search name of service...'
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <FontAwesomeIcon icon={faSearch} width={24} height={24} color={'#737373'} />
              </div>
              <div className={styles1.filters__sort}>
                <span className={styles1.filters__sortTitle}>Sort By:</span>
                <div className={styles1.filters__sortDropdown}>
                  <select
                    id='filterSelect'
                    value={selectedFilter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                  >
                    {filterBy.map((filter) => (
                      <option key={filter} value={filter}>
                        {filter}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles1.filters__add} onClick={onAddService}>
                + Add Service
              </div>
            </div>
            {session && (
              <main>
                {content}
              </main>
            )}
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
          <label> Type: </label>
          <div className={styles1.cancelText}>
            <div className={styles1.filters__search}>
              <select onChange={(e: any) => setServiceFormData({ ...serviceFormData, type: e.target.value })} value={serviceFormData.type}>
                {types.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
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
            <Button onClick={addService} type = "submit">Submit</Button>
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

          <label> Type: </label>
          <div className={styles1.cancelText}>
            <div className={styles1.filters__type}>
              <select onChange={(e: any) => setUpdateServiceFormData({ ...updateServiceFormData, type: e.target.value })}
                value={updateServiceFormData.type}>
                {types.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label> Short Description: </label>
          <div className={styles1.cancelText}>
            <div className={styles1.filters__search}>
              <input type='text' name = "description" className={styles1.filters__searchInput} value={updateServiceFormData.description} onChange={e => handleFormDataChange(e, setUpdateServiceFormData, setErrorFormData)} />
            </div>
          </div>
          <div className={styles1.cancelActions}>
            <Button type='secondary' onClick={() => setShowUpdateService(false)}>Cancel</Button>
            <Button onClick={updateService} type = "submit">Update</Button>
          </div>
        </Modal>

      {/* ARCHIVE SERVICE */}
      <Modal open={showArchiveService} setOpen={setShowArchiveService} modalWidth={400} modalRadius={10}>
          <h3 className={styles1.cancelTitle}> WARNING! </h3>
          <p> Are you sure you want to archive this dental service?</p>
          <input type='hidden' name = "_id" value={updateServiceFormData._id}/>
          <div className={styles1.cancelActions}>
            <Button type='secondary' onClick={() => setShowArchiveService(false)}>No</Button>
            <Button onClick={archiveService} type = "submit">Yes</Button>
          </div>
        </Modal>
>>>>>>> Stashed changes
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
