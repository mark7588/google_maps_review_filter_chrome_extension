if (window.gmapsReviewExtractorListener) {
    chrome.runtime.onMessage.removeListener(window.gmapsReviewExtractorListener);
}

window.gmapsReviewExtractorListener = function(request, sender, sendResponse) {
    if (request.action === 'extract') {
        extractReviews(request.maxScrolls, sendResponse);
        return true; 
    }
};

chrome.runtime.onMessage.addListener(window.gmapsReviewExtractorListener);

async function extractReviews(maxScrolls, sendResponse) {
    try {
        let reviewElements = document.querySelectorAll('.jftiEf'); // common class for reviews
        if (reviewElements.length === 0) {
            sendResponse({ error: "No reviews found. Are you on the 'Reviews' tab of a place?" });
            return;
        }

        let scrollContainer = getScrollableParent(reviewElements[0]);
        if (!scrollContainer) {
            scrollContainer = window;
        }

        for (let i = 0; i < maxScrolls; i++) {
            if (scrollContainer === window) {
                window.scrollTo(0, document.body.scrollHeight);
            } else {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
            await sleep(1000);
        }

        reviewElements = document.querySelectorAll('.jftiEf');
        const parsedReviews = [];

        for (let el of reviewElements) {
            try {
                // Name often in an element wrapper or aria-label of parent link
                let name = "Unknown";
                const nameEl = el.querySelector('.d4r55');
                if (nameEl) name = nameEl.textContent.trim();

                // Contributions count
                // Usually an element like class="RfnDt" containing "150 reviews"
                let contributions = 0;
                const statsEl = el.querySelector('.RfnDt') || el;
                // fallback to finding any text with 'reviews'
                const matchOpts = [
                    statsEl.textContent.match(/([\d,\.]+)\s+(reviews?)/i),
                    statsEl.innerHTML.match(/>([\d,\.]+)\s+reviews?</i)
                ];
                
                for(let m of matchOpts) {
                    if (m && m[1]) {
                        contributions = parseInt(m[1].replace(/[,.]/g, ''), 10);
                        if (!isNaN(contributions)) {
                            break;
                        } else {
                            contributions = 0;
                        }
                    }
                }

                // Rating (Stars)
                let rating = 0;
                const starEl = el.querySelector('[aria-label*="star"]') || el.querySelector('.kvMYJc');
                if (starEl) {
                    const starText = starEl.getAttribute('aria-label');
                    if (starText) {
                        const match = starText.match(/(\d([\.,]\d)?)\s+star/i);
                        if (match) {
                            rating = Math.round(parseFloat(match[1].replace(',', '.')));
                        }
                    }
                }

                // Review Text
                let text = "";
                const textEl = el.querySelector('.wiI7pd') || el.querySelector('.MyEned');
                if (textEl) {
                    text = textEl.textContent.trim();
                }

                // Append if rating is present
                if (rating > 0) {
                    parsedReviews.push({ name, contributions, rating, text });
                }
            } catch (err) {
                console.warn("Failed to parse a single review, continuing:", err);
            }
        }

        sendResponse({ reviews: parsedReviews });
    } catch (e) {
        sendResponse({ error: e.message });
    }
}

function getScrollableParent(node) {
    if (node == null) {
        return null;
    }
    if (node.scrollHeight > node.clientHeight) {
        const style = window.getComputedStyle(node);
        if (style.overflowY === 'auto' || style.overflowY === 'scroll' || style.overflowY === 'overlay') {
            return node;
        }
    }
    return getScrollableParent(node.parentNode);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
