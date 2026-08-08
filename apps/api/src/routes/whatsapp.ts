import { Router, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { WHATSAPP_TEMPLATES } from '../services/whatsapp-templates';

export const whatsappRouter: ReturnType<typeof Router> = Router();

const generateMessageSchema = z.object({
  template: z.enum(['general_inquiry', 'price_inquiry', 'availability', 'order', 'custom']),
  vendorName: z.string().min(1),
  listingTitle: z.string().optional(),
  price: z.string().optional(),
  date: z.string().optional(),
  quantity: z.number().optional(),
  customMessage: z.string().optional(),
});

whatsappRouter.post('/generate-message', (req: any, res: Response, next: NextFunction) => {
  try {
    const input = generateMessageSchema.parse(req.body);
    let message: string;

    switch (input.template) {
      case 'general_inquiry':
        message = WHATSAPP_TEMPLATES.general_inquiry({ vendorName: input.vendorName, listingTitle: input.listingTitle });
        break;
      case 'price_inquiry':
        if (!input.listingTitle || !input.price) {
          res.status(400).json({ error: 'MissingFields' });
          return;
        }
        message = WHATSAPP_TEMPLATES.price_inquiry({ vendorName: input.vendorName, listingTitle: input.listingTitle, price: input.price });
        break;
      case 'availability':
        if (!input.listingTitle || !input.date) {
          res.status(400).json({ error: 'MissingFields' });
          return;
        }
        message = WHATSAPP_TEMPLATES.availability({ vendorName: input.vendorName, listingTitle: input.listingTitle, date: input.date });
        break;
      case 'order':
        if (!input.listingTitle || !input.quantity) {
          res.status(400).json({ error: 'MissingFields' });
          return;
        }
        message = WHATSAPP_TEMPLATES.order({ vendorName: input.vendorName, listingTitle: input.listingTitle, quantity: input.quantity });
        break;
      case 'custom':
        if (!input.customMessage) {
          res.status(400).json({ error: 'MissingFields' });
          return;
        }
        message = WHATSAPP_TEMPLATES.custom({ message: input.customMessage });
        break;
      default:
        message = WHATSAPP_TEMPLATES.general_inquiry({ vendorName: input.vendorName });
    }

    res.status(200).json({ message });
  } catch (error) {
    res.status(400).json({ error: 'InvalidInput', message: (error as Error).message });
  }
});
