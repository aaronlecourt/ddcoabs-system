import { useEffect, useState } from 'react';
import styles from '../styles/pages/services.module.scss'
import DentistLayout from '../layouts/DentistLayout';
import useAuthGuard from '../guards/auth.guard';

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

  const renderContent = () => {
    return (
      <>
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
