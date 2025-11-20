import { Response } from 'express';
import { Supplier } from '../models/Supplier';
import { AuthRequest } from '../middleware/auth';
import { createAuditLog } from '../utils/audit';
import { AuditAction } from '../models/AuditLog';

export const getSuppliers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search } = req.query;
    const query: any = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const suppliers = await Supplier.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(suppliers);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get suppliers' });
  }
};

export const getSupplier = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findById(id).populate('createdBy', 'name email');

    if (!supplier) {
      res.status(404).json({ error: 'Supplier not found' });
      return;
    }

    res.json(supplier);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get supplier' });
  }
};

export const createSupplier = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { name, contact, address, notes } = req.body;

    const supplier = await Supplier.create({
      name,
      contact: contact || {},
      address,
      notes,
      createdBy: req.user.userId,
    });

    // Create audit log
    await createAuditLog({
      record_type: 'Supplier',
      record_id: supplier._id,
      user_id: req.user.userId,
      action: AuditAction.CREATE,
      after: supplier.toObject(),
      req,
    });

    res.status(201).json(supplier);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create supplier' });
  }
};

export const updateSupplier = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const supplier = await Supplier.findById(id);

    if (!supplier) {
      res.status(404).json({ error: 'Supplier not found' });
      return;
    }

    const before = { ...supplier.toObject() };

    const { name, contact, address, notes } = req.body;

    if (name) supplier.name = name;
    if (contact) supplier.contact = contact;
    if (address !== undefined) supplier.address = address;
    if (notes !== undefined) supplier.notes = notes;

    await supplier.save();

    // Create audit log
    await createAuditLog({
      record_type: 'Supplier',
      record_id: supplier._id,
      user_id: req.user.userId,
      action: AuditAction.UPDATE,
      before,
      after: supplier.toObject(),
      req,
    });

    res.json(supplier);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update supplier' });
  }
};

export const deleteSupplier = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const supplier = await Supplier.findById(id);

    if (!supplier) {
      res.status(404).json({ error: 'Supplier not found' });
      return;
    }

    const before = { ...supplier.toObject() };
    await supplier.deleteOne();

    // Create audit log
    await createAuditLog({
      record_type: 'Supplier',
      record_id: supplier._id,
      user_id: req.user.userId,
      action: AuditAction.DELETE,
      before,
      req,
    });

    res.json({ message: 'Supplier deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete supplier' });
  }
};

