export const PROJECT_CATEGORIES = ["Project & Works", "Hackathons", "Freelance Works"];

export const projects = [
  {
    id: "smart-traffic-management",
    category: "Project & Works",
    name: "smart-traffic-management",
    title: "Smart Traffic Management System",
    summary:
      "An AI-assisted traffic optimization platform that predicts traffic density and dynamically recommends signal timings using real-time map data and machine learning.",
    detail:
      "Built as my major academic project, the system combines Google Maps APIs with machine learning to simulate an adaptive traffic control network. Developed a Flask backend capable of collecting location-based traffic information, predicting congestion using Random Forest models, and estimating optimized green and red signal durations. Designed an interactive dashboard for visualizing congestion hotspots, route optimization, emergency vehicle prioritization, and historical traffic analytics. A major focus was creating a scalable architecture where prediction models, map services, and visualization components remained loosely coupled for easier experimentation and deployment.",
    stack: [
      "Python",
      "Flask",
      "Google Maps API",
      "Random Forest",
      "SQLite",
      "HTML/CSS",
      "JavaScript",
    ],
    stat: {
      value: "ML",
      label: "adaptive traffic prediction",
    },
    year: "2025",
  },
  {
    id: "purplle-store-intelligence",
    category: "Hackathons",
    name: "purplle-store-intelligence",
    title: "Purplle Tech Challenge — Store Intelligence Platform",
    summary:
      "A real-time retail analytics platform that transforms CCTV streams into customer movement insights, zone density analysis, and actionable store intelligence.",
    detail:
      "Developed during the Purplle Tech Challenge, the solution processes multiple camera feeds simultaneously to estimate customer density, movement patterns, and engagement across different store sections. Built a complete computer vision pipeline featuring multi-camera detection, cross-camera tracking, Re-ID for customer continuity, and floor-plan projection for accurate analytics. Integrated Groq's Llama models to generate natural-language summaries and business insights from captured metrics. Significant effort went into reducing duplicate detections, improving tracking consistency, and optimizing inference for near real-time performance.",
    stack: [
      "Python",
      "FastAPI",
      "OpenCV",
      "YOLO",
      "Groq Llama",
      "OSNet Re-ID",
      "FAISS",
    ],
    stat: {
      value: "Multi-Cam",
      label: "real-time customer analytics",
    },
    year: "2025",
  },
  {
    id: "tata-steel-defect-ai",
    category: "Hackathons",
    name: "tata-steel-defect-ai",
    title: "Tata Steel AI Challenge — Hot Rolling Defect Detection",
    summary:
      "An ensemble machine learning pipeline for detecting defects in hot-rolled steel coils under highly imbalanced industrial datasets.",
    detail:
      "Designed an industrial defect detection pipeline focused on maximizing defect recall without sacrificing overall precision. Tackled severe class imbalance using ensemble learning techniques including Balanced Random Forest, Easy Ensemble, XGBoost, CatBoost, and LightGBM. Engineered defect-specific geometric features and layered multiple prediction stages to minimize false positives while ensuring rare production defects remained detectable. The project emphasized practical manufacturing constraints where missing a single defect could have significant downstream costs.",
    stack: [
      "Python",
      "Scikit-learn",
      "XGBoost",
      "LightGBM",
      "CatBoost",
      "Pandas",
    ],
    stat: {
      value: "19:1",
      label: "class imbalance handled",
    },
    year: "2024",
  },
  {
    id: "foodprep-delivery",
    category: "Project & Works",
    name: "foodprep-delivery",
    title: "FoodPrep — Food Ordering & Delivery Platform",
    summary:
      "A modern food ordering platform inspired by leading delivery applications, supporting restaurant discovery, online ordering, and order lifecycle management.",
    detail:
      "Developed a complete food delivery ecosystem featuring restaurant listings, dynamic menus, shopping cart functionality, secure user authentication, order placement, and delivery status tracking. Focused on creating a responsive user experience with efficient backend APIs capable of managing orders, customer accounts, and restaurant inventories. The project explored scalable REST architecture, modular frontend design, and optimized database relationships for handling large menu datasets.",
    stack: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "JWT",
      "REST API",
    ],
    stat: {
      value: "End-to-End",
      label: "food ordering workflow",
    },
    year: "2024",
  },
  {
    id: "chemdata-monitoring",
    category: "Freelance Works",
    name: "chemdata-monitoring",
    title: "ChemData — Chemical Equipment Monitoring System",
    summary:
      "A cross-platform equipment monitoring solution featuring a Django REST backend, React dashboard, and PyQt6 desktop application for real-time industrial data management.",
    detail:
      "Built a complete monitoring ecosystem capable of managing chemical equipment data across both desktop and web environments. Developed secure JWT-based authentication, equipment lifecycle management, CSV-based bulk data uploads, and interactive dashboards for equipment health visualization. Designed the architecture so both the React web dashboard and PyQt6 desktop client consumed the same REST API, ensuring feature parity across platforms. Implemented theme support, scalable database integration, and analytical visualizations using Recharts and Matplotlib for operational monitoring.",
    stack: [
      "Django",
      "Django REST Framework",
      "React",
      "Vite",
      "PyQt6",
      "PostgreSQL",
      "SQLite",
    ],
    stat: {
      value: "3",
      label: "platform architecture",
    },
    year: "2025",
  },
  {
    id: "mnist-digit-recognition",
    category: "Project & Works",
    name: "mnist-digit-recognition",
    title: "MNIST Handwritten Digit Recognition",
    summary:
      "A convolutional neural network built to accurately classify handwritten digits while exploring the complete deep learning training pipeline.",
    detail:
      "Implemented an end-to-end image classification system using TensorFlow and Keras on the MNIST dataset. Experimented with different CNN architectures, optimizers, and regularization strategies to improve prediction accuracy while minimizing overfitting. Built visualizations for training metrics, confusion matrices, and prediction confidence to better understand model performance and learning behavior.",
    stack: [
      "Python",
      "TensorFlow",
      "Keras",
      "NumPy",
      "Matplotlib",
      "OpenCV",
    ],
    stat: {
      value: "CNN",
      label: "digit classification",
    },
    year: "2024",
  },
  {
    id: "mini-llm",
    category: "Project & Works",
    name: "mini-llm",
    title: "MiniLLM — Lightweight Transformer Language Model",
    summary:
      "A compact transformer-based language model developed to understand the internal workings of modern large language models.",
    detail:
      "Implemented a miniature decoder-only transformer from scratch as an academic exploration of modern language models. Built custom modules for token embeddings, positional encodings, masked self-attention, multi-head attention, feed-forward networks, and autoregressive text generation. The project focused on understanding transformer internals rather than competing with production-scale models, providing practical experience with sequence modeling, training pipelines, and inference optimization.",
    stack: [
      "Python",
      "PyTorch",
      "Transformers",
      "NumPy",
      "Tokenization",
    ],
    stat: {
      value: "Decoder",
      label: "transformer built from scratch",
    },
    year: "2025",
  },
  {
    id: "sheetflow",
    category: "Freelance Works",
    name: "sheetflow",
    title: "SheetFlow — Collaborative Spreadsheet Platform",
    summary:
      "A browser-based spreadsheet application supporting collaborative editing, formula evaluation, and real-time synchronization for multiple users.",
    detail:
      "Developed a spreadsheet platform inspired by Google Sheets with support for concurrent editing, spreadsheet creation, cell formatting, and formula calculations. Designed a scalable synchronization layer to keep multiple users in sync while minimizing update conflicts. The project explored collaborative system design, efficient state management, and responsive UI rendering for large spreadsheets.",
    stack: [
      "React",
      "Node.js",
      "Express",
      "Socket.IO",
      "SQLite",
      "JavaScript",
    ],
    stat: {
      value: "Multi-User",
      label: "real-time collaboration",
    },
    year: "2025",
  },
  {
    id: "college-discovery-platform",
    category: "Freelance Works",
    name: "college-discovery-platform",
    title: "College Discovery Platform",
    summary:
      "A centralized platform that helps students discover, compare, and shortlist colleges using filters, rankings, placement statistics, and academic insights.",
    detail:
      "Built a modern web platform to simplify the college selection process by aggregating institutional information into a single searchable interface. Designed advanced filtering based on location, fees, entrance examinations, branches, placement statistics, accreditation, and rankings. Implemented responsive dashboards, detailed college profiles, bookmarking, and comparison features to help students make informed admission decisions. The project focused heavily on scalable frontend architecture, efficient API design, and intuitive user experience for handling large datasets.",
    stack: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "REST API",
      "Tailwind CSS",
    ],
    stat: {
      value: "100+",
      label: "college profiles managed",
    },
    year: "2025",
  },
  {
    id: "finserv",
    category: "Freelance Works",
    name: "finserv",
    title: "FinServ — Personal Finance Manager",
    summary:
      "A Flutter-based finance management application that enables users to monitor expenses, manage budgets, and visualize spending habits in real time.",
    detail:
      "Developed a cross-platform personal finance application using Flutter and Firebase with secure authentication, cloud synchronization, expense categorization, and monthly budgeting tools. Built analytical dashboards to visualize income, expenditure trends, category-wise spending, and savings over time. Leveraged Firebase services for authentication, cloud storage, and real-time database synchronization while maintaining a clean and responsive mobile experience.",
    stack: [
      "Flutter",
      "Firebase",
      "Cloud Firestore",
      "Firebase Authentication",
      "Dart",
    ],
    stat: {
      value: "Cloud",
      label: "real-time finance tracking",
    },
    year: "2025",
  },
  {
    id: "adobe-pdf-analyzer",
    category: "Hackathons",
    name: "adobe-pdf-analyzer",
    title: "Adobe India Hackathon — Smart AI PDF Analyzer",
    summary:
      "An intelligent document analysis system that extracts, ranks, and summarizes the most relevant information from large PDF collections based on user intent.",
    detail:
      "Designed an end-to-end document intelligence pipeline capable of processing multiple PDF documents, extracting structured content, generating semantic embeddings, and retrieving the most relevant sections according to a user-defined persona and objective. Built a hierarchical document extraction workflow using DistilBERT embeddings and FAISS similarity search to efficiently identify contextually relevant information across documents. Automated the complete pipeline from PDF parsing and section indexing to structured JSON generation, enabling fast knowledge retrieval from extensive document collections.",
    stack: [
      "Python",
      "DistilBERT",
      "FAISS",
      "PyTorch",
      "JSON",
      "NLP",
    ],
    stat: {
      value: "Semantic",
      label: "document retrieval pipeline",
    },
    year: "2026",
  },
  {
    id: "green-hydrogen-management",
    category: "Freelance Works",
    name: "green-hydrogen-management",
    title: "Green Hydrogen Management System",
    summary:
      "An industrial monitoring platform that predicts equipment failures in hydrogen production systems using machine learning and anomaly detection.",
    detail:
      "Developed a predictive monitoring platform for hydrogen electrolyser systems capable of identifying abnormal operating conditions before equipment failure. Built machine learning pipelines for anomaly detection, health monitoring, and equipment analytics while integrating interactive dashboards for real-time visualization of operational metrics. The project explored predictive maintenance techniques using VIME-based anomaly detection models alongside traditional machine learning approaches to improve operational reliability and minimize downtime in green hydrogen production environments.",
    stack: [
      "Python",
      "TensorFlow",
      "VIME",
      "Flask",
      "PostgreSQL",
      "Matplotlib",
    ],
    stat: {
      value: "AI",
      label: "predictive equipment monitoring",
    },
    year: "2025",
  },
  {
    id: "agropath-ai",
    category: "Project & Works",
    name: "agropath-ai",
    title: "AgroPath AI — Intelligent Drone Path Prediction",
    summary:
      "An AI-assisted agricultural drone navigation system that predicts efficient flight paths for crop monitoring while minimizing travel time and energy consumption.",
    detail:
      "Designed an intelligent route planning system for autonomous agricultural drones capable of generating optimized flight paths across farmland for surveying and crop inspection. Built algorithms to process field boundaries, waypoint generation, and obstacle-aware navigation while minimizing redundant coverage. The project explored AI-driven path optimization techniques, geospatial data processing, and scalable route generation to improve coverage efficiency, battery utilization, and overall mission planning for precision agriculture.",
    stack: [
      "Python",
      "OpenCV",
      "NumPy",
      "GeoJSON",
      "A* Search",
      "Machine Learning",
    ],
    stat: {
      value: "AI",
      label: "optimized flight planning",
    },
    year: "2025",
  },
  {
    id: "dataflow-onboarding",
    category: "Freelance Works",
    name: "dataflow-onboarding",
    title: "DataFlow — AI Freelancer Onboarding Platform",
    summary:
      "A scalable onboarding platform that enables organizations to collect, validate, and manage AI training datasets from distributed freelancer teams.",
    detail:
      "Built a full-stack onboarding platform with independently deployable frontend and backend applications to streamline AI data collection workflows. Designed dynamic onboarding forms, authentication, project allocation, submission tracking, and dataset management while maintaining a modular architecture that allows frontend and backend releases to evolve independently. Focused on clean API design, responsive user experience, and scalable workflows suitable for managing large groups of freelance contributors participating in AI data annotation and collection projects.",
    stack: [
      "React",
      "Vite",
      "FastAPI",
      "Python",
      "Axios",
      "Tailwind CSS",
      "SQLite",
    ],
    stat: {
      value: "Modular",
      label: "frontend & backend deployment",
    },
    year: "2026",
  },
];