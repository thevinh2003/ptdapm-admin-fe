import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input, Button, notification } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import voucherAPI from "../../api/voucherAPI";

const validate = (value, key) =>
  value === "" ? `${key} không được để trống` : "";

const EditVoucher = () => {
  const [userParams] = useSearchParams();
  const id = userParams.get("id");
  const formRef = React.useRef(null);
  const [loading, setLoading] = React.useState(false);
  const [api, contextHolder] = notification.useNotification();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [voucherName, setVoucherName] = React.useState(null);
  const [voucherValue, setVoucherValue] = React.useState("");
  const [quantity, setQuantity] = React.useState("");
  const [errors, setErrors] = React.useState({
    voucherName: "",
    voucherValue: "",
    quantity: "",
  });

  const { data } = useQuery({
    queryKey: ["getVoucherById", id],
    queryFn: () => voucherAPI.getVoucherById(id),
    staleTime: 1000 * 60 * 5,
  });

  React.useEffect(() => {
    console.log(data);
    if (data) {
      setVoucherName(data?.VoucherName);
      setVoucherValue(data?.VoucherValue);
      setQuantity(data?.Quantity);
    }
  }, [data]);

  const { mutate } = useMutation({
    mutationFn: ({ id, voucherName, voucherValue, quantity }) =>
      voucherAPI.updateVoucher({
        id,
        voucherName,
        voucherValue,
        quantity,
      }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const errName = validate(voucherName, "Tên mã giảm giá");
    const errPrice = !validate(voucherValue, "Giá trị")
      ? validate(voucherValue, "Giá trị")
      : !/^\d+(\.\d{1,2})?$/.test(voucherValue)
      ? "Giá trị không đúng định dạng"
      : "";
    const errStockP =
      !validate(quantity, "Số lượng") === ""
        ? validate(quantity, "Số lượng")
        : !/^\d+(\.\d{1,2})?$/.test(quantity)
        ? "Số lượng không đúng định dạng"
        : "";
    if (errName || errPrice || errStockP) {
      setErrors({
        voucherName: errName,
        voucherValue: errPrice,
        quantity: errStockP,
      });
    }
    if (errName === "" && errPrice === "" && errStockP === "") {
      setLoading(true);
      mutate(
        { id, voucherName: voucherName.trim(), voucherValue, quantity },
        {
          onSuccess: (data) => {
            setLoading(false);
            if (data?.message === "Update voucher successfully") {
              api.success({
                message: "Cập nhật mã giảm giá thành công",
                placement: "topRight",
                duration: 1.5,
              });
              queryClient.refetchQueries("getAllVouchers");
              setTimeout(() => {
                navigate("/voucher");
              }, 1800);
            } else {
              api.error({
                message: "Cập nhật mã giảm giá thất bại",
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
        CHỈNH SỬA MÃ GIẢM GIÁ
      </h3>
      <form className="p-10" ref={formRef} onSubmit={handleSubmit}>
        <Input
          className="p-2 my-2 rounded-lg"
          placeholder="Tên mã giảm giá"
          name="voucherName"
          type="text"
          onChange={(e) => {
            setVoucherName(e.target.value);
            setErrors({
              ...errors,
              [e.target.name]: "",
            });
          }}
          value={voucherName}
        />
        {errors.voucherName && (
          <label htmlFor="name" className="text-red-500 ml-4">
            {errors.voucherName}
          </label>
        )}
        <Input
          className="p-2 my-2 rounded-lg"
          placeholder="Giá trị mã giảm giá"
          name="voucherValue"
          type="text"
          onChange={(e) => {
            setVoucherValue(e.target.value);
            setErrors({
              ...errors,
              [e.target.name]: "",
            });
          }}
          value={voucherValue}
        />
        {errors.voucherName && (
          <label htmlFor="name" className="text-red-500 ml-4">
            {errors.voucherName}
          </label>
        )}
        <Input
          className="p-2 my-2 rounded-lg"
          placeholder="Số lượng"
          name="quantity"
          type="text"
          onChange={(e) => {
            setQuantity(e.target.value);
            setErrors({
              ...errors,
              [e.target.name]: "",
            });
          }}
          value={quantity}
        />
        {errors.voucherName && (
          <label htmlFor="name" className="text-red-500 ml-4">
            {errors.voucherName}
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
          Lưu lại
        </Button>
      </form>
      {contextHolder}
    </div>
  );
};

export default EditVoucher;