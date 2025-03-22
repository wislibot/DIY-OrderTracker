/**
 * Download-for-offline script for Shop Order Tracker
 * 
 * This script uses the wget command to download a local copy of the website
 * for offline access. It downloads all necessary files including HTML, CSS,
 * JavaScript, and assets.
 */

import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  // The URL of your local development server
  baseUrl: 'http://localhost:5173',
  // The directory where the offline version will be saved
  outputDir: path.join(__dirname, '..', 'offline-version'),
  // The wget command with options
  wgetCommand: 'wget',
  // The options for wget
  wgetOptions: [
    '--mirror',                // Mirror the website
    '--convert-links',         // Convert links to work offline
    '--adjust-extension',      // Add extensions to files
    '--page-requisites',       // Get all assets required to display the page
    '--no-parent',             // Don't follow links to the parent directory
    '--no-host-directories',   // Don't create host directories
    '--directory-prefix',      // Specify the output directory
    '--restrict-file-names=windows', // Make filenames compatible with Windows
    '--no-check-certificate',  // Don't check SSL certificates
    '--no-clobber',            // Don't overwrite existing files
    '--user-agent="Mozilla/5.0"', // Set user agent
  ],
};

/**
 * Ensures the output directory exists
 */
function ensureOutputDirExists() {
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
    console.log(`Created output directory: ${config.outputDir}`);
  }
}

/**
 * Checks if wget is installed and available in the PATH
 * @returns {Promise<boolean>} True if wget is installed, false otherwise
 */
function checkWgetInstalled() {
  return new Promise((resolve) => {
    exec('wget --version', (error) => {
      resolve(!error);
    });
  });
}

/**
 * Provides detailed instructions for installing wget based on the operating system
 */
function printWgetInstallInstructions() {
  console.error('Error: wget is not installed or not in your PATH.');
  console.error('Please install wget using one of these methods:');
  
  // Windows-specific instructions with multiple options
  console.error('For Windows:');
  console.error('  Option 1: Use Chocolatey (recommended) - https://chocolatey.org/');
  console.error('    > choco install wget');
  console.error('  Option 2: Download the binary directly from https://eternallybored.org/misc/wget/');
  console.error('    > Extract the wget.exe file to a directory in your PATH');
  console.error('  Option 3: Use winget if available on your system');
  console.error('    > winget install wget');
  
  console.error('For macOS:');
  console.error('  > brew install wget');
  
  console.error('For Linux:');
  console.error('  > sudo apt install wget  (Debian/Ubuntu)');
  console.error('  > sudo dnf install wget  (Fedora)');
  console.error('  > sudo pacman -S wget   (Arch Linux)');
  
  console.error('After installation, restart your terminal and try again.');
  console.error('See OFFLINE-ACCESS.md for more information.');
}

/**
 * Builds the wget command with all options
 */
function buildWgetCommand() {
  const options = [...config.wgetOptions];
  
  // Remove the duplicate --directory-prefix option if it exists
  const directoryPrefixIndex = options.indexOf('--directory-prefix');
  if (directoryPrefixIndex !== -1) {
    options.splice(directoryPrefixIndex, 1);
  }
  
  options.push(`--directory-prefix=${config.outputDir}`);
  
  return `${config.wgetCommand} ${options.join(' ')} ${config.baseUrl}`;
}

/**
 * Executes the wget command
 */
async function executeWget() {
  const isWgetInstalled = await checkWgetInstalled();
  
  if (!isWgetInstalled) {
    // Use the detailed instructions function instead of inline messages
    printWgetInstallInstructions();
    return;
  }
  
  const command = buildWgetCommand();
  console.log('Executing command:', command);
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    
    if (stderr) {
      console.log(`Wget output: ${stderr}`);
    }
    
    console.log('Download completed successfully!');
    console.log(`Offline version saved to: ${config.outputDir}`);
    console.log('You can now access the website offline by opening index.html in the offline-version directory.');
  });
}

/**
 * Main function
 */
async function main() {
  console.log('Starting download for offline access...');
  ensureOutputDirExists();
  await executeWget();
}

// Run the script
main().catch(error => {
  console.error('An unexpected error occurred:', error);
  process.exit(1);
});