import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Tag, 
  Button, 
  Modal, 
  Descriptions, 
  Image, 
  Space, 
  Spin, 
  Card, 
  Select, 
  Row, 
  Col, 
  Statistic,
  Popconfirm,
  message,
  Rate,
  Input
} from 'antd';
import { 
  EyeOutlined, 
  ClockCircleOutlined, 
  UserOutlined, 
  DeleteOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  StarOutlined
} from '@ant-design/icons';
import { repairUtils, repairService } from '../services/repairService';

const { Option } = Select;
const { TextArea } = Input;

const MyRepairs = ({ repairOrders: initialRepairOrders, loading, currentUser, onRefresh }) => {
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    urgency: 'all'
  });

  // 新增：评价模态框状态
  const [evaluateModalVisible, setEvaluateModalVisible] = useState(false);
  const [evaluatingOrder, setEvaluatingOrder] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [evaluating, setEvaluating] = useState(false);

  // 使用本地状态管理已删除的ID，而不是整个数据数组
  const [deletedOrderIds, setDeletedOrderIds] = useState(new Set());

  // 分类选项配置 - 使用 repairService 中的变量名
  const categoryOptions = [
    { value: 'waterAndElectricity', label: '水电维修' },
    { value: 'networkIssues', label: '网络故障' },
    { value: 'furnitureRepair', label: '家具维修' },
    { value: 'applianceIssues', label: '电器故障' },
    { value: 'publicFacilities', label: '公共设施' }
  ];

  // 应用筛选 - 过滤掉已删除的订单
  const applyFilters = () => {
    let filtered = initialRepairOrders.filter(order => !deletedOrderIds.has(order.id));

    // 状态筛选
    if (filters.status !== 'all') {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    // 分类筛选
    if (filters.category !== 'all') {
      filtered = filtered.filter(order => order.category === filters.category);
    }

    // 紧急程度筛选
    if (filters.urgency !== 'all') {
      filtered = filtered.filter(order => order.urgency === filters.urgency);
    }

    setFilteredOrders(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, initialRepairOrders, deletedOrderIds]);

  // 处理筛选条件变化
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 重置筛选
  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      category: 'all',
      urgency: 'all'
    });
  };

  // 打开详情模态框
  const handleViewDetail = async (record) => {
    setDetailModalVisible(true);
    setDetailLoading(true);
    
    try {
      const orderDetail = await repairService.getRepairOrderById(record.id);
      
      // 使用工单中保存的图片数据，如果没有则使用空数组
      const orderWithImages = {
        ...orderDetail,
        images: orderDetail.images || [], // 使用工单中的图片数据
      };
      
      setSelectedOrder(orderWithImages);
    } catch (error) {
      console.error('获取工单详情失败:', error);
      message.error('获取详情失败');
    } finally {
      setDetailLoading(false);
    }
  };

  // 关闭详情模态框
  const handleCloseDetail = () => {
    setDetailModalVisible(false);
    setSelectedOrder(null);
  };

  // 删除报修记录 - 修复版
  const handleDeleteRepair = async (record) => {
    try {
      // 在实际项目中，这里应该调用删除API
      // 暂时使用已删除ID集合来标记删除
      setDeletedOrderIds(prev => new Set([...prev, record.id]));
      
      message.success('报修记录删除成功');
      
      // 如果有传入刷新函数，则调用父组件的刷新
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('删除报修记录失败:', error);
      message.error('删除失败');
    }
  };

  // 新增：打开评价模态框
  const handleEvaluate = (record) => {
    setEvaluatingOrder(record);
    setRating(0);
    setFeedback('');
    setEvaluateModalVisible(true);
  };

  // 新增：关闭评价模态框
  const handleCloseEvaluate = () => {
    setEvaluateModalVisible(false);
    setEvaluatingOrder(null);
    setRating(0);
    setFeedback('');
  };

  // 新增：提交评价
  const handleSubmitEvaluation = async () => {
    if (rating === 0) {
      message.error('请至少给一星评价');
      return;
    }

    setEvaluating(true);
    try {
      // 在实际项目中，这里应该调用API提交评价
      // 暂时模拟评价提交
      console.log('提交评价:', {
        orderId: evaluatingOrder.id,
        rating,
        feedback
      });
      
      // 更新工单状态为"已完成"
      await repairService.updateRepairOrderStatus(evaluatingOrder.id, 'completed');
      
      message.success('评价提交成功！');
      handleCloseEvaluate();
      
      // 刷新数据
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('提交评价失败:', error);
      message.error('提交评价失败，请重试！');
    } finally {
      setEvaluating(false);
    }
  };

  // 统计信息 - 排除已删除的订单
  const getStats = () => {
    const visibleOrders = initialRepairOrders.filter(order => !deletedOrderIds.has(order.id));
    const total = visibleOrders.length;
    const pending = visibleOrders.filter(order => order.status === 'pending').length;
    const processing = visibleOrders.filter(order => order.status === 'processing').length;
    const completed = visibleOrders.filter(order => order.status === 'completed').length;
    const toBeEvaluated = visibleOrders.filter(order => order.status === 'to_be_evaluated').length;

    return { total, pending, processing, completed, toBeEvaluated };
  };

  const stats = getStats();

  // 表格列定义
  const columns = [
    {
      title: '报修单号',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '报修标题',
      dataIndex: 'title',
      key: 'title',
      width: 150,
    },
    {
      title: '报修分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category) => {
        const categoryInfo = repairUtils.getCategoryInfo(category);
        return categoryInfo ? categoryInfo.label : category;
      },
    },
    {
      title: '具体位置',
      dataIndex: 'location',
      key: 'location',
      width: 120,
    },
    {
      title: '问题描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 200,
    },
    {
      title: '紧急程度',
      dataIndex: 'urgency',
      key: 'urgency',
      width: 100,
      render: (urgency) => {
        const urgencyInfo = repairUtils.getUrgencyInfo(urgency);
        return <Tag color={urgencyInfo.color}>{urgencyInfo.label}</Tag>;
      },
    },
    {
      title: '提交时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const statusInfo = repairUtils.getStatusInfo(status);
        return <Tag color={statusInfo.color}>{statusInfo.label}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
            size="small"
          >
            详情
          </Button>
          
          {/* 只有待受理状态可以删除 */}
          {record.status === 'pending' && (
            <Popconfirm
              title="确定要删除这条报修记录吗？"
              description="删除后无法恢复，请谨慎操作！"
              onConfirm={() => handleDeleteRepair(record)}
              okText="确定"
              cancelText="取消"
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
          )}
          
          {/* 只有待评价状态可以评价 */}
          {record.status === 'to_be_evaluated' && (
            <Button 
              type="link" 
              icon={<StarOutlined />}
              onClick={() => handleEvaluate(record)}
              size="small"
              style={{ color: '#faad14' }}
            >
              评价
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div>
      <h2>我的报修</h2>
      
      {/* 统计信息 */}
      <Row gutter={16} style={{ marginBottom: '16px' }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="总报修数"
              value={stats.total}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="待受理"
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="处理中"
              value={stats.processing}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="待评价"
              value={stats.toBeEvaluated}
              prefix={<StarOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="已完成"
              value={stats.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选器 */}
      <Card 
        title="筛选条件" 
        style={{ marginBottom: '16px' }}
        extra={
          <Button 
            icon={<FilterOutlined />}
            onClick={handleResetFilters}
          >
            重置筛选
          </Button>
        }
      >
        <Space size="large">
          <div>
            <span style={{ marginRight: 8 }}>状态：</span>
            <Select
              value={filters.status}
              style={{ width: 120 }}
              onChange={(value) => handleFilterChange('status', value)}
            >
              <Option value="all">全部状态</Option>
              <Option value="pending">待受理</Option>
              <Option value="processing">处理中</Option>
              <Option value="to_be_evaluated">待评价</Option>
              <Option value="completed">已完成</Option>
              <Option value="rejected">已驳回</Option>
            </Select>
          </div>

          <div>
            <span style={{ marginRight: 8 }}>分类：</span>
            <Select
              value={filters.category}
              style={{ width: 120 }}
              onChange={(value) => handleFilterChange('category', value)}
            >
              <Option value="all">全部分类</Option>
              {categoryOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <span style={{ marginRight: 8 }}>紧急程度：</span>
            <Select
              value={filters.urgency}
              style={{ width: 120 }}
              onChange={(value) => handleFilterChange('urgency', value)}
            >
              <Option value="all">全部</Option>
              <Option value="normal">低</Option>
              <Option value="urgent">中</Option>
              <Option value="critical">高</Option>
            </Select>
          </div>
        </Space>
      </Card>

      {/* 报修记录表格 */}
      <Card>
        <Table
          style={{
            height: '80vh',
          }}
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
          scroll={{ x: 1000 }}
          locale={{ emptyText: '暂无报修记录' }}
        />
      </Card>

      {/* 报修单详情模态框 */}
      <Modal
        title={
          <Space>
            <EyeOutlined />
            报修单详情
          </Space>
        }
        open={detailModalVisible}
        onCancel={handleCloseDetail}
        footer={[
          <Button key="close" onClick={handleCloseDetail}>
            关闭
          </Button>
        ]}
        width={800}
        bodyStyle={{ padding: '20px' }}
      >
        {detailLoading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>加载详情中...</div>
          </div>
        ) : selectedOrder ? (
          <div>
            {/* 基本信息 */}
            <Descriptions 
              title="基本信息" 
              bordered 
              column={2}
              size="small"
              style={{ marginBottom: 24 }}
            >
              <Descriptions.Item label="报修单号" span={1}>
                {selectedOrder.id}
              </Descriptions.Item>
              <Descriptions.Item label="报修标题" span={1}>
                {selectedOrder.title}
              </Descriptions.Item>
              <Descriptions.Item label="报修分类" span={1}>
                {repairUtils.getCategoryInfo(selectedOrder.category)?.label || selectedOrder.category}
              </Descriptions.Item>
              <Descriptions.Item label="紧急程度" span={1}>
                <Tag color={repairUtils.getUrgencyInfo(selectedOrder.urgency).color}>
                  {repairUtils.getUrgencyInfo(selectedOrder.urgency).label}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="具体位置" span={2}>
                {selectedOrder.location}
              </Descriptions.Item>
              <Descriptions.Item label="问题描述" span={2}>
                {selectedOrder.description}
              </Descriptions.Item>
              <Descriptions.Item label="当前状态" span={1}>
                <Tag color={repairUtils.getStatusInfo(selectedOrder.status).color}>
                  {repairUtils.getStatusInfo(selectedOrder.status).label}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="提交时间" span={1}>
                {selectedOrder.created_at}
              </Descriptions.Item>
            </Descriptions>

            {/* 人员信息 */}
            <Descriptions 
              title="人员信息" 
              bordered 
              column={2}
              size="small"
              style={{ marginBottom: 24 }}
            >
              <Descriptions.Item label="报修学生" span={1}>
                <Space>
                  <UserOutlined />
                  {selectedOrder.studentName || '未知'}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="联系电话" span={1}>
                {selectedOrder.contactPhone || '未提供'}
              </Descriptions.Item>
              <Descriptions.Item label="维修人员" span={1}>
                {selectedOrder.repairmanId ? 
                  repairUtils.getRepairmanInfo(selectedOrder.repairmanId)?.name : 
                  '未分配'
                }
              </Descriptions.Item>
              <Descriptions.Item label="学号" span={1}>
                {selectedOrder.studentID}
              </Descriptions.Item>
            </Descriptions>

            {/* 时间线信息 */}
            <Descriptions 
              title="处理进度" 
              bordered 
              column={1}
              size="small"
              style={{ marginBottom: 24 }}
            >
              <Descriptions.Item label="提交时间">
                <Space>
                  <ClockCircleOutlined />
                  {selectedOrder.created_at}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="分配时间">
                <Space>
                  <ClockCircleOutlined />
                  {selectedOrder.assigned_at || '未分配'}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="完成时间">
                <Space>
                  <ClockCircleOutlined />
                  {selectedOrder.completed_at || '未完成'}
                </Space>
              </Descriptions.Item>
              {selectedOrder.rejection_reason && (
                <Descriptions.Item label="驳回原因">
                  {selectedOrder.rejection_reason}
                </Descriptions.Item>
              )}
              {selectedOrder.repairNotes && (
                <Descriptions.Item label="维修备注">
                  {selectedOrder.repairNotes}
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* 新增：现场照片展示 */}
            {selectedOrder.images && selectedOrder.images.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ marginBottom: 16 }}>现场照片</h4>
                <Image.PreviewGroup>
                  <Space wrap>
                    {selectedOrder.images.map((image, index) => (
                      <Image
                        key={index}
                        width={120}
                        height={90}
                        src={image}
                        style={{
                          borderRadius: 6,
                          objectFit: 'cover',
                          border: '1px solid #d9d9d9'
                        }}
                        placeholder={
                          <div 
                            style={{ 
                              width: 120, 
                              height: 90, 
                              background: '#f5f5f5',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 6
                            }}
                          >
                            加载中...
                          </div>
                        }
                      />
                    ))}
                  </Space>
                </Image.PreviewGroup>
              </div>
            )}

            {/* 评价信息（如果已完成且有评价） */}
            {selectedOrder.rating && (
              <Descriptions 
                title="评价信息" 
                bordered 
                column={1}
                size="small"
              >
                <Descriptions.Item label="评分">
                  {'★'.repeat(selectedOrder.rating)}{'☆'.repeat(5 - selectedOrder.rating)}
                  <span style={{ marginLeft: 8, color: '#faad14' }}>
                    ({selectedOrder.rating}分)
                  </span>
                </Descriptions.Item>
                {selectedOrder.feedback && (
                  <Descriptions.Item label="评价内容">
                    {selectedOrder.feedback}
                  </Descriptions.Item>
                )}
              </Descriptions>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
            未找到报修单详情
          </div>
        )}
      </Modal>

      {/* 新增：评价模态框 */}
      <Modal
        title={
          <Space>
            <StarOutlined />
            服务评价
          </Space>
        }
        open={evaluateModalVisible}
        onCancel={handleCloseEvaluate}
        onOk={handleSubmitEvaluation}
        confirmLoading={evaluating}
        okText="提交评价"
        cancelText="取消"
        width={500}
      >
        {evaluatingOrder && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <strong>报修单：</strong>{evaluatingOrder.title}
            </div>
            
            <div style={{ marginBottom: 24 }}>
              <div style={{ marginBottom: 8 }}>
                <strong>评分 <span style={{ color: '#ff4d4f' }}>*</span></strong>
              </div>
              <Rate 
                value={rating} 
                onChange={setRating}
                style={{ fontSize: 24 }}
              />
              <div style={{ marginTop: 8, color: '#999' }}>
                {rating > 0 ? `您选择了 ${rating} 星` : '请选择评分'}
              </div>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8 }}>
                <strong>评价内容</strong>（选填）
              </div>
              <TextArea
                rows={4}
                placeholder="请写下您对本次服务的评价..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                maxLength={500}
                showCount
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyRepairs;