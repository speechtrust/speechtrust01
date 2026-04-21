import mongoose from "mongoose";
import dotenv from "dotenv";

import { AssessmentData } from "./models/assessmentData.model.js";
import { Question } from "./models/question.model.js";

dotenv.config({ path: '../.env' });

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to database.");

        await AssessmentData.deleteMany({});
        await Question.deleteMany({});
        console.log("Cleared old assessments and questions.");

        // ==========================================
        // 1. Basic HR & Soft Skills Assessment
        // ==========================================
        const hrAssessment = await AssessmentData.create({
            title: "Basic HR & Soft Skills",
            description: "Practice common behavioral and personal questions to evaluate general communication.",
            estimatedMinutes: 5,
            isActive: true
        });

        const hrQuestions = [
            {
                text: "Tell me about yourself.",
                ideal_answer: "I am a proactive computer science student with a passion for software development. I enjoy building applications and solving complex problems. I am eager to learn new technologies and contribute to team success.",
                keywords: ["student", "software", "development", "passionate", "learn", "team", "problem", "solving"]
            },
            {
                text: "What are your greatest strengths and weaknesses?",
                ideal_answer: "My greatest strength is my ability to quickly learn new technologies and adapt to change. My weakness is that I sometimes focus too much on details, but I am learning to balance that by setting strict deadlines.",
                keywords: ["strength", "learn", "adapt", "detail", "weakness", "focus", "deadlines", "balance"]
            },
            {
                text: "Describe a time you faced a difficult challenge and how you overcame it.",
                ideal_answer: "In a recent project, our team faced a tight deadline when a core component failed. I communicated the issue immediately, reorganized our tasks, and put in extra hours to rewrite the module. We successfully delivered the project on time.",
                keywords: ["challenge", "deadline", "communicated", "reorganized", "extra hours", "delivered", "success"]
            },
            {
                text: "Where do you see yourself in 5 years?",
                ideal_answer: "In five years, I see myself as a senior full-stack developer or technical lead, taking on more architectural responsibilities and mentoring junior team members while continuing to build scalable applications.",
                keywords: ["senior", "developer", "lead", "architectural", "mentoring", "scalable", "applications"]
            },
            {
                text: "Why should we hire you for this role?",
                ideal_answer: "You should hire me because I have a strong foundation in modern web technologies, a proven track record of building functional projects, and a passion for continuous learning. I am highly motivated and ready to add immediate value to your team.",
                keywords: ["hire", "foundation", "technologies", "projects", "learning", "motivated", "value"]
            }
        ];

        for (let i = 0; i < hrQuestions.length; i++) {
            await Question.create({
                assessment: hrAssessment._id,
                ...hrQuestions[i],
                readTime: 10, answerTime: 60, weight: 1, order: i + 1
            });
        }

        // ==========================================
        // 2. Python Programming Assessment
        // ==========================================
        const pythonAssessment = await AssessmentData.create({
            title: "Python Programming",
            description: "Technical assessment evaluating your core understanding of Python.",
            estimatedMinutes: 5,
            isActive: true
        });

        const pythonQuestions = [
            {
                text: "Explain the difference between a list and a tuple in Python.",
                ideal_answer: "The main difference is that lists are mutable and can be changed after creation, while tuples are immutable and cannot be changed. Lists use square brackets, whereas tuples use parentheses.",
                keywords: ["mutable", "immutable", "changed", "square brackets", "parentheses", "faster", "fixed"]
            },
            {
                text: "What is a decorator in Python and how is it used?",
                ideal_answer: "A decorator is a design pattern in Python that allows you to modify the behavior of a function or class without modifying its source code. It takes another function as an argument, typically denoted by the at symbol.",
                keywords: ["design pattern", "modify", "behavior", "function", "source code", "argument", "at symbol", "@"]
            },
            {
                text: "Explain the difference between deep copy and shallow copy.",
                ideal_answer: "A shallow copy creates a new object but inserts references to the nested objects found in the original. A deep copy creates a new object and recursively adds copies of nested objects, so changes to the copy don't affect the original.",
                keywords: ["shallow", "references", "nested", "deep", "recursively", "copies", "original", "affect"]
            },
            {
                text: "What is the Global Interpreter Lock or GIL in Python?",
                ideal_answer: "The GIL is a mutex that protects access to Python objects, preventing multiple native threads from executing Python bytecodes at once. This makes CPython thread-safe but limits the efficiency of CPU-bound multi-threading.",
                keywords: ["GIL", "mutex", "protects", "threads", "executing", "bytecodes", "CPython", "CPU-bound"]
            },
            {
                text: "How does Python handle memory management and garbage collection?",
                ideal_answer: "Python manages memory automatically using a private heap. The garbage collector uses reference counting to keep track of objects, and a cyclic garbage collector to detect and clean up reference cycles.",
                keywords: ["memory", "private heap", "garbage", "collector", "reference counting", "cyclic", "cycles", "clean up"]
            }
        ];

        for (let i = 0; i < pythonQuestions.length; i++) {
            await Question.create({
                assessment: pythonAssessment._id,
                ...pythonQuestions[i],
                readTime: 10, answerTime: 60, weight: 1.5, order: i + 1
            });
        }

        // ==========================================
        // 3. Operating Systems Assessment
        // ==========================================
        const osAssessment = await AssessmentData.create({
            title: "Operating Systems",
            description: "Evaluate your understanding of core OS concepts like processes and memory.",
            estimatedMinutes: 5,
            isActive: true
        });

        const osQuestions = [
            {
                text: "What is the difference between a process and a thread?",
                ideal_answer: "A process is an independent program in execution with its own memory space, while a thread is the smallest sequence of instructions within a process. Threads share the same memory space, making context switching faster.",
                keywords: ["independent", "execution", "memory space", "smallest sequence", "share", "context switching", "faster"]
            },
            {
                text: "Explain the concept of virtual memory.",
                ideal_answer: "Virtual memory is a memory management technique that creates an illusion of a very large main memory. It works by mapping memory addresses used by a program into physical addresses, paging data between RAM and the hard disk.",
                keywords: ["memory management", "illusion", "large", "mapping", "physical", "paging", "swapping", "RAM", "disk"]
            },
            {
                text: "What is a deadlock and what are its four necessary conditions?",
                ideal_answer: "A deadlock is a situation where a set of processes are blocked because each is holding a resource and waiting for another. The four conditions are mutual exclusion, hold and wait, no preemption, and circular wait.",
                keywords: ["deadlock", "blocked", "resource", "waiting", "mutual exclusion", "hold and wait", "preemption", "circular wait"]
            },
            {
                text: "Explain what a context switch is in an operating system.",
                ideal_answer: "A context switch is the process where the CPU saves the state or context of the currently running process and loads the state of another process to be executed. It is essential for multitasking but introduces overhead.",
                keywords: ["context switch", "CPU", "saves", "state", "currently running", "loads", "executed", "multitasking", "overhead"]
            },
            {
                text: "What is thrashing in the context of memory management?",
                ideal_answer: "Thrashing occurs when an operating system spends more time paging data in and out of virtual memory than it does executing actual processes. This happens when the system does not have enough physical memory to support the active applications.",
                keywords: ["thrashing", "paging", "virtual memory", "executing", "processes", "physical memory", "support", "active"]
            }
        ];

        for (let i = 0; i < osQuestions.length; i++) {
            await Question.create({
                assessment: osAssessment._id,
                ...osQuestions[i],
                readTime: 10, answerTime: 60, weight: 1.5, order: i + 1
            });
        }

        console.log("Successfully injected 3 Assessments and 15 Questions.");
        process.exit(0);

    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();