# Seller Product Management - Quick Guide

## Getting Started

To manage your products, navigate to: **`/seller/products`**

## Adding a New Product

1. Click the **"Add New Product"** button
2. Fill in the product details:
   - **Product Name** * (required)
   - **Description** * (required)
   - **Category** * (required) - Select from dropdown
   - **Price (₹)** * (required)
   - **Discount (%)** (optional, 0-100)
   - **Stock** * (required)
   - **Image URLs** (optional) - Enter comma-separated URLs
3. Click **"Create Product"**
4. You'll be redirected to your product list

## Editing an Existing Product

1. On your product list, click the **✏️ Edit** button next to the product
2. Modify any fields you want to update
3. Click **"Update Product"**
4. You'll be redirected to your product list with the changes saved

## Deleting a Product

1. On your product list, click the **🗑️ Delete** button next to the product
2. Confirm the deletion in the popup dialog
3. The product will be removed from your list immediately

## Product Information Display

Each product card shows:
- **Product Name** (large text)
- **Category** (small gray text)
- **Description** (truncated preview)
- **Price** in ₹
- **Discount** (if applicable, shown in green)
- **Stock Level** 
  - Green text = In stock
  - Red text = Out of stock
- **Rating** (with star ⭐)

## Categories Available

Choose from these 10 categories:
- Electronics
- Fashion
- Home & Kitchen
- Books
- Sports
- Toys
- Beauty
- Automotive
- Groceries
- Health

## Tips & Best Practices

### Product Names
- Be clear and descriptive
- Include key features or brand names
- Example: "Samsung Galaxy S23 - 256GB"

### Descriptions
- Write detailed descriptions
- Highlight key features and benefits
- Include specifications
- Mention what's included

### Pricing
- Set competitive prices
- Use discounts strategically for promotions
- Update prices regularly based on market

### Stock Management
- Keep stock levels accurate
- Update immediately after sales
- Set alerts for low stock items

### Images
- Use high-quality product images
- Multiple angles are better
- Use secure HTTPS URLs
- Example format: `https://example.com/image1.jpg, https://example.com/image2.jpg`

## Common Questions

**Q: Can I delete a product that has orders?**
A: Yes, but the product information will be preserved in existing orders.

**Q: How do I add multiple images?**
A: Enter image URLs separated by commas in the Images field.

**Q: Can I change the category after creating a product?**
A: Yes, you can edit any field including the category.

**Q: What happens if I set stock to 0?**
A: The product will still be visible but customers won't be able to purchase it.

**Q: Do I need to be verified to add products?**
A: Yes, only verified sellers can create products. Contact admin for verification.

**Q: Can I see products from other sellers?**
A: No, you can only view and manage your own products on this page.

## Keyboard Shortcuts

- **Cancel Actions**: Press `Escape` to close dialogs
- **Form Navigation**: Use `Tab` to move between form fields
- **Submit Forms**: Press `Enter` in any text field to submit

## Security Notes

- ✅ Only you can view, edit, or delete your products
- ✅ All changes are immediately saved to the database
- ✅ Your seller ID is automatically attached to products
- ✅ Products are secured with database-level permissions

## Need Help?

If you encounter issues:
1. Check that you're logged in
2. Verify your seller account is approved
3. Ensure all required fields are filled
4. Check your internet connection
5. Contact support if problems persist

## Navigation

- **View All Products**: `/seller/products`
- **Add New Product**: `/seller/products/new`
- **Edit Product**: `/seller/products/[product-id]/edit`
- **Seller Dashboard**: `/seller/dashboard`
- **Orders**: `/seller/orders`
- **Analytics**: `/seller/analytics`

---

Happy Selling! 🎉
