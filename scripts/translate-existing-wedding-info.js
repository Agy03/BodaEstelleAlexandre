const { PrismaClient } = require('@prisma/client');
const fetch = require('node-fetch');

const prisma = new PrismaClient();

/**
 * This script translates all existing wedding info from French to English and Spanish
 * Run with: node scripts/translate-existing-wedding-info.js
 */
async function translateExistingData() {
  try {
    console.log('🌐 Starting translation of existing wedding info...');

    // Check if we're in development or production
    const apiUrl = process.env.API_URL || 'http://localhost:3000';
    
    // Make request to translate endpoint
    const response = await fetch(`${apiUrl}/api/wedding-info/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sourceLanguage: 'fr', // Translating FROM French
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Translation failed:', error);
      process.exit(1);
    }

    const result = await response.json();
    console.log('✅ Translation completed successfully!');
    console.log('📝', result.message);
    console.log('🎯 Translated ID:', result.translatedId);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

translateExistingData();
