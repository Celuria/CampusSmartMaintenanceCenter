// src/components/UserManagement.jsx
//管理员端：用户管理

import React, { useState} from 'react';
import { Card, Table, Space, Select, Row, Col, Statistic, Tag,
  Button, Modal, Form, Input, message, Popconfirm
} from 'antd';
import { UserOutlined, ToolOutlined, TeamOutlined, PhoneOutlined,
  EditOutlined, DeleteOutlined, KeyOutlined
 } from '@ant-design/icons';

const { Option } = Select;

const UserManagement = () => {
  const [currentUserType, setCurrentUserType] = useState('students');
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // 模拟学生账号数据
  const [studentAccounts, setStudentAccounts] = useState([
    { id: '20210001', number:"stu001", name: '张三', phone: '13800138001', type: 'student' },
    { id: '20210002', number:"stu002", name: '李四', phone: '13800138002', type: 'student' },
    { id: '20210003', number:"stu003", name: '王五', phone: '13800138003', type: 'student' },
    { id: '20210004', number:"stu004", name: '赵六', phone: '13800138004', type: 'student' },
    { id: '20210005', number:"stu005", name: '钱七', phone: '13800138005', type: 'student' },
    { id: '20210006', number:"stu006", name: '孙八', phone: '13800138006', type: 'student' },
  ]);

  // 模拟维修人员账号数据
  const [repairmanAccounts, setRepairmanAccounts] = useState([
    { id: '20210007', number:"worker001", name: '张师傅', phone: '13900139001', type: 'repairman' },
    { id: '20210008', number:"worker002", name: '李师傅', phone: '13900139002', type: 'repairman' },
    { id: '20210009', number:"worker003", name: '王师傅', phone: '13900139003', type: 'repairman' },
    { id: '20210010', number:"worker004", name: '赵师傅', phone: '13900139004', type: 'repairman' },
  ]);

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

  // 删除用户
  const handleDelete = (record) => {
    if (currentUserType === 'students') {
      setStudentAccounts(prev => prev.filter(user => user.id !== record.id));
    } else {
      setRepairmanAccounts(prev => prev.filter(user => user.id !== record.id));
    }
    message.success('用户删除成功');
  };

  // 修复重置密码函数
  const handleResetPassword = (record) => {
    try {
      // 获取当前日期，格式为 YYYYMMDD
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const dateStr = `${year}${month}${day}`;
    
      // 生成新密码：用户ID + 当前日期
      const newPassword = `${dateStr}`;

      // 使用 Modal 弹窗显示重置密码信息
      Modal.success({
        title: '密码重置成功',
        content: (
          <div>
            <p>已重置用户 <strong>{record.name}</strong> 的密码</p>
            <p>新密码：<strong>{newPassword}</strong></p>
            <p style={{ color: '#ff4d4f', fontSize: '12px' }}>
              提示：请告知用户及时登录并修改密码
            </p>
          </div>
        ),
        okText: '确定',
        width: 400,
      });
    } catch (error) {
      console.error('重置密码失败:', error);
      message.error('重置密码失败');
    }
  };

  // 修改数据：打开编辑模态框
  const handleEdit = (record) => {
    setEditingUser(record);
    form.setFieldsValue({
      phone: record.phone,
      type: record.type
    });
    setEditModalVisible(true);
  };

  // 保存编辑
  const handleSaveEdit = async () => {
    try {
      const values = await form.validateFields();
      const updatedUser = { ...editingUser, ...values };
      
      if (currentUserType === 'students') {
        setStudentAccounts(prev => 
          prev.map(user => user.id === updatedUser.id ? updatedUser : user)
        );
      } else {
        setRepairmanAccounts(prev => 
          prev.map(user => user.id === updatedUser.id ? updatedUser : user)
        );
      }
      
      message.success('用户信息更新成功');
      setEditModalVisible(false);
      setEditingUser(null);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
      message.error('保存失败，请检查表单数据');
    }
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditModalVisible(false);
    setEditingUser(null);
    form.resetFields();
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
      title: '学号/工号',
      dataIndex: 'number',
      key: 'number',
      width: 150,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
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
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Popconfirm
            title="确定要删除这个用户吗？"
            description="此操作不可恢复，请谨慎操作！"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
            okType="danger"
          >
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />}
              size="small"
            >
              删除
            </Button>
          </Popconfirm>
          
          <Popconfirm
            title="重置密码"
            description="确定要将密码重置为默认密码吗？"
            onConfirm={() => handleResetPassword(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="link" 
              icon={<KeyOutlined />}
              size="small"
            >
              重置密码
            </Button>
          </Popconfirm>

          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            修改
          </Button>
        </Space>
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
            value={currentUserType}  // 修复：使用 value 而不是 defaultValue
            style={{ width: 200 }}
            onChange={handleUserTypeChange}
            size="large"
          >
            <Option value="students">  {/* 修复：保持值一致 */}
              <Space>
                <UserOutlined />
                学生账号
              </Space>
            </Option>
            <Option value="repairman">  {/* 修复：改为 repairman 与状态一致 */}
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

      {/* 编辑用户模态框 */}
      <Modal
        title="编辑用户信息"
        open={editModalVisible}
        onOk={handleSaveEdit}
        onCancel={handleCancelEdit}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="用户ID"
          >
            <Input value={editingUser?.id} disabled />
          </Form.Item>

          <Form.Item
            label="姓名"
          >
            <Input value={editingUser?.name} disabled />
          </Form.Item>
          
          <Form.Item
            label="学号/工号"
          >
            <Input value={editingUser?.number} disabled />
          </Form.Item>
          
          <Form.Item
            label="联系电话"
            name="phone"
            rules={[
              { required: true, message: '请输入联系电话!' },
              //{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码!' }
            ]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>

          <Form.Item
            label="用户类型"
          >
            <Input value={editingUser?.type} disabled />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;