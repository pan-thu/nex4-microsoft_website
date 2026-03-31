import { ASSETS } from '@/lib/assets';
import type { CaseStudyFull } from '@/types/caseStudy';

export const CASE_STUDIES: CaseStudyFull[] = [
  {
    slug: 'zero-trust-halts-credential-attack-myanmar-banking',
    client: 'Myanmar Banking Corp',
    industry: 'Financial Services',
    category: 'workplace-security',
    title: 'Zero Trust deployment halts credential-based attack before any data loss',
    excerpt: 'Following a phishing incident that compromised a staff account, NEX4 deployed a full Zero Trust security framework in 30 days. A subsequent credential attack was blocked automatically — before reaching a single sensitive record.',
    image: ASSETS.hero2,
    challenge: `Myanmar Banking Corp suffered a targeted phishing attack that compromised a staff email account with access to sensitive customer records and internal financial systems. The organisation was running legacy on-premises identity infrastructure with no multi-factor authentication, minimal conditional access policies, and no centralised threat visibility.\n\nThe immediate threat was contained, but leadership faced a harder question: the same attack would succeed again tomorrow. The board demanded both a rapid response and a lasting architectural change — and needed it delivered without disrupting daily banking operations for 320 staff across three branches.`,
    approachIntro: 'NEX4 deployed a phased Zero Trust framework on the Microsoft Security stack, prioritising identity hardening in the first 72 hours while building toward full endpoint and data protection over 30 days.',
    approach: [
      {
        title: 'Emergency Identity Hardening',
        body: 'Within 72 hours, we enforced MFA across all privileged accounts and deployed Microsoft Entra ID with risk-based Conditional Access policies. Any sign-in from an unrecognised device, unusual location, or suspicious session pattern was blocked pending step-up verification — immediately closing the attack vector that had been exploited.',
      },
      {
        title: 'Endpoint Management and Compliance',
        body: 'Microsoft Intune was deployed to enrol and validate all 320 corporate devices. Device compliance policies blocked unmanaged and non-compliant endpoints from accessing any corporate resource, regardless of valid credentials. This eliminated the risk of compromised personal devices being used to pivot into corporate systems.',
      },
      {
        title: 'Centralised Threat Detection with Microsoft Sentinel',
        body: 'Sentinel was deployed as the organisation\'s cloud-native SIEM, with custom analytics rules targeting credential misuse patterns, lateral movement signals, and anomalous authentication sequences specific to the banking environment. Automated playbooks were configured to isolate suspicious sessions and alert the security team within minutes.',
      },
      {
        title: 'Data Classification and Exfiltration Prevention',
        body: 'Microsoft Purview was used to classify and label sensitive customer data across Exchange Online, SharePoint, and OneDrive. Data Loss Prevention policies were applied to prevent exfiltration via email forwarding, Teams uploads, or browser sessions — closing the data exposure risk that had motivated the original attack.',
      },
    ],
    technologies: ['Microsoft Entra ID', 'Conditional Access', 'Microsoft Intune', 'Microsoft Defender for Endpoint', 'Microsoft Sentinel', 'Microsoft Purview', 'DLP Policies'],
    resultsIntro: 'Within 30 days, Myanmar Banking Corp had a fully operational Zero Trust security foundation. Three weeks post-deployment, an automated credential stuffing campaign targeting 47 user accounts was blocked entirely — with no human intervention and no data accessed.',
    results: [
      { value: '30', label: 'days from initial engagement to full Zero Trust deployment' },
      { value: '47', label: 'credential stuffing attempts blocked automatically in first post-deployment incident' },
      { value: '320', label: 'devices enrolled and secured under Defender for Endpoint management' },
      { value: '0', label: 'data records accessed during the post-deployment attack attempt' },
    ],
    testimonial: {
      quote: 'NEX4 moved faster than we thought possible. Within a week, we had controls in place that would have stopped the original breach entirely. The speed and precision gave our board genuine confidence that we had fixed the root problem — not just patched the symptom.',
      name: 'Chief Technology Officer',
      title: 'Myanmar Banking Corp',
    },
    relatedService: { title: 'Workplace Security', slug: 'workplace-security' },
  },

  {
    slug: 'copilot-saves-2-5-hours-per-user-apac-consulting',
    client: 'Professional Services Firm, APAC',
    industry: 'Consulting',
    category: 'workplace-ai',
    title: 'M365 Copilot saves 2.5 hours per user per week across 800-person firm',
    excerpt: 'A structured Copilot deployment with role-specific use cases and champion-led adoption achieved 85% weekly active usage within 60 days — setting a new benchmark for AI productivity outcomes in the region.',
    image: ASSETS.scene1,
    challenge: `An 800-person consulting firm operating across Southeast Asia had purchased Microsoft 365 Copilot licences following a board-level mandate to accelerate AI adoption. Six weeks after licence assignment, weekly active usage sat below 15%. Consultants found the tool useful in demos but struggled to integrate it into billable-hour workflows. Senior leadership was questioning the investment.\n\nThe deeper problem was structural: Copilot had been deployed as a feature rollout, not a workflow transformation. There was no use-case prioritisation, no role-based training, and no measurement framework. The tool was available — but not embedded.`,
    approachIntro: 'NEX4 redesigned the deployment as a structured adoption programme, starting with a workshop-based use-case identification exercise that connected Copilot capabilities to the specific workflows that consumed the most billable time in consulting delivery.',
    approach: [
      {
        title: 'Use-Case Identification and Prioritisation',
        body: 'We ran discovery workshops with practice leaders across four service lines to map the highest-volume, highest-time-cost knowledge tasks in their delivery workflows. This produced a prioritised use-case backlog — with meeting summarisation, proposal drafting, and client research synthesis emerging as the top three time-recovery opportunities across all groups.',
      },
      {
        title: 'Data Governance Remediation',
        body: 'A Purview sensitivity label audit revealed that a significant proportion of internal documents lacked appropriate classification, meaning Copilot grounding on SharePoint was returning incomplete and sometimes inappropriate results. We resolved the label coverage gap before re-enabling SharePoint grounding — a critical step that most Copilot deployments skip.',
      },
      {
        title: 'Role-Based Training and Champion Network',
        body: 'We trained 40 Copilot champions — two per practice group — with role-specific prompt libraries, use-case playbooks, and a 30-day adoption challenge. Champions became internal advocates who coached peers in the context of real client work, rather than generic technology training.',
      },
      {
        title: 'Measurement and Iteration',
        body: 'A Viva Insights dashboard was configured to track weekly active usage, feature adoption by user group, and self-reported time savings from a bi-weekly pulse survey. Weekly data was reviewed with practice leaders to identify adoption gaps and adjust champion focus — creating a feedback loop that accelerated uptake continuously.',
      },
    ],
    technologies: ['Microsoft 365 Copilot', 'Microsoft Purview', 'Microsoft Viva Insights', 'SharePoint Online', 'Microsoft Teams', 'Power BI'],
    resultsIntro: 'Within 60 days of restarting the deployment under the structured programme, weekly active usage reached 85% — compared to 15% at handover. The measured time saving across the cohort averaged 2.5 hours per user per week.',
    results: [
      { value: '85', suffix: '%', label: 'weekly active Copilot usage achieved within 60 days (up from 15%)' },
      { value: '2.5', suffix: 'hrs', label: 'average time saved per user per week, measured via Viva Insights' },
      { value: '800', label: 'users fully onboarded with role-specific use-case libraries' },
      { value: '40', label: 'trained Copilot champions embedded across all practice groups' },
    ],
    testimonial: {
      quote: 'The difference between our first attempt and what NEX4 built was the difference between installing software and changing how people work. The champion network is still running, months later, without us having to push it.',
      name: 'Chief People Officer',
      title: 'Professional Services Firm, APAC',
    },
    relatedService: { title: 'Workplace AI', slug: 'workplace-ai' },
  },

  {
    slug: '120-servers-azure-zero-downtime-myanmar-telecom',
    client: 'Myanmar Telecom',
    industry: 'Telecommunications',
    category: 'cloud-migration',
    title: '120 on-premises servers migrated to Azure in 4 months with zero production downtime',
    excerpt: 'A structured, wave-based Azure migration moved all production workloads off ageing on-premises infrastructure — validating each server against performance baselines before proceeding, and completing on time with no service interruptions.',
    image: ASSETS.hero3,
    challenge: `Myanmar Telecom's core IT infrastructure was running on ageing on-premises hardware that had exceeded its support lifecycle. Vendor support contracts were expiring, hardware failure rates were increasing, and the cost of extending on-premises operation — in both capital expenditure and operational risk — had become unsustainable.\n\nThe organisation operated 24/7 services with minimal tolerance for downtime, and had experienced two partial outages in the preceding 18 months related to hardware failures. The migration needed to be architecturally sound, operationally risk-free, and completed within a fixed budget window tied to the hardware lease expiry.`,
    approachIntro: 'NEX4 followed Microsoft\'s Cloud Adoption Framework across five phases — Assess, Plan, Ready, Migrate, and Govern — treating each server as a distinct migration candidate with its own risk profile, dependency map, and validation criteria.',
    approach: [
      {
        title: 'Cloud Readiness Assessment and TCO Analysis',
        body: 'Azure Migrate was used to discover and assess all 120 servers, map application dependencies, and score migration complexity. The assessment produced a prioritised migration backlog, a total cost of ownership comparison, and a business case that was approved by the board before any migration work began.',
      },
      {
        title: 'Azure Landing Zone Design and Deployment',
        body: 'Before migrating a single workload, NEX4 designed and deployed an enterprise-grade Azure Landing Zone — hub-spoke networking with Azure Firewall, role-based access control aligned to operational teams, Microsoft Defender for Cloud in enforcement mode, and Azure Policy baselines. The landing zone ensured governance and security were built into the environment, not retrofitted after the fact.',
      },
      {
        title: 'Wave-Based Migration with Performance Validation',
        body: 'Servers were migrated in six waves, grouped by dependency cluster and business criticality. Each wave followed a strict protocol: parallel run in Azure alongside on-premises, performance baseline comparison against production metrics, stakeholder sign-off, and then cutover. No wave proceeded until the previous was fully validated. This discipline was the primary reason for zero downtime across the migration.',
      },
      {
        title: 'Post-Migration Optimisation and Governance Cadence',
        body: 'Following cutover, NEX4 conducted a two-week right-sizing exercise using Azure Monitor and Cost Management data, identifying 23 over-provisioned virtual machines and adjusting reserved instance coverage. A monthly governance review cadence was established, with a NEX4 cloud architect attending alongside the internal IT team.',
      },
    ],
    technologies: ['Microsoft Azure', 'Azure Migrate', 'Azure Landing Zone', 'Azure Firewall', 'Defender for Cloud', 'Azure Policy', 'Azure Monitor', 'Azure Cost Management', 'Microsoft Entra ID'],
    resultsIntro: 'All 120 servers were migrated within the four-month window with zero production downtime. Post-migration infrastructure costs came in 38% below the previous on-premises total cost of ownership.',
    results: [
      { value: '120', label: 'servers successfully migrated to Azure across six delivery waves' },
      { value: '4', suffix: 'mo', label: 'end-to-end migration timeline, delivered on schedule' },
      { value: '0', label: 'production downtime incidents across the entire migration programme' },
      { value: '38', suffix: '%', label: 'reduction in infrastructure costs versus previous on-premises TCO' },
    ],
    testimonial: {
      quote: 'We had been talking about cloud migration for three years and kept finding reasons to delay. NEX4\'s assessment gave us the business case that removed the uncertainty, and the migration itself gave us the confidence that it was the right call. The discipline of their wave-by-wave approach is why we had zero downtime.',
      name: 'Head of Information Technology',
      title: 'Myanmar Telecom',
    },
    relatedService: { title: 'Cloud Migration', slug: 'cloud-migration' },
  },

  {
    slug: 'defender-purview-800-clinical-staff-6-sites',
    client: 'SEA Healthcare Provider',
    industry: 'Healthcare',
    category: 'workplace-security',
    title: 'Microsoft Defender and Purview securing 800 clinical staff across 6 sites',
    excerpt: 'A regional healthcare provider needed to meet updated personal data protection regulations without disrupting clinical workflows. NEX4 deployed endpoint protection and data governance across 800 staff, six sites, and three countries — in 12 weeks.',
    image: ASSETS.cardBg3,
    challenge: `A regional healthcare provider operating across Thailand, Cambodia, and Singapore faced a regulatory compliance deadline tied to updated personal data protection legislation in all three jurisdictions. Each country had specific requirements around access controls, data residency, audit logging, and incident response — and the organisation had no unified approach to any of them.\n\nThe security posture was fragmented: some sites ran managed antivirus, others ran nothing. There was no centralised visibility into device health or data access patterns. Clinical staff routinely accessed patient records from unmanaged personal devices. The organisation had 12 weeks before a compliance audit.`,
    approachIntro: 'NEX4 ran a parallel deployment programme, working across all six sites simultaneously with a dedicated team for each country stream. Priority was given to the highest-risk data environments first: sites handling oncology and surgical records.',
    approach: [
      {
        title: 'Device Compliance Baseline with Intune',
        body: 'Microsoft Intune was deployed to enrol and validate all 800 clinical devices — including tablets used at patient bedsides and laptops used in administrative functions. Compliance policies distinguished between clinical and administrative device profiles, with appropriate restrictions for each. Non-compliant devices were blocked from accessing any patient data system.',
      },
      {
        title: 'Microsoft Defender for Endpoint Deployment',
        body: 'Defender for Endpoint was deployed across all managed devices with policy settings tuned for clinical environments — balancing security enforcement with the operational reality that clinical staff cannot tolerate disruptive false positives during patient care. Tamper protection was enabled and the 24/7 monitoring feed was integrated into a centralised security dashboard.',
      },
      {
        title: 'Purview Data Classification Across Clinical Records',
        body: 'Microsoft Purview was configured with healthcare-specific sensitivity labels covering patient identifiable information, clinical diagnoses, and financial records. Auto-labelling policies were applied to SharePoint and OneDrive repositories containing historical patient documents, supplemented by manual review for high-sensitivity records.',
      },
      {
        title: 'Compliance Reporting and Audit Readiness',
        body: 'Purview compliance manager was configured to generate country-specific compliance posture reports aligned to the Thai PDPA, Cambodia\'s draft data protection framework, and Singapore\'s PDPA. The audit trail produced was submitted as evidence in all three compliance reviews, each of which passed without material findings.',
      },
    ],
    technologies: ['Microsoft Intune', 'Microsoft Defender for Endpoint', 'Microsoft Purview', 'Sensitivity Labels', 'Compliance Manager', 'Conditional Access', 'Azure Active Directory'],
    resultsIntro: 'All 800 clinical staff across six sites were secured within the 12-week compliance window. The organisation passed regulatory reviews in all three countries without material findings.',
    results: [
      { value: '800', label: 'clinical staff secured across three countries and six sites' },
      { value: '12', suffix: 'wk', label: 'deployment window, aligned to regulatory compliance deadline' },
      { value: '3', label: 'country compliance reviews passed without material findings' },
      { value: '100', suffix: '%', label: 'of patient record repositories classified and labelled with Purview' },
    ],
    relatedService: { title: 'Workplace Security', slug: 'workplace-security' },
  },

  {
    slug: 'azure-landing-zone-99-9-uptime-thailand-financial',
    client: 'Financial Group, Thailand',
    industry: 'Financial Services',
    category: 'cloud-migration',
    title: 'Azure Landing Zone establishes governance foundation enabling 99.9% uptime SLA',
    excerpt: 'Before migrating a single workload, NEX4 designed and deployed an enterprise-grade Azure foundation — hub-spoke networking, full policy enforcement, and security controls. The result was a migration with no post-cutover incidents and a 99.9% uptime SLA from day one.',
    image: ASSETS.cardBg2,
    challenge: `A diversified Thai financial group — operating across banking, insurance, and investment products — had attempted a previous cloud migration with a different provider that resulted in three significant production incidents within the first month of operation. The organisation had lost confidence in cloud migration entirely.\n\nThe root cause of the previous incidents was clear in retrospect: workloads had been migrated into an under-engineered Azure environment with no governance baseline, no network segmentation, and no security policy enforcement. The financial group needed a fundamentally different approach before they would commit to trying again.`,
    approachIntro: 'NEX4 proposed a "foundation first" approach: no workloads would be migrated until an enterprise-grade Azure Landing Zone was deployed, tested, and signed off by the client\'s architecture and security leadership. This added three weeks to the timeline but eliminated the governance debt that caused the previous failure.',
    approach: [
      {
        title: 'Azure Landing Zone Architecture Design',
        body: 'NEX4\'s cloud architects designed a hub-spoke network topology with Azure Firewall Premium as the central traffic inspection point, ExpressRoute for private connectivity to on-premises financial systems, and network security groups enforcing micro-segmentation between application tiers. The design was reviewed against Microsoft\'s Azure Security Benchmark and the Bank of Thailand\'s cloud computing guidelines.',
      },
      {
        title: 'Policy Baseline and Governance Enforcement',
        body: 'Azure Policy initiatives were deployed to enforce naming conventions, allowed resource types, mandatory tagging, diagnostic settings, and geographic restrictions aligned to Thai data residency requirements. Policy compliance was set to enforce mode from day one — meaning non-compliant resources could not be deployed at all, rather than being flagged after the fact.',
      },
      {
        title: 'Microsoft Defender for Cloud in Enforcement Mode',
        body: 'Defender for Cloud was deployed with a Secure Score target of 80+ before the first workload migration. Security recommendations were triaged and addressed systematically, with critical findings blocked at deployment through Azure Policy integration. The landing zone achieved a Secure Score of 84 at the point of first workload migration.',
      },
      {
        title: 'Phased Workload Migration with Runbook Testing',
        body: 'With the foundation in place, workload migrations proceeded in priority order, each accompanied by a documented runbook, rollback procedure, and 48-hour parallel-run validation. The discipline established in the landing zone phase extended to migration execution — resulting in zero post-cutover incidents across all migrated workloads.',
      },
    ],
    technologies: ['Azure Landing Zone', 'Azure Firewall Premium', 'ExpressRoute', 'Azure Policy', 'Microsoft Defender for Cloud', 'Azure Monitor', 'Network Security Groups', 'Azure Key Vault'],
    resultsIntro: 'The Azure environment achieved 99.9% uptime in the first six months of operation — against a background of zero post-cutover incidents and a Defender for Cloud Secure Score maintained above 82.',
    results: [
      { value: '99.9', suffix: '%', label: 'Azure environment uptime in first 6 months of production operation' },
      { value: '0', label: 'post-cutover production incidents, versus 3 in previous migration attempt' },
      { value: '84', label: 'Microsoft Defender for Cloud Secure Score achieved at first workload migration' },
      { value: '3', suffix: 'wk', label: 'foundation-first phase that eliminated the governance debt from the previous attempt' },
    ],
    testimonial: {
      quote: 'We were burned badly by our first attempt. What made NEX4 different was that they refused to start migrating workloads until the foundation was right. It felt slow at the time. In retrospect, it was the only reason this worked.',
      name: 'Group Chief Information Officer',
      title: 'Financial Group, Thailand',
    },
    relatedService: { title: 'Cloud Migration', slug: 'cloud-migration' },
  },

  {
    slug: 'loan-approval-5-days-to-36-hours-power-automate',
    client: 'Regional Bank, Myanmar',
    industry: 'Financial Services',
    category: 'workplace-automation',
    title: 'Loan approval processing time cut from 5 days to 36 hours with Power Automate',
    excerpt: 'Manual approval chains spanning five teams and three systems were replaced with a single automated workflow — reducing loan processing time by 70% without touching the core banking system.',
    image: ASSETS.cardBg1,
    challenge: `A mid-sized regional bank in Myanmar was processing personal loan applications through a manual approval workflow that spanned five teams — credit operations, compliance, risk, customer relations, and branch management. Each team used a different system, with handoffs managed via email and printed paper forms. The average loan approval took 5 working days; more complex applications could take up to 10.\n\nCustomer satisfaction scores for loan processing were the lowest of any product category. The bank was losing applicants to competitors offering faster approvals. Internal teams were frustrated by the volume of status-update queries that consumed staff time without adding value. The bank needed to modernise without replacing its core banking system — a constraint that ruled out large-scale platform investment.`,
    approachIntro: 'NEX4 conducted a two-day process discovery workshop with representatives from all five teams to map the current workflow in granular detail. This revealed that 80% of standard applications could be processed entirely within Power Automate without human intervention — with humans involved only for exceptions and final sign-off.',
    approach: [
      {
        title: 'Process Discovery and Automation Scoring',
        body: 'The workshop produced a detailed process map with 47 distinct steps, of which 38 were identified as automatable without exception logic. Each step was scored against effort, risk, and regulatory sensitivity. The resulting automation roadmap prioritised the highest-frequency, highest-delay steps for the first delivery phase.',
      },
      {
        title: 'Power Automate Flow Architecture',
        body: 'NEX4 designed a multi-stage cloud flow connecting Microsoft Forms (customer application intake), SharePoint (document storage and audit trail), Teams (approval notifications and decisions for human review points), and the bank\'s core system via a REST API connector. The flow handled document routing, compliance flag detection, escalation logic, and status notifications automatically.',
      },
      {
        title: 'Exception Handling and Human-in-the-Loop Design',
        body: 'Flagged applications — those triggering credit risk rules or compliance exceptions — were routed to a Teams-based approval workflow that gave reviewers all relevant context in a single adaptive card, eliminating the need to log into multiple systems. Response time for human review steps dropped from an average of 14 hours to 2.5 hours.',
      },
      {
        title: 'Power BI Operational Dashboard',
        body: 'A Power BI dashboard was built alongside the automation, giving operations management real-time visibility into application volumes, processing time by stage, exception rates, and approval velocity. This replaced the weekly manual reporting process that had previously required two days of analyst time to produce.',
      },
    ],
    technologies: ['Power Automate', 'Power Apps', 'Power BI', 'Microsoft Forms', 'SharePoint Online', 'Microsoft Teams', 'Dataverse', 'Azure API Management'],
    resultsIntro: 'Average loan processing time fell from 5 working days to 36 hours within 8 weeks of go-live. Standard applications — those not requiring exception review — were processed in under 4 hours.',
    results: [
      { value: '70', suffix: '%', label: 'reduction in loan processing time (5 days → 36 hours average)' },
      { value: '4', suffix: 'hr', label: 'average processing time for standard applications with no exceptions' },
      { value: '2', suffix: 'day', label: 'analyst time saved per week by replacing manual reporting with Power BI' },
      { value: '38', label: 'of 47 process steps fully automated without exception logic' },
    ],
    testimonial: {
      quote: 'Our customers noticed the change before we even announced it. The number of status-update calls dropped within the first week. For the first time, loan processing is something we feel confident promoting rather than apologising for.',
      name: 'Head of Retail Banking Operations',
      title: 'Regional Bank, Myanmar',
    },
    relatedService: { title: 'Workplace Automation', slug: 'workplace-automation' },
  },

  {
    slug: 'teams-governance-cuts-email-35-percent-yangon-law-firm',
    client: 'Regional Law Firm, Yangon',
    industry: 'Legal',
    category: 'workplace-productivity',
    title: 'Cutting internal email by 35% with Microsoft Teams governance at 450-user law firm',
    excerpt: 'A Yangon-based law firm replaced fragmented email chains and shared drives with structured Teams channels and SharePoint document libraries — reducing internal email volume by 35% and cutting document retrieval time to under 60 seconds.',
    image: ASSETS.hero1,
    challenge: `A 450-user legal practice in Yangon was operating a Microsoft 365 environment that had grown organically over four years without governance. Teams had 340 active groups — many duplicated or abandoned. SharePoint contained over 2 million documents with no consistent taxonomy. Partners were routinely copying documents into email attachments because they couldn't locate the authoritative version in SharePoint.\n\nThe situation was both a productivity problem and a risk problem: multiple versions of client documents were circulating across unsecured email threads, and junior associates were spending an average of 45 minutes per day searching for documents that senior colleagues could find in seconds through personal knowledge of the file system.`,
    approachIntro: 'NEX4 approached this as a governance and information architecture project, not a technology deployment. The starting point was a Teams and SharePoint audit, followed by an information architecture design exercise with practice group leaders.',
    approach: [
      {
        title: 'Teams Audit and Consolidation',
        body: 'Using Microsoft 365 admin centre data and Viva Insights usage analytics, NEX4 identified 218 Teams groups with no activity in the preceding 90 days and 44 duplicate groups serving the same practice team. A consolidation exercise — managed carefully to preserve relevant content — reduced the active Teams estate to 76 well-structured groups with clear ownership and defined purposes.',
      },
      {
        title: 'SharePoint Information Architecture',
        body: 'NEX4 designed a practice-group-aligned SharePoint architecture with a consistent site structure, managed metadata taxonomy for matter types, client categories, and document classifications, and a firm-wide search configuration that surfaced the right documents to the right people. The new taxonomy was applied to the most-accessed 20% of documents in the first phase, with the balance migrated over 60 days.',
      },
      {
        title: 'Channel Governance Framework and Templates',
        body: 'Teams provisioning templates were built for each practice group type — litigation, corporate, property, employment — each with pre-configured channels, tab structures, SharePoint connections, and permission models. New matters created a Teams group and SharePoint site automatically via Power Automate, eliminating the ad-hoc creation that had generated proliferation.',
      },
      {
        title: 'Adoption and Communication Programme',
        body: 'Partner-led communication cascaded the rationale for the changes through the firm. Six "digital champions" from junior associate level were trained to provide peer support. A targeted campaign addressed the specific email-attachment habit — making it easier to share a SharePoint link than an email attachment through browser extension configuration and Teams file-sharing defaults.',
      },
    ],
    technologies: ['Microsoft Teams', 'SharePoint Online', 'Microsoft 365 Admin Centre', 'Viva Insights', 'Power Automate', 'Microsoft Search', 'Microsoft Purview'],
    resultsIntro: 'Internal email volume fell 35% within 12 weeks of the programme completing. Document retrieval time dropped from an average of 45 minutes to under 60 seconds for firm documents. Partners reported the highest collaboration satisfaction scores in the firm\'s history.',
    results: [
      { value: '35', suffix: '%', label: 'reduction in internal email volume within 12 weeks' },
      { value: '<60', suffix: 's', label: 'average document retrieval time, down from 45 minutes' },
      { value: '340', label: 'Teams groups consolidated to 76 well-governed, active groups' },
      { value: '450', label: 'users successfully migrated to the new information architecture' },
    ],
    relatedService: { title: 'Workplace Productivity', slug: 'workplace-productivity' },
  },

  {
    slug: 'azure-openai-loan-document-review-60-percent-faster',
    client: 'Regional Bank, Thailand',
    industry: 'Financial Services',
    category: 'workplace-ai',
    title: 'Azure OpenAI automates loan document review, cutting processing time by 60%',
    excerpt: 'A Thai bank\'s loan origination process required manual review of supporting documents across multiple languages and formats. A custom Azure OpenAI solution integrated with the bank\'s existing system reduced document review time by 60% and eliminated manual data entry.',
    image: ASSETS.cardBg4,
    challenge: `A regional Thai bank processed an average of 400 loan applications per month, each requiring manual review of supporting documentation — income statements, tax filings, business registration certificates, and collateral valuations — that arrived in multiple formats (PDF, image scans, Word documents) and two languages (Thai and English).\n\nLoan officers spent an average of 2.5 hours per application on document review and data extraction alone, before any credit assessment began. Error rates from manual data entry were running at 4.2%, requiring re-work that added further delays. The bank had evaluated document processing platforms but could not find one that handled the Thai-language document types central to its portfolio.`,
    approachIntro: 'NEX4 designed a custom document intelligence solution using Azure AI Document Intelligence and Azure OpenAI Service, integrated with the bank\'s existing loan origination system via Azure API Management — without requiring changes to the core system.',
    approach: [
      {
        title: 'Document Intelligence Pipeline Design',
        body: 'Azure AI Document Intelligence was configured with custom document models trained on the bank\'s specific document types — Thai company registration forms, revenue department income certificates, and collateral valuations. The models were trained on 800 labelled documents from the bank\'s historical archive, achieving 94% field extraction accuracy on held-out test sets before production deployment.',
      },
      {
        title: 'Azure OpenAI Reasoning Layer',
        body: 'Extracted document fields were passed to an Azure OpenAI GPT-4 instance configured with a system prompt tuned to the bank\'s credit policy and document review checklist. The model assessed completeness, flagged discrepancies between related documents, generated a structured review summary for the loan officer, and highlighted specific fields requiring human verification — dramatically compressing the cognitive load on reviewers.',
      },
      {
        title: 'Integration with Loan Origination System',
        body: 'The document processing pipeline was exposed as a REST API via Azure API Management, allowing the existing loan origination system to submit documents and receive structured extraction results without modification. A lightweight Power Apps interface was built for cases requiring human intervention, presenting the AI\'s extracted data alongside the source document for efficient verification.',
      },
      {
        title: 'Governance, Audit Trail, and Model Monitoring',
        body: 'Given regulatory requirements in the Thai banking sector, every AI decision was logged with the source document, extracted fields, confidence scores, and any flags raised. Azure Monitor was configured to track extraction accuracy and model drift, with a quarterly review process to retrain models on new document types as the product portfolio evolved.',
      },
    ],
    technologies: ['Azure OpenAI Service', 'Azure AI Document Intelligence', 'Azure API Management', 'Azure Monitor', 'Power Apps', 'Azure Key Vault', 'Microsoft Entra ID'],
    resultsIntro: 'Document review time per application fell from 2.5 hours to under 60 minutes. Manual data entry errors dropped to below 0.5%. The bank processed 22% more applications in the first full month of operation with the same loan officer headcount.',
    results: [
      { value: '60', suffix: '%', label: 'reduction in document review time per loan application (2.5hr → <1hr)' },
      { value: '0.5', suffix: '%', label: 'data entry error rate, down from 4.2% with manual processing' },
      { value: '22', suffix: '%', label: 'increase in monthly application throughput with unchanged headcount' },
      { value: '94', suffix: '%', label: 'field extraction accuracy achieved on Thai-language document types' },
    ],
    testimonial: {
      quote: 'We looked at several document processing solutions and none of them handled Thai documents properly. NEX4 built something custom that actually works on our documents — and the integration was invisible to our existing system. That combination is rare.',
      name: 'Head of Digital Banking',
      title: 'Regional Bank, Thailand',
    },
    relatedService: { title: 'Workplace AI', slug: 'workplace-ai' },
  },
];

export const CASE_STUDIES_BY_SLUG: Record<string, CaseStudyFull> =
  Object.fromEntries(CASE_STUDIES.map(cs => [cs.slug, cs]));
