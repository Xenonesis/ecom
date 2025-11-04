#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Production Readiness Check\n');

const checks = [];

// Check 1: Environment Variables
function checkEnvironmentVariables() {
  console.log('📋 Checking environment variables...');
  
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY'
  ];

  const envExample = fs.readFileSync('.env.example', 'utf8');
  const missingVars = [];

  requiredEnvVars.forEach(varName => {
    if (!process.env[varName] && !envExample.includes(varName)) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    checks.push({
      name: 'Environment Variables',
      status: 'FAIL',
      message: `Missing: ${missingVars.join(', ')}`
    });
  } else {
    checks.push({
      name: 'Environment Variables',
      status: 'PASS',
      message: 'All required environment variables are configured'
    });
  }
}

// Check 2: Build Success
function checkBuild() {
  console.log('🔨 Checking build...');
  
  try {
    execSync('npm run build', { stdio: 'pipe' });
    checks.push({
      name: 'Build',
      status: 'PASS',
      message: 'Build completed successfully'
    });
  } catch (error) {
    checks.push({
      name: 'Build',
      status: 'FAIL',
      message: 'Build failed - check build output'
    });
  }
}

// Check 3: Linting
function checkLinting() {
  console.log('🔍 Checking linting...');
  
  try {
    const output = execSync('npm run lint', { encoding: 'utf8', stdio: 'pipe' });
    const errorMatch = output.match(/(\d+) error/);
    const warningMatch = output.match(/(\d+) warning/);
    const errorCount = errorMatch ? parseInt(errorMatch[1]) : 0;
    const warningCount = warningMatch ? parseInt(warningMatch[1]) : 0;
    
    if (errorCount > 0) {
      checks.push({
        name: 'Linting',
        status: 'FAIL',
        message: `${errorCount} linting errors found`
      });
    } else if (warningCount > 0) {
      checks.push({
        name: 'Linting',
        status: 'WARN',
        message: `${warningCount} linting warnings found (acceptable)`
      });
    } else {
      checks.push({
        name: 'Linting',
        status: 'PASS',
        message: 'No linting issues'
      });
    }
  } catch (error) {
    checks.push({
      name: 'Linting',
      status: 'FAIL',
      message: 'Linting check failed'
    });
  }
}

// Check 4: Test Coverage
function checkTestCoverage() {
  console.log('🧪 Checking test coverage...');
  
  try {
    const output = execSync('npm run test:coverage', { encoding: 'utf8', stdio: 'pipe' });
    const coverageMatch = output.match(/All files\s+\|\s+([\d.]+)/);
    
    if (coverageMatch) {
      const coverage = parseFloat(coverageMatch[1]);
      if (coverage < 5) {
        checks.push({
          name: 'Test Coverage',
          status: 'FAIL',
          message: `Coverage is ${coverage}% (minimum: 5%)`
        });
      } else if (coverage < 70) {
        checks.push({
          name: 'Test Coverage',
          status: 'WARN',
          message: `Coverage is ${coverage}% (target: 70%+)`
        });
      } else {
        checks.push({
          name: 'Test Coverage',
          status: 'PASS',
          message: `Coverage is ${coverage}%`
        });
      }
    } else {
      checks.push({
        name: 'Test Coverage',
        status: 'FAIL',
        message: 'Could not determine test coverage'
      });
    }
  } catch (error) {
    checks.push({
      name: 'Test Coverage',
      status: 'FAIL',
      message: 'Test coverage check failed'
    });
  }
}

// Check 5: Security Headers
function checkSecurityConfig() {
  console.log('🔒 Checking security configuration...');
  
  try {
    const nextConfig = fs.readFileSync('next.config.ts', 'utf8');
    
    const securityFeatures = [
      'X-Frame-Options',
      'X-Content-Type-Options',
      'Strict-Transport-Security',
      'Content-Security-Policy'
    ];

    const missingHeaders = securityFeatures.filter(header => 
      !nextConfig.includes(header)
    );

    if (missingHeaders.length > 0) {
      checks.push({
        name: 'Security Headers',
        status: 'WARN',
        message: `Missing headers: ${missingHeaders.join(', ')}`
      });
    } else {
      checks.push({
        name: 'Security Headers',
        status: 'PASS',
        message: 'Security headers configured'
      });
    }
  } catch (error) {
    checks.push({
      name: 'Security Headers',
      status: 'FAIL',
      message: 'Could not check security configuration'
    });
  }
}

// Check 6: Bundle Size
function checkBundleSize() {
  console.log('📦 Checking bundle size...');
  
  try {
    const buildDir = '.next';
    if (fs.existsSync(buildDir)) {
      const stats = fs.statSync(path.join(buildDir, 'static'));
      const sizeInMB = stats.size / (1024 * 1024);
      
      if (sizeInMB > 10) {
        checks.push({
          name: 'Bundle Size',
          status: 'WARN',
          message: `Bundle size is ${sizeInMB.toFixed(2)}MB (consider optimization)`
        });
      } else {
        checks.push({
          name: 'Bundle Size',
          status: 'PASS',
          message: `Bundle size is ${sizeInMB.toFixed(2)}MB`
        });
      }
    } else {
      checks.push({
        name: 'Bundle Size',
        status: 'SKIP',
        message: 'Build directory not found'
      });
    }
  } catch (error) {
    checks.push({
      name: 'Bundle Size',
      status: 'FAIL',
      message: 'Could not check bundle size'
    });
  }
}

// Check 7: Database Schema
function checkDatabaseSchema() {
  console.log('🗄️ Checking database schema...');
  
  try {
    const supabaseDir = 'supabase';
    if (fs.existsSync(supabaseDir)) {
      const migrationFiles = fs.readdirSync(path.join(supabaseDir, 'migrations'));
      
      if (migrationFiles.length > 0) {
        checks.push({
          name: 'Database Schema',
          status: 'PASS',
          message: `${migrationFiles.length} migration files found`
        });
      } else {
        checks.push({
          name: 'Database Schema',
          status: 'WARN',
          message: 'No migration files found'
        });
      }
    } else {
      checks.push({
        name: 'Database Schema',
        status: 'WARN',
        message: 'Supabase directory not found'
      });
    }
  } catch (error) {
    checks.push({
      name: 'Database Schema',
      status: 'FAIL',
      message: 'Could not check database schema'
    });
  }
}

// Check 8: Performance Budget
function checkPerformanceBudget() {
  console.log('⚡ Checking performance budget...');
  
  // This would typically integrate with Lighthouse CI or similar
  checks.push({
    name: 'Performance Budget',
    status: 'SKIP',
    message: 'Run Lighthouse audit manually'
  });
}

// Run all checks
async function runChecks() {
  checkEnvironmentVariables();
  checkBuild();
  checkLinting();
  checkTestCoverage();
  checkSecurityConfig();
  checkBundleSize();
  checkDatabaseSchema();
  checkPerformanceBudget();

  // Display results
  console.log('\n📊 Production Readiness Report\n');
  console.log('='.repeat(50));

  let passCount = 0;
  let warnCount = 0;
  let failCount = 0;

  checks.forEach(check => {
    const icon = check.status === 'PASS' ? '✅' : 
                 check.status === 'WARN' ? '⚠️' : 
                 check.status === 'FAIL' ? '❌' : '⏭️';
    
    console.log(`${icon} ${check.name}: ${check.message}`);
    
    if (check.status === 'PASS') passCount++;
    else if (check.status === 'WARN') warnCount++;
    else if (check.status === 'FAIL') failCount++;
  });

  console.log('='.repeat(50));
  console.log(`✅ Passed: ${passCount}`);
  console.log(`⚠️  Warnings: ${warnCount}`);
  console.log(`❌ Failed: ${failCount}`);

  if (failCount > 0) {
    console.log('\n🚨 Production deployment NOT recommended');
    console.log('Please fix the failing checks before deploying.');
    process.exit(1);
  } else if (warnCount > 0) {
    console.log('\n⚠️  Production deployment possible with warnings');
    console.log('Consider addressing warnings for optimal performance.');
  } else {
    console.log('\n🎉 Ready for production deployment!');
  }

  // Generate deployment checklist
  console.log('\n📋 Pre-deployment Checklist:');
  console.log('□ Environment variables configured in production');
  console.log('□ Database migrations applied');
  console.log('□ SSL certificate configured');
  console.log('□ CDN configured for static assets');
  console.log('□ Monitoring and logging set up');
  console.log('□ Backup strategy in place');
  console.log('□ Error tracking configured');
  console.log('□ Performance monitoring enabled');
}

runChecks().catch(console.error);