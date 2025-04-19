// Global variables
let currentFloor = 1; // Start with floor 1 (index 0)
let nodePositions = {}; // Will store node positions for each floor
let floorNodes = {}; // Will store node names for each floor
let currentPath = []; // Will store the current path
let stepMode = false; // Navigation mode: steps vs direct

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Set the initial floor
    updateFloorDisplay();
    
    // Load all node data
    fetchNodeData();
});

// Fetch node data from backend
async function fetchNodeData() {
    try {
        const response = await fetch('/get-node-data');
        const data = await response.json();
        floorNodes = data.node_data;
        console.log('Loaded node data:', floorNodes);
    } catch (error) {
        console.error('Error fetching node data:', error);
    }
}

// Functions for floor navigation
function upFloor() {
    if (currentFloor < 4) { // 0-4 are valid floors (5 floors total)
        currentFloor++;
        updateFloorDisplay();
        if (currentPath.length > 0) {
            displayPath(currentPath);
        }
    }
}

function downFloor() {
    if (currentFloor > 0) {
        currentFloor--;
        updateFloorDisplay();
        if (currentPath.length > 0) {
            displayPath(currentPath);
        }
    }
}

function updateFloorDisplay() {
    // Update floor label
    document.getElementById('floor-label').textContent = `Floor ${currentFloor}`;
    
    // Update floor map image
    const floorMap = document.getElementById('bradley-floor-map');
    floorMap.src = `/static/images/bradley_hall${currentFloor}.png`;
    
    // Clear any displayed nodes
    document.getElementById('node-container').innerHTML = '';
}

// Add a new destination input field
function addDestination() {
    const container = document.getElementById('destinations-container');
    const destinationGroups = container.getElementsByClassName('destination-group');
    const newIndex = destinationGroups.length + 1;
    
    const newGroup = document.createElement('div');
    newGroup.className = 'destination-group';
    newGroup.id = `destination-group-${newIndex}`;
    
    newGroup.innerHTML = `
        <label for="destination-${newIndex}" id="label-${newIndex}">Destination ${newIndex}:</label><br>
        <input type="text" id="destination-${newIndex}" name="destination-${newIndex}" class="destination-input" placeholder="Enter room number">
        <button type="button" class="remove-btn" onclick="removeDestination(${newIndex})">×</button>
    `;
    
    container.appendChild(newGroup);
}

// Remove a destination input field
function removeDestination(index) {
    const groupToRemove = document.getElementById(`destination-group-${index}`);
    if (groupToRemove) {
        groupToRemove.remove();
        
        // Renumber the remaining destinations
        const container = document.getElementById('destinations-container');
        const groups = container.getElementsByClassName('destination-group');
        
        for (let i = 0; i < groups.length; i++) {
            const newIndex = i + 1;
            groups[i].id = `destination-group-${newIndex}`;
            
            const label = groups[i].querySelector('label');
            label.id = `label-${newIndex}`;
            label.setAttribute('for', `destination-${newIndex}`);
            label.textContent = `Destination ${newIndex}:`;
            
            const input = groups[i].querySelector('input');
            input.id = `destination-${newIndex}`;
            input.name = `destination-${newIndex}`;
            
            const btn = groups[i].querySelector('button');
            btn.setAttribute('onclick', `removeDestination(${newIndex})`);
        }
    }
}

// Find and display route
async function displayClassroom() {
    // Get the starting point
    const startingSelect = document.getElementById('starting');
    const startingValue = startingSelect.value;
    
    if (startingValue === 'none') {
        alert('Please select a starting point');
        return;
    }
    
    // Get the destination
    const destinationInput = document.getElementById('destination-1');
    const destinationValue = destinationInput.value.trim();
    
    if (!destinationValue) {
        alert('Please enter a destination room number');
        return;
    }
    
    // Map frontend starting points to backend node names
    let startNode;
    switch (startingValue) {
        case 'front':
            startNode = 'Hallway1';
            break;
        case 'front-left':
            startNode = 'leftHallway1';
            break;
        case 'front-right':
            startNode = 'rightHallway1';
            break;
        default:
            startNode = 'Hallway1';
    }
    
    // Format destination to match backend format
    // Assuming destinations are in format "BRXXX" where XXX is the room number
    const formattedDestination = destinationValue.toUpperCase().startsWith('BR') 
        ? destinationValue.toUpperCase() 
        : `BR${destinationValue.padStart(3, '0')}`;
    
    try {
        // Call backend to find path
        const response = await fetch('/find-path', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                start: startNode,
                end: formattedDestination
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            alert(`Error: ${data.error}`);
            return;
        }
        
        // Store the path and display it
        currentPath = data.path_with_floors;
        displayPath(currentPath);
        
        // If the path spans multiple floors, show the first floor with path nodes
        if (currentPath.length > 0) {
            // Find the first floor with path nodes
            const firstFloorWithPath = currentPath[0].floor;
            if (currentFloor !== firstFloorWithPath) {
                currentFloor = firstFloorWithPath;
                updateFloorDisplay();
                displayPath(currentPath);
            }
        }
    } catch (error) {
        console.error('Error finding path:', error);
        alert('Failed to find a path. Please try again.');
    }
}

// Display bathrooms on the current floor
async function displayBathrooms() {
    try {
        const response = await fetch('/get-bathrooms');
        const data = await response.json();
        
        const bathrooms = data.bathrooms[currentFloor];
        if (!bathrooms) {
            alert(`No bathroom data available for floor ${currentFloor}`);
            return;
        }
        
        const nodeContainer = document.getElementById('node-container');
        
        // Clear existing nodes
        nodeContainer.innerHTML = '';
        
        // Display men's bathrooms
        if (bathrooms.men) {
            bathrooms.men.forEach(bathroomNode => {
                const position = getNodePosition(bathroomNode);
                if (position) {
                    const node = document.createElement('div');
                    node.className = 'bathroomM';
                    node.style.position = 'absolute';
                    node.style.left = `${position.x}px`;
                    node.style.top = `${position.y}px`;
                    node.style.width = '20px';
                    node.style.height = '20px';
                    node.style.borderRadius = '50%';
                    node.style.backgroundColor = 'blue';
                    node.title = `Men's Bathroom (${bathroomNode})`;
                    
                    nodeContainer.appendChild(node);
                }
            });
        }
        
        // Display women's bathrooms
        if (bathrooms.women) {
            bathrooms.women.forEach(bathroomNode => {
                const position = getNodePosition(bathroomNode);
                if (position) {
                    const node = document.createElement('div');
                    node.className = 'bathroomF';
                    node.style.position = 'absolute';
                    node.style.left = `${position.x}px`;
                    node.style.top = `${position.y}px`;
                    node.style.width = '20px';
                    node.style.height = '20px';
                    node.style.borderRadius = '50%';
                    node.style.backgroundColor = 'pink';
                    node.title = `Women's Bathroom (${bathroomNode})`;
                    
                    nodeContainer.appendChild(node);
                }
            });
        }
    } catch (error) {
        console.error('Error displaying bathrooms:', error);
        alert('Failed to display bathrooms. Please try again.');
    }
}

// Display a path on the map
function displayPath(path) {
    const nodeContainer = document.getElementById('node-container');
    
    // Clear existing nodes
    nodeContainer.innerHTML = '';
    
    // Filter path nodes for current floor
    const currentFloorNodes = path.filter(node => node.floor === currentFloor);
    
    if (currentFloorNodes.length === 0) {
        // No path on this floor
        return;
    }
    
    // Draw path nodes
    currentFloorNodes.forEach((pathNode, index) => {
        const position = getNodePosition(pathNode.node);
        if (!position) {
            return; // Skip if we don't have position data
        }
        
        const node = document.createElement('div');
        
        // Different styling for start, end and intermediate nodes
        if (index === 0 && path[0].floor === currentFloor) {
            // Starting node
            node.className = 'start';
            // Additional styling is in CSS
        } else if (index === currentFloorNodes.length - 1 && 
                  path[path.length - 1].floor === currentFloor) {
            // Destination node
            node.className = 'destination';
            node.style.position = 'absolute';
            node.style.left = `${position.x}px`;
            node.style.top = `${position.y}px`;
            node.style.width = '20px';
            node.style.height = '20px';
            node.style.borderRadius = '50%';
            node.style.backgroundColor = 'green';
            node.textContent = 'D';
        } else {
            // Intermediate node
            node.className = 'path-node';
            node.style.position = 'absolute';
            node.style.left = `${position.x}px`;
            node.style.top = `${position.y}px`;
            node.style.width = '10px';
            node.style.height = '10px';
            node.style.borderRadius = '50%';
            node.style.backgroundColor = '#ffcc00';
        }
        
        // Add node name as title
        node.title = pathNode.node;
        
        // Draw step numbers if in step mode
        if (stepMode && node.className !== 'start') {
            const stepNumber = document.createElement('div');
            stepNumber.style.position = 'absolute';
            stepNumber.style.left = `${position.x + 15}px`;
            stepNumber.style.top = `${position.y - 15}px`;
            stepNumber.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
            stepNumber.style.padding = '2px 5px';
            stepNumber.style.borderRadius = '10px';
            stepNumber.style.fontSize = '12px';
            stepNumber.style.fontWeight = 'bold';
            stepNumber.textContent = index + 1;
            nodeContainer.appendChild(stepNumber);
        }
        
        nodeContainer.appendChild(node);
    });
    
    // Draw lines between nodes if there are at least 2 nodes on this floor
    if (currentFloorNodes.length > 1 && !stepMode) {
        for (let i = 0; i < currentFloorNodes.length - 1; i++) {
            const pos1 = getNodePosition(currentFloorNodes[i].node);
            const pos2 = getNodePosition(currentFloorNodes[i + 1].node);
            
            if (pos1 && pos2) {
                drawLine(pos1, pos2);
            }
        }
    }
}

// Draw a line between two points
function drawLine(pos1, pos2) {
    const nodeContainer = document.getElementById('node-container');
    
    // Calculate the distance between the two points
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate the angle
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    // Create the line element
    const line = document.createElement('div');
    line.style.position = 'absolute';
    line.style.left = `${pos1.x}px`;
    line.style.top = `${pos1.y}px`;
    line.style.width = `${distance}px`;
    line.style.height = '3px';
    line.style.backgroundColor = '#ffcc00';
    line.style.transformOrigin = '0 0';
    line.style.transform = `rotate(${angle}deg)`;
    line.style.zIndex = '5';
    
    nodeContainer.appendChild(line);
}

// Toggle between step mode and direct path mode
function stepModeSwitch() {
    stepMode = !stepMode;
    
    const switchButton = document.getElementById('step-mode-switch');
    switchButton.textContent = stepMode ? 'Navigate by Path' : 'Navigate by Steps';
    
    // Update the display if there's a current path
    if (currentPath.length > 0) {
        displayPath(currentPath);
    }
}

// Reset the route display
function resetRoute() {
    // Clear the displayed path
    document.getElementById('node-container').innerHTML = '';
    currentPath = [];
    
    // Reset inputs
    document.getElementById('starting').value = 'none';
    
    // Clear all destinations except the first one
    const container = document.getElementById('destinations-container');
    const groups = container.getElementsByClassName('destination-group');
    
    // Remove all destination groups except the first one
    while (groups.length > 1) {
        groups[groups.length - 1].remove();
    }
    
    // Clear the first destination input
    document.getElementById('destination-1').value = '';
}

// Get the position of a node on the current floor map
// This is a placeholder function - you'll need to implement this with actual node positions
function getNodePosition(nodeName) {
    // For this example, we'll create some dummy positions
    // In a real implementation, you'd load these from your backend or a configuration file
    
    // Generate a deterministic position based on the node name
    // This is just for demonstration - replace with actual positioning data
    let hash = 0;
    for (let i = 0; i < nodeName.length; i++) {
        hash = ((hash << 5) - hash) + nodeName.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    
    // Map width and height - adjust based on your actual map dimensions
    const mapWidth = document.getElementById('bradley-floor-map').clientWidth;
    const mapHeight = document.getElementById('bradley-floor-map').clientHeight;
    
    // Use the hash to generate a position within the map bounds
    // This will produce consistent but random-looking positions
    const x = Math.abs(hash % mapWidth);
    const y = Math.abs((hash >> 8) % mapHeight);
    
    return { x, y };
}

// In a real implementation, you'd load node positions from your backend
// For example:
async function loadNodePositions() {
    try {
        // This would be your API endpoint to get node positions
        const response = await fetch(`/get-node-positions/${currentFloor}`);
        const data = await response.json();
        nodePositions = data.positions;
    } catch (error) {
        console.error('Error loading node positions:', error);
    }
}