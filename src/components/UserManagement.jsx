// src/components/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { Card, Table, Space, Select, Row, Col, Statistic, Tag } from 'antd';
import { UserOutlined, ToolOutlined, TeamOutlined, PhoneOutlined } from '@ant-design/icons';

const { Option } = Select;

const UserManagement = () => {
  const [currentUserType, setCurrentUserType] = useState('students');
  const [loading, setLoading] = useState(false);

  // 模拟学生账号数据
  const studentAccounts = [
    { id: '20210001', nickname: '张三', phone: '13800138001' },
    { id: '20210002', nickname: '李四', phone: '13800138002' },
    { id: '20210003', nickname: '王五', phone: '13800138003' },
    { id: '20210004', nickname: '赵六', phone: '13800138004' },
    { id: '20210005', nickname: '钱七', phone: '13800138005' },
    { id: '20210006', nickname: '孙八', phone: '13800138006' }
  ];

  // 模拟维修人员账号数据
  const repairmanAccounts = [
    { id: 'worker001', nickname: '张师傅', phone: '13900139001' },
    { id: 'worker002', nickname: '李师傅', phone: '13900139002' },
    { id: 'worker003', nickname: '王师傅', phone: '13900139003' },
    { id: 'worker004', nickname: '赵师傅', phone: '13900139004' }
  ];

  // 处理下拉菜单选择
  const handleUserTypeChange = (value) => {
    setCurrentUserType(value);
  };

  // 获取当前显示的数据
  const getCurrentData = () => {
    return currentUserType === 'students' ? studentAccounts : repairmanAccounts;
  };

  // 获取当前标题
  const getCurrentTitle = () => {
    return currentUserType === 'students' ? '学生账号' : '维修人员账号';
  };

  // 表格列定义
  const columns = [
    {
      title: '用户ID',
      dataIndex: 'id',
      key: 'id',
      width: 150,
      render: (id) => (
        <Space>
          <UserOutlined />
          <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
            {id}
          </span>
        </Space>
      ),
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      width: 120,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      render: (phone) => (
        <Space>
          <PhoneOutlined />
          {phone}
        </Space>
      ),
    },
    {
      title: '用户类型',
      key: 'type',
      width: 100,
      render: (_, record) => (
        <Tag color={currentUserType === 'students' ? 'blue' : 'green'}>
          {currentUserType === 'students' ? '学生' : '维修人员'}
        </Tag>
      ),
    },
  ];

  return (
    <div>
      <h2>用户管理</h2>
      
      {/* 统计信息 */}
      <Row gutter={16} style={{ marginBottom: '16px' }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="学生总数"
              value={studentAccounts.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="维修人员总数"
              value={repairmanAccounts.length}
              prefix={<ToolOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="总用户数"
              value={studentAccounts.length + repairmanAccounts.length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 用户类型选择和表格 */}
      <Card 
        title={getCurrentTitle()}
        extra={
          <Select
            defaultValue="students"
            style={{ width: 200 }}
            onChange={handleUserTypeChange}
            size="large"
          >
            <Option value="students">
              <Space>
                <UserOutlined />
                学生账号
              </Space>
            </Option>
            <Option value="repairmen">
              <Space>
                <ToolOutlined />
                维修人员账号
              </Space>
            </Option>
          </Select>
        }
      >
        <Table
          columns={columns}
          dataSource={getCurrentData()}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default UserManagement;