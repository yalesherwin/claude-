/**
 * ChinaCNU WhatsApp 翻译助手 - 内容脚本
 * 注入到WhatsApp Web页面，提供翻译功能
 */

(function() {
  'use strict';

  let settings = {
    enabled: true,
    autoTranslate: false,
    targetLanguage: 'zh-CN',
    showOriginal: true
  };

  // 加载设置
  chrome.storage.sync.get(['settings'], function(result) {
    if (result.settings) {
      settings = { ...settings, ...result.settings };
    }
  });

  // 监听设置变化
  chrome.storage.onChanged.addListener(function(changes) {
    if (changes.settings) {
      settings = { ...settings, ...changes.settings.newValue };
    }
  });

  /**
   * 创建翻译按钮
   */
  function createTranslateButton() {
    const button = document.createElement('button');
    button.className = 'chinacnu-translate-btn';
    button.innerHTML = '🌐';
    button.title = 'ChinaCNU 翻译';
    return button;
  }

  /**
   * 创建翻译结果显示元素
   */
  function createTranslationDisplay(translatedText) {
    const div = document.createElement('div');
    div.className = 'chinacnu-translation';
    div.innerHTML = `
      <div class="chinacnu-translation-header">
        <span class="chinacnu-brand">ChinaCNU翻译</span>
        <button class="chinacnu-close-btn">×</button>
      </div>
      <div class="chinacnu-translation-text">${escapeHtml(translatedText)}</div>
    `;
    return div;
  }

  /**
   * HTML转义
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * 获取消息文本内容
   */
  function getMessageText(messageElement) {
    // WhatsApp Web的消息文本选择器可能会变化，这里提供几种常见的选择器
    const selectors = [
      '.selectable-text.copyable-text',
      '[class*="copyable-text"]',
      'span.selectable-text',
      '.message-in .selectable-text',
      '.message-out .selectable-text'
    ];

    for (const selector of selectors) {
      const textElement = messageElement.querySelector(selector);
      if (textElement && textElement.textContent.trim()) {
        return textElement.textContent.trim();
      }
    }

    return null;
  }

  /**
   * 翻译消息
   */
  async function translateMessage(messageElement, text) {
    try {
      // 显示加载状态
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'chinacnu-translation chinacnu-loading';
      loadingDiv.textContent = '翻译中...';
      messageElement.appendChild(loadingDiv);

      // 调用翻译API
      const translatedText = await translatorAPI.translate(text, 'auto', settings.targetLanguage);

      // 移除加载状态
      loadingDiv.remove();

      // 显示翻译结果
      const translationDisplay = createTranslationDisplay(translatedText);
      messageElement.appendChild(translationDisplay);

      // 添加关闭按钮事件
      const closeBtn = translationDisplay.querySelector('.chinacnu-close-btn');
      closeBtn.addEventListener('click', () => {
        translationDisplay.remove();
      });

    } catch (error) {
      console.error('翻译失败:', error);

      // 显示错误信息
      const errorDiv = document.createElement('div');
      errorDiv.className = 'chinacnu-translation chinacnu-error';
      errorDiv.textContent = '翻译失败，请稍后重试';
      messageElement.appendChild(errorDiv);

      setTimeout(() => {
        errorDiv.remove();
      }, 3000);
    }
  }

  /**
   * 处理单个消息元素
   */
  function processMessage(messageElement) {
    // 避免重复处理
    if (messageElement.hasAttribute('data-chinacnu-processed')) {
      return;
    }
    messageElement.setAttribute('data-chinacnu-processed', 'true');

    const text = getMessageText(messageElement);
    if (!text) {
      return;
    }

    // 如果开启了自动翻译
    if (settings.autoTranslate && settings.enabled) {
      translateMessage(messageElement, text);
      return;
    }

    // 添加翻译按钮
    const translateBtn = createTranslateButton();
    translateBtn.addEventListener('click', (e) => {
      e.stopPropagation();

      // 检查是否已经翻译过
      const existingTranslation = messageElement.querySelector('.chinacnu-translation');
      if (existingTranslation) {
        existingTranslation.remove();
      } else {
        translateMessage(messageElement, text);
      }
    });

    // 将按钮添加到消息元素
    messageElement.style.position = 'relative';
    messageElement.appendChild(translateBtn);
  }

  /**
   * 观察DOM变化，处理新消息
   */
  function observeMessages() {
    const observer = new MutationObserver((mutations) => {
      if (!settings.enabled) {
        return;
      }

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // WhatsApp Web的消息容器选择器
            if (node.matches && (node.matches('[class*="message-"]') || node.matches('.message-in, .message-out'))) {
              processMessage(node);
            }

            // 处理子元素中的消息
            const messages = node.querySelectorAll && node.querySelectorAll('[class*="message-"], .message-in, .message-out');
            if (messages) {
              messages.forEach(processMessage);
            }
          }
        });
      });
    });

    // 开始观察
    const targetNode = document.body;
    observer.observe(targetNode, {
      childList: true,
      subtree: true
    });

    // 处理已存在的消息
    const existingMessages = document.querySelectorAll('[class*="message-"], .message-in, .message-out');
    existingMessages.forEach(processMessage);
  }

  /**
   * 初始化
   */
  function init() {
    // 等待WhatsApp Web加载完成
    const checkWhatsAppLoaded = setInterval(() => {
      // 检查WhatsApp Web的主容器是否存在
      const mainContainer = document.querySelector('#app, [class*="app"]');
      if (mainContainer) {
        clearInterval(checkWhatsAppLoaded);

        console.log('ChinaCNU WhatsApp 翻译助手已启动');

        // 开始观察消息
        setTimeout(() => {
          observeMessages();
        }, 2000); // 延迟2秒确保页面完全加载
      }
    }, 1000);

    // 30秒后停止检查
    setTimeout(() => {
      clearInterval(checkWhatsAppLoaded);
    }, 30000);
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 监听来自popup的消息
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggleTranslation') {
      settings.enabled = !settings.enabled;
      sendResponse({ enabled: settings.enabled });
    } else if (request.action === 'updateSettings') {
      settings = { ...settings, ...request.settings };
      sendResponse({ success: true });
    }
  });

})();
