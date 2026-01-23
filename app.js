// app.js
App({
  // 全局数据
  globalData: {
    userInfo: null,
    token: null,
    subscriptionStatus: 0, // 0: 未订阅, 1: 已订阅
    baseUrl: 'https://api.example.com', // Mock API地址
    mockData: true // 是否使用模拟数据
  },

  // 小程序初始化
  onLaunch(options) {
    console.log('小程序初始化', options);
    
    // 检查更新
    this.checkUpdate();
    
    // 获取系统信息
    this.getSystemInfo();
    
   // 延迟检查更新，避免干扰初始化
   setTimeout(() => {
    this.checkUpdate();
  }, 1000)
  },

  onShow(options) {
    console.log('小程序显示', options);
  },

  onHide() {
    console.log('小程序隐藏');
  },

  onError(msg) {
    console.error('小程序错误:', msg);
  },

  // 检查小程序更新
  checkUpdate() {
    if (wx.getAccountInfoSync().miniProgram.envVersion === 'release') {
      if (wx.canIUse('getUpdateManager')) {
        const updateManager = wx.getUpdateManager();
        this.globalData.updateManager = updateManager;
        
        updateManager.onCheckForUpdate((res) => {
          console.log('检查更新结果', res.hasUpdate);
        });
        
        updateManager.onUpdateReady(() => {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: (res) => {
              if (res.confirm) {
                updateManager.applyUpdate();
              }
            }
          });
        });
        
        updateManager.onUpdateFailed(() => {
          console.log('更新失败');
        });
      }
    }
  },

  // 获取系统信息
  getSystemInfo() {
    try {
      const systemInfo = wx.getSystemInfoSync();
      this.globalData.systemInfo = systemInfo;
      console.log('系统信息', systemInfo);
    } catch (err) {
      console.error('获取系统信息失败', err);
    }
  },

  // 检查登录状态
  checkLogin() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    
    if (token && userInfo) {
      this.globalData.token = token;
      this.globalData.userInfo = userInfo;
    }
  },

  // 登录方法
  login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (loginRes) => {
          if (loginRes.code) {
            // 模拟登录成功
            const mockUserInfo = {
              id: 1,
              nickname: '咨询师张老师',
              avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
              phone: '13800138000',
              realName: '张三',
              email: 'zhangsan@example.com',
              role: 1,
              qualification: '国家二级心理咨询师'
            };
            
            // 保存到全局和本地存储
            this.globalData.userInfo = mockUserInfo;
            this.globalData.token = 'mock-token-' + Date.now();
            
            wx.setStorageSync('userInfo', mockUserInfo);
            wx.setStorageSync('token', this.globalData.token);
            
            resolve(mockUserInfo);
          } else {
            reject(new Error('登录失败'));
          }
        },
        fail: reject
      });
    });
  },

  // 登出方法
  logout() {
    this.globalData.userInfo = null;
    this.globalData.token = null;
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('token');
  },

  // 显示加载提示
  showLoading(title = '加载中...') {
    wx.showLoading({
      title: title,
      mask: true
    });
  },

  // 隐藏加载提示
  hideLoading() {
    wx.hideLoading();
  },

  // 显示成功提示
  showSuccess(title = '操作成功', duration = 1500) {
    wx.showToast({
      title: title,
      icon: 'success',
      duration: duration
    });
  },

  // 显示错误提示
  showError(title = '操作失败', duration = 2000) {
    wx.showToast({
      title: title,
      icon: 'error',
      duration: duration
    });
  },

  // 确认对话框
  showConfirm(content, title = '提示') {
    return new Promise((resolve) => {
      wx.showModal({
        title: title,
        content: content,
        success: (res) => {
          resolve(res.confirm);
        }
      });
    });
  }
});