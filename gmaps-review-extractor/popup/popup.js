document.addEventListener('DOMContentLoaded', () => {
    const extractBtn = document.getElementById('extract-btn');
    const exportBtn = document.getElementById('export-btn');
    const statusEl = document.getElementById('status');
    const resultsEl = document.getElementById('results');
    const newRatingEl = document.getElementById('new-rating');
    const reviewsListEl = document.getElementById('reviews-list');
    
    let extractedTopReviews = [];
  
    extractBtn.addEventListener('click', async () => {
      const maxScrolls = 50;
  
      try {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab || !tab.url.includes("google.com/maps")) {
          statusEl.textContent = "Error: Not a Google Maps page.";
          return;
        }
  
        extractBtn.disabled = true;
        statusEl.textContent = "Injecting script...";
  
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['scripts/content.js']
        });
  
        statusEl.textContent = "Scrolling & parsing... Please wait.";
  
        chrome.tabs.sendMessage(tab.id, { action: "extract", maxScrolls }, (response) => {
          extractBtn.disabled = false;
          
          if (chrome.runtime.lastError) {
            statusEl.textContent = "Error communicating with tab. Make sure page is fully loaded.";
            console.error(chrome.runtime.lastError);
            return;
          }
  
          if (response && response.error) {
            statusEl.textContent = "Error: " + response.error;
            return;
          }
  
          if (response && response.reviews) {
            processData(response.reviews);
          }
        });
      } catch (e) {
        extractBtn.disabled = false;
        statusEl.textContent = "Extension error occurred.";
        console.error(e);
      }
    });
  
    exportBtn.addEventListener('click', () => {
      if (extractedTopReviews.length === 0) return;
      
      const headers = ["Reviewer Name", "Contribution Count", "Rating", "Review Text"];
      const rows = extractedTopReviews.map(r => {
        const safeText = (r.text || "").replace(/"/g, '""');
        return `"${r.name}","${r.contributions}","${r.rating}","${safeText}"`;
      });
      
      const csvContent = [headers.join(","), ...rows].join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'expert_google_maps_reviews.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  
    async function processData(reviews) {
      if (reviews.length === 0) {
        statusEl.textContent = "No valid reviews found.";
        return;
      }
  
      // Sort by contribution count descending
      reviews.sort((a, b) => b.contributions - a.contributions);
  
      // Get top 30
      extractedTopReviews = reviews.slice(0, 30);

      statusEl.textContent = "Translating reviews... Please wait.";
      for (let r of extractedTopReviews) {
          r.text = await translateTextToEnglish(r.text);
      }
      statusEl.textContent = `Found ${reviews.length} total reviews. Rating compiled!`;
  
      // Calculate average rating
      const totalRating = extractedTopReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = totalRating / extractedTopReviews.length;
  
      newRatingEl.textContent = avgRating.toFixed(1);
      
      reviewsListEl.innerHTML = "";
      extractedTopReviews.forEach(r => {
        const li = document.createElement('li');
        li.className = 'review-item';
        
        const starsStr = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
        
        li.innerHTML = `
          <div class="review-header">
            <span class="review-name">${escapeHTML(r.name)}</span>
            <span class="review-stats">${r.contributions} contribs</span>
          </div>
          <div class="review-stars">${starsStr}</div>
          <div class="review-text">${escapeHTML(r.text)}</div>
        `;
        reviewsListEl.appendChild(li);
      });
  
      resultsEl.classList.remove('hidden');
    }
  
    function escapeHTML(str) {
      return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
          }[tag] || tag)
      );
    }

    async function translateTextToEnglish(text) {
      if (!text || text.trim() === '') return text;
      try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url);
        const data = await response.json();
        
        let translatedText = '';
        if (data && data[0]) {
          for (let part of data[0]) {
            if (part[0]) {
              translatedText += part[0];
            }
          }
          return translatedText;
        }
        return text;
      } catch (error) {
        console.error("Translation error:", error);
        return text;
      }
    }
  });
