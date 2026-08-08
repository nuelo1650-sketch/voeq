export const WHATSAPP_TEMPLATES = {
  general_inquiry: (vars: { vendorName: string; listingTitle?: string }) =>
    `Hi! I found you on Voeq${vars.listingTitle ? ` and I'm interested in "${vars.listingTitle}"` : ''}. Is it still available?`,

  price_inquiry: (vars: { vendorName: string; listingTitle: string; price: string }) =>
    `Hi ${vars.vendorName}! I saw "${vars.listingTitle}" on Voeq for ${vars.price}. Is the price still negotiable?`,

  availability: (vars: { vendorName: string; listingTitle: string; date: string }) =>
    `Hi ${vars.vendorName}! I want to know if "${vars.listingTitle}" is available on ${vars.date}. Thanks!`,

  order: (vars: { vendorName: string; listingTitle: string; quantity: number }) =>
    `Hi ${vars.vendorName}! I'd like to order ${vars.quantity} of "${vars.listingTitle}" from Voeq. How do I proceed?`,

  custom: (vars: { message: string }) => vars.message,
};

export type WhatsAppTemplateKey = keyof typeof WHATSAPP_TEMPLATES;
