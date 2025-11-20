import { Response } from 'express';
import { Product, UnitType } from '../models/Product';
import { AuthRequest } from '../middleware/auth';
import { createAuditLog } from '../utils/audit';
import { AuditAction } from '../models/AuditLog';

export const getProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search, lowStock } = req.query;
    const query: any = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (lowStock === 'true') {
      query.$expr = { $lte: ['$current_volume', '$reorder_level'] };
    }

    const products = await Product.find(query)
      .populate('suppliers', 'name')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get products' });
  }
};

export const getProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate('suppliers', 'name contact')
      .populate('createdBy', 'name email');

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get product' });
  }
};

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const {
      name,
      unit_type,
      cost_per_unit,
      current_volume,
      reorder_level,
      suppliers,
      image_url,
    } = req.body;

    const product = await Product.create({
      name,
      unit_type,
      cost_per_unit,
      current_volume: current_volume || 0,
      reorder_level: reorder_level || 0,
      suppliers: suppliers || [],
      image_url,
      createdBy: req.user.userId,
    });

    await product.populate('suppliers', 'name');

    // Create audit log
    await createAuditLog({
      record_type: 'Product',
      record_id: product._id,
      user_id: req.user.userId,
      action: AuditAction.CREATE,
      after: product.toObject(),
      req,
    });

    res.status(201).json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create product' });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const before = { ...product.toObject() };

    const {
      name,
      unit_type,
      cost_per_unit,
      current_volume,
      reorder_level,
      suppliers,
      image_url,
    } = req.body;

    if (name) product.name = name;
    if (unit_type) product.unit_type = unit_type;
    if (cost_per_unit !== undefined) product.cost_per_unit = cost_per_unit;
    if (current_volume !== undefined) product.current_volume = current_volume;
    if (reorder_level !== undefined) product.reorder_level = reorder_level;
    if (suppliers) product.suppliers = suppliers;
    if (image_url !== undefined) product.image_url = image_url;

    await product.save();
    await product.populate('suppliers', 'name');

    // Create audit log
    await createAuditLog({
      record_type: 'Product',
      record_id: product._id,
      user_id: req.user.userId,
      action: AuditAction.UPDATE,
      before,
      after: product.toObject(),
      req,
    });

    res.json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update product' });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const before = { ...product.toObject() };
    await product.deleteOne();

    // Create audit log
    await createAuditLog({
      record_type: 'Product',
      record_id: product._id,
      user_id: req.user.userId,
      action: AuditAction.DELETE,
      before,
      req,
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete product' });
  }
};

