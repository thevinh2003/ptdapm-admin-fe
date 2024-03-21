import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import { Table, Pagination, Typography, Input, Checkbox, notification, Button, Modal } from "antd";
import Loading from "../../components/Loading/Loading";
import voucherAPI from "../../api/voucherAPI";
import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import Title from "antd/es/skeleton/Title";

const { Search } = Input

const columns = [
    {
        title: "ID",
        dataIndex: "id",
    },
    {
        title: "Tên",
        dataIndex: "voucherName",
        responsive: ["lg"],
    },
    {
        title: "Giá trị",
        dataIndex: "voucherValue",
    },
    {
        title: "Số lượng còn",
        dataIndex: "quantity",
    },
    {
        title: "Ngày tạo",
        dataIndex: "createAt",
    },
    {
        title: "",
        dataIndex: "action",
    },
];

const initStateFilter = {
    ordered: null, canceled: null, finish: null
}

const VoucherList = () => {
    const [page, setPage] = React.useState(1);
    // const [deleteId, setDeleteId] = React.useState("");
    const [open, setOpen] = useState(false);
    const [stateFilter, setStateFilter] = useState(initStateFilter)
    const [api, contextHolder] = notification.useNotification();
    const [searchText, setSearchText] = useState("");
    const [deleteId, setDeleteId] = useState("");
    const queryClient = useQueryClient();

    const handlePageChange = (page) => {
        setPage(page);
    };

    const handleOkButtonModal = () => {
        UserDeleteMutation.mutate(deleteId);
        setOpen(false);
    };

    const { data, isLoading } = useQuery({
        queryKey: ["getAllVouchers"],
        queryFn: () => voucherAPI.getAllVouchers(),
        staleTime: 1000 * 60 * 10,
        enabled: true
    });

    const tableData =
        data &&
        data?.vouchers.filter((user) => 
            user?.VoucherName?.toLowerCase().includes(String(searchText).toLowerCase())
        )
        ?.map((voucher, index) => ({
        key: index,
        id: voucher.id,
        voucherName: voucher.VoucherName,
        voucherValue: voucher.VoucherValue,
        quantity: voucher.Quantity,
        createAt: voucher.createdAt,
        action: (
            <div className="flex items-center gap-4">
                <NavLink to={`/voucher/edit?id=${voucher.id}`}>
                    <i className="text-lg cursor-pointer text-blue-500 p-2 hover:opacity-80 fa-solid fa-pen-to-square"></i>
                </NavLink>
                <i
                    onClick={() => {
                        setOpen(true);  
                        setDeleteId(voucher.id);
                    }}
                    className="text-lg cursor-pointer text-red-500 p-2 hover:opacity-80 fa-solid fa-trash"
                ></i>
            </div>
        )
    }));

    const UserDeleteMutation = useMutation({
        mutationKey: "deleteVoucher",
        mutationFn: () => voucherAPI.deleteVoucher(deleteId),
        onSuccess: (data) => {
            if (data?.message === "Voucher deleted successfully") {
                api.success({
                    message: "Xóa mã giảm giá thành công",
                    placement: "topRight",
                    duration: 1.5,
                });
                queryClient.refetchQueries("getAllVouchers");
            } else {
                api.error({
                    message: "Xóa mã giảm giá thất bại",
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
                        QUẢN LÝ MÃ GIẢM GIÁ
                    </h3>
                    <div className="flex items-center mt-4">
                        <NavLink to="/voucher/create">
                            <Button
                                htmlType="submit"
                                icon={<PlusCircleOutlined />}
                                style={{ height: "40px", marginLeft: "10px" }}
                                type="primary"
                            >
                                Tạo mã giảm giá
                            </Button>
                        </NavLink>
                        <Search
                            allowClear
                            placeholder="Tìm kiếm theo tên"
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
                        {/* <Pagination
                            className="mt-4 float-right"
                            pageSize={10}
                            current={page}
                            total={data?.total}
                            onChange={handlePageChange}
                        /> */}
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

export default VoucherList;