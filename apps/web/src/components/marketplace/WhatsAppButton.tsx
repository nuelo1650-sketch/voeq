'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/icons';
import { trackWhatsAppClick, generateWhatsAppMessage } from '@/lib/marketplace-client';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

interface WhatsAppButtonProps {
  vendorId: string;
  vendorName: string;
  vendorPhone: string;
  listingId?: string;
  listingTitle?: string;
  listingPrice?: string;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  className?: string;
}

const PREFERENCE_KEY = 'voeq_whatsapp_confirmed';

export function WhatsAppButton({
  vendorId,
  vendorName,
  vendorPhone,
  listingId,
  listingTitle,
  listingPrice,
  variant = 'primary',
  fullWidth,
  className,
}: WhatsAppButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('general_inquiry');
  const [customMessage, setCustomMessage] = useState('');
  const [availabilityDate, setAvailabilityDate] = useState('');
  const [orderQuantity, setOrderQuantity] = useState(1);

  const handleClick = async () => {
    const confirmed = typeof window !== 'undefined' && localStorage.getItem(PREFERENCE_KEY) === 'true';
    if (!confirmed) {
      setShowModal(true);
      return;
    }
    await sendMessage('general_inquiry');
  };

  const sendMessage = async (template: string) => {
    setLoading(true);
    try {
      const params: Parameters<typeof generateWhatsAppMessage>[0] = { template, vendorName };
      if (listingTitle) params.listingTitle = listingTitle;
      if (template === 'price_inquiry' && listingPrice) params.price = listingPrice;
      if (template === 'availability') params.date = availabilityDate;
      if (template === 'order') params.quantity = orderQuantity;
      if (template === 'custom') params.customMessage = customMessage;

      const { message } = await generateWhatsAppMessage(params);
      await trackWhatsAppClick({ vendorId, listingId }).catch(() => null);
      localStorage.setItem(PREFERENCE_KEY, 'true');

      const phone = vendorPhone.replace(/[^\d]/g, '');
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      setShowModal(false);
    } catch (error) {
      console.error('Failed to send WhatsApp', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        onClick={handleClick}
        isLoading={loading}
        fullWidth={fullWidth}
        leftIcon={<WhatsAppIcon className="h-5 w-5" />}
        className={className}
      >
        Chat on WhatsApp
      </Button>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`Message ${vendorName}`}>
        <div className="p-6 space-y-4">
          <p className="text-sm text-forest-700/80 dark:text-cream-100/80">
            Choose a message template. We&apos;ll open WhatsApp with your message pre-filled.
          </p>

          <div className="space-y-2">
            {[
              { key: 'general_inquiry', label: 'General inquiry', description: 'Ask if it\'s still available' },
              { key: 'price_inquiry', label: 'Price negotiation', description: 'Ask about the price' },
              { key: 'availability', label: 'Check availability', description: 'Ask for specific date' },
              { key: 'order', label: 'Place an order', description: 'Order a specific quantity' },
              { key: 'custom', label: 'Custom message', description: 'Write your own' },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setSelectedTemplate(t.key)}
                className={`w-full rounded-lg border-2 p-3 text-left transition ${
                  selectedTemplate === t.key
                    ? 'border-forest-700 bg-forest-700/5 dark:border-gold-500'
                    : 'border-cream-300 hover:border-forest-700/30 dark:border-forest-700'
                }`}
              >
                <p className="text-sm font-medium text-forest-900 dark:text-cream-100">{t.label}</p>
                <p className="mt-0.5 text-xs text-forest-700/60 dark:text-cream-100/60">{t.description}</p>
              </button>
            ))}
          </div>

          {selectedTemplate === 'availability' && (
            <Input
              type="date"
              label="What date?"
              value={availabilityDate}
              onChange={(e) => setAvailabilityDate(e.target.value)}
            />
          )}

          {selectedTemplate === 'order' && (
            <Input
              type="number"
              label="Quantity"
              min={1}
              value={orderQuantity}
              onChange={(e) => setOrderQuantity(Number(e.target.value))}
            />
          )}

          {selectedTemplate === 'custom' && (
            <Textarea
              label="Your message"
              rows={4}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Write your message to the vendor..."
            />
          )}

          <div className="rounded-lg border border-cream-300 bg-cream-50 p-3 dark:border-forest-700 dark:bg-forest-800">
            <p className="text-xs font-medium text-forest-700/60 dark:text-cream-100/60">Message preview:</p>
            <p className="mt-1 text-sm text-forest-900 dark:text-cream-100">
              {selectedTemplate === 'general_inquiry' && `Hi! I found you on Voeq${listingTitle ? ` and I'm interested in "${listingTitle}"` : ''}. Is it still available?`}
              {selectedTemplate === 'price_inquiry' && `Hi ${vendorName}! I saw "${listingTitle}" on Voeq for ${listingPrice}. Is the price still negotiable?`}
              {selectedTemplate === 'availability' && `Hi ${vendorName}! I want to know if "${listingTitle}" is available on ${availabilityDate || '[date]'}. Thanks!`}
              {selectedTemplate === 'order' && `Hi ${vendorName}! I'd like to order ${orderQuantity} of "${listingTitle}" from Voeq. How do I proceed?`}
              {selectedTemplate === 'custom' && (customMessage || '[Your message]')}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => sendMessage(selectedTemplate)}
              isLoading={loading}
              leftIcon={<WhatsAppIcon className="h-4 w-4" />}
            >
              Send via WhatsApp
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
