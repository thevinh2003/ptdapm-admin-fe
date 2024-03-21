import instance from "../configs/axios.config";

const categoryAPI = {
  // GET: /api/v1/categories
  getAllCategories: async ({ page }) => {
    try {
      const response = await instance.get(`/api/v1/categories?page=${page}`);
      return response?.data;
    } catch (error) {
      return error?.response?.data;
    }
  },

  // GET: /api/v1/categories/:id
  getCategoryByID: async (id) => {
    try {
      const response = await instance.get(`/api/v1/categories/${id}`);
      return response?.data;
    } catch (error) {
      return error?.response?.data;
    }
  },

  // POST: /api/v1/categories/create
  createCategory: async ({ CategoryName, Description }) => {
    try {
      const response = await instance.post("/api/v1/categories/create", {
        CategoryName,
        Description,
      });
      return response?.data;
    } catch (error) {
      return error?.response?.data;
    }
  },
  // PUT: /api/v1/categories/update/:id
  updateCategory: async ({ id, CategoryName, Description }) => {
    try {
      const response = await instance.put(`/api/v1/categories/update/${id}`, {
        CategoryName,
        Description,
      });
      return response?.data;
    } catch (error) {
      return error?.response?.data;
    }
  },
  // DELETE: /api/v1/categories/delete/:id
  deleteCategory: async (id) => {
    try {
      const response = await instance.delete(`/api/v1/categories/delete/${id}`);
      return response?.data;
    } catch (error) {
      return error?.response?.data;
    }
  },
};

export default categoryAPI;
