const fs = require('fs');
const path = require('path');

async function seed() {
  console.log('🌱 Starting seed...');
  console.log('⚠️  This script generates a JSON file that you can import into Strapi Admin Panel');
  console.log('📁 File will be saved to: ./strapi/seed-data.json');
  
  const seedData = {
    siteSettings: {
      mainLogoUrl: 'https://via.placeholder.com/200x200/1a1a1a/ffffff?text=BK',
      footerCopyright: '© 2026 Bantu Khaya Group. All rights reserved.',
    },
    servicesPage: {
      heroTitle: 'Our Services',
      heroDescription: 'Bantu Khaya Group delivers comprehensive solutions across consulting and technology ecosystems. Our integrated approach ensures that strategy and implementation work hand-in-hand to drive measurable outcomes for your organization.',
      consultingSectionTitle: 'Consulting Services',
      consultingSectionDescription: 'Strategic guidance to navigate complex challenges and unlock growth opportunities.',
      technologySectionTitle: 'Technology Ecosystem',
      technologySectionDescription: 'Cutting-edge technology solutions to modernize operations and enhance customer experiences.',
      ctaTitle: 'Ready to Transform Your Business?',
      ctaDescription: "Let's discuss how our consulting and technology services can help you achieve your goals.",
      ctaButtonText: 'Get in Touch',
    },
    navigationItems: [
      { title: 'About', url: '/about', sortOrder: 1 },
      { title: 'Services', url: '/services', sortOrder: 2 },
      { title: 'Projects', url: '/projects', sortOrder: 3 },
      { title: 'Blog', url: '/blog', sortOrder: 4 },
      { title: 'Contact', url: '/contact', sortOrder: 5 },
    ],
    about: {
      title: 'About Bantu Khaya Group',
      subtitle: 'Building the Future Through Innovation and Partnership',
      body: `<h2>Who We Are</h2><p>Bantu Khaya Group is a dynamic collective of companies dedicated to delivering innovative solutions across technology, consulting, and infrastructure development. Our mission is to empower organizations to achieve their goals through strategic partnerships and cutting-edge implementation.</p><h2>Our Vision</h2><p>To be the leading catalyst for digital transformation and sustainable development across Africa and beyond, creating lasting value for our clients and communities.</p><h2>Our Values</h2><ul><li><strong>Integrity:</strong> We operate with transparency and honesty in all our dealings.</li><li><strong>Innovation:</strong> We embrace new technologies and creative solutions.</li><li><strong>Excellence:</strong> We deliver quality results that exceed expectations.</li><li><strong>Collaboration:</strong> We believe in the power of partnership.</li></ul><h2>Our Approach</h2><p>Through our network of specialized companies, we provide end-to-end solutions that address complex challenges. From initial strategy to implementation and ongoing support, we ensure our clients achieve measurable outcomes.</p>`,
    },
    services: [
      { title: 'Strategic Consulting', description: 'Expert guidance to navigate complex business challenges and unlock growth opportunities.', sortOrder: 1 },
      { title: 'Digital Transformation', description: 'Comprehensive digital strategies to modernize operations and enhance customer experiences.', sortOrder: 2 },
      { title: 'Cloud Infrastructure', description: 'Scalable cloud solutions that drive efficiency and reduce operational costs.', sortOrder: 3 },
      { title: 'Data Analytics', description: 'Turn data into actionable insights with advanced analytics and reporting tools.', sortOrder: 4 },
      { title: 'Cybersecurity', description: 'Protect your digital assets with enterprise-grade security solutions.', sortOrder: 5 },
      { title: 'Technology Integration', description: 'Seamlessly integrate disparate systems for unified operations.', sortOrder: 6 },
      { title: 'Process Optimization', description: 'Streamline workflows and eliminate inefficiencies across your organization.', sortOrder: 7 },
      { title: 'Change Management', description: 'Ensure smooth adoption of new technologies and processes with structured change programs.', sortOrder: 8 },
    ],
    companies: [
      { name: 'Bantu Khaya Tech', description: 'Leading technology solutions provider specializing in software development and system integration.', website: 'https://tech.bantukhaya.com', backgroundColor: '#2563eb', color: '#ffffff' },
      { name: 'Bantu Khaya Consulting', description: 'Strategic advisory services for business transformation and growth.', website: 'https://consulting.bantukhaya.com', backgroundColor: '#059669', color: '#ffffff' },
      { name: 'Bantu Khaya Infrastructure', description: 'Infrastructure development and project management for large-scale initiatives.', website: 'https://infra.bantukhaya.com', backgroundColor: '#7c3aed', color: '#ffffff' },
      { name: 'Bantu Khaya Data', description: 'Data analytics and business intelligence solutions.', website: 'https://data.bantukhaya.com', backgroundColor: '#dc2626', color: '#ffffff' },
      { name: 'Bantu Khaya Security', description: 'Cybersecurity and digital risk management services.', website: 'https://security.bantukhaya.com', backgroundColor: '#ea580c', color: '#ffffff' },
      { name: 'Bantu Khaya Cloud', description: 'Cloud migration and managed cloud services.', website: 'https://cloud.bantukhaya.com', backgroundColor: '#0891b2', color: '#ffffff' },
      { name: 'Bantu Khaya Innovation', description: 'R&D and emerging technology exploration.', website: 'https://innovation.bantukhaya.com', backgroundColor: '#db2777', color: '#ffffff' },
      { name: 'Bantu Khaya Ventures', description: 'Investment and incubation for promising startups.', website: 'https://ventures.bantukhaya.com', backgroundColor: '#ca8a04', color: '#ffffff' },
    ],
    projects: [
      {
        title: 'Digital Banking Transformation',
        slug: 'digital-banking-transformation',
        excerpt: 'Complete digital overhaul of a regional bank, resulting in 40% increase in customer engagement.',
        description: `<p>We partnered with a leading regional bank to transform their legacy systems into a modern, digital-first banking platform. The project involved migrating core banking systems, implementing mobile banking applications, and establishing a robust cybersecurity framework.</p><h3>Key Deliverables</h3><ul><li>New mobile banking application with biometric authentication</li><li>Cloud-based core banking system migration</li><li>Automated fraud detection system</li><li>Customer data platform for personalized experiences</li></ul>`,
        client: 'Regional Bank Ltd',
        industry: 'Banking & Finance',
        year: 2025,
        services: ['Digital Transformation', 'Cloud Infrastructure', 'Cybersecurity'],
        outcome: `<p>The transformation resulted in a 40% increase in mobile banking adoption, 60% reduction in fraud incidents, and significantly improved customer satisfaction scores. The bank now processes 3x more transactions digitally compared to the previous year.</p>`,
        challenges: `<p>The main challenges included migrating 20+ years of historical data, ensuring regulatory compliance, and training staff on new systems. We addressed these through phased migration, continuous compliance audits, and comprehensive change management programs.</p>`,
        sortOrder: 1,
        publishedAt: new Date('2025-03-15').toISOString(),
      },
      {
        title: 'Smart City Infrastructure',
        slug: 'smart-city-infrastructure',
        excerpt: 'Deployed IoT sensors and data analytics platform for municipal services optimization.',
        description: `<p>We implemented a comprehensive smart city solution for a metropolitan municipality, integrating IoT sensors across waste management, traffic control, and public utilities. The system provides real-time monitoring and predictive analytics for improved service delivery.</p><h3>Key Deliverables</h3><ul><li>500+ IoT sensors deployed across the city</li><li>Centralized data analytics dashboard</li><li>Automated waste collection routing system</li><li>Smart traffic light optimization</li></ul>`,
        client: 'Metropolitan Municipality',
        industry: 'Government & Public Sector',
        year: 2024,
        services: ['Technology Integration', 'Data Analytics', 'Cloud Infrastructure'],
        outcome: `<p>The smart city initiative reduced waste collection costs by 35%, improved traffic flow by 25%, and enabled predictive maintenance of public infrastructure. Citizens now report 60% higher satisfaction with municipal services.</p>`,
        challenges: `<p>Challenges included ensuring sensor durability in harsh environments, integrating with legacy municipal systems, and addressing privacy concerns. We implemented ruggedized hardware, custom integration adapters, and strict data governance protocols.</p>`,
        sortOrder: 2,
        publishedAt: new Date('2024-11-20').toISOString(),
      },
      {
        title: 'Healthcare System Integration',
        slug: 'healthcare-system-integration',
        excerpt: 'Unified patient records and telemedicine platform for a hospital network.',
        description: `<p>We developed an integrated healthcare platform for a network of 12 hospitals, enabling seamless patient record sharing and telemedicine capabilities. The system improved care coordination and expanded access to medical services.</p><h3>Key Deliverables</h3><ul><li>Unified electronic health records (EHR) system</li><li>Telemedicine platform with video consultations</li><li>Pharmacy management integration</li><li>Patient portal for appointment scheduling</li></ul>`,
        client: 'Healthcare Network Group',
        industry: 'Healthcare',
        year: 2025,
        services: ['Technology Integration', 'Data Analytics', 'Cybersecurity'],
        outcome: `<p>The integration reduced duplicate testing by 45%, decreased patient wait times by 30%, and enabled remote consultations for 15,000+ patients. The platform now handles 50,000+ patient interactions monthly.</p>`,
        challenges: `<p>Key challenges included ensuring HIPAA compliance, integrating disparate legacy systems from different hospitals, and training medical staff. We implemented end-to-end encryption, custom integration middleware, and extensive training programs.</p>`,
        sortOrder: 3,
        publishedAt: new Date('2025-01-10').toISOString(),
      },
      {
        title: 'Retail E-Commerce Platform',
        slug: 'retail-ecommerce-platform',
        excerpt: 'Built scalable e-commerce platform with AI-powered recommendations for a retail chain.',
        description: `<p>We developed a modern e-commerce platform for a national retail chain, featuring AI-powered product recommendations, seamless omnichannel integration, and advanced inventory management.</p><h3>Key Deliverables</h3><ul><li>Responsive e-commerce website and mobile app</li><li>AI recommendation engine</li><li>Real-time inventory synchronization</li><li>Integrated payment and logistics systems</li></ul>`,
        client: 'National Retail Chain',
        industry: 'Retail',
        year: 2024,
        services: ['Digital Transformation', 'Data Analytics', 'Cloud Infrastructure'],
        outcome: `<p>The platform drove a 120% increase in online sales, improved average order value by 35%, and reduced cart abandonment by 40%. The AI recommendations now account for 25% of all purchases.</p>`,
        challenges: `<p>Challenges included handling peak traffic during sales events, integrating with existing POS systems, and maintaining consistent inventory across channels. We implemented auto-scaling infrastructure, real-time sync APIs, and distributed inventory management.</p>`,
        sortOrder: 4,
        publishedAt: new Date('2024-08-05').toISOString(),
      },
    ],
    blogPosts: [
      {
        title: 'The Future of Digital Transformation in Africa',
        slug: 'future-digital-transformation-africa',
        excerpt: 'Exploring emerging trends and opportunities for digital transformation across the African continent.',
        body: `<p>Digital transformation is reshaping industries across Africa, creating unprecedented opportunities for growth and innovation. From fintech to agritech, African businesses are leveraging technology to solve local challenges and compete globally.</p><h3>Key Trends</h3><ul><li><strong>Mobile-First Solutions:</strong> With high mobile penetration, businesses are building mobile-first experiences.</li><li><strong>Cloud Adoption:</strong> Cloud infrastructure is enabling rapid scaling and reducing capital expenditure.</li><li><strong>AI and Automation:</strong> Businesses are adopting AI to improve efficiency and customer experiences.</li><li><strong>Cybersecurity Focus:</strong> As digital adoption grows, so does the need for robust security measures.</li></ul><h3>Opportunities</h3><p>The digital transformation wave presents opportunities for businesses to:</p><ul><li>Reach new markets through digital channels</li><li>Improve operational efficiency</li><li>Create new revenue streams</li><li>Enhance customer experiences</li></ul><h3>Getting Started</h3><p>Successful digital transformation requires a strategic approach. Start with clear objectives, invest in the right technology, and ensure your team is equipped for the change.</p>`,
        publishedAt: new Date('2025-05-01').toISOString(),
      },
      {
        title: 'Building Resilient Cloud Infrastructure',
        slug: 'building-resilient-cloud-infrastructure',
        excerpt: 'Best practices for designing cloud infrastructure that can withstand failures and scale seamlessly.',
        body: `<p>Cloud infrastructure resilience is critical for modern businesses. Downtime can result in significant revenue loss and damage to brand reputation. Here's how to build infrastructure that stands up to failures.</p><h3>Design Principles</h3><ul><li><strong>Redundancy:</strong> Eliminate single points of failure across all layers.</li><li><strong>Scalability:</strong> Design for horizontal scaling to handle traffic spikes.</li><li><strong>Automation:</strong> Automate deployment, scaling, and recovery processes.</li><li><strong>Monitoring:</strong> Implement comprehensive monitoring and alerting.</li></ul><h3>Implementation Strategies</h3><p>Start by mapping your architecture and identifying potential failure points. Implement multi-region deployments, use managed services with built-in redundancy, and establish clear recovery procedures.</p><h3>Testing Resilience</h3><p>Regular chaos engineering exercises help validate your resilience design. Simulate failures in a controlled environment to ensure your systems recover gracefully.</p>`,
        publishedAt: new Date('2025-04-15').toISOString(),
      },
      {
        title: 'Data-Driven Decision Making',
        slug: 'data-driven-decision-making',
        excerpt: 'How organizations can leverage data analytics to make smarter, faster decisions.',
        body: `<p>In today's fast-paced business environment, data-driven decision making is no longer optional—it's essential. Organizations that leverage data effectively gain a significant competitive advantage.</p><h3>The Data Maturity Journey</h3><p>Most organizations progress through stages of data maturity:</p><ul><li><strong>Descriptive:</strong> Understanding what happened</li><li><strong>Diagnostic:</strong> Understanding why it happened</li><li><strong>Predictive:</strong> Predicting what will happen</li><li><strong>Prescriptive:</strong> Determining what should be done</li></ul><h3>Building a Data Culture</h3><p>Technology alone isn't enough. Building a data culture requires:</p><ul><li>Executive sponsorship and clear objectives</li><li>Cross-functional collaboration</li><li>Investment in data literacy</li><li>The right tools and infrastructure</li></ul><h3>Common Pitfalls</h3><p>Avoid these common mistakes: collecting data without clear purpose, ignoring data quality, and failing to act on insights. Start with clear business questions and build from there.</p>`,
        publishedAt: new Date('2025-03-20').toISOString(),
      },
      {
        title: 'Cybersecurity in the Remote Work Era',
        slug: 'cybersecurity-remote-work-era',
        excerpt: 'Securing your organization in a world where work happens everywhere.',
        body: `<p>The shift to remote work has expanded the attack surface for organizations. Securing distributed teams requires a new approach to cybersecurity.</p><h3>New Challenges</h3><ul><li>Unsecured home networks and personal devices</li><li>Increased phishing and social engineering attacks</li><li>Difficulty monitoring and enforcing security policies</li><li>Greater reliance on cloud services and SaaS applications</li></ul><h3>Zero Trust Architecture</h3><p>Adopt a zero trust model where no user or device is trusted by default. Implement:</p><ul><li>Multi-factor authentication everywhere</li><li>Least privilege access controls</li><li>Continuous monitoring and verification</li><li>Micro-segmentation of networks</li></ul><h3>Employee Education</h3><p>Your employees are your first line of defense. Invest in regular security awareness training, simulate phishing attacks, and create clear security policies that are easy to follow.</p>`,
        publishedAt: new Date('2025-02-10').toISOString(),
      },
    ],
    contact: {
      title: 'Contact Us',
      subtitle: 'Let\'s Build Something Great Together',
      body: `<p>Ready to transform your business? We'd love to hear from you. Reach out to discuss how Bantu Khaya Group can help you achieve your goals.</p><h3>Get in Touch</h3><p>Whether you're looking for strategic consulting, technology solutions, or partnership opportunities, our team is here to help.</p>`,
      email: 'info@bantukhaya.com',
      phone: '+27 11 123 4567',
      address: '123 Innovation Drive, Johannesburg, South Africa',
    },
  };
  
  const outputPath = path.join(__dirname, '../seed-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(seedData, null, 2));
  console.log('✅ Seed data JSON file created successfully!');
  console.log('📂 Import this file manually via Strapi Admin Panel at http://localhost:1337');
  console.log('📋 Or use the Strapi import functionality to load the data');
}

seed();
