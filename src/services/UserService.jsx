// src/services/userService.js
export const userService = {
  // 获取学生账号列表
  getStudentAccounts: async () => {
    return [
      { 
        id: '20210001', 
        nickname: '张三', 
        phone: '13800138001'
      },
      { 
        id: '20210002', 
        nickname: '李四', 
        phone: '13800138002'
      },
      { 
        id: '20210003', 
        nickname: '王五', 
        phone: '13800138003'
      },
      { 
        id: '20210004', 
        nickname: '赵六', 
        phone: '13800138004'
      },
      { 
        id: '20210005', 
        nickname: '钱七', 
        phone: '13800138005'
      },
      { 
        id: '20210006', 
        nickname: '孙八', 
        phone: '13800138006'
      }
    ];
  },

  // 获取维修人员账号列表
  getRepairmanAccounts: async () => {
    return [
      { 
        id: 'worker001', 
        nickname: '张师傅', 
        phone: '13900139001'
      },
      { 
        id: 'worker002', 
        nickname: '李师傅', 
        phone: '13900139002'
      },
      { 
        id: 'worker003', 
        nickname: '王师傅', 
        phone: '13900139003'
      },
      { 
        id: 'worker004', 
        nickname: '赵师傅', 
        phone: '13900139004'
      }
    ];
  },
};