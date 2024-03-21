import React from "react";
const HomePage = React.lazy(() => import("../pages/Home/HomePage"));
const UserList = React.lazy(() => import("../pages/User/UserList"));
const OrderList = React.lazy(() => import("../pages/Order/OrderList"));
const Review = React.lazy(() => import("../pages/Review/Review"));
const VoucherList = React.lazy(() => import("../pages/Voucher/VoucherList"));
const AddVoucher = React.lazy(() => import("../pages/Voucher/AddVoucher"));
const EditVoucher = React.lazy(() => import("../pages/Voucher/EditVoucher"));
const Report = React.lazy(() => import("../pages/Report/Report"));
const EditUser = React.lazy(() => import("../pages/User/EditUser"));
const AddUser = React.lazy(() => import("../pages/User/AddUser"));
const ListCategories = React.lazy(() =>
  import("../pages/Categories/ListCategories")
);
const EditCategory = React.lazy(() =>
  import("../pages/Categories/EditCategory")
);
const AddCategory = React.lazy(() => import("../pages/Categories/AddCategory"));
const ListProduct = React.lazy(() => import("../pages/Products/ListProduct"));
const EditProduct = React.lazy(() => import("../pages/Products/EditProduct"));
const AddProduct = React.lazy(() => import("../pages/Products/AddProduct"));
const ListPayment = React.lazy(() => import("../pages/Payment/ListPayment"));

export const privateRoutes = [
  { path: "/", component: HomePage },
  { path: "/user", component: UserList },
  // { path: "/category", component: ListCategories },
  { path: "/category/edit", component: EditCategory },
  { path: "/category/create", component: AddCategory },
  { path: "/order", component: OrderList },
  { path: "/review", component: Review },
  { path: "/voucher", component: VoucherList },
  { path: "/voucher/create", component: AddVoucher },
  { path: "/voucher/edit", component: EditVoucher },
  { path: "/voucher/edit", component: EditVoucher },
  { path: "/report", component: Report },
  { path: "/user/edit", component: EditUser },
  { path: "/user/create", component: AddUser },
  { path: "/product", component: ListProduct },
  { path: "/product/edit", component: EditProduct },
  { path: "/product/create", component: AddProduct },
  { path: "/payment", component: ListPayment },
];
