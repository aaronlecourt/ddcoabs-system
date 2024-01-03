
export const isServiceNameValid = (serviceName: string): boolean => {
    return Boolean(serviceName.trim() && serviceName.length <= 30);
  }
  
export const isServiceDescriptionValid = (serviceDescription: string): boolean => {
    return serviceDescription.length > 10 && serviceDescription.length <= 255;
  }

  export const isServiceDescriptionEmpty = (serviceDescription: string): boolean => {
    return serviceDescription.length === 0;
  }
  
  export const isPriceValid = (price: string): boolean => {
    const numericRegex = /^\d+(\.\d{1,2})?$/; // Allows up to 2 decimal places
    return numericRegex.test(price);
  }

  export const isPriceEmpty = (price: string): boolean => {
    return price.length === 0;
  }
  