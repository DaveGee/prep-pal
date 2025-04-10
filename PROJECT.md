# Tasks for MVP

- [] Online buying: 
    - [] Move the link attribute to the categories
    - [] Add the function to the categories (in stock management and categories)
- [] remove setup page
    - [] Initialize widget on each page that is empty
    - [] Reset button in the categories page (top)
    - [] Database files information in the menu?
- [] Categories
    - [] Edit categories: add link, change unit, avg expiry
    - [] Remove, add categories
- [] Add a simple calculator based on nb of people in house
- [] Check if it works well on tablet (interactions)
- [] Export + import files (categories + stock)
- [] Landing page

# Previous

## Recommendation

- [x] Stock item type model + recommended model
- [x] Recommended screen from static file
- [x] Load and save to disk / localstorage

## Current stock

- [x] Model for current stock
- [x] Editor for current stock, assignment to categories
    - [x] items can be generic or precise
    - [x] multiple items per category possible
- [] Add a way to tell when a stock item has been last checked (update the lastCheck + nextCheck fields)
- [] Differentiate products for consumptions (expiry date) and for usage (check date)
    - [] Check expiry date for consumption products that might be expired according to `lastCheck + avg expiry = expired potentially`
    - [] Check date for items without expiry (`lastCheck + avg expiry = recheck!`)

## Shopping list

- [x] Compute a shopping list from category
- [x] Make it printable
- [x] Add default units to each item

## Setup screen

- [x] Add possibility to delete the file to restart from scratch

## Misc

- [x] Multi-language (FR, DE, EN)
- [] better error display management
- [] Add a profile ID (prepare for login)
- [] Complete redesign

## Later 

### Mobile app

- [] Very simple mobile app? https://capacitorjs.com/
- [] QR Code to get shopping list on Mobile 
- [] QR code to be able to manage stock on mobile

### Cloud only, once identified

- [] Notifications (mobile? SMS? Email?) -> check stock and expiry
- [] Social recommendation: what other are buying for default categories (require unique ID of categories)