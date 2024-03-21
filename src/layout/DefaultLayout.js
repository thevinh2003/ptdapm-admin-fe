import React from "react";
import { NavLink } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  CommentOutlined,
  LineChartOutlined,
  UnorderedListOutlined,
  EuroCircleOutlined,
  ShoppingOutlined,
  TruckOutlined,
  PercentageOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button } from "antd";
import authAPI from "../api/authAPI";

const { Sider } = Layout;

const DefaultLayout = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [left, setLeft] = React.useState("80px");

  React.useEffect(() => {
    setLeft(collapsed ? "80px" : "200px");
  }, [collapsed]);

  const handleLogout = () => {
    authAPI.logout().then((window.location.href = "/login"));
  };

  return (
    <Layout>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
        }}
        breakpoint="lg"
        trigger={null}
        collapsible
        collapsed={collapsed}
        onBreakpoint={() => {
          setCollapsed(true);
        }}
      >
        <div className="text-white font-semibold text-center p-2 mb-10">
          <NavLink to="/">ADIDAS</NavLink>
        </div>
        <Menu theme="dark" mode="inline">
          <Menu.Item key="user" icon={<UserOutlined />}>
            <NavLink to="/user">Tài khoản</NavLink>
          </Menu.Item>
          {/* <Menu.Item key="category" icon={<UnorderedListOutlined />}>
            <NavLink to="/category">Danh mục</NavLink>
          </Menu.Item> */}
          <Menu.Item key="product" icon={<ShoppingOutlined />}>
            <NavLink to="/product">Sản phẩm</NavLink>
          </Menu.Item>
          <Menu.Item key="payment" icon={<EuroCircleOutlined />}>
            <NavLink to="/payment">Thanh toán</NavLink>
          </Menu.Item>
          <Menu.Item key="order" icon={<TruckOutlined />}>
            <NavLink to="/order">Đơn hàng</NavLink>
          </Menu.Item>
          <Menu.Item key="review" icon={<CommentOutlined />}>
            <NavLink to="/review">Đánh giá</NavLink>
          </Menu.Item>
          <Menu.Item key="voucher" icon={<PercentageOutlined />}>
            <NavLink to="/voucher">Voucher</NavLink>
          </Menu.Item>
          <Menu.Item key="report" icon={<LineChartOutlined />}>
            <NavLink to="/report">Thống kê</NavLink>
          </Menu.Item>
          <Menu.Item
            style={{ marginTop: "60px" }}
            key="logout"
            icon={<LogoutOutlined />}
          >
            <NavLink onClick={handleLogout} to="/report">
              Đăng xuất
            </NavLink>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout
        style={{
          marginLeft: left,
          height: "100vh",
          transition: "all 0.2s",
          overflowX: "auto",
          overflowY: "scroll",
        }}
      >
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => {
            setCollapsed(!collapsed);
          }}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
          }}
        />
        {children}
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
