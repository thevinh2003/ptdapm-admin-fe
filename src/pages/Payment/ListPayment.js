import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notification, Input, DatePicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Table, Modal, Typography, Radio } from "antd";
import Loading from "../../components/Loading/Loading";
import paymentAPI from "../../api/paymentAPI";

const { Title } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;

const columns = [
  {
    title: "ID",
    dataIndex: "stt",
    defaultSortOrder: "descend",
    sorter: (a, b) => a.stt - b.stt,
  },
  {
    title: "Ngày tạo hóa đơn",
    dataIndex: "OrderDate",
  },
  {
    title: "Tổng tiền",
    dataIndex: "TotalAmount",
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "ProductName",
  },
  {
    title: "Trạng thái giao hàng",
    dataIndex: "ShippingStatus",
    responsive: ["lg"],
  },
  {
    title: "Thanh toán",
    dataIndex: "PaymentStatus",
  },
  {
    title: "",
    dataIndex: "action",
  },
];

function formatCurrencyVND(number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
}

function formatMessage(message) {
  switch (message) {
    case "Shipping":
      return <span className="text-sm text-red-400">Đang giao</span>;
    case "Ready":
      return (
        <span className="text-sm text-yellow-500">Đang chuẩn bị hàng</span>
      );
    case "Received":
      return <span className="text-sm text-green-500">Đã giao hàng</span>;
    default:
      return <span className="text-sm text-gray-400">Không có thông tin</span>;
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
}

const ListPayment = () => {
  const [deleteId, setDeleteId] = React.useState("");
  const [orderID, setOrderID] = React.useState("");
  const [isPayment, setIsPayment] = React.useState("0");
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openUpdateModal, setOpenUpdateModal] = React.useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [searchText, setSearchText] = React.useState("");
  const queryClient = useQueryClient();

  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  const handleCalendarChange = (dates) => {
    if (dates === null) {
      setStartDate("");
      setEndDate("");
      return;
    }
    setStartDate(dates[0]);
    setEndDate(dates[1]);
  };

  const { data: PaymentData } = useQuery({
    queryKey: ["GetPayment", orderID],
    queryFn: () => paymentAPI.getPaymentByOrderId(orderID),
  });

  React.useEffect(() => {
    setIsPayment(PaymentData?.PaymentStatus ? 1 : 0);
  }, [PaymentData]);

  const handleOkDeleteModal = () => {
    PaymentDeleteMutation.mutate(deleteId);
    setOpenDeleteModal(false);
  };

  const handleOkUpdateModal = () => {
    PaymentUpdateMutation.mutate(orderID, isPayment);
    setOpenDeleteModal(false);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["GetAllOrders", [startDate, endDate]],
    queryFn: () => paymentAPI.getAllOrders({ startDate, endDate }),
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  const tableData =
    data &&
    data?.analysis
      .filter((order) =>
        String(order?.id)
          .toLowerCase()
          .includes(String(searchText).toLowerCase())
      )
      .filter((order) => order?.Payment !== null)
      ?.map((order) => ({
        key: order.id,
        stt: order.id,
        OrderDate: formatDate(order.OrderDate),
        TotalAmount: formatCurrencyVND(order.TotalAmount),
        ProductName: order?.Products[0]?.ProductName,
        ShippingStatus: formatMessage(order?.Shipping?.ShippingStatus),
        PaymentStatus: order?.Payment?.PaymentStatus ? (
          <div className="text-green-500 flex items-center gap-1">
            <i className=" translate-y-[1.1px] text-[8px] fa-solid fa-circle"></i>
            <span className="text-sm">Đã thanh toán</span>
          </div>
        ) : (
          <div className="text-red-500 flex items-center gap-1">
            <i className=" translate-y-[1.1px] text-[8px] fa-solid fa-circle"></i>
            <span className="text-sm">Chưa thanh toán</span>
          </div>
        ),
        action: (
          <div className="flex items-center gap-4">
            <i
              onClick={() => {
                setOpenUpdateModal(true);
                setOrderID(order.id);
                queryClient.refetchQueries(["GetPayment", order.id]);
                setIsPayment(PaymentData?.PaymentStatus ? "1" : "0");
              }}
              className="text-lg cursor-pointer text-blue-500 p-2 hover:opacity-80 fa-solid fa-pen-to-square"
            ></i>
            <i
              onClick={() => {
                setOpenDeleteModal(true);
                setDeleteId(order.id);
              }}
              className="text-lg cursor-pointer text-red-500 p-2 hover:opacity-80 fa-solid fa-trash"
            ></i>
          </div>
        ),
      }));

  const PaymentDeleteMutation = useMutation({
    mutationKey: "DeletePayment",
    mutationFn: () => paymentAPI.deletePayment(deleteId),
    onSuccess: (data) => {
      setOpenDeleteModal(false);
      if (data?.message === "Payment deleted") {
        api.success({
          message: "Xóa thanh toán thành công",
          placement: "topRight",
          duration: 1.5,
        });
        queryClient.refetchQueries("GetAllOrders");
      } else {
        api.error({
          message: "Xóa thanh toán thất bại",
          placement: "topRight",
        });
      }
    },
  });

  const PaymentUpdateMutation = useMutation({
    mutationKey: "UpdatePayment",
    mutationFn: () => paymentAPI.updatePaymentStatus(orderID, isPayment),
    onSuccess: (data) => {
      setOpenUpdateModal(false);
      if (data?.message === "Payment updated") {
        api.success({
          message: "Cập nhật thanh toán thành công",
          placement: "topRight",
          duration: 1.5,
        });
        queryClient.refetchQueries("GetAllOrders");
      } else {
        api.error({
          message: "Cập nhật thanh toán thất bại",
          placement: "topRight",
        });
      }
    },
  });

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <h3 className="text-center font-semibold text-2xl">
            QUẢN LÝ THANH TOÁN
          </h3>
          <div className="mt-4 flex flex-col lg:flex-row justify-between lg:items-center px-4 lg:gap-0 gap-2">
            <Search
              allowClear
              placeholder="Tìm kiếm theo ID đơn hàng"
              enterButton={<SearchOutlined />}
              onSearch={(value) => setSearchText(value)}
              className="w-1/3 h-[40px]"
              size="large"
            />
            <RangePicker
              value={[startDate, endDate]}
              onChange={handleCalendarChange}
              size="large"
              format={"DD/MM/YYYY"}
            />
          </div>
          <section className="lg:mt-6 mt-4">
            <Table columns={columns} dataSource={tableData} pagination={true} />
          </section>
          <Modal
            title={
              <Title level={4} style={{ color: "red" }}>
                Cảnh báo !
              </Title>
            }
            open={openDeleteModal}
            onOk={handleOkDeleteModal}
            onCancel={() => setOpenDeleteModal(false)}
            okText="Xóa"
            okButtonProps={{ type: "default", danger: true }}
            cancelText="Hủy"
          >
            <p className="text-red-500">Bạn có chắc chắn muốn xóa?</p>
          </Modal>
          <Modal
            title={
              <Title level={4} style={{ color: "#F53A51" }}>
                Cập nhật !
              </Title>
            }
            open={openUpdateModal}
            onOk={handleOkUpdateModal}
            onCancel={() => setOpenUpdateModal(false)}
            okText="Lưu lại"
            okButtonProps={{ type: "default" }}
            cancelText="Hủy"
          >
            <div className="text-center">
              <Radio.Group
                onChange={() => setIsPayment(isPayment === "1" ? "0" : "1")}
                value={String(isPayment)}
                buttonStyle="solid"
              >
                <Radio.Button value="1">Đã thanh toán</Radio.Button>
                <Radio.Button value="0">Chưa thanh toán</Radio.Button>
              </Radio.Group>
            </div>
          </Modal>
          {contextHolder}
        </>
      )}
    </div>
  );
};

export default ListPayment;
