import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory store (resets on cold start — fine for a workshop mock)
const store: Record<string, any> = {
  p_9x2k: { id: 'p_9x2k', name: 'Słuchawki', price: 199.99, category: 'elektronika', stock: 48, created_at: '2025-01-10T09:00:00Z' },
  p_3m7j: { id: 'p_3m7j', name: 'Klawiatura', price: 349.00, category: 'elektronika', stock: 15, created_at: '2025-01-12T11:30:00Z' },
  p_1a4r: { id: 'p_1a4r', name: 'Kubek', price: 29.99, category: 'kuchnia', stock: 200, created_at: '2025-02-01T08:00:00Z' },
  p_7z9w: { id: 'p_7z9w', name: 'Bidon', price: 49.00, category: 'sport', stock: 75, created_at: '2025-02-14T14:00:00Z' },
  p_2k8s: { id: 'p_2k8s', name: 'Mysz bezprzewodowa', price: 129.99, category: 'elektronika', stock: 33, created_at: '2025-03-01T10:00:00Z' },
  p_5n1v: { id: 'p_5n1v', name: 'Mata do jogi', price: 89.00, category: 'sport', stock: 60, created_at: '2025-03-05T12:00:00Z' },
  p_4b6c: { id: 'p_4b6c', name: 'Czajnik elektryczny', price: 149.99, category: 'kuchnia', stock: 22, created_at: '2025-03-10T09:00:00Z' },
  p_8d3f: { id: 'p_8d3f', name: 'Pan Tadeusz', price: 19.99, category: 'ksiazki', stock: 100, created_at: '2025-03-15T08:00:00Z' },
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  const productId = Array.isArray(id) ? id[0] : id;

  if (req.method === 'GET') {
    const product = store[productId!];
    if (!product) return res.status(404).json({ error: 'Produkt nie istnieje', id: productId });
    return res.status(200).json(product);
  }

  if (req.method === 'PUT') {
    if (!store[productId!]) return res.status(404).json({ error: 'Produkt nie istnieje', id: productId });

    const { name, price, category, stock } = req.body;
    const missing = ['name', 'price', 'category', 'stock'].filter(f => req.body[f] === undefined);
    if (missing.length > 0) return res.status(400).json({ error: 'Brakuje wymaganych pól', missing });
    if (typeof price !== 'number') return res.status(422).json({ error: 'price musi być liczbą (number), nie stringiem' });
    if (price < 0) return res.status(422).json({ error: 'Cena nie może być ujemna' });

    store[productId!] = { ...store[productId!], name, price, category, stock, updated_at: new Date().toISOString() };
    return res.status(200).json(store[productId!]);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
