# Prep pal

A desktop and web application to help you manage your prepper stock

Built with Electron and React.

## INSTALLATION

1. Install Node.js and npm if you haven't already
2. Clone this repository
3. Open terminal in the project folder
4. Run: `npm install`

## RUNNING IN DEVELOPMENT

### Electron development

To run the app in development mode with hot reload:

`npm run electron:serve`

This will start both the React development server and Electron app. The app will automatically reload if you make changes to the code.

### Web browser development

To run the app in the browser during development with hot reload:

`npm run start`

### Landing page

`npx serve landing`

## BUILDING FOR DISTRIBUTION 
To create installable packages:

`npm run electron:build`

This will create distribution files in the dist folder:
- Windows: Look for .exe installer in dist/
- MacOS: Look for .dmg installer in dist/
- Linux: Look for .AppImage in dist/

## TROUBLESHOOTING
If you get errors about missing modules:
1. Delete the node_modules folder
2. Run: `npm install`
3. Try running the app again

If the app won't start:
1. Make sure all Node/npm processes are stopped
2. Try running `npm run electron:serve` again

For any other issues, check the console output for error messages.
