/* ==========================================================================
   Merhan Mahmoud AI Portfolio - Interactive JavaScript Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNeuralCanvas();
    initNavbarScroll();
    initLanguageToggle();
    initHeadlineTyping();
    initn8nWorkflowSimulator();
    initProjectModal();
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
        if (!consoleBody) return;
        const line = document.createElement('div');
        line.className = `log-line ${type}`;
        const time = new Date().toLocaleTimeString();
        line.textContent = `[${time}] ${msg}`;
        consoleBody.appendChild(line);
        consoleBody.scrollTop = consoleBody.scrollHeight;
    }

    if (clearBtn && consoleBody) {
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
   7. Contact Form Handler
   ========================================================================== */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formResponse = document.getElementById('formResponse');

    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');
        const submitBtn = document.getElementById('submitContactBtn') || contactForm.querySelector('button[type="submit"]');
        const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';

        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const subject = subjectInput ? subjectInput.value : '';
        const message = messageInput ? messageInput.value.trim() : '';

        if (!name || !email || !message) return;

        // If opened as local file (file://), AJAX is restricted by FormSubmit origin check.
        // In local mode, let the browser submit natively to FormSubmit.
        if (window.location.protocol === 'file:') {
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = currentLang === 'en' 
                    ? '<i class="fa-solid fa-spinner fa-spin"></i> Submitting to Email...' 
                    : '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإرسال للبريد...';
            }
            return; // Native HTML POST to FormSubmit action
        }

        e.preventDefault();

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = currentLang === 'en' 
                ? '<i class="fa-solid fa-spinner fa-spin"></i> Sending...' 
                : '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإرسال...';
        }

        formResponse.style.color = '#3b82f6';
        formResponse.style.display = 'block';
        formResponse.innerHTML = currentLang === 'en' 
            ? '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending your message to merhanmahmoud90@gmail.com...' 
            : '<i class="fa-solid fa-circle-notch fa-spin"></i> جاري إرسال رسالتك إلى merhanmahmoud90@gmail.com...';

        try {
            const response = await fetch('https://formsubmit.co/ajax/merhanmahmoud90@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    Name: name,
                    Email: email,
                    Subject: subject,
                    Message: message,
                    _subject: `New Portfolio Inquiry from ${name}: ${subject}`,
                    _template: 'table',
                    _captcha: 'false'
                })
            });

            const result = await response.json();

            if (response.ok && (result.success === "true" || result.success === true)) {
                formResponse.style.color = '#10b981';
                formResponse.innerHTML = currentLang === 'en' ?
                    `✅ Thank you ${name}! Your message has been sent to merhanmahmoud90@gmail.com. She will get back to you shortly!` :
                    `✅ شكراً لك ${name}! تم إرسال رسالتك إلى بريدك (merhanmahmoud90@gmail.com) بنجاح، وستتواصل معك في أقرب وقت!`;
                contactForm.reset();
            } else {
                throw new Error(result.message || 'Form submission failed');
            }
        } catch (err) {
            console.warn('FormSubmit AJAX fallback to native submission:', err);
            contactForm.submit();
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
            }
        }
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

/* ==========================================================================
   9. High-Res Project Lightbox Modal Engine
   ========================================================================== */
function initProjectModal() {
    const modalOverlay = document.getElementById('projectModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalBody = document.getElementById('modalBody');

    if (!modalOverlay || !modalBody) return;

    const modalData = {
        'modal-support-agent': {
            badge: '<i class="fa-solid fa-headset"></i> n8n AI Agent • Smart Customer Support',
            titleEn: 'AI Agent for Smart Customer Support & Sales Automation',
            titleAr: 'وكيل الذكاء الاصطناعي الذكي لخدمة العملاء والمبيعات',
            subEn: 'Smarter Conversations. Real Business Impact. Built on n8n with Groq Chat Model, Google Sheets DB, and Gmail dispatch.',
            subAr: 'محادثات أذكى وأثر حقيقي للأعمال. مبني على n8n مع نموذج Groq وجدول Google Sheets وتنبيهات البريد.',
            imgSrc: 'assets/n8n-customer-support-agent.jpg',
            nodes: [
                { icon: 'fa-bolt', class: 'icon-purple', titleEn: '1. Webhook / Chat Trigger', titleAr: '1. مشغل المحادثة والويب هوك', descEn: 'Receives customer chat messages instantly via Webhook.', descAr: 'يستقبل رسائل المحادثة فوريًا عبر الـ Webhook.' },
                { icon: 'fa-brain', class: '', titleEn: '2. AI Agent Core (Groq Chat Model & Simple Memory)', titleAr: '2. وكيل AI الأساسي (Groq & Simple Memory)', descEn: 'Evaluates context, remembers chat history, and executes tools autonomously.', descAr: 'يحلل الطلب وينفذ الأدوات بناءً على سياق المحادثة المجهزة في الذاكرة.' },
                { icon: 'fa-table', class: 'icon-emerald', titleEn: '3. Google Sheets Integration Tool (Get row/s)', titleAr: '3. أداة الاستعلام من Google Sheets', descEn: 'Reads live inventory, categories, and pricing directly from Google Sheets.', descAr: 'يقرأ بيانات المنتجات والأسعار والمخزون مباشرة دون تعديل كود الـ n8n.' },
                { icon: 'fa-envelope', class: 'icon-amber', titleEn: '4. Gmail Dispatch Tool (Send Message)', titleAr: '4. أداة إرسال البريد عبر Gmail', descEn: 'Detects buying intent and sends structured purchase lead details to business owner.', descAr: 'يكتشف رغبة العميل بالشراء ويرسل تفاصيل الطلب للبائع مباشرة عبر Gmail.' }
            ],
            impactEn: [
                'Automates 80%+ of repetitive customer inquiries.',
                'Allows business owners to update inventory via Google Sheets effortlessly.',
                'Instant lead notification guarantees faster conversion rates.'
            ],
            impactAr: [
                'أتمتة أكثر من 80% من استفسارات العملاء الروتينية.',
                'تمكين صاحب العمل من تحديث المنتجات عبر شيت Google بكل سهولة.',
                'إشعار فوري بالمبيعات لضمان أسرع معدل تحويل واستجابة.'
            ]
        },
        'modal-telegram-agent': {
            badge: '<i class="fa-brands fa-telegram"></i> n8n AI Agent • Telegram Automated Workflow',
            titleEn: 'Automated Operations & Team Assistant AI Agent',
            titleAr: 'مساعد التلغرام والأتمتة الذكية للمهام والفريق',
            subEn: 'Connects your tools, manages tasks, schedules calendar events, and automates employee notifications.',
            subAr: 'يربط أدواتك، ويدير المهام، ويجدول أحداث التقويم، ويتمت إشعارات الموظفين تلقائياً.',
            imgSrc: 'assets/n8n-telegram-workflow-agent.jpg',
            nodes: [
                { icon: 'fa-telegram', class: 'icon-purple', titleEn: '1. Telegram Trigger Node', titleAr: '1. مشغل بوت Telegram', descEn: 'Captures incoming messages from Telegram channels or direct chats.', descAr: 'يستقبل التوجيهات والرسائل الواردة عبر Telegram.' },
                { icon: 'fa-robot', class: '', titleEn: '2. Groq LLM Agent & Memory', titleAr: '2. محرك Groq AI مع الذاكرة', descEn: 'Understands intent using Groq Chat Model and routes execution to appropriate tools.', descAr: 'يفهم نية المستخدم عبر Groq الذكي ويوجه العمل للأدوات المناسبة.' },
                { icon: 'fa-table', class: 'icon-emerald', titleEn: '3. Employee Database (Google Sheets)', titleAr: '3. قاعدة بيانات الموظفين (Sheets)', descEn: 'Queries employee details and active task schedules.', descAr: 'يقرأ بيانات وسجلات الموظفين من جدول Google Sheets.' },
                { icon: 'fa-calendar-days', class: 'icon-amber', titleEn: '4. Google Calendar API Tool', titleAr: '4. أداة التقويم (Google Calendar)', descEn: 'Creates meeting events with title, start/end time, and invitees.', descAr: 'ينشئ الأحداث والاجتماعات مباشرة على Google Calendar.' },
                { icon: 'fa-envelope', class: '', titleEn: '5. Employee Gmail Notification Tool', titleAr: '5. أداة إشعارات البريد للموظفين', descEn: 'Sends email updates to team members automatically.', descAr: 'يرسل بريداً إلكترونياً توضيحياً للموظفين المعنيين.' },
                { icon: 'fa-paper-plane', class: 'icon-purple', titleEn: '6. Telegram Response Output', titleAr: '6. الرد المباشر على Telegram', descEn: 'Sends status update and execution confirmation back to user.', descAr: 'يعيد رد البوت وتأكيد إتمام العملية للمستخدم على Telegram.' }
            ],
            impactEn: [
                'Eliminates manual task creation and calendar scheduling.',
                'Seamless mobile management directly through Telegram.',
                'Reduces team communication friction and operational errors.'
            ],
            impactAr: [
                'إلغاء الإدخال اليدوي للمهام وجدولة المواعيد.',
                'إدارة العمليات بمرونة من الهاتف عبر تطبيق Telegram.',
                'تقليل أخطاء التواصل والتنسيق بين أفراد الفريق.'
            ]
        },
        'modal-rag-assistant': {
            badge: '<i class="fa-solid fa-diagram-project"></i> n8n AI RAG Agent • Google Drive & Pinecone Vector Store',
            titleEn: 'Autonomous Google Drive RAG Knowledge Assistant',
            titleAr: 'مساعدك الذكي للملفات: من Google Drive إلى الإجابة على أسئلتك (RAG)',
            subEn: 'Periodically monitors Google Drive folders, downloads new files, chunks and embeds content into Pinecone via Cohere, and powers a Groq AI Agent for zero-hallucination conversational Q&A.',
            subAr: 'يراقب مجلدات Google Drive بشكل دوري، ويحمّل الملفات الجديدة، ويجزئها ويخزنها كمتجهات في Pinecone عبر Cohere، ويستخدم نموذج Groq مع وكيل ذكي للرد الفوري بدقة فائقة.',
            imgSrc: 'assets/n8n-rag-drive-agent.jpg',
            nodes: [
                { icon: 'fa-clock', class: 'icon-purple', titleEn: '1. Ingestion: Google Drive Scheduled Monitor', titleAr: '1. فحص ومراقبة مجلدات Google Drive دورياً', descEn: 'Schedule trigger checks Google Drive folders hourly for new files, merges updates, and logs records to Google Sheets.', descAr: 'مشغل دوري يفحص مجلدات Google Drive تلقائياً كل ساعة للكشف عن أي ملفات جديدة وتنزيلها وتسجيلها في Google Sheets.' },
                { icon: 'fa-scissors', class: 'icon-cyan', titleEn: '2. Chunking: Recursive Character Text Splitter', titleAr: '2. تجزئة النصوص الذكية (Text Splitter)', descEn: 'Loops through items, loads data, and splits documents into optimal semantic chunks preserving context boundaries.', descAr: 'يمر على كل ملف ويستخدم Data Loader ومجزئ نصوص تكراري لتقسيم المستندات لقطع نصية متوازنة تحافظ على المعنى.' },
                { icon: 'fa-database', class: 'icon-emerald', titleEn: '3. Vector Embeddings: Cohere & Pinecone Store', titleAr: '3. توليد المتجهات والتخزين في Pinecone', descEn: 'Transforms text chunks into high-dimensional vector embeddings with Cohere and indexes them in Pinecone Vector Store.', descAr: 'يحول القطع النصية إلى متجهات دلالية رقمية عبر Cohere وفهرستها في قاعدة بيانات المتجهات السحابية Pinecone.' },
                { icon: 'fa-robot', class: 'icon-amber', titleEn: '4. Conversational Chatbot: Groq AI Agent & Memory', titleAr: '4. وكيل الذكاء الاصطناعي والإجابة الدقيقة (Groq + Memory)', descEn: 'Answers questions in real-time using Vector Store Search tool, Groq Chat Model, and Simple Memory to prevent hallucinations.', descAr: 'يجيب على أي سؤال بدقة بالغة بالرجوع المباشر لبيانات الملفات في Pinecone باستخدام Groq ونظام ذاكرة للمحادثة بدون أي هلاوس.' }
            ],
            impactEn: [
                'Automated periodic scanning of Google Drive folders without manual file uploads.',
                'Enterprise-grade semantic retrieval powered by Cohere Embeddings & Pinecone.',
                'Sub-second inference responses via Groq Chat Model grounded exclusively in your documents.',
                'Retains conversation context with Simple Memory while guaranteeing zero hallucination.'
            ],
            impactAr: [
                'مراقبة وتحميل تلقائي دوري كل ساعة لملفات Google Drive دون الحاجة لرفعها يدوياً.',
                'بحث دلالي فائق الذكاء والدقة باستخدام Cohere Embeddings وقاعدة بيانات Pinecone.',
                'إجابات فورية فائقة السرعة عبر Groq LLM مستندة بنسبة 100% إلى ملفاتك ومستنداتك الخاصة.',
                'حفظ سياق الحديث مع منع كلي للهلاوس والردود غير الدقيقة.'
            ]
        }
    };

    function openModal(modalKey) {
        const data = modalData[modalKey];
        if (!data) return;

        const isAr = currentLang === 'ar';
        const title = isAr ? data.titleAr : data.titleEn;
        const sub = isAr ? data.subAr : data.subEn;
        const impactList = isAr ? data.impactAr : data.impactEn;

        let imgHtml = '';
        if (data.imgSrc) {
            imgHtml = `
                <div class="modal-image-container">
                    <img src="${data.imgSrc}" alt="${title}">
                </div>
            `;
        }

        let nodesHtml = data.nodes.map(n => `
            <div class="node-item">
                <div class="node-item-icon ${n.class}"><i class="fa-solid ${n.icon}"></i></div>
                <div class="node-item-text">
                    <h5>${isAr ? n.titleAr : n.titleEn}</h5>
                    <p>${isAr ? n.descAr : n.descEn}</p>
                </div>
            </div>
        `).join('');

        let impactHtml = impactList.map(item => `
            <li><i class="fa-solid fa-circle-check"></i> ${item}</li>
        `).join('');

        modalBody.innerHTML = `
            <div class="modal-header-section">
                <div class="modal-project-badge">${data.badge}</div>
                <h2 class="modal-project-title">${title}</h2>
                <p class="modal-project-subtitle">${sub}</p>
            </div>
            ${imgHtml}
            <div class="modal-grid-info">
                <div>
                    <h4 class="modal-section-title"><i class="fa-solid fa-diagram-project"></i> ${isAr ? 'خطوات ومعمارية المسار (n8n Nodes)' : 'Workflow Nodes & Pipeline Breakdown'}</h4>
                    <div class="node-list">
                        ${nodesHtml}
                    </div>
                </div>
                <div>
                    <div class="impact-card">
                        <h4><i class="fa-solid fa-rocket"></i> ${isAr ? 'القيمة المضافة للأعمال' : 'Business Value & Impact'}</h4>
                        <ul>
                            ${impactHtml}
                        </ul>
                    </div>
                </div>
            </div>
        `;

        modalOverlay.classList.add('active');
        modalOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        modalOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Event listeners
    document.querySelectorAll('[data-modal]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const key = trigger.getAttribute('data-modal');
            openModal(key);
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
}
