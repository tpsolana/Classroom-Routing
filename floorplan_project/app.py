from flask import Flask, request, jsonify, render_template
from my_pathfinding_module import connect_multiple_floors_v2, dijkstra
from my_floorplans import BR0_floorplan
from my_floorplans import BR1_floorplan
from my_floorplans import BR2_floorplan
from my_floorplans import BR3_floorplan
from my_floorplans import BR4_floorplan

app = Flask(__name__, static_folder='static')

# Floor plans data
floors = [BR0_floorplan, BR1_floorplan, BR2_floorplan, BR3_floorplan, BR4_floorplan]

# Connectors by floor
connectors_by_floor = [
    ['elevator', 'stairL1', 'stairL2', 'stairR1', 'stairR2', 'stairR3'],  # Floor 0
    ['elevator', 'stairL1', 'stairL2', 'stairR1', 'stairR2', 'stairR3'],  # Floor 1
    ['elevator', 'stairL1', 'stairL2', 'stairR1', 'stairR2'],  # Floor 2
    ['elevator', 'stairL1', 'stairL2', 'stairR1', 'stairR2'],  # Floor 3
    ['elevator', 'stairL1', 'stairL2', 'stairR1'],  # Floor 4
]

# Generate the building graph
building_graph = connect_multiple_floors_v2(floors, connectors_by_floor)

# Serve the main HTML page
@app.route('/')
def home():
    return render_template('index.html')

# API endpoint to get floor data
@app.route('/get-floor-data/<int:floor_number>', methods=['GET'])
def get_floor_data(floor_number):
    if floor_number < 0 or floor_number >= len(floors):
        return jsonify({"error": "Invalid floor number"}), 400
    
    return jsonify({"floor_data": floors[floor_number]})

# API endpoint to get all building node data
@app.route('/get-node-data', methods=['GET'])
def get_node_data():
    # Create a map of floors and their nodes
    node_data = {}
    for i, floor in enumerate(floors):
        node_data[i] = list(floor.keys())
    
    return jsonify({"node_data": node_data})

# API endpoint for finding a path
@app.route('/find-path', methods=['POST'])
def find_path():
    data = request.json
    if not data or 'start' not in data or 'end' not in data:
        return jsonify({"error": "Missing start or end points"}), 400
        
    start = data["start"]
    end = data["end"]
    
    # Check if start and end points exist in the graph
    if start not in building_graph:
        return jsonify({"error": f"Start point '{start}' not found in building graph"}), 400
    if end not in building_graph:
        return jsonify({"error": f"End point '{end}' not found in building graph"}), 400
    
    try:
        path, distance = dijkstra(building_graph, start, end)
        
        # Determine which floor each node is on
        path_with_floors = []
        for node in path:
            # Find which floor contains this node
            floor_number = None
            for i, floor in enumerate(floors):
                if node in floor:
                    floor_number = i
                    break
            
            path_with_floors.append({
                "node": node,
                "floor": floor_number
            })
        
        return jsonify({
            "path": path,
            "path_with_floors": path_with_floors,
            "distance": distance
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API endpoint to get bathroom locations
@app.route('/get-bathrooms', methods=['GET'])
def get_bathrooms():
    bathrooms = {
        0: {  # Floor 0
            "men": ["Rmens"],
            "women": ["Lwomens"]
        },
        # Add bathrooms for other floors as needed
    }
    return jsonify({"bathrooms": bathrooms})

if __name__ == '__main__':
    app.run(debug=True, port=5002)