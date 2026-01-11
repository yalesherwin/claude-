/**
 * ChinaCNU WhatsApp 翻译助手 - 后台服务
 */

// 安装和更新事件
chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === 'install') {
    // 首次安装
    console.log('ChinaCNU WhatsApp 翻译助手已安装');

    // 设置默认配置
    chrome.storage.sync.set({
      settings: {
        enabled: true,
        autoTranslate: false,
        targetLanguage: 'zh-CN',
        showOriginal: true
      }
    });

    // 打开欢迎页面
    chrome.tabs.create({
      url: 'https://web.whatsapp.com'
    });

  } else if (details.reason === 'update') {
    // 更新时
    console.log('ChinaCNU WhatsApp 翻译助手已更新到版本', chrome.runtime.getManifest().version);
  }
});

// 监听来自content script的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'translate') {
    // 处理翻译请求（如果需要在后台处理）
    handleTranslation(request.text, request.sourceLang, request.targetLang)
      .then(result => {
        sendResponse({ success: true, translation: result });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });

    return true; // 保持消息通道打开
  }
});

/**
 * 处理翻译请求
 */
async function handleTranslation(text, sourceLang = 'auto', targetLang = 'zh-CN') {
  try {
    // 这里可以实现更复杂的翻译逻辑
    // 例如：缓存、批量处理等

    // 由于Manifest V3的限制，实际翻译在content script中进行
    return text;
  } catch (error) {
    console.error('翻译处理错误:', error);
    throw error;
  }
}

// 监听标签页更新，自动刷新WhatsApp Web标签页
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('web.whatsapp.com')) {
    console.log('WhatsApp Web 页面已加载');
  }
});

// 保持service worker活跃
chrome.runtime.onStartup.addListener(function() {
  console.log('ChinaCNU WhatsApp 翻译助手后台服务已启动');
});

// 右键菜单（可选功能）
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: 'chinacnu-translate',
    title: 'ChinaCNU 翻译选中文本',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === 'chinacnu-translate' && info.selectionText) {
    // 发送消息到content script进行翻译
    chrome.tabs.sendMessage(tab.id, {
      action: 'translateSelection',
      text: info.selectionText
    });
  }
});
