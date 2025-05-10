from flask import Flask, request, jsonify
from my_pathfinding_module import connect_multiple_floors_v2, dijkstra
from my_floorplans import BR0_floorplan
from my_floorplans import BR1_floorplan
from my_floorplans import BR2_floorplan
from my_floorplans import BR3_floorplan
from my_floorplans import BR4_floorplan

app = Flask(__name__)

floors = [BR0_floorplan, BR1_floorplan, BR2_floorplan, BR3_floorplan, BR4_floorplan]

# Example connectors by floor, you may adjust these based on your actual data
connectors_by_floor = [
    ['elevator', 'stairL1', 'stairL2', 'stairR1', 'stairR2', 'stairR3'],  # Floor 0
    ['elevator', 'stairL1', 'stairL2', 'stairR1', 'stairR2', 'stairR3'],  # Floor 1
    ['elevator', 'stairL1', 'stairL2', 'stairR1', 'stairR2'],  # Floor 2
    ['elevator', 'stairL1', 'stairL2', 'stairR1', 'stairR2'],  # Floor 3
    ['elevator', 'stairL1', 'stairL2', 'stairR1'],  # Floor 4
]

# Call your function to generate the building graph
building_graph = connect_multiple_floors_v2(floors, connectors_by_floor)


from flask import Flask, render_template
from my_floorplans import BR0_floorplan  # Assuming your floorplan is in my_floorplans.py

app = Flask(__name__)

@app.route('/source/javascript/node-display.js', methods=['POST'])
def find_path():
    data = request.json
    start_base = data.get('start')
    end_base = data.get('end')

    if not start_base or not end_base:
        return jsonify({"error": "Missing 'start' or 'end' parameter"}), 400

    try:
        path, distance = dijkstra(building_graph, start_base, end_base)
        return jsonify({"path": path, "distance": distance})
    except KeyError as e:
        return jsonify({"error": f"Invalid node: {str(e)}"}), 400

if __name__ == '__main__':
    app.run(debug=True)