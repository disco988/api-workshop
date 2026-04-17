import type { VercelRequest, VercelResponse } from '@vercel/node';

const generateId = () => 'p_' + Math.random().toString(36).slice(2, 6);

const produkty = [
  { id: 'p_9x2k', name: 'Słuchawki', price: 199.99, category: 'elektronika', stock: 48, created_at: '2025-01-10T09:00:00Z' },
  { id: 'p_3m7j', name: 'Klawiatura', price: 349.00, category: 'elektronika', stock: 15, created_at: '2025-01-12T11:30:00Z' },
  { id: 'p_1a4r', name: 'Kubek', price: 29.99, category: 'kuchnia', stock: 200, created_at: '2025-02-01T08:00:00Z' },
  { id: 'p_7z9w', name: 'Bidon', price: 49.00, category: 'sport', stock: 75, created_at: '2025-02-14T14:00:00Z' },
  { id: 'p_2k8s', name: 'Mysz bezprzewodowa', price: 129.99, category: 'elektronika', stock: 33, created_at: '2025-03-01T10:00:00Z' },
  { id: 'p_5n1v', name: 'Mata do jogi', price: 89.00, category: 'sport', stock: 60, created_at: '2025-03-05T12:00:00Z' },
  { id: 'p_4b6c', name: 'Czajnik elektryczny', price: 149.99, category: 'kuchnia', stock: 22, created_at: '2025-03-10T09:00:00Z' },
  { id: 'p_8d3f', name: 'Pan Tadeusz', price: 19.99, category: 'ksiazki', stock: 100, created_at: '2025-03-15T08:00:00Z' },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { category, limit = '20', page = '1' } = req.query;

    let items = [...produkty];
    if (category) {
      items = items.filter(p => p.category === category);
    }

    const limitNum = Math.min(parseInt(limit as string) || 20, 50);
    const pageNum = parseInt(page as string) || 1;
    const start = (pageNum - 1) * limitNum;
    const paginated = items.slice(start, start + limitNum);

    return res.status(200).json({
      total: items.length,
      page: pageNum,
      limit: limitNum,
      items: paginated,
    });
  }

  if (req.method === 'POST') {
    const { name, price, category, stock = 0 } = req.body || {};

    const missing = ['name', 'price', 'category'].filter(f => req.body?.[f] === undefined);
    if (missing.length > 0) return res.status(400).json({ error: 'Brakuje wymaganych pól', missing });
    if (typeof price !== 'number') return res.status(422).json({ error: 'price musi być liczbą (number), nie stringiem — usuń cudzysłowy' });
    if (price < 0) return res.status(422).json({ error: 'Cena nie może być ujemna' });
    if (typeof name !== 'string' || name.trim() === '') return res.status(422).json({ error: 'name musi być niepustym stringiem' });

    const newProduct = {
      id: generateId(),
      name: name.trim(),
      price,
      category,
      stock: typeof stock === 'number' ? stock : 0,
      created_at: new Date().toISOString(),
    };

    return res.status(201).json(newProduct);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
