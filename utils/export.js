// 导出功能工具类
const app = getApp()

class ExportUtil {
  // 导出为 TXT 文本
  static exportToTxt(work) {
    if (!work) return null

    const { title, theme, tags, notes, lyrics, createdAt } = work

    let content = '═══════════════════════════════════════════════════════════════════\n'
    content += `                        ${title}\n`
    content += '═══════════════════════════════════════════════════════════════════\n\n'

    if (theme) {
      content += `创作主题：${theme}\n`
    }

    if (tags && tags.length > 0) {
      content += `标签：${tags.join('、')}\n`
    }

    if (notes) {
      content += `创作笔记：\n${notes}\n`
    }

    content += `创作时间：${new Date(createdAt).toLocaleString()}\n\n`
    content += '───────────────────────────────────────────────────────────────\n\n'

    // 歌词和旋律
    const sectionTypes = ['主歌', '副歌', '桥段', '前奏', '间奏', '结尾']

    lyrics.forEach((item, index) => {
      const type = sectionTypes[item.typeIndex] || '其他'
      content += `[${index + 1}. ${type}]\n\n`
      content += `歌词：\n${item.content || '(无歌词)'}\n\n`

      if (item.melodyUrl) {
        content += `旋律：已录制 ✓\n`
        content += `音频链接：${item.melodyUrl}\n`
      } else {
        content += `旋律：未录制 ✗\n`
      }

      content += '───────────────────────────────────────────────────────────────\n\n'
    })

    content += '\n═══════════════════════════════════════════════════════════════════\n'
    content += '                      歌词旋律配对工具\n'
    content += '═══════════════════════════════════════════════════════════════════\n'

    return content
  }

  // 保存为 TXT 文件
  static async saveAsTxt(work) {
    try {
      const content = this.exportToTxt(work)
      const fileName = `${work.title}_${Date.now()}.txt`

      wx.setStorageSync('export_content', content)
      wx.setStorageSync('export_filename', fileName)

      wx.showModal({
        title: '导出成功',
        content: '歌词内容已复制到剪贴板，请在备忘录或其他应用中粘贴保存',
        showCancel: false,
        success: () => {
          wx.setClipboardData({
            data: content
          })
        }
      })

      return true
    } catch (err) {
      console.error('导出失败', err)
      wx.showToast({
        title: '导出失败',
        icon: 'none'
      })
      return false
    }
  }

  // 导出为 JSON 格式（用于备份）
  static exportToJson(work) {
    if (!work) return null

    return JSON.stringify(work, null, 2)
  }

  // 保存为 JSON 文件
  static async saveAsJson(work) {
    try {
      const content = this.exportToJson(work)

      wx.showModal({
        title: '导出 JSON',
        content: 'JSON 数据已复制到剪贴板，可以在其他应用中保存',
        showCancel: false,
        success: () => {
          wx.setClipboardData({
            data: content
          })
        }
      })

      return true
    } catch (err) {
      console.error('导出失败', err)
      wx.showToast({
        title: '导出失败',
        icon: 'none'
      })
      return false
    }
  }

  // 导出音频列表
  static async exportAudioList(work) {
    if (!work || !work.lyrics) return []

    const audioList = []
    work.lyrics.forEach((item, index) => {
      if (item.melodyUrl) {
        audioList.push({
          index: index + 1,
          type: ['主歌', '副歌', '桥段', '前奏', '间奏', '结尾'][item.typeIndex],
          url: item.melodyUrl
        })
      }
    })

    return audioList
  }

  // 生成分享文本
  static generateShareText(work) {
    if (!work) return ''

    const { title, lyrics, tags } = work
    const lyricSample = lyrics && lyrics.length > 0 ? lyrics[0].content : ''

    let text = `「${title}」\n\n`

    if (tags && tags.length > 0) {
      text += `标签：${tags.join('、')}\n\n`
    }

    text += `歌词片段：\n${lyricSample.substring(0, 100)}${lyricSample.length > 100 ? '...' : ''}\n\n`

    text += `— 歌词旋律配对工具`

    return text
  }

  // 复制分享文本
  static copyShareText(work) {
    const text = this.generateShareText(work)

    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({
          title: '已复制分享文本',
          icon: 'success'
        })
      }
    })
  }
}

module.exports = ExportUtil
