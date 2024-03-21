import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, notification } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import userAPI from "../../api/userAPI";

const AddUser = () => {
  const formRef = React.useRef(null);
  const [loading, setLoading] = React.useState(false);
  const [api, contextHolder] = notification.useNotification();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [fullname, setFullname] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [errors, setErrors] = useState({
    fullname: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const { mutate } = useMutation({
    mutationFn: ({ password, email, fullname, phoneNumber }) =>
      userAPI.addUser({
        password,
        email,
        fullname,
        phoneNumber,
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
    const errPassword = !password ? 'Mật khẩu không được để trống'
      : !RegExp("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*()_+])[A-Za-z\\d!@#$%^&*()_+]{8,}$").test(password.trim()) ? 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái, số và ký tự đặc biệt' : ''
    if (errName || errPhone || errEmail || errPassword) {
      setErrors({
        fullname: errName,
        phoneNumber: errPhone,
        email: errEmail,
        password: errPassword,
      })
    }
    if (errName === '' && errPhone === '' && errEmail === '' && errPassword === '') {
      setLoading(true);
      mutate(
        { password: password.trim(), email: email.trim(), fullname: fullname.trim(), phoneNumber: phoneNumber.trim() },
        {
          onSuccess: (data) => {
            setLoading(false);
            if (data?.message === "Register successfully") {
              api.success({
                message: "Thêm tài khoản thành công",
                placement: "topRight",
                duration: 1.5,
              });
              queryClient.refetchQueries("GetAllUsers");
              setTimeout(() => {
                navigate("/user");
              }, 1800);
            } else {
              api.error({
                message: "Thêm tài khoản thất bại",
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
      <h3 className="text-center font-semibold text-2xl">THÊM TÀI KHOẢN</h3>
      <form className="p-10" ref={formRef} onSubmit={handleSubmit}>
        <Input
          className="p-2 my-2 rounded-lg"
          placeholder="Họ tên"
          name="fullname"
          type="text"
          onChange={(e) =>  {
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
        <Input
          className="p-2 my-2 rounded-lg"
          placeholder="Password"
          name="password"
          type="text"
          onChange={(e) => {
            setPassword(e.target.value)
            setErrors({
              ...errors,
              [e.target.name]: ''
            })
          }}
          value={password}
        />
        {errors.password && (
          <label htmlFor="name" className="text-red-500 ml-4">
            {errors.password}
          </label>
        )}
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

export default AddUser;
