// 维修工人任务状态枚举
export const TASK_STATUS = {
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

// 维修人员数据
export const REPAIRMEN = {
  1: { id: 1, name: '张师傅', phone: '13800138001', specialty: ['水管维修', '电路检修'] },
  2: { id: 2, name: '李师傅', phone: '13800138002', specialty: ['灯具维修', '门窗修复'] },
  3: { id: 3, name: '王师傅', phone: '13800138003', specialty: ['公共设施', '家具维修'] },
};

// 模拟维修工人任务数据
export const mockRepairmanTasks = [
  {
    id: 1,
    category: REPAIR_CATEGORIES.DORMITORY.value,
    location: '3栋502寝室',
    description: '卫生间水管接口处持续漏水，已经持续两天，地面有积水。',
    status: TASK_STATUS.PROCESSING.value,
    repairmanId: 1,
    studentID: '001',
    studentName: '张三',
    contactPhone: '13800138000',
    created_at: '2025-11-10 10:30:00',
    assigned_at: '2025-11-11 9:30:00',
    estimated_completion_time: '2025-11-12 18:00:00',
    completed_at: null,
    closed_at: null,
    priority: 'high',
    images: ['/images/repair1-1.jpg', '/images/repair1-2.jpg'],
    notes: '需要带防水胶带和替换接口',
    rating: null,
    feedback: null,
  },
  {
    id: 2,
    category: REPAIR_CATEGORIES.CLASSROOM.value,
    location: '教学楼A201',
    description: '教室前排左侧灯管闪烁不亮，影响上课视线。',
    status: TASK_STATUS.PENDING.value,
    repairmanId: 2,
    studentID: '002',
    studentName: '李四',
    contactPhone: '13800138001',
    created_at: '2025-11-11 10:30:00',
    assigned_at: null,
    estimated_completion_time: null,
    completed_at: null,
    closed_at: null,
    priority: 'medium',
    images: ['/images/repair2-1.jpg'],
    notes: '',
    rating: null,
    feedback: null,
  },
  {
    id: 3,
    category: REPAIR_CATEGORIES.PUBLIC_AREA.value,
    location: '5栋3楼走廊',
    description: '声控灯不灵敏，需要很大声音才会亮，晚上行走不便。',
    status: TASK_STATUS.COMPLETED.value,
    repairmanId: 3,
    studentID: '003',
    studentName: '王五',
    contactPhone: '13800138002',
    created_at: '2025-11-12 12:30:00',
    assigned_at: '2025-11-12 14:00:00',
    estimated_completion_time: '2025-11-13 12:00:00',
    completed_at: '2025-11-13 15:30:00',
    closed_at: null,
    priority: 'medium',
    images: ['/images/repair3-1.jpg'],
    notes: '已更换声控传感器',
    rating: 5,
    feedback: '维修很及时，师傅态度很好',
  },
  {
    id: 4,
    category: REPAIR_CATEGORIES.DORMITORY.value,
    location: '7栋312寝室',
    description: '宿舍空调制冷效果差，噪音大。',
    status: TASK_STATUS.TO_BE_EVALUATED.value,
    repairmanId: 1,
    studentID: '004',
    studentName: '赵六',
    contactPhone: '13800138003',
    created_at: '2025-11-13 09:15:00',
    assigned_at: '2025-11-13 10:00:00',
    estimated_completion_time: '2025-11-13 16:00:00',
    completed_at: '2025-11-13 15:00:00',
    closed_at: null,
    priority: 'high',
    images: ['/images/repair4-1.jpg'],
    notes: '清洗过滤网，添加制冷剂',
    rating: null,
    feedback: null,
  },
];

// 维修工人任务服务
export const mytaskService = {
  // 获取维修工人的所有任务
  getMyTasks: async (repairmanId, params = {}) => {
    // 过滤出当前维修工人的任务
    let data = mockRepairmanTasks.filter(task => task.repairmanId === parseInt(repairmanId));
    
    // 状态过滤
    if (params.status && params.status !== 'all') {
      data = data.filter(task => task.status === params.status);
    }
    
    // 分类过滤
    if (params.category && params.category !== 'all') {
      data = data.filter(task => task.category === params.category);
    }
    
    // 优先级过滤
    if (params.priority && params.priority !== 'all') {
      data = data.filter(task => task.priority === params.priority);
    }
    
    // 按状态排序：处理中 > 待受理 > 待评价 > 已完成 > 已关闭 > 已驳回
    const statusOrder = {
      [TASK_STATUS.PROCESSING.value]: 1,
      [TASK_STATUS.PENDING.value]: 2,
      [TASK_STATUS.TO_BE_EVALUATED.value]: 3,
      [TASK_STATUS.COMPLETED.value]: 4,
      [TASK_STATUS.CLOSED.value]: 5,
      [TASK_STATUS.REJECTED.value]: 6,
    };
    
    data.sort((a, b) => {
      // 先按状态排序
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return statusDiff;
      
      // 状态相同按优先级排序：高 > 中 > 低
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // 优先级相同按创建时间倒序
      return new Date(b.created_at) - new Date(a.created_at);
    });
    
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

  // 根据ID获取单个任务
  getTaskById: async (taskId, repairmanId) => {
    const task = mockRepairmanTasks.find(task => 
      task.id === parseInt(taskId) && task.repairmanId === parseInt(repairmanId)
    );
    if (!task) {
      throw new Error(`任务 ${taskId} 不存在或不属于当前维修工人`);
    }
    return task;
  },

  // 开始处理任务
  startTask: async (taskId, repairmanId, estimatedTime = null) => {
    const taskIndex = mockRepairmanTasks.findIndex(task => 
      task.id === parseInt(taskId) && task.repairmanId === parseInt(repairmanId)
    );
    
    if (taskIndex === -1) {
      throw new Error('任务不存在或不属于当前维修工人');
    }
    
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const updatedTask = {
      ...mockRepairmanTasks[taskIndex],
      status: TASK_STATUS.PROCESSING.value,
      assigned_at: mockRepairmanTasks[taskIndex].assigned_at || now,
      estimated_completion_time: estimatedTime,
    };
    
    mockRepairmanTasks[taskIndex] = updatedTask;
    return updatedTask;
  },

  // 完成任务
  completeTask: async (taskId, repairmanId, completionNotes = '') => {
    const taskIndex = mockRepairmanTasks.findIndex(task => 
      task.id === parseInt(taskId) && task.repairmanId === parseInt(repairmanId)
    );
    
    if (taskIndex === -1) {
      throw new Error('任务不存在或不属于当前维修工人');
    }
    
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const updatedTask = {
      ...mockRepairmanTasks[taskIndex],
      status: TASK_STATUS.TO_BE_EVALUATED.value,
      completed_at: now,
      notes: completionNotes || mockRepairmanTasks[taskIndex].notes,
    };
    
    mockRepairmanTasks[taskIndex] = updatedTask;
    return updatedTask;
  },

  // 更新任务备注
  updateTaskNotes: async (taskId, repairmanId, notes) => {
    const taskIndex = mockRepairmanTasks.findIndex(task => 
      task.id === parseInt(taskId) && task.repairmanId === parseInt(repairmanId)
    );
    
    if (taskIndex === -1) {
      throw new Error('任务不存在或不属于当前维修工人');
    }
    
    const updatedTask = {
      ...mockRepairmanTasks[taskIndex],
      notes,
    };
    
    mockRepairmanTasks[taskIndex] = updatedTask;
    return updatedTask;
  },

  // 获取维修工人的统计数据
  getRepairmanStats: async (repairmanId) => {
    const myTasks = mockRepairmanTasks.filter(task => task.repairmanId === parseInt(repairmanId));
    
    const stats = {
      total: myTasks.length,
      pending: myTasks.filter(task => task.status === TASK_STATUS.PENDING.value).length,
      processing: myTasks.filter(task => task.status === TASK_STATUS.PROCESSING.value).length,
      completed: myTasks.filter(task => task.status === TASK_STATUS.COMPLETED.value).length,
      to_be_evaluated: myTasks.filter(task => task.status === TASK_STATUS.TO_BE_EVALUATED.value).length,
      closed: myTasks.filter(task => task.status === TASK_STATUS.CLOSED.value).length,
      averageRating: 0,
    };
    
    // 计算平均评分
    const ratedTasks = myTasks.filter(task => task.rating !== null);
    if (ratedTasks.length > 0) {
      const totalRating = ratedTasks.reduce((sum, task) => sum + task.rating, 0);
      stats.averageRating = (totalRating / ratedTasks.length).toFixed(1);
    }
    
    return stats;
  },

  // 搜索任务
  searchMyTasks: async (repairmanId, filters = {}) => {
    let data = mockRepairmanTasks.filter(task => task.repairmanId === parseInt(repairmanId));
    
    // 按状态筛选
    if (filters.status && filters.status !== 'all') {
      data = data.filter(task => task.status === filters.status);
    }
    
    // 按分类筛选
    if (filters.category && filters.category !== 'all') {
      data = data.filter(task => task.category === filters.category);
    }
    
    // 按优先级筛选
    if (filters.priority && filters.priority !== 'all') {
      data = data.filter(task => task.priority === filters.priority);
    }
    
    // 按关键词搜索（在位置和问题描述中搜索）
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      data = data.filter(task => 
        task.location.toLowerCase().includes(keyword) ||
        task.description.toLowerCase().includes(keyword) ||
        (task.studentName && task.studentName.toLowerCase().includes(keyword))
      );
    }
    
    // 按日期范围筛选
    if (filters.startDate && filters.endDate) {
      data = data.filter(task => {
        const taskDate = new Date(task.created_at.split(' ')[0]);
        const start = new Date(filters.startDate);
        const end = new Date(filters.endDate);
        return taskDate >= start && taskDate <= end;
      });
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
export const mytaskUtils = {
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

  // 获取优先级信息
  getPriorityInfo: (priority) => {
    const priorityMap = {
      high: { label: '高', color: 'red' },
      medium: { label: '中', color: 'orange' },
      low: { label: '低', color: 'green' },
    };
    return priorityMap[priority] || { label: '未知', color: 'default' };
  },

  // 获取维修人员信息
  getRepairmanInfo: (repairmanId) => {
    return REPAIRMEN[repairmanId] || null;
  },

  // 计算任务耗时
  calculateTaskDuration: (task) => {
    if (!task.assigned_at) return null;
    
    const startTime = new Date(task.assigned_at);
    const endTime = task.completed_at ? new Date(task.completed_at) : new Date();
    const durationMs = endTime - startTime;
    
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}小时${minutes}分钟`;
    } else {
      return `${minutes}分钟`;
    }
  },

  // 检查任务是否超时
  isTaskOverdue: (task) => {
    if (!task.estimated_completion_time || task.completed_at) return false;
    
    const estimatedTime = new Date(task.estimated_completion_time);
    const currentTime = new Date();
    
    return currentTime > estimatedTime;
  },
};



// 后端 API 封装：保留 mock 数据不变，提供 fetch 调用接口
export const mytaskApi = {
  // 获取维修工人的任务列表
  async fetchMyTasks(repairmanId, params = {}) {
    const qs = new URLSearchParams(params).toString();
    const url = `/api/mytasks/${repairmanId}${qs ? `?${qs}` : ''}`;
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) throw new Error(`fetchMyTasks failed: ${res.status}`);
    return res.json();
  },

  async fetchTaskById(repairmanId, taskId) {
    const res = await fetch(`/api/mytasks/${repairmanId}/${taskId}`, { method: 'GET' });
    if (!res.ok) throw new Error(`fetchTaskById failed: ${res.status}`);
    return res.json();
  },

  async startTaskApi(repairmanId, taskId, estimatedTime = null) {
    const res = await fetch(`/api/mytasks/${repairmanId}/${taskId}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estimatedTime }),
    });
    if (!res.ok) throw new Error(`startTaskApi failed: ${res.status}`);
    return res.json();
  },

  async completeTaskApi(repairmanId, taskId, completionNotes = '') {
    const res = await fetch(`/api/mytasks/${repairmanId}/${taskId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completionNotes }),
    });
    if (!res.ok) throw new Error(`completeTaskApi failed: ${res.status}`);
    return res.json();
  },
};