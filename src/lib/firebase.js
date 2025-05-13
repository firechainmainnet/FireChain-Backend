// src/lib/firebase.js
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 🔐 Carrega a credencial do serviço
const serviceAccountPath = path.join(__dirname, '../../AccountService.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://firechaintech-default-rtdb.firebaseio.com/'
});

const db = admin.database();

export { admin, db };
