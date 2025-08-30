import React, { useState, useEffect, useRef } from 'react';

// --- SVG ICONS (No changes needed here) ---
const MailIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`feather feather-mail ${className || ''}`}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
);
const LinkedinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);
const GithubIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-github"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
);
const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);
const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const ArrowUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
);


// --- MAIN APP COMPONENT ---
export default function App() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [showBackToTop, setShowBackToTop] = useState(false);
    const blobRef = useRef(null);
    const [visibleSections, setVisibleSections] = useState(new Set());

    const navLinks = [
        { href: '#home', label: 'Home' },
        { href: '#about', label: 'About' },
        { href: '#skills', label: 'Skills' },
        { href: '#projects', label: 'Projects' },
        { href: '#contact', label: 'Contact' },
    ];

    useEffect(() => {
        const handleMouseMove = (event) => {
            const { clientX, clientY } = event;
            if (blobRef.current) {
                blobRef.current.animate({
                    left: `${clientX}px`,
                    top: `${clientY}px`
                }, { duration: 800, fill: "forwards" });

                const isInteractive = event.target.closest('a, button');
                blobRef.current.classList.toggle('blob-grow', isInteractive);
            }
        };
        window.addEventListener('pointermove', handleMouseMove);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisibleSections((prev) => new Set(prev).add(entry.target.id));
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        const sections = document.querySelectorAll('.animate-section');
        sections.forEach((section) => observer.observe(section));
        
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 300);
            
            let current = 'home';
            for (const link of navLinks) {
                const section = document.getElementById(link.href.substring(1));
                if (section && window.scrollY >= section.offsetTop - 150) {
                    current = link.href.substring(1);
                }
            }

            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
                current = 'contact';
            }
            setActiveSection(current);
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('pointermove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
            sections.forEach((section) => observer.unobserve(section));
        };
    }, []);

    const handleScrollTo = (target) => {
        const element = document.querySelector(target);
        if (element) {
            setActiveSection(target.substring(1));
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMenuOpen(false);
    };

    const SkillCard = ({ icon, title, level, delay }) => (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 animate-child card-hover" style={{transitionDelay: `${delay * 50}ms`}}>
            <div className="card-icon text-4xl text-blue-600 mb-3 flex justify-center">{icon}</div>
            <h3 className="text-lg font-semibold text-gray-800 text-center">{title}</h3>
            {level && <p className="text-gray-500 text-center">{level}</p>}
        </div>
    );
    
    const skillsData = {
        technical: [
            { icon: "💻", title: "React", level: "Frontend Framework" },
            { icon: "☕", title: "Java", level: "Backend & General Purpose" },
            { icon: "🌐", title: "HTML & CSS", level: "Web Fundamentals" },
            { icon: "📜", title: "JavaScript", level: "Programming Language" },
            { icon: "💾", title: "SQL & Databases", level: "Data Management" },
            { icon: "⚙️", title: "Git & GitHub", level: "Version Control" }
        ],
        interests: [
            { icon: '🤖', title: 'Artificial Intelligence & Machine Learning' },
            { icon: '💻', title: 'Full-Stack Web Development' },
            { icon: '☁️', title: 'Cloud Computing (AWS/Azure)' },
            { icon: '🛡️', title: 'Cybersecurity' },
            { icon: '📊', title: 'Data Science & Analytics' },
            { icon: '📱', title: 'Mobile App Development' },
        ]
    };
    
    const projectFeatures = [ "Gamified Self-Improvement", "Earn credits for tasks", "Journaling & Gratitude Logs", "Quotes & Affirmations", "Collectable Anime Characters", "In-App Store & Rewards", "Visual Progress Tracking" ];

    return (
        <>
            <style>{`
              @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
              
              html { scroll-behavior: smooth; }
              body { background-color: #f9fafb; }
              
              .animate-child { opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease-out, transform 0.5s ease-out; }
              .animate-section.is-visible .animate-child { opacity: 1; transform: translateY(0); }

              .aurora-blob { 
                background: radial-gradient(circle at center, rgba(79, 70, 229, 0.15), transparent 60%); 
                width: 500px; height: 500px; 
                position: fixed; pointer-events: none; z-index: 0; 
                border-radius: 50%; 
                transform: translate(-50%, -50%); 
                filter: blur(100px);
                transition: transform 0.2s ease-out, background-color 0.2s ease-out;
              }
              .aurora-blob.blob-grow {
                 transform: translate(-50%, -50%) scale(1.4);
                 background: radial-gradient(circle at center, rgba(79, 70, 229, 0.25), transparent 70%);
              }

              .nav-link { position: relative; }
              .nav-link::after { content: ''; position: absolute; bottom: -6px; left: 0; width: 100%; height: 2px; background-color: #3b82f6; border-radius: 2px; transform: scaleX(0); transform-origin: bottom right; transition: transform 0.3s ease-out; }
              .nav-link:hover::after, .nav-link-active::after { transform: scaleX(1); transform-origin: bottom left; }
              .nav-link-active { color: #3b82f6 !important; }

              .card-hover {
                cursor: default;
                transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                            box-shadow 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                            background-color 0.35s ease;
              }
              .card-hover:hover {
                transform: translateY(-12px);
                background-color: #fcfdff;
                box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.2);
              }
              .card-hover .card-icon {
                transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
              }
              .card-hover:hover .card-icon {
                transform: scale(1.15);
              }

              .interactive-hover { 
                transition: transform 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease; 
              }
              .interactive-hover:hover { 
                transform: scale(1.05) translateY(-2px); 
                box-shadow: 0 12px 24px -6px rgba(59, 130, 246, 0.35);
                background-color: #2563eb;
              }
              .social-icon-hover { transition: transform 0.2s ease-in-out; }
              .social-icon-hover:hover { transform: scale(1.2) rotate(5deg); }
            `}</style>
            <div ref={blobRef} className="aurora-blob"></div>
            <div className="bg-gray-50 min-h-screen text-gray-800 font-['Poppins',_sans-serif] antialiased relative z-10">
                <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-gray-100">
                    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                        <a href="#home" onClick={(e) => { e.preventDefault(); handleScrollTo('#home'); }} className="text-2xl font-bold text-blue-600">Syed Nazeer S.</a>
                        <nav className="hidden md:flex items-center space-x-8">
                            {navLinks.map(link => ( <a key={link.href} href={link.href} onClick={(e) => { e.preventDefault(); handleScrollTo(link.href); }} className={`nav-link text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium ${activeSection === link.href.substring(1) ? 'nav-link-active' : ''}`}>{link.label}</a> ))}
                        </nav>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden z-50"> {isMenuOpen ? <XIcon /> : <MenuIcon />} </button>
                    </div>
                    {isMenuOpen && ( <div className="md:hidden fixed top-0 left-0 w-full h-screen bg-white flex flex-col items-center justify-center z-40"> <nav className="flex flex-col items-center space-y-8"> {navLinks.map(link => ( <a key={link.href} href={link.href} onClick={(e) => { e.preventDefault(); handleScrollTo(link.href); setIsMenuOpen(false); }} className="text-2xl text-gray-700 hover:text-blue-600">{link.label}</a> ))} </nav> </div> )}
                </header>

                <main>
                    <section id="home" className={`relative pt-24 pb-32 bg-white overflow-hidden animate-section ${visibleSections.has('home') ? 'is-visible' : ''}`}>
                        <div className="container mx-auto px-6 text-center relative z-10">
                            <div className="w-36 h-48 rounded-3xl mx-auto mb-6 shadow-lg animate-child overflow-hidden" style={{transitionDelay: '0ms'}}>
                                <img src="/image.jpeg" alt="Syed Nazeer S. Profile Picture" className="w-full h-full object-cover" />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight animate-child" style={{transitionDelay: '100ms'}}> Syed Nazeer S. </h1>
                            <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto animate-child" style={{transitionDelay: '200ms'}}> A passionate Computer Science student and developer, crafting innovative solutions for complex problems. </p>
                            <div className="mt-8 flex justify-center items-center space-x-5 animate-child" style={{transitionDelay: '300ms'}}>
                                <a href="https://www.linkedin.com/in/syed-nazeer-78ba93380/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-700 social-icon-hover" aria-label="View my LinkedIn profile"><LinkedinIcon /></a>
                                <a href="https://github.com/SyedNazeer07" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 social-icon-hover" aria-label="View my GitHub profile"><GithubIcon /></a>
                                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=nazeer0906s@gmail.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-red-500 social-icon-hover" aria-label="Send me an email"><MailIcon /></a>
                            </div>
                            <div className="mt-10 animate-child" style={{transitionDelay: '400ms'}}>
                                <a href="#projects" onClick={(e) => { e.preventDefault(); handleScrollTo('#projects'); }} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 interactive-hover"> View My Work </a>
                            </div>
                        </div>
                    </section>

                    <section id="about" className={`py-20 overflow-hidden animate-section ${visibleSections.has('about') ? 'is-visible' : ''}`}>
                        <div className="container mx-auto px-6">
                            <h2 className="text-3xl font-bold text-center mb-12 animate-child" style={{transitionDelay: '0ms'}}>About Me</h2>
                            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                                <div className="text-lg text-gray-600 space-y-4 animate-child" style={{transitionDelay: '100ms'}}>
                                    <p>I am currently pursuing a B.Tech in Computer Science and Engineering, driven by a deep curiosity for technology and its potential to shape the future. My goal is to leverage my skills to build impactful and user-centric applications.</p>
                                    <p>My academic journey is marked by a strong foundation, highlighted by achieving a <span className="font-bold text-blue-600">100% score in my 12th board exams</span>. I am constantly seeking to expand my knowledge and am currently enrolled in Harvard's renowned <span className="font-semibold text-gray-800">CS50x course</span> to sharpen my problem-solving abilities.</p>
                                </div>
                                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 animate-child card-hover" style={{transitionDelay: '200ms'}}>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Interests & Aspirations</h3>
                                    <p className="text-gray-600">I am fascinated by the high-demand fields that are revolutionizing the tech industry:</p>
                                    <ul className="mt-4 space-y-2">
                                        {skillsData.interests.slice(0, 4).map(skill => ( <li key={skill.title} className="flex items-center"><span className="text-xl mr-3">{skill.icon}</span><span className="text-gray-700">{skill.title}</span></li> ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="skills" className={`py-20 bg-white overflow-hidden animate-section ${visibleSections.has('skills') ? 'is-visible' : ''}`}>
                        <div className="container mx-auto px-6">
                            <h2 className="text-3xl font-bold text-center mb-12 animate-child" style={{transitionDelay: '0ms'}}>Technical Skills & Interests</h2>
                             <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                                {skillsData.technical.map((skill, index) => ( <SkillCard key={skill.title} icon={skill.icon} title={skill.title} level={skill.level} delay={index + 1} /> ))}
                            </div>
                            <p className="text-center mt-12 text-gray-500 animate-child" style={{transitionDelay: `${skillsData.technical.length * 50}ms`}}>I am also keenly interested in the following high-demand fields:</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-8">
                                 {skillsData.interests.map((skill, index) => ( <SkillCard key={skill.title} icon={skill.icon} title={skill.title} delay={skillsData.technical.length + index + 2} /> ))}
                            </div>
                        </div>
                    </section>
                    
                    <section id="projects" className={`py-20 overflow-hidden animate-section ${visibleSections.has('projects') ? 'is-visible' : ''}`}>
                        <div className="container mx-auto px-6">
                             <h2 className="text-3xl font-bold text-center mb-12 animate-child" style={{transitionDelay: '0ms'}}>Featured Project</h2>
                            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-child card-hover" style={{transitionDelay: '100ms'}}>
                                <div className="md:flex">
                                    <div className="md:w-1/3 bg-gradient-to-br from-blue-500 to-indigo-600 p-8 flex flex-col justify-center items-center text-white text-center">
                                        <h3 className="text-3xl font-bold">Why Not App</h3>
                                        <p className="mt-2 text-blue-100">Gamifying Self-Improvement</p>
                                        <div className="mt-6 text-sm font-semibold bg-blue-100 text-blue-800 py-1 px-3 rounded-full">React & Java</div>
                                    </div>
                                    <div className="p-8 md:w-2/3">
                                        <p className="text-gray-600 mb-6">An innovative application designed to make personal development engaging and rewarding. It transforms daily tasks into a game where users can level up their lives.</p>
                                        <h4 className="font-semibold text-gray-800 mb-3">Key Features:</h4>
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                            {projectFeatures.map(feature => ( <li key={feature} className="flex items-start"> <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <span className="text-gray-700">{feature}</span> </li> ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="contact" className={`py-20 bg-white overflow-hidden animate-section ${visibleSections.has('contact') ? 'is-visible' : ''}`}>
                        <div className="container mx-auto px-6 text-center">
                            <h2 className="text-3xl font-bold mb-4 animate-child" style={{transitionDelay: '0ms'}}>Get In Touch</h2>
                            <p className="text-gray-600 max-w-lg mx-auto mb-8 animate-child" style={{transitionDelay: '100ms'}}>I'm actively looking for internship opportunities and am always open to discussing new projects, creative ideas, or ways to contribute to an amazing team. Feel free to reach out!</p>
                            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=nazeer0906s@gmail.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 interactive-hover animate-child" style={{transitionDelay: '200ms'}}> <MailIcon className="mr-3" /> Say Hello </a>
                            <div className="mt-10 flex justify-center items-center space-x-6 animate-child" style={{transitionDelay: '300ms'}}>
                                <a href="https://www.linkedin.com/in/syed-nazeer-78ba93380/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-700 social-icon-hover" aria-label="View my LinkedIn profile"><LinkedinIcon /></a>
                                <a href="https://github.com/SyedNazeer07" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 social-icon-hover" aria-label="View my GitHub profile"><GithubIcon /></a>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="bg-gray-100 border-t border-gray-200">
                    <div className="container mx-auto px-6 py-6 text-center text-gray-500">
                        <p>&copy; {new Date().getFullYear()} Syed Nazeer S. All Rights Reserved.</p>
                    </div>
                </footer>
                
                <button onClick={() => handleScrollTo('#home')} className={`fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-50 ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`} aria-label="Back to top"> <ArrowUpIcon /> </button>
            </div>
        </>
    );
}

