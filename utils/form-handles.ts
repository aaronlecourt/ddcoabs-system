
export const handleFormDataChange = (e: any, setFormData: any, setErrorFormData: any) => {
  const { name, value } = e.target;
  setFormData((prevFormData: any) => ({
    ...prevFormData,
    [name]: value
  }))
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