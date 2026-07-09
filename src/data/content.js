/* ------------------------------------------------------------------ */
/*  PORTFOLIO CONTENT                                                   */
/*  This is the ONLY file you need to touch to make this portfolio      */
/*  yours. Every value here is a placeholder — see README.md for a      */
/*  field-by-field guide.                                               */
/* ------------------------------------------------------------------ */

export const SITE = {
  name: "Aarya Nema",
  logoTag: "Aarya",
  taglineVerb: "develop", // the italic-serif word in the hero
  taglineTail: "AI Scalable Software", // the monospace closing phrase
  badge: "Contact Me /", // side badge text
  year: "2026",
};

export const NAV_ITEMS = [
  { id: "start", label: "Start" },
  { id: "work", label: "Work" },
  { id: "lab", label: "Lab" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];
/* Each project needs a unique `id`, a `category` that matches an entry
   in CATEGORIES below, and an `index` string used for display only. */

export const WORK_PROJECTS = [
  {
    id: "efms",
    category: "FULL-STACK",
    index: "01",
    name: "EFMS",
    full: "Enterprise Finance Management System",
    previewUrl: "public/previews/flowvault-showcase.html",


    tags: [
      "#React",
      "#Node.js",
      "#Prisma",
      "#PostgreSQL",
      "#Docker",
      "#RBAC",
      "#Enterprise",
      "#Finance"
    ],

    description: `EFMS started with a problem I noticed in many organizations—finance approvals often disappeared into endless email threads, spreadsheets, and manual follow-ups. I wanted to build a platform where every fund request could be created, reviewed, approved, and audited from a single place without forcing employees to learn a complicated system.
    The biggest engineering challenge wasn't building forms or dashboards—it was designing an approval engine flexible enough to support different departments and organizational hierarchies. Instead of hardcoding approval paths, I created a configurable workflow that could adapt to different business rules while maintaining complete transparency over every financial decision.
    I also focused heavily on traceability. Every approval, rejection, modification, and budget update is recorded, allowing finance teams to audit the complete lifecycle of a request whenever required.
    What I'm most proud of is creating a workflow that feels simple for employees while hiding the complexity of enterprise finance behind an intuitive interface.`,

    features: [
      "✓ Configurable multi-level approval workflows",
      "✓ Department-wise budget monitoring and analytics",
      "✓ Complete audit trail for transparency and compliance",
      "✓ Secure role-based authorization across every module",
      "✓ Optimized relational schema using Prisma & PostgreSQL",
      "✓ Dockerized deployment with CI/CD-ready architecture"
    ],

    gradient: "linear-gradient(135deg,#11191C,#1c2b28)",
    image: "/images/efms.png",
    rotate: -4,
    video: true,
    link: "#",
  },
  {
    id: "dineos",
    category: "FULL-STACK",
    index: "02",
    name: "DineOS",
    full: "Restaurant Point of Sale System",
    previewUrl: "public/previews/dineos-showcase.html",


    tags: [
      "#Electron",
      "#React",
      "#Node.js",
      "#MongoDB",
      "#OfflineFirst",
      "#POS",
      "#Bluetooth"
    ],

    description: `DineOS grew out of a simple observation—many restaurant POS systems either depend heavily on a stable internet connection or feel outdated and unnecessarily complicated. Restaurants operate in fast-paced environments where every second matters, and losing connectivity shouldn't stop them from serving customers.
    I wanted to build software that staff could trust during busy hours. Orders, billing, kitchen communication, and receipt printing all continue to work even when the internet is unavailable, with automatic synchronization once connectivity returns.
    One of the most enjoyable parts of this project was integrating Bluetooth and network ESC/POS printers while ensuring that kitchen tickets and receipts were always delivered reliably. Small details like printer retries, offline persistence, and instant status updates made a huge difference to the overall experience.
    What I'm most proud of is making complex restaurant operations feel effortless through thoughtful UI design and a reliable offline-first architecture.`,

    features: [
      "✓ Offline-first desktop architecture with local persistence",
      "✓ Live kitchen ticket routing and order status management",
      "✓ Bluetooth & LAN ESC/POS printer integration",
      "✓ GST billing, discounts, and receipt generation",
      "✓ Automatic synchronization after reconnecting",
      "✓ Cross-platform desktop application built with Electron"
    ],

    gradient: "linear-gradient(135deg,#101a17,#17332b)",
    image: "/images/dineos.png",
    rotate: 3,
    video: true,
    link: "#",
  },
  {
    id: "medicare",
    category: "FULL-STACK",
    index: "03",
    name: "Medicare",
    full: "Hospital Appointment & Patient Management",
    previewUrl: "public/previews/medicare-landing.html",

    tags: [
      "#React",
      "#Node.js",
      "#Express",
      "#MongoDB",
      "#Healthcare",
      "#RBAC",
      "#Docker"
    ],

    description: `Healthcare software often feels like it was designed around paperwork instead of the people who actually use it. While working on Medicare, I wanted to build something that reduced administrative overhead while remaining intuitive for patients, doctors, and hospital staff.
    The platform brings together appointment scheduling, patient records, doctor management, and administrative workflows into a single application. Every user sees only the information that's relevant to them through a carefully designed role-based access system, making the experience both secure and easy to navigate.
    One of the biggest challenges was balancing usability with privacy. Medical information is sensitive by nature, so I spent considerable time designing authorization flows that protected patient data without creating unnecessary friction for doctors during their daily workflow.
    What I'm most proud of is building software that focuses equally on usability and security—two things that should always go hand in hand when developing healthcare applications.`,

    features: [
      "✓ Secure role-based portals for patients, doctors, and administrators",
      "✓ Appointment scheduling with live notifications",
      "✓ Centralized electronic patient record management",
      "✓ Doctor availability and scheduling system",
      "✓ Responsive interface optimized for desktop and mobile",
      "✓ RESTful backend designed for scalability and maintainability"
    ],

    gradient: "linear-gradient(135deg,#0e1a19,#173028)",
    image: "/images/medicare.png",
    rotate: -3,
    video: true,
    link: "#",
  },
  {
    id: "aichatbot",
    category: "AI",
    index: "01",
    name: "AI Chatbot",
    full: "Real-Time Voice AI Assistant",
    previewUrl: "public/previews/ai-chatbot-landing.html",

    tags: [
      "#Python",
      "#React",
      "#Node.js",
      "#PyTorch",
      "#Whisper",
      "#MicrosoftPhi-2",
      "#kokoroTTS",
      "#Streaming",
      "#VoiceAI",
      "#VAD"
    ],

    description: `This project began with a question I couldn't stop thinking about: why do even the best AI voice assistants still hesitate before answering?

    Most conversational systems process speech recognition, language model inference, and speech synthesis one after another. That sequential pipeline introduces delays that make conversations feel robotic. Instead of accepting that limitation, I redesigned the architecture around streaming, allowing every stage to begin processing before the previous one had completely finished.
    Building this meant experimenting with Voice Activity Detection, streaming audio buffers, asynchronous inference, and multiple speech engines until conversations started to feel noticeably more natural. Even reducing latency by a few hundred milliseconds completely changes how responsive an AI assistant feels.
    The system was intentionally designed to remain modular, making it easy to swap different speech recognition models, language models, or text-to-speech engines without changing the overall architecture. That flexibility has made it an excellent playground for experimenting with new AI models.
    What I'm most proud of is transforming what started as a latency optimization experiment into a conversational assistant that genuinely feels pleasant to interact with.`,

    features: [
      "✓ Streaming Speech → LLM → Speech inference pipeline",
      "✓ Low-latency architecture optimized for real-time conversations",
      "✓ Voice Activity Detection (VAD) for hands-free interaction",
      "✓ Modular support for multiple LLMs and TTS engines",
      "✓ Real-time audio streaming with interruption handling",
      "✓ Easily extensible architecture for rapid AI experimentation"
    ],

    gradient: "linear-gradient(135deg,#0f1a1c,#123028)",
    image: "/images/ai-chatbot.png",
    rotate: -2,
    video: true,
    link: "#",
  },
  {
    id: "annotationsystem",
    category: "AI",
    index: "02",
    name: "Annotation System",
    full: "AI-Powered Data Annotation Platform",
    previewUrl: "public/previews/ai-annotate-landing.html",

    tags: [
      "#React",
      "#Node.js",
      "#Python",
      "#YOLOv8",
      "#TensorFlow",
      "#PyTorch",
      "#Redis",
      "#MinIO",
      "#Docker",
      "#ComputerVision",
      "#MLOps"
    ],

    description: `One thing I learned while working on computer vision projects is that building the model is rarely the hardest part—creating high-quality datasets usually takes far more time. That realization inspired me to build an annotation platform where AI assists people instead of replacing them.
    Rather than forcing annotators to label everything manually, the platform generates predictions using trained object detection models and attaches confidence scores to every annotation. High-confidence predictions can be accepted instantly, while uncertain cases are automatically routed for human review, dramatically reducing repetitive work without sacrificing quality.
    I also wanted annotation to be more than just drawing bounding boxes, so I integrated dataset versioning, automated model retraining, and deployment into the same workflow. Every improvement made by annotators contributes directly to producing a stronger model, creating a continuous feedback loop between humans and AI.
    What I'm most proud of is turning what is usually a repetitive manual task into an intelligent system that becomes more accurate every time it's used.`,

    features: [
      "✓ AI-assisted image annotation with human-in-the-loop validation",
      "✓ Confidence scoring for intelligent review prioritization",
      "✓ Automated object detection powered by YOLOv8",
      "✓ Integrated dataset versioning and model training pipeline",
      "✓ Hybrid online and offline deployment architecture",
      "✓ Scalable asset storage using MinIO and Redis-backed task processing"
    ],

    gradient: "linear-gradient(135deg,#12191b,#1b2c2a)",
    image: "/images/annotation-system.png",
    rotate: -3,
    video: true,
    link: "#",
  },
  {
    id: "research-ai",
    category: "AI",
    index: "03",
    name: "Research AI",
    full: "Multi-Agent AI Research Platform",
    previewUrl: "public/previews/ai-research-showcase.html",

    tags: [
      "#Next.js",
      "#Python",
      "#FastAPI",
      "#Redis",
      "#Celery",
      "#PostgreSQL",
      "#Docker",
      "#Ollama",
      "#RAG",
      "#MultiAgent",
      "#LLMs"
    ],

    description: `Research AI started with a question that kept coming back whenever I worked with large language models: if research itself is a collaborative process, why should a single AI model be responsible for doing everything?
    Instead of building another chatbot that tries to answer every question in one go, I designed a collaborative ecosystem of specialized AI agents. Each agent has a focused responsibility—planning the research strategy, retrieving information from multiple sources, validating evidence, synthesizing knowledge, and finally generating structured reports. Separating these responsibilities made the system significantly more reliable, easier to debug, and much closer to how human research teams actually work.
    Another goal from the beginning was accessibility and privacy. Many organizations can't rely entirely on cloud-hosted models, so I built the platform to work seamlessly with both online providers and fully offline local language models through Ollama. Long-running workflows are orchestrated using Celery, Redis, and PostgreSQL, allowing agents to collaborate asynchronously while keeping every task persistent and fault tolerant.
    One of the most enjoyable engineering challenges was coordinating communication between independent agents without making the system feel slow or overly complex. Watching each agent complete its own responsibility before handing work to the next genuinely feels like observing a digital research team collaborate in real time.
    What I'm most proud of isn't simply building another AI application—it's building a platform where independent AI agents work together to solve problems that would be difficult, unreliable, or inefficient for a single monolithic model to handle on its own.`,

    features: [
      "✓ Specialized AI agents for planning, retrieval, verification, analysis, and report generation",
      "✓ Retrieval-Augmented Generation (RAG) with structured knowledge synthesis",
      "✓ Hybrid cloud and fully offline LLM execution using Ollama",
      "✓ Distributed asynchronous orchestration powered by Celery and Redis",
      "✓ PostgreSQL-backed workflow persistence and task management",
      "✓ Citation-aware report generation with confidence scoring and human review",
      "✓ Modular architecture allowing new AI agents to be introduced with minimal changes"
    ],

    gradient: "linear-gradient(135deg,#12191b,#1b2c2a)",
    image: "/images/research-ai.png",
    rotate: -3,
    video: true,
    link: "#",
  },
];


export const CATEGORIES = ["FULL-STACK", "AI"];

export const ABOUT = {
  tagline: "// Building intelligent systems that solve real problems.",
  name: "Aarya Nema",
  email: "aaryanema2004@gmail.com",
  place: "Bhopal, India",

  work: [
    {
      range: "May 2026 — June 2026",
      role: "Software Developer Intern • Avyaan Management Pvt. Ltd.",
    },
    {
      range: "March 2025 — September 2025",
      role: "Artificial Intelligence Intern • Amasqis.AI",
    },
  ],

  education: [
    {
      years: "2023 — 2027",
      degree: "Bachelor of Technology (B.Tech) • Computer Science & Engineering",
    },
  ],

  skills: {
    languages: [
      "Python",
      "JavaScript",
      "TypeScript",
      "C++",
      "SQL",
    ],

    frontend: [
      "Next.js",
      "React",
      "Electron",
      "Flutter",
      "Tailwind CSS",
    ],

    backend: [
      "Node.js",
      "Express",
      "FastAPI",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Prisma",
      "Celery",
      "Firebase",
    ],

    ai: [
      "PyTorch",
      "TensorFlow",
      "Transformers",
      "Scikit-learn",
      "OpenCV",
      "RAG",
      "Computer Vision",
      "LLM Fine-Tuning",
      "Multi-Agent Systems",
    ],

    tools: [
      "Docker",
      "Git",
      "Linux",
      "Ollama",
      "MinIO",
      "Postman",
      "GitHub Actions",
    ],

    models: [
      "Llama 3",
      "Qwen",
      "Mistral",
      "Microsoft Phi",
      "YOLOv8",
      "Whisper",
      "Kokoro TTS",
      "Coqui TTS",
    ],
  },
};

/* `icon` refers to a lucide-react icon name imported in Socials.jsx —
   see README.md for the full list of icons you can use here. */
export const SOCIALS = [
  { icon: "Github", label: "github.com/lifelesscycle", href: "https://github.com/lifelesscycle" },
  { icon: "Linkedin", label: "linkedin.com/in/AaryaNema", href: "https://www.linkedin.com/in/aarya-nema-690296244/" },
  { icon: "Mail", label: "aaryanema2004@gmail.com", href: "mailto:aaryanema2004@gmail.com" },
];