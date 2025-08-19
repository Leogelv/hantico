// API endpoint для работы с чеклистом
// Размещается в /api/checklist.js на Vercel

import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'checklist-state.json');

// Инициализация файла если его нет
const initDataFile = () => {
  const dir = path.dirname(dataFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify({
      progress: {},
      lastUpdate: new Date().toISOString(),
      version: '1.0'
    }));
  }
};

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    initDataFile();

    if (req.method === 'GET') {
      // Читаем текущее состояние
      const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
      res.status(200).json(data);
    } 
    else if (req.method === 'POST') {
      // Обновляем состояние
      const { progress } = req.body;
      
      const data = {
        progress: progress || {},
        lastUpdate: new Date().toISOString(),
        version: '1.0'
      };
      
      fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
      res.status(200).json({ success: true, data });
    } 
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}