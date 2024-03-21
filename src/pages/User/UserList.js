import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, notification, Input } from "antd";
import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { Table, Pagination, Modal, Typography } from "antd";
import Loading from "../../components/Loading/Loading";
import userAPI from "../../api/userAPI";

const { Title } = Typography;
const { Search } = Input;

const columns = [
  {
    title: "ID",
    dataIndex: "stt",
    defaultSortOrder: "descend",
    sorter: (a, b) => a.stt - b.stt,
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Họ tên",
    dataIndex: "fullname",
    responsive: ["lg"],
  },
  {
    title: "SDT",
    dataIndex: "phoneNumber",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    responsive: ["lg"],
  },
  {
    title: "",
    dataIndex: "action",
  },
];

const UserList = () => {
  const [page, setPage] = React.useState(1);
  const [deleteId, setDeleteId] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [searchText, setSearchText] = React.useState("");
  const queryClient = useQueryClient();

  const handleOkButtonModal = () => {
    UserDeleteMutation.mutate(deleteId);
    setOpen(false);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["GetAllUsers", [page]],
    queryFn: () => userAPI.getAllUsers({ page }),
    staleTime: 1000 * 60 * 10,
    keepPreviousData: true,
  });

  const handlePageChange = (page) => {
    setPage(page);
  };

  console.log(data);

  const tableData =
    data &&
    data?.users?.map((user) => ({
      key: user.id,
      stt: user.id,
      email: user.Email,
      fullname: user.FullName,
      phoneNumber: user.PhoneNumber,
      status: user.isActive ? (
        <div className="text-green-500 flex items-center gap-1">
          <i className=" translate-y-[1.1px] text-[8px] fa-solid fa-circle"></i>
          <span className="text-sm">Đã kích hoạt</span>
        </div>
      ) : (
        <div className="text-red-500 flex items-center gap-1">
          <i className=" translate-y-[1.1px] text-[8px] fa-solid fa-circle"></i>
          <span className="text-sm">Chưa kích hoạt</span>
        </div>
      ),
      action: (
        <div className="flex items-center gap-4">
          <NavLink to={`/user/edit?uid=${user.id}`}>
            <i className="text-lg cursor-pointer text-blue-500 p-2 hover:opacity-80 fa-solid fa-pen-to-square"></i>
          </NavLink>
          <i
            onClick={() => {
              setOpen(true);
              setDeleteId(user.id);
            }}
            className="text-lg cursor-pointer text-red-500 p-2 hover:opacity-80 fa-solid fa-trash"
          ></i>
        </div>
      ),
    }));

  const UserDeleteMutation = useMutation({
    mutationKey: "DeleteUser",
    mutationFn: () => userAPI.deleteUser(deleteId),
    onSuccess: (data) => {
      if (data?.message === "User deleted successfully") {
        api.success({
          message: "Xóa tài khoản thành công",
          placement: "topRight",
          duration: 1.5,
        });
        queryClient.refetchQueries("GetAllUsers");
      } else {
        api.error({
          message: "Xóa tài khoản thất bại",
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
            QUẢN LÝ TÀI KHOẢN
          </h3>
          <div className="flex items-center mt-4">
            <NavLink to="/user/create">
              <Button
                htmlType="submit"
                icon={<PlusCircleOutlined />}
                style={{ height: "40px", marginLeft: "10px" }}
                type="primary"
              >
                Tạo tài khoản
              </Button>
            </NavLink>
            <Search
              allowClear
              placeholder="Tìm kiếm theo username"
              enterButton={<SearchOutlined />}
              onSearch={(value) => setSearchText(value)}
              className="ml-4 w-1/3 h-[40px]"
              size="large"
            />
          </div>
          <section className="lg:mt-6 mt-4">
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={false}
            />
            <Pagination
              className="mt-4 float-right"
              pageSize={10}
              current={page}
              total={data?.total}
              onChange={handlePageChange}
            />
          </section>
          <Modal
            title={
              <Title level={4} style={{ color: "red" }}>
                Cảnh báo !
              </Title>
            }
            open={open}
            onOk={handleOkButtonModal}
            onCancel={() => setOpen(false)}
            okText="Xóa"
            okButtonProps={{ type: "default", danger: true }}
            cancelText="Hủy"
          >
            <p className="text-red-500">Bạn có chắc chắn muốn xóa?</p>
          </Modal>
          {contextHolder}
        </>
      )}
    </div>
  );
};

export default UserList;
