import { Response } from 'express';
import { RestaurantProfile } from '../models/RestaurantProfile';
import { AuthRequest } from '../middleware/auth';
import { createAuditLog } from '../utils/audit';
import { AuditAction } from '../models/AuditLog';

export const getRestaurantProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const profile = await RestaurantProfile.getProfile();
    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get restaurant profile' });
  }
};

export const updateRestaurantProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, address, contact, default_currency } = req.body;

    let profile = await RestaurantProfile.findOne();
    const before = profile ? { ...profile.toObject() } : null;

    if (profile) {
      // Update existing profile
      profile.name = name;
      profile.address = address;
      profile.default_currency = default_currency || 'USD';
      if (contact) {
        profile.contact = {
          phone: contact.phone || profile.contact?.phone || '',
          email: contact.email || profile.contact?.email || '',
        };
      }
      await profile.save();
    } else {
      // Create new profile
      profile = await RestaurantProfile.create({
        name,
        address,
        default_currency: default_currency || 'USD',
        contact: {
          phone: contact?.phone || '',
          email: contact?.email || '',
        },
      });
    }

    // Create audit log
    if (req.user) {
      await createAuditLog({
        record_type: 'RestaurantProfile',
        record_id: profile._id,
        user_id: req.user.userId,
        action: before ? AuditAction.UPDATE : AuditAction.CREATE,
        before: before || undefined,
        after: profile.toObject(),
        req,
      });
    }

    res.json({
      message: 'Restaurant profile updated successfully',
      profile,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update restaurant profile' });
  }
};

