// 工单状态枚举
export const REPAIR_STATUS = {
  PENDING: { value: 'pending', label: '待受理', color: 'orange' },
  PROCESSING: { value: 'processing', label: '处理中', color: 'blue' },
  COMPLETED: { value: 'completed', label: '已完成', color: 'green' },
  TO_BE_EVALUATED: { value: 'to_be_evaluated', label: '待评价', color: 'purple' },
  CLOSED: { value: 'closed', label: '已关闭', color: 'default' },
  REJECTED: { value: 'rejected', label: '已驳回', color: 'red' },
};

// 报修分类枚举
export const REPAIR_CATEGORIES = {
  DORMITORY: { value: 'dormitory', label: '宿舍' },
  CLASSROOM: { value: 'classroom', label: '教室' },
  PUBLIC_AREA: { value: 'public_area', label: '公共区域' },
};

// 模拟维修人员数据
export const REPAIRMEN = {
  1: { id: 1, name: '张师傅' },
  2: { id: 2, name: '李师傅' },
  3: { id: 3, name: '王师傅' },
};

// 模拟工单数据 - 使用你提供的数据结构
export const mockRepairOrders = [
  {
    id: 1,
    category: REPAIR_CATEGORIES.DORMITORY.value,
    location: '3栋502寝室',
    description: '卫生间水管接口处持续漏水，已经持续两天，地面有积水。',
    status: REPAIR_STATUS.PROCESSING.value,
    repairmanId: 1,
    studentID: '001',
    created_at: '2025-11-10 10:30:00',
    rejection_reason: null,
    assigned_at: '2025-11-11 9:30:00',
    completed_at: null,
    closed_at: null,
  },
  {
    id: 2,
    category: REPAIR_CATEGORIES.CLASSROOM.value,
    location: '教学楼A201',
    description: '教室前排左侧灯管闪烁不亮，影响上课视线。',
    status: REPAIR_STATUS.PENDING.value,
    repairmanId: 2,
    studentID: '002',
    created_at: '2025-11-11 10:30:00',
    rejection_reason: null,
    assigned_at: null,
    completed_at: null,
    closed_at: null,
  },
  {
    id: 3,
    category: REPAIR_CATEGORIES.PUBLIC_AREA.value,
    location: '5栋3楼走廊',
    description: '声控灯不灵敏，需要很大声音才会亮，晚上行走不便。',
    status: REPAIR_STATUS.COMPLETED.value,
    repairmanId: 3,
    studentID: '003',
    created_at: '2025-11-12 12:30:00',
    rejection_reason: null,
    assigned_at: '2025-11-12 14:00:00',
    completed_at: '2025-11-13 15:30:00',
    closed_at: null,
  },
];

// 数据服务方法
export const repairService = {
  // 获取所有工单
  getRepairOrders: async (params = {}) => {
    // 简单的过滤和分页逻辑
    let data = [...mockRepairOrders];
    
    // 状态过滤
    if (params.status) {
      data = data.filter(order => order.status === params.status);
    }
    
    // 分类过滤
    if (params.category) {
      data = data.filter(order => order.category === params.category);
    }
    
    // 模拟分页
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = data.slice(startIndex, endIndex);
    
    return {
      data: paginatedData,
      total: data.length,
      page,
      pageSize,
    };
  },

  // 根据ID获取单个工单
  getRepairOrderById: async (id) => {
    const order = mockRepairOrders.find(order => order.id === parseInt(id));
    if (!order) {
      throw new Error(`工单 ${id} 不存在`);
    }
    return order;
  },

  // 创建新工单
  createRepairOrder: async (orderData) => {
    const newId = Math.max(...mockRepairOrders.map(o => o.id)) + 1;
    const newOrder = {
      id: newId,
      ...orderData,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: REPAIR_STATUS.PENDING.value,
      rejection_reason: null,
      assigned_at: null,
      completed_at: null,
      closed_at: null,
    };
    mockRepairOrders.push(newOrder);
    return newOrder;
  },

  // 更新工单状态
  updateRepairOrderStatus: async (id, status, repairmanId = null) => {
    const orderIndex = mockRepairOrders.findIndex(order => order.id === parseInt(id));
    if (orderIndex === -1) {
      throw new Error('工单不存在');
    }
    
    const updatedOrder = {
      ...mockRepairOrders[orderIndex],
      status,
      repairmanId,
    };
    
    // 根据状态更新相应的时间字段
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    if (status === REPAIR_STATUS.PROCESSING.value && !updatedOrder.assigned_at) {
      updatedOrder.assigned_at = now;
    } else if (status === REPAIR_STATUS.COMPLETED.value && !updatedOrder.completed_at) {
      updatedOrder.completed_at = now;
    }
    
    mockRepairOrders[orderIndex] = updatedOrder;
    return updatedOrder;
  },

  // 获取维修人员列表
  getRepairmen: async () => {
    return Object.values(REPAIRMEN);
  },
};

// 工具函数
export const repairUtils = {
  // 获取状态信息
  getStatusInfo: (status) => {
    const statusMap = {
      pending: { label: '待受理', color: 'orange' },
      processing: { label: '处理中', color: 'blue' },
      completed: { label: '已完成', color: 'green' },
      to_be_evaluated: { label: '待评价', color: 'purple' },
      closed: { label: '已关闭', color: 'default' },
      rejected: { label: '已驳回', color: 'red' },
    };
    return statusMap[status] || { label: status, color: 'default' };
  },

  // 获取分类信息
  getCategoryInfo: (category) => {
    const categoryMap = {
      dormitory: { label: '宿舍' },
      classroom: { label: '教室' },
      public_area: { label: '公共区域' },
    };
    return categoryMap[category] || { label: category };
  },

  // 获取维修人员信息
  getRepairmanInfo: (repairmanId) => {
    const repairmen = {
      1: { id: 1, name: '张师傅' },
      2: { id: 2, name: '李师傅' },
      3: { id: 3, name: '王师傅' },
    };
    return repairmen[repairmanId] || null;
  },
};