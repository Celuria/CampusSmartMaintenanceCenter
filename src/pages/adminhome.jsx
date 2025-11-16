// src/pages/AdminHome.jsx
import React, { useState, useEffect } from 'react';
import { 
  Layout, Menu, Avatar, Space 
} from 'antd';
import { 
  UserOutlined, 
  UserSwitchOutlined, 
  FileTextOutlined, 
  StarOutlined, 
  BarChartOutlined 
} from '@ant-design/icons';
import RepairOrderList from '../components/RepairOrderList';
import UserManagement from '../components/UserManagement';
import DataAnalysis from '../components/DataAnalysis';
import FeedbackManagement from '../components/FeedbackManagement';
import { repairService } from '../services/repairService';

const { Sider, Content, Header } = Layout;

const AdminHome = () => {
  const [currentMenu, setCurrentMenu] = useState('data-analysis');
  const [repairOrders, setRepairOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // 侧边栏菜单配置
  const sideMenuItems = [
    {
      key: 'data-analysis',
      icon: <BarChartOutlined />,
      label: '数据统计与分析',
    },
    {
      key: 'user-management',
      icon: <UserSwitchOutlined />,
      label: '用户管理',
    },
    {
      key: 'order-management',
      icon: <FileTextOutlined />,
      label: '工单管理',
    },
    {
      key: 'feedback-management',
      icon: <StarOutlined />,
      label: '评价管理',
    },
  ];

  // 处理菜单点击
  const handleMenuClick = (e) => {
    console.log('点击了菜单:', e.key);
    setCurrentMenu(e.key);
  };

  // 获取工单数据
  const fetchRepairOrders = async () => {
    setLoading(true);
    try {
      const result = await repairService.getRepairOrders();
      setRepairOrders(result.data);
    } catch (error) {
      console.error('获取工单数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentMenu === 'order-management') {
      fetchRepairOrders();
    }
  }, [currentMenu]);

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
          {collapsed ? '管理' : '报修管理系统'}
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
            管理员工作台
          </div>
          
          <Space size="middle">
            <span>欢迎，管理员</span>
            <Avatar 
              size="default" 
              icon={<UserOutlined />}
              style={{ 
                backgroundColor: '#fa541c'
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
          {currentMenu === 'user-management' && (
            <UserManagement />
          )}
          
          {currentMenu === 'order-management' && (
            <RepairOrderList repairOrders={repairOrders} loading={loading} />
          )}
          
          {currentMenu === 'feedback-management' && (
            <FeedbackManagement />
          )}
          
          {currentMenu === 'data-analysis' && (
            <DataAnalysis />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminHome;