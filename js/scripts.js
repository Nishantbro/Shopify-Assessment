// js/scripts.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeImageGallery();
    initializeSizeChartModal();
    initializeProductVariants();
    initializeCompareColors();
    initializeProductTabs();
    initializeQuantitySelector();
    initializeImageZoom();
    
    // Load saved preferences
    loadSavedPreferences();
});

// Step 2: Scrollable Product Images Gallery
function initializeImageGallery() {
    const mainImage = document.getElementById('main-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const imageSrc = this.getAttribute('data-image');
            const imageAlt = this.getAttribute('data-alt');
            
            // Update main image with fade effect
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.src = imageSrc;
                mainImage.alt = imageAlt;
                mainImage.style.opacity = '1';
            }, 150);
            
            // Update active thumbnail
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Step 3: Size Chart Modal
function initializeSizeChartModal() {
    const modal = document.getElementById('size-chart-modal');
    const openButton = document.getElementById('size-chart-btn');
    const closeButton = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    
    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        firstFocusableElement.focus();
    }
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        openButton.focus();
    }
    
    openButton.addEventListener('click', openModal);
    closeButton.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
        
        if (e.key === 'Tab' && modal.classList.contains('active')) {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    e.preventDefault();
                    lastFocusableElement.focus();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    e.preventDefault();
                    firstFocusableElement.focus();
                }
            }
        }
    });
}

// Step 4: Product Variants
function initializeProductVariants() {
    const colorSwatches = document.querySelectorAll('.swatch');
    const sizeSelect = document.getElementById('size-select');
    const selectedColorElement = document.getElementById('selected-color');
    const selectedSizeElement = document.getElementById('selected-size');
    const mainImage = document.getElementById('main-image');
    
    updateSelectedVariant();
    
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', function() {
            colorSwatches.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            
            const selectedColor = this.getAttribute('data-color');
            const colorImage = this.getAttribute('data-image');
            
            if (colorImage) {
                mainImage.style.opacity = '0';
                setTimeout(() => {
                    mainImage.src = colorImage;
                    mainImage.style.opacity = '1';
                }, 150);
                
                updateThumbnailsForColor(selectedColor);
            }
            
            updateSelectedVariant();
            saveToLocalStorage('selectedColor', selectedColor);
        });
    });
    
    sizeSelect.addEventListener('change', function() {
        updateSelectedVariant();
        saveToLocalStorage('selectedSize', this.value);
    });
    
    function updateSelectedVariant() {
        const selectedColor = document.querySelector('.swatch.active').getAttribute('data-color');
        const selectedSize = sizeSelect.value;
        
        selectedColorElement.textContent = selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1);
        selectedSizeElement.textContent = selectedSize || '-';
    }
    
    function updateThumbnailsForColor(color) {
        // In a real implementation, this would update thumbnails based on color
        const thumbnails = document.querySelectorAll('.thumbnail');
        if (thumbnails.length > 0) {
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            thumbnails[0].classList.add('active');
        }
    }
}

// Step 4 Extension: Compare Colors
function initializeCompareColors() {
    const modal = document.getElementById('compare-colors-modal');
    const openButton = document.getElementById('compare-colors-btn');
    const closeButton = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    const compareSwatches = modal.querySelectorAll('.compare-swatch');
    const selectedColorsList = document.getElementById('selected-colors-list');
    
    let selectedColors = new Set(['black']); // Start with black selected
    
    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateSelectedColorsDisplay();
    }
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        openButton.focus();
    }
    
    compareSwatches.forEach(swatch => {
        swatch.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            
            if (selectedColors.has(color)) {
                selectedColors.delete(color);
                this.classList.remove('active');
            } else {
                selectedColors.add(color);
                this.classList.add('active');
            }
            
            updateSelectedColorsDisplay();
        });
    });
    
    function updateSelectedColorsDisplay() {
        selectedColorsList.innerHTML = '';
        selectedColors.forEach(color => {
            const colorElement = document.createElement('div');
            colorElement.className = 'selected-color-item';
            colorElement.innerHTML = `
                <span class="selected-color-swatch ${color}"></span>
                <span>${color.charAt(0).toUpperCase() + color.slice(1)}</span>
            `;
            selectedColorsList.appendChild(colorElement);
        });
        
        // Add some basic styling
        const style = document.createElement('style');
        style.textContent = `
            .selected-color-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 0.5rem;
            }
            .selected-color-swatch {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 1px solid #ddd;
            }
            .selected-color-swatch.black { background: #333; }
            .selected-color-swatch.silver { background: #c0c0c0; }
            .selected-color-swatch.gold { background: #ffd700; }
            .selected-color-swatch.blue { background: #007bff; }
        `;
        if (!document.querySelector('#compare-colors-styles')) {
            style.id = 'compare-colors-styles';
            document.head.appendChild(style);
        }
    }
    
    openButton.addEventListener('click', openModal);
    closeButton.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Step 7: Product Tabs
function initializeProductTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show target tab panel
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === targetTab) {
                    panel.classList.add('active');
                }
            });
        });
    });
}

// Quantity Selector
function initializeQuantitySelector() {
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    const quantityInput = document.querySelector('.quantity-input');
    
    minusBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    });
    
    plusBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        quantityInput.value = value + 1;
    });
    
    quantityInput.addEventListener('change', function() {
        if (this.value < 1) this.value = 1;
    });
}

// Bonus: Image Zoom
function initializeImageZoom() {
    const mainImageContainer = document.querySelector('.main-image-container');
    const mainImage = document.getElementById('main-image');
    const zoomElement = document.querySelector('.image-zoom');
    
    if (!zoomElement) return;
    
    mainImageContainer.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;
        
        zoomElement.style.left = (x - 100) + 'px';
        zoomElement.style.top = (y - 100) + 'px';
        
        // Create zoom effect (simplified - in real implementation would show enlarged portion)
        mainImage.style.transform = 'scale(1.05)';
        mainImage.style.transformOrigin = `${xPercent}% ${yPercent}%`;
    });
    
    mainImageContainer.addEventListener('mouseleave', function() {
        mainImage.style.transform = 'scale(1)';
        zoomElement.style.opacity = '0';
    });
    
    mainImageContainer.addEventListener('mouseenter', function() {
        zoomElement.style.opacity = '1';
    });
}

// Bonus: Local Storage Persistence
function saveToLocalStorage(key, value) {
    localStorage.setItem(`product_${key}`, value);
}

function getFromLocalStorage(key) {
    return localStorage.getItem(`product_${key}`);
}

function loadSavedPreferences() {
    const savedColor = getFromLocalStorage('selectedColor');
    const savedSize = getFromLocalStorage('selectedSize');
    
    if (savedColor) {
        const colorSwatch = document.querySelector(`.swatch[data-color="${savedColor}"]`);
        if (colorSwatch) {
            colorSwatch.click();
        }
    }
    
    if (savedSize) {
        const sizeSelect = document.getElementById('size-select');
        sizeSelect.value = savedSize;
        updateSelectedVariant();
    }
}

// Helper function to update selected variant display
function updateSelectedVariant() {
    const selectedColor = document.querySelector('.swatch.active')?.getAttribute('data-color');
    const selectedSize = document.getElementById('size-select')?.value;
    
    const selectedColorElement = document.getElementById('selected-color');
    const selectedSizeElement = document.getElementById('selected-size');
    
    if (selectedColorElement && selectedColor) {
        selectedColorElement.textContent = selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1);
    }
    
    if (selectedSizeElement) {
        selectedSizeElement.textContent = selectedSize || '-';
    }
}