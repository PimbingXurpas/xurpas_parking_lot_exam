import React, { Children } from "react";
import { Layout, Menu } from "antd";
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;
export default function SideNav(props: any) {
  const navigate = useNavigate();
  const location = useLocation();
  const headTitle = location.pathname.replace(/\/|-/g, " ").replace(/(\b[a-z](?!s))/g, function (x) {
    return x.toUpperCase();
  });
  const { navList, children } = props;
  return (
    <>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="logo" />

        <Menu theme="dark" mode="inline">
          {navList.map((item: any, index: any) => (
            <Menu.Item key={index} onClick={() => navigate(item.path)}>
              {item.title}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header className="site-layout-sub-header-background" style={{ padding: 0 }}>
          <h2 style={{ color: "white" }}>{headTitle}</h2>
        </Header>
        <Content style={{ margin: "24px 16px 0" }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            {children}
          </div>
        </Content>
      </Layout>
    </>
  );
}
