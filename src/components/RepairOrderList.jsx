// src/components/RepairOrderList.jsx
import React from 'react';
import { Table, Tag } from 'antd';
import { repairUtils } from '../services/repairService';

const RepairOrderList = ({ repairOrders, loading }) => {
  // 表格列定义
  const columns = [
    {
      title: '工单ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
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
      title: '维修人员',
      dataIndex: 'repairmanId',
      key: 'repairmanId',
      width: 100,
      render: (repairmanId) => {
        const repairman = repairUtils.getRepairmanInfo(repairmanId);
        return repairman ? repairman.name : '未分配';
      },
    },
    {
      title: '提交人学号',
      dataIndex: 'studentID',
      key: 'studentID',
      width: 120,
    },
    {
      title: '提交时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
    },
  ];

  return (
    <div>
      <h2>工单管理</h2>
      <Table
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
      />
    </div>
  );
};

export default RepairOrderList;