/**
 * ChinaCNU WhatsApp 翻译助手 - 弹出窗口逻辑
 */

document.addEventListener('DOMContentLoaded', function() {
  const enableToggle = document.getElementById('enableToggle');
  const autoTranslateToggle = document.getElementById('autoTranslateToggle');
  const targetLanguageSelect = document.getElementById('targetLanguage');
  const saveBtn = document.getElementById('saveBtn');
  const statusDiv = document.getElementById('status');

  // 加载保存的设置
  function loadSettings() {
    chrome.storage.sync.get(['settings'], function(result) {
      const settings = result.settings || {
        enabled: true,
        autoTranslate: false,
        targetLanguage: 'zh-CN',
        showOriginal: true
      };

      enableToggle.checked = settings.enabled;
      autoTranslateToggle.checked = settings.autoTranslate;
      targetLanguageSelect.value = settings.targetLanguage;

      updateStatus(settings.enabled);
    });
  }

  // 更新状态显示
  function updateStatus(enabled) {
    if (enabled) {
      statusDiv.className = 'status active';
      statusDiv.innerHTML = '<div class="status-text">✓ 翻译功能已启用</div>';
    } else {
      statusDiv.className = 'status inactive';
      statusDiv.innerHTML = '<div class="status-text">✗ 翻译功能已禁用</div>';
    }
  }

  // 保存设置
  function saveSettings() {
    const settings = {
      enabled: enableToggle.checked,
      autoTranslate: autoTranslateToggle.checked,
      targetLanguage: targetLanguageSelect.value,
      showOriginal: true
    };

    chrome.storage.sync.set({ settings: settings }, function() {
      // 显示保存成功提示
      const originalText = saveBtn.textContent;
      saveBtn.textContent = '✓ 保存成功';
      saveBtn.style.background = '#4caf50';

      setTimeout(() => {
        saveBtn.textContent = originalText;
        saveBtn.style.background = '';
      }, 2000);

      // 通知content script更新设置
      chrome.tabs.query({ url: 'https://web.whatsapp.com/*' }, function(tabs) {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, {
            action: 'updateSettings',
            settings: settings
          });
        });
      });
    });

    updateStatus(settings.enabled);
  }

  // 事件监听器
  enableToggle.addEventListener('change', function() {
    updateStatus(this.checked);
  });

  saveBtn.addEventListener('click', saveSettings);

  // 按Enter键也可以保存
  document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      saveSettings();
    }
  });

  // 加载初始设置
  loadSettings();

  // 检查是否在WhatsApp Web页面
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs[0] && !tabs[0].url.includes('web.whatsapp.com')) {
      const infoBox = document.querySelector('.info-box');
      if (infoBox) {
        infoBox.innerHTML = `
          ⚠️ <strong>注意：</strong><br>
          请在 <a href="https://web.whatsapp.com" target="_blank" style="color: #667eea;">WhatsApp Web</a> 页面使用此插件
        `;
        infoBox.style.background = '#ffebee';
        infoBox.style.borderColor = '#f44336';
        infoBox.style.color = '#c62828';
      }
    }
  });
});
