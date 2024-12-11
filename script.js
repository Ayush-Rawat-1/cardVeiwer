// Function to get the query parameter (sharedId) from the URL
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to fetch card data from the backend
function fetchCardData(id) {
    fetch(`http://localhost:3000/user/sharedCard/${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.styles && data.frontSide && data.backSide) {
                // If card data is valid, display the card
                applyStyles(data.styles);  // Apply styles received in HTML format
                displayCard(data);         // Display the card with front and back content
            } else {
                document.getElementById('card-container').innerHTML = '<p>Card not found.</p>';
            }
        })
        .catch(error => {
            document.getElementById('card-container').innerHTML = '<p>Error loading card data.</p>';
        });
}

// Function to apply styles to the page dynamically
function applyStyles(stylesHtml) {
    // Check if stylesHtml already contains <style> tags
    const styleTagRegex = /<style>(.*?)<\/style>/s;
    const match = stylesHtml.match(styleTagRegex);

    if (match && match[1]) {
        // If a <style> tag is found, extract the content (CSS) inside the <style> tag
        const cssContent = match[1];
        
        // Create a new <style> element
        const styleElement = document.createElement('style');
        
        // Set the innerHTML of the <style> element to the extracted CSS content
        styleElement.innerHTML = cssContent;
        
        // Append the <style> element to the <head> of the document
        document.head.appendChild(styleElement);
    } else {
        // If no <style> tag found, assume that styles are in plain CSS format
        console.warn('No <style> tag found in styles');
    }
}

// Function to display the card with front and back side side by side
function displayCard(data) {
    // Directly insert HTML content for frontSide and backSide
    document.getElementById('frontSide').innerHTML = data.frontSide;
    document.getElementById('backSide').innerHTML = data.backSide;

    // Apply styles if available
    const cardContainer = document.querySelector('.card-container');
    if (data.styles) {
        if (data.styles.cardWidth) {
            cardContainer.style.width = data.styles.cardWidth;
        }
        if (data.styles.cardHeight) {
            cardContainer.style.height = data.styles.cardHeight;
        }
    }
}

// Main function to run when the page loads
window.onload = function() {
    const sharedId = getQueryParameter('sharedId');
    if (sharedId) {
        fetchCardData(sharedId); // Fetch data based on sharedId from URL
    } else {
        document.getElementById('card-container').innerHTML = '<p>No sharedId parameter found in the URL.</p>';
    }
};
