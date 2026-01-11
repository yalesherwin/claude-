/**
 * ChinaCNU WhatsApp 翻译助手 - 翻译API封装
 * 支持多种免费翻译API
 */

class TranslatorAPI {
  constructor() {
    this.apiType = 'google'; // 默认使用Google翻译
    this.apiEndpoints = {
      google: 'https://translate.googleapis.com/translate_a/single',
      mymemory: 'https://api.mymemory.translated.net/get'
    };
  }

  /**
   * 使用Google Translate免费API进行翻译
   */
  async translateWithGoogle(text, sourceLang, targetLang) {
    try {
      const url = `${this.apiEndpoints.google}?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data && data[0]) {
        let translatedText = '';
        data[0].forEach(item => {
          if (item[0]) {
            translatedText += item[0];
          }
        });
        return translatedText;
      }

      throw new Error('翻译失败');
    } catch (error) {
      console.error('Google翻译错误:', error);
      throw error;
    }
  }

  /**
   * 使用MyMemory免费API进行翻译
   */
  async translateWithMyMemory(text, sourceLang, targetLang) {
    try {
      const langPair = `${sourceLang}|${targetLang}`;
      const url = `${this.apiEndpoints.mymemory}?q=${encodeURIComponent(text)}&langpair=${langPair}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data && data.responseData && data.responseData.translatedText) {
        return data.responseData.translatedText;
      }

      throw new Error('翻译失败');
    } catch (error) {
      console.error('MyMemory翻译错误:', error);
      throw error;
    }
  }

  /**
   * 自动翻译（带重试机制）
   */
  async translate(text, sourceLang = 'auto', targetLang = 'zh-CN') {
    if (!text || text.trim() === '') {
      return '';
    }

    // 首先尝试Google翻译
    try {
      return await this.translateWithGoogle(text, sourceLang, targetLang);
    } catch (error) {
      console.warn('Google翻译失败，尝试MyMemory API');

      // 如果Google失败，尝试MyMemory
      try {
        // MyMemory不支持auto，需要指定源语言
        const srcLang = sourceLang === 'auto' ? 'en' : sourceLang;
        return await this.translateWithMyMemory(text, srcLang, targetLang);
      } catch (error2) {
        console.error('所有翻译API都失败了', error2);
        throw new Error('翻译服务暂时不可用');
      }
    }
  }

  /**
   * 检测语言
   */
  async detectLanguage(text) {
    try {
      const url = `${this.apiEndpoints.google}?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data && data[2]) {
        return data[2]; // 返回检测到的语言代码
      }

      return 'en'; // 默认返回英语
    } catch (error) {
      console.error('语言检测失败:', error);
      return 'en';
    }
  }

  /**
   * 批量翻译
   */
  async translateBatch(texts, sourceLang = 'auto', targetLang = 'zh-CN') {
    const promises = texts.map(text => this.translate(text, sourceLang, targetLang));
    return await Promise.all(promises);
  }
}

// 导出单例
const translatorAPI = new TranslatorAPI();

// 支持不同的模块系统
if (typeof module !== 'undefined' && module.exports) {
  module.exports = translatorAPI;
}
