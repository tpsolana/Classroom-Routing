# Classroom Routing
Our team is developing a mobile-friendly website to help students navigate Bradley Hall more efficiently. Bradley University features many historic buildings, each with a unique layout, which can make finding classrooms challenging, especially for new students. Currently, no indoor navigation system is specifically designed to meet students' needs, and those with accessibility requirements often face additional obstacles in identifying suitable routes. The platform allows students to enter a starting entrance and a desired room number, generating a clear and optimized path to their destination. The software has the potential to evolve into a more personalized tool by integrating all Bradley buildings, student schedules and providing real-time updates on maintenance or events. If Bradley University is interested, the system could also be integrated into existing websites and applications for broader accessibility.

Prerequisites: Browser

Installation Steps:
1. Clone the repo
2. git clone https://github.com/tpsolana/Classroom-Routing.git
3. cd Classroom-Routing

Codebase Structure:
├── BECC/              # Floorplan images for BECC
├── BradleyHall/       # Floorplan images for Bradley Hall
├── CGCC/              # Floorplan images for CGCC
├── Olin/              # Floorplan images for Olin
├── WestlakeHall/      # Floorplan images for Westlake Hall
├── floorplan_project/      # 
│   ├── _pycache_/          # Reusable UI components
|   |    ├── my_floorplans.cpython-312.pyc/         # 
|   |    ├── pathfinding_module.cpython-312.pyc/    # 
│   ├── app.py         # Utilized for running our python
│   ├── my_pathfinding_module.py      # Python pathfinding
│   └── my_floorplans.py              # Floorplan python module
├── source/               # Source code
│   ├── images/        # Reusable image components
│   ├── javascript/    # Holds all JavaScript components
|   |    ├── floorplan-data.js/  # Floorplan node data 
|   |    ├── node-display.js/    # Displaying front end nodes
│   ├── styles/        # CSS styling files
└── README.md          # Project documentation
