var logManager = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null

module.exports = {
  debug() {
    if (!logManager) return
    logManager.debug.apply(logManager, arguments)
  },
  info() {
    if (!logManager) return
    logManager.info.apply(logManager, arguments)
  },
  warn() {
    if (!logManager) return
    logManager.warn.apply(logManager, arguments)
  },
  error() {
    if (!logManager) return
    logManager.error.apply(logManager, arguments)
  },
  setFilterMsg(msg) { // 从基础库2.7.3开始支持
    if (!logManager || !logManager.setFilterMsg) return
    if (typeof msg !== 'string') return
    logManager.setFilterMsg(msg)
  }
}