(function() {
    // Add styles for hover effect and action menu
    const hoverStyle = document.createElement('style');
    hoverStyle.textContent = `
        /* Hover highlight style for the element being hovered over */
        .hover-highlight {
            outline: 2px solid red;
            cursor: pointer;
        }
        /* Style for the action menu that appears when clicking an element */
        .action-menu {
            position: absolute;
            background-color: #fff;
            border: 1px solid #ccc;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            padding: 10px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
        }
        /* Style for the close button in the action menu */
        .close-button {
            position: absolute;
            top: 5px;
            right: 5px;
            cursor: pointer;
            font-weight: bold;
            color: #888;
        }
        /* Style for the buttons inside the action menu */
        .action-button {
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
            margin: 0;
            font-size: 14px;
            border-radius: 4px;
            transition: background-color 0.3s;
        }
        /* Hover effect for the action buttons */
        .action-button:hover {
            background-color: #45a049;
        }
        /* Style for the rendered HTML element preview inside the action menu */
        .rendered-box {
            border: 1px solid #ddd;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 4px;
            max-width: 400px;
            height: auto;
            overflow-x: auto;
            font-size: 12px;
        }
    `;
    document.head.appendChild(hoverStyle); // Append the styles to the document

    let currentElement = null; // To store the currently hovered element
    let actionMenu = null; // To store the reference to the action menu
    let isScriptActive = true; // Flag to control if the script is active

    // Function to add hover effect when an element is hovered
    function addHoverEffect(event) {
        if (isScriptActive && !event.target.closest('.action-menu')) {
            if (currentElement) currentElement.classList.remove('hover-highlight'); // Remove highlight from the previous element
            currentElement = event.target; // Update the hovered element
            currentElement.classList.add('hover-highlight'); // Apply hover effect to the current element
        }
    }

    // Function to remove hover effect when the mouse leaves an element
    function removeHoverEffect() {
        if (currentElement) currentElement.classList.remove('hover-highlight');
        currentElement = null;
    }

    // Function to extract the element data (HTML & CSS) when an element is clicked
    function extractElementData(event) {
        if (isScriptActive && !event.target.closest('.action-button') && !event.target.closest('.close-button')) {
            const element = event.target;
            const html = element.outerHTML; // Get the outer HTML of the clicked element
            const computedStyle = window.getComputedStyle(element); // Get the computed CSS styles of the element
            const css = Array.from(computedStyle).reduce((acc, property) => {
                return `${acc}${property}: ${computedStyle.getPropertyValue(property)};\n`; // Format the CSS as a string
            }, '');

            createActionMenu(element, html, css, event.clientX, event.clientY); // Create the action menu at the position of the click
        }
    }

    // Function to create and display the action menu
    function createActionMenu(element, html, css, x, y) {
        if (actionMenu) actionMenu.remove(); // Remove the existing action menu if any

        actionMenu = document.createElement('div'); // Create the action menu div
        actionMenu.classList.add('action-menu');
        actionMenu.style.top = `${y}px`; 
        actionMenu.style.left = `${x}px`; 

        // Create the close button for the action menu
        const closeButton = document.createElement('span');
        closeButton.textContent = 'X';
        closeButton.classList.add('close-button');
        closeButton.addEventListener('click', () => {
            if (currentElement) {
                currentElement.classList.remove('hover-highlight'); // Remove hover effect on close
            }
            actionMenu.remove(); // Remove the action menu from the DOM
            actionMenu = null;
            removeHoverEffect(); // Ensure hover effect is fully removed on close
            deactivateScript(); // Deactivate the script functionality after closing
        });

        // Create buttons to copy HTML, CSS, or both to clipboard
        const htmlButton = createActionButton('Copy HTML', () => copyToClipboard(html));
        const cssButton = createActionButton('Copy CSS', () => copyToClipboard(css));
        const htmlCssButton = createActionButton('Copy HTML and CSS', () => copyToClipboard(`HTML:\n${html}\n\nCSS:\n${css}`));

        // Create a box to display a rendered version of the clicked element
        const renderedBox = document.createElement('div');
        renderedBox.classList.add('rendered-box');
        const clonedElement = element.cloneNode(true); // Clone the clicked element to render it inside the menu
        clonedElement.style = ''; // Clear any inline styles from the cloned element
        renderedBox.appendChild(clonedElement); // Append the cloned element to the rendered box

        // Append everything to the action menu
        actionMenu.appendChild(closeButton);
        actionMenu.appendChild(renderedBox);
        actionMenu.appendChild(htmlButton);
        actionMenu.appendChild(cssButton);
        actionMenu.appendChild(htmlCssButton);

        // Add the action menu to the body of the document
        document.body.appendChild(actionMenu);
    }

    // Function to create a button with a label and an onClick event handler
    function createActionButton(label, onClick) {
        const button = document.createElement('button');
        button.textContent = label;
        button.classList.add('action-button');
        button.addEventListener('click', onClick);
        return button;
    }

    // Function to copy the given text to clipboard
    function copyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy'); // Copy the text to clipboard
        document.body.removeChild(textArea);
        alert('Copied to clipboard!'); // Notify the user that the text has been copied
    }

    // Function to deactivate the script (remove event listeners and stop script execution)
    function deactivateScript() {
        document.removeEventListener('mouseover', addHoverEffect); // Remove the mouseover event listener
        document.removeEventListener('mouseout', removeHoverEffect); // Remove the mouseout event listener
        document.removeEventListener('click', extractElementData); // Remove the click event listener
        isScriptActive = false; // Set the script as inactive
    }

    // Add event listeners to trigger the hover effect and data extraction
    document.addEventListener('mouseover', addHoverEffect);
    document.addEventListener('mouseout', removeHoverEffect);
    document.addEventListener('click', extractElementData);
})();
