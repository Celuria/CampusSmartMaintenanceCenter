import React, { useState, useEffect } from 'react';
import { UserOutlined, UserSwitchOutlined, FileTextOutlined, 
  StarOutlined, BarChartOutlined } from '@ant-design/icons';
import { Avatar, Space, Menu } from 'antd';
import RepairOrderList from '../components/RepairOrderList';
import UserManagement from '../components/UserManagement';
import DataAnalysis from '../components/DataAnalysis';
import FeedbackManagement from '../components/FeedbackManagement';
import { repairService } from '../services/repairService';

const AdminHome = () => {
  const [currentMenu, setCurrentMenu] = useState('user-management');
  const [repairOrders, setRepairOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // 水平导航菜单配置
  const navItems = [
    {
      label: '用户管理',
      key: 'user-management',
      icon: <UserSwitchOutlined />,
    },
    {
      label: '工单管理',
      key: 'order-management',
      icon: <FileTextOutlined />,
    },
    {
      label: '评价管理',
      key: 'feedback-management',
      icon: <StarOutlined />,
    },
    {
      label: '数据统计与分析',
      key: 'data-analysis',
      icon: <BarChartOutlined />,
    },
  ];

  // 处理导航菜单点击
  const handleNavClick = (e) => {
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
    <div style={{ padding: '0' }}>
      {/* 顶部导航栏 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '0 24px', 
        backgroundColor: '#001529',
        color: 'white',
        height: '64px'
      }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
          报修管理系统 - 管理员端
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
      </div>

      {/* 水平导航菜单 */}
      <Menu 
        onClick={handleNavClick} 
        selectedKeys={[currentMenu]} 
        mode="horizontal" 
        items={navItems}
        style={{ 
          paddingLeft: '24px',
          marginBottom: '16px'
        }}
      />

      {/* 页面内容区域 */}
      <div style={{ padding: '0 24px' }}>
        {/* 用户管理 */}
        {currentMenu === 'user-management' && (
          <UserManagement />
        )}
        
        {/* 工单管理 */}
        {currentMenu === 'order-management' && (
          <RepairOrderList repairOrders={repairOrders} loading={loading} />
        )}
        
        {/* 评价管理 */}
        {currentMenu === 'feedback-management' && (
          <FeedbackManagement />
        )}
        {/* 数据统计与分析 */}
        {currentMenu === 'data-analysis' && (
          <DataAnalysis />
        )}
      </div>
    </div>
  );
};

export default AdminHome;