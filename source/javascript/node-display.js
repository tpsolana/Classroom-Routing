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

const canvas = document.getElementById("map-container");
const ctx = canvas.getContext("2d");
const img = document.getElementById("bradley-floor-map");

window.onload = setUp;

function setUp(){
    // set image to proper size scaling
    let scale = window.devicePixelRatio * 3;

    canvas.width = Math.floor(canvas.width * scale);
    canvas.height = Math.floor(canvas.height * scale);

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // inserts all of the room number data into the data list for auto fill
    // let classroomIt = classrooms.keys();
    let datalist = document.getElementById("room-data");

    /*
    for(let i=0; i<classrooms.size; i++){
        let option = document.createElement("option");
        datalist.appendChild(option);

        option.value = classroomIt.next().value;
    }*/

    // might want to optimize in the future
    let floorplanIt = BR0_floorplan.keys();
    for(let i=0; i<BR0_floorplan.size; i++){
        let roomID = floorplanIt.next().value;

        if(roomID.substring(0, 2) == "BR" && roomID.length == 5){
            let option = document.createElement("option");
            datalist.appendChild(option);
            
            option.value = roomID;
        }

    }

    floorplanIt = BR1_floorplan.keys();
    for(let i=0; i<BR1_floorplan.size; i++){
        let roomID = floorplanIt.next().value;

        if(roomID.substring(0, 2) == "BR" && roomID.length == 5){
            let option = document.createElement("option");
            datalist.appendChild(option);
            
            option.value = roomID;
        }

    }

    floorplanIt = BR2_floorplan.keys();
    for(let i=0; i<BR2_floorplan.size; i++){
        let roomID = floorplanIt.next().value;

        if(roomID.substring(0, 2) == "BR" && roomID.length == 5){
            let option = document.createElement("option");
            datalist.appendChild(option);
            
            option.value = roomID;
        }

    }

    floorplanIt = BR3_floorplan.keys();
    for(let i=0; i<BR3_floorplan.size; i++){
        let roomID = floorplanIt.next().value;

        if(roomID.substring(0, 2) == "BR" && roomID.length == 5){
            let option = document.createElement("option");
            datalist.appendChild(option);
            
            option.value = roomID;
        }

    }

    floorplanIt = BR4_floorplan.keys();
    for(let i=0; i<BR4_floorplan.size; i++){
        let roomID = floorplanIt.next().value;

        if(roomID.substring(0, 2) == "BR" && roomID.length == 5){
            let option = document.createElement("option");
            datalist.appendChild(option);
            
            option.value = roomID;
        }

    }
}

img.onload = draw;

function draw(){                
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // basically displays nodes and paths based on what floor
    if(pathShown){
        displayClassroom();
    }
}

let destinationCount = 1;

function resetRoute(){
    document.getElementById("destinations-container").innerHTML = "";
    document.getElementById('node-container').innerHTML = "";
    destinationCount = 0;
    addDestination();

    bathroomShown = false;
    document.getElementById("show-bathrooms").innerHTML = "Show Bathrooms";
    
    clearCanvas();
    draw();
    pathShown = false;
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
                class="destination-input" placeholder="Enter room number" list="room-data">
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

    if(destinationCount == 0){
        pathShown = false;
    }

    clearCanvas();
    draw();

}

let pathShown = false;
function displayClassroom(){
    document.getElementById('node-container').innerHTML = "";
    
    clearCanvas();
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    let startInput = document.getElementById("starting").value;

    pathShown = true;

    if(startInput != ""){
        displayNodes(startInput, "startPoint", "start");
    }
    /*
    for (let i = 1; i <= destinationCount; i++) {
        let destInput = document.getElementById("destination-" + i);
        if (destInput && destInput.value) {
            
            if( BR0_floorplan.get(destInput.value) == undefined ||
                BR1_floorplan.get(destInput.value) == undefined ||
                BR2_floorplan.get(destInput.value) == undefined ||
                BR3_floorplan.get(destInput.value) == undefined ||
                BR4_floorplan.get(destInput.value) == undefined){
                document.getElementById('node-container').innerHTML = "";
                alert("Please enter a valid room number.");
                break;
            }

            // displayNodes(destInput.value, "destPoint-" + i, "destination");
            displayNodes(destInput.value, i);
        }
    }*/

    let floorData;
    switch(floor){
        case 0:
            floorData = BR0_floorplan;
            break;
        case 1:
            floorData = BR1_floorplan;
            break;
        case 2:
            floorData = BR2_floorplan;
            break;
        case 3:
            floorData = BR3_floorplan;
            break;
        case 4:
            floorData = BR4_floorplan;
            break;
    }


    let destInput = document.getElementById("destination-1").value;
    if(destinationCount == 1 && floorData.get(destInput) != undefined){
        drawCircle( floorData.get(destInput).x, floorData.get(destInput).y, 1, "red");
    }

    for(let i=1; i<destinationCount; i++){
        destInput = document.getElementById("destination-" + i).value;
        let destInput2 = document.getElementById("destination-" + (i+1)).value;

        if( destInput && destInput2 &&
            floorData.get(destInput) != undefined &&
            floorData.get(destInput2) != undefined
        ){

            
            /*
            drawLine(   floorData.get(destInput).x, floorData.get(destInput).y,
                        floorData.get(destInput2).x, floorData.get(destInput2).y);
            */     
            drawCircle( floorData.get(destInput).x, floorData.get(destInput).y, i, "red");
            drawCircle( floorData.get(destInput2).x, floorData.get(destInput2).y, i+1, "red");
            findPath(destInput, destInput2, floorData);
        }
    }

    changeStep();
}

function displayNodes(input, destNum){
    if(BR0_floorplan.get(input) != undefined){
        drawCircle(BR0_floorplan.get(input).x, BR0_floorplan.get(input).y, destNum, "red");
    }
}

/*
function displayNodes(roomNumber, eleId, className){
    if(BR0_floorplan.get(roomNumber) != undefined){
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
        node.style.left = BR0_floorplan.get(roomNumber).x + "%";
        node.style.bottom = BR0_floorplan.get(roomNumber).y + "%";
        
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
        }

    }
}
*/

let bathroomShown = false;

function displayBathrooms(){
    if(!bathroomShown){
        for(let i=0; i<bathrooms.length; i++){
            displayNodes(bathrooms[i], "BR"+bathrooms[i], "bathroom"+classrooms.get(bathrooms[i]).gender);
        }
        
        document.getElementById("show-bathrooms").innerHTML = "Hide Bathrooms";

        bathroomShown = true;
    }else{
        for(let i=0; i<bathrooms.length; i++){
            let bathroom = document.getElementById("BR"+bathrooms[i]);

            if(bathroom){
                bathroom.remove();
            }else{
                break;
            }

        }

        document.getElementById("show-bathrooms").innerHTML = "Show Bathrooms";

        bathroomShown = false;
    }

}

function drawCircle(x, y, destNum, color){
    // draws circle
    ctx.beginPath();
    ctx.arc(canvas.width * (x/100),
            canvas.height * (y/100),
            18, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "white";
    ctx.stroke();
    
    // figure out how to center text better
    // writes number
    let offsetX = 8;
    let offsetY = -11;
    ctx.font = "bold 30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(destNum,   canvas.width * (x/100)-offsetX,
                            canvas.height * (y/100)-offsetY);
}

function drawLine(startX, startY, endX, endY){
    ctx.beginPath();

    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";

    ctx.moveTo( canvas.width * (startX/100),
                canvas.height * (startY/100));

    ctx.lineTo( canvas.width * (endX/100),
                canvas.height * (endY/100));

    ctx.stroke();
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
    
    if(node){
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
        changeFloorLabel();
    }else{
        stepModeButton.innerHTML = "Navigate by Floors";
        arrowButtons[0].setAttribute("onclick", "downStep()");
        arrowButtons[1].setAttribute("onclick", "upStep()");
        stepMode = true;

        // resets to and displays step 1
        step = 1;
        changeStep();
    }
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
    //clear nodes
    //document.getElementById('node-container').innerHTML = "";
    
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

    for(let i=0; i<bathrooms.length; i++){
        let bathroom = document.getElementById("BR"+bathrooms[i]);

        if(bathroom){
            if(checkFloor(bathroom)){
                bathroom.hidden = false;
            }else{
                bathroom.hidden = true;
            }
        }else if(i > 0){
            break;
        }

    }
}

function clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// stole this from annabel's branch, still need to figure out how this works properly
async function findPath(start, end, floorData) {
    /*
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;

    const res = await fetch("/find-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start, end })
    });

    const data = await res.json();

    console.log(`Path: ${data.path}, Distance: ${data.distance}`);*/

    /*
    // test rendering
    drawLine(50, 50, 0, 100);
    drawLine(0, 100, 50, 65);
    drawCircle(50, 50, 1, "red");*/

    try {
        const response = await fetch("http://localhost:5000/", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({ start, end })
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Error: ${errorData.error}`);
            return;
        }

        const data = await response.json();
        // console.log(`Path: ${data.path}, Distance: ${data.distance}`);
        console.log(data.path);
        console.log(floorData.get(data.path[0]));
        for(let i=0; i<data.path.length-1; i++){
            let string1 = data.path[i];
            let string2 = data.path[i+1];
            if(string1.includes("intersec")){
                string1 += "_F"+floor;
            }
            if(string2.includes("intersec")){
                string2 += "_F"+floor;
            }

             drawLine(  floorData.get(string1).x, floorData.get(string1).y,
                        floorData.get(string2).x, floorData.get(string2).y);
            /*            
            drawCircle( floorData.get(data.path[i]).x, floorData.get(data.path[i]).y, i, "red");
            drawCircle( floorData.get(data.path[i+1]).x, floorData.get(data.path[i+1]).y, i+1, "red");
            */
        }

    } catch (error) {
        console.error("Error fetching path:", error);
        alert("An error occurred while finding the path.");
    }
}