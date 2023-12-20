import Image from 'next/image'
import styles from './style.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faChevronCircleDown, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import Modal from '../Modal';
import { FormData, ErrorFormData } from '../../types/changepassword';
import { handleFormEnter, handleFormDataChange } from '../../utils/form-handles';
import { isChangePasswordFormValid } from '../../validations/changepassword';
import Button from '../Button';
import useAuthGuard from '../../guards/auth.guard';
import { useRouter } from 'next/router';

interface Item {
  text: string,
  link: string,
  className?: string
}

export default function Navbar({ items = [] }: { items: Item[] }) {
  const { session, status } = useAuthGuard();
  const router = useRouter();
  const user = session?.user;

  const [showDropdown, setShowDropdown] = useState(false)
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [showChangePasswordField, setShowChangePasswordField] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  })

  const [errorFormData, setErrorFormData] = useState<ErrorFormData>({
    oldPassword: { error: false, message: null },
    newPassword: { optional: true, error: false, message: null },
    confirmNewPassword: { optional: true, error: false, message: null },
  })

  const resetForm = () => {
    setFormData({
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    })
    setErrorFormData({
      oldPassword: { error: false, message: null },
      newPassword: { optional: true, error: false, message: null },
      confirmNewPassword: { optional: true, error: false, message: null },
    })
  }

  const proceed = (e: any) => {
    e.preventDefault();

    if (!session) return

    if (isChangePasswordFormValid(formData, errorFormData, setErrorFormData)) {
      // Confirm Old Password API call here
      let correctOldPassword = true;
      fetch(`/api/${user.role}/password/compare/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: formData.oldPassword }),
      })
      .then(async (response) => { 
        console.log(response)
        const responseMsg = await response.json()
        if (!response.ok) {
          correctOldPassword = false
          alert('Failed: ' + JSON.stringify(responseMsg))
        } else {
          if (!correctOldPassword) return;
  
          setErrorFormData(prevErrorFormData => ({
            ...prevErrorFormData,
            ['newPassword']: {
              ...prevErrorFormData['newPassword'],
              optional: false,
            },
            ['confirmNewPassword']: {
              ...prevErrorFormData['confirmNewPassword'],
              optional: false,
            }
          }));
    
          setShowChangePasswordField(true);  
        }
      })  
      .catch(error => {
        setErrorFormData(prevValue => ({
          ...prevValue,
          ['oldPassword']: {
            error: true,
            message: 'Invalid password'
          }
        }))
        console.error('Error comparison of old password to existing password:', error);
      });
    }
  }

  const cancel = (e: any) => {
    e.preventDefault();

    resetForm();

    setShowChangePasswordField(false);
    setShowChangePasswordModal(false);
  }

  const updatePassword = (e: any) => {
    e.preventDefault();

    if (isChangePasswordFormValid(formData, errorFormData, setErrorFormData)) {
      // Change Password API Call here
      fetch(`/api/${user.role}/password/update/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      .then(async (response) => {
        const responseMsg = await response.json()
        if (!response.ok) {
          alert('password update failed! ' + JSON.stringify(responseMsg))
        } else {
          alert('password successfully updated!')
        }
      })  
      .catch(error => {
        console.error('Error updating password:', error);
      })
      .then(() => {
        resetForm();

        setShowChangePasswordField(false);
        setShowChangePasswordModal(false);
      });
    }
  }

  const openChangePasswordModal = (e: any) => {
    e.preventDefault();

    setShowChangePasswordModal(true);
    setShowDropdown(false);
  }

  const renderOldPassword = () => {
    return (
      <>
        <div className={styles.formField}>
          <div className='formLabel'>
            <label>Enter your old password to proceed:</label>
          </div>
          <div className={`formInput ${errorFormData.oldPassword.error ? 'formInput--error' : ''}`}>
            {errorFormData.oldPassword.error && <span className='formInput__errorMessage formInput__errorMessage--right'>{errorFormData.oldPassword.message}</span>}
            <input type='password'
              onKeyDown={e => handleFormEnter(e, proceed)}
              name='oldPassword'
              value={formData.oldPassword}
              onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)}
            />
          </div>
        </div> 
        <div className={styles.formFieldInline}>
          <Button onClick={proceed}>Update Password</Button>
        </div>
      </>
    )
  }

  const renderChangePassword = () => {
    return (
      <>
        <div className={styles.formField}>
          <div className='formLabel'>
            <label>New Password</label>
            {errorFormData.newPassword.error && <span className='formLabel__errorMessage'>{errorFormData.newPassword.message}</span>}
          </div>
          <div className={`formInput ${errorFormData.newPassword.error ? 'formInput--error' : ''}`}>
            <input type='password'
              onKeyDown={e => handleFormEnter(e, updatePassword)}
              name='newPassword'
              value={formData.newPassword}
              onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)}
            />
          </div>
        </div> 
        <div className={styles.formField}>
          <div className='formLabel'>
            <label>Confirm Password</label>
            {errorFormData.confirmNewPassword.error && <span className='formLabel__errorMessage'>{errorFormData.confirmNewPassword.message}</span>}
          </div>
          <div className={`formInput ${errorFormData.confirmNewPassword.error ? 'formInput--error' : ''}`}>
            <input type='password'
              onKeyDown={e => handleFormEnter(e, updatePassword)}
              name='confirmNewPassword'
              value={formData.confirmNewPassword}
              onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)}
            />
          </div>
        </div>
        <div className={styles.formFieldFlex}>
          <Button type='secondary' onClick={cancel}>Cancel</Button>
          <Button onClick={updatePassword}>Update Password</Button>
        </div>
      </>
    )
  }

  return (
    <>
      <Modal open={showChangePasswordModal} setOpen={setShowChangePasswordModal} modalWidth={500} modalRadius={10} onClose={cancel}>
        <h3>Change Password</h3>
        {!showChangePasswordField ? renderOldPassword() : renderChangePassword()} 
      </Modal>
      <nav className={`${styles.navbar} ${!session ? styles.transparentNavbar : ''}`}>
        {session &&
        <Image 
        className={styles.navbar__logo}
        src='/logo.png'
        alt='logo'
        width={250}
        height={0}
      />
        }
        <div className={styles.navbar__itemContainer}>
          {items.map(item => 
            <a key={item.text} 
            className={`${styles.navbar__item} ${item.className ? styles[item.className] : ''} ${router.pathname == item.link ? styles.active : ''}`} 
            href={item.link}>
              {item.text}
            </a>
          )}
          {session &&
          <div className={styles.navbar__profileContainer} onClick={() => setShowDropdown(!showDropdown)}>
          <div className={styles.navbar__profileIcon}></div>
          {/* <Image 
            src='/caretdown.svg'
            alt='caretdown'
            width={20}
            height={20}
          /> */}
          <FontAwesomeIcon icon={faChevronDown} color={'#fff'} width={20} height={20} />
        </div>
          }
        </div>
        <div className={styles.navbar__itemContainerMobile}>
          <FontAwesomeIcon icon={faBars} color={'#fff'} width={30} height={30} />
        </div>
        {showDropdown && 
          <div className={styles.navbar__profileDropdown}>
            <a href='/profile'>Profile</a>
            <a href='#' onClick={openChangePasswordModal}>Change Password</a>
            <a href='#' onClick={() => signOut()}>Sign Out</a>
          </div>
        }
      </nav>
    </>
  )
}