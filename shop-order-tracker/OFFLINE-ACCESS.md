# Offline Access for Shop Order Tracker

This document provides instructions on how to create and use an offline version of the Shop Order Tracker application.

## Prerequisites

- Node.js installed on your computer
- wget command-line tool installed

### Installing wget

#### Windows
You have several options to install wget on Windows:

1. **Using Chocolatey (Recommended)**
   - Install [Chocolatey](https://chocolatey.org/) package manager
   - Open Command Prompt or PowerShell as Administrator
   - Run: `choco install wget`

2. **Direct Download**
   - Download the wget binary from [EternallyBored](https://eternallybored.org/misc/wget/)
   - Extract the wget.exe file to a directory in your PATH (e.g., C:\Windows)
   - Or extract it anywhere and add that directory to your PATH environment variable

3. **Using winget (Windows Package Manager)**
   - If you have winget available on your system
   - Run: `winget install wget`

#### macOS
- Install wget using [Homebrew](https://brew.sh/) with `brew install wget`

#### Linux
- wget is usually pre-installed on most Linux distributions
- If not, install it with your package manager:
  - Debian/Ubuntu: `sudo apt install wget`
  - Fedora: `sudo dnf install wget`
  - Arch Linux: `sudo pacman -S wget`

## Creating an Offline Version

The Shop Order Tracker application includes a script that uses wget to download a local copy of the website for offline access.

### Step 1: Start the Development Server

First, start the development server by running:

```bash
npm run dev
```

This will start the development server at http://localhost:5173 (or another port if 5173 is in use).

### Step 2: Run the Download Script

In a new terminal window, run the download script:

```bash
node scripts/download-for-offline.js
```

This script will:
1. Create an `offline-version` directory in your project folder
2. Download all necessary files from your local development server
3. Convert links to work offline
4. Save everything in the `offline-version` directory

### Step 3: Access the Offline Version

Once the download is complete, you can access the offline version by opening the `index.html` file in the `offline-version` directory with your web browser.

## How It Works

The download script uses wget with the following options:

- `--mirror`: Creates a mirror of the website
- `--convert-links`: Converts links to work offline
- `--adjust-extension`: Adds extensions to files
- `--page-requisites`: Gets all assets required to display the page
- `--no-parent`: Doesn't follow links to the parent directory
- `--no-host-directories`: Doesn't create host directories

## Customizing the Offline Version

You can customize the download script by editing the `scripts/download-for-offline.js` file:

- Change the `baseUrl` if your development server runs on a different port
- Modify the `outputDir` to save the offline version in a different location
- Add or remove wget options as needed

## Limitations

The offline version has some limitations:

1. Dynamic features that require server communication won't work
2. The service worker might not function as expected in the offline version
3. Some browser features might be restricted when running from a local file

However, thanks to the IndexedDB implementation, your data will still be accessible in the offline version.

## Troubleshooting

If you encounter issues with the offline version:

1. Make sure wget is properly installed and accessible from the command line
2. Check that the development server is running when you execute the download script
3. Look for error messages in the terminal when running the download script
4. Try opening the offline version in different browsers if one doesn't work

## Updating the Offline Version

To update your offline version after making changes to the application, simply run the download script again. The `--no-clobber` option ensures that only changed files will be updated.