// utils/cloud-manager.js

class CloudManager {
  constructor() {
    this.db = null
    this.storage = null
    this.initialized = false
  }

  // 初始化云开发
  async init() {
    if (this.initialized) {
      return true
    }

    try {
      if (!wx.cloud) {
        console.error('云开发SDK未加载')
        return false
      }

      const app = getApp()
      if (!app.globalData.envId) {
        console.warn('未配置云环境ID')
        return false
      }

      wx.cloud.init({
        env: app.globalData.envId,
        traceUser: true
      })

      this.db = wx.cloud.database()
      this.storage = wx.cloud
      this.initialized = true

      return true
    } catch (err) {
      console.error('云开发初始化失败:', err)
      return false
    }
  }

  // 数据库操作
  async getCollection(collectionName, options = {}) {
    await this.init()

    try {
      const { limit = 20, orderBy, order = 'desc', where = {} } = options

      let query = this.db.collection(collectionName)

      if (where && Object.keys(where).length > 0) {
        query = query.where(where)
      }

      if (orderBy) {
        query = query.orderBy(orderBy, order)
      }

      if (limit) {
        query = query.limit(limit)
      }

      const result = await query.get()
      return {
        success: true,
        data: result.data,
        total: result.data.length
      }
    } catch (err) {
      console.error('查询失败:', err)
      return {
        success: false,
        error: err.message,
        data: []
      }
    }
  }

  async addDocument(collectionName, data) {
    await this.init()

    try {
      const result = await this.db.collection(collectionName).add({
        data: {
          ...data,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      })

      return {
        success: true,
        id: result._id
      }
    } catch (err) {
      console.error('添加失败:', err)
      return {
        success: false,
        error: err.message
      }
    }
  }

  async updateDocument(collectionName, docId, data) {
    await this.init()

    try {
      const result = await this.db.collection(collectionName).doc(docId).update({
        data: {
          ...data,
          updatedAt: Date.now()
        }
      })

      return {
        success: true
      }
    } catch (err) {
      console.error('更新失败:', err)
      return {
        success: false,
        error: err.message
      }
    }
  }

  async deleteDocument(collectionName, docId) {
    await this.init()

    try {
      await this.db.collection(collectionName).doc(docId).remove()

      return {
        success: true
      }
    } catch (err) {
      console.error('删除失败:', err)
      return {
        success: false,
        error: err.message
      }
    }
  }

  // 文件上传
  async uploadFile(filePath, cloudPath, onProgress) {
    await this.init()

    try {
      return new Promise((resolve, reject) => {
        const uploadTask = wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: (res) => {
            resolve({
              success: true,
              fileID: res.fileID
            })
          },
          fail: (err) => {
            reject({
              success: false,
              error: err.message
            })
          }
        })

        if (onProgress && typeof onProgress === 'function') {
          uploadTask.onProgressUpdate((res) => {
            onProgress(res.progress, res.totalBytesSent, res.totalBytesExpectedToSend)
          })
        }
      })
    } catch (err) {
      return {
        success: false,
        error: err.message
      }
    }
  }

  // 文件删除
  async deleteFile(fileID) {
    await this.init()

    try {
      await this.storage.deleteFile({
        fileList: [fileID]
      })

      return {
        success: true
      }
    } catch (err) {
      console.error('删除文件失败:', err)
      return {
        success: false,
        error: err.message
      }
    }
  }

  // 批量删除文件
  async deleteFiles(fileIDs) {
    await this.init()

    try {
      await this.storage.deleteFile({
        fileList: fileIDs
      })

      return {
        success: true,
        deleted: fileIDs.length
      }
    } catch (err) {
      console.error('批量删除失败:', err)
      return {
        success: false,
        error: err.message
      }
    }
  }

  // 获取文件下载链接
  async getTempFileURL(fileID) {
    await this.init()

    try {
      const result = await this.storage.getTempFileURL({
        fileList: [fileID]
      })

      return {
        success: true,
        tempFileURL: result.fileList[0].tempFileURL
      }
    } catch (err) {
      console.error('获取临时链接失败:', err)
      return {
        success: false,
        error: err.message
      }
    }
  }

  // 数据同步
  async syncData(collectionName, localData, localKey = '_id') {
    await this.init()

    try {
      // 获取云端最新数据
      const cloudData = await this.getCollection(collectionName)

      if (!cloudData.success) {
        return {
          success: false,
          error: cloudData.error
        }
      }

      // 同步逻辑：本地 -> 云端
      const syncResults = {
        added: 0,
        updated: 0,
        skipped: 0,
        errors: []
      }

      for (const localItem of localData) {
        const cloudItem = cloudData.data.find(
          item => item[localKey] === localItem[localKey]
        )

        if (cloudItem) {
          // 更新云端数据
          if (localItem.updatedAt > (cloudItem.updatedAt || 0)) {
            await this.updateDocument(collectionName, cloudItem._id, localItem)
            syncResults.updated++
          } else {
            syncResults.skipped++
          }
        } else {
          // 添加新数据到云端
          await this.addDocument(collectionName, localItem)
          syncResults.added++
        }
      }

      return {
        success: true,
        ...syncResults
      }
    } catch (err) {
      console.error('同步失败:', err)
      return {
        success: false,
        error: err.message
      }
    }
  }

  // 批量操作
  async batchOperation(operations) {
    await this.init()

    try {
      const results = []

      for (const op of operations) {
        let result

        switch (op.type) {
          case 'add':
            result = await this.addDocument(op.collection, op.data)
            break
          case 'update':
            result = await this.updateDocument(op.collection, op.docId, op.data)
            break
          case 'delete':
            result = await this.deleteDocument(op.collection, op.docId)
            break
          default:
            result = { success: false, error: '未知操作类型' }
        }

        results.push({
          ...op,
          result
        })
      }

      return {
        success: true,
        results
      }
    } catch (err) {
      console.error('批量操作失败:', err)
      return {
        success: false,
        error: err.message
      }
    }
  }

  // 统计信息
  async getCollectionStats(collectionName) {
    await this.init()

    try {
      const result = await this.db.collection(collectionName).count()

      return {
        success: true,
        total: result.total
      }
    } catch (err) {
      console.error('获取统计信息失败:', err)
      return {
        success: false,
        error: err.message,
        total: 0
      }
    }
  }

  // 云函数调用
  async callFunction(name, data) {
    await this.init()

    try {
      const result = await wx.cloud.callFunction({
        name,
        data
      })

      return {
        success: true,
        result: result.result
      }
    } catch (err) {
      console.error('调用云函数失败:', err)
      return {
        success: false,
        error: err.message
      }
    }
  }
}

// 导出单例
const cloudManager = new CloudManager()

module.exports = cloudManager
