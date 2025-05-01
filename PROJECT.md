# Tasks for MVP

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
- [ ] Add a simple calculator based on nb of people in house
- [ ] Check if it works well on tablet (interactions)
- [ ] Export + import files (categories + stock)
- [x] Landing page (basic draft)

## Recommendation

- [x] Stock item type model + recommended model
- [x] Recommended screen from static file
- [x] Load and save to disk / localstorage

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

## Setup screen

- [x] Add possibility to delete the file to restart from scratch

## Misc

- [x] Multi-language (FR, DE, EN)
- [ ] better error display management
- [ ] Add a profile ID (prepare for login)
- [ ] Complete redesign
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
- [ ] Blog / news / events / how tos (partnerships?)

### Mobile app

- [ ] Very simple mobile app? https://capacitorjs.com/
- [ ] QR Code to get shopping list on Mobile 
- [ ] QR code to be able to manage stock on mobile

### Cloud only, once identified

- [ ] Notifications
    - [ ] Notification center in the interface
    - [ ] Mobile? SMS? Email? -> check stock and expiry and warn
- [ ] Social recommendation: what other are buying for default categories (require unique ID of categories)
- [ ] One click supply for specific items? (drop shipping API?)