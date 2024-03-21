import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NavLink, Navigate } from "react-router-dom";
import { Table, Pagination, Typography, Input, Checkbox, Radio, Space, Button, notification, Modal } from "antd";
import Loading from "../../components/Loading/Loading";
import reviewAPI from "../../api/reviewAPI";
import { UserOutlined } from "@ant-design/icons";
import Title from "antd/es/skeleton/Title";
const { Search } = Input

const OrderList = () => {
    const [page, setPage] = useState(1);
    const [deleteId, setDeleteId] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [arrStar, setArrStar] = useState([])
    const [showEdit, setShowEdit] = useState({id: '', isEdit: false})
    const [textFeedback, setTextFeedback] = useState('')
    const [api, contextHolder] = notification.useNotification();
    const queryClient = useQueryClient();
    const [searchText, setSearchText] = useState("");
    const [reviews, setReviews] = useState([])


    const handlePageChange = (page) => {
        setPage(page);
    };

    const handleOkButtonModal = () => {
        UserDeleteMutation.mutate(deleteId);
        setOpen(false);
    };

    const UserDeleteMutation = useMutation({
        mutationKey: "deleteFeedback",
        mutationFn: () => reviewAPI.deleteFeedback(deleteId),
        onSuccess: (data) => {
            if (data?.message === "Feedback deleted successfully") {
                api.success({
                    message: "Xóa phản hồi thành công",
                    placement: "topRight",
                    duration: 1.5,
                });
                queryClient.refetchQueries("getAllReviews");
            } else {
                api.error({
                    message: "Xóa phản hồi thất bại",
                    placement: "topRight",
                });
            }
        },
    });

    const { mutate } = useMutation({
        mutationFn: ({
            id, 
            feedback, 
            feedbackDate
        }) =>
            reviewAPI.updateFeedback({
                id,
                feedback,
                feedbackDate,
            }),
    });

    const { data, isLoading } = useQuery({
        queryKey: ["getAllReviews", { page }],
        queryFn: () => reviewAPI.getAllReviews(),
        staleTime: 1000 * 60 * 10,
    });

    useEffect(() => {
        const comments = []
        data && data?.products?.map((product, index) => {
            product?.ProductReviews?.map(productReview => {
                comments.push({ ...productReview, productId: product.id })
            })
        })
        setArrStar(
            comments
        )
        if (data) {
            setReviews(data?.products)
        } 
    }, [data])

    const handleOnchange = (e, productId) => {
        const temp = [...arrStar]
        const comments = temp?.filter(item => item?.productId !== productId)
        data && data?.products?.map((product, index) => {
            product?.ProductReviews?.map(productReview => {
                if (e.target.value !== 'full' && +productReview?.Rating === +e.target.value && product.id === productId) {
                    comments.push({ ...productReview, productId: product.id })
                }
                else if (e.target.value === 'full' && product.id === productId) {
                    comments.push({ ...productReview, productId: product.id })
                }
            })
        })
        setArrStar(
            comments
        )
    }

    const handleUpdateReview = (id) => {
        setLoading(true);
        mutate(
            { id, feedback: textFeedback, feedbackDate: new Date() },
            {
                onSuccess: (data) => {
                    setLoading(false);
                    if (data?.message === "Feedback Successfully") {
                        console.log('abc')
                        api.success({
                            message: "Thành công",
                            placement: "topRight",
                            duration: 1.5,
                        });
                        queryClient.refetchQueries("getAllReviews");
                        setShowEdit({id: '', isEdit: false})
                        // setTimeout(() => {
                        //     Navigate("/review");
                        // }, 1800);
                    } else {
                        api.error({
                            message: "Thất bại",
                            placement: "topRight",
                        });
                    }
                },
            }
        );
    }

    const handleOnSearch = (value) => {
        if (data && data?.products.length > 0) {
            const newData = data?.products?.filter(item => item?.ProductName.toLowerCase().includes(String(value).toLowerCase()))
            setReviews(newData)
        }
    }

    return (
        <div>
            <div className="float-end">
                <Search
                    allowClear
                    className="mb-2"
                    placeholder="Tìm kiếm sản phẩm..."
                    onSearch={(value) => handleOnSearch(value)}
                    style={{ width: 400 }}
                    size="large"
                />
            </div>
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <section className="lg:mt-6 pt-2">
                        <div className="ml-3.5">
                            {
                                reviews && reviews.length > 0 && reviews.map((product, index) => {
                                    const totalReviewProduct = product?.ProductReviews.length
                                    let totalRating = 0
                                    product?.ProductReviews?.map(productReview => {
                                        totalRating += productReview?.Rating
                                    })
                                    const ratingRate = (totalRating / totalReviewProduct).toFixed(1)
                                    return (
                                        <div className="mb-5" key={index}>
                                            <div className="flex gap-2 items-center">
                                                <img className="w-48" src={product?.PhotoLink} />
                                                <div>
                                                    <span className="font-medium">{product?.ProductName}</span>
                                                    <br></br>
                                                    {/* <span className="text-xs">Size: {orderDetail.size}</span> */}
                                                    <span>Số lượng còn: {product?.StockQuantity}</span>
                                                    <br></br>
                                                    <span>Số lượng đã bán: {product?.SellQuantity}</span>
                                                    <br></br>
                                                    <span className="">Giá: <span className="text-red-600">{product?.Price} VND</span></span>
                                                </div>
                                            </div>
                                            <div className="pt-2">
                                                <span className="font-medium">Đánh giá sản phẩm</span>
                                            </div>
                                            <div className="border p-4 mt-3 shadow-sm w-2/4 rounded-md">
                                                <div className="flex items-center justify-center gap-12 mb-4">
                                                    <div className="text-center">
                                                        <span className="text-2xl text-red-600">
                                                            {
                                                                ratingRate !== 'NaN' ? ratingRate : 0
                                                            }
                                                            /5
                                                        </span>
                                                        <br></br>
                                                        <span>
                                                            ({totalReviewProduct} đánh giá)
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <Radio.Group defaultValue="full" onChange={(e) => handleOnchange(e, product.id)}>
                                                            <Radio.Button value="full">Tất cả</Radio.Button>
                                                            <Radio.Button value="5">5 sao</Radio.Button>
                                                            <Radio.Button value="4">4 sao</Radio.Button>
                                                            <Radio.Button value="3">3 sao</Radio.Button>
                                                            <Radio.Button value="2">2 sao</Radio.Button>
                                                            <Radio.Button value="1">1 sao</Radio.Button>
                                                        </Radio.Group>
                                                    </div>
                                                </div>
                                                    {
                                                        arrStar?.map(item => {
                                                            if (item.productId === product.id) {
                                                                return (
                                                                    <>
                                                                        <hr></hr>
                                                                        <div className="my-5">
                                                                            <UserOutlined className="border rounded-full p-2" />
                                                                            <span className="pl-1 font-medium">{item?.User?.FullName}</span>
                                                                            <span className="pl-2 text-red-600">{item?.Rating}*</span>
                                                                            <br></br>
                                                                            <span className="pl-9">{item?.Review}</span>
                                                                            <span className="pl-9 text-xs text-slate-500">{item?.ReviewDate}</span>
                                                                            {
                                                                                item.Feedback ? 
                                                                                <div className="pl-6 mt-2 border-l-indigo-500">
                                                                                    <UserOutlined className="border rounded-full p-2" />
                                                                                    <span className="pl-1 font-medium">Adidas</span>
                                                                                    <br></br>
                                                                                    <span className="pl-9">{item.Feedback}</span>
                                                                                    <span className="pl-9 text-xs text-slate-500">{item.FeedbackDate}</span>
                                                                                    <span 
                                                                                        className="pl-9" 
                                                                                        onClick={() => setShowEdit({ id: item.id, isEdit: !showEdit.isEdit })}
                                                                                    >
                                                                                        {showEdit.id === item.id && showEdit.isEdit ? 'Hủy' : 'Sửa'}
                                                                                    </span>
                                                                                    <span
                                                                                        className="pl-3"
                                                                                        onClick={() => {
                                                                                            setOpen(true);  
                                                                                            setDeleteId(item.id);
                                                                                        }}
                                                                                    >   
                                                                                        Xóa
                                                                                    </span>
                                                                                    {
                                                                                        showEdit.id === item.id && showEdit.isEdit ? 
                                                                                        <Space.Compact
                                                                                            className="pt-2 pl-6"
                                                                                            style={{
                                                                                                width: '100%',
                                                                                            }}
                                                                                        >
                                                                                            <Input placeholder="Nhập phản hồi" onChange={(e) => setTextFeedback(e.target.value)}/>
                                                                                            <Button type="primary" onClick={() => handleUpdateReview(item.id)}>Lưu</Button>
                                                                                        </Space.Compact>
                                                                                        : ''
                                                                                    }
                                                                                </div>
                                                                                : 
                                                                                <Space.Compact
                                                                                    className="pt-2 pl-6"
                                                                                    style={{
                                                                                        width: '100%',
                                                                                    }}
                                                                                >
                                                                                    <Input placeholder="Nhập phản hồi" onChange={(e) => setTextFeedback(e.target.value)}/>
                                                                                    <Button type="primary" onClick={() => handleUpdateReview(item.id)}>Gửi</Button>
                                                                                </Space.Compact>
                                                                            }
                                                                        </div>
                                                                    </>
                                                                )
                                                            }
                                                            return ''
                                                        })
                                                    }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
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

export default OrderList;