import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import { Table, Pagination, Typography, Input, Checkbox, notification, Button, Modal } from "antd";
import Loading from "../../components/Loading/Loading";
import reportAPI from "../../api/reportAPI";
import userAPI from "../../api/userAPI";
import { DollarOutlined, PlusCircleOutlined, SearchOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import Title from "antd/es/skeleton/Title";
import HorizontalBarChart from "../../components/Chart/HorizontalBarChart";
import VerticalBarChart from "../../components/Chart/VerticalBarChart";
import ReportByMonth from "./ReportByMonth";

const { Search } = Input

const Report = () => {
    const [labels, setLabels] = useState([])
    const [stateData, setStateData] = useState([])


    const { data, isLoading } = useQuery({
        queryKey: ["getProductReport"],
        queryFn: () => reportAPI.getProductReport(),
        staleTime: 1000 * 60 * 10,
        enabled: true
    });

    const dateUser = useQuery({
        queryKey: ["getAllUsers"],
        queryFn: () => userAPI.getAllUsers(),
        staleTime: 1000 * 60 * 10,
        enabled: true
    });

    const dataRevenueToday = useQuery({
        queryKey: ["getRevenueReportToday"],
        queryFn: () => reportAPI.getRevenueReportToday(),
        staleTime: 1000 * 60 * 10,
        enabled: true
    });

    useEffect(() => {
        if (data) {
            const arrLabels = []
            const arrData = []
            data?.analysis?.forEach(item => {
                arrLabels.push(item?.ProductName)
                arrData.push(item?.StockQuantity)
            })
            setLabels(arrLabels)
            setStateData(arrData)
        }
    }, [data])
    
    return (
        <div>
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <h3 className="text-center font-semibold text-2xl">
                        THỐNG KÊ
                    </h3>
                    <div className="">
                        <div class="grid grid-cols-5 gap-4 p-4 bg-slate-200 m-4 rounded-md">
                            {/* <div className="flex justify-between shadow-md bg-white rounded-md p-3">
                                <div>
                                    <span className="text-slate-500 font-semibold">Doanh số hôm nay</span>
                                    <br></br>
                                    <span className="font-bold text-2xl">{dataRevenueToday?.data?.total}</span>
                                </div>
                                <div className="bg-sky-500 rounded-md border-inherit">
                                    <DollarOutlined className="text-2xl px-2 py-3"/>
                                </div>
                            </div> */}
                            {/* <div className="flex justify-between shadow-md bg-white rounded-md p-3">
                                <div>
                                    <span className="text-slate-500 font-semibold">Tổng người dùng</span>
                                    <br></br>
                                    <span className="font-bold text-2xl">{dateUser?.data?.total}</span>
                                </div>
                                <div className="bg-sky-500 rounded-md border-inherit">
                                    <UsergroupAddOutlined className="text-2xl px-2 py-3"/>
                                </div>
                            </div> */}
                            {/* <div className="flex justify-between shadow-md bg-white rounded-md p-3">
                                <div>
                                    <span className="text-slate-500 font-semibold">Tổng số lượng tồn kho</span>
                                    <br></br>
                                    <span className="font-bold text-2xl">100000</span>
                                </div>
                                <div className="bg-sky-500 rounded-md border-inherit">
                                    <DollarOutlined className="text-2xl px-2 py-3"/>
                                </div>
                            </div> */}
                        </div>
                        <div className="grid grid-cols-2 gap-4 m-4 bg-slate-200 p-4 rounded-md">
                            <div className="rounded-md shadow-md bg-white p-2">
                                <ReportByMonth />
                            </div>
                            <div className="rounded-md shadow-md bg-white p-2">
                                <HorizontalBarChart 
                                    titleText='Biểu đồ ngang thống kê số lượng sản phẩm tồn kho'
                                    data={
                                        {
                                            labels: labels,
                                            datasets: [
                                                {
                                                    label: 'Số lượng tồn',
                                                    data: stateData?.map(item => item),
                                                    borderColor: 'rgba(53, 162, 235, 0.5)',
                                                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                                                }
                                            ],
                                        }
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Report;