import { useEffect, useState } from 'react';
import styles from '../styles/pages/services.module.scss'
import styles1 from '../styles/pages/home.module.scss'
import DentistLayout from '../layouts/DentistLayout';
import useAuthGuard from '../guards/auth.guard';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { UpdateServicesFormData } from '../types/services';

interface Service {
  _id: string;
  name: string;
  price: number;
  type: string;
  description: string;
  isArchived: boolean;
}


export default function ServiceRecords() {
  const { session, status } = useAuthGuard();
  const [services, setServices] = useState<Service[]>([])
  const [showDeleteService, setShowDeleteService] = useState(false)
  const [showRestoreService, setShowRestoreService] = useState(false)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('api/dentist/archive');
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
  }); 

  const [updateServiceFormData, setUpdateServiceFormData] = useState<UpdateServicesFormData>({
    _id: '',
    name: '',
    price: '',
    description: '',
    type: '',
    isArchived: true,
  })

  const onUpdateService = (service: Service, buttonName: string) => {
    
      if (buttonName === 'delete') {
        setShowDeleteService(true);
        setUpdateServiceFormData({
          _id: service._id,
          name: service.name,
          price: service.price.toString(),
          description: service.description,
          type: service.type,
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
          isArchived: false
        });
      }
  };

  const deleteService = async (serviceId: string) => {
    try {
      const response = await fetch(`api/dentist/archive`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateServiceFormData),
      });

      if (!response.ok) {
        throw new Error('Failed to delete service');
      }

      alert("SUCCESSFULLY DELETED")

      // If deletion is successful, update the services state by removing the deleted service
      setShowDeleteService(false);
      setServices(prevServices =>
        prevServices.filter(service => service._id !== serviceId)
      );
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const restoreService = async (serviceId: string) => {
    try {

      const response = await fetch(`api/dentist/archive`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateServiceFormData),
      });

      if (!response.ok) {
        throw new Error('Failed to restore service');
      }

      alert("SUCCESSFULLY RESTORE")
      // If deletion is successful, update the services state by removing the deleted service
      setShowRestoreService(false);
      setServices(prevServices =>
        prevServices.filter(service => service._id !== serviceId)
      );
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };
  
  // Update the table whenever 'services' state changes
  useEffect(() => {
  }, [services]); // Add 'services' to the dependency array
  

  const renderContent = () => {
    return (
      <>

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
          <main className={styles.main}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Service Name</th>
                  <th>Base Charge</th>
                  <th> Type </th>
                  <th>Description</th>
                  <th> Action </th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => 
                  <tr key={service._id}>
                    <td>{index + 1}</td>
                    <td>{service.name}</td>
                    <td>P {service.price.toFixed(2)}</td>
                    <td> {service.type} </td>
                    <td>{service.description}</td>
                    <td> 
                      <Button onClick={() => onUpdateService(service, 'delete')}> DELETE </Button>
                      <Button onClick={() => onUpdateService(service, 'restore')}> RESTORE </Button>
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
