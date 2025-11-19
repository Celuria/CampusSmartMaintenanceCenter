// src/components/MyRepairs.jsx
import React, { useState } from 'react';
import { Table, Tag, Button, Modal, Descriptions, Image, Space, Spin } from 'antd';
import { EyeOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { repairUtils, repairService } from '../services/repairService';

const MyRepairs = ({ repairOrders, loading }) => {
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // 打开详情模态框
  const handleViewDetail = async (record) => {
    setDetailModalVisible(true);
    setDetailLoading(true);
    
    try {
      // 模拟从服务获取详细数据（包含图片）
      const orderDetail = await repairService.getRepairOrderById(record.id);
      
      // 为演示添加模拟图片数据
      const orderWithImages = {
        ...orderDetail,
        images: [
          'https://via.placeholder.com/400x300/1890ff/ffffff?text=报修现场图1',
          'https://via.placeholder.com/400x300/52c41a/ffffff?text=报修现场图2',
          'https://via.placeholder.com/400x300/faad14/ffffff?text=问题细节图'
        ],
      
      };
      
      setSelectedOrder(orderWithImages);
    } catch (error) {
      console.error('获取工单详情失败:', error);
    } finally {
      setDetailLoading(false);
    }
  };

  // 关闭详情模态框
  const handleCloseDetail = () => {
    setDetailModalVisible(false);
    setSelectedOrder(null);
  };

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
        return categoryInfo.label;
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
      width: 100,
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          查看详情
        </Button>
      )
    }
  ];

  return (
    <div>
      <h2>我的报修</h2>
      <Table
        style={{
          height: '80vh',
        }}
        columns={columns}
        dataSource={repairOrders}
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
                {repairUtils.getCategoryInfo(selectedOrder.category).label}
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
                  repairUtils.getRepairmanInfo(selectedOrder.repairmanId).name : 
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

            {/* 照片展示 */}
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
    </div>
  );
};

export default MyRepairs;