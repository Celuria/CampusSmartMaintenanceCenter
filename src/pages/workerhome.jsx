import React, { useState } from 'react';
import { UserOutlined, AppstoreOutlined } from '@ant-design/icons';
import { Avatar, Space, Menu, Card } from 'antd';

const WorkerHome = () => {
  // 状态管理当前选中的菜单项
  const [currentMenu, setCurrentMenu] = useState('my-tasks');

  // 水平导航菜单配置 - 只有"我的任务"一项
  const navItems = [
    {
      label: '我的任务',
      key: 'my-tasks',
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
          报修管理系统 - 维修工端
        </div>
        
        {/* 右侧用户信息 - 维修工不能编辑个人信息，所以头像不可点击 */}
        <Space size="middle">
          <span>欢迎，worker</span>
          <Avatar 
            size="default" 
            icon={<UserOutlined />}
            style={{ 
              backgroundColor: '#52c41a' // 使用不同颜色区分角色
            }}
          />
        </Space>
      </div>

      {/* 水平导航菜单 - 只有"我的任务"一项 */}
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
        {currentMenu === 'my-tasks' && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'flex-start',
            minHeight: '60vh'
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
                {/* 这里可以添加任务列表组件 */}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerHome;