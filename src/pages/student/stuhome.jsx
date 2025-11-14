import React, { useState } from 'react';
import { UserOutlined, EditOutlined, AppstoreOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Space, Menu, Form, Input, Select, Button, message, Card } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const StuHome = () => {
  // 状态管理当前选中的菜单项
  const [currentMenu, setCurrentMenu] = useState('my-repairs');
  const [form] = Form.useForm();

  // 水平导航菜单配置
  const navItems = [
    {
      label: '我的报修',
      key: 'my-repairs',
      icon: <AppstoreOutlined />,
    },
    {
      label: '创建报修申请',
      key: 'create-repair',
      icon: <PlusOutlined />,
    },
  ];

  // 处理导航菜单点击
  const handleNavClick = (e) => {
    console.log('点击了菜单:', e.key);
    setCurrentMenu(e.key);
  };

  // 处理头像下拉菜单点击
  const handleMenuClick = (e) => {
    if (e.key === 'edit-profile') {
      console.log('点击了编辑基本信息');
      // 这里可以添加编辑基本信息的逻辑
    }
  };

  // 处理表单提交
  const handleFormSubmit = (values) => {
    console.log('表单提交:', values);
    // 这里可以添加提交到后端的逻辑
    message.success('报修申请提交成功！');
    form.resetFields(); // 重置表单
  };

  // 头像下拉菜单项
  const avatarMenuItems = [
    {
      key: 'edit-profile',
      icon: <EditOutlined />,
      label: '编辑基本信息',
    },
  ];

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
          报修管理系统
        </div>
        
        {/* 右侧用户信息 */}
        <Space size="middle">
          <span>欢迎，stu</span>
          <Dropdown
            menu={{
              items: avatarMenuItems,
              onClick: handleMenuClick,
            }}
            placement="bottomRight"
            arrow
          >
            <Avatar 
              size="default" 
              icon={<UserOutlined />}
              style={{ 
                cursor: 'pointer',
                backgroundColor: '#1890ff'
              }}
            />
          </Dropdown>
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

      {/* 页面内容区域 - 根据当前选中的菜单项显示不同内容 */}
      <div style={{ padding: '0 24px' }}>
        {currentMenu === 'my-repairs' && (
          <div>
            <h2>我的报修</h2>
            <p>这里将显示我的报修记录列表...</p>
            {/* 这里可以添加报修记录列表组件 */}
          </div>
        )}
        
        {currentMenu === 'create-repair' && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'flex-start',
            minHeight: '60vh'
          }}>
            <Card 
              title="创建报修申请" 
              style={{ 
                width: '100%', 
                maxWidth: '800px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
              headStyle={{ fontSize: '20px', fontWeight: 'bold' }}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleFormSubmit}
                autoComplete="off"
              >
                <Form.Item
                  label="报修分类"
                  name="category"
                  rules={[{ required: true, message: '请选择报修分类!' }]}
                >
                  <Select 
                    placeholder="请选择报修分类"
                    size="large"
                  >
                    <Option value="dormitory">宿舍</Option>
                    <Option value="classroom">教室</Option>
                    <Option value="public-area">公共区域</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="具体位置"
                  name="location"
                  rules={[{ required: true, message: '请输入具体位置!' }]}
                >
                  <Input 
                    placeholder="例如：3栋502寝室" 
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="问题描述"
                  name="description"
                  rules={[{ required: true, message: '请输入问题描述!' }]}
                >
                  <TextArea 
                    rows={6} 
                    placeholder="请详细描述您遇到的问题..." 
                    maxLength={500}
                    showCount
                    size="large"
                  />
                </Form.Item>

                <Form.Item style={{ 
                  textAlign: 'center',
                  marginTop: '32px'
                }}>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    size="large"
                    style={{ 
                      width: '150px',
                      height: '40px',
                      marginRight: '16px'
                    }}
                  >
                    提交报修申请
                  </Button>
                  <Button 
                    size="large"
                    style={{ 
                      width: '100px',
                      height: '40px'
                    }}
                    onClick={() => form.resetFields()}
                  >
                    重置
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default StuHome;