// 工单状态枚举
export const REPAIR_STATUS = {
  PENDING: { value: "pending", label: "待受理", color: "orange" },
  PROCESSING: { value: "processing", label: "处理中", color: "blue" },
  COMPLETED: { value: "completed", label: "已完成", color: "green" },
  TO_BE_EVALUATED: {value: "to_be_evaluated",label: "待评价", color: "purple"},
  CLOSED: { value: "closed", label: "已关闭", color: "default" },
  REJECTED: { value: "rejected", label: "已驳回", color: "red" },
};

// 报修分类枚举
export const REPAIR_CATEGORIES = {
  waterAndElectricity: { value: "水电维修", label: "水电维修" },
  networkIssues: { value: "网络故障", label: "网络故障" },
  furnitureRepair: { value: "家具维修", label: "家具维修" },
  applianceIssues: { value: "电器故障", label: "电器故障" },
  publicFacilities: { value: "公共设施", label: "公共设施" },
};

// 模拟维修人员数据
export const REPAIRMEN = {
  1: { id: 1, name: "张师傅" },
  2: { id: 2, name: "李师傅" },
  3: { id: 3, name: "王师傅" },
};


//11.18添加紧急程度类型
export const priority_LEVELS = {
  LOW: { value: "low", label: "一般", color: "blue" },
  MEDIUM: { value: "medium", label: "较紧急", color: "orange" },
  HIGH: { value: "high", label: "紧急", color: "red" },
};


// 模拟工单数据 - 使用你提供的数据结构
export const mockRepairOrders = [
  {
    id: 1,
    title: "卫生间漏水",
    category: 'waterAndElectricity',
    location: "3栋502寝室",
    description: "卫生间水管接口处持续漏水，已经持续两天，地面有积水。",
    status: REPAIR_STATUS.CLOSED.value,
    repairmanId: 1,
    studentID: "001",
    studentName: "张三",
    contactPhone: "13800138000",
    priority: "high", // 添加紧急程度
    created_at: "2025-11-10 10:30:00",
    rejection_reason: null,
    assigned_at: "2025-11-11 9:30:00",
    completed_at: null,
    closed_at: null,
    repairNotes: null,
    processNotes: null,
  },
  {
    id: 2,
    title: "教室灯管故障",
    category: 'networkIssues',
    location: "教学楼A201",
    description: "教室前排左侧灯管闪烁不亮，影响上课视线。",
    status: REPAIR_STATUS.PENDING.value,
    repairmanId: 2,
    studentID: "001",
    studentName: "张三",
    contactPhone: "13800138001",
    priority: "low", // 添加紧急程度
    created_at: "2025-11-11 10:30:00",
    rejection_reason: null,
    assigned_at: null,
    completed_at: null,
    closed_at: null,
    repairNotes: null,
    processNotes: null,
  },
  {
    id: 3,
    title: "声控灯故障",
    category: 'publicFacilities',
    location: "5栋3楼走廊",
    description: "声控灯不灵敏，需要很大声音才会亮，晚上行走不便。",
    status: REPAIR_STATUS.COMPLETED.value,
    repairmanId: 3,
    studentID: "001",
    studentName: "张三",
    contactPhone: "13800138002",
    priority: "high", // 添加紧急程度
    created_at: "2025-11-12 12:30:00",
    rejection_reason: null,
    assigned_at: "2025-11-12 14:00:00",
    completed_at: "2025-11-13 15:30:00",
    closed_at: null,
    repairNotes: "维修师傅已检查，需要更换零件，预计明天完成维修。",
    processNotes: "已联系学生，安排明天更换零件。",
  },
  {
    id: 4,
    title: "=w=",
    category: 'furnitureRepair',
    location: "123",
    description: "456",
    status: REPAIR_STATUS.TO_BE_EVALUATED.value,
    repairmanId: 3,
    studentID: "001",
    studentName: "张三",
    contactPhone: "13800138002",
    priority: "medium", // 添加紧急程度
    created_at: "2025-11-12 12:30:00",
    rejection_reason: null,
    assigned_at: "2025-11-12 14:00:00",
    completed_at: "2025-11-13 15:30:00",
    closed_at: null,
    repairNotes: "789",
    processNotes: "012",
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
      data = data.filter((order) => order.status === params.status);
    }

    // 分类过滤
    if (params.category) {
      data = data.filter((order) => order.category === params.category);
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
    const order = mockRepairOrders.find((order) => order.id === parseInt(id));
    if (!order) {
      throw new Error(`工单 ${id} 不存在`);
    }
    return order;
  },

  // 创建新工单
  createRepairOrder: async (orderData) => {
    const newId = Math.max(...mockRepairOrders.map((o) => o.id)) + 1;
    const newOrder = {
      id: newId,
      ...orderData,
      priority: orderData.priority || "low",
      created_at: new Date().toISOString().replace("T", " ").substring(0, 19),
      status: REPAIR_STATUS.PENDING.value,
      rejection_reason: null,
      assigned_at: null,
      completed_at: null,
      closed_at: null,
      images: orderData.images || [], // 保存图片数据
    };
    mockRepairOrders.unshift(newOrder);
    return newOrder;
  },

  // 更新工单状态
  updateRepairOrderStatus: async (id, status, repairmanId = null) => {
    const orderIndex = mockRepairOrders.findIndex(
      (order) => order.id === parseInt(id)
    );
    if (orderIndex === -1) {
      throw new Error("工单不存在");
    }

    const updatedOrder = {
      ...mockRepairOrders[orderIndex],
      status,
      repairmanId,
    };

    // 根据状态更新相应的时间字段
    const now = new Date().toISOString().replace("T", " ").substring(0, 19);
    if (
      status === REPAIR_STATUS.PROCESSING.value &&
      !updatedOrder.assigned_at
    ) {
      updatedOrder.assigned_at = now;
    } else if (
      status === REPAIR_STATUS.COMPLETED.value &&
      !updatedOrder.completed_at
    ) {
      updatedOrder.completed_at = now;
    }

    mockRepairOrders[orderIndex] = updatedOrder;
    return updatedOrder;
  },

  // 获取维修人员列表
  getRepairmen: async () => {
    return Object.values(REPAIRMEN);
  },

  // 分配维修人员
  assignRepairman: async (orderId, repairmanId) => {
    const orderIndex = mockRepairOrders.findIndex(
      (order) => order.id === parseInt(orderId)
    );
    if (orderIndex === -1) {
      throw new Error("工单不存在");
    }

    const now = new Date().toISOString().replace("T", " ").substring(0, 19);
    mockRepairOrders[orderIndex].repairmanId = repairmanId;
    mockRepairOrders[orderIndex].status = "processing";
    mockRepairOrders[orderIndex].assigned_at = now;
    mockRepairOrders[orderIndex].updatedAt = now;

    return mockRepairOrders[orderIndex];
  },

  // 驳回工单
  rejectRepairOrder: async (orderId, reason) => {
    const orderIndex = mockRepairOrders.findIndex(
      (order) => order.id === parseInt(orderId)
    );
    if (orderIndex === -1) {
      throw new Error("工单不存在");
    }

    const now = new Date().toISOString().replace("T", " ").substring(0, 19);
    mockRepairOrders[orderIndex].status = "rejected";
    mockRepairOrders[orderIndex].rejection_reason = reason;
    mockRepairOrders[orderIndex].updatedAt = now;

    return mockRepairOrders[orderIndex];
  },

  // 搜索工单
  searchRepairOrders: async (filters = {}) => {
    let data = [...mockRepairOrders];

    // 按状态筛选
    if (filters.status && filters.status !== "all") {
      data = data.filter((order) => order.status === filters.status);
    }

    // 按分类筛选
    if (filters.category && filters.category !== "all") {
      data = data.filter((order) => order.category === filters.category);
    }

    // 按关键词搜索（在位置和问题描述中搜索）
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      data = data.filter(
        (order) =>
          order.location.toLowerCase().includes(keyword) ||
          order.description.toLowerCase().includes(keyword)
      );
    }

    // 模拟分页
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return {
      data: data.slice(startIndex, endIndex),
      total: data.length,
      page,
      pageSize,
    };
  },
};

// 工具函数
export const repairUtils = {
  // 获取状态信息
  getStatusInfo: (status) => {
    const statusMap = {
      pending: { label: "待受理", color: "orange" },
      processing: { label: "处理中", color: "blue" },
      completed: { label: "已完成", color: "green" },
      to_be_evaluated: { label: "待评价", color: "purple" },
      closed: { label: "已关闭", color: "default" },
      rejected: { label: "已驳回", color: "red" },
    };
    return statusMap[status] || { label: status, color: "default" };
  },

  // 获取分类信息
  getCategoryInfo: (category) => {
    const categoryMap = {
      waterAndElectricity: { value: "水电维修", label: "水电维修" },
      networkIssues: { value: "网络故障", label: "网络故障" },
      furnitureRepair: { value: "家具维修", label: "家具维修" },
      applianceIssues: { value: "电器故障", label: "电器故障" },
      publicFacilities: { value: "公共设施", label: "公共设施" },
    };
    return categoryMap[category] || { label: category };
  },

  // 获取维修人员信息
  getRepairmanInfo: (repairmanId) => {
    const repairmen = {
      1: { id: 1, name: "张师傅" },
      2: { id: 2, name: "李师傅" },
      3: { id: 3, name: "王师傅" },
    };
    return repairmen[repairmanId] || null;
  },

  // 11.18获取紧急程度信息
  getpriorityInfo: (priority) => {
    const priorityMap = {
      low: { label: "低", color: "blue" },
      medium: { label: "中", color: "orange" },
      high: { label: "高", color: "red" },
    };
    return priorityMap[priority] || { label: priority, color: "default" };
  },
};

// HTTP API 替代/补充接口：不修改现有静态数据，提供调用后端 REST API 的封装函数
export const repairApi = {
  // 查询工单列表：params 会被转为查询字符串
  async fetchRepairOrders(params = {}) {
    const qs = new URLSearchParams(params).toString();
    const url = `/api/repairOrders${qs ? `?${qs}` : ""}`;
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) throw new Error(`fetchRepairOrders failed: ${res.status}`);
    return res.json();
  },

  // 根据 ID 获取单个工单
  async fetchRepairOrderById(id) {
    const res = await fetch(`/api/repairOrders/${id}`, { method: "GET" });
    if (!res.ok) throw new Error(`fetchRepairOrderById failed: ${res.status}`);
    return res.json();
  },

  // 分配维修人员到工单
  async assignRepairmanApi(orderId, repairmanId) {
    const res = await fetch(`/api/repairOrders/${orderId}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repairmanId }),
    });
    if (!res.ok) throw new Error(`assignRepairmanApi failed: ${res.status}`);
    return res.json();
  },

  // 驳回工单
  async rejectRepairOrderApi(orderId, reason) {
    const res = await fetch(`/api/repairOrders/${orderId}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    if (!res.ok) throw new Error(`rejectRepairOrderApi failed: ${res.status}`);
    return res.json();
  },
};
