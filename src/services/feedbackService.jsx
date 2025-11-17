// 模拟评价数据
export const mockFeedbacks = [
  {
    id: 1,
    repairOrderId: 1,
    studentId: '001',
    repairmanId: 1,
    rating: 5,
    comment: '张师傅非常专业，很快就找到了问题所在！',
    createdAt: '2025-11-16 14:20:00',
  },
  {
    id: 2,
    repairOrderId: 2,
    studentId: '002',
    repairmanId: 2,
    rating: 3,
    comment: '问题解决了，但是维修过程中弄脏了墙面。',
    createdAt: '2025-11-17 09:15:00',
  },
  {
    id: 3,
    repairOrderId: 3,
    studentId: '003',
    repairmanId: 3,
    rating: 4,
    comment: '',
    createdAt: '2025-11-18 16:45:00',
  },
  
];

// 评价服务方法
export const feedbackService = {
  // 获取所有评价
  getAllFeedbacks: async () => {
    return mockFeedbacks;
  },

  // 根据ID删除评价
  deleteFeedback: async (feedbackId) => {
    const index = mockFeedbacks.findIndex(feedback => feedback.id === feedbackId);
    if (index !== -1) {
      mockFeedbacks.splice(index, 1);
      return true;
    }
    return false;
  },

  // 获取维修人员信息
  getRepairmanInfo: (repairmanId) => {
    const repairmen = {
      1: { id: 1, name: '张师傅' },
      2: { id: 2, name: '李师傅' },
      3: { id: 3, name: '王师傅' },
      4: { id: 4, name: '赵师傅' },
    };
    return repairmen[repairmanId] || { id: repairmanId, name: '未知维修工' };
  },
};

// 后端 API 封装
export const feedbackApi = {
  async fetchAllFeedbacks() {
    const res = await fetch('/api/feedbacks', { method: 'GET' });
    if (!res.ok) throw new Error(`fetchAllFeedbacks failed: ${res.status}`);
    return res.json();
  },

  async deleteFeedbackApi(feedbackId) {
    const res = await fetch(`/api/feedbacks/${feedbackId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`deleteFeedbackApi failed: ${res.status}`);
    return res.json();
  },
};