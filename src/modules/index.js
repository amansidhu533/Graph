 
import APIs from "../api";
import axiosInstance from "../axiosInstance";

 
  export const fetchFileJsonData = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await axiosInstance.post(APIs.uploadProcessJson, formData, {
        headers: {
          'Authorization': 'token fab97082097b4f1:dc449e30fa68116',
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("Data:", response.data.message);
      return response.data.message;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };


 
  export const fetchFileData = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await axiosInstance.post(APIs.uploadProcessFile, formData, {
        headers: {
          'Authorization': 'token fab97082097b4f1:dc449e30fa68116',
          'Content-Type': 'multipart/form-data',
          'Cookie': 'full_name=Guest; sid=Guest; system_user=no; user_id=Guest; user_image='
        },
      });
      console.log("Data:", response.data.message);
      return response.data.message;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }; 