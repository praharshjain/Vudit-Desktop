// Get file path from URL query
const filePath = common.getParameterByName('file');

const previewText = document.getElementById('preview-text');
const fontSizeInput = document.getElementById('font-size');
const sizeDisplay = document.getElementById('size-display');
const fontPreview = document.getElementById('font-preview');
const alphabetPreview = document.querySelector('.alphabet-preview');
const errorMessage = document.getElementById('error-message');

// Update preview text
previewText.addEventListener('input', (e) => {
    fontPreview.textContent = e.target.value || 'The quick brown fox jumps over the lazy dog';
});

// Update font size
fontSizeInput.addEventListener('input', (e) => {
    const size = e.target.value;
    sizeDisplay.textContent = size + 'px';
    fontPreview.style.fontSize = size + 'px';
});

async function loadFont() {
    if (!filePath) {
        showError('No file specified');
        return;
    }

    try {
        // Create a unique name for the font
        const fontName = 'CustomFont';

        // Load the font using FontFace API
        // We use 'url(filePath)' which works because we have local file access
        const font = new FontFace(fontName, `url('${filePath}')`);

        await font.load();
        document.fonts.add(font);

        // Apply font to preview elements
        fontPreview.style.fontFamily = fontName;
        alphabetPreview.style.fontFamily = fontName;

        // Set initial size
        fontPreview.style.fontSize = fontSizeInput.value + 'px';

    } catch (err) {
        console.error('Error loading font:', err);
        showError(`Failed to load font: ${err.message}`);
    }
}

function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.style.display = 'block';
    document.querySelector('.preview-area').style.display = 'none';
    document.querySelector('.controls').style.display = 'none';
}

// Initialize
loadFont();
