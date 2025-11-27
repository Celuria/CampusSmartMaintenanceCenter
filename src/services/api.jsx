// src/Services/api.jsx

// ⚠️ 配置你的后端地址
const BASE_URL = "/api"; // 如果配置了 proxy，直接写 /api 即可；否则写完整地址如 http://localhost:8080/api

/**
 * 通用请求处理函数
 * @param {string} endpoint - 接口地址，例如 '/login'
 * @param {object} options - fetch 配置项
 */
const request = async (endpoint, options = {}) => {
  // 1. 获取 Token
  const token = localStorage.getItem("token");

  // 2. 组装 Headers
  const headers = { ...options.headers };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // 3. 处理 Content-Type
  // 如果 body 是 FormData (用于上传文件)，浏览器会自动设置 Content-Type，不要手动设置
  // 如果不是 FormData 且没有设置 Content-Type，默认设为 application/json
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  // 4. 发起请求
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // 5. 统一错误处理
  if (!response.ok) {
    let errorMessage = `请求失败: ${response.status}`;

    // 检查响应内容类型
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        console.warn("无法解析 JSON 错误响应:", e);
      }
    } else {
      // 如果不是 JSON，尝试读取文本
      try {
        const text = await response.text();
        console.warn("非 JSON 响应:", text.substring(0, 100));
        errorMessage = `服务器返回了非 JSON 数据 (${response.status})`;
      } catch (e) {
        console.warn("无法读取错误响应文本:", e);
      }
    }

    // 401 未授权处理 (Token过期)
    if (response.status === 401) {
      console.warn("Token 已过期或无效");
      // 可选: 自动跳转登录页
      // window.location.href = '/login';
    }

    throw new Error(errorMessage);
  }

  // 6. 检查响应内容类型，如果不是 JSON 则抛出错误
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    console.warn("API 返回了非 JSON 数据:", text.substring(0, 200));
    throw new SyntaxError("服务器返回了非 JSON 数据");
  }

  // 7. 返回 JSON 数据
  return response.json();
};

/**
 * 辅助函数：将对象转换为查询字符串
 * 例如: { status: 'pending', page: 1 } => ?status=pending&page=1
 */
const toQueryString = (params) => {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    if (
      params[key] !== undefined &&
      params[key] !== null &&
      params[key] !== ""
    ) {
      searchParams.append(key, params[key]);
    }
  });
  const str = searchParams.toString();
  return str ? `?${str}` : "";
};

// ============================================================================
// 📦 API 接口导出
// ============================================================================

const api = {
  // --------------------------------------------------------------------------
  // 登录/鉴权 & 用户信息 (User & Auth)
  // --------------------------------------------------------------------------
  auth: {
    /**
     * 登录
     * @param {string} username
     * @param {string} password
     */
    login: (username, password) =>
      request("/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      }),

    /** 获取当前登录用户信息 */
    getMe: () => request("/users/me"),

    /**
     * 更新个人信息（含头像上传）
     * @param {FormData} formData - 必须包含字段 + avatar文件
     */
    updateMe: (formData) =>
      request("/users/me", {
        method: "PUT",
        body: formData, // 直接传 FormData，request 函数会自动处理 Header
      }),
  },

  // --------------------------------------------------------------------------
  // 学生端 (Student)
  // --------------------------------------------------------------------------
  student: {
    /**
     * 创建报修工单（含图片上传）
     * @param {FormData} formData - { title, category, location, description, priority, contactPhone, images: [file] }
     */
    createOrder: (formData) =>
      request("/repair-orders", {
        method: "POST",
        body: formData,
      }),

    /**
     * 获取我的报修列表
     * @param {object} params - { status, category, priority, keyword, page }
     */
    getMyOrders: (params) =>
      request(`/repair-orders/my${toQueryString(params)}`),

    /** 获取单个报修详情 */
    getOrderDetail: (id) => request(`/repair-orders/${id}`),

    /** 删除报修（仅 pending 状态可删） */
    deleteOrder: (id) =>
      request(`/repair-orders/${id}`, {
        method: "DELETE",
      }),

    /**
     * 提交评价（完成后的工单）
     * @param {string} id - 工单ID
     * @param {object} data - { rating: 1-5, feedback: string }
     */
    evaluateOrder: (id, data) =>
      request(`/repair-orders/${id}/evaluate`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  // --------------------------------------------------------------------------
  // 🔧 维修工端 (Repairman)
  // --------------------------------------------------------------------------
  repairman: {
    /**
     * 获取我的任务列表
     * @param {object} params - { status, category, priority, keyword, page }
     */
    getMyTasks: (params) => request(`/tasks/my${toQueryString(params)}`),

    /**
     * 开始处理任务
     * @param {string} id
     * @param {string} estimatedCompletionTime - 预计完成时间 (可选)
     */
    startTask: (id, estimatedCompletionTime) =>
      request(`/tasks/${id}/start`, {
        method: "POST",
        body: JSON.stringify({
          estimated_completion_time: estimatedCompletionTime,
        }),
      }),

    /**
     * 完成任务
     * @param {string} id
     * @param {string} notes - 维修备注
     */
    completeTask: (id, notes) =>
      request(`/tasks/${id}/complete`, {
        method: "POST",
        body: JSON.stringify({ notes }),
      }),

    /** 获取任务详情 */
    getTaskDetail: (id) => request(`/tasks/${id}`),
  },

  // --------------------------------------------------------------------------
  // 🛡️ 管理员端 (Admin)
  // --------------------------------------------------------------------------
  admin: {
    // --- 工单管理 ---

    /**
     * 全局工单列表（搜索+筛选）
     * @param {object} params - { status, category, priority, keyword, page }
     */
    getAllOrders: (params) =>
      request(`/admin/repair-orders${toQueryString(params)}`),

    /**
     * 分配维修人员
     * @param {string} orderId
     * @param {string} repairmanId
     */
    assignOrder: (orderId, repairmanId) =>
      request(`/admin/repair-orders/${orderId}/assign`, {
        method: "POST",
        body: JSON.stringify({ repairmanId }),
      }),

    /**
     * 驳回工单
     * @param {string} orderId
     * @param {string} reason
     */
    rejectOrder: (orderId, reason) =>
      request(`/admin/repair-orders/${orderId}/reject`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      }),

    // --- 用户管理 ---

    /** 获取学生账号列表 */
    getStudents: (params) =>
      request(`/admin/users/students${toQueryString(params)}`),

    /** 获取维修工账号列表 */
    getRepairmen: (params) =>
      request(`/admin/users/repairmen${toQueryString(params)}`),

    /**
     * 编辑用户（目前只改手机号）
     * @param {string} id
     * @param {string} phone
     */
    updateUser: (id, phone) =>
      request(`/admin/users/${id}`, {
        method: "PUT",
        body: JSON.stringify({ phone }),
      }),

    /** 重置密码 */
    resetPassword: (id) =>
      request(`/admin/users/${id}/reset-password`, {
        method: "POST",
      }),

    // --- 评价管理 ---

    /** 获取所有评价列表 */
    getAllFeedbacks: (params) =>
      request(`/admin/feedbacks${toQueryString(params)}`),

    /** 删除评价 */
    deleteFeedback: (id) =>
      request(`/admin/feedbacks/${id}`, {
        method: "DELETE",
      }),

    // --- 数据统计 ---

    /** 报修分类统计 */
    getStatsCategory: () => request("/admin/stats/category"),

    /** 位置报修数量排行 */
    getStatsLocation: () => request("/admin/stats/location"),

    /** 维修人员评分排行 */
    getStatsRepairmanRating: () => request("/admin/stats/repairman-rating"),
  },

  // --------------------------------------------------------------------------
  // ☁️ 公共 (Common)
  // --------------------------------------------------------------------------
  common: {
    /**
     * 图片上传（独立上传接口）
     * 注意：如果是在创建工单时直接传图片，使用 student.createOrder 即可，无需单独调用此接口
     * @param {File[]} files - 文件对象数组
     */
    uploadImages: (files) => {
      const formData = new FormData();
      // 假设后端接受 files[] 数组
      if (Array.isArray(files)) {
        files.forEach((file) => formData.append("files[]", file));
      } else {
        formData.append("files[]", files);
      }

      return request("/upload/images", {
        method: "POST",
        body: formData,
      });
    },
  },
};

export default api;
