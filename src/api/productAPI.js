import instance from "../configs/axios.config";

const productAPI = {
  // GET /api/v1/products
  getAllProducts: async ({ page }) => {
    try {
      const response = await instance.get(`/api/v1/products?page=${page}`);
      return response?.data;
    } catch (error) {
      return error?.response?.data;
    }
  },
  // GET /api/v1/products/:id
  getProductByID: async (id) => {
    try {
      const response = await instance.get(`/api/v1/products/${id}`);
      return response?.data;
    } catch (error) {
      return error?.response?.data;
    }
  },

  // PUT /api/v1/products/update/:id
  updateProduct: async ({
    id,
    ProductName,
    Price,
    Description,
    StockQuantity,
    Size,
    Color,
    CategoryID,
    image,
  }) => {
    try {
      const response = await instance.put(
        `/api/v1/products/update/${id}`,
        {
          ProductName,
          Price,
          Description,
          StockQuantity,
          Size,
          Color,
          image,
          CategoryID,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response?.data;
    } catch (error) {
      return error?.response?.data;
    }
  },
  // DELETE /api/v1/products/delete/:id
  deleteProduct: async (id) => {
    try {
      const response = await instance.delete(`/api/v1/products/delete/${id}`);
      return response?.data;
    } catch (error) {
      return error?.response?.data;
    }
  },
  // POST /api/v1/products/create
  addProduct: async ({
    ProductName,
    Price,
    Description,
    StockQuantity,
    Size,
    Color,
    image,
    CategoryID,
  }) => {
    try {
      const response = await instance.post(
        `/api/v1/products/create`,
        {
          ProductName,
          Price,
          Description,
          StockQuantity,
          Size,
          Color,
          image,
          CategoryID,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response?.data;
    } catch (error) {
      return error?.response?.data;
    }
  },
  // GET: /api/v1/categories
  getAllCategories: async () => {
    try {
      const response = await instance.get(`/api/v1/categories`);
      return response?.data;
    } catch (error) {
      return error?.response?.data;
    }
  },
};

export default productAPI;
