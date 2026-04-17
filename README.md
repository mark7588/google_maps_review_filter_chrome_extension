# Google Maps Review Enhancer 

Welcome to the **Google Maps Review Enhancer **! This Chrome extension helps you easily collect and analyze reviews from any place on Google Maps. It automatically finds the top reviewers, calculates a refined rating score, and gives you a neat, exportable summary. 

This guide will show you exactly how to install and use it, even if you have no coding experience!

---

## 🛠️ How to Set Up the Extension

Since this extension isn't in the Chrome Web Store yet, you can easily install it manually using Chrome's "Developer mode". Just follow these simple steps:

1. **Download the Files**: 
   - Click the green **"Code"** button at the top right of this GitHub page and select **"Download ZIP"**.
   - Find the downloaded ZIP file on your computer and extract (unzip) it to a standard folder (like your Documents or Desktop).

2. **Open Chrome Extensions**:
   - Open your Google Chrome browser.
   - In the top right corner, click the three dots (`⋮`) to open the menu.
   - Go to **Extensions** > **Manage Extensions**.
   - *(Alternatively, type `chrome://extensions/` into your search bar and hit Enter.)*

3. **Turn on Developer Mode**:
   - In the top right corner of the Extensions page, you will see a toggle switch labeled **"Developer mode"**. Click it so it turns blue.

4. **Load the Extension**:
   - Once Developer mode is on, three new buttons will appear at the top left.
   - Click the **"Load unpacked"** button.
   - A file window will pop up. Select the unzipped folder you created in Step 1 (make sure to select the main folder that contains all the files, not the individual files themselves). 
   - Click **"Select"** (or "Open").

**That's it!** You should now see the extension icon (a puzzle piece or our custom icon) in the top right of your Chrome browser. 

> **Tip:** Click the "Puzzle piece" icon next to your Chrome search bar and click the "Pin" icon next to Google Maps Review Extractor so it's always visible for easy access!

---

## 🚀 How to Use the Extension

Using the extractor is as simple as 1-2-3:

1. **Go to Google Maps**:
   - Open Chrome and navigate to Google Maps (maps.google.com).
   - Search for the business or location you want to analyze.
   
2. **Open the Reviews**:
   - Click on the **"Reviews"** tab for that location. Make sure you can see the list of reviews on your screen.

3. **Run the Extractor**:
   - Click on our extension icon in the top right corner of your browser.
   - A small window will pop up. You can adjust settings like "Scan Depth" (how many reviews you want it to look through). 
   - Click the **"Start Extraction"** button.

The extension will now scroll through the reviews for you, do its calculations, and present you with a beautifully organized list of the top reviewers, a curated average rating, and options to save the data!

---

## 📁 Files Needed for this Extension

If you ever need to verify your files or share them with someone else, here is a breakdown of all the essential files that make this extension work. These files **must** all be kept together in the same folder:

- `manifest.json`: The "ID card" of the extension. It tells Chrome what the extension is, its version, and what permissions it needs to run.
- `popup.html`: The visual layout of the small window you see when you click the extension icon.
- `popup.css`: The styling file that makes the popup window look good (colors, buttons, layout).
- `popup.js`: The underlying logic that connects the buttons you click in the popup to their respective actions.
- `content.js`: The core script that works behind the scenes. It acts as the bridge that reads the active Google Maps webpage to gather the review data.
- **Icons (`icon16.png`, `icon48.png`, `icon128.png`)**: The images used for the extension's logo in your browser window and menus.

---

**Enjoy extracting and making better data-driven decisions!** If you have any questions or get stuck, feel free to reach out.
