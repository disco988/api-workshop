import type { VercelRequest, VercelResponse } from '@vercel/node';

const generateId = () => 'p_' + Math.random().toString(36).slice(2, 6);

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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
