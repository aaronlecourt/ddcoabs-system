import { useState } from 'react';
import styles from '../styles/pages/services.module.scss'
import DentistLayout from '../layouts/DentistLayout';
import useAuthGuard from '../guards/auth.guard';

export default function Services() {
  const { session, status } = useAuthGuard();
  const [services, setServices] = useState([
    {
      id: 1,
      name: 'Consultation Fee',
      amount: '500.00',
      description: 'Lorem ipsum dolor sit amet.'
    },
    {
      id: 2,
      name: 'Oral Prophylaxis',
      amount: '1000.00',
      description: 'Lorem ipsum dolor sit amet.'
    },
    {
      id: 3,
      name: 'Tooth Filling',
      amount: '1000.00',
      description: 'Lorem ipsum dolor sit amet.'
    },
  ])

  const renderContent = () => {
    return (
      <>
        {session && (
          <main className={styles.main}>
            <table className={styles.table}>
              <thead>
                <th>#</th>
                <th>Service Name</th>
                <th>Base Charge</th>
                <th>Description</th>
              </thead>
              <tbody>
                {services.map((service, index) => 
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>{service.name}</td>
                    <td>{service.amount}</td>
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
