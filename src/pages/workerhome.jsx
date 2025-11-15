// src/pages/WorkerHome.jsx (维修工端)
import React, { useState } from 'react';
import { Layout, Menu, Avatar, Space, Card } from 'antd';
import { UserOutlined, AppstoreOutlined } from '@ant-design/icons';

const { Sider, Content, Header } = Layout;

const WorkerHome = () => {
  const [currentMenu, setCurrentMenu] = useState('my-tasks');
  const [collapsed, setCollapsed] = useState(false);

  // 侧边栏菜单配置 - 只有"我的任务"一项
  const sideMenuItems = [
    {
      key: 'my-tasks',
      icon: <AppstoreOutlined />,
      label: '我的任务',
    },
  ];

  // 处理菜单点击
  const handleMenuClick = (e) => {
    console.log('点击了菜单:', e.key);
    setCurrentMenu(e.key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        theme="dark"
      >
        <div style={{ 
          height: '32px', 
          margin: '16px', 
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold'
        }}>
          {collapsed ? '维修' : '维修工系统'}
        </div>
        
        <Menu
          theme="dark"
          selectedKeys={[currentMenu]}
          mode="inline"
          items={sideMenuItems}
          onClick={handleMenuClick}
        />
      </Sider>

      <Layout>
        {/* 顶部Header */}
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff', 
          boxShadow: '0 1px 4px rgba(0,21,41,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
            维修工工作台
          </div>
          
          <Space size="middle">
            <span>欢迎，维修工</span>
            <Avatar 
              size="default" 
              icon={<UserOutlined />}
              style={{ 
                backgroundColor: '#52c41a'
              }}
            />
          </Space>
        </Header>

        {/* 内容区域 */}
        <Content style={{ 
          margin: '24px 16px', 
          padding: 24, 
          background: '#fff',
          minHeight: 280 
        }}>
          {currentMenu === 'my-tasks' && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'flex-start'
            }}>
              <Card 
                title="我的任务" 
                style={{ 
                  width: '100%', 
                  maxWidth: '800px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}
                headStyle={{ fontSize: '20px', fontWeight: 'bold' }}
              >
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <p style={{ fontSize: '16px', color: '#666' }}>
                    这里将显示分配给您的维修任务列表...
                  </p>
                </div>
              </Card>
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default WorkerHome;