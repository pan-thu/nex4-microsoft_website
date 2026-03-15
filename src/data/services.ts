import type { LucideIcon } from 'lucide-react';
import {
  LayoutGrid, MessageSquare, TrendingUp,
  ShieldCheck, Fingerprint, Lock,
  BrainCircuit, Sparkles, BarChart3,
  Workflow, Zap, Layers,
  HardDrive, RefreshCw, CloudOff,
  Cloud, Upload, Activity,
} from 'lucide-react';
import { ASSETS } from '@/lib/assets';

export interface ServiceBenefit {
  icon: LucideIcon;
  title: string;
  body: string;
}

export interface ServiceCapability {
  title: string;
  body: string;
}

export interface ServiceStat {
  value: string;
  suffix?: string;
  label: string;
}

export interface ServiceRelated {
  title: string;
  slug: string;
  tagline: string;
  image: string;
}

export interface CaseStudy {
  client: string;
  industry: string;
  title: string;
  description: string;
  image: string;
}

export interface ServiceData {
  slug: string;
  category: string;
  title: string;
  tagline: string;
  heroImage: string;
  overviewHeading: string;
  overviewParagraphs: [string, string];
  benefits: [ServiceBenefit, ServiceBenefit, ServiceBenefit];
  capabilitiesHeading: string;
  capabilities: ServiceCapability[];
  technologies: string[];
  stats: [ServiceStat, ServiceStat, ServiceStat];
  ctaHeadline: string;
  ctaBody: string;
  related: [ServiceRelated, ServiceRelated, ServiceRelated];
  caseStudies: [CaseStudy, CaseStudy, CaseStudy];
}

export const SERVICES: Record<string, ServiceData> = {

  'workplace-productivity': {
    slug: 'workplace-productivity',
    category: 'Digital Workplace',
    title: 'Unlock the Full Power of Your Microsoft 365 Investment',
    tagline: 'NEX4 helps organisations eliminate friction, connect teams, and build the productivity stack that modern work demands.',
    heroImage: ASSETS.hero1,
    overviewHeading: 'Work Smarter Across Every Team',
    overviewParagraphs: [
      'Most organisations have licenced Microsoft 365 — but few have truly activated it. Unused capabilities, disconnected tools, and poor adoption leave productivity gains on the table. NEX4 bridges that gap with structured deployment, change management, and a deep understanding of how people actually work.',
      'From Teams and SharePoint to OneDrive, Viva, and beyond, we design integrated workplace environments that reduce tool sprawl, accelerate collaboration, and give leadership the visibility to act.',
    ],
    benefits: [
      { icon: LayoutGrid, title: 'Integrated M365 Ecosystem', body: 'We deploy and connect every M365 workload — Teams, SharePoint, OneDrive, and Viva — so your toolset works as a unified platform, not a collection of siloed apps.' },
      { icon: MessageSquare, title: 'Accelerated Team Collaboration', body: 'Structured communication channels, document workflows, and meeting frameworks reduce email noise and get the right information to the right people, faster.' },
      { icon: TrendingUp, title: 'Measurable Adoption & ROI', body: 'Change management, training programs, and usage analytics ensure your investment is activated and sustained — with clear metrics to prove the value.' },
    ],
    capabilitiesHeading: 'What We Deliver',
    capabilities: [
      { title: 'M365 Tenant Assessment & Roadmap', body: 'Audit your current M365 configuration and licence usage, identify gaps, and build a phased deployment roadmap aligned to business outcomes.' },
      { title: 'Microsoft Teams Deployment & Governance', body: 'Deploy Teams with a governance framework that controls channel sprawl, guest access, and data retention — without restricting collaboration.' },
      { title: 'SharePoint Intranet & Document Management', body: 'Design and build a SharePoint environment that becomes your organisation\'s digital home — searchable, structured, and role-aware.' },
      { title: 'Microsoft Viva Employee Experience', body: 'Implement Viva Insights, Viva Learning, and Viva Connections to improve wellbeing, skill development, and company-wide communication.' },
      { title: 'Adoption & Change Management', body: 'Structured training, champion programs, and communication plans that drive genuine adoption across all levels of the organisation.' },
    ],
    technologies: ['Microsoft 365', 'Microsoft Teams', 'SharePoint Online', 'OneDrive', 'Microsoft Viva', 'Exchange Online', 'Microsoft Planner', 'Power BI'],
    stats: [
      { value: '40', suffix: '%', label: 'average reduction in meeting overload after Teams restructure' },
      { value: '3x', label: 'faster document retrieval with structured SharePoint taxonomy' },
      { value: '90', suffix: '+', label: 'M365 deployments delivered across APAC' },
    ],
    ctaHeadline: 'Ready to Get More from Microsoft 365?',
    ctaBody: 'Talk to a NEX4 specialist about a no-cost M365 assessment for your organisation.',
    related: [
      { title: 'Workplace AI', slug: 'workplace-ai', tagline: 'Add AI to your productivity stack with Microsoft Copilot.', image: ASSETS.cardBg4 },
      { title: 'Workplace Automation', slug: 'workplace-automation', tagline: 'Automate repetitive processes across your M365 environment.', image: ASSETS.cardBg1 },
      { title: 'Workplace Security', slug: 'workplace-security', tagline: 'Secure the productivity environment you have built.', image: ASSETS.cardBg2 },
    ],
    caseStudies: [
      { client: 'Regional Law Firm, Yangon', industry: 'Legal', title: 'Cutting internal email by 35% with Microsoft Teams governance', description: 'A 450-user legal practice replaced siloed email workflows with structured Teams channels and SharePoint document libraries — reducing internal email volume in the first quarter.', image: ASSETS.hero1 },
      { client: 'APAC Retail Group', industry: 'Retail', title: 'SharePoint intranet replaces ageing file server for 1,200 staff', description: 'We designed and deployed a SharePoint Online intranet giving every employee role-appropriate access to documents, news, and tools from any device, anywhere.', image: ASSETS.cardBg2 },
      { client: 'Pacific Financial Services', industry: 'Financial Services', title: 'Viva Insights reveals hidden productivity gaps across senior leadership', description: 'Collaboration pattern analysis using Microsoft Viva Insights helped leadership restructure meeting cadences and protect deep-work time across the organisation.', image: ASSETS.cardBg4 },
    ],
  },

  'workplace-security': {
    slug: 'workplace-security',
    category: 'Digital Workplace',
    title: 'Zero Trust Security for the Modern Hybrid Workforce',
    tagline: 'Protect every identity, device, and access point — regardless of where your people work. NEX4 designs and deploys enterprise-grade security on Microsoft\'s platform.',
    heroImage: ASSETS.hero2,
    overviewHeading: 'Security Built for How Work Has Changed',
    overviewParagraphs: [
      'The perimeter is gone. Your workforce is distributed across devices, networks, and locations that you do not control. Traditional security architectures were not designed for this — and attackers know it. NEX4 deploys Zero Trust frameworks on Microsoft Security that assume breach, verify explicitly, and enforce least-privilege access at every layer.',
      'From Microsoft Defender and Entra ID to Purview and Sentinel, we architect, deploy, and monitor security controls that give your organisation real protection without sacrificing the user experience your people expect.',
    ],
    benefits: [
      { icon: ShieldCheck, title: 'Zero Trust Architecture', body: 'Every access request is verified, every session is monitored, and lateral movement is contained — regardless of whether users are on-premises or remote.' },
      { icon: Fingerprint, title: 'Identity & Access Management', body: 'Microsoft Entra ID, conditional access, and MFA enforcement protect your most critical attack surface: the user identity.' },
      { icon: Lock, title: 'Endpoint & Data Protection', body: 'Microsoft Defender for Endpoint and Purview information protection secure devices and sensitive data across your entire environment.' },
    ],
    capabilitiesHeading: 'What We Deliver',
    capabilities: [
      { title: 'Zero Trust Framework Design', body: 'Assess your current security posture and design a phased Zero Trust architecture aligned to NIST and Microsoft\'s security benchmark.' },
      { title: 'Microsoft Entra ID & Conditional Access', body: 'Deploy identity governance, MFA, and risk-based conditional access policies that stop credential-based attacks before they escalate.' },
      { title: 'Microsoft Defender for Endpoint', body: 'Deploy, configure, and tune Defender across all devices — with 24/7 monitoring and automated response to high-fidelity alerts.' },
      { title: 'Microsoft Purview Data Governance', body: 'Classify, label, and protect sensitive information across M365, Azure, and third-party data sources — with audit trails for compliance.' },
      { title: 'Microsoft Sentinel SIEM/SOAR', body: 'Centralise security operations with cloud-native SIEM, AI-powered threat detection, and playbook-driven automated response.' },
      { title: 'Security Awareness Training', body: 'Reduce human risk with simulated phishing campaigns, security training modules, and a culture-change program built into your operations.' },
    ],
    technologies: ['Microsoft Defender XDR', 'Microsoft Entra ID', 'Microsoft Sentinel', 'Microsoft Purview', 'Intune', 'Azure AD Identity Protection', 'Microsoft Secure Score'],
    stats: [
      { value: '98', suffix: '%', label: 'of breaches involve compromised identities — stopped with Entra ID' },
      { value: '<1', suffix: 'hr', label: 'average threat detection time when running Microsoft Sentinel' },
      { value: '50', suffix: '+', label: 'enterprise security deployments across Southeast Asia and Japan' },
    ],
    ctaHeadline: "Let's Assess Your Security Posture",
    ctaBody: 'Book a complimentary Microsoft Secure Score review with a NEX4 security architect.',
    related: [
      { title: 'Workplace Backup', slug: 'workplace-backup', tagline: 'Recover fast when the worst happens.', image: ASSETS.cardBg1 },
      { title: 'Workplace AI', slug: 'workplace-ai', tagline: 'AI-powered threat intelligence with Microsoft Security Copilot.', image: ASSETS.cardBg4 },
      { title: 'Cloud Migration', slug: 'cloud-migration', tagline: 'Secure your Azure environment from day one.', image: ASSETS.cardBg3 },
    ],
    caseStudies: [
      { client: 'Myanmar Banking Corp', industry: 'Financial Services', title: 'Zero Trust deployment halts credential-based attack before any data loss', description: 'Following a phishing incident, we deployed Entra ID with risk-based conditional access and MFA. A subsequent attack was automatically blocked before reaching any sensitive system.', image: ASSETS.hero2 },
      { client: 'SEA Healthcare Provider', industry: 'Healthcare', title: 'Defender for Endpoint and Purview securing 800 clinical staff across 6 sites', description: 'A regional healthcare provider needed to meet updated data protection requirements. We deployed Defender for Endpoint and Purview data classification across all clinical devices and data sources.', image: ASSETS.cardBg3 },
      { client: 'Cambodia Government Agency', industry: 'Public Sector', title: 'Microsoft Sentinel reduces mean time to detect from 72 hours to under 1 hour', description: 'A government agency was operating without centralised threat visibility. We deployed Sentinel with custom analytics rules and automated playbooks, dramatically cutting detection time.', image: ASSETS.cardBg1 },
    ],
  },

  'workplace-ai': {
    slug: 'workplace-ai',
    category: 'Digital Workplace',
    title: 'Put AI to Work Across Your Organisation',
    tagline: 'From Microsoft 365 Copilot to custom Azure AI solutions, NEX4 guides every stage of your enterprise AI journey — strategy, deployment, and adoption.',
    heroImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&q=80&fit=crop',
    overviewHeading: 'AI That Creates Real Business Value',
    overviewParagraphs: [
      'Deploying AI is no longer a competitive advantage — it is an operational imperative. But most organisations struggle to move from pilot to production. NEX4 closes the gap between AI potential and business reality by combining Microsoft\'s AI platform with structured deployment methodology and deep change management expertise.',
      'Whether you are activating Microsoft 365 Copilot for your workforce, building intelligent agents with Copilot Studio, or leveraging Azure OpenAI for custom use cases, we design solutions that are secure, governed, and adopted by the people who use them.',
    ],
    benefits: [
      { icon: BrainCircuit, title: 'Enterprise AI Readiness', body: 'We assess your data, security, and governance foundation before deployment — ensuring AI operates on clean, compliant, and well-governed information.' },
      { icon: Sparkles, title: 'Microsoft 365 Copilot Activation', body: 'Structured rollout of Copilot across Teams, Word, Excel, Outlook, and PowerPoint — with use-case identification, training, and adoption tracking.' },
      { icon: BarChart3, title: 'Measurable Business Outcomes', body: 'We tie every AI deployment to specific KPIs — time saved, decisions accelerated, and processes improved — so ROI is visible from day one.' },
    ],
    capabilitiesHeading: 'What We Deliver',
    capabilities: [
      { title: 'AI Readiness Assessment', body: 'Evaluate your Microsoft 365 environment, data governance posture, and licence position to determine deployment readiness and risk.' },
      { title: 'Microsoft 365 Copilot Deployment', body: 'End-to-end Copilot rollout including licence provisioning, sensitivity label configuration, use-case prioritisation, and user enablement.' },
      { title: 'Copilot Studio & Custom Agent Development', body: 'Build custom AI agents grounded in your organisation\'s data — automating queries, workflows, and decisions without writing complex code.' },
      { title: 'Azure OpenAI Integration', body: 'Design and deploy custom AI solutions using Azure OpenAI Service, integrated with your existing systems and governed by your security policies.' },
      { title: 'AI Adoption & Change Management', body: 'Champion programs, role-based training, and usage analytics that turn Copilot licences into daily habits — and measurable productivity gains.' },
    ],
    technologies: ['Microsoft 365 Copilot', 'Copilot Studio', 'Azure OpenAI Service', 'Microsoft Fabric', 'Power BI', 'Azure AI Foundry', 'Microsoft Purview'],
    stats: [
      { value: '2.8', suffix: 'hrs', label: 'saved per user per week with M365 Copilot (Microsoft research)' },
      { value: '70', suffix: '%', label: 'of AI pilots fail without structured adoption — we change that' },
      { value: '35', suffix: '+', label: 'AI and Copilot deployments delivered across APAC' },
    ],
    ctaHeadline: 'Start Your AI Journey with a Clear Plan',
    ctaBody: 'Talk to our AI specialists about a structured readiness assessment and deployment roadmap.',
    related: [
      { title: 'Workplace Productivity', slug: 'workplace-productivity', tagline: 'The M365 foundation that Copilot runs on.', image: ASSETS.cardBg1 },
      { title: 'Workplace Automation', slug: 'workplace-automation', tagline: 'Combine AI with Power Platform for intelligent automation.', image: ASSETS.cardBg1 },
      { title: 'Cloud Migration', slug: 'cloud-migration', tagline: 'Move to Azure — where enterprise AI lives.', image: ASSETS.cardBg3 },
    ],
    caseStudies: [
      { client: 'Professional Services Firm, APAC', industry: 'Consulting', title: 'M365 Copilot saves 2.5 hours per user per week across 800-person firm', description: 'A structured Copilot rollout with role-specific use cases and champion training achieved 85% weekly active usage within 60 days of launch — far above industry average.', image: ASSETS.hero1 },
      { client: 'Regional Bank, Thailand', industry: 'Financial Services', title: 'Azure OpenAI automates loan document review, cutting processing time by 60%', description: 'We built a custom document intelligence solution using Azure OpenAI and Azure AI Document Intelligence, integrated with the bank\'s existing loan origination system.', image: ASSETS.cardBg4 },
      { client: 'APAC Manufacturer', industry: 'Manufacturing', title: 'Copilot Studio agent deflects 40% of HR queries without human intervention', description: 'A custom HR agent built in Copilot Studio, grounded on SharePoint policy documents, handles repetitive employee queries and intelligently escalates complex cases to HR staff.', image: ASSETS.cardBg2 },
    ],
  },

  'workplace-automation': {
    slug: 'workplace-automation',
    category: 'Digital Workplace',
    title: 'Automate the Work That Slows Your Business Down',
    tagline: 'Power Platform, Power Automate, and intelligent workflows — designed, built, and maintained by NEX4 so your teams can focus on the work that matters.',
    heroImage: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=1600&q=80&fit=crop',
    overviewHeading: 'From Manual Processes to Intelligent Workflows',
    overviewParagraphs: [
      'Every organisation has processes that are slower, more error-prone, and more expensive than they need to be. Approval chains stuck in email. Reports built manually in spreadsheets. Data transferred between systems by hand. These are not small inefficiencies — they compound daily across every team.',
      'NEX4 maps, prioritises, and automates your highest-value processes using Microsoft Power Platform — including Power Automate, Power Apps, and Power BI — creating intelligent workflows that connect your systems, data, and people without custom development overhead.',
    ],
    benefits: [
      { icon: Workflow, title: 'End-to-End Process Automation', body: 'We map your current processes, identify automation opportunities, and build flows that eliminate manual steps from approval chains, data entry, and reporting.' },
      { icon: Zap, title: 'Instant Event-Driven Triggers', body: 'Automate responses to business events — a form submission, a file upload, an email arrival — so work moves forward the moment it needs to.' },
      { icon: Layers, title: 'Cross-System Connectivity', body: 'Power Platform\'s 1,000+ connectors link M365, Dynamics 365, Azure, and third-party systems — eliminating data silos without custom integration code.' },
    ],
    capabilitiesHeading: 'What We Deliver',
    capabilities: [
      { title: 'Process Discovery & Prioritisation', body: 'Workshop-based process mapping to identify, score, and prioritise automation opportunities based on effort, impact, and technical feasibility.' },
      { title: 'Power Automate Flow Development', body: 'Build cloud flows, desktop flows (RPA), and scheduled automations that integrate across M365, Dynamics, Azure, and third-party APIs.' },
      { title: 'Power Apps Custom Application Development', body: 'Replace spreadsheets and paper-based processes with low-code Power Apps that work on any device and connect to your existing data sources.' },
      { title: 'Power BI Reporting & Dashboards', body: 'Transform raw operational data into real-time dashboards and automated reports that give leadership the visibility to make faster decisions.' },
      { title: 'Governance & Centre of Excellence', body: 'Establish a Power Platform Centre of Excellence with environment strategy, DLP policies, and maker enablement to scale automation responsibly.' },
    ],
    technologies: ['Power Automate', 'Power Apps', 'Power BI', 'Power Pages', 'Dataverse', 'Azure Logic Apps', 'Microsoft 365', 'Dynamics 365'],
    stats: [
      { value: '70', suffix: '%', label: 'reduction in processing time for manual approval workflows' },
      { value: '300', suffix: '+', label: 'automation flows delivered across financial services and public sector' },
      { value: '6', suffix: 'wks', label: 'average time from process discovery to first flow in production' },
    ],
    ctaHeadline: 'Identify Your First Automation Win',
    ctaBody: 'Start with a 2-hour process discovery workshop — we will map your top candidates and estimate the impact.',
    related: [
      { title: 'Workplace AI', slug: 'workplace-ai', tagline: 'Add AI intelligence to your automation workflows.', image: ASSETS.cardBg4 },
      { title: 'Workplace Productivity', slug: 'workplace-productivity', tagline: 'The M365 platform your automations run on.', image: ASSETS.cardBg1 },
      { title: 'Cloud Migration', slug: 'cloud-migration', tagline: 'Move the data your automations depend on to Azure.', image: ASSETS.cardBg3 },
    ],
    caseStudies: [
      { client: 'Regional Bank, Myanmar', industry: 'Financial Services', title: 'Loan approval processing time cut from 5 days to 36 hours with Power Automate', description: 'Manual approval chains spanning five teams and three systems were replaced with a single automated workflow, reducing processing time by 70% without any changes to the core banking system.', image: ASSETS.cardBg3 },
      { client: 'Property Developer, Phnom Penh', industry: 'Real Estate', title: 'Power Apps replaces 12 manual spreadsheet processes across project management teams', description: 'We built a suite of low-code apps for site reporting, contractor management, and budget tracking — giving every project manager real-time visibility from any device.', image: ASSETS.cardBg1 },
      { client: 'Insurance Company, Bangkok', industry: 'Insurance', title: 'Power BI dashboard replaces 40-page weekly report package for executive leadership', description: 'Senior leadership now reviews live operational metrics in a single Power BI dashboard instead of waiting for end-of-week compiled reports, enabling faster and better-informed decisions.', image: ASSETS.cardBg4 },
    ],
  },

  'workplace-backup': {
    slug: 'workplace-backup',
    category: 'Digital Workplace',
    title: 'Protect and Recover Your Microsoft 365 Data',
    tagline: 'Ransomware, accidental deletion, and service outages are not hypothetical risks. NEX4 ensures your Microsoft 365 data is protected, compliant, and recoverable — always.',
    heroImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=80&fit=crop',
    overviewHeading: "Microsoft Doesn't Back Up Your Data — You Do",
    overviewParagraphs: [
      "This surprises many organisations: Microsoft's shared responsibility model makes clear that M365 data protection is the customer's responsibility. Microsoft guarantees service availability — not point-in-time recovery of your emails, Teams messages, SharePoint documents, or OneDrive files. A single accidental deletion, malicious insider, or ransomware event can mean permanent data loss.",
      'NEX4 deploys purpose-built backup solutions for Microsoft 365 — including Microsoft 365 Backup, Veeam for Microsoft 365, and Azure-based long-term retention — giving your organisation the ability to restore any data, at any point in time, with confidence.',
    ],
    benefits: [
      { icon: HardDrive, title: 'Complete M365 Data Coverage', body: 'Protect Exchange Online, SharePoint, OneDrive, and Teams data — including chat history, channels, and files — with automated, policy-driven backup schedules.' },
      { icon: RefreshCw, title: 'Rapid, Granular Recovery', body: 'Restore a single email, a specific file version, or an entire SharePoint site — in minutes, not days — without requiring IT to rebuild from scratch.' },
      { icon: CloudOff, title: 'Ransomware & Compliance Protection', body: 'Immutable backup storage, air-gapped retention policies, and compliance archiving ensure your data survives both attacks and regulatory audits.' },
    ],
    capabilitiesHeading: 'What We Deliver',
    capabilities: [
      { title: 'M365 Backup Assessment & Strategy', body: 'Audit your current data protection posture, identify gaps in native M365 retention, and design a backup strategy aligned to your RTO/RPO requirements.' },
      { title: 'Microsoft 365 Backup Deployment', body: "Configure Microsoft's native M365 Backup product with appropriate retention policies, admin roles, and scope across Exchange, SharePoint, and OneDrive." },
      { title: 'Veeam for Microsoft 365 Implementation', body: 'For organisations requiring longer retention, granular recovery, or hybrid backup destinations, we deploy and manage Veeam as a complementary layer.' },
      { title: 'Compliance & Legal Hold Configuration', body: 'Implement Microsoft Purview holds, eDiscovery configurations, and compliance retention tags to meet regulatory requirements without disrupting operations.' },
      { title: 'Disaster Recovery Testing & Runbooks', body: 'Scheduled recovery drills, documented runbooks, and escalation procedures that prove your backup works before you need it.' },
    ],
    technologies: ['Microsoft 365 Backup', 'Microsoft Purview', 'Veeam for Microsoft 365', 'Azure Backup', 'Exchange Online', 'SharePoint Online', 'OneDrive', 'Microsoft Teams'],
    stats: [
      { value: '93', suffix: '%', label: 'of ransomware attacks target backup systems — immutability is non-negotiable' },
      { value: '15', suffix: 'min', label: 'average granular restore time for a single mailbox or SharePoint item' },
      { value: '100', suffix: '%', label: 'of NEX4-managed M365 environments have tested, verified backup coverage' },
    ],
    ctaHeadline: 'Is Your M365 Data Actually Protected?',
    ctaBody: 'Book a complimentary data protection assessment — we will show you exactly where the gaps are.',
    related: [
      { title: 'Workplace Security', slug: 'workplace-security', tagline: 'Prevent the incidents that trigger recovery scenarios.', image: ASSETS.cardBg2 },
      { title: 'Cloud Migration', slug: 'cloud-migration', tagline: 'Extend data protection to your Azure workloads.', image: ASSETS.cardBg3 },
      { title: 'Workplace Productivity', slug: 'workplace-productivity', tagline: 'The M365 environment your backup strategy protects.', image: ASSETS.cardBg1 },
    ],
    caseStudies: [
      { client: 'Legal Firm, Singapore', industry: 'Legal', title: 'M365 Backup deployed within 48 hours following a near-miss ransomware event', description: 'After detecting lateral movement on their network, a 300-user law firm engaged NEX4 for emergency backup deployment. Full M365 coverage with immutable storage was achieved in under two days.', image: ASSETS.hero2 },
      { client: 'APAC Education Provider', industry: 'Education', title: 'Veeam for M365 delivers 7-year retention for student record compliance requirements', description: 'A university\'s accreditation requirements mandated long-term data retention beyond native M365 capabilities. We deployed Veeam with compliant archive policies across all workloads.', image: ASSETS.cardBg2 },
      { client: 'Bangkok Healthcare Network', industry: 'Healthcare', title: 'Scheduled DR testing reveals three unprotected workloads — remediated before incident', description: 'Disaster recovery testing as part of NEX4\'s managed backup service identified misconfigured backup policies on three critical workloads, all remediated before any data loss event occurred.', image: ASSETS.cardBg3 },
    ],
  },

  'cloud-migration': {
    slug: 'cloud-migration',
    category: 'Cloud',
    title: 'Your Azure Migration, Done Right the First Time',
    tagline: 'NEX4 takes the guesswork out of cloud migration — from initial assessment through to a fully optimised, secure Azure environment ready for what comes next.',
    heroImage: ASSETS.hero3,
    overviewHeading: 'Every Migration Is Different. Our Methodology Is Not.',
    overviewParagraphs: [
      "Cloud migration projects fail for predictable reasons: underestimated workload complexity, insufficient security planning, poor performance post-migration, and cost overruns that erode the business case. NEX4's structured migration methodology — built on Microsoft's Cloud Adoption Framework — addresses each of these systematically before work begins.",
      'Whether you are lifting and shifting legacy infrastructure, modernising applications to cloud-native architectures, or consolidating datacentres into Azure, we provide the architecture, project management, and hands-on implementation to deliver on scope, on budget, and on time.',
    ],
    benefits: [
      { icon: Cloud, title: 'Azure-Native Architecture', body: 'Every workload is designed for Azure — with the right services, sizing, redundancy, and security controls from day one, not retrofitted after deployment.' },
      { icon: Upload, title: 'Proven Migration Methodology', body: "NEX4 follows Microsoft's Cloud Adoption Framework across Assess, Plan, Ready, Migrate, and Govern phases — eliminating the guesswork from complex migrations." },
      { icon: Activity, title: 'Cost Optimisation & Governance', body: 'Right-sizing, reserved instances, and Azure Cost Management configuration ensure your cloud environment stays efficient as workloads evolve.' },
    ],
    capabilitiesHeading: 'What We Deliver',
    capabilities: [
      { title: 'Cloud Readiness Assessment', body: 'Inventory your on-premises environment, assess workload dependencies, score migration complexity, and produce a business case with TCO analysis.' },
      { title: 'Azure Landing Zone Design', body: 'Design and deploy an Azure landing zone — networking, identity, governance, and security controls — that scales with your organisation\'s growth.' },
      { title: 'Workload Migration & Modernisation', body: 'Migrate servers, databases, and applications using the right strategy for each workload: rehost, replatform, or refactor to cloud-native services.' },
      { title: 'Azure Security & Compliance Configuration', body: 'Apply Microsoft Defender for Cloud, Azure Policy, and network security controls during migration — not as an afterthought.' },
      { title: 'Post-Migration Optimisation', body: 'Right-size resources, configure autoscaling, implement Azure Monitor and Cost Management, and establish a governance cadence for ongoing optimisation.' },
      { title: 'Hybrid & Multi-Cloud Integration', body: 'For organisations that maintain on-premises workloads, we design Azure Arc-enabled hybrid architectures that manage cloud and on-premises consistently.' },
    ],
    technologies: ['Microsoft Azure', 'Azure Migrate', 'Azure Arc', 'Azure Landing Zone', 'Defender for Cloud', 'Azure Monitor', 'Azure Cost Management', 'Microsoft Entra ID'],
    stats: [
      { value: '40', suffix: '%', label: 'average reduction in infrastructure costs after Azure optimisation' },
      { value: '100', suffix: '+', label: 'successful Azure migrations delivered across APAC markets' },
      { value: '99.9', suffix: '%', label: 'uptime SLA achieved across NEX4-managed Azure production environments' },
    ],
    ctaHeadline: 'Plan Your Cloud Migration with Confidence',
    ctaBody: 'Start with a no-obligation cloud readiness assessment — we will map your current environment and build your business case.',
    related: [
      { title: 'Workplace Security', slug: 'workplace-security', tagline: 'Secure your Azure environment with Zero Trust principles.', image: ASSETS.cardBg2 },
      { title: 'Workplace AI', slug: 'workplace-ai', tagline: 'Azure is the platform for enterprise AI — we make it ready.', image: ASSETS.cardBg4 },
      { title: 'Workplace Backup', slug: 'workplace-backup', tagline: 'Protect Azure workloads with cloud-native backup.', image: ASSETS.cardBg1 },
    ],
    caseStudies: [
      { client: 'Myanmar Telecom', industry: 'Telecommunications', title: '120 on-premises servers migrated to Azure in 4 months with zero production downtime', description: 'A structured Azure migration using the Cloud Adoption Framework moved all production workloads in phased waves, with each server validated against performance baselines before the next phase began.', image: ASSETS.hero3 },
      { client: 'Financial Group, Thailand', industry: 'Financial Services', title: 'Azure Landing Zone establishes governance foundation enabling 99.9% uptime SLA', description: 'Before migrating a single workload, we designed and deployed an enterprise-grade Azure Landing Zone with hub-spoke networking, Azure Firewall, and full policy enforcement — giving the team confidence before cutover.', image: ASSETS.cardBg2 },
      { client: 'Royal Group, Cambodia', industry: 'Conglomerate', title: 'Azure Arc delivers consistent governance across 60% cloud, 40% on-premises estate', description: 'A large Cambodian conglomerate that could not fully move to the cloud used Azure Arc to manage on-premises servers with the same policy and monitoring tools as their Azure workloads.', image: ASSETS.cardBg1 },
    ],
  },
};
