import React from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, notification } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import categoryAPI from "../../api/categoryAPI";

const AddCategory = () => {
  const formRef = React.useRef(null);
  const [loading, setLoading] = React.useState(false);
  const [api, contextHolder] = notification.useNotification();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [CategoryName, setCategoryName] = React.useState("");
  const [Description, setDescription] = React.useState("");
  const [errors, setErrors] = React.useState({
    CategoryName: "",
    Description: "",
  });

  const { mutate } = useMutation({
    mutationFn: ({ CategoryName, Description }) =>
      categoryAPI.createCategory({ CategoryName, Description }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const errName = !CategoryName ? 'Tên danh mục không được để trống' : ''
    const errDes = !Description ? 'Mô tả không được để trống' : ''
    if (errName || errDes) {
      setErrors({
        CategoryName: errName,
        Description: errDes,
      })
    }
    if (errName === '' && errDes === '') {
      setLoading(true);
      mutate(
        { CategoryName: CategoryName.trim(), Description: Description.trim() },
        {
          onSuccess: (data) => {
            setLoading(false);
            if (data?.message === "Category created") {
              api.success({
                message: "Thêm danh mục thành công",
                placement: "topRight",
                duration: 1.5,
              });
              queryClient.refetchQueries("GetAllCategories");
              setTimeout(() => {
                navigate("/category");
              }, 1800);
            } else {
              api.error({
                message: "Thêm danh mục thất bại",
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
      <h3 className="text-center font-semibold text-2xl">THÊM DANH MỤC</h3>
      <form className="p-10" ref={formRef} onSubmit={handleSubmit}>
        <Input
          className="p-2 my-2 rounded-lg"
          placeholder="Tên danh mục"
          name="CategoryName"
          type="text"
          onChange={(e) => {
            setCategoryName(e.target.value)
            setErrors({
              ...errors,
              [e.target.name]: ''
            })
          }}
          value={CategoryName}
        />
        {errors.CategoryName && (
          <label htmlFor="name" className="text-red-500 ml-4">
            {errors.CategoryName}
          </label>
        )}
        <Input
          className="p-2 my-2 rounded-lg"
          placeholder="Mô tả"
          name="Description"
          type="text"
          onChange={(e) => {
            setDescription(e.target.value)
            setErrors({
              ...errors,
              [e.target.name]: ''
            })
          }}
          value={Description}
        />
        {errors.Description && (
          <label htmlFor="name" className="text-red-500 ml-4">
            {errors.Description}
          </label>
        )}
        <br></br>
        <Button
          htmlType="submit"
          icon={<SaveOutlined />}
          style={{ height: "40px" }}
          type="primary"
          loading={loading}
        >
          Thêm
        </Button>
      </form>
      {contextHolder}
    </div>
  );
};

export default AddCategory;
