import React from 'react';
import { Card, Tag, Space, Spin, Empty } from 'antd';
import { repairUtils } from '../services/repairService';

const RepairOrderList = ({ repairOrders, loading }) => {
  // 如果正在加载，显示加载指示器
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>正在加载工单数据...</p>
      </div>
    );
  }

  // 如果没有工单数据，显示空状态
  if (!repairOrders || repairOrders.length === 0) {
    return (
      <div style={{ padding: '16px' }}>
        <h2>工单管理</h2>
        <Empty description="暂无工单数据" />
      </div>
    );
  }

  // 渲染每个工单卡片
  const renderRepairOrderCard = (order) => {
    const statusInfo = repairUtils.getStatusInfo(order.status);
    const categoryInfo = repairUtils.getCategoryInfo(order.category);
    const repairman = repairUtils.getRepairmanInfo(order.repairmanId);

    return (
      <Card
        key={order.id}
        title={`工单 #${order.id}`}
        extra={<Tag color={statusInfo.color}>{statusInfo.label}</Tag>}
        style={{ marginBottom: 16 }}
      >
        <div style={{ lineHeight: '2' }}>
          <p><strong>提交人学号:</strong> {order.studentID}</p> {/* 新增此行 */}
          <p><strong>报修分类:</strong> {categoryInfo.label}</p>
          <p><strong>具体位置:</strong> {order.location}</p>
          <p><strong>问题描述:</strong> {order.description}</p>
          <p><strong>维修人员:</strong> {repairman ? repairman.name : '未分配'}</p>
          <p><strong>提交时间:</strong> {order.created_at}</p>
          
          {/* 根据状态显示相应的时间信息 */}
          {order.assigned_at && (
            <p><strong>分配时间:</strong> {order.assigned_at}</p>
          )}
          {order.completed_at && (
            <p><strong>完成时间:</strong> {order.completed_at}</p>
          )}
          {order.rejection_reason && (
            <p><strong>驳回原因:</strong> {order.rejection_reason}</p>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div style={{ padding: '16px' }}>
      <h2>工单管理</h2>
      <div>
        {repairOrders.map(renderRepairOrderCard)}
      </div>
    </div>
  );
};

export default RepairOrderList;