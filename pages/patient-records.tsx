import { useEffect, useState } from 'react';
import styles from '../styles/pages/services.module.scss'
import DentistLayout from '../layouts/DentistLayout';
import useAuthGuard from '../guards/auth.guard';
import Button from '../components/Button';

interface Record {
  _id: string;
  name: string;
  contactNumber: number;
  age: number;
  sex: string;
  dateOfBirth: string;
}

export default function PatientRecords() {
  const { session, status } = useAuthGuard();
  const [records, setRecords] = useState<Record[]>([])

  useEffect(() => {
    const setRecordsData = async () => {
      let response = await fetch('api/dentist/patients-records');
      let data = await response.json() || [];

      setRecords(data)
    }

    setRecordsData()
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
                  <th>Name</th>
                  <th>Contact Number</th>
                  <th>Age</th>
                  <th>Sex</th>
                  <th>Date of Birth</th>
                  <th>Age</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, index) => 
                  <tr key={record._id}>
                    <td>{index+1}</td>
                    <td>{record.name}</td>
                    <td>{record.contactNumber}</td>
                    <td>{record.age}</td>
                    <td>{record.sex}</td>
                    <td>{record.dateOfBirth}</td>
                    <td>
                      <Button>Show More </Button>
                      <Button> Archive </Button>
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
