import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input, Button, notification, Select } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import productAPI from "../../api/productAPI";

const validate = (value, key) =>
  value === "" ? `${key} không được để trống` : "";

const EditProduct = () => {
  const [productParams] = useSearchParams();
  const id = productParams.get("id");
  console.log(id);
  const formRef = React.useRef(null);
  const [loading, setLoading] = React.useState(false);
  const [api, contextHolder] = notification.useNotification();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [ProductName, setProductName] = React.useState("");
  const [Description, setDescription] = React.useState("");
  const [Price, setPrice] = React.useState("");
  const [StockPrice, setStockPrice] = React.useState("");
  const [StockQuantity, setStockQuantity] = React.useState("");
  const [Size, setSize] = React.useState("");
  const [Color, setColor] = React.useState("");
  const [image, setImage] = React.useState(null);
  const [CategoryID, setCategoryID] = React.useState("");
  const [PhotoLink, setPhotoLink] = React.useState("");
  const [errors, setErrors] = React.useState({
    ProductName: "",
    Description: "",
    Price: "",
    StockPrice: "",
    StockQuantity: "",
    Color: "",
    size: "",
    category: "",
  });

  const { data: Categories } = useQuery({
    queryKey: "GetAllCategories",
    queryFn: () => productAPI.getAllCategories(),
    staleTime: 1000 * 60 * 5,
  });
  let CategoriesOptions = [];
  if (Categories) {
    Categories?.categories?.map((item) => {
      CategoriesOptions.push({ label: item.CategoryName, value: item.id });
      return CategoriesOptions;
    });
  }

  const { data } = useQuery({
    queryKey: ["GetProductById", id],
    queryFn: () => productAPI.getProductByID(id),
    staleTime: 1000 * 60 * 5,
  });

  React.useEffect(() => {
    if (data) {
      setProductName(data?.product?.ProductName);
      setDescription(data?.product?.Description);
      setPrice(data?.product?.Price);
      setStockPrice(data?.product?.StockPrice);
      setStockQuantity(data?.product?.StockQuantity);
      setSize(data?.product?.Size.split(", "));
      setColor(data?.product?.Color);
      setPhotoLink(data?.product?.PhotoLink);
      setCategoryID(data?.product?.Categories[0]?.id ?? 1);
    }
  }, [data]);

  let SelectOptions = [
    { label: "35", value: "35" },
    { label: "36", value: "36" },
    { label: "37", value: "37" },
    { label: "38", value: "38" },
    { label: "39", value: "39" },
    { label: "40", value: "40" },
    { label: "41", value: "41" },
    { label: "42", value: "42" },
    { label: "43", value: "43" },
    { label: "44", value: "44" },
    { label: "45", value: "45" },
    { label: "46", value: "46" },
  ];

  const { mutate } = useMutation({
    mutationFn: ({
      ProductName,
      Price,
      Description,
      StockQuantity,
      Size,
      Color,
      image,
      id,
      CategoryID,
    }) =>
      productAPI.updateProduct({
        ProductName,
        Price,
        Description,
        StockQuantity,
        Size,
        Color,
        image,
        id,
        CategoryID,
      }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const errName = validate(ProductName, "Tên sản phẩm");
    const errDes = validate(Description, "Mô tả");
    const errPrice = validate(Price, "Giá bán")
      ? validate(Price, "Giá bán")
      : Price < 0
      ? "Giá bán không đúng định dạng"
      : "";
    const errStockP =
      validate(StockPrice, "Giá kho")
        ? validate(StockPrice, "Giá kho")
        : StockPrice < 0
        ? "Giá kho không đúng định dạng"
        : "";
    const errQuantity = validate(StockQuantity, "Số lượng kho");
    const errColor = validate(Color, "Màu sắc");
    const errSize =
      !validate(Size, "Kích thước") === ""
        ? validate(Size, "Kích thước")
        : Size?.length === 0
        ? "Kích thước không được để trống"
        : "";
    const errCa = validate(CategoryID, "Danh mục sản phẩm");
    if (
      errName ||
      errDes ||
      errPrice ||
      errStockP ||
      errQuantity ||
      errColor ||
      errSize ||
      errCa
    ) {
      setErrors({
        ProductName: errName,
        Description: errDes,
        Price: errPrice,
        StockPrice: errStockP,
        StockQuantity: errQuantity,
        Color: errColor,
        size: errSize,
        category: errCa,
      });
    }
    if (
      errName === "" &&
      errDes === "" &&
      errPrice === "" &&
      errStockP === "" &&
      errQuantity === "" &&
      errColor === "" &&
      errSize === "" &&
      errCa === ""
    ) {
      setLoading(true);
      mutate(
        {
          ProductName: ProductName.trim(),
          Price,
          Description: Description.trim(),
          StockQuantity,
          StockPrice,
          Size,
          Color: Color.trim(),
          image,
          id,
          CategoryID,
        },
        {
          onSuccess: (data) => {
            setLoading(false);
            if (data?.message === "Update product successfully") {
              api.success({
                message: "Cập nhật sản phẩm thành công",
                placement: "topRight",
                duration: 1.5,
              });
              queryClient.refetchQueries("GetAllProducts");
              setTimeout(() => {
                navigate("/product");
              }, 1800);
            } else {
              api.error({
                message: "Cập nhật sản phẩm thất bại",
                placement: "topRight",
              });
            }
          },
        }
      );
    }
  };

  return (
    <div>
      <h3 className="text-center font-semibold text-2xl">CHỈNH SỬA SẢN PHẨM</h3>
      <form className="p-10" ref={formRef} onSubmit={handleSubmit}>
        <div className="flex flex-col items-start my-3">
          <label htmlFor="">Tên sản phẩm</label>
          <Input
            className="p-2 my-2 rounded-lg"
            placeholder="Tên sản phẩm"
            name="ProductName"
            type="text"
            onChange={(e) => {
              setProductName(e.target.value);
              setErrors({
                ...errors,
                [e.target.name]: "",
              });
            }}
            value={ProductName}
          />
          {errors.ProductName && (
            <label htmlFor="name" className="text-red-500 ml-4">
              {errors.ProductName}
            </label>
          )}
        </div>
        <div className="flex flex-col items-start my-3">
          <label htmlFor="">Mô tả</label>
          <Input
            className="p-2 my-2 rounded-lg"
            placeholder="Mô tả"
            name="Description"
            type="text"
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors({
                ...errors,
                [e.target.name]: "",
              });
            }}
            value={Description}
          />
          {errors.Description && (
            <label htmlFor="name" className="text-red-500 ml-4">
              {errors.Description}
            </label>
          )}
        </div>
        <div className="flex flex-col items-start my-3">
          <label htmlFor="">Giá cả</label>
          <Input
            className="p-2 my-2 rounded-lg"
            placeholder="Giá cả"
            name="Price"
            type="number"
            value={Price}
            onChange={(e) => {
              setPrice(e.target.value);
              setErrors({
                ...errors,
                [e.target.name]: "",
              });
            }}
          />
          {errors.Price && (
            <label htmlFor="name" className="text-red-500 ml-4">
              {errors.Price}
            </label>
          )}
        </div>
        {errors.ProductName && (
          <label htmlFor="name" className="text-red-500 ml-4">
            {errors.ProductName}
          </label>
        )}
        <div className="flex flex-col items-start my-3">
          <label htmlFor="">Giá kho</label>
          <Input
            className="p-2 my-2 rounded-lg"
            placeholder="Giá kho"
            name="StockPrice"
            type="number"
            value={StockPrice}
            onChange={(e) => {
              setStockPrice(e.target.value);
              setErrors({
                ...errors,
                [e.target.name]: "",
              });
            }}
          />
          {errors.StockPrice && (
            <label htmlFor="name" className="text-red-500 ml-4">
              {errors.StockPrice}
            </label>
          )}
        </div>
        <div className="flex flex-col items-start my-3">
          <label htmlFor="">Số lượng tồn</label>
          <Input
            className="p-2 my-2 rounded-lg"
            placeholder="Số lượng tồn kho"
            name="StockQuantity"
            type="number"
            onChange={(e) => {
              setStockQuantity(e.target.value);
              setErrors({
                ...errors,
                [e.target.name]: "",
              });
            }}
            value={StockQuantity}
          />
          {errors.StockQuantity && (
            <label htmlFor="name" className="text-red-500 ml-4">
              {errors.StockQuantity}
            </label>
          )}
        </div>
        <div className="flex flex-col items-start my-3">
          <label htmlFor="">Màu sắc</label>
          <Input
            className="p-2 my-2 rounded-lg"
            placeholder="Màu sắc"
            name="Color"
            type="text"
            onChange={(e) => {
              setColor(e.target.value);
              setErrors({
                ...errors,
                [e.target.name]: "",
              });
            }}
            value={Color}
          />
          {errors.Color && (
            <label htmlFor="name" className="text-red-500 ml-4">
              {errors.Color}
            </label>
          )}
        </div>
        <div className="flex flex-col items-start my-3">
          <label htmlFor="">Kích thước</label>
          <Select
            className="my-2"
            mode="multiple"
            style={{
              width: "100%",
              height: "40px",
            }}
            value={Size}
            placeholder="Chọn kích thước sản phẩm"
            onChange={(value) => {
              setSize(value);
              setErrors({
                ...errors,
                size: "",
              });
            }}
            options={SelectOptions}
          />
          {errors.size && (
            <label htmlFor="name" className="text-red-500 ml-4">
              {errors.size}
            </label>
          )}
        </div>
        <div className="flex flex-col items-start my-3">
          <label htmlFor="">Danh mục sản phẩm</label>
          <Select
            className="my-2"
            style={{
              width: "100%",
              height: "40px",
            }}
            placeholder="Danh mục sản phẩm"
            onChange={(value) => {
              setCategoryID(value);
              setErrors({
                ...errors,
                category: "",
              });
            }}
            options={CategoriesOptions}
            value={CategoryID}
          />
          {errors.category && (
            <label htmlFor="name" className="text-red-500 ml-4">
              {errors.category}
            </label>
          )}
        </div>
        <div className="flex flex-col items-start my-3">
          <label htmlFor="">Ảnh</label>
          <img
            className="w-[300px] h-[200px] object-cover"
            src={PhotoLink}
            alt="thumbnail"
          />
          <Input
            className="p-2 my-2 rounded-lg"
            placeholder="Ảnh sản phẩm"
            name="image"
            type="file"
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
          />
        </div>
        <Button
          htmlType="submit"
          icon={<SaveOutlined />}
          style={{ height: "40px" }}
          type="primary"
          loading={loading}
        >
          Lưu lại
        </Button>
      </form>
      {contextHolder}
    </div>
  );
};

export default EditProduct;
