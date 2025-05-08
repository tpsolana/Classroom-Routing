from flask import Flask, request, jsonify
from my_pathfinding_module import connect_multiple_floors_v2, dijkstra

app = Flask(__name__)

# Example graph setup (replace with your actual data)
all_floorplans = [
    {"A": {"B": 1}, "B": {"A": 1, "C": 1}, "C": {"B": 1}},
    {"A": {"B": 1}, "B": {"A": 1, "C": 1}, "C": {"B": 1}}
]
connectors_by_floor = [["Stair1"], ["Stair1"]]
building_graph = connect_multiple_floors_v2(all_floorplans, connectors_by_floor)

@app.route('/find-path', methods=['POST'])
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
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
