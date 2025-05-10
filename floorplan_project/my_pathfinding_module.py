import heapq
import math

def connect_multiple_floors_v2(all_floorplans, connectors_by_floor, connector_weight=1, direct_room_connections=False):
    building_graph = {}
    floor_graphs = {}

    for floor, floorplan in enumerate(all_floorplans):
        floor_name = f"Floor{floor + 1}"
        floor_graph = {}
        for node, neighbors in floorplan.items():
            floor_graph[f"{node}_F{floor + 1}"] = {f"{neighbor}_F{floor + 1}": weight for neighbor, weight in neighbors.items()}
        floor_graphs[floor_name] = floor_graph
        building_graph.update(floor_graph)

    common_connectors = set(connectors_by_floor[0]).intersection(*connectors_by_floor[1:])
    for connector in common_connectors:
        for i in range(len(all_floorplans) - 1):
            floor1 = i + 1
            floor2 = i + 2
            node1 = f"{connector}_F{floor1}"
            node2 = f"{connector}_F{floor2}"
            building_graph.setdefault(node1, {})[node2] = connector_weight
            building_graph.setdefault(node2, {})[node1] = connector_weight

            for hallway, neighbors in all_floorplans[i].items():
                if connector in neighbors:
                    hallway_node = f"{hallway}_F{floor1}"
                    connector_node = f"{connector}_F{floor1}"
                    building_graph.setdefault(hallway_node, {})[connector_node] = neighbors[connector]
                    building_graph.setdefault(connector_node, {})[hallway_node] = neighbors[connector]

            for hallway, neighbors in all_floorplans[i+1].items():
                if connector in neighbors:
                    hallway_node = f"{hallway}_F{floor2}"
                    connector_node = f"{connector}_F{floor2}"
                    building_graph.setdefault(hallway_node, {})[connector_node] = neighbors[connector]
                    building_graph.setdefault(connector_node, {})[hallway_node] = neighbors[connector]

    if direct_room_connections:
        for floor_index, floorplan in enumerate(all_floorplans):
            for room, neighbors in floorplan.items():
                if not room.lower().startswith(("stair", "elevator", "hallway", "mini")):
                    for neighbor, weight in neighbors.items():
                        if neighbor in all_floorplans[(floor_index + 1) % len(all_floorplans)]:
                            room_node_current = f"{room}_F{floor_index + 1}"
                            room_node_next = f"{neighbor}_F{(floor_index + 1) % len(all_floorplans) + 1}"
                            building_graph.setdefault(room_node_current, {})[room_node_next] = weight
                            building_graph.setdefault(room_node_next, {})[room_node_current] = weight

    return building_graph


def dijkstra(graph, start_base, end_base):
    start_nodes = [node for node in graph if node.startswith(start_base + "_F")]
    end_nodes = [node for node in graph if node.startswith(end_base + "_F")]

    if not start_nodes:
        raise KeyError(f"Start room '{start_base}' not found on any floor.")
    start_node = start_nodes[0]

    if not end_nodes:
        raise KeyError(f"End room '{end_base}' not found on any floor.")
    end_node = end_nodes[0]

    distances = {node: float('inf') for node in graph}
    distances[start_node] = 0
    priority_queue = [(0, start_node, [start_node])]

    while priority_queue:
        current_distance, current_node, raw_path = heapq.heappop(priority_queue)

        if current_node == end_node:
            formatted_path = []
            i = 0
            while i < len(raw_path):
                node = raw_path[i]
                base_node = node.split("_F")[0]
                formatted_path.append(base_node)

                if i < len(raw_path) - 1:
                    current_base = base_node
                    next_base = raw_path[i+1].split("_F")[0]
                    current_floor = int(node.split("_F")[-1])
                    next_floor = int(raw_path[i+1].split("_F")[-1])

                    if current_base.lower().startswith(("stair", "elevator")) and current_base == next_base and current_floor != next_floor:
                        formatted_path[-1] = f"{current_base}"
                        i += 1
                    elif current_base.lower().startswith(("stair", "elevator")) and current_base != next_base and current_floor != next_floor:
                        formatted_path[-1] = f"{current_base} (Floor {current_floor})"
                    elif current_base != next_base and next_base.lower().startswith(("stair", "elevator")) and current_floor != next_floor:
                        pass
                i += 1

            final_formatted_path = []
            i = 0
            while i < len(formatted_path):
                node = formatted_path[i]
                final_formatted_path.append(node)
                if i < len(formatted_path) - 1:
                    if not (formatted_path[i].lower().startswith(("stair", "elevator")) and formatted_path[i+1].lower().startswith(("stair", "elevator"))):
                        final_formatted_path.append("->")
                i += 1

            return "->".join(final_formatted_path), current_distance

        if current_distance > distances[current_node]:
            continue

        for neighbor, weight in graph.get(current_node, {}).items():
            distance = current_distance + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(priority_queue, (distance, neighbor, raw_path + [neighbor]))

    return None, float('inf')