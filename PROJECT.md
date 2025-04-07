# Tasks

## Recommendation

- [x] Stock item type model + recommended model
- [x] Recommended screen from static file
- [x] Load and save to disk / localstorage
- [] Calculator (simple, or based on confederation) -> generate default category list
- [] Instead of creating the recommendation file by default, add a "wizard" type of module to create it (with the calculator)
- [] Enable category edits (delete, add)

## Current stock

- [x] Model for current stock
- [x] Editor for current stock, assignment to categories
    - [x] items can be generic or precise
    - [x] multiple items per category possible
- [] Add a way to tell when a stock item has been last checked (update the lastCheck + nextCheck fields)
- [] Differentiate products for consumptions (expiry date) and for usage (check date)
    - [] Check expiry date for consumption products that might be expired according to `lastCheck + avg expiry = expired potentially`
    - [] Check date for items without expiry (`lastCheck + avg expiry = recheck!`)
- [] Check if it works well on tablet (interactions)
- [] Follow link to buy online

## Shopping list

- [x] Compute a shopping list from category
- [x] Make it printable
- [x] Add default units to each item

## Setup screen

- [] Shopping setup. Eg default links for categories, to replenish stock buying online
- [] Generate default files wizard (categories)
- [] Export + import files (categories + stock)

## Misc

- [] Multi-language (FR, DE, EN)
- [] better error display management
- [] Add a profile ID (prepare for login)
- [] Complete redesign
- [] Landing page

## Later 

### Mobile app

- [] Very simple mobile app? https://capacitorjs.com/
- [] QR Code to get shopping list on Mobile 
- [] QR code to be able to manage stock on mobile

### Cloud only

- [] Notifications (mobile? SMS? Email?) -> check stock and expiry
- [] Social recommendation: what other are buying for default categories (require unique ID of categories)