import { Request, Response } from 'express';
import { Resource } from '../models/Resources';

export const getResources = async (req: Request, res: Response) => {
  try {
    const resources = await Resource.find();
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
};

export const createResource = async (req: Request, res: Response) => {
  try {
    const { resourceId, name, type, totalQuantity, location, status } = req.body;
    const existing = await Resource.findOne({ resourceId });
    if (existing) {
      return res.status(400).json({ error: 'Resource ID already exists' });
    }

    const newResource = new Resource({
      resourceId,
      name,
      type,
      totalQuantity,
      availableQuantity: totalQuantity,
      location,
      status: status || 'Active'
    });

    await newResource.save();
    res.status(201).json(newResource);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create resource' });
  }
};