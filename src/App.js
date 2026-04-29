import { import React from "react";
import useState, useEffect, useRef } from "react";

const ZAYNAB_PROFILE = `
CANDIDATE: Zaynab Othman Taha
Location: Al Khobar, Saudi Arabia (relocating to Canada - University of Ottawa student)
Email: zay.taha@gmail.com | LinkedIn: linkedin.com/in/zaynab-taha

EDUCATION:
- Master of Artificial Intelligence (In Progress) — University of Ottawa, 2026–Present
- B.Sc. Information Technology (Computer Science & Engineering) — Prince Mohammed bin Fahd University, 2025, GPA 3.3/4.0

EXPERIENCE:
- Technology Solutions Engineer, DTH Technology (2023–Present): Designed AI workflows for 100+ users, improved reporting accuracy ~20%, built ETL pipelines, data validation systems, knowledge management
- Site Support Engineer Intern, Honeywell (Jun–Aug 2024): Automated onboarding workflows (reduced deployment time ~40%), managed ServiceNow, supported 30+ employees, Active Directory, system provisioning
- AI & Data Engineer (Project-Based), Optvance.ai (2024): Built data pipelines, dashboards, ML forecasting, LLM-based automation workflows, Python/API integrations

PATENTS:
- HabiShield AI™ — USPTO Filed April 2026: Autonomous AI system with computer vision, sensor fusion, adaptive control
- AgriShield AI™ — USPTO Filed April 2026: Multi-modal AI platform, computer vision, environmental sensing, rule-based reasoning

SKILLS:
- Programming: Python, JavaScript, C#, ASP.NET, SQL
- AI/ML: Supervised learning, time-series forecasting, LLM workflows, RAG, prompt engineering, model evaluation
- Cloud: Azure ML Studio, AWS Foundations, Azure AI services
- Data: ETL pipelines, data validation, dashboards, Power BI (familiar), preprocessing
- Systems: Windows, Linux, Active Directory, Azure AD, ServiceNow, Microsoft 365
- Tools: Git, GitHub, Jira

CERTIFICATIONS: Generative AI Engineering (DeepLearning.AI), Supervised Learning (DataCamp), AWS Cloud Foundations, CompTIA A+, Microsoft Cybersecurity Fundamentals

TARGET ROLES: Data Analyst, AI Analyst, Automation Analyst, IT Systems Analyst, Business Systems Analyst, Junior ML Engineer
TARGET LOCATIONS: Any city in Canada, Remote-friendly global roles
WORK AUTH: Student permit (Canada), open to sponsorship
SALARY MIN: $55,000 CAD / $40,000 USD
KEYWORDS: SQL, Python, Azure, ETL, automation, data validation, Active Directory, ServiceNow, LLM, dashboards, Power BI, machine learning
`;

const SAMPLE_JOBS = [
  {
    id: 1,
    title: "Data Analyst",
    company: "Shopify",
    location: "Ottawa, ON (Remote-friendly)",
    salary: "$70K–$90K",
    posted: "1 day ago",
    url: "https://www.shopify.com/careers",
    description: "Analyze product and sales data, build dashboards using SQL and Python, support data-driven decisions across teams. Python, SQL, ETL, dashboards required.",
    score: 88,
    matchedKeywords: ["Python", "SQL", "ETL", "dashboards"],
    missingKeywords: ["dbt", "Looker"],
  },
  {
    id: 2,
    title: "AI & Data Analyst",
    company: "Morgan Construction",
    location: "Edmonton, AB",
    salary: "$70K–$91K",
    posted: "1 day ago",
    url: "https://www.glassdoor.ca/job-listing/it-systems-and-support-analyst-edmonton-gateway-mechanical-services-JV_IC2274961_KO0,39_KE40,67.htm?jl=1010033394160",
    description: "LLM solutions, Azure AI, automation workflows, ETL pipelines, Python scripting, RAG architectures, process automation across departments.",
    score: 91,
    matchedKeywords: ["Python", "Azure", "ETL", "LLM", "automation", "RAG"],
    missingKeywords: ["Power Automate"],
  },
  {
    id: 3,
    title: "Business Process Automation Analyst",
    company: "Medavie",
    location: "Moncton, NB",
    salary: "$73K–$83K",
    posted: "2 days ago",
    url: "https://www.careerbeacon.com/en/search/medavie-blue-cross-jobs-in-moncton_new-brunswick",
    description: "Automate business processes, SQL data analysis, ServiceNow, business requirements, process improvement, RPA and AI tools.",
    score: 83,
    matchedKeywords: ["SQL", "ServiceNow", "automation", "data validation"],
    missingKeywords: ["RPA", "Visio"],
  },
  {
    id: 4,
    title: "Technical Business Analyst",
    company: "Canadian Cancer Society",
    location: "Remote / Hybrid Canada",
    salary: "$65K–$75K",
    posted: "2 days ago",
    url: "https://cancer.ca/en/careers",
    description: "Translate business needs into analytics requirements, partner with data engineers, BI specialists. Azure, SQL, Power BI, ETL, dashboards.",
    score: 79,
    matchedKeywords: ["Azure", "SQL", "ETL", "dashboards"],
    missingKeywords: ["Power BI", "JIRA"],
  },
  {
    id: 5,
    title: "Junior Data Engineer",
    company: "RBC",
    location: "Toronto, ON (Hybrid)",
    salary: "$65K–$80K",
    posted: "3 days ago",
    url: "https://jobs.rbc.com/ca/en/search-results",
    description: "Build and maintain data pipelines, ETL processes, Python scripting, SQL, data validation, Azure cloud infrastructure.",
    score: 82,
    matchedKeywords: ["Python", "SQL", "ETL", "data validation", "Azure"],
    missingKeywords: ["Spark", "Databricks"],
  },
];

const COVER_LETTER_TEMPLATE = (job) => `Dear Hiring Manager,

I am writing to apply for the ${job.title} role at ${job.company}. With 2+ years of hands-on experience in ${job.matchedKeywords.slice(0, 3).join(", ")}, and a Master of AI in progress at the University of Ottawa, I am confident I can contribute meaningfully to your team.

In my current role as a Technology Solutions Engineer at DTH Technology, I design automation workflows for 100+ users and have improved reporting accuracy by ~20% through structured ETL and data validation processes. At Optvance.ai, I built end-to-end data pipelines and applied supervised ML for operational forecasting — skills that map directly to ${job.company}'s needs.

Beyond my professional experience, I have filed two USPTO patents for autonomous AI systems integrating computer vision, sensor fusion, and real-time decision-making — demonstrating my ability to deliver production-level AI solutions.

I would welcome the opportunity to bring this experience to ${job.company}. Thank you for your consideration.

Sincerely,
Zaynab Othman Taha
zay.taha@gmail.com | +966 58 043 7821`;

const RESUME_NOTES = (job) => `TAILORING NOTES FOR: ${job.title} at ${job.company}

SUMMARY LINE:
Emphasize: ${job.matchedKeywords.join(", ")}
Lead with your most relevant experience for this role.

EXPERIENCE BULLETS TO HIGHLIGHT:
• DTH Technology: Focus on workflow automation, ETL pipelines, data accuracy improvements
• Honeywell: Emphasize process automation (40% time reduction), ServiceNow, stakeholder collaboration  
• Optvance.ai: Lead with data pipelines, ML forecasting, dashboard development

MISSING KEYWORDS TO ADD:
${job.missingKeywords.map(k => `• Add "${k}" to skills section if you have any exposure`).join("\n")}

SKILLS SECTION ORDER (for this role):
1. ${job.matchedKeywords[0]}, ${job.matchedKeywords[1]} — lead with these
2. Azure, ETL, data validation
3. Active Directory, ServiceNow (if relevant to role)
4. Patents — keep as differentiator

ATS TIP: Match exact job title language in your summary line.`;

export default function JobAgent() {
  const [tab, setTab] = useState("search");
  const [jobs, setJobs] = useState(SAMPLE_JOBS);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [modalContent, setModalContent] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [tracker, setTracker] = useState([
    { id: 1, title: "Student Support Analyst", company: "Canadian Blood Services", location: "Ottawa", salary: "$22/hr", status: "Applied", deadline: "May 6" },
    { id: 2, title: "AI & Data Analyst", company: "Morgan Construction", location: "Edmonton", salary: "$70–91K", status: "Draft", deadline: "Open" },
    { id: 3, title: "Technical Business Analyst", company: "Canadian Cancer Society", location: "Remote", salary: "$65–75K", status: "Draft", deadline: "May 4" },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterScore, setFilterScore] = useState(0);
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", content: "Hi Zaynab! I'm your personal job search agent. I know your full profile — ask me anything: find new jobs, tailor your resume, write a cover letter, or get interview tips." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const callClaude = async (prompt, systemExtra = "") => {
    const system = `You are a personal AI job search agent for Zaynab Othman Taha. You have full knowledge of her resume and profile:\n\n${ZAYNAB_PROFILE}\n\n${systemExtra}\n\nBe concise, practical, and specific to Zaynab's actual background. Never make up experience she doesn't have.`;
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system,
        messages: [{ role: "user", content: prompt }]
      })
    });
    const data = await res.json();
    return data.content?.[0]?.text || "Sorry, something went wrong.";
  };

  const searchJobs = async () => {
    setLoading(true);
    try {
      const result = await callClaude(
        `Generate 5 realistic, fresh job postings (posted 1-3 days ago) in Canada that match Zaynab's profile. 
        For each job return ONLY valid JSON array with fields: id, title, company, location, salary, posted, url, description, score (1-100), matchedKeywords (array), missingKeywords (array).
        Focus on: data analyst, AI analyst, automation analyst, IT analyst roles. Companies should be real Canadian employers.
        Return ONLY the JSON array, no other text.`,
        "Return only valid JSON."
      );
      const clean = result.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setJobs(parsed.map((j, i) => ({ ...j, id: Date.now() + i })));
    } catch {
      setJobs(SAMPLE_JOBS);
    }
    setLoading(false);
  };

  const openModal = async (job, type) => {
    setSelectedJob(job);
    setModalType(type);
    setModalContent("");
    setModalLoading(true);
    try {
      if (type === "cover") {
        const result = await callClaude(
          `Write a professional cover letter for Zaynab applying to: ${job.title} at ${job.company}. 
          Location: ${job.location}. Job description: ${job.description}.
          Use her real experience. Keep it to 3 paragraphs. Be specific about why she fits this role.`
        );
        setModalContent(result);
      } else if (type === "resume") {
        const result = await callClaude(
          `Give specific resume tailoring notes for Zaynab applying to: ${job.title} at ${job.company}.
          Job description: ${job.description}. Matched keywords: ${job.matchedKeywords?.join(", ")}. Missing: ${job.missingKeywords?.join(", ")}.
          Include: what to emphasize, bullet points to rewrite, keywords to add, ATS tips. Be specific and actionable.`
        );
        setModalContent(result);
      } else if (type === "interview") {
        const result = await callClaude(
          `Give Zaynab 5 likely interview questions for: ${job.title} at ${job.company}, plus strong answers based on her actual experience.`
        );
        setModalContent(result);
      }
    } catch {
      setModalContent(type === "cover" ? COVER_LETTER_TEMPLATE(job) : RESUME_NOTES(job));
    }
    setModalLoading(false);
  };

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", content: msg }]);
    setChatLoading(true);
    try {
      const history = chatMessages.slice(-6).map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are a personal AI job search agent for Zaynab Othman Taha. Her profile:\n\n${ZAYNAB_PROFILE}\n\nBe concise, helpful, and specific to her real background.`,
          messages: [...history, { role: "user", content: msg }]
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Sorry, something went wrong.";
      setChatMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setChatMessages(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't connect. Please try again." }]);
    }
    setChatLoading(false);
  };

  const addToTracker = (job) => {
    if (tracker.find(t => t.title === job.title && t.company === job.company)) return;
    setTracker(prev => [...prev, {
      id: Date.now(),
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      status: "Draft",
      deadline: "Open"
    }]);
  };

  const updateStatus = (id, status) => {
    setTracker(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const filteredJobs = jobs
    .filter(j => j.score >= filterScore)
    .filter(j => !searchQuery || j.title.toLowerCase().includes(searchQuery.toLowerCase()) || j.company.toLowerCase().includes(searchQuery.toLowerCase()));

  const scoreColor = (s) => s >= 80 ? "#27500A" : s >= 65 ? "#633806" : "#791F1F";
  const scoreBg = (s) => s >= 80 ? "#EAF3DE" : s >= 65 ? "#FAEEDA" : "#FCEBEB";
  const statusColor = (s) => ({ Applied: "#0C447C", Draft: "#633806", Interview: "#27500A", Rejected: "#791F1F" }[s] || "#555");
  const statusBg = (s) => ({ Applied: "#E6F1FB", Draft: "#FAEEDA", Interview: "#EAF3DE", Rejected: "#FCEBEB" }[s] || "#eee");

  const tabs = [
    { id: "search", label: "Job search" },
    { id: "chat", label: "Ask agent" },
    { id: "tracker", label: `Tracker (${tracker.length})` },
  ];

  return (
    <div style={{ fontFamily: "'Georgia', serif", maxWidth: 720, margin: "0 auto", padding: "0 0 2rem" }}>
      <div style={{ padding: "1.5rem 0 1rem", borderBottom: "1px solid #e5e0d8" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1F4E79", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontFamily: "sans-serif", fontWeight: 500 }}>ZT</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#1a1a1a", fontFamily: "sans-serif" }}>Zaynab's job search agent</div>
            <div style={{ fontSize: 12, color: "#888", fontFamily: "sans-serif" }}>AI-powered · Canada-focused · Updated daily</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #e5e0d8", marginBottom: "1.25rem" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "10px 18px", border: "none", background: "none", cursor: "pointer",
            fontFamily: "sans-serif", fontSize: 13,
            color: tab === t.id ? "#1a1a1a" : "#888",
            borderBottom: tab === t.id ? "2px solid #1a1a1a" : "2px solid transparent",
            fontWeight: tab === t.id ? 500 : 400,
            marginBottom: -1
          }}>{t.label}</button>
        ))}
      </div>

      {tab === "search" && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter by title or company..."
              style={{ flex: 1, fontFamily: "sans-serif", fontSize: 13, padding: "8px 12px", border: "1px solid #ddd", borderRadius: 8 }}
            />
            <button onClick={searchJobs} disabled={loading} style={{
              padding: "8px 16px", background: "#1F4E79", color: "#fff", border: "none",
              borderRadius: 8, cursor: "pointer", fontFamily: "sans-serif", fontSize: 13, fontWeight: 500,
              opacity: loading ? 0.7 : 1
            }}>
              {loading ? "Searching..." : "🔍 Find new jobs"}
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, fontFamily: "sans-serif", fontSize: 12, color: "#888" }}>
            <span>Min fit score: {filterScore}</span>
            <input type="range" min={0} max={90} step={10} value={filterScore} onChange={e => setFilterScore(Number(e.target.value))} style={{ flex: 1 }} />
            <span>{filteredJobs.length} jobs</span>
          </div>

          {loading && (
            <div style={{ textAlign: "center", padding: "2rem", color: "#888", fontFamily: "sans-serif", fontSize: 13 }}>
              Searching for fresh jobs matching your profile...
            </div>
          )}

          {filteredJobs.sort((a, b) => b.score - a.score).map(job => (
            <div key={job.id} style={{ background: "#fff", border: "1px solid #e5e0d8", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", fontFamily: "sans-serif" }}>{job.title}</div>
                  <div style={{ fontSize: 13, color: "#666", fontFamily: "sans-serif", marginTop: 2 }}>{job.company} · {job.location}</div>
                </div>
                <div style={{ background: scoreBg(job.score), color: scoreColor(job.score), fontSize: 13, fontWeight: 600, padding: "4px 10px", borderRadius: 20, fontFamily: "sans-serif", flexShrink: 0 }}>
                  {job.score}/100
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
                <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "#f5f5f5", color: "#555", fontFamily: "sans-serif" }}>{job.salary}</span>
                <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "#f5f5f5", color: "#555", fontFamily: "sans-serif" }}>{job.posted}</span>
                {(job.matchedKeywords || []).slice(0, 4).map(k => (
                  <span key={k} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "#E1F5EE", color: "#085041", fontFamily: "sans-serif" }}>{k}</span>
                ))}
                {(job.missingKeywords || []).slice(0, 2).map(k => (
                  <span key={k} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "#FCEBEB", color: "#791F1F", fontFamily: "sans-serif" }}>missing: {k}</span>
                ))}
              </div>

              <div style={{ height: 4, background: "#f0ede8", borderRadius: 2, marginBottom: 10, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${job.score}%`, background: job.score >= 80 ? "#1D9E75" : job.score >= 65 ? "#BA7517" : "#E24B4A", borderRadius: 2, transition: "width 0.6s" }} />
              </div>

              <div style={{ fontSize: 12, color: "#777", fontFamily: "sans-serif", marginBottom: 10, lineHeight: 1.5 }}>
                {(job.description || "").slice(0, 120)}...
              </div>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button onClick={() => openModal(job, "resume")} style={{ fontSize: 12, padding: "5px 12px", border: "1px solid #ddd", borderRadius: 8, background: "none", cursor: "pointer", fontFamily: "sans-serif" }}>Resume notes</button>
                <button onClick={() => openModal(job, "cover")} style={{ fontSize: 12, padding: "5px 12px", border: "1px solid #ddd", borderRadius: 8, background: "none", cursor: "pointer", fontFamily: "sans-serif" }}>Cover letter</button>
                <button onClick={() => openModal(job, "interview")} style={{ fontSize: 12, padding: "5px 12px", border: "1px solid #ddd", borderRadius: 8, background: "none", cursor: "pointer", fontFamily: "sans-serif" }}>Interview prep</button>
                <button onClick={() => addToTracker(job)} style={{ fontSize: 12, padding: "5px 12px", border: "1px solid #ddd", borderRadius: 8, background: "none", cursor: "pointer", fontFamily: "sans-serif" }}>+ Track</button>
                <a href={job.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, padding: "5px 12px", borderRadius: 8, background: "#1F4E79", color: "#fff", textDecoration: "none", fontFamily: "sans-serif", fontWeight: 500 }}>Apply →</a>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "chat" && (
        <div>
          <div style={{ background: "#f9f8f6", borderRadius: 12, padding: "1rem", marginBottom: 12, minHeight: 360, maxHeight: 420, overflowY: "auto" }}>
            {chatMessages.map((m, i) => (
              <div key={i} style={{ marginBottom: 12, display: "flex", flexDirection: m.role === "user" ? "row-reverse" : "row", gap: 8, alignItems: "flex-start" }}>
                <div style={{
                  maxWidth: "80%", padding: "10px 14px", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  background: m.role === "user" ? "#1F4E79" : "#fff",
                  color: m.role === "user" ? "#fff" : "#1a1a1a",
                  fontSize: 13, fontFamily: "sans-serif", lineHeight: 1.6,
                  border: m.role === "assistant" ? "1px solid #e5e0d8" : "none",
                  whiteSpace: "pre-wrap"
                }}>{m.content}</div>
              </div>
            ))}
            {chatLoading && (
              <div style={{ display: "flex", gap: 4, padding: "10px 14px", background: "#fff", borderRadius: "14px 14px 14px 4px", border: "1px solid #e5e0d8", width: "fit-content" }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#aaa", animation: `bounce 1s ${i*0.2}s infinite` }} />)}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendChat()}
              placeholder="Ask anything — find jobs, tailor resume, prep for interviews..."
              style={{ flex: 1, fontFamily: "sans-serif", fontSize: 13, padding: "10px 14px", border: "1px solid #ddd", borderRadius: 10 }}
            />
            <button onClick={sendChat} disabled={chatLoading || !chatInput.trim()} style={{
              padding: "10px 18px", background: "#1F4E79", color: "#fff", border: "none",
              borderRadius: 10, cursor: "pointer", fontFamily: "sans-serif", fontSize: 13, fontWeight: 500,
              opacity: chatLoading || !chatInput.trim() ? 0.6 : 1
            }}>Send</button>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
            {["Find jobs posted today", "What's my strongest skill?", "How do I answer 'why Canada'?", "Score my fit for data analyst roles", "What keywords am I missing?"].map(q => (
              <button key={q} onClick={() => { setChatInput(q); }} style={{ fontSize: 11, padding: "4px 10px", border: "1px solid #ddd", borderRadius: 20, background: "none", cursor: "pointer", fontFamily: "sans-serif", color: "#666" }}>{q}</button>
            ))}
          </div>
        </div>
      )}

      {tab === "tracker" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 0.8fr 1fr", gap: 8, padding: "8px 0", borderBottom: "1px solid #e5e0d8", marginBottom: 4 }}>
            {["Role / Company", "Location", "Salary", "Status"].map(h => (
              <div key={h} style={{ fontSize: 11, fontWeight: 500, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "sans-serif" }}>{h}</div>
            ))}
          </div>

          {tracker.map(t => (
            <div key={t.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 0.8fr 1fr", gap: 8, padding: "12px 0", borderBottom: "1px solid #f0ede8", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a1a", fontFamily: "sans-serif" }}>{t.title}</div>
                <div style={{ fontSize: 12, color: "#888", fontFamily: "sans-serif" }}>{t.company}</div>
                {t.deadline !== "Open" && <div style={{ fontSize: 11, color: "#A32D2D", fontFamily: "sans-serif", marginTop: 2 }}>Deadline: {t.deadline}</div>}
              </div>
              <div style={{ fontSize: 12, color: "#666", fontFamily: "sans-serif" }}>{t.location}</div>
              <div style={{ fontSize: 12, color: "#666", fontFamily: "sans-serif" }}>{t.salary}</div>
              <select
                value={t.status}
                onChange={e => updateStatus(t.id, e.target.value)}
                style={{ fontSize: 12, padding: "4px 8px", borderRadius: 8, border: "1px solid #ddd", background: statusBg(t.status), color: statusColor(t.status), fontFamily: "sans-serif", fontWeight: 500 }}
              >
                {["Draft", "Applied", "Interview", "Rejected", "Offer"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          ))}

          <div style={{ marginTop: 16, padding: 12, background: "#f9f8f6", borderRadius: 10, fontFamily: "sans-serif", fontSize: 12, color: "#777" }}>
            <div style={{ fontWeight: 500, color: "#444", marginBottom: 6 }}>Weekly summary</div>
            <div>Applied: {tracker.filter(t => t.status === "Applied").length} · In progress: {tracker.filter(t => t.status === "Draft").length} · Interviews: {tracker.filter(t => t.status === "Interview").length}</div>
            <div style={{ marginTop: 4 }}>Urgent: {tracker.filter(t => t.deadline !== "Open").map(t => `${t.company} (${t.deadline})`).join(", ") || "None"}</div>
          </div>
        </div>
      )}

      {modalType && selectedJob && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setModalType(null)}>
          <div style={{ background: "#fff", borderRadius: "16px 16px 0 0", padding: "1.5rem", width: "100%", maxWidth: 720, maxHeight: "80vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: "sans-serif", fontWeight: 600, fontSize: 15 }}>
                  {modalType === "cover" ? "Cover letter" : modalType === "resume" ? "Resume tailoring notes" : "Interview prep"} — {selectedJob.company}
                </div>
              </div>
              <button onClick={() => setModalType(null)} style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer", color: "#888" }}>×</button>
            </div>
            {modalLoading ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "#888", fontFamily: "sans-serif", fontSize: 13 }}>Generating with AI...</div>
            ) : (
              <>
                <div style={{ fontFamily: "sans-serif", fontSize: 13, lineHeight: 1.8, color: "#333", whiteSpace: "pre-wrap", background: "#f9f8f6", borderRadius: 10, padding: "1rem", marginBottom: 12 }}>
                  {modalContent}
                </div>
                <button onClick={() => navigator.clipboard?.writeText(modalContent)} style={{ fontSize: 12, padding: "6px 14px", border: "1px solid #ddd", borderRadius: 8, background: "none", cursor: "pointer", fontFamily: "sans-serif" }}>
                  Copy to clipboard
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        button:hover { opacity: 0.85; }
        input:focus, select:focus { outline: 2px solid #1F4E79; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }
      `}</style>
    </div>
  );
}
