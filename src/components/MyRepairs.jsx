// src/components/MyRepairs.jsx
import React from 'react';
import { Table, Tag } from 'antd';
import { repairUtils } from '../services/repairService';

const MyRepairs = ({ repairOrders, loading }) => {
  // 表格列定义
  const columns = [
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
  ];

  return (
    <div>
      <h2>我的报修</h2>
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
        scroll={{ x: 800 }}
        locale={{ emptyText: '暂无报修记录' }}
      />
    </div>
  );
};

export default MyRepairs;