# 🚀 Quick Test Guide - Seller Product CRUD + Advanced Features

## Prerequisites
- ✅ Dev server running: `npm run dev`
- ✅ Seller account with `role='seller'` and `verified=true`
- ✅ Logged in as seller
- ✅ Navigate to: `http://localhost:3000/seller/products`

---

## 5-Minute Quick Test

### Test 1: Create Product (1 min)
1. Click **"Add New Product"**
2. Fill in:
   - Name: `Test Laptop`
   - Description: `High-performance laptop`
   - Category: `Electronics`
   - Price: `45999`
   - Stock: `25`
3. **Drag & drop** an image OR click **"Add URL"** → paste: `https://via.placeholder.com/400`
4. Click **"Create Product"**
5. ✅ **Expected**: Redirects to list, product appears

### Test 2: View & Search (1 min)
1. See **4 stat cards** at top (Total Products, Inventory Value, Stock, Rating)
2. Type `"laptop"` in **search box**
3. ✅ **Expected**: Results filter instantly, shows Test Laptop
4. Clear search

### Test 3: Filters & Sort (1 min)
1. Click **"Filters"** button
2. Set **Category** → Electronics
3. Set **Sort By** → Price: Low to High
4. Click **"Apply Filters"**
5. ✅ **Expected**: Shows only Electronics, sorted by price
6. Click **"Reset"** in filter dialog

### Test 4: Bulk Operations (1 min)
1. Check **2-3 products** using checkboxes
2. Click **"Bulk Update"**
3. Set **Discount**: `15`
4. Click **"Update X Products"**
5. ✅ **Expected**: All selected products show 15% discount
6. Select same products again
7. Click **"Export CSV"**
8. ✅ **Expected**: CSV file downloads

### Test 5: Edit & Delete (1 min)
1. Click **✏️ Edit** on Test Laptop
2. Change **Name** to `Premium Test Laptop`
3. Add another image
4. Click **"Update Product"**
5. ✅ **Expected**: Changes saved, redirects back
6. Click **🗑️ Delete** on Premium Test Laptop
7. Confirm in dialog
8. ✅ **Expected**: Product deleted, list refreshes

---

## Feature Checklist

### ✅ Core CRUD
- [ ] Create product
- [ ] View product list
- [ ] Edit product
- [ ] Delete product

### ✅ Image Upload
- [ ] Drag & drop works
- [ ] Browse files works
- [ ] Add URL works
- [ ] Remove image works
- [ ] Shows up to 5 images

### ✅ Bulk Actions
- [ ] Select multiple products
- [ ] Select all checkbox works
- [ ] Bulk update works
- [ ] Bulk delete works
- [ ] Export CSV works

### ✅ Search & Filters
- [ ] Real-time search works
- [ ] Category filter works
- [ ] Price range works
- [ ] Stock status works
- [ ] Sort options work
- [ ] Reset filters works

### ✅ Statistics
- [ ] Total Products count
- [ ] Inventory Value shows
- [ ] Out of Stock count
- [ ] Average Rating shows

---

## Expected Results Summary

| Feature | What to See | Success Indicator |
|---------|-------------|-------------------|
| **Statistics** | 4 cards at top | Numbers match your products |
| **Search** | Instant filtering | Results update as you type |
| **Filters** | Dialog with options | Badge shows active filters |
| **Bulk Select** | Checkboxes & count | "X selected" appears |
| **Bulk Update** | Dialog with fields | All selected updated |
| **Export CSV** | File download | CSV with product data |
| **Image Upload** | Drag/drop area | Preview grid appears |
| **Create** | Form submission | Redirect to list |
| **Edit** | Pre-filled form | Changes persist |
| **Delete** | Confirmation dialog | Product removed |

---

## Common Issues & Solutions

### Images not loading?
- Check URL is valid and accessible
- Use HTTPS URLs
- Try placeholder: `https://via.placeholder.com/400`

### Bulk actions not working?
- Ensure at least one product is selected
- Check network connection
- Verify you're logged in as seller

### Filters not applying?
- Click "Apply Filters" button
- Check if products match criteria
- Try "Reset" and reapply

### CSV not downloading?
- Check browser download permissions
- Try different browser
- Ensure products are selected

---

## Quick URLs

- **Product List**: `/seller/products`
- **Create Product**: `/seller/products/new`
- **Edit Product**: `/seller/products/[id]/edit`
- **Seller Dashboard**: `/seller/dashboard`

---

## Test Data Suggestions

### Quick Test Products

**Product 1**:
```
Name: Premium Headphones
Category: Electronics
Price: 2999
Stock: 50
Discount: 10
```

**Product 2**:
```
Name: Cotton T-Shirt
Category: Fashion
Price: 499
Stock: 100
Discount: 0
```

**Product 3**:
```
Name: Cooking Pan Set
Category: Home & Kitchen
Price: 1599
Stock: 5
Discount: 20
```

---

## Performance Check

All operations should be:
- ⚡ Search: Instant (<100ms)
- ⚡ Filter: Fast (<200ms)
- ⚡ Create: Quick (1-2s)
- ⚡ Update: Quick (1-2s)
- ⚡ Delete: Quick (1-2s)
- ⚡ Bulk: Reasonable (2-5s for 10 items)

---

## Mobile Testing

### Quick Mobile Test
1. Open browser DevTools
2. Toggle device toolbar (mobile view)
3. Test same features
4. Check:
   - [ ] Stats cards stack vertically
   - [ ] Filter dialog works
   - [ ] Buttons are touchable
   - [ ] Product cards stack
   - [ ] Images responsive

---

## Success Criteria

✅ **All 5 quick tests pass**
✅ **No errors in console**
✅ **All features responsive**
✅ **Data persists correctly**
✅ **UI updates immediately**

---

## Need Help?

Check documentation:
- `SELLER_CRUD_IMPLEMENTATION.md` - Technical details
- `ADVANCED_FEATURES_COMPLETE.md` - Feature descriptions
- `SELLER_PRODUCT_GUIDE.md` - User guide
- `FINAL_IMPLEMENTATION_SUMMARY.md` - Complete overview

---

**Total Test Time**: ~5 minutes
**Features Tested**: 20+
**Status**: Ready for testing! 🎉
