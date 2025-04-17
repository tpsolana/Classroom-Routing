// note: we probably will have to add each room number and coordinate manually unfortunately
const classrooms = new Map();
// room number (key), coordinates (value)

// floor 0
classrooms.set(25, {x: 22, y: 40});
classrooms.set(50, {x: 73, y: 40});
classrooms.set(46, {x: 62, y:20});
classrooms.set(48, {x: 70, y:20});

// floor 1
classrooms.set(125, {x: 22, y: 40});
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

// floor 4

let destinationCount = 1;

function resetRoute(){
    document.getElementById("destinations-container").innerHTML = "";
    document.getElementById('node-container').innerHTML = "";
    destinationCount = 0;
    addDestination();
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

}

function displayClassroom(){
    document.getElementById('node-container').innerHTML = "";

    let startInput = document.getElementById("starting").value;

    if(startInput != ""){
        startInput = parseInt(startInput);
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
        node.style.backgroundColor = className === "start" ? "#27ae60" : "#e74c3c"; 

    }
}

function checkFloor(node){
    return floor*100 <= node.alt && (floor+1)*100 >= node.alt;
}

let floor = 1;

function downFloor(){
    if(floor > 0){
        floor--;
        changeFloorLabel();
    }
}

function upFloor(){
    if(floor < 4){
        floor++;
        changeFloorLabel();
    }
}

function changeFloorLabel(){
        let floorLabel = document.getElementById('floor-label');
        let map = document.getElementById('bradley-floor-map');
        map.src = "images/bradley_hall"+floor+".png";
        floorLabel.innerHTML = "Floor "+floor;

        //clear nodes
        //document.getElementById('node-container').innerHTML = "";

        // hides the displays proper nodes based on floor
        for (let i = 1; i <= destinationCount; i++) {
            let node = document.getElementById("destPoint-"+i);

            if(checkFloor(node)){
                node.hidden = false;
            }else{
                node.hidden = true;
            }
        }
}