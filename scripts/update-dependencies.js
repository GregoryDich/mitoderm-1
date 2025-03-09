const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Checking for outdated packages...');

try {
  // Получаем список устаревших пакетов
  const outdatedOutput = execSync('npm outdated --json', { encoding: 'utf8' });
  const outdatedPackages = JSON.parse(outdatedOutput || '{}');
  
  if (Object.keys(outdatedPackages).length === 0) {
    console.log('All packages are up to date!');
    process.exit(0);
  }
  
  console.log(`Found ${Object.keys(outdatedPackages).length} outdated packages.`);
  
  // Создаем резервную копию package.json
  const packageJsonPath = path.join(__dirname, '../package.json');
  const backupPath = path.join(__dirname, '../package.json.backup');
  
  fs.copyFileSync(packageJsonPath, backupPath);
  console.log(`Backup created at ${backupPath}`);
  
  // Обновляем пакеты
  console.log('Updating packages...');
  
  // Сначала обновляем devDependencies
  const devDeps = Object.keys(outdatedPackages).filter(pkg => {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return packageJson.devDependencies && packageJson.devDependencies[pkg];
  });
  
  if (devDeps.length > 0) {
    console.log(`Updating dev dependencies: ${devDeps.join(', ')}`);
    execSync(`npm update ${devDeps.join(' ')} --save-dev`, { stdio: 'inherit' });
  }
  
  // Затем обновляем dependencies
  const deps = Object.keys(outdatedPackages).filter(pkg => {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return packageJson.dependencies && packageJson.dependencies[pkg];
  });
  
  if (deps.length > 0) {
    console.log(`Updating dependencies: ${deps.join(', ')}`);
    execSync(`npm update ${deps.join(' ')} --save`, { stdio: 'inherit' });
  }
  
  // Проверяем наличие уязвимостей
  console.log('Checking for vulnerabilities...');
  try {
    execSync('npm audit', { stdio: 'inherit' });
  } catch (auditError) {
    console.error('Vulnerabilities found. Running npm audit fix...');
    execSync('npm audit fix', { stdio: 'inherit' });
  }
  
  console.log('Update completed successfully!');
} catch (error) {
  console.error('Error updating dependencies:', error.message);
  
  // Восстанавливаем резервную копию, если она существует
  const packageJsonPath = path.join(__dirname, '../package.json');
  const backupPath = path.join(__dirname, '../package.json.backup');
  
  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, packageJsonPath);
    console.log('Restored package.json from backup.');
  }
  
  process.exit(1);
} 