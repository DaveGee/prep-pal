# Tasks

## Misc

- [] better error display management

## Recommendation

- [x] Stock item type model + recommended model
- [x] Recommended screen from static file
- [x] Load and save to disk / localstorage
- [] Calculator (simple, or based on confederation) -> generate default category list
- [] Instead of creating the recommendation file by default, add a "wizard" type of module to create it (with the calculator)

## Current stock

- [x] Model for current stock
- [x] Editor for current stock, assignment to categories
    - [x] items can be generic or precise
    - [x] multiple items per category possible
- [] Add a way to tell when a stock item has been last checked (update the lastCheck + nextCheck fields)
- [] Differentiate products for consumptions (expiry date) and for usage (check date)
    - [] Check expiry date for consumption products that might be expired according to `lastCheck + avg expiry = expired potentially`
    - [] Check date for items without expiry (`lastCheck + avg expiry = recheck!`)


### Phase 2

- [] QR Code for mobile version?
    - [] How will mobile sync back info? Online?


## Shopping list

- [x] Compute a shopping list from category
- [] Make it printable
- [x] Add default units to each item
- [] QR Code to get shopping list on Mobile 
    - [] Very simple mobile app? https://capacitorjs.com/

## Setup screen

- [] Configure notifications
- [] Shopping setup. Eg links or specific products for specific categories
- [] Category setup -> add override categories that can be used on Recommendation