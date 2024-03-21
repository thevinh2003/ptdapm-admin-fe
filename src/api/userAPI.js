import instance from "../configs/axios.config";

const userAPI = {
  // GET: /api/v1/users
  getAllUsers: async ({ page }) => {
    try {
      const response = await instance.get(`/api/v1/users?page=${page}`);
      return response?.data;
    } catch (error) {
      return error?.response?.data;
    }
  },
  // GET: /api/v1/users/:uid
  getUserById: async (uid) => {
    try {
      const response = await instance.get(`/api/v1/users/${uid}`);
      return response?.data;
    } catch (error) {
      return error?.response?.data;
    }
  },
  // PUT: /api/v1/users/update/:uid
  updateUser: async ({
    uid,
    username,
    email,
    fullname,
    phoneNumber,
    address,
    roleID,
  }) => {
    try {
      const response = await instance.put(`/api/v1/users/update/${uid}`, {
        username,
        email,
        fullname,
        phoneNumber,
        address,
        roleID,
      });
      return response?.data;
    } catch (error) {
      return error?.response?.data;
    }
  },

  // POST: /api/v1/auth/register
  addUser: async ({
    username,
    password,
    email,
    fullname,
    phoneNumber,
    address,
  }) => {
    try {
      const response = await instance.post("/api/v1/auth/register", {
        username,
        password,
        email,
        fullname,
        phoneNumber,
        address,
      });
      return response?.data;
    } catch (error) {
      return error?.response?.data;
    }
  },

  // DELETE: /api/v1/users/delete/:uid
  deleteUser: async (uid) => {
    try {
      const response = await instance.delete(`/api/v1/users/delete/${uid}`);
      return response?.data;
    } catch (error) {
      return error?.response?.data;
    }
  },
};

export default userAPI;
