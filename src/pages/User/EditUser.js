import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input, Button, notification, Select } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import userAPI from "../../api/userAPI";

const EditUser = () => {
  const [userParams] = useSearchParams();
  const uid = userParams.get("uid");
  const formRef = React.useRef(null);
  const [loading, setLoading] = React.useState(false);
  const [api, contextHolder] = notification.useNotification();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [roleID, setRoleID] = React.useState(null);
  const [email, setEmail] = React.useState("");
  const [fullname, setFullname] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [errors, setErrors] = React.useState({
    fullname: "",
    phoneNumber: "",
    email: "",
  });

  const { data } = useQuery({
    queryKey: ["GetUserbyId", uid],
    queryFn: () => userAPI.getUserById(uid),
    staleTime: 1000 * 60 * 5,
  });

  React.useEffect(() => {
    if (data) {
      setEmail(data?._user?.Email);
      setFullname(data?._user?.FullName);
      setPhoneNumber(data?._user?.PhoneNumber);
      setRoleID(data?._user?.RoleId);
    }
  }, [data]);

  const { mutate } = useMutation({
    mutationFn: ({ uid, username, email, fullname, phoneNumber, address }) =>
      userAPI.updateUser({
        uid,
        email,
        fullname,
        phoneNumber,
        roleID,
      }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const errName = !fullname ? 'Họ và tên không được để trống' 
      : !/^[a-zA-Z ]+$/.test(fullname.trim()) ? 'Họ và tên không đúng định dạng!' : ''
    const errPhone = !phoneNumber ? 'Số điện thoại không được để trống'
      : !/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.test(phoneNumber.trim()) ? 'Số điện thoại không đúng định dạng!' : ''
    const errEmail = !email ? 'Email không được để trống'
      : !RegExp("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$").test(email.trim()) ? 'Email không đúng định dạng!' : ''
    if (errName || errPhone || errEmail) {
      setErrors({
        fullname: errName,
        phoneNumber: errPhone,
        email: errEmail,
      })
    }
    if (errName === '' && errPhone === '' && errEmail === '') {
      setLoading(true);
      mutate(
        { uid, email: email.trim(), fullname: fullname.trim(), phoneNumber: fullname.trim(), roleID },
        {
          onSuccess: (data) => {
            setLoading(false);
            if (data?.message === "User updated successfully") {
              api.success({
                message: "Cập nhật tài khoản thành công",
                placement: "topRight",
                duration: 1.5,
              });
              queryClient.refetchQueries("GetAllUsers");
              setTimeout(() => {
                navigate("/user");
              }, 1800);
            } else {
              api.error({
                message: "Cập nhật tài khoản thất bại",
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
      <h3 className="text-center font-semibold text-2xl">
        CHỈNH SỬA TÀI KHOẢN
      </h3>
      <form className="p-10" ref={formRef} onSubmit={handleSubmit}>
        <div className="flex flex-col items-start gap-1">
          <label className="mr-3" htmlFor="">
            Quyền
          </label>
          <Select
            placeholder="Chọn quyền"
            style={{
              width: 120,
              height: "40px",
            }}
            onChange={(value) => {
              setRoleID(value);
            }}
            value={roleID === 1 ? "User" : "Admin"}
            options={[
              {
                value: "1",
                label: "User",
              },
              {
                value: "2",
                label: "Admin",
              },
            ]}
          />
        </div>
        <div className="flex flex-col items-start my-3">
          <label htmlFor="">Username:</label>
        </div>
        <div className="flex flex-col items-start my-3">
          <label htmlFor="">Email:</label>
          <Input
            className="p-2 my-2 rounded-lg"
            placeholder="Email"
            name="email"
            type="text"
            onChange={(e) => {
              setEmail(e.target.value)
              setErrors({
                ...errors,
                [e.target.name]: ''
              })
            }}
            value={email}
          />
          {errors.email && (
            <label htmlFor="name" className="text-red-500 ml-4">
              {errors.email}
            </label>
          )}
        </div>
        <div className="flex flex-col items-start my-3">
          <label htmlFor="">Họ tên</label>
          <Input
            className="p-2 my-2 rounded-lg"
            placeholder="Họ tên"
            name="fullname"
            type="text"
            onChange={(e) => {
              setFullname(e.target.value)
              setErrors({
                ...errors,
                [e.target.name]: ''
              })
            }}
            value={fullname}
          />
          {errors.fullname && (
            <label htmlFor="name" className="text-red-500 ml-4">
              {errors.fullname}
            </label>
          )}
        </div>
        <div className="flex flex-col items-start my-3">
          <label htmlFor="">SDT</label>
          <Input
            className="p-2 my-2 rounded-lg"
            placeholder="Số điện thoại"
            name="phoneNumber"
            type="text"
            onChange={(e) => {
              setPhoneNumber(e.target.value)
              setErrors({
                ...errors,
                [e.target.name]: ''
              })
            }}
            value={phoneNumber}
          />
          {errors.phoneNumber && (
            <label htmlFor="name" className="text-red-500 ml-4">
              {errors.phoneNumber}
            </label>
          )}
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

export default EditUser;
