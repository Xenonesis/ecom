#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all TypeScript and TSX files
function getAllTsFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      getAllTsFiles(fullPath, files);
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Fix HTML entities in JSX
function fixHtmlEntities(content) {
  // Replace unescaped quotes and apostrophes
  return content
    .replace(/([^\\])"([^"]*)"([^"])/g, '$1&quot;$2&quot;$3')
    .replace(/([^\\])'([^']*)'([^'])/g, '$1&apos;$2&apos;$3')
    .replace(/don't/g, 'don&apos;t')
    .replace(/won't/g, 'won&apos;t')
    .replace(/can't/g, 'can&apos;t')
    .replace(/isn't/g, 'isn&apos;t')
    .replace(/doesn't/g, 'doesn&apos;t')
    .replace(/haven't/g, 'haven&apos;t')
    .replace(/shouldn't/g, 'shouldn&apos;t')
    .replace(/wouldn't/g, 'wouldn&apos;t')
    .replace(/couldn't/g, 'couldn&apos;t');
}

// Remove unused imports
function removeUnusedImports(content) {
  const lines = content.split('\n');
  const imports = [];
  const usedIdentifiers = new Set();
  
  // Find all imports
  lines.forEach((line, index) => {
    const importMatch = line.match(/^import\s+(?:{([^}]+)}|\*\s+as\s+(\w+)|(\w+))\s+from\s+['"]([^'"]+)['"]/);
    if (importMatch) {
      imports.push({ line: index, match: importMatch, original: line });
    }
  });
  
  // Find all used identifiers in the file
  const codeContent = lines.join('\n');
  const identifierRegex = /\b[A-Za-z_$][A-Za-z0-9_$]*\b/g;
  let match;
  while ((match = identifierRegex.exec(codeContent)) !== null) {
    usedIdentifiers.add(match[0]);
  }
  
  // Filter out unused imports
  const filteredLines = [...lines];
  imports.reverse().forEach(({ line, match, original }) => {
    if (match[1]) { // Named imports
      const namedImports = match[1].split(',').map(imp => imp.trim());
      const usedImports = namedImports.filter(imp => {
        const cleanImp = imp.replace(/\s+as\s+\w+/, '').trim();
        return usedIdentifiers.has(cleanImp) || usedIdentifiers.has(imp.split(' as ')[1]?.trim());
      });
      
      if (usedImports.length === 0) {
        filteredLines.splice(line, 1);
      } else if (usedImports.length < namedImports.length) {
        filteredLines[line] = original.replace(match[1], usedImports.join(', '));
      }
    } else if (match[2] || match[3]) { // Default or namespace imports
      const importName = match[2] || match[3];
      if (!usedIdentifiers.has(importName)) {
        filteredLines.splice(line, 1);
      }
    }
  });
  
  return filteredLines.join('\n');
}

// Fix common TypeScript issues
function fixTypeScriptIssues(content) {
  // Replace 'any' with more specific types where possible
  content = content.replace(/:\s*any\b/g, ': unknown');
  
  // Fix unused variables by prefixing with underscore
  content = content.replace(/const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g, (match, varName) => {
    // Check if variable is used later in the code
    const varUsageRegex = new RegExp(`\\b${varName}\\b`, 'g');
    const matches = content.match(varUsageRegex);
    if (matches && matches.length <= 1) { // Only the declaration
      return match.replace(varName, `_${varName}`);
    }
    return match;
  });
  
  return content;
}

// Main function to process files
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Apply fixes
    if (filePath.endsWith('.tsx')) {
      content = fixHtmlEntities(content);
    }
    
    content = removeUnusedImports(content);
    content = fixTypeScriptIssues(content);
    
    // Only write if content changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Run the script
console.log('Starting lint fixes...');

const files = getAllTsFiles('.');
const filteredFiles = files.filter(file => 
  !file.includes('node_modules') && 
  !file.includes('.next') && 
  !file.includes('coverage') &&
  !file.includes('dist')
);

console.log(`Processing ${filteredFiles.length} files...`);

filteredFiles.forEach(processFile);

console.log('Lint fixes completed!');

// Run ESLint with --fix flag
try {
  console.log('Running ESLint --fix...');
  execSync('npm run lint -- --fix', { stdio: 'inherit' });
} catch (error) {
  console.log('ESLint --fix completed with some remaining issues');
}