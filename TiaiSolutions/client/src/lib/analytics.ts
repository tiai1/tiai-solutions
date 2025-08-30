import { api } from './api';

export function trackEvent(eventName: string, properties: Record<string, any> = {}) {
  // Track user interactions for analytics
  api.lead({
    source: 'analytics',
    payload: {
      event: eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }
    }
  }).catch(error => {
    console.debug('Analytics tracking failed:', error);
  });
}

export function trackPageView(page: string) {
  trackEvent('page_view', { page });
}

export function trackButtonClick(buttonName: string, section?: string) {
  trackEvent('button_click', { button: buttonName, section });
}

export function trackFormSubmission(formName: string, success: boolean) {
  trackEvent('form_submission', { form: formName, success });
}

export function trackDownload(templateName: string) {
  trackEvent('template_download', { template: templateName });
}
