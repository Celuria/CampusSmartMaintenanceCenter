// src/components/UserManagement.jsx
import React, { useState } from 'react';
import { Menu, Card, List, Space } from 'antd';
import { UserOutlined, ToolOutlined } from '@ant-design/icons';

const UserManagement = () => {
  const [currentUserType, setCurrentUserType] = useState('students');

  // 模拟学生账号数据
  const studentAccounts = [
    { id: '001' },
    { id: '002' },
    { id: '003' },
    
  ];

  // 模拟维修人员账号数据
  const repairmanAccounts = [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];

  // 垂直菜单配置
  const userTypeMenuItems = [
    {
      key: 'students',
      icon: <UserOutlined />,
      label: '学生账号',
    },
    {
      key: 'repairmen',
      icon: <ToolOutlined />,
      label: '维修人员账号',
    },
  ];

  // 处理菜单点击
  const handleMenuClick = (e) => {
    setCurrentUserType(e.key);
  };

  // 获取当前显示的数据
  const getCurrentData = () => {
    return currentUserType === 'students' ? studentAccounts : repairmanAccounts;
  };

  // 获取当前标题
  const getCurrentTitle = () => {
    return currentUserType === 'students' ? '学生账号列表' : '维修人员账号列表';
  };

  return (
    <div style={{ display: 'flex', gap: '16px', minHeight: '500px' }}>
      {/* 左侧垂直菜单 */}
      <div style={{ width: '200px' }}>
        <Card title="账号类型" size="small">
          <Menu
            onClick={handleMenuClick}
            selectedKeys={[currentUserType]}
            mode="vertical"
            items={userTypeMenuItems}
            style={{ border: 'none' }}
          />
        </Card>
      </div>

      {/* 右侧内容区域 */}
      <div style={{ flex: 1 }}>
        <Card title={getCurrentTitle()}>
          <List
            dataSource={getCurrentData()}
            renderItem={(item) => (
              <List.Item>
                <div style={{ 
                  padding: '8px 12px', 
                  border: '1px solid #d9d9d9', 
                  borderRadius: '4px',
                  width: '100%',
                  backgroundColor: '#fafafa'
                }}>
                  <Space>
                    <UserOutlined />
                    <span style={{ fontFamily: 'monospace', fontSize: '16px' }}>
                      {item.id}
                    </span>
                  </Space>
                </div>
              </List.Item>
            )}
            locale={{ emptyText: '暂无账号数据' }}
          />
        </Card>
      </div>
    </div>
  );
};

export default UserManagement;