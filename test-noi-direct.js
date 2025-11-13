// Test NoI parser directly
import { parseNoIVedabase } from './src/utils/noiParser';

const testUrl = 'https://vedabase.io/en/library/noi/1/';

async function testNoIParser() {
  console.log('🧪 Testing NoI Parser');
  console.log('URL:', testUrl);

  try {
    // Fetch HTML using a proxy or CORS-friendly method
    const response = await fetch(testUrl);
    const html = await response.text();

    console.log('✅ Fetched HTML:', html.length, 'chars');
    console.log('First 500 chars:', html.substring(0, 500));

    // Try parsing
    const result = parseNoIVedabase(html, testUrl);

    console.log('\n📊 Parse Results:');
    console.log('Bengali:', result?.bengali?.substring(0, 100) || 'NOT FOUND');
    console.log('Transliteration:', result?.transliteration_en?.substring(0, 100) || 'NOT FOUND');
    console.log('Synonyms:', result?.synonyms_en?.substring(0, 100) || 'NOT FOUND');
    console.log('Translation:', result?.translation_en?.substring(0, 100) || 'NOT FOUND');
    console.log('Purport length:', result?.purport_en?.length || 0);

    // Check for specific selectors in HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    console.log('\n🔍 Selector Check:');
    console.log('.av-bengali:', !!doc.querySelector('.av-bengali'));
    console.log('.av-verse_text:', !!doc.querySelector('.av-verse_text'));
    console.log('.av-synonyms:', !!doc.querySelector('.av-synonyms'));
    console.log('.av-translation:', !!doc.querySelector('.av-translation'));
    console.log('.av-purport:', !!doc.querySelector('.av-purport'));

    return result;
  } catch (error) {
    console.error('❌ Error:', error);
    return null;
  }
}

// Run test
testNoIParser();
