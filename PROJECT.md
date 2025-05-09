# Roadmap and features

## MVP

- [x] Online buying: 
    - [x] Move the link attribute to the categories
    - [x] Add the function to the categories (in stock management and categories)
- [x] remove setup page
    - [x] Initialize widget on each page that is empty
    - [x] Reset button in the categories page (top)
- [x] Categories
    - [x] Edit categories: add link, change unit, avg expiry
    - [x] Remove categories
    - [x] Add categories 
- [x] Export + import files (categories + stock)
- [x] Landing page (basic draft)
- [x] Landing page in the 3 languages at least
- [x] Put the downloadable artefacts on a public repository
- [x] Adapt the landing page for public release (link to feature/roadmap, FAQ, About, Contact, Help)
- [ ] Logo and app title is still "Electron"
- [ ] Tests: on iPad + on Windows for installation
- [ ] Language: store the selected language preference
- [ ] Minimum, privacy focused analytics

## Recommendations

- [x] Stock item type model + recommended model
- [x] Recommended screen from static file
- [x] Load and save to disk / localstorage
- [ ] Add a simple calculator based on nb of people in house

## Current stock

- [x] Model for current stock
- [x] Editor for current stock, assignment to categories
    - [x] items can be generic or precise
    - [x] multiple items per category possible
- [ ] Add a way to tell when a stock item has been last checked (update the lastCheck + nextCheck fields)
- [ ] Differentiate products for consumptions (expiry date) and for usage (check date)
    - [ ] Check expiry date for consumption products that might be expired according to `lastCheck + avg expiry = expired potentially`
    - [ ] Check date for items without expiry (`lastCheck + avg expiry = recheck!`)

## Shopping list

- [x] Compute a shopping list from category
- [x] Make it printable
- [x] Add default units to each item

## Admin

- [x] Add possibility to delete the file to restart from scratch

## Misc

- [x] Multi-language (FR, DE, EN)
- [ ] better error display management
- [ ] Add a profile ID (prepare for login)
- [ ] Redesign
- [ ] Distribution
    - [x] rename repo
    - [x] use electron-builder to build and publish artefacts on Gitlhub (separate repo for now?)
    - [x] have it as a runner on gihub. Simple process: main goes to netlify, release tags create distributables
    - [x] document process: version inc + deploy
    - [ ] Sign code to have auto-updates?
- [ ] Logo for the app, and better branding

## Later 

### Misc

- [ ] Country specific calculator?
- [ ] Recommendations for basic readyness
- [ ] Blog / news / events / how tos (partnerships?)

### Mobile app

- [ ] Very simple mobile app? https://capacitorjs.com/
- [ ] QR Code to get shopping list on Mobile 
- [ ] QR code to be able to manage stock on mobile

### Cloud only, once identified

- [ ] Notifications
    - [ ] Notification center in the interface
    - [ ] Mobile? SMS? Email? -> Stock expiry and warnings
- [ ] Social recommendation: what other are buying for default categories (require unique ID of categories)
- [ ] One click supply for specific items? (drop shipping API? Partnership? -> Swiss usual shops)

# Known bugs

- [ ] Fix: electron language detection