import { useEffect, useState } from 'react';
import styles from '../styles/pages/services.module.scss'
import styles1 from '../styles/pages/home.module.scss'
import DentistLayout from '../layouts/DentistLayout';
import useAuthGuard from '../guards/auth.guard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive, faBoxArchive, faChevronDown, faFileArchive, faFolder, faPencil, faSearch } from '@fortawesome/free-solid-svg-icons';
import { handleFormDataChange, handleFormEnter } from '../utils/form-handles';
import Modal from '../components/Modal';
import EditButton from '../components/EditButton';
import ArchiveButton from '../components/ArchiveButton';
import Button from '../components/Button';
import { AddServicesFormData, ErrorAddServicesFormData, UpdateServicesFormData } from '../types/services';

interface Service {
  _id: string;
  name: string;
  price: string;
  description: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
}

export default function Services() {
  const { session, status } = useAuthGuard();
  const [services, setServices] = useState<Service[]>([])
  const [showAddService, setShowAddService] = useState(false)
  const [showUpdateService, setShowUpdateService] = useState(false)
  const [showArchiveService, setShowArchiveService] = useState(false)
  const types = ['Jacket Crowns', 'Removable Partial Denture', 'Others'];

  // SEARCH
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const searchedServices = services.filter((service) =>
    service.name && service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //SORT
  const filterBy = [
    'Oldest to Latest',
    'Latest to Oldest',
    'Alphabetical (A-Z)',
    'Alphabetical (Z-A)',
    'Price (Lowest to Highest)',
    'Price (Highest to Lowest)'
  ];
  
  const [selectedFilter, setSelectedFilter] = useState('');

  const handleFilterChange = (filter: any) => {
    setSelectedFilter(filter);
    
    let filterServices = [...services]

    switch(filter){
      case 'Oldest to Latest':
        filterServices.sort((a, b) => {
          return new Date(a.createdAt).getTime() - new Date(b.updatedAt).getTime();
        });
        break;
      case 'Latest to Oldest':
        filterServices.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.updatedAt).getTime();
        });
        break;
      case 'Alphabetical (A-Z)':
        filterServices.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Alphabetical (Z-A)':
        filterServices.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'Price (Lowest to Highest)':
        filterServices.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'Price (Highest to Lowest)':
        filterServices.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      default:
        break;
    }

    setServices(filterServices);
  };

//TABLE
  useEffect(() => {
    const fetchServices = async () => {
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
    };
  
    fetchServices();
  }, []); 

  //TABLE FOR SORTING
  useEffect(() => {

    const updateServices = async () => {
      try {
        // Fetch services again to get the most updated data
        const response = await fetch('api/dentist/dentist-service');
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data: Service[] = await response.json();
  
        // Apply sorting and filtering
        let updatedServices = data;
        switch (selectedFilter) {
          case 'Oldest to Latest':
            updatedServices.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            break;
          case 'Latest to Oldest':
            updatedServices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case 'Alphabetical (A-Z)':
            updatedServices.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'Alphabetical (Z-A)':
            updatedServices.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case 'Price (Lowest to Highest)':
            updatedServices.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            break;
          case 'Price (Highest to Lowest)':
            updatedServices.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            break;
          default:
            break;
        }
  
        setServices(updatedServices);
      } catch (error) {
        console.error('Error updating services:', error);
      }
    };
  
    updateServices();
    // let filteredServices = [...services];

    // switch (selectedFilter) {
      
    // }

    // setServices(filteredServices);
  }, [selectedFilter]);

  
  // TRIGGERS THE MODAL
  const onAddService = (appointment: any) => {
    setShowAddService(true);
  }

    const onUpdateService = (service: Service, buttonName: string) => {
      if (buttonName === 'update') {
        setUpdateServiceFormData({
          _id: service._id,
          name: service.name,
          price: service.price,
          description: service.description,
          type: service.type,
          createdAt: service.createdAt,
          updatedAt: service.type,
          isArchived: service.isArchived,
        }); // Set the data for the update form fields
        setShowUpdateService(true); // Open the update modal
      } else if (buttonName === 'archive') {
        setShowArchiveService(true);

        setUpdateServiceFormData({
          _id: service._id,
          name: service.name,
          price: service.price,
          description: service.description,
          type: service.type,
          createdAt: service.createdAt,
          updatedAt: service.type,
          isArchived: true
        }); // Set the data for the update form fields
      }
    };
    

  const [errorFormData, setErrorFormData] = useState<ErrorAddServicesFormData>({
    name: { error: false, message: null },
    price: { error: false, message: null },
    description: { error: false, message: null }
  })

  const [serviceFormData, setServiceFormData] = useState<AddServicesFormData>({
    name: '',
    price: '',
    description: '',
    type: '',
    isArchived: false,
  })

  const [updateServiceFormData, setUpdateServiceFormData] = useState<UpdateServicesFormData>({
    _id: '',
    name: '',
    price: '',
    description: '',
    type: '',
    createdAt: '',
    updatedAt: '',
    isArchived: false,
  })

  //CLEAR MODAL
  const clearModal = () => {
    setServiceFormData({ name: '', price: '', description: '' , type: '', isArchived: false}); // Reset add service modal data
    setUpdateServiceFormData({ _id: '', name: '', price: '', description: '', type: '', createdAt: '', updatedAt: '', isArchived: false}); // Reset update service modal data
  };

  // FOR ADDING A SERVICE
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
  
      // Add the new service to the services state
      // setServices(prevServices => [...prevServices, responseData]);
      setServices([...services, responseData]);

      clearModal();

    } catch (error) {
      alert('Service failed');
      console.error('Error adding service:', error);
    }
  }

  
  // FOR UPDATE BUTTON
  const updateService = (e: any) => {
    e.preventDefault();

    fetch(`/api/dentist/dentist-service`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateServiceFormData),
    })
      .then(async (response) => {
        if (!response.ok) {
          const error = await response.json();
          alert('Update failed: ' + JSON.stringify(error));
        } else {
          const updatedService = await response.json();
          console.log('Service updated: ', updatedService);
          setShowUpdateService(false); // Close the modal after successful 

          setServices(prevServices =>
            prevServices.map(prevService =>
              prevService._id === updatedService._id ? updatedService : prevService
            )
          );

          clearModal();
        }
      })
      .catch(error => {
        alert('Update failed');
        console.error('Error updating service:', error);
      });
  }
  //FOR ARCHIVE

  const archiveService = async (e: any) => {
    // e.preventDefault();

    fetch(`/api/dentist/dentist-service`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateServiceFormData),
    })
      .then(async (response) => {
        if (!response.ok) {
          const error = await response.json();
          alert('Update failed: ' + JSON.stringify(error));
        } else {
          const updatedService = await response.json();
          console.log('Service updated: ', updatedService);
          setShowArchiveService(false); // Close the modal after successful update
  
          setServices((prevServices) =>
            prevServices.map((prevService) =>
              prevService._id === updatedService._id ? updatedService : prevService
            )
          );
  
          // Remove the updated service from the table
          setServices((prevServices) =>
            prevServices.filter((service) => service._id !== updatedService._id)
          );
  
          clearModal();
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
      <section className={styles.main}>
        <div className={styles1.servicecrud}>
        <div className={styles1.filters}>
          <div className={styles1.filters__search}>
            <input type='text' className={styles1.filters__searchInput} placeholder='Search services...' value={searchQuery}
            onChange={handleSearchChange} />
            <FontAwesomeIcon icon={faSearch} width={24} height={24} color={'#737373'} />
          </div>
          <div className={styles1.filters__sort}>
            <span className={styles1.filters__sortTitle}>Sort By:</span>
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
          {/* BUTTON TO TRIGGER THE MODAL */}
          <div className={styles1.filters__add} onClick={onAddService}>
          + Add Service
          </div>
        </div>
        {session && (
          <main>
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
              {searchedServices.length > 0 ? (
                   searchedServices.map((service, index) => (
                    <tr key={service._id}>
                    <td>{index + 1}</td>
                    <td>{service.name}</td>
                    <td>₱{service.price}</td>
                    <td>{service.description}</td>
                    <td className={styles1.tableAction}>
                      <EditButton onClick={() => onUpdateService(service, 'update')}>
                        <FontAwesomeIcon icon={faPencil} width={24} height={24} color={'#ffffff'} />
                      </EditButton>
                      <ArchiveButton onClick={() => onUpdateService(service, 'archive')}>
                        <FontAwesomeIcon icon={faFileArchive} width={24} height={24} color={'#ffffff'} />
                      </ArchiveButton>
                    </td>
                  </tr>
                   ))
              ) : (
                services.map((service, index) => (
                  <tr key={service._id}>
                    <td>{index + 1}</td>
                    <td>{service.name}</td>
                    <td>₱ {service.price}</td>
                    <td>{service.description}</td>
                    <td className={styles1.tableAction}>
                      <EditButton onClick={() => onUpdateService(service, 'update')}>
                        <FontAwesomeIcon icon={faPencil} width={24} height={24} color={'#ffffff'} />
                      </EditButton>
                      <ArchiveButton onClick={() => onUpdateService(service, 'archive')}>
                        <FontAwesomeIcon icon={faFileArchive} width={24} height={24} color={'#ffffff'} />
                      </ArchiveButton>
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
