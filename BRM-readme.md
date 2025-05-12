Settings -> General -> Store Details 
  - bike shop logo
  - address and lat/long
  - phone
  - IMPT! Store Waiver -> DO YOU HAVE A WAIVER FOR THE STORE?

Settings -> General -> Opening Hours
  - What are your hours?

Settings > General > Reservation Settings 
  - Set to 1d so that is the one kind of rental you can book

Inventory -> Price Management -> Price Groups 
  - Set 'Billable Day' to 'Full' (by day, not 24 hr period)

Payment
  - Stripe: https://brm2.bikerentalmanager.com/support/solutions/articles/42000068983-setting-up-stripe-as-your-payment-processor
  
Connect to Lightspeed R
  - https://brm2.bikerentalmanager.com/support/solutions/articles/42000070089-lightspeed-r-integration-configuration
  - 11111111111 eleven 1s for the ERM

Set up min and max rental durations
  1. https://brm2.bikerentalmanager.com/support/solutions/articles/42000084061-min-max-rental-duration-by-product-family
  2. Go to Settings -> optional features -> Online buffers + Online Rental duration

## Stripe

1. Integration instructions: https://brm2.bikerentalmanager.com/support/solutions/articles/42000068983-setting-up-stripe-as-your-payment-processor
  - Test card number / Card Brand: 4242 4242 4242 4242	Visa
2. Refunds: https://brm2.bikerentalmanager.com/support/solutions/articles/42000074030-refunding-via-stripe
   1. Go into reservation. 
   2. Actions > More > "Stripe Refunds"
   3. Manually change the 'Stage' of the reservation from cancel the reservation
   
## Waiver

- Write/Update waiver text -> https://us.bikerentalmanager.com/app/settings/general/store-details
- Activate signature requirement: on the 'confirmation' email https://us.bikerentalmanager.com/app/settings/notifications/what -> check the signature and online signing here

## Terms and Conditions

https://brm2.bikerentalmanager.com/support/solutions/articles/42000073586-your-terms-and-conditions



We would recommend at the minimum you publish your full terms and conditions in these places:

    on your website 
    at your point of sale
    on your online booking wizard  (BRM)

BRM provides a facility for your customers to read your T&C's when they are making a booking and check a box to confirm they have read and understood them.

You Copy & Paste your T&C's here:

settings > Customer Booking (Online) > Terms





Meeting Notes 4/11/2025

My Questions
- really 50k for the bike image?
- low-res logo on emails
- what is capacity vs. items? on the rentals for inventory?
- on the online booking wizard, default duration is 2h. How can we make that 1 day
- Stripe?
- How do we reserve online, but only pay in person
- -We want to only sell 1 day booking (i.e. all day Tuesday) -- I think I set that up, but we still get 2h options when in a booking screen -- would like to get that set up and see where those 'live' in the setup of the system.
- Go over how to make a booking that is not a real reservation but a hold of sorts to make it inactive for a specific day.
- Check the Lightspeed R integration (already connected)
- Integrate Stripe, and talk about how it is used for online bookings. We have an account in test mode.
- Currently, we have different bike reservation items in Lightspeed for walk-ins, how do we reconcile those booking with the ones from BRM so we don't overbook?
- Walk through of a rental online to picking up bike in shop.
- Probably many more questions.

Meeting Jeremy Maple Cyclery:
Actions
- Set to Tax Exclusive - Set and Forget
- Settings > Customer Booking (Online) > Control 
  - pre auth 7 days
  - hold is  a security deposit? 
  - hold manual and is done in booking ->  a 7 day limitation. AUTOMATED? FOLLOW UP WHERE
- e.com -> booking page is an i-frame. -> NOT PART OF IFRAME
- save on processing fees/accounting. 
- SOME BRM/STRIPE as rental
- C/N TALK -> INTEGRATION WORTH IT?
-  walkin vs/ advance 
-  store hours
   -  2 sets of settings back office/online hours Could set 10:15 AM - 6:45 PM
-  NEW CUSTOMER BOOKING PAGE CBP
-  > Pre select Next Available Date
-  > Show Product Cards/Cat Cards (various categories of bikes)
-  > 
-  
Extras, per Product.
Ask for rider info per product -> bike fit for road bikes. 

Payment model:
- UBB model: Every feature -> turn on for one weekend. 
- Annual Subscription -> Bronze/$50 1 year Silver 100 $2k
- OTHER MODEL: pay per reservation

US: add in waiver, copy and paster (more complicated smart waiver)

regular ->




---
# MISC


# ----- NOTES 4/15/2025 ------------------------
## Add Events with module
- SETTING > OPTIONAL MODULES > EVENTS > NEW DETAIL
- Add Title, etc.
- Create Blocker Booking -- 
1. Create duplicate listings for the higher price items. 
2. Virtual inventory
   1. Product Family level (green 1st child level)
   2. Inventory to TAE -> inventory Tour and Experience --> This way it doesn't count against your total for billing
3. FYI -> hover over image and SRC in lower right corner to find source URL. 

4. Update Settings > Notifications > What > Content: 
   1. For 
   2. Add in terms of condition for event itself 
  3. ref allspeed.com to take a look at their ski services and their boot fittings. They've been using events for years. Only appts online. 

5. Blocker Booking: 
  1. Set time range
  2. Seperate booking per category (keep it manageable)
  3. Who > FN Blocker LN Booking (but up to you)
  4. Leave as Provisional Booking (real booking, no financial stuff tied to it)


HOMEWORK:
EVENTS DETAILS AND TERMS AND CONDITIONS

SETTINGS > CUSTOMER BOOKING ONLINE > CUSTOMIZATION --> PRIMARY/SECONDAREY (BUTTONS) 

WAIVERS-> 

https://us.bikerentalmanager.com/book.html?shop=waterfrontbicycleshop&event_ref=5%20Boro%20Bike%20Tour%202025

Multiple pricing in future.
Discount pricing/one time use/product/customer, etc. 
SMS in future...

MAKE A DISCOUNT MODE. 

AUTO_CANCEL-> off/on ->

# TODO!!!!!!!
WAIVER https://us.bikerentalmanager.com/app/settings/general/store-details
UNDER CONFIRMED https://us.bikerentalmanager.com/app/settings/notifications/what -> signature and online here
PRE RENTAL 6am day of the rental, but 30 days out, no email. 
Stripe, set up the payment options you want. 

OK, for non cc payments on Stripe:
1st thing to do. Add card info into Stripe-> Add credit card 
Payment type - pre-auth i.e. value of bicycle or part More so on Road Bike Rentals, couldn't think of fair price. Most shops hold $100-200 per bike. What is the deducatable
  Hold auto releases after 7 days. Or you clease on x to release funds
  Hit capture button to capture.  or edit


