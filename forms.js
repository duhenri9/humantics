// PRONTO PARA PRODUÇÃO - Módulo Forms HumanTic
// Integração com formulários externos e páginas de captura

/**
 * Abre formulário externo em nova aba
 * PRONTO PARA INTEGRAÇÃO COM TYPEFORM, GOOGLE FORMS, ETC.
 */
export function openForm(url) {
  console.log("[Forms] Abrindo formulário externo:", url);
  
  // Validação de URL
  if (!url || typeof url !== 'string') {
    console.error("[Forms] URL inválida fornecida:", url);
    return false;
  }
  
  // Verificação de protocolo de segurança
  const isValidUrl = url.startsWith('https://') || url.startsWith('http://');
  if (!isValidUrl) {
    console.error("[Forms] URL deve começar com http:// ou https://");
    return false;
  }
  
  try {
    // Abre formulário em nova aba
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    
    if (newWindow) {
      console.log("[Forms] Formulário aberto com sucesso em nova aba");
      
      // Log para analytics (pronto para integração)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_opened', {
          'form_url': url,
          'source': 'humanTic_external_forms'
        });
      }
      
      return true;
    } else {
      console.warn("[Forms] Pop-up bloqueado pelo navegador");
      return false;
    }
  } catch (error) {
    console.error("[Forms] Erro ao abrir formulário:", error);
    return false;
  }
}

/**
 * Abre formulário com parâmetros personalizados
 * PRONTO PARA TYPEFORM, JOTFORM, ETC.
 */
export function openFormWithParams(baseUrl, params = {}) {
  console.log("[Forms] Abrindo formulário com parâmetros:", { baseUrl, params });
  
  // Construir URL com parâmetros
  const url = new URL(baseUrl);
  Object.keys(params).forEach(key => {
    url.searchParams.append(key, params[key]);
  });
  
  const finalUrl = url.toString();
  console.log("[Forms] URL final construída:", finalUrl);
  
  return openForm(finalUrl);
}

/**
 * Configurações de formulários pré-definidos
 * PRONTO PARA PRODUÇÃO
 */
export const FORM_CONFIGS = {
  typeform: {
    base_url: 'https://humanTic.typeform.com',
    lead_capture: '/to/lead-capture',
    feedback: '/to/feedback-form',
    onboarding: '/to/client-onboarding'
  },
  google_forms: {
    base_url: 'https://docs.google.com/forms/d',
    // IDs dos formulários serão configurados em produção
  },
  jotform: {
    base_url: 'https://form.jotform.com',
    // IDs dos formulários serão configurados em produção
  }
};