const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

const POCKETBASE_VERSION = '0.40.5';

function getPlatformInfo() {
  const platform = process.platform;
  const arch = process.arch;
  
  let pbPlatform, pbArch, pbExt;
  
  if (platform === 'win32') {
    pbPlatform = 'windows';
    pbArch = arch === 'x64' ? 'amd64' : 'arm64';
    pbExt = '.exe';
  } else if (platform === 'darwin') {
    pbPlatform = 'darwin';
    pbArch = arch === 'arm64' ? 'arm64' : 'amd64';
    pbExt = '';
  } else {
    pbPlatform = 'linux';
    pbArch = arch === 'x64' ? 'amd64' : 'arm64';
    pbExt = '';
  }
  
  return { pbPlatform, pbArch, pbExt };
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        }).on('error', reject);
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }
    }).on('error', reject);
  });
}

async function ensurePocketBase() {
  const { pbPlatform, pbArch, pbExt } = getPlatformInfo();
  const pbExecutable = path.join(__dirname, `pocketbase${pbExt}`);
  
  if (fs.existsSync(pbExecutable)) {
    console.log('PocketBase executable found.');
    return pbExecutable;
  }
  
  console.log(`Downloading PocketBase ${POCKETBASE_VERSION}...`);
  const zipUrl = `https://github.com/pocketbase/pocketbase/releases/download/v${POCKETBASE_VERSION}/pocketbase_${POCKETBASE_VERSION}_${pbPlatform}_${pbArch}.zip`;
  const zipPath = path.join(__dirname, 'pocketbase.zip');
  
  try {
    await downloadFile(zipUrl, zipPath);
    console.log('Download complete. Extracting...');
    
    if (process.platform === 'win32') {
      execSync(`powershell -command "Expand-Archive -Path '${zipPath}' -DestinationPath '${__dirname}' -Force"`, { stdio: 'inherit' });
    } else {
      execSync(`unzip -o "${zipPath}" -d "${__dirname}"`, { stdio: 'inherit' });
      execSync(`chmod +x "${pbExecutable}"`, { stdio: 'inherit' });
    }
    
    fs.unlinkSync(zipPath);
    console.log('PocketBase downloaded and extracted successfully.');
    return pbExecutable;
  } catch (error) {
    console.error('Failed to download or extract PocketBase:', error.message);
    process.exit(1);
  }
}

async function startPocketBase() {
  const pbExecutable = await ensurePocketBase();
  
  console.log('Starting PocketBase server...');
  const pb = spawn(pbExecutable, ['serve'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  
  pb.on('error', (error) => {
    console.error('Failed to start PocketBase:', error.message);
    process.exit(1);
  });
  
  pb.on('close', (code) => {
    console.log(`PocketBase process exited with code ${code}`);
    process.exit(code);
  });
  
  process.on('SIGINT', () => {
    pb.kill('SIGINT');
  });
  
  process.on('SIGTERM', () => {
    pb.kill('SIGTERM');
  });
}

startPocketBase();
