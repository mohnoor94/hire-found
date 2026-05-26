import { containsArabic, truncateText, getRelativeTime, getCategories, filterByCategory, DEFAULTS, CATEGORY_COLORS } from './jobs.js';

// Test containsArabic
console.log('containsArabic tests:');
console.log('  Arabic text:', containsArabic('مرحبا') === true ? 'PASS' : 'FAIL');
console.log('  English text:', containsArabic('hello') === false ? 'PASS' : 'FAIL');
console.log('  Mixed:', containsArabic('hello مرحبا') === true ? 'PASS' : 'FAIL');
console.log('  Empty:', containsArabic('') === false ? 'PASS' : 'FAIL');
console.log('  Null:', containsArabic(null) === false ? 'PASS' : 'FAIL');

// Test truncateText
console.log('\ntruncateText tests:');
console.log('  Short text:', truncateText('hello', 10) === 'hello' ? 'PASS' : 'FAIL');
console.log('  Exact length:', truncateText('hello', 5) === 'hello' ? 'PASS' : 'FAIL');
const truncated = truncateText('hello world', 8);
console.log('  Truncated value:', truncated);
console.log('  Truncated length:', truncated.length === 8 ? 'PASS' : 'FAIL');
console.log('  Ends with ellipsis:', truncated.endsWith('…') ? 'PASS' : 'FAIL');

// Test getRelativeTime
console.log('\ngetRelativeTime tests:');
console.log('  Just now:', getRelativeTime(new Date()) === 'just now' ? 'PASS' : 'FAIL');
const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
console.log('  5 min ago:', getRelativeTime(fiveMinAgo) === '5 minutes ago' ? 'PASS' : 'FAIL');
const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
console.log('  2 days ago:', getRelativeTime(twoDaysAgo) === '2 days ago' ? 'PASS' : 'FAIL');
const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
console.log('  1 hour ago:', getRelativeTime(oneHourAgo) === '1 hour ago' ? 'PASS' : 'FAIL');

// Test getCategories
console.log('\ngetCategories tests:');
const jobs = [
  { category: 'tech' },
  { category: 'hospitality' },
  { category: 'tech' },
  { category: 'fnb' }
];
const cats = getCategories(jobs);
console.log('  No duplicates:', cats.length === 3 ? 'PASS' : 'FAIL');
console.log('  Contains tech:', cats.includes('tech') ? 'PASS' : 'FAIL');
console.log('  Contains hospitality:', cats.includes('hospitality') ? 'PASS' : 'FAIL');
console.log('  Contains fnb:', cats.includes('fnb') ? 'PASS' : 'FAIL');
console.log('  Empty input:', getCategories([]).length === 0 ? 'PASS' : 'FAIL');

// Test filterByCategory
console.log('\nfilterByCategory tests:');
console.log('  Filter tech:', filterByCategory(jobs, 'tech').length === 2 ? 'PASS' : 'FAIL');
console.log('  Filter all:', filterByCategory(jobs, 'all').length === 4 ? 'PASS' : 'FAIL');
console.log('  Filter ALL:', filterByCategory(jobs, 'ALL').length === 4 ? 'PASS' : 'FAIL');
console.log('  Filter All:', filterByCategory(jobs, 'All').length === 4 ? 'PASS' : 'FAIL');
console.log('  Filter fnb:', filterByCategory(jobs, 'fnb').length === 1 ? 'PASS' : 'FAIL');
console.log('  Filter nonexistent:', filterByCategory(jobs, 'xyz').length === 0 ? 'PASS' : 'FAIL');

// Test DEFAULTS
console.log('\nDEFAULTS tests:');
console.log('  whatsApp:', DEFAULTS.whatsApp === '962793001043' ? 'PASS' : 'FAIL');
console.log('  email:', DEFAULTS.email === 'yasmin@hirefound.com' ? 'PASS' : 'FAIL');
console.log('  calLink:', DEFAULTS.calLink === 'https://cal.com/yasminblasi' ? 'PASS' : 'FAIL');
console.log('  queryTimeout:', DEFAULTS.queryTimeout === 10000 ? 'PASS' : 'FAIL');

// Test CATEGORY_COLORS
console.log('\nCATEGORY_COLORS tests:');
console.log('  Has hospitality:', CATEGORY_COLORS.hospitality ? 'PASS' : 'FAIL');
console.log('  Has tech:', CATEGORY_COLORS.tech ? 'PASS' : 'FAIL');
console.log('  Has fnb:', CATEGORY_COLORS.fnb ? 'PASS' : 'FAIL');
console.log('  Has aviation:', CATEGORY_COLORS.aviation ? 'PASS' : 'FAIL');
console.log('  Has other:', CATEGORY_COLORS.other ? 'PASS' : 'FAIL');

console.log('\nAll tests complete!');
