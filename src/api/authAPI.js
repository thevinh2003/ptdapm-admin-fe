import instance from "../configs/axios.config";

const authAPI = {
  // POST: /api/V1/auth/refreshtoken
  refreshToken: async () => {
    try {
      const response = await instance.post("/api/v1/auth/refreshtoken");
      return response?.data;
    } catch (error) {
      return error?.response?.data;
    }
  },
  // POST: /api/v1/auth/login
  login: async (data) => {
    const { email, password } = data;
    try {
      const response = await instance.post("/api/v1/auth/login", {
        email,
        password,
      });
      return response?.data;
    } catch (error) {
      return error?.response?.data;
    }
  },
  // DELETE: /api/V1/auth/logout
  logout: async () => {
    try {
      const response = await instance.delete("/api/v1/auth/logout");
      return response?.data;
    } catch (error) {
      return error?.response?.data;
    }
  },
};

export default authAPI;
