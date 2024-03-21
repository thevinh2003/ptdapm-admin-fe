import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import { Table, Pagination, Typography, Input, Checkbox } from "antd";
import Loading from "../../components/Loading/Loading";
import orderAPI from "../../api/orderAPI";

const { Search } = Input;

const columns = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "Họ tên khách hàng",
    dataIndex: "fullname",
    responsive: ["lg"],
  },
  {
    title: "Thông tin sản phẩm",
    dataIndex: "productInfo",
  },
  {
    title: "Ngày đặt đơn",
    dataIndex: "orderDate",
  },
  {
    title: "Địa chỉ giao hàng",
    dataIndex: "shippingAdress",
  },
  {
    title: "Phương thức giao hàng",
    dataIndex: "shippingMethod",
  },
  {
    title: "Phương thức thanh toán",
    dataIndex: "paymentMethod",
  },
  {
    title: "Thành tiền",
    dataIndex: "totalAmount",
  },
  {
    title: "Tình trạng",
    dataIndex: "orderStatus",
  },
];

const initStateFilter = {
  ordered: null,
  canceled: null,
  finish: null,
};

const OrderList = () => {
  const [page, setPage] = React.useState(1);
  // const [deleteId, setDeleteId] = React.useState("");
  // const [open, setOpen] = React.useState(false);
  const [stateFilter, setStateFilter] = useState(initStateFilter);
  const [searchText, setSearchText] = useState("");

  const handlePageChange = (page) => {
    setPage(page);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["getAllOrdersDetail"],
    queryFn: () => orderAPI.getAllOrdersDetail(),
    staleTime: 1000 * 60 * 10,
    enabled: true,
  });

  let newData =
    stateFilter.ordered !== null ||
    stateFilter.canceled != null ||
    stateFilter.finish != null
      ? data?.orders?.filter(
          (orderDetail) =>
            orderDetail?.Order?.isCancelled === stateFilter.ordered ||
            orderDetail?.Order?.isCancelled === stateFilter.canceled ||
            orderDetail?.Order?.Payment?.PaymentStatus === stateFilter.finish
        )
      : data?.orders;

  newData = searchText
    ? newData?.filter((orderDetail) =>
        +orderDetail?.Order?.User?.id === +searchText
      )
    : newData;
  const tableData =
    data &&
    newData?.map((orderDetail, index) => ({
      key: index,
      id: orderDetail.id,
      fullname: orderDetail.Order?.User?.FullName,
      productInfo: (
        <div className="flex gap-2">
          <img alt="SP" className="w-24" src={orderDetail.Product?.PhotoLink} />
          <div>
            {orderDetail?.Order?.Voucher &&
            +orderDetail?.Order?.Voucher?.VoucherValue !== 0 ? (
              <span className="text-xs float-right text-red-600 pl-2">
                -{orderDetail?.Order?.Voucher?.VoucherValue}%
              </span>
            ) : (
              ""
            )}
            <span className="text-xs">{orderDetail.Product?.ProductName}</span>
            <br></br>
            <span className="text-xs">Size: {orderDetail.size}</span>
            <br></br>
            <span className="text-xs">x{orderDetail.Quantity}</span>
            <br></br>
            <span className="text-xs">
              Giá:{" "}
              <span className="text-red-600">
                {orderDetail.Product?.Price} VND
              </span>
            </span>
          </div>
        </div>
      ),
      orderDate: orderDetail.Order?.OrderDate,
      shippingAdress: orderDetail.Order?.ShippingAddress,
      shippingMethod: orderDetail.Order?.ShippingMethods,
      paymentMethod: orderDetail.Order?.PaymentMethod,
      totalAmount: orderDetail.Order?.TotalAmount,
      orderStatus: (
        <div>
          {orderDetail?.Order?.Shipping ? (
            <span>{orderDetail?.Order?.Shipping?.ShippingStatus}</span>
          ) : orderDetail?.Order?.isCancelled ? (
            <span>Đã hủy</span>
          ) : (
            <span>Đã đặt</span>
          )}
          <br></br>
          {orderDetail?.Order?.Payment?.PaymentStatus ? (
            <span>Đã thanh toán</span>
          ) : (
            <span>Chưa thanh toán</span>
          )}
        </div>
      ),
    }));

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="pb-1.5 float-right">
            <Search
              allowClear
              className="mb-2"
              placeholder="Tìm kiếm theo khách hàng (ID)..."
              onSearch={(value) => setSearchText(value)}
              style={{ width: 400 }}
              size="large"
            />
            <div>
              <Checkbox
                value="Đã đặt"
                checked={stateFilter.ordered != null ? true : false}
                onChange={(e) => {
                  let ordered = e.target.checked ? false : null;
                  setStateFilter({ ...initStateFilter, ordered });
                }}
              >
                Đã đặt
              </Checkbox>
              <Checkbox
                value="Đã hủy"
                checked={stateFilter.canceled != null ? true : false}
                onChange={(e) => {
                  let canceled = e.target.checked ? true : null;
                  setStateFilter({ ...initStateFilter, canceled });
                }}
              >
                Đã hủy
              </Checkbox>
              <Checkbox
                value="Hoàn thành"
                checked={stateFilter.finish != null ? true : false}
                onChange={(e) => {
                  let finish = e.target.checked ? true : null;
                  setStateFilter({ ...initStateFilter, finish });
                }}
              >
                Hoàn thành
              </Checkbox>
            </div>
          </div>
          <section className="lg:mt-6 pt-2">
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={false}
            />
            <Pagination
              className="mt-4 float-right"
              pageSize={2}
              current={page}
              total={data?.total}
              onChange={handlePageChange}
            />
          </section>
        </>
      )}
    </div>
  );
};

export default OrderList;
