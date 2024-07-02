const isValidUrl = (url: string): boolean => {
    const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    return regex.test(url);
  };
  
  export { isValidUrl };
  