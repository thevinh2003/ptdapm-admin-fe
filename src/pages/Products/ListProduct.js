import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, notification, Input } from "antd";
import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { Table, Pagination, Modal, Typography } from "antd";
import Loading from "../../components/Loading/Loading";
import productAPI from "../../api/productAPI";

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
    title: "Tên sản phẩm",
    dataIndex: "ProductName",
  },
  {
    title: "Giá",
    dataIndex: "Price",
  },
  {
    title: "Giá kho",
    dataIndex: "StockPrice",
  },
  {
    title: "Tồn kho",
    dataIndex: "StockQuantity",
  },
  {
    title: "Đã bán",
    dataIndex: "SellQuantity",
  },
  {
    title: "Danh mục",
    dataIndex: "CategoryName",
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

const ListProduct = () => {
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
    ProductDeleteMutation.mutate(deleteId);
    setOpen(false);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["GetAllProducts", [page]],
    queryFn: () => productAPI.getAllProducts({ page }),
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  const tableData =
    data &&
    data?.products
      .filter((product) =>
        product?.ProductName?.toLowerCase().includes(
          String(searchText).toLowerCase()
        )
      )
      ?.map((product) => ({
        key: product.id,
        stt: product.id,
        ProductName: product.ProductName,
        Price: formatCurrencyVND(product.Price),
        StockPrice: formatCurrencyVND(product.StockPrice),
        StockQuantity: product.StockQuantity,
        SellQuantity: product.SellQuantity,
        CategoryName: product?.Categories[0]?.CategoryName,
        action: (
          <div className="flex items-center gap-4">
            <NavLink to={`/product/edit?id=${product.id}`}>
              <i className="text-lg cursor-pointer text-blue-500 p-2 hover:opacity-80 fa-solid fa-pen-to-square"></i>
            </NavLink>
            <i
              onClick={() => {
                setOpen(true);
                setDeleteId(product.id);
              }}
              className="text-lg cursor-pointer text-red-500 p-2 hover:opacity-80 fa-solid fa-trash"
            ></i>
          </div>
        ),
      }));

  const ProductDeleteMutation = useMutation({
    mutationKey: "DeleteCategory",
    mutationFn: () => productAPI.deleteProduct(deleteId),
    onSuccess: (data) => {
      if (data?.message === "Delete product successfully") {
        api.success({
          message: "Xóa sản phẩm thành công",
          placement: "topRight",
          duration: 1.5,
        });
        queryClient.refetchQueries("GetAllProducts");
      } else {
        api.error({
          message: "Xóa sản phẩm thất bại",
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
            QUẢN LÝ SẢN PHẨM
          </h3>
          <div className="flex items-center mt-4">
            <NavLink to="/product/create">
              <Button
                htmlType="submit"
                icon={<PlusCircleOutlined />}
                style={{ height: "40px", marginLeft: "10px" }}
                type="primary"
              >
                Tạo sản phẩm
              </Button>
            </NavLink>
            <Search
              allowClear
              placeholder="Tìm kiếm theo tên sản phẩm"
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

export default ListProduct;
