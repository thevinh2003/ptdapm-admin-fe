import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, notification, Input } from "antd";
import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { Table, Pagination, Modal, Typography } from "antd";
import Loading from "../../components/Loading/Loading";
import categoryAPI from "../../api/categoryAPI";

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
    title: "Tên danh mục",
    dataIndex: "CategoryName",
  },
  {
    title: "Mô tả",
    dataIndex: "Description",
  },
  {
    title: "",
    dataIndex: "action",
  },
];

const ListCategories = () => {
  const [page, setPage] = React.useState(1);
  const [deleteId, setDeleteId] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [searchText, setSearchText] = React.useState("");
  const queryClient = useQueryClient();

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleOkButtonModal = () => {
    CategoryDeleteMutation.mutate(deleteId);
    setOpen(false);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["GetAllCategories", [page]],
    queryFn: () => categoryAPI.getAllCategories({ page }),
    refetchOnWindowFocus: false,
  });

  const tableData =
    data &&
    data?.categories
      .filter((category) =>
        category?.CategoryName?.toLowerCase().includes(
          String(searchText).toLowerCase()
        )
      )
      ?.map((category) => ({
        key: category.id,
        stt: category.id,
        CategoryName: category.CategoryName,
        Description: category.Description,
        action: (
          <div className="flex items-center gap-4">
            <NavLink to={`/category/edit?id=${category.id}`}>
              <i className="text-lg cursor-pointer text-blue-500 p-2 hover:opacity-80 fa-solid fa-pen-to-square"></i>
            </NavLink>
            <i
              onClick={() => {
                setOpen(true);
                setDeleteId(category.id);
              }}
              className="text-lg cursor-pointer text-red-500 p-2 hover:opacity-80 fa-solid fa-trash"
            ></i>
          </div>
        ),
      }));

  const CategoryDeleteMutation = useMutation({
    mutationKey: "DeleteCategory",
    mutationFn: () => categoryAPI.deleteCategory(deleteId),
    onSuccess: (data) => {
      if (data?.message === "Category deleted") {
        api.success({
          message: "Xóa danh mục thành công",
          placement: "topRight",
          duration: 1.5,
        });
        queryClient.refetchQueries("GetAllCategories");
      } else {
        api.error({
          message: "Xóa danh mục thất bại",
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
            QUẢN LÝ DANH MỤC
          </h3>
          <div className="flex items-center mt-4">
            <NavLink to="/category/create">
              <Button
                htmlType="submit"
                icon={<PlusCircleOutlined />}
                style={{ height: "40px", marginLeft: "10px" }}
                type="primary"
              >
                Tạo danh mục
              </Button>
            </NavLink>
            <Search
              allowClear
              placeholder="Tìm kiếm theo tên danh mục"
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

export default ListCategories;
