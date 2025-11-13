// Test fetching and parsing NoI HTML structure
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

const testUrl = 'https://vedabase.io/en/library/noi/1/';

async function testNoIStructure() {
  console.log('🧪 Fetching NoI HTML from:', testUrl);

  try {
    const response = await fetch(testUrl);
    const html = await response.text();

    console.log('\n✅ Fetched HTML:', html.length, 'chars');

    // Parse with JSDOM
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    // Find all unique classes
    const allClasses = new Set();
    doc.querySelectorAll('[class]').forEach(el => {
      el.classList.forEach(cls => allClasses.add(cls));
    });

    console.log('\n📊 Total unique CSS classes:', allClasses.size);

    // Show classes starting with 'av-'
    const avClasses = Array.from(allClasses).filter(c => c.startsWith('av-'));
    console.log('\n🎯 Classes starting with "av-":', avClasses.length);
    avClasses.forEach(cls => console.log('  -', cls));

    // Test specific selectors
    console.log('\n🔍 Testing NoI-specific selectors:');

    const bengaliEl = doc.querySelector('.av-bengali');
    console.log('  .av-bengali:', bengaliEl ? 'FOUND' : 'NOT FOUND');
    if (bengaliEl) {
      console.log('    Content preview:', bengaliEl.textContent?.trim().substring(0, 60) || 'empty');
    }

    const verseTextEl = doc.querySelector('.av-verse_text');
    console.log('  .av-verse_text:', verseTextEl ? 'FOUND' : 'NOT FOUND');
    if (verseTextEl) {
      console.log('    Content preview:', verseTextEl.textContent?.trim().substring(0, 60) || 'empty');
    }

    const synonymsEl = doc.querySelector('.av-synonyms');
    console.log('  .av-synonyms:', synonymsEl ? 'FOUND' : 'NOT FOUND');
    if (synonymsEl) {
      const spans = synonymsEl.querySelectorAll('span.inline');
      console.log('    Found span.inline elements:', spans.length);
    }

    const translationEl = doc.querySelector('.av-translation');
    console.log('  .av-translation:', translationEl ? 'FOUND' : 'NOT FOUND');
    if (translationEl) {
      console.log('    Content preview:', translationEl.textContent?.trim().substring(0, 60) || 'empty');
    }

    const purportEl = doc.querySelector('.av-purport');
    console.log('  .av-purport:', purportEl ? 'FOUND' : 'NOT FOUND');
    if (purportEl) {
      const paragraphs = purportEl.querySelectorAll('p');
      console.log('    Found <p> elements:', paragraphs.length);
    }

    // Show sample of HTML structure
    console.log('\n📄 HTML structure sample (first 1000 chars):');
    console.log(html.substring(0, 1000));

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testNoIStructure();
