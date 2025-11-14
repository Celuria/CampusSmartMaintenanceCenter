// src/services/statisticsService.js

// 模拟统计数据
export const statisticsService = {
  // 获取报修分类占比数据
  getRepairCategoryStats: async () => {
    return [
      { type: '宿舍', value: 65 },
      { type: '教室', value: 20 },
      { type: '公共区域', value: 15 },
    ];
  },

  // 获取具体位置报修数量排行
  getLocationRepairStats: async () => {
    return [
      { location: '3栋', count: 28 },
      { location: '5栋', count: 22 },
      { location: '教学楼A', count: 18 },
      { location: '8栋', count: 15 },
      { location: '2栋', count: 12 },
      { location: '图书馆', count: 8 },
      { location: '体育馆', count: 5 },
      { location: '食堂', count: 3 },
    ];
  },

  // 获取维修人员平均评分排行
  getRepairmanRatingStats: async () => {
    return [
      { id: 'worker001', name: '张师傅', rating: 4.9, completedOrders: 45 },
      { id: 'worker003', name: '王师傅', rating: 4.8, completedOrders: 38 },
      { id: 'worker002', name: '李师傅', rating: 4.7, completedOrders: 42 },
      { id: 'worker004', name: '赵师傅', rating: 4.6, completedOrders: 35 },
      { id: 'worker005', name: '钱师傅', rating: 4.5, completedOrders: 28 },
    ];
  },
};