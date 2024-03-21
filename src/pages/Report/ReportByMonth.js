import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import { Table, Pagination, Typography, Input, Checkbox, notification, Button, Modal } from "antd";
import Loading from "../../components/Loading/Loading";
import reportAPI from "../../api/reportAPI";
import { DollarOutlined, PlusCircleOutlined, SearchOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import Title from "antd/es/skeleton/Title";
import HorizontalBarChart from "../../components/Chart/HorizontalBarChart";
import VerticalBarChart from "../../components/Chart/VerticalBarChart";

const { Search } = Input


const ReportByMonth = () => {
    const [labels, setLabels] = useState([
        'Tháng 1', 
        'Tháng 2', 
        'Tháng 3', 
        'Tháng 4', 
        'Tháng 5', 
        'Tháng 6', 
        'Tháng 7', 
        'Tháng 8', 
        'Tháng 9', 
        'Tháng 10', 
        'Tháng 11', 
        'Tháng 12', 
    ])
    const [stateExpand, setStateExpand] = useState([])
    const [stateTotalStockPrice, setStateTotalStockPrice] = useState([])


    const { data, isLoading } = useQuery({
        queryKey: ["getRevenueReport"],
        queryFn: () => reportAPI.getRevenueReport(),
        staleTime: 1000 * 60 * 10,
        enabled: true
    });


    useEffect(() => {
        if (data) {
            const arrExpand = []
            const arrTotalStockPrice = []
            data?.report?.forEach(item => {
                arrExpand.push(item?.expand)
                arrTotalStockPrice.push(item?.totalStockPrice)
            })
            setStateExpand(arrExpand)
            setStateTotalStockPrice(arrTotalStockPrice)
        }
    }, [data])
        
    console.log(data)
    return (
        <div>
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <HorizontalBarChart 
                        titleText='Biểu đồ ngang thống kê doanh thu theo tháng'
                        data={
                            {
                                labels: labels,
                                datasets: [
                                    {
                                        label: 'Tổng doanh thu',
                                        data: stateTotalStockPrice?.map(item => item),
                                        borderColor: 'rgba(255, 99, 132, 0.5)',
                                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                    },
                                    {
                                        label: 'Lãi suất',
                                        data: stateExpand?.map(item => item),
                                        borderColor: 'rgba(53, 162, 235, 0.5)',
                                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                                    }
                                ],
                            }
                        }
                    />
                </>
            )}
        </div>
    );
};

export default ReportByMonth;