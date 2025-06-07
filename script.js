// ===== 主题管理 =====
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.querySelector('.theme-icon');
        this.init();
    }

    init() {
        // 检查本地存储或系统偏好
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        
        this.setTheme(theme);
        this.bindEvents();
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateIcon(theme);
        
        // 清除导航栏内联样式，确保主题颜色正确应用
        const nav = document.querySelector('.nav');
        if (nav) {
            nav.style.background = '';
        }
    }

    updateIcon(theme) {
        this.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    bindEvents() {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // 监听系统主题变化
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

// ===== 平滑滚动导航 =====
class SmoothNavigation {
    constructor() {
        this.nav = document.querySelector('.nav');
        this.navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        this.init();
    }

    init() {
        this.bindScrollEvents();
        this.bindNavigationEvents();
    }

    bindScrollEvents() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateNavOnScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    updateNavOnScroll() {
        const scrollY = window.scrollY;
        const threshold = 50;
        
        // 基于滚动距离切换导航栏状态
        if (scrollY > threshold) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
        }
        
        // 移除内联样式，完全依赖CSS类来处理主题颜色
        this.nav.style.background = '';
        
        // 更新当前激活的导航项
        this.updateActiveNavItem();
    }

    updateActiveNavItem() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }

    bindNavigationEvents() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 72; // 减去导航高度
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ===== 滚动动画 =====
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        this.createObserver();
    }

    createObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // 为项目卡片添加延迟动画
                    if (entry.target.classList.contains('project-card')) {
                        const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 200;
                        entry.target.style.animationDelay = `${delay}ms`;
                    }
                }
            });
        }, this.observerOptions);

        // 观察需要动画的元素
        const animatedElements = document.querySelectorAll([
            '.project-card',
            '.contact-item',
            '.info-card',
            '.stats-card',
            '.skill-category'
        ].join(','));

        animatedElements.forEach(el => observer.observe(el));
    }
}

// ===== 视觉效果增强 =====
class VisualEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.enhanceGridItems();
        this.addParallaxEffect();
        this.enhanceProjectCards();
    }

    enhanceGridItems() {
        const gridItems = document.querySelectorAll('.grid-item');
        
        gridItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-10px) scale(1.05)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    addParallaxEffect() {
        const hero = document.querySelector('.hero');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (hero) {
                hero.style.transform = `translate3d(0, ${rate}px, 0)`;
            }
        });
    }

    enhanceProjectCards() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const number = card.querySelector('.project-number');
                if (number) {
                    number.style.transform = 'scale(1.1)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const number = card.querySelector('.project-number');
                if (number) {
                    number.style.transform = 'scale(1)';
                }
            });
        });
    }
}

// ===== 性能优化 =====
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.optimizeAnimations();
    }

    lazyLoadImages() {
        // 如果有图片，添加懒加载
        const images = document.querySelectorAll('img[data-src]');
        
        if (images.length > 0) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    optimizeAnimations() {
        // 减少动画对低端设备的影响
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.documentElement.classList.add('reduce-motion');
        }
    }
}

// ===== 响应式菜单 =====
class ResponsiveMenu {
    constructor() {
        this.createMobileMenu();
    }

    createMobileMenu() {
        // 只在小屏幕上显示汉堡菜单
        if (window.innerWidth <= 768) {
            this.addMobileMenuButton();
        }
        
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.removeMobileMenu();
            } else {
                this.addMobileMenuButton();
            }
        });
    }

    addMobileMenuButton() {
        const navContainer = document.querySelector('.nav-container');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!document.querySelector('.mobile-menu-toggle')) {
            const menuToggle = document.createElement('div');
            menuToggle.className = 'mobile-menu-toggle';
            menuToggle.innerHTML = '☰';
            menuToggle.style.cssText = `
                display: block;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 8px;
                transition: background 0.2s ease;
            `;
            
            navContainer.appendChild(menuToggle);
            
            menuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('mobile-active');
            });
        }
    }

    removeMobileMenu() {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuToggle) {
            menuToggle.remove();
        }
        
        if (navMenu) {
            navMenu.classList.remove('mobile-active');
        }
    }
}

// ===== 页面加载管理 =====
class PageLoader {
    constructor() {
        this.init();
    }

    init() {
        // 页面加载动画
        document.body.style.opacity = '0';
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.body.style.transition = 'opacity 0.5s ease';
                document.body.style.opacity = '1';
            }, 100);
        });
        
        // 添加页面可见性变化处理
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // 页面隐藏时暂停动画
                document.documentElement.classList.add('page-hidden');
            } else {
                // 页面可见时恢复动画
                document.documentElement.classList.remove('page-hidden');
            }
        });
    }
}

// ===== 初始化所有功能 =====
document.addEventListener('DOMContentLoaded', () => {
    // 核心功能
    new ThemeManager();
    new SmoothNavigation();
    new ScrollAnimations();
    new PageLoader();
    
    // 增强功能
    new VisualEnhancements();
    new PerformanceOptimizer();
    new ResponsiveMenu();
    
    // 添加动态样式
    const dynamicStyles = document.createElement('style');
    dynamicStyles.textContent = `
        /* 动画增强 */
        .animate-in {
            animation: fadeInUp 0.8s ease forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* 导航激活状态 */
        .nav-menu a.active {
            color: var(--color-accent);
        }
        
        .nav-menu a.active::after {
            width: 100%;
        }
        
        /* 移动端菜单 */
        @media (max-width: 768px) {
            .nav-menu {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--color-surface);
                border-top: 1px solid var(--color-border);
                flex-direction: column;
                padding: 1rem;
                transform: translateY(-100%);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .nav-menu.mobile-active {
                transform: translateY(0);
                opacity: 1;
                visibility: visible;
            }
        }
        
        /* 减少动画选项 */
        .reduce-motion * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
        
        /* 页面隐藏时暂停动画 */
        .page-hidden * {
            animation-play-state: paused !important;
        }
        
        /* 懒加载图片 */
        img.lazy {
            opacity: 0;
            transition: opacity 0.3s;
        }
        
                          /* 滚动状态样式现在在主CSS文件中定义 */
    `;
    
    document.head.appendChild(dynamicStyles);
    
    // 控制台输出
    console.log('🎨 个人网站已加载完成');
    console.log('💻 基于 skywt.cn 风格设计');
    console.log('✨ 简约大方，有艺术设计感');
});