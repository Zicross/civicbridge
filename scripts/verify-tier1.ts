#!/usr/bin/env tsx
/**
 * Tier 1 Verification Script
 * 
 * Validates ConstiuINT's trust-root constraints before production readiness.
 * This script checks that the implementation meets the security, privacy,
 * and compliance requirements defined in the MVP spec.
 * 
 * Run with: npm run verify:tier1
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Verification results
const results: { check: string; status: 'PASS' | 'FAIL' | 'WARN'; details: string }[] = [];

function logResult(check: string, status: 'PASS' | 'FAIL' | 'WARN', details: string) {
  results.push({ check, status, details });
  console.log(`[${status}] ${check}: ${details}`);
}

/**
 * Check 1: src/core/* imports no framework/provider/server modules
 */
function checkImportBoundary() {
  const coreDir = path.join(rootDir, 'src', 'core');
  
  if (!fs.existsSync(coreDir)) {
    logResult('Import Boundary', 'FAIL', 'src/core directory does not exist');
    return;
  }
  
  const forbiddenImports = ['next', 'react', 'drizzle-orm', '@/server', '@/providers'];
  const issues: string[] = [];
  
  function scanDir(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        
        for (const imp of forbiddenImports) {
          // Check for import statements
          const importRegex = new RegExp(`^\\s*import\\s+.*from\\s+['"]${imp}`, 'm');
          const requireRegex = new RegExp(`require\\(['"]${imp}['"]`, 'm');
          
          if (importRegex.test(content) || requireRegex.test(content)) {
            const relPath = path.relative(rootDir, fullPath);
            issues.push(`${relPath} imports ${imp}`);
          }
        }
      }
    }
  }
  
  scanDir(coreDir);
  
  if (issues.length > 0) {
    logResult('Import Boundary', 'FAIL', `Found forbidden imports: ${issues.join('; ')}`);
  } else {
    logResult('Import Boundary', 'PASS', 'src/core has no framework/provider/server imports');
  }
}

/**
 * Check 2: Audit event schema has no raw address/message/provider payload columns
 */
function checkAuditSchema() {
  const schemaPath = path.join(rootDir, 'src', 'server', 'db', 'schema.ts');
  
  if (!fs.existsSync(schemaPath)) {
    logResult('Audit Schema', 'FAIL', 'Database schema not found');
    return;
  }
  
  const content = fs.readFileSync(schemaPath, 'utf-8');
  
  // Check that audit_events doesn't have forbidden columns
  const forbiddenColumns = [
    'rawAddress',
    'raw_address', 
    'addressRaw',
    'messageBody',
    'message_body',
    'rawMessage',
    'rawProviderPayload',
    'providerPayload',
    'rawPayload'
  ];
  
  const issues: string[] = [];
  
  for (const col of forbiddenColumns) {
    const regex = new RegExp(`audit_events.*${col}|${col}.*audit_events`, 'i');
    if (regex.test(content)) {
      issues.push(col);
    }
  }
  
  if (issues.length > 0) {
    logResult('Audit Schema', 'FAIL', `Found forbidden columns: ${issues.join(', ')}`);
  } else {
    logResult('Audit Schema', 'PASS', 'Audit schema has no raw address/message/provider columns');
  }
}

/**
 * Check 3: supported-scope doc exists and mentions federal/state-only MVP
 */
function checkSupportedScopeDoc() {
  const docPath = path.join(rootDir, 'docs', 'product', 'supported-scope.md');
  
  if (!fs.existsSync(docPath)) {
    logResult('Supported Scope Doc', 'FAIL', 'docs/product/supported-scope.md not found');
    return;
  }
  
  const content = fs.readFileSync(docPath, 'utf-8').toLowerCase();
  
  const hasFederal = content.includes('federal');
  const hasState = content.includes('state');
  const hasLocal = content.includes('local');
  
  if (hasFederal && hasState) {
    if (hasLocal) {
      logResult('Supported Scope Doc', 'PASS', 'Mentions federal, state, and local scope');
    } else {
      logResult('Supported Scope Doc', 'WARN', 'Mentions federal/state but local coverage unclear');
    }
  } else {
    logResult('Supported Scope Doc', 'FAIL', 'Does not clearly mention federal/state scope');
  }
}

/**
 * Check 4: User-facing copy avoids delivery claims
 */
function checkDeliveryClaims() {
  const appDir = path.join(rootDir, 'src', 'app');
  const componentsDir = path.join(rootDir, 'src', 'components');
  
  const forbiddenPhrases = [
    'send to your representative',
    'will send your message',
    'delivered to',
    'message sent to'
  ];
  
  const issues: string[] = [];
  
  function scanDir(dir: string) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        const content = fs.readFileSync(fullPath, 'utf-8').toLowerCase();
        
        for (const phrase of forbiddenPhrases) {
          if (content.includes(phrase.toLowerCase())) {
            const relPath = path.relative(rootDir, fullPath);
            issues.push(`${relPath} contains "${phrase}"`);
          }
        }
      }
    }
  }
  
  scanDir(appDir);
  scanDir(componentsDir);
  
  if (issues.length > 0) {
    logResult('Delivery Claims', 'FAIL', `Found delivery claims: ${issues.join('; ')}`);
  } else {
    logResult('Delivery Claims', 'PASS', 'No misleading delivery claims found');
  }
}

/**
 * Check 5: Provider ToS/pricing/political-use is listed as unresolved or verified
 */
function checkProviderDocumentation() {
  const blockersPath = path.join(rootDir, 'docs', 'product', 'launch-blockers.md');
  
  // If blockers doc doesn't exist yet, warn
  if (!fs.existsSync(blockersPath)) {
    logResult('Provider Documentation', 'WARN', 'launch-blockers.md not found - provider verification status unknown');
    return;
  }
  
  const content = fs.readFileSync(blockersPath, 'utf-8').toLowerCase();
  
  if (content.includes('provider') && (content.includes('tos') || content.includes('terms of service'))) {
    logResult('Provider Documentation', 'PASS', 'Provider ToS mentioned in blockers doc');
  } else {
    logResult('Provider Documentation', 'WARN', 'Provider verification not documented');
  }
}

/**
 * Check 6: No TODO/FIXME in Tier 1 paths
 */
function checkTODO() {
  const tier1Dirs = [
    path.join(rootDir, 'src', 'core'),
    path.join(rootDir, 'src', 'providers'),
    path.join(rootDir, 'src', 'server', 'services'),
    path.join(rootDir, 'src', 'server', 'db')
  ];
  
  const issues: string[] = [];
  
  for (const dir of tier1Dirs) {
    if (!fs.existsSync(dir)) continue;
    
    function scanDir(d: string) {
      const files = fs.readdirSync(d);
      for (const file of files) {
        const fullPath = path.join(d, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDir(fullPath);
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          
          if (content.includes('TODO') || content.includes('FIXME')) {
            const relPath = path.relative(rootDir, fullPath);
            issues.push(relPath);
          }
        }
      }
    }
    
    scanDir(dir);
  }
  
  if (issues.length > 0) {
    logResult('TODO/FIXME Check', 'FAIL', `Found TODOs/FIXMEs in: ${issues.join(', ')}`);
  } else {
    logResult('TODO/FIXME Check', 'PASS', 'No TODOs/FIXMEs in Tier 1 paths');
  }
}

/**
 * Main execution
 */
function main() {
  console.log('='.repeat(60));
  console.log('ConstiuINT Tier 1 Verification');
  console.log('='.repeat(60));
  console.log('');
  
  checkImportBoundary();
  checkAuditSchema();
  checkSupportedScopeDoc();
  checkDeliveryClaims();
  checkProviderDocumentation();
  checkTODO();
  
  console.log('');
  console.log('='.repeat(60));
  console.log('Summary');
  console.log('='.repeat(60));
  
  const passCount = results.filter(r => r.status === 'PASS').length;
  const failCount = results.filter(r => r.status === 'FAIL').length;
  const warnCount = results.filter(r => r.status === 'WARN').length;
  
  console.log(`PASS: ${passCount}, FAIL: ${failCount}, WARN: ${warnCount}`);
  console.log('');
  
  if (failCount > 0) {
    console.log('❌ Tier 1 verification FAILED');
    process.exit(1);
  } else if (warnCount > 0) {
    console.log('⚠️  Tier 1 verification passed with warnings');
    process.exit(0);
  } else {
    console.log('✅ Tier 1 verification PASSED');
    process.exit(0);
  }
}

main();
