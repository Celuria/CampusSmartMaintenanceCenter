// src/components/FeedbackManagement.jsx
//管理员端：评价管理

import React, { useState, useEffect } from 'react';
import { Card, Rate, Button, Space, Tag, message, List, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { feedbackService } from '../services/feedbackService';

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null); // 跟踪正在删除的ID

  // 加载评价数据
  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      const data = await feedbackService.getAllFeedbacks();
      setFeedbacks(data);
    } catch (error) {
      console.error('加载评价数据失败:', error);
      message.error('加载评价数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  // 删除评价 - 修复后的版本
  const handleDeleteFeedback = async (feedbackId) => {
    setDeletingId(feedbackId); // 设置正在删除的ID
    
    try {
      console.log('开始删除评价:', feedbackId);
      
      const success = await feedbackService.deleteFeedback(feedbackId);
      
      if (success) {
        message.success('评价删除成功');
        
        // 从本地状态中移除已删除的评价
        setFeedbacks(prevFeedbacks => 
          prevFeedbacks.filter(feedback => feedback.id !== feedbackId)
        );
      } else {
        message.error('删除失败，请重试');
      }
    } catch (error) {
      console.error('删除评价失败:', error);
      message.error('删除评价失败: ' + error.message);
    } finally {
      setDeletingId(null); // 重置删除状态
    }
  };

  // 检查是否有不当内容
  const hasInappropriateContent = (comment) => {
    if (!comment) return false;
    const inappropriateWords = ['badword']; // 您可以在这里添加敏感词
    return inappropriateWords.some(word => comment.toLowerCase().includes(word.toLowerCase()));
  };

  // 渲染每条评价卡片
  const renderFeedbackCard = (feedback) => {
    const repairman = feedbackService.getRepairmanInfo(feedback.repairmanId);
    
    // 根据评分设置标签颜色
    const getRatingTagColor = (rating) => {
      if (rating >= 4) return 'green';
      if (rating >= 3) return 'orange';
      return 'red';
    };

    const inappropriate = hasInappropriateContent(feedback.comment);
    const isDeleting = deletingId === feedback.id;

    return (
      <Card
        key={feedback.id}
        style={{ 
          marginBottom: 16,
          border: inappropriate ? '1px solid #ff4d4f' : '1px solid #d9d9d9'
        }}
        size="small"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            {/* 评价头部信息 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Space>
                <span style={{ fontWeight: 'bold' }}>评价 #{feedback.id}</span>
                <Tag color="blue">报修单: {feedback.repairOrderId}</Tag>
              </Space>
              <Tag color={getRatingTagColor(feedback.rating)}>
                {feedback.rating}星
              </Tag>
            </div>

            {/* 评分显示 */}
            <div style={{ marginBottom: 8 }}>
              <Rate disabled value={feedback.rating} />
            </div>

            {/* 参与方信息 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <strong>评价人:</strong> {feedback.studentId}
              </div>
              <div>
                <strong>维修人员:</strong> {repairman.name}
              </div>
            </div>

            {/* 评论内容 */}
            {feedback.comment && (
              <div style={{ 
                marginBottom: 8, 
                padding: '8px 12px', 
                backgroundColor: '#f5f5f5', 
                borderRadius: 4,
                border: inappropriate ? '1px solid #ffccc7' : 'none'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: 4 }}>评论内容:</div>
                <div style={{ 
                  color: inappropriate ? '#ff4d4f' : 'inherit',
                  fontStyle: inappropriate ? 'italic' : 'normal'
                }}>
                  {feedback.comment}
                </div>
                {inappropriate && (
                  <Tag color="red" style={{ marginTop: 4 }}>可能包含不当内容</Tag>
                )}
              </div>
            )}

            {/* 时间信息 */}
            <div style={{ color: '#666', fontSize: '12px' }}>
              评价时间: {feedback.createdAt}
            </div>
          </div>

          {/* 删除按钮 */}
          <div style={{ marginLeft: 16 }}>
            <Popconfirm
              title="确定删除这条评价吗？"
              description="此操作不可恢复"
              onConfirm={() => handleDeleteFeedback(feedback.id)}
              okText="确定"
              cancelText="取消"
              okType="danger"
              disabled={isDeleting}
            >
              <Button 
                type="primary" 
                danger 
                icon={<DeleteOutlined />}
                size="small"
                loading={isDeleting}
                disabled={isDeleting}
              >
                {isDeleting ? '删除中...' : '删除'}
              </Button>
            </Popconfirm>
          </div>
        </div>
      </Card>
    );
  };

  // 统计数据
  const totalFeedbacks = feedbacks.length;
  const averageRating = totalFeedbacks > 0 
    ? (feedbacks.reduce((sum, item) => sum + item.rating, 0) / totalFeedbacks).toFixed(1)
    : 0;
  const feedbacksWithComments = feedbacks.filter(f => f.comment && f.comment.trim() !== '').length;

  return (
    <div style={{ padding: '16px' }}>
      <h2>评价管理</h2>
      
      {/* 统计信息 */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <Card size="small" style={{ flex: 1 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
              {totalFeedbacks}
            </div>
            <div>总评价数</div>
          </div>
        </Card>
        <Card size="small" style={{ flex: 1 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
              {averageRating}
            </div>
            <div>平均评分</div>
          </div>
        </Card>
        <Card size="small" style={{ flex: 1 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
              {feedbacksWithComments}
            </div>
            <div>有文字评价</div>
          </div>
        </Card>
      </div>

      {/* 评价列表 */}
      {feedbacks.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            暂无评价数据
          </div>
        </Card>
      ) : (
        <div>
          {feedbacks.map(renderFeedbackCard)}
        </div>
      )}
    </div>
  );
};

export default FeedbackManagement;