
export const handleFormDataChange = (e: any, setFormData: any, setErrorFormData: any) => {
  const { name, value, files } = e.target;
  let val = value;
  if (files && files.length > 0) {
    val = files[0].name
  }
  
  setFormData((prevFormData: any) => ({
    ...prevFormData,
    [name]: val
  }))
  
  if (name === 'sex') {
    localStorage.setItem('selectedSex', value);
  }

  setErrorFormData((prevErrorFormData: any) => ({
    ...prevErrorFormData,
    [name]: {
      optional: prevErrorFormData[name]?.optional || false,
      error: false,
      message: null
    }
  }))
}
export const handleFormEnter = (e: any, callback: (e: any) => void) => {
  if (e.key === 'Enter') {
    callback(e);
  }
}