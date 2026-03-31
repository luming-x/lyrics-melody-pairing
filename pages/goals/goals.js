// pages/goals/goals.js
const app = getApp()

Page({
  data: {
    dailyGoal: 1, // 每日创作目标（作品数）
    weeklyGoal: 5, // 每周创作目标（作品数）
    monthlyGoal: 20, // 每月创作目标（作品数）
    
    // 当前进度
    todayCompleted: 0,
    weekCompleted: 0,
    monthCompleted: 0,
    
    // 目标类型
    goalTypes: ['作品数', '歌词段数', '创作时长(分钟)'],
    selectedGoalType: '作品数',
    
    // 历史记录
    dailyHistory: [],
    weeklyHistory: [],
    
    // 提醒设置
    enableReminder: false,
    reminderTime: '20:00',
    
    // 成就系统
    achievements: [],
    unlockedAchievements: [],
    
    // 连续创作天数
    streakDays: 0,
    currentStreak: 0
  },

  onLoad() {
    this.loadGoals()
    this.loadProgress()
    this.loadAchievements()
    this.checkDailyReset()
  },

  onShow() {
    this.loadProgress()
  },

  // 检查每日重置
  checkDailyReset() {
    const lastDate = wx.getStorageSync('lastCheckDate')
    const today = new Date().toDateString()
    
    if (lastDate !== today) {
      // 新的一天，重置每日进度
      this.setData({
        todayCompleted: 0
      })
      wx.setStorageSync('lastCheckDate', today)
      
      // 检查是否连续创作
      this.checkStreak()
    }
    
    // 检查每周重置（周一重置）
    const lastWeek = wx.getStorageSync('lastCheckWeek')
    const thisWeek = this.getCurrentWeek()
    
    if (lastWeek !== thisWeek) {
      this.setData({
        weekCompleted: 0
      })
      wx.setStorageSync('lastCheckWeek', thisWeek)
    }
    
    // 检查每月重置（每月1号重置）
    const lastMonth = wx.getStorageSync('lastCheckMonth')
    const thisMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
    
    if (lastMonth !== thisMonth) {
      this.setData({
        monthCompleted: 0
      })
      wx.setStorageSync('lastCheckMonth', thisMonth)
    }
  },

  // 获取当前周
  getCurrentWeek() {
    const now = new Date()
    const year = now.getFullYear()
    const week = this.getWeekNumber(now)
    return `${year}-W${week}`
  },

  // 获取周数
  getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  },

  // 加载目标设置
  loadGoals() {
    const goals = wx.getStorageSync('creationGoals') || {
      dailyGoal: 1,
      weeklyGoal: 5,
      monthlyGoal: 20,
      selectedGoalType: '作品数',
      enableReminder: false,
      reminderTime: '20:00'
    }
    this.setData(goals)
    
    // 加载连续天数记录
    const currentStreak = wx.getStorageSync('currentStreak') || 0
    const streakDays = wx.getStorageSync('streakDays') || 0
    this.setData({
      currentStreak,
      streakDays
    })
  },

  // 保存目标设置
  saveGoals() {
    const goals = {
      dailyGoal: this.data.dailyGoal,
      weeklyGoal: this.data.weeklyGoal,
      monthlyGoal: this.data.monthlyGoal,
      selectedGoalType: this.data.selectedGoalType,
      enableReminder: this.data.enableReminder,
      reminderTime: this.data.reminderTime
    }
    wx.setStorageSync('creationGoals', goals)
    
    wx.showToast({
      title: '保存成功',
      icon: 'success'
    })
  },

  // 加载进度
  loadProgress() {
    if (!app.globalData.envId || !wx.cloud) {
      return
    }

    const db = wx.cloud.database()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // 加载今日作品数
    db.collection('works')
      .where({
        createdAt: db.command.gte(today.getTime())
      })
      .count()
      .then(res => {
        this.setData({
          todayCompleted: res.total
        })
        this.checkAchievements()
      })
    
    // 加载本周作品数
    const weekStart = new Date(today)
    const dayOfWeek = weekStart.getDay()
    weekStart.setDate(weekStart.getDate() - dayOfWeek)
    
    db.collection('works')
      .where({
        createdAt: db.command.gte(weekStart.getTime())
      })
      .count()
      .then(res => {
        this.setData({
          weekCompleted: res.total
        })
      })
    
    // 加载本月作品数
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    
    db.collection('works')
      .where({
        createdAt: db.command.gte(monthStart.getTime())
      })
      .count()
      .then(res => {
        this.setData({
          monthCompleted: res.total
        })
      })
  },

  // 检查连续创作天数
  checkStreak() {
    if (!app.globalData.envId || !wx.cloud) {
      return
    }

    const db = wx.cloud.database()
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    // 检查昨天是否有创作
    db.collection('works')
      .where({
        createdAt: db.command.gte(yesterday.setHours(0, 0, 0, 0)).and(
          db.command.lte(yesterday.setHours(23, 59, 59, 999))
        )
      })
      .count()
      .then(res => {
        if (res.total > 0) {
          // 昨天有创作，连续天数+1
          const streak = this.data.currentStreak + 1
          this.setData({
            currentStreak: streak,
            streakDays: Math.max(this.data.streakDays, streak)
          })
        } else {
          // 昨天没有创作，连续天数重置
          this.setData({
            currentStreak: 0
          })
        }
        
        wx.setStorageSync('currentStreak', this.data.currentStreak)
        wx.setStorageSync('streakDays', this.data.streakDays)
      })
  },

  // 加载成就
  loadAchievements() {
    const achievements = [
      { id: 1, icon: '🎯', title: '初出茅庐', description: '完成第一个创作目标', condition: 'daily', value: 1 },
      { id: 2, icon: '🔥', title: '热情创作', description: '连续3天完成目标', condition: 'streak', value: 3 },
      { id: 3, icon: '⚡', title: '高效创作', description: '一天内完成3个作品', condition: 'daily', value: 3 },
      { id: 4, icon: '🌟', title: '星光闪耀', description: '连续7天完成目标', condition: 'streak', value: 7 },
      { id: 5, icon: '🏆', title: '周冠军', description: '一周内完成10个作品', condition: 'weekly', value: 10 },
      { id: 6, icon: '💎', title: '月度达人', description: '一月内完成30个作品', condition: 'monthly', value: 30 },
      { id: 7, icon: '👑', title: '创作之王', description: '连续30天完成目标', condition: 'streak', value: 30 },
      { id: 8, icon: '🎨', title: '风格多样', description: '使用3种以上模板创作', condition: 'template', value: 3 }
    ]
    
    this.setData({ achievements })
  },

  // 检查成就解锁
  checkAchievements() {
    const unlocked = wx.getStorageSync('unlockedAchievements') || []
    const newUnlocked = []
    
    this.data.achievements.forEach(achievement => {
      if (unlocked.includes(achievement.id)) {
        return // 已解锁
      }
      
      let isUnlocked = false
      
      switch (achievement.condition) {
        case 'daily':
          isUnlocked = this.data.todayCompleted >= achievement.value
          break
        case 'weekly':
          isUnlocked = this.data.weekCompleted >= achievement.value
          break
        case 'monthly':
          isUnlocked = this.data.monthCompleted >= achievement.value
          break
        case 'streak':
          isUnlocked = this.data.currentStreak >= achievement.value
          break
      }
      
      if (isUnlocked) {
        newUnlocked.push(achievement)
        unlocked.push(achievement.id)
      }
    })
    
    this.setData({ unlockedAchievements: unlocked })
    wx.setStorageSync('unlockedAchievements', unlocked)
    
    // 显示新解锁的成就
    if (newUnlocked.length > 0) {
      newUnlocked.forEach((achievement, index) => {
        setTimeout(() => {
          wx.showModal({
            title: '🎉 成就解锁！',
            content: `${achievement.icon} ${achievement.title}\n${achievement.description}`,
            showCancel: false,
            confirmText: '太棒了'
          })
        }, index * 2000)
      })
    }
  },

  // 目标值调整
  onDailyGoalChange(e) {
    this.setData({ dailyGoal: parseInt(e.detail.value) })
  },

  onWeeklyGoalChange(e) {
    this.setData({ weeklyGoal: parseInt(e.detail.value) })
  },

  onMonthlyGoalChange(e) {
    this.setData({ monthlyGoal: parseInt(e.detail.value) })
  },

  // 目标类型选择
  onGoalTypeChange(e) {
    this.setData({ selectedGoalType: this.data.goalTypes[e.detail.value] })
  },

  // 提醒时间
  onReminderTimeChange(e) {
    this.setData({ reminderTime: e.detail.value })
  },

  // 开启提醒
  toggleReminder() {
    this.setData({ enableReminder: !this.data.enableReminder })
    
    if (this.data.enableReminder) {
      // 设置提醒
      wx.showModal({
        title: '提醒设置',
        content: `将在每天${this.data.reminderTime}提醒您完成创作目标`,
        success: (res) => {
          if (!res.confirm) {
            this.setData({ enableReminder: false })
          }
        }
      })
    }
  },

  // 计算进度百分比
  calculateProgress(completed, goal) {
    const percentage = Math.min((completed / goal) * 100, 100)
    return Math.round(percentage)
  },

  // 查看成就详情
  viewAchievement(e) {
    const achievement = e.currentTarget.dataset.achievement
    const isUnlocked = this.data.unlockedAchievements.includes(achievement.id)
    
    wx.showModal({
      title: achievement.title,
      content: `${achievement.icon}\n${achievement.description}\n\n状态：${isUnlocked ? '✅ 已解锁' : '🔒 未解锁'}`,
      showCancel: false,
      confirmText: '关闭'
    })
  },

  // 保存按钮
  onSaveGoals() {
    this.saveGoals()
  }
})
