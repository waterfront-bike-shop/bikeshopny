# SHOP API DOC for shop API INTEGRATION


## ITEMS

# Get 10 items (default)
GET /api/shop/items

# Get specific item by ID
GET /api/shop/items?itemId=12345

# Get 25 items
GET /api/shop/items?limit=25

# Combined params (itemId takes precedence)
GET /api/shop/items?itemId=12345&limit=25

## ITEMS WITH IMAGES

# Get 10 items (default)
GET /api/items-with-images

# Get specific item by ID
GET /api/items-with-images?itemId=12345

# Get 25 items
GET /api/items-with-images?limit=25

# Combine params (itemId takes precedence, limit ignored)
GET /api/items-with-images?itemId=12345&limit=25

## TAGS

# Get all tags
GET /api/shop/tags

# Get specific tag by ID
GET /api/shop/tags?tagId=4

# Search tags by name (case-insensitive, partial match)
GET /api/shop/tags?name=featured
GET /api/shop/tags?name=new
GET /api/shop/tags?name=webstore


## CATEGORIES

# Get ALL categories (no limit)
GET /api/shop/categories

# Get specific category by ID
GET /api/shop/categories?categoryId=123


---

### TO-DO: Add in tags like this in Lighjtspeed to pull specific curated selections for frontend:
ux:featured	        Highlight in carousels, collections, etc.
ux:homepage	        Appear in special homepage section
ux:sale	            Temporary promotion, even if price doesn't change
ux:hide-from-web    Don't show this item in frontend UI
ux:archive	        Soft-deprecated but not technically "archived" in shop