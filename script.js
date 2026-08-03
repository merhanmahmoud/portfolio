/* ==========================================================================
   Merhan Mahmoud AI Portfolio - Interactive JavaScript Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNeuralCanvas();
    initNavbarScroll();
    initLanguageToggle();
    initHeadlineTyping();
    initn8nWorkflowSimulator();
    initAIAgentChat();
    initContactForm();
    initCVDownload();
});

/* ==========================================================================
   1. Neural Connected Nodes Canvas Background
   ========================================================================== */
function initNeuralCanvas() {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let particles = [];
    const particleCount = Math.floor((width * height) / 18000);

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 242, 254, 0.5)';
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 242, 254, ${1 - dist / 130 * 0.8})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
}

/* ==========================================================================
   2. Navbar Scroll & Mobile Menu
   ========================================================================== */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        // Close menu on link click
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
            });
        });
    }
}

/* ==========================================================================
   3. Language Toggle (English <-> Arabic)
   ========================================================================== */
let currentLang = 'en';

function initLanguageToggle() {
    const langBtn = document.getElementById('langToggleBtn');
    const langText = document.getElementById('langText');

    if (!langBtn) return;

    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ar' : 'en';
        
        document.documentElement.lang = currentLang;
        document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

        langText.textContent = currentLang === 'en' ? 'العربية' : 'English';

        // Swap all translatable elements with data-en and data-ar
        document.querySelectorAll('[data-en][data-ar]').forEach(el => {
            const translation = el.getAttribute(`data-${currentLang}`);
            if (translation) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translation;
                } else {
                    el.textContent = translation;
                }
            }
        });
    });
}

/* ==========================================================================
   4. Typing Headline Effect
   ========================================================================== */
function initHeadlineTyping() {
    const headlineEl = document.getElementById('typing-headline');
    if (!headlineEl) return;

    const phrases = [
        "AI Engineer | Master's Researcher",
        "AI Agent Specialist & Developer",
        "n8n Workflow Automation Expert",
        "LLMs, Prompt Engineering & RAG"
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function typeStep() {
        const currentPhrase = phrases[phraseIdx];
        
        if (isDeleting) {
            headlineEl.textContent = currentPhrase.substring(0, charIdx - 1);
            charIdx--;
        } else {
            headlineEl.textContent = currentPhrase.substring(0, charIdx + 1);
            charIdx++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIdx === currentPhrase.length) {
            speed = 2200; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            speed = 500;
        }

        setTimeout(typeStep, speed);
    }

    typeStep();
}

/* ==========================================================================
   5. Interactive n8n AI Workflow Simulator
   ========================================================================== */
function initn8nWorkflowSimulator() {
    const runBtn = document.getElementById('runSimBtn');
    const simDot = document.getElementById('simDot');
    const simStatusText = document.getElementById('simStatusText');
    const consoleBody = document.getElementById('consoleBody');
    const clearBtn = document.getElementById('clearConsoleBtn');

    if (!runBtn) return;

    let isRunning = false;

    function addConsoleLog(msg, type = 'info') {
        const line = document.createElement('div');
        line.className = `log-line ${type}`;
        const time = new Date().toLocaleTimeString();
        line.textContent = `[${time}] ${msg}`;
        consoleBody.appendChild(line);
        consoleBody.scrollTop = consoleBody.scrollHeight;
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            consoleBody.innerHTML = '<div class="log-line">[SYSTEM] Console cleared. Ready for next execution.</div>';
        });
    }

    runBtn.addEventListener('click', async () => {
        if (isRunning) return;
        isRunning = true;
        runBtn.disabled = true;

        simDot.classList.add('active');
        simStatusText.textContent = currentLang === 'en' ? "Status: Executing Workflow..." : "الحالة: يجرى التشغيل...";

        // Reset node visuals
        for (let i = 1; i <= 4; i++) {
            document.getElementById(`node-${i}`).classList.remove('active-node');
            document.getElementById(`node-${i}`).querySelector('.node-status-badge').textContent = 'Idle';
            if (i < 4) {
                const line = document.getElementById(`line-${i}`);
                if (line) line.style.width = '0%';
            }
        }

        addConsoleLog('🚀 [TRIGGER] Webhook payload received: { event: "user_inquiry", query: "Optimize lead pipeline" }', 'process');

        // Step 1: Webhook Trigger Node
        await sleep(800);
        activateNode(1, 'Executing');
        addConsoleLog('⚡ Node 1 (Webhook Trigger): Parsing HTTP POST request headers & body payload.', 'info');
        
        // Connector 1
        await animateLine(1);

        // Step 2: RAG Vector Search
        activateNode(2, 'Searching');
        addConsoleLog('🔍 Node 2 (RAG Vector DB): Generating query embeddings & searching Pinecone index...', 'process');
        await sleep(1000);
        addConsoleLog('✅ Node 2: Retrieved 3 relevant context chunks (Similarity score: 0.94)', 'success');
        
        // Connector 2
        await animateLine(2);

        // Step 3: LLM Reasoning Agent
        activateNode(3, 'Reasoning');
        addConsoleLog('🧠 Node 3 (LLM Agent GPT-4o): Constructing prompt with RAG context & evaluating actions...', 'process');
        await sleep(1200);
        addConsoleLog('🤖 Node 3 Decision: Selected Action -> "REST_API_QUALIFY_LEAD"', 'info');

        // Connector 3
        await animateLine(3);

        // Step 4: REST API Action & Output
        activateNode(4, 'Dispatching');
        addConsoleLog('📡 Node 4 (REST API): Sending POST request to CRM & Slack Webhook...', 'process');
        await sleep(900);
        addConsoleLog('🎉 [SUCCESS] HTTP 200 OK. CRM Record updated & Slack notification dispatched!', 'success');
        
        document.getElementById('node-4').querySelector('.node-status-badge').textContent = 'Completed';
        simDot.classList.remove('active');
        simStatusText.textContent = currentLang === 'en' ? "Status: Workflow Completed (200 OK)" : "الحالة: إكتمل مسار العمل بنجاح";

        runBtn.disabled = false;
        isRunning = false;
    });

    function activateNode(nodeNum, statusText) {
        // Deactivate previous
        for (let i = 1; i <= 4; i++) {
            if (i !== nodeNum) {
                const n = document.getElementById(`node-${i}`);
                if (n.classList.contains('active-node')) {
                    n.querySelector('.node-status-badge').textContent = 'Done';
                }
            }
        }
        const activeNode = document.getElementById(`node-${nodeNum}`);
        activeNode.classList.add('active-node');
        activeNode.querySelector('.node-status-badge').textContent = statusText;
    }

    function animateLine(lineNum) {
        return new Promise(resolve => {
            const line = document.getElementById(`line-${lineNum}`);
            if (line) {
                line.style.width = '100%';
            }
            setTimeout(resolve, 600);
        });
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/* ==========================================================================
   6. Interactive AI Agent Chat Playground
   ========================================================================== */
function initAIAgentChat() {
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const suggestBtns = document.querySelectorAll('.suggest-btn');

    if (!chatForm) return;

    const qaDatabase = [
        {
            keywords: ['background', 'experience', 'who', 'about', 'experience', 'خبرة', 'عن'],
            response: "Merhan Mahmoud is an AI Engineer and Master's Researcher in Artificial Intelligence with over 3 years of experience teaching Programming and AI. She specializes in building AI Agents, n8n automations, and LLM applications."
        },
        {
            keywords: ['n8n', 'workflow', 'automation', 'أتمتة', 'عمل'],
            response: "Merhan is an n8n automation expert! She designs end-to-end intelligent workflows connecting webhooks, vector databases, LLM reasoning nodes, and external REST APIs to eliminate manual work."
        },
        {
            keywords: ['skills', 'tech', 'python', 'rag', 'llm', 'مهارات', 'تقنيات'],
            response: "Her core skills include: AI Agents, n8n Workflow Automation, Large Language Models (LLMs), Prompt Engineering, RAG Systems, Python, REST APIs, and Workflow Design."
        },
        {
            keywords: ['contact', 'hire', 'email', 'project', 'تواصل', 'عمل', 'مشروع'],
            response: "You can reach out directly via email at merhanmahmoud90@gmail.com or connect via LinkedIn (www.linkedin.com/in/merhan-mahmoud)!"
        },
        {
            keywords: ['teaching', 'instructor', 'students', 'تدريس', 'تعليم'],
            response: "Merhan has over 3 years of experience teaching programming and AI principles to hundreds of students, making complex concepts easy to understand and implement."
        }
    ];

    function appendMessage(text, isUser = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${isUser ? 'msg-user' : 'msg-ai'}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'msg-content';
        contentDiv.textContent = text;

        msgDiv.appendChild(contentDiv);
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function processQuestion(question) {
        appendMessage(question, true);

        // Simulated AI thinking / typing delay
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-msg msg-ai';
        typingDiv.innerHTML = '<div class="msg-content">🤖 <i>n8n AI Agent is generating response...</i></div>';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(() => {
            chatMessages.removeChild(typingDiv);

            const qLower = question.toLowerCase();
            let matchedObj = qaDatabase.find(item => 
                item.keywords.some(kw => qLower.includes(kw))
            );

            let answer = matchedObj ? matchedObj.response : 
                "Merhan Mahmoud is specialized in AI Agents, n8n automation, and LLM engineering. Feel free to contact her directly to discuss your specific custom project requirements!";
            
            appendMessage(answer, false);
        }, 800);
    }

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (text) {
            processQuestion(text);
            chatInput.value = '';
        }
    });

    suggestBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const q = btn.getAttribute('data-question');
            if (q) processQuestion(q);
        });
    });
}

/* ==========================================================================
   7. Contact Form Handler
   ========================================================================== */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formResponse = document.getElementById('formResponse');

    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        formResponse.style.color = '#10b981';
        formResponse.innerHTML = currentLang === 'en' ?
            `Thank you ${name}! Your message has been sent. Merhan will get back to you shortly.` :
            `شكراً لك ${name}! تم إرسال رسالتك بنجاح. ستتواصل معك مرهان قريباً.`;
        
        contactForm.reset();
        setTimeout(() => {
            formResponse.innerHTML = '';
        }, 5000);
    });
}

/* ==========================================================================
   8. Reliable PDF Blob Downloader Handler
   ========================================================================== */
function initCVDownload() {
    const cvButtons = document.querySelectorAll('a[download]');
    cvButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            try {
                const response = await fetch('Merhan_Mahmoud_CV.pdf');
                if (!response.ok) throw new Error('File fetch failed');
                
                const blob = await response.blob();
                const pdfBlob = new Blob([blob], { type: 'application/pdf' });
                const blobUrl = URL.createObjectURL(pdfBlob);
                
                const tempLink = document.createElement('a');
                tempLink.href = blobUrl;
                tempLink.download = 'Merhan_Mahmoud_CV.pdf';
                document.body.appendChild(tempLink);
                tempLink.click();
                
                setTimeout(() => {
                    document.body.removeChild(tempLink);
                    URL.revokeObjectURL(blobUrl);
                }, 500);
            } catch (err) {
                const fallbackLink = document.createElement('a');
                fallbackLink.href = 'Merhan_Mahmoud_CV.pdf';
                fallbackLink.download = 'Merhan_Mahmoud_CV.pdf';
                fallbackLink.target = '_blank';
                document.body.appendChild(fallbackLink);
                fallbackLink.click();
                document.body.removeChild(fallbackLink);
            }
        });
    });
}
