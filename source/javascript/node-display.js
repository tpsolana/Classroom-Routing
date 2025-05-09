// note: we probably will have to add each room number and coordinate manually unfortunately
const classrooms = new Map();
// room number (key), coordinates (value)

// floor 0
classrooms.set(25, {x: 22, y: 40});
classrooms.set(50, {x: 73, y: 40});
classrooms.set(46, {x: 62, y:20});
classrooms.set(48, {x: 70, y:20});

// floor 1
classrooms.set("front", {x: 49, y: 15});
classrooms.set("front-left", {x: 22, y: 15});
classrooms.set("front-right", {x: 76, y: 15});

classrooms.set(125, {x: 21, y: 40});
classrooms.set(150, {x: 73, y: 40});
classrooms.set(145, {x: 48, y: 45});
classrooms.set(122, {x: 8, y: 72});
classrooms.set(160, {x: 76, y: 78});
classrooms.set(142, {x: 58, y: 20});
classrooms.set(146, {x: 68, y:20});

// floor 2
classrooms.set(250, {x: 73, y: 40});
classrooms.set(222, {x: 8, y: 72});
classrooms.set(225, {x: 22, y: 40});

// floor 3
classrooms.set(322, {x: 8, y: 72});
classrooms.set(340, {x: 48, y: 20});


// floor 4

// bathrooms
const bathrooms = [ 27, 53,
                    129, 131, 153, 155,
                    229, 231, 253, 255,
                    337, 357,
                    427, 429, 433 ];
// floor 0
classrooms.set(27, {x: 34, y: 42, gender: "F"});
classrooms.set(53, {x: 61, y: 42, gender: "M"});

// floor 1
classrooms.set(153, {x: 61, y: 42, gender: "F"});
classrooms.set(155, {x: 61, y: 55, gender: "M"});

classrooms.set(129, {x: 35, y: 42, gender: "F"});
classrooms.set(131, {x: 35, y: 55, gender: "M"});

// floor 2
classrooms.set(253, {x: 61, y: 42, gender: "F"});
classrooms.set(255, {x: 61, y: 55, gender: "M"});

classrooms.set(229, {x: 35, y: 42, gender: "F"});
classrooms.set(231, {x: 35, y: 55, gender: "M"});

// floor 3
classrooms.set(337, {x: 34, y: 42, gender: "F"});
classrooms.set(357, {x: 61, y: 42, gender: "M"});

// floor 4
classrooms.set(427, {x: 32, y: 32, gender: "F"});
classrooms.set(429, {x: 32, y: 38, gender: "F"});
classrooms.set(433, {x: 36, y: 32, gender: "M"});

// Handicap accessible entrances and routes
const handicapAccessible = {
    entrances: [
        { floor: 1, x: 49, y: 15, name: "Main Entrance" }, // Front entrance
        { floor: 1, x: 76, y: 78, name: "East Entrance" }  // Side entrance
    ],
    elevators: [
        { x: 35, y: 60 } // Position of elevator on all floors
    ]
};

let destinationCount = 1;
let handicapMode = false;

function resetRoute(){
    document.getElementById("destinations-container").innerHTML = "";
    document.getElementById('node-container').innerHTML = "";
    destinationCount = 0;
    addDestination();

    bathroomShown = false;
    
    // Reset toggle switches
    if (document.getElementById('bathroom-toggle')) {
        document.getElementById('bathroom-toggle').checked = false;
    }
    
    if (document.getElementById('handicap-toggle')) {
        document.getElementById('handicap-toggle').checked = false;
        handicapMode = false;
    }
}

function addDestination(){
    // limit of 5
    if(destinationCount >= 5){
        return;
    }

    destinationCount++;
    
    const destinationGroup = document.createElement('div');
    destinationGroup.className = 'destination-group';
    destinationGroup.id = 'destination-group-'+destinationCount;
    
    destinationGroup.innerHTML = `
        <label for="destination-${destinationCount}" id="label-${destinationCount}">Destination ${destinationCount}:</label><br>
        <input type="text" id="destination-${destinationCount}" name="destination-${destinationCount}" 
                class="destination-input" placeholder="Enter room number">
        <button type="button" class="remove-btn" onclick="removeDestination(${destinationCount})">×</button>
    `;
    
    document.getElementById('destinations-container').appendChild(destinationGroup);
}

function removeDestination(destNum){
    for(let i=destNum+1; i<=destinationCount; i++){
        let tempTag = document.getElementById("destination-group-"+i);
        let tempVal = document.getElementById("destination-"+i).value;
        tempTag.innerHTML = `
        <label for="destination-${i-1}" id="label-${i-1}">Destination ${i-1}:</label><br>
        <input type="text" id="destination-${i-1}" name="destination-${i-1}" 
                class="destination-input" placeholder="Enter room number" value="${tempVal}">
        <button type="button" class="remove-btn" onclick="removeDestination(${i-1})">×</button>
    `;
    
    tempTag.id = "destination-group-"+(i-1);
    
    tempTag = document.getElementById("destPoint-"+i);
    if(tempTag != null){
        tempTag.id = "destPoint-"+(i-1);
        tempTag.innerHTML = i-1;
    }

    }

    // split num
    if (typeof destNum === 'string' && destNum.includes('-')) {
        destNum = destNum.split('-')[1];
    }

    destinationCount--;
    const removeTag = document.getElementById('destination-group-'+destNum);
    removeTag.remove();

    const removeNode = document.getElementById('destPoint-'+destNum);
    if(removeNode != null){
        removeNode.remove();
    }

    if(step > destinationCount){
        step = destinationCount;
        changeStep();
    }

}

function displayClassroom(){
    document.getElementById('node-container').innerHTML = "";

    let startInput = document.getElementById("starting").value;

    if(startInput != ""){
        displayNodes(startInput, "startPoint", "start");
    }

    for (let i = 1; i <= destinationCount; i++) {
        let destInput = document.getElementById("destination-" + i);
        if (destInput && destInput.value) {
            let roomNumber = parseInt(destInput.value);
            
            if(classrooms.get(roomNumber) == undefined){
                document.getElementById('node-container').innerHTML = "";
                alert("Please enter a valid room number.");
                break;
            }

            displayNodes(roomNumber, "destPoint-" + i, "destination");
        }
    }

    // If we're in handicap mode, display accessible entrances and elevators
    if (handicapMode) {
        displayHandicapAccessPoints();
    }

    // If bathroom toggle is checked, display bathrooms
    if (document.getElementById('bathroom-toggle') && document.getElementById('bathroom-toggle').checked) {
        displayBathrooms();
    }

    changeStep();
}

function displayNodes(roomNumber, eleId, className){
    if(classrooms.get(roomNumber) != undefined){
        let node = document.getElementById(eleId);
        
        if (!node) {
            node = document.createElement('div');
            node.id = eleId;
            document.getElementById('node-container').appendChild(node);
        }
        
        // store room number in tag (probabably not best practice but works for now)
        node.alt = roomNumber

        // hide if not proper floor
        if(!checkFloor(node)){
            node.hidden = true;
        }

        // display number on node
        if (typeof eleId === 'string' && eleId.includes('-')) {
            node.innerHTML = eleId.split('-')[1];
        }

        // Set class and position
        node.className = className;
        node.style.position = 'absolute'; 
        node.style.left = classrooms.get(roomNumber).x + "%";
        node.style.bottom = classrooms.get(roomNumber).y + "%";
        
        // Make it visible
        node.style.width = "15px";
        node.style.height = "15px";
        node.style.borderRadius = "50%"; 
        //node.style.backgroundColor = className === "start" ? "#27ae60" : "#e74c3c"; 

        switch(className){
            case "start":
                // node.style.backgroundColor = "#1c003a";
                node.style.width = "0px";
                node.style.height = "0px";
                node.style.borderRadius = "0px"
                break;
            
            case "destination":
                node.style.backgroundColor = "#e74c3c";
                break;
            
            case "bathroomF":
                node.style.backgroundColor = "#db05c6";
                break;
            
            case "bathroomM":
                node.style.backgroundColor = "#1d41b0";
                break;

            case "handicap-access":
                node.style.backgroundColor = "#27ae60";
                node.style.width = "20px";
                node.style.height = "20px";
                break;
        }

    }
}

let bathroomShown = false;

function displayBathrooms(){
    if(!bathroomShown){
        for(let i=0; i<bathrooms.length; i++){
            displayNodes(bathrooms[i], "BR"+bathrooms[i], "bathroom"+classrooms.get(bathrooms[i]).gender);
        }
        
        bathroomShown = true;
    } else {
        hideBathrooms();
    }

    // Update the toggle in the help dropdown to match the current state
    if (document.getElementById('bathroom-toggle')) {
        document.getElementById('bathroom-toggle').checked = bathroomShown;
    }
}

function hideBathrooms() {
    for(let i=0; i<bathrooms.length; i++){
        let bathroom = document.getElementById("BR"+bathrooms[i]);

        if(bathroom){
            bathroom.remove();
        }else{
            break;
        }
    }
    
    bathroomShown = false;
}

// Handicap accessibility functions
function enableHandicapMode() {
    handicapMode = true;
    displayHandicapAccessPoints();
    // You could add additional accessibility features here
    console.log("Handicap accessible mode enabled");
}

function disableHandicapMode() {
    handicapMode = false;
    removeHandicapAccessPoints();
    console.log("Handicap accessible mode disabled");
}

function displayHandicapAccessPoints() {
    // Display accessible entrances
    handicapAccessible.entrances.forEach((entrance, index) => {
        if (entrance.floor === floor) {
            const node = document.createElement('div');
            node.id = `handicap-entrance-${index}`;
            node.className = 'handicap-access';
            node.style.position = 'absolute';
            node.style.left = entrance.x + "%";
            node.style.bottom = entrance.y + "%";
            node.style.width = "20px";
            node.style.height = "20px";
            node.style.borderRadius = "50%";
            node.style.backgroundColor = "#27ae60";
            node.style.border = "3px solid white";
            node.style.zIndex = "25";
            node.innerHTML = "♿";
            node.title = entrance.name;
            document.getElementById('node-container').appendChild(node);
        }
    });

    // Display elevators on each floor
    handicapAccessible.elevators.forEach((elevator, index) => {
        const node = document.createElement('div');
        node.id = `elevator-${index}`;
        node.className = 'handicap-access';
        node.style.position = 'absolute';
        node.style.left = elevator.x + "%";
        node.style.bottom = elevator.y + "%";
        node.style.width = "20px";
        node.style.height = "20px";
        node.style.borderRadius = "3px";
        node.style.backgroundColor = "#27ae60";
        node.style.border = "3px solid white";
        node.style.zIndex = "25";
        node.innerHTML = "E";
        node.title = "Elevator";
        document.getElementById('node-container').appendChild(node);
    });
}

function removeHandicapAccessPoints() {
    const nodes = document.querySelectorAll('.handicap-access');
    nodes.forEach(node => {
        node.remove();
    });
}

function checkFloor(node){
    let string = node.alt;

    if (typeof node.alt === 'string' && node.alt.includes('-')) {
        string = node.alt.split('-')[0];
    }

    if(string == "front" && floor == 1){
        return true;
    }
    
    return floor*100 <= node.alt && (floor+1)*100 >= node.alt;
}

let floor = 1;

function downFloor(){
    if(floor > 0){
        floor--;
        changeFloorLabel();
        switchNodeDisplay();
    }
}

function upFloor(){
    if(floor < 4){
        floor++;
        changeFloorLabel();
        switchNodeDisplay();
    }
}

let step = 1;

function upStep(){
    if(step < destinationCount){
        step++;
        changeStep();
    }
}

function downStep(){
    if(step > 1){
        step--;
        changeStep();
    }
}

function changeStep(){
    let node = document.getElementById("destPoint-"+step);
    if (node) {
        floor = parseInt(node.alt/100);
        changeFloorLabel();
        switchNodeDisplay();
    }
}

let stepMode = false;

function stepModeSwitch(){
    if(!stepMode && step < 1){
        alert("Please enter a destination.");
        return;
    }

    let stepModeButton = document.getElementById("step-mode-switch");
    let arrowButtons = document.getElementsByClassName("arrow-button");

    if(stepMode){
        stepModeButton.innerHTML = "Navigate by Steps";
        arrowButtons[0].setAttribute("onclick", "downFloor()");
        arrowButtons[1].setAttribute("onclick", "upFloor()");
        stepMode = false;
    }else{
        stepModeButton.innerHTML = "Navigate by Floors";
        arrowButtons[0].setAttribute("onclick", "downStep()");
        arrowButtons[1].setAttribute("onclick", "upStep()");
        stepMode = true;
    }

    changeFloorLabel();
}

function changeFloorLabel(){
    let floorLabel = document.getElementById('floor-label');
    let map = document.getElementById('bradley-floor-map');
    map.src = "images/bradley_hall"+floor+".png";

    if(!stepMode){
        floorLabel.innerHTML = "Floor "+floor;
    }else{
        floorLabel.innerHTML = "Step "+step;
    }
}

function switchNodeDisplay(){
    // hides the displays proper nodes based on floor
    for (let i = 0; i <= destinationCount; i++) {
        let node = i == 0 ? document.getElementById("startPoint"):
                           document.getElementById("destPoint-"+i);

        if(node){
            if(checkFloor(node)){
                node.hidden = false;
            }else{
                node.hidden = true;
            }
        }else if(i > 0){
            break;
        }
    }

    // Update bathroom visibility based on current floor
    if (bathroomShown) {
        for(let i=0; i<bathrooms.length; i++){
            let bathroom = document.getElementById("BR"+bathrooms[i]);

            if(bathroom){
                if(checkFloor(bathroom)){
                    bathroom.hidden = false;
                }else{
                    bathroom.hidden = true;
                }
            }
        }
    }

    // Update handicap access points visibility
    if (handicapMode) {
        removeHandicapAccessPoints();
        displayHandicapAccessPoints();
    }
}

// Help popup toggle function
function helpPopup() {
    const dropdown = document.getElementById("helpDropdown");
    dropdown.classList.toggle("show");
}

// Initialize event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const bathroomToggle = document.getElementById('bathroom-toggle');
    if (bathroomToggle) {
        bathroomToggle.addEventListener('change', function() {
            if (this.checked) {
                if (!bathroomShown) {
                    displayBathrooms();
                }
            } else {
                if (bathroomShown) {
                    hideBathrooms();
                }
            }
        });
    }

    // Get the handicap toggle
    const handicapToggle = document.getElementById('handicap-toggle');
    if (handicapToggle) {
        handicapToggle.addEventListener('change', function() {
            if (this.checked) {
                enableHandicapMode();
            } else {
                disableHandicapMode();
            }
        });
    }

    // Close the dropdown if the user clicks outside of it
    window.addEventListener('click', function(event) {
        if (!event.target.matches('.helpMe') && !event.target.closest('.dropdown-content')) {
            const dropdowns = document.getElementsByClassName("dropdown-content");
            for (let i = 0; i < dropdowns.length; i++) {
                let openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    });
});