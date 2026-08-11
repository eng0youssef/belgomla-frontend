const fs = require('fs');
const path = require('path');
const servicesDir = path.join('E:/project/src/services');

// 1. Remove mock-data.ts
const mockDataPath = path.join(servicesDir, 'mock-data.ts');
if (fs.existsSync(mockDataPath)) fs.unlinkSync(mockDataPath);

// 2. Process all ts files
fs.readdirSync(servicesDir).forEach(file => {
  if (!file.endsWith('.ts')) return;
  const filePath = path.join(servicesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove mock imports
  content = content.replace(/import\s*\{[^}]*mock[^}]*\}\s*from\s*['\"\.\/]+mock-data['\"];?/g, '');
  content = content.replace(/import\s*\{\s*isMockMode,?\s*\}\s*from\s*['\"\.\/]+api-client['\"];?/g, '');
  content = content.replace(/,\s*isMockMode/g, '');

  if (file === 'api-client.ts') {
    // Remove USE_MOCK constant and isMockMode function
    content = content.replace(/const USE_MOCK = process\.env\.NEXT_PUBLIC_USE_MOCK === "true";\s*/, '');
    content = content.replace(/\/\*\*[\s\S]*?\* Check if mock mode is enabled\.[\s\S]*?\*\/\s*export function isMockMode\(\): boolean \{\s*return USE_MOCK;\s*\}\s*/, '');
  }

  if (file === 'admin.ts') {
    content = content.replace(/\s*if\s*\(isMockMode\(\)\)\s*\{[\s\S]*?return[^}]*\}[ \t]*\n/g, '');
  }
  
  if (file === 'carton.ts') {
    content = content.replace(/\s*if\s*\(isMockMode\(\)\)\s*\{\s*return getMockActiveCarton\(\);\s*\}/, '');
    content = content.replace(/\s*if\s*\(isMockMode\(\)\)\s*\{[\s\S]*?return getMockActiveCarton\(\);\s*\}/g, '');
  }

  if (file === 'customer.ts') {
    content = content.replace(/\s*if\s*\(isMockMode\(\)\)\s*\{[\s\S]*?return[^}]*\}[ \t]*\n/g, '');
  }

  if (file === 'orders.ts') {
    content = content.replace(/\s*if\s*\(isMockMode\(\)\)\s*\{[\s\S]*?return[^}]*\}[ \t]*\n/g, '');
    content = content.replace(/\s*if\s*\(isMockMode\(\)\)\s*\{[\s\S]*?\}\s*else\s*\{([\s\S]*?)\}/g, '$1');
  }

  // Remove empty imports 
  content = content.replace(/import\s*\{\s*\}\s*from\s*['\"][^'\"]+['\"];?\n/g, '');

  fs.writeFileSync(filePath, content, 'utf8');
});
console.log('Mock code removed!');
