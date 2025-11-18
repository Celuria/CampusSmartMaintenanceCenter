// 在学生端的 Home.jsx 中更新"我的报修"部分
import React, { useState, useEffect } from "react";
import {Layout,Menu,Avatar,Space,Form,Input,Select,Button,message,
  Card,Dropdown,Upload} from "antd";
import {
  UserOutlined,
  EditOutlined,
  AppstoreOutlined,
  PlusOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import MyRepairs from "../components/MyRepairs"; // 导入新的组件
import { repairService } from "../services/repairService";
import PersonalInfoEd from "../model/PersonalInfoEd"; // 导入个人信息编辑组件


const { Sider, Content, Header } = Layout;
const { Option } = Select;
const { TextArea } = Input;

const Home = () => {
  const [currentMenu, setCurrentMenu] = useState("my-repairs");
  const [collapsed, setCollapsed] = useState(false);
  const [repairOrders, setRepairOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  // 新增状态：控制个人信息编辑弹窗显示
  const [personalInfoModalVisible, setPersonalInfoModalVisible] =
    useState(false);

  // 新增状态：当前用户信息
  const [currentUser, setCurrentUser] = useState({
    username: "stu", // 从登录信息获取
    email: "stu@student.edu.cn",
    phone: "",
    department: "计算机学院",
    position: "学生",
    studentID: "001", // 学生学号
  });

  // 侧边栏菜单配置
  const sideMenuItems = [
    {
      key: "my-repairs",
      icon: <AppstoreOutlined />,
      label: "我的报修",
    },
    {
      key: "create-repair",
      icon: <PlusOutlined />,
      label: "创建报修申请",
    },
  ];

  useEffect(() => {
    // 初始加载我的报修记录
    fetchMyRepairs();
  }, []);

  // 获取我的报修记录
  const fetchMyRepairs = async () => {
    setLoading(true);
    try {
      // 这里假设有一个获取当前用户报修记录的方法
      // 暂时使用获取所有工单的方法，实际中应该根据当前用户ID过滤
      const result = await repairService.getRepairOrders();
      setRepairOrders(result.data);
    } catch (error) {
      console.error("获取报修记录失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 处理侧边栏菜单点击
  const handleSideMenuClick = (e) => {
    console.log("点击了侧边栏菜单:", e.key);
    setCurrentMenu(e.key);
  };

  // 完善：处理头像下拉菜单点击
  const handleAvatarMenuClick = (e) => {
    if (e.key === "edit-profile") {
      console.log("点击了编辑基本信息");
      // 打开个人信息编辑弹窗
      setPersonalInfoModalVisible(true);
    } else if (e.key === "logout") {
      // 处理退出登录
      console.log("退出登录");
      // 这里可以添加退出登录的逻辑，比如清除token、跳转到登录页等
      message.info("已退出登录");
      // window.location.href = '/login'; // 实际项目中可能需要路由跳转
    }
  };

  // 新增：处理个人信息更新
  const handleUserInfoUpdate = (updatedInfo) => {
    setCurrentUser(updatedInfo);
    message.success("个人信息更新成功！");
    // 在实际项目中，这里可以调用API将更新后的信息保存到后端
    console.log("更新后的用户信息:", updatedInfo);
  };

  //11.18新增：处理文件上传
  const handleUploadChange = ({fileList: newFileList}) => {
    setFileList(newFileList);
  };

  //11.18处理文件删除
  const handleRemove = (file) => {
    const newFileList = fileList.filter(item => item.uid !== file.uid);
    setFileList(newFileList);
  }

  // 处理表单提交
  // 在学生端的 Home.jsx 中修改 handleFormSubmit 函数
// 处理表单提交
const handleFormSubmit = async (values) => {
  try {
    // 添加当前用户ID
    const formData = {
      ...values,
      studentID: 'stu', // 这里应该是当前登录用户的ID
    };
    
    // 调用服务创建报修
    const newOrder = await repairService.createRepairOrder(formData);
    console.log('创建报修成功:', newOrder);
    
    message.success('报修申请提交成功！');
    
    // 重置表单
    form.resetFields();
    setFileList([]);
    
    // 如果当前在"我的报修"页面，刷新数据
    if (currentMenu === 'my-repairs') {
      fetchMyRepairs();
    }
  } catch (error) {
    console.error('提交报修申请失败:', error);
    message.error('提交报修申请失败，请重试！');
  }
};

  // 完善：头像下拉菜单项
  const avatarMenuItems = [
    {
      key: "edit-profile",
      icon: <EditOutlined />,
      label: "编辑个人信息",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <UserOutlined />,
      label: "退出登录",
      danger: true,
    },
  ];

  // 上传组件配置
  const uploadProps = {
    beforeUpload: (file) => {
      // 限制文件类型为图片
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件!');
        return Upload.LIST_IGNORE;
      }
      
      // 限制文件大小 (5MB)
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('图片大小不能超过5MB!');
        return Upload.LIST_IGNORE;
      }
      
      // 不自动上传，只添加到文件列表
      return false;
    },
    fileList,
    onChange: handleUploadChange,
    onRemove: handleRemove,
    multiple: true, // 允许上传多个文件
    accept: 'image/*', // 只接受图片文件
  };

  return (
    <Layout style={{ height: "100vh" }}>
      {/* 侧边栏 */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark"
        style={{
          position: "fixed",
          zIndex: 1,
          height: "100vh",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            height: "32px",
            margin: "16px",
            background: "rgba(255, 255, 255, 0.3)",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
          }}
        >
          {collapsed ? "学生" : "学生报修系统"}
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
        <Header
          style={{
            padding: "0 24px",
            background: "#fff",
            boxShadow: "0 1px 4px rgba(0,21,41,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "fixed",
            left: collapsed ? 80 : 200,
            zIndex: 1,
            right: 0,
            top: 0,
          }}
        >
          <div style={{ fontSize: "16px", fontWeight: "bold" }}>
            智能报修平台
          </div>

          <Space size="middle">
            <span>欢迎，{currentUser.username}</span>
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
                  cursor: "pointer",
                  backgroundColor: "#1890ff",
                }}
              />
            </Dropdown>
          </Space>
        </Header>

        {/* 内容区域 */}
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#fff",
            minHeight: 280,
            right: 0,
            left: collapsed ? 80 : 200,
            top: 64,
            bottom: 64,
            position: "fixed",
          }}
        >
          {currentMenu === "my-repairs" && (
            <MyRepairs repairOrders={repairOrders} loading={loading} />
          )}

          {currentMenu === "create-repair" && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <Card
                title="创建报修申请"
                style={{
                  width: "100%",
                  maxWidth: "800px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                }}
                headStyle={{ fontSize: "20px", fontWeight: "bold" }}
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
                    rules={[{ required: true, message: "请选择报修分类!" }]}
                  >
                    <Select placeholder="请选择报修分类" size="large">
                      <Option value="dormitory">宿舍</Option>
                      <Option value="classroom">教室</Option>
                      <Option value="public_area">公共区域</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="具体位置"
                    name="location"
                    rules={[{ required: true, message: "请输入具体位置!" }]}
                  >
                    <Input placeholder="例如：3栋502寝室" size="large" />
                  </Form.Item>

                  <Form.Item
                    label="问题描述"
                    name="description"
                    rules={[{ required: true, message: "请输入问题描述!" }]}
                  >
                    <TextArea
                      rows={6}
                      placeholder="请详细描述您遇到的问题..."
                      maxLength={500}
                      showCount
                      size="large"
                    />
                  </Form.Item>

                  {/* 11.18新增紧急程度选择 */}
                  <Form.Item
                    label="紧急程度"
                    name="urgency"
                    rules={[{ required: true, message: '请选择紧急程度!' }]}
                    initialValue="normal"
                  >
                    <Select placeholder="请选择紧急程度" size="large">
                      <Option value="normal">一般</Option>
                      <Option value="urgent">较紧急</Option>
                      <Option value="critical">紧急</Option>
                    </Select>
                  </Form.Item>

                  {/* 11.18新增图片上传功能 */}
                  <Form.Item
                    label="上传相关图片"
                    extra="支持上传多张图片，每张图片大小不超过5MB"
                  >
                    <Upload
                      {...uploadProps}
                      listType="picture"
                      showUploadList={{
                        showPreviewIcon: true,
                        showRemoveIcon: true,
                      }}
                    >
                      <Button icon={<UploadOutlined />}>选择图片</Button>
                    </Upload>
                  </Form.Item>

                  <Form.Item
                    style={{
                      textAlign: "center",
                      marginTop: "32px",
                    }}
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      style={{
                        width: "150px",
                        height: "40px",
                        marginRight: "16px",
                      }}
                    >
                      提交报修申请
                    </Button>
                    <Button
                      size="large"
                      style={{
                        width: "100px",
                        height: "40px",
                      }}
                      onClick={() => {
                        form.resetFields()
                        setFileList([]);
                      }}
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

      {/* 个人信息编辑弹窗 */}
      <PersonalInfoEd
        visible={personalInfoModalVisible}
        onCancel={() => setPersonalInfoModalVisible(false)}
        userInfo={currentUser}
        onUpdate={handleUserInfoUpdate}
      />
    </Layout>
  );
};

export default Home;
