// src/components/DataAnalysis.jsx
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Tag, Spin, Space } from 'antd';
import { Pie, Column } from '@ant-design/charts';
import { statisticsService } from '../services/statisticsService';

const DataAnalysis = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [ratingData, setRatingData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 加载所有统计数据
  const loadStatistics = async () => {
    setLoading(true);
    try {
      const [categoryStats, locationStats, ratingStats] = await Promise.all([
        statisticsService.getRepairCategoryStats(),
        statisticsService.getLocationRepairStats(),
        statisticsService.getRepairmanRatingStats(),
      ]);

      setCategoryData(categoryStats);
      setLocationData(locationStats);
      setRatingData(ratingStats);
    } catch (error) {
      console.error('加载统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatistics();
  }, []);

  // 饼图配置 - 报修分类占比
  const pieChartConfig = {
    data: categoryData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
    legend: {
      position: 'bottom',
    },
    height: 300,
  };

  // 柱状图配置 - 具体位置报修数量排行
  const columnChartConfig = {
    data: locationData,
    xField: 'location',
    yField: 'count',
    seriesField: 'location',
    color: ({ location }) => {
      const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#fa541c', '#13c2c2', '#eb2f96'];
      return colors[locationData.findIndex(item => item.location === location) % colors.length];
    },
    label: {
      position: 'top',
      style: {
        fill: '#000',
      },
    },
    xAxis: {
      label: {
        autoRotate: false,
      },
    },
    height: 300,
  };

  // 表格列定义 - 维修人员评分排行
  const ratingColumns = [
    {
      title: '排名',
      key: 'rank',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: '维修人员',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: '平均评分',
      dataIndex: 'rating',
      key: 'rating',
      width: 100,
      render: (rating) => (
        <Tag color={rating >= 4.8 ? 'green' : rating >= 4.5 ? 'blue' : 'orange'}>
          {rating} 分
        </Tag>
      ),
    },
    {
      title: '完成工单数',
      dataIndex: 'completedOrders',
      key: 'completedOrders',
      width: 100,
      render: (count) => `${count} 单`,
    },
    {
      title: '评级',
      key: 'level',
      width: 80,
      render: (record) => {
        if (record.rating >= 4.8) return <Tag color="green">优秀</Tag>;
        if (record.rating >= 4.5) return <Tag color="blue">良好</Tag>;
        return <Tag color="orange">一般</Tag>;
      },
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>正在加载统计数据...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px' }}>
      <h2>数据统计与分析</h2>
      
      <Row gutter={[16, 16]}>
        {/* 饼图 - 报修分类占比 */}
        <Col xs={24} md={12} lg={8}>
          <Card title="报修分类占比" bordered={false}>
            <Pie {...pieChartConfig} />
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <p>总计: {categoryData.reduce((sum, item) => sum + item.value, 0)} 次报修</p>
            </div>
          </Card>
        </Col>

        {/* 柱状图 - 具体位置报修数量排行 */}
        <Col xs={24} md={12} lg={8}>
          <Card title="位置报修数量排行" bordered={false}>
            <Column {...columnChartConfig} />
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <p>前8个位置报修数量统计</p>
            </div>
          </Card>
        </Col>

        {/* 表格 - 维修人员平均评分排行 */}
        <Col xs={24} md={24} lg={8}>
          <Card title="维修人员评分排行" bordered={false}>
            <Table
              dataSource={ratingData}
              columns={ratingColumns}
              pagination={false}
              size="small"
              rowKey="id"
            />
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <p>基于用户评价计算的平均分</p>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 统计摘要 */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} sm={8}>
          <Card size="small" title="总报修数" bordered={false}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}>
              {categoryData.reduce((sum, item) => sum + item.value, 0)}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small" title="平均处理时间" bordered={false}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}>
              2.3 天
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small" title="用户满意度" bordered={false}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}>
              94.5%
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DataAnalysis;