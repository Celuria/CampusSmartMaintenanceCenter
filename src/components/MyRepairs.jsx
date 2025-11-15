// src/components/MyRepairs.jsx
import React from 'react';
import { Card, Tag, Space } from 'antd';
import { repairUtils } from '../services/repairService';

const MyRepairs = ({ repairOrders, loading }) => {
  // 如果没有数据，显示空状态
  if (!repairOrders || repairOrders.length === 0) {
    return (
      <div>
        <h2>我的报修</h2>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            暂无报修记录
          </div>
        </Card>
      </div>
    );
  }

  // 渲染每条报修记录卡片
  const renderRepairCard = (repair) => {
    const statusInfo = repairUtils.getStatusInfo(repair.status);
    const categoryInfo = repairUtils.getCategoryInfo(repair.category);
    const repairman = repairUtils.getRepairmanInfo(repair.repairmanId);

    return (
      <Card
        key={repair.id}
        style={{ marginBottom: 16 }}
        title={`报修单 #${repair.id}`}
        extra={<Tag color={statusInfo.color}>{statusInfo.label}</Tag>}
      >
        <div style={{ lineHeight: '2' }}>
          <p><strong>报修分类:</strong> {categoryInfo.label}</p>
          <p><strong>具体位置:</strong> {repair.location}</p>
          <p><strong>问题描述:</strong> {repair.description}</p>
          <p><strong>维修人员:</strong> {repairman ? repairman.name : '未分配'}</p>
          <p><strong>提交时间:</strong> {repair.created_at}</p>
          
          {/* 根据状态显示相应的时间信息 */}
          {repair.assigned_at && (
            <p><strong>分配时间:</strong> {repair.assigned_at}</p>
          )}
          {repair.completed_at && (
            <p><strong>完成时间:</strong> {repair.completed_at}</p>
          )}
          {repair.rejection_reason && (
            <p><strong>驳回原因:</strong> {repair.rejection_reason}</p>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div>
      <h2>我的报修</h2>
      <div>
        {repairOrders.map(renderRepairCard)}
      </div>
    </div>
  );
};

export default MyRepairs;