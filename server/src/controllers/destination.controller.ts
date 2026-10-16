import { Request, Response } from 'express';
import { CURATED_DESTINATIONS } from '../models/Destination.js';

export function getDestinations(req: Request, res: Response): void {
  const { search, category } = req.query;

  let results = [...CURATED_DESTINATIONS];

  if (category && typeof category === 'string' && category !== 'all') {
    results = results.filter((d) => d.category.toLowerCase() === category.toLowerCase());
  }

  if (search && typeof search === 'string' && search.trim()) {
    const q = search.trim().toLowerCase();
    results = results.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q)) ||
        d.highlights.some((h) => h.toLowerCase().includes(q))
    );
  }

  res.status(200).json({
    destinations: results,
    count: results.length,
    total: CURATED_DESTINATIONS.length,
  });
}

export function getDestinationById(req: Request, res: Response): void {
  const { id } = req.params;
  const destination = CURATED_DESTINATIONS.find((d) => d.id === id);

  if (!destination) {
    res.status(404).json({ error: 'Destination not found' });
    return;
  }

  res.status(200).json({ destination });
}
