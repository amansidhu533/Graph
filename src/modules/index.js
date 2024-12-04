import APIs from "../api";
import axiosInstance from "../axiosInstance";

export const fetchFileJsonData = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axiosInstance.post(
      APIs.uploadProcessJson,
      formData,
      {
        headers: {
          Authorization: "token fab97082097b4f1:a5a4f38d3d47e50",
          "Content-Type": "multipart/form-data",
        },
      }
    );
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
    const response = await axiosInstance.post(
      APIs.uploadProcessFile,
      formData,
      {
        headers: {
          Authorization: "token fab97082097b4f1:a5a4f38d3d47e50",
          "Content-Type": "multipart/form-data",
          Cookie:
            "full_name=Guest; sid=Guest; system_user=no; user_id=Guest; user_image=",
        },
      }
    );
    console.log("Full Response:", response);
    const parsedMessage =
      typeof response.data.message === "string"
        ? JSON.parse(response.data.message)
        : response.data.message;
    console.log("Parsed Message:", parsedMessage);

    return parsedMessage;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const fetchQueryResponse = async (
  userQuery,
  tableName = "Data_sales_SE0yw"
) => {
  const requestBody = {
    user_query: userQuery,
    is_new_data_source: false,
    table_name: tableName,
  };

  try {
    const response = await axiosInstance.post(APIs.askQuery, requestBody, {
      headers: {
        Authorization: "token fab97082097b4f1:a5a4f38d3d47e50",
        "Content-Type": "application/json",
        Cookie:
          "full_name=Guest; sid=Guest; system_user=no; user_id=Guest; user_image=",
      },
    });

    console.log("Query Result:", response.data.message);
    return response.data.message;
  } catch (error) {
    // Check if there’s an additional response message from the API
    console.error(
      "Error querying data:",
      error.response ? error.response.data : error.message
    );
    alert(
      `Error querying data: ${
        error.response ? error.response.data.message : error.message
      }`
    );
    throw error;
  }
};

export const fetchDBData = async (tableName) => {
  const requestBody = {
    table_name: tableName,
  };

  try {
    const response = await axiosInstance.post(APIs.connectDB, requestBody, {
      headers: {
        Authorization: "token fab97082097b4f1:a5a4f38d3d47e50",
        "Content-Type": "application/json",
        Cookie:
          "full_name=Guest; sid=Guest; system_user=no; user_id=Guest; user_image=",
      },
    });

    const chartData = response.data;  
    return chartData;
  } catch (error) {
    console.error(
      "Error connecting to the database:",
      error.response?.data || error.message
    );
    throw error;
  }
};
