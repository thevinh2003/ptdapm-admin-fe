// import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { NavLink } from "react-router-dom";
// import { Table, Pagination, Typography, Input, Checkbox, Radio, Space, Button } from "antd";
// import Loading from "../../components/Loading/Loading";
// import reviewAPI from "../../api/reviewAPI";
// import { UserOutlined } from "@ant-design/icons";

// const OrderList = () => {
//     // const [deleteId, setDeleteId] = React.useState("");
//     // const [open, setOpen] = React.useState(false);
//     const [star, setStar] = useState({productId: '', option: 'full'})

//     let newData = star.option === 'full' ? {...data} : {
//         ...data,
//         products: data?.products?.filter(product => +product?.ProductReviews?.Rating === +star.option)
//     }
        
//     console.log(newData)

//     const handleOnchange = (e, productId) => {
//         setStar({ productId, option: e.target.value })
//     }

//     return (
//         <div>
//             {
//                 product?.ProductReviews?.map(productReview => {
//                     return (
//                         <>
//                             <hr></hr>
//                             <div className="my-5">
//                                 <UserOutlined className="border rounded-full p-2" />
//                                 <span className="pl-1 font-medium">{productReview?.User?.FullName}</span>
//                                 <span className="pl-2 text-red-600">{productReview?.Rating}*</span>
//                                 <br></br>
//                                 <span className="pl-9">{productReview?.Review}</span>
//                                 <span className="pl-9 text-xs text-slate-500">{productReview?.ReviewDate}</span>
//                                 <div className="mt-2 border-l-indigo-500">
//                                     <UserOutlined className="border rounded-full p-2" />
//                                     <span className="pl-1 font-medium">Adidas</span>
//                                     <br></br>
//                                     <span className="pl-9">Ok bạn</span>
//                                     <span className="pl-9 text-xs text-slate-500">{productReview?.ReviewDate}</span>
//                                 </div>
//                                 <Space.Compact
//                                     className="pt-2"
//                                     style={{
//                                         width: '100%',
//                                     }}
//                                 >
//                                     <Input placeholder="Nhập phản hồi" />
//                                     <Button type="primary">Gửi</Button>
//                                 </Space.Compact>
//                             </div>
//                         </>
//                     )
//                 })
//             }
//         </div>
//     );
// };

// export default OrderList;