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

app.route("/find-path", methods=["POST"])
def find_path():
   #start = data["start"]
   end = data["end"]
   path, distance = dijkstra(graph, start, end)
    return jsonify({"path": path, "distance": distance})

if __name__ == "__main__":
    app.run(debug=True)
