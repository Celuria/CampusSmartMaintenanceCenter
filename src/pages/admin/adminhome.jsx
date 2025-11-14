import React, { useState } from 'react';
import { UserOutlined, UserSwitchOutlined, FileTextOutlined, StarOutlined, BarChartOutlined, AppstoreOutlined } from '@ant-design/icons';
import { Avatar, Space, Menu, Card } from 'antd';

const AdminHome = () => {
  // 状态管理当前选中的菜单项
  const [currentMenu, setCurrentMenu] = useState('user-management');

  // 水平导航菜单配置 - 四个管理模块
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
    {
      label: '数据备份与恢复',
      key: 'data-recovery',
      icon: <AppstoreOutlined />,
    },
  ];

  // 处理导航菜单点击
  const handleNavClick = (e) => {
    console.log('点击了菜单:', e.key);
    setCurrentMenu(e.key);
  };

  return (
    <div style={{ padding: '0' }}>
      {/* 顶部导航栏 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '0 24px', 
        backgroundColor: '#0059ffff',
        color: 'white',
        height: '64px'
      }}>
        {/* 左侧系统标题 */}
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
          报修管理系统 - 管理员端
        </div>
        
        {/* 右侧用户信息 - 管理员不能编辑个人信息，所以头像不可点击 */}
        <Space size="middle">
          <span>欢迎，admin</span>
          <Avatar 
            size="default" 
            icon={<UserOutlined />}
            style={{ 
              backgroundColor: '#fa541c' // 使用不同颜色区分角色
            }}
          />
        </Space>
      </div>

      {/* 水平导航菜单 - 四个管理模块 */}
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
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'flex-start',
            minHeight: '60vh'
          }}>
            <Card 
              title="用户管理" 
              style={{ 
                width: '100%', 
                maxWidth: '800px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
              headStyle={{ fontSize: '20px', fontWeight: 'bold' }}
            >
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <p style={{ fontSize: '16px', color: '#666' }}>
                  这里将显示用户管理功能，包括用户列表、权限设置等...
                </p>
                {/* 这里可以添加用户管理相关组件 */}
              </div>
            </Card>
          </div>
        )}
        
        {/* 工单管理 */}
        {currentMenu === 'order-management' && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'flex-start',
            minHeight: '60vh'
          }}>
            <Card 
              title="工单管理" 
              style={{ 
                width: '100%', 
                maxWidth: '800px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
              headStyle={{ fontSize: '20px', fontWeight: 'bold' }}
            >
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <p style={{ fontSize: '16px', color: '#666' }}>
                  这里将显示所有报修工单，包括分配、跟踪、处理状态等...
                </p>
                {/* 这里可以添加工单管理相关组件 */}
              </div>
            </Card>
          </div>
        )}
        
        {/* 评价管理 */}
        {currentMenu === 'feedback-management' && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'flex-start',
            minHeight: '60vh'
          }}>
            <Card 
              title="评价管理" 
              style={{ 
                width: '100%', 
                maxWidth: '800px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
              headStyle={{ fontSize: '20px', fontWeight: 'bold' }}
            >
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <p style={{ fontSize: '16px', color: '#666' }}>
                  这里将显示用户对维修服务的评价和反馈...
                </p>
                {/* 这里可以添加评价管理相关组件 */}
              </div>
            </Card>
          </div>
        )}
        
        {/* 数据统计与分析 */}
        {currentMenu === 'data-analysis' && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'flex-start',
            minHeight: '60vh'
          }}>
            <Card 
              title="数据统计与分析" 
              style={{ 
                width: '100%', 
                maxWidth: '800px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
              headStyle={{ fontSize: '20px', fontWeight: 'bold' }}
            >
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <p style={{ fontSize: '16px', color: '#666' }}>
                  这里将显示系统数据统计图表和分析报告...
                </p>
                {/* 这里可以添加数据统计相关组件 */}
              </div>
            </Card>
          </div>
        )}

        {/* 数据备份与恢复 */}
        {currentMenu === 'data-recovery' && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'flex-start',
            minHeight: '60vh'
          }}>
            <Card 
              title="数据备份与恢复" 
              style={{ 
                width: '100%', 
                maxWidth: '800px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
              headStyle={{ fontSize: '20px', fontWeight: 'bold' }}
            >
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <p style={{ fontSize: '16px', color: '#666' }}>
                  这里将显示系统数据备份与恢复功能...
                </p>
                {/* 这里可以添加数据备份与恢复组件 */}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHome;