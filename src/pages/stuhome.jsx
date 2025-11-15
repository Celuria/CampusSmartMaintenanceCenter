// 在学生端的 Home.jsx 中更新"我的报修"部分
import React, { useState, useEffect } from 'react';
import { 
  Layout, Menu, Avatar, Space, Form, Input, Select, Button, message, Card, Dropdown 
} from 'antd';
import { 
  UserOutlined, EditOutlined, AppstoreOutlined, PlusOutlined 
} from '@ant-design/icons';
import MyRepairs from '../components/MyRepairs'; // 导入新的组件
import { repairService } from '../services/repairService';

const { Sider, Content, Header } = Layout;
const { Option } = Select;
const { TextArea } = Input;

const Home = () => {
  const [currentMenu, setCurrentMenu] = useState('my-repairs');
  const [collapsed, setCollapsed] = useState(false);
  const [repairOrders, setRepairOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // 侧边栏菜单配置
  const sideMenuItems = [
    {
      key: 'my-repairs',
      icon: <AppstoreOutlined />,
      label: '我的报修',
    },
    {
      key: 'create-repair',
      icon: <PlusOutlined />,
      label: '创建报修申请',
    },
  ];

  // 获取我的报修记录
  const fetchMyRepairs = async () => {
    setLoading(true);
    try {
      // 这里假设有一个获取当前用户报修记录的方法
      // 暂时使用获取所有工单的方法，实际中应该根据当前用户ID过滤
      const result = await repairService.getRepairOrders();
      setRepairOrders(result.data);
    } catch (error) {
      console.error('获取报修记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理侧边栏菜单点击
  const handleSideMenuClick = (e) => {
    console.log('点击了侧边栏菜单:', e.key);
    setCurrentMenu(e.key);
    
    // 当切换到"我的报修"时，加载数据
    if (e.key === 'my-repairs') {
      fetchMyRepairs();
    }
  };

  // 处理头像下拉菜单点击
  const handleAvatarMenuClick = (e) => {
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
          {collapsed ? '学生' : '学生报修系统'}
        </div>
        
        <Menu
          theme="dark"
          selectedKeys={[currentMenu]}
          mode="inline"
          items={sideMenuItems}
          onClick={handleSideMenuClick}
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
            学生工作台
          </div>
          
          <Space size="middle">
            <span>欢迎，stu</span>
            <Dropdown
              menu={{
                items: avatarMenuItems,
                onClick: handleAvatarMenuClick,
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
        </Header>

        {/* 内容区域 */}
        <Content style={{ 
          margin: '24px 16px', 
          padding: 24, 
          background: '#fff',
          minHeight: 280 
        }}>
          {currentMenu === 'my-repairs' && (
            <MyRepairs repairOrders={repairOrders} loading={loading} />
          )}
          
          {currentMenu === 'create-repair' && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'flex-start'
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
                    <Select placeholder="请选择报修分类" size="large">
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
                    <Input placeholder="例如：3栋502寝室" size="large" />
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
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;