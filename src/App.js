/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";

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
- HabiShield AI — USPTO Filed April 2026: Autonomous AI system with computer vision, sensor fusion, adaptive control
- AgriShield AI — USPTO Filed April 2026: Multi-modal AI platform, computer vision, environmental sensing, rule-based reasoning

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
SALARY MIN: $55,000 CAD
KEYWORDS: SQL, Python, Azure, ETL, automation, data validation, Active Directory, ServiceNow, LLM, dashboards, Power BI, machine learning
`;

const SAMPLE_JOBS = [
  { id: 1, title: "Data Analyst", company: "Shopify", location: "Ottawa, ON (Remote-friendly)", salary: "$70K-$90K", posted: "1 day ago", url: "https://www.shopify.com/careers", description: "Analyze product and sales data, build dashboards using SQL and Python, support data-driven decisions across teams. Python, SQL, ETL, dashboards required.", score: 88, matchedKeywords: ["Python", "SQL", "ETL", "dashboards"], missingKeywords: ["dbt", "Looker"] },
  { id: 2, title: "AI & Data Analyst", company: "Morgan Construction", location: "Edmonton, AB", salary: "$70K-$91K", posted: "1 day ago", url: "https://www.glassdoor.ca", description: "LLM solutions, Azure AI, automation workflows, ETL pipelines, Python scripting, RAG architectures, process automation across departments.", score: 91, matchedKeywords: ["Python", "Azure", "ETL", "LLM", "automation"], missingKeywords: ["Power Automate"] },
  { id: 3, title: "Business Process Automation Analyst", company: "Medavie", location: "Moncton, NB", salary: "$73K-$83K", posted: "2 days ago", url: "https://www.careerbeacon.com", description: "Automate business processes, SQL data analysis, ServiceNow, business requirements, process improvement.", score: 83, matchedKeywords: ["SQL", "ServiceNow", "automation", "data validation"], missingKeywords: ["RPA", "Visio"] },
  { id: 4, title: "Technical Business Analyst", company: "Canadian Cancer Society", location: "Remote / Hybrid Canada", salary: "$65K-$75K", posted: "2 days ago", url: "https://cancer.ca/en/careers", description: "Translate business needs into analytics requirements, Azure, SQL, Power BI, ETL, dashboards.", score: 79, matchedKeywords: ["Azure", "SQL", "ETL", "dashboards"], missingKeywords: ["Power BI", "JIRA"] },
  { id: 5, title: "Junior Data Engineer", company: "RBC", location: "Toronto, ON (Hybrid)", salary: "$65K-$80K", posted: "3 days ago", url: "https://jobs.rbc.com/ca/en/search-results", description: "Build and maintain data pipelines, ETL processes, Python scripting, SQL, data validation, Azure cloud infrastructure.", score: 82, matchedKeywords: ["Python", "SQL", "ETL", "data validation", "Azure"], missingKeywords: ["Spark", "Databricks"] },
];

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
    { id: 2, title: "AI & Data Analyst", company: "Morgan Construction", location: "Edmonton", salary: "$70-91K", status: "Draft", deadline: "Open" },
    { id: 3, title: "Technical Business Analyst", company: "Canadian Cancer Society", location: "Remote", salary: "$65-75K", status: "Draft", deadline: "May 4" },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterScore, setFilterScore] = useState(0);
  const [apiKey, setApiKey] = useState("");
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", content: "Hi Zaynab! I'm your personal job search agent. I know your full profile. Ask me anything: find new jobs, tailor your resume, write a cover letter, or get interview tips." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    const saved = localStorage.getItem("zay_api_key");
    if (saved) { setApiKey(saved); setApiKeySaved(true); }
  }, []);

  const saveApiKey = () => {
    localStorage.setItem("zay_api_key", apiKey);
    setApiKeySaved(true);
  };

  const callClaude = async (prompt, systemExtra = "") => {
    if (!apiKey) return "Please enter your Anthropic API key in the Settings tab first.";
    const system = `You are a personal AI job search agent for Zaynab Othman Taha. Profile:\n\n${ZAYNAB_PROFILE}\n\n${systemExtra}\n\nBe concise and specific to her real background.`;
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system, messages: [{ role: "user", content: prompt }] })
    });
    const data = await res.json();
    if (data.error) return "API Error: " + data.error.message;
    return data.content?.[0]?.text || "Something went wrong.";
  };

  const searchJobs = async () => {
    setLoading(true);
    try {
      const result = await callClaude(
        "Generate 5 realistic fresh job postings in Canada matching Zaynab's profile. Return ONLY a valid JSON array with fields: id, title, company, location, salary, posted, url, description, score (1-100), matchedKeywords (array), missingKeywords (array). Focus on data analyst, AI analyst, automation analyst roles.",
        "Return only valid JSON array, no other text."
      );
      const clean = result.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setJobs(parsed.map((j, i) => ({ ...j, id: Date.now() + i })));
    } catch (e) {
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
        const r = await callClaude(`Write a professional 3-paragraph cover letter for Zaynab applying to: ${job.title} at ${job.company}. Job: ${job.description}. Use her real experience. Be specific.`);
        setModalContent(r);
      } else if (type === "resume") {
        const r = await callClaude(`Give specific resume tailoring notes for Zaynab applying to: ${job.title} at ${job.company}. Job: ${job.description}. Matched: ${job.matchedKeywords?.join(", ")}. Missing: ${job.missingKeywords?.join(", ")}. Be actionable.`);
        setModalContent(r);
      } else if (type === "interview") {
        const r = await callClaude(`Give 5 likely interview questions for ${job.title} at ${job.company} with strong answers based on Zaynab's actual experience.`);
        setModalContent(r);
      }
    } catch (e) {
      setModalContent("Error generating content. Check your API key in Settings.");
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
        headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: `You are a personal AI job search agent for Zaynab Othman Taha. Her profile:\n\n${ZAYNAB_PROFILE}\n\nBe concise and helpful.`,
          messages: [...history, { role: "user", content: msg }]
        })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: "assistant", content: data.content?.[0]?.text || "Sorry, try again." }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: "assistant", content: "Connection error. Check your API key." }]);
    }
    setChatLoading(false);
  };

  const addToTracker = (job) => {
    if (tracker.find(t => t.title === job.title && t.company === job.company)) return;
    setTracker(prev => [...prev, { id: Date.now(), title: job.title, company: job.company, location: job.location, salary: job.salary, status: "Draft", deadline: "Open" }]);
  };

  const updateStatus = (id, status) => setTracker(prev => prev.map(t => t.id === id ? { ...t, status } : t));

  const filteredJobs = jobs.filter(j => j.score >= filterScore).filter(j => !searchQuery || j.title.toLowerCase().includes(searchQuery.toLowerCase()) || j.company.toLowerCase().includes(searchQuery.toLowerCase()));

  const scoreBg = (s) => s >= 80 ? "#EAF3DE" : s >= 65 ? "#FAEEDA" : "#FCEBEB";
  const scoreColor = (s) => s >= 80 ? "#27500A" : s >= 65 ? "#633806" : "#791F1F";
  const statusBg = (s) => ({ Applied: "#E6F1FB", Draft: "#FAEEDA", Interview: "#EAF3DE", Rejected: "#FCEBEB", Offer: "#EAF3DE" }[s] || "#eee");
  const statusColor = (s) => ({ Applied: "#0C447C", Draft: "#633806", Interview: "#27500A", Rejected: "#791F1F", Offer: "#27500A" }[s] || "#555");

  const tabs = [{ id: "search", label: "Job search" }, { id: "chat", label: "Ask agent" }, { id: "tracker", label: `Tracker (${tracker.length})` }, { id: "settings", label: "Settings" }];

  const S = {
    wrap: { fontFamily: "system-ui, sans-serif", maxWidth: 720, margin: "0 auto", padding: "0 16px 2rem" },
    header: { padding: "1.25rem 0 1rem", borderBottom: "1px solid #e5e0d8", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: 12 },
    avatar: { width: 38, height: 38, borderRadius: "50%", background: "#1F4E79", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 600, flexShrink: 0 },
    tabBar: { display: "flex", borderBottom: "1px solid #e5e0d8", marginBottom: "1.25rem" },
    tab: (active) => ({ padding: "9px 16px", border: "none", background: "none", cursor: "pointer", fontSize: 13, color: active ? "#1a1a1a" : "#888", borderBottom: active ? "2px solid #1a1a1a" : "2px solid transparent", fontWeight: active ? 600 : 400, marginBottom: -1 }),
    card: { background: "#fff", border: "1px solid #e5e0d8", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: 12 },
    btn: { fontSize: 12, padding: "5px 12px", border: "1px solid #ddd", borderRadius: 8, background: "none", cursor: "pointer" },
    btnPrimary: { fontSize: 12, padding: "5px 12px", borderRadius: 8, background: "#1F4E79", color: "#fff", border: "none", cursor: "pointer", fontWeight: 500 },
    pill: (bg, color) => ({ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: bg, color, marginRight: 4, marginBottom: 4, display: "inline-block" }),
    input: { width: "100%", fontSize: 13, padding: "8px 12px", border: "1px solid #ddd", borderRadius: 8, boxSizing: "border-box" },
  };

  return (
    <div style={S.wrap}>
      <div style={S.header}>
        <div style={S.avatar}>ZT</div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700 }}>Zaynab's job search agent</div>
          <div style={{ fontSize: 12, color: "#888" }}>AI-powered · Canada-focused · {apiKeySaved ? "API connected" : "Add API key in Settings"}</div>
        </div>
      </div>

      <div style={S.tabBar}>
        {tabs.map(t => <button key={t.id} style={S.tab(tab === t.id)} onClick={() => setTab(t.id)}>{t.label}</button>)}
      </div>

      {tab === "search" && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Filter jobs..." style={{ ...S.input, flex: 1 }} />
            <button onClick={searchJobs} disabled={loading} style={{ ...S.btnPrimary, fontSize: 13, padding: "8px 16px", whiteSpace: "nowrap" }}>
              {loading ? "Searching..." : "Find new jobs"}
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, fontSize: 12, color: "#888" }}>
            <span>Min score: {filterScore}</span>
            <input type="range" min={0} max={90} step={10} value={filterScore} onChange={e => setFilterScore(Number(e.target.value))} style={{ flex: 1 }} />
            <span>{filteredJobs.length} jobs</span>
          </div>

          {filteredJobs.sort((a, b) => b.score - a.score).map(job => (
            <div key={job.id} style={S.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{job.title}</div>
                  <div style={{ fontSize: 13, color: "#666", marginTop: 2 }}>{job.company} · {job.location}</div>
                </div>
                <div style={{ ...S.pill(scoreBg(job.score), scoreColor(job.score)), fontSize: 13, fontWeight: 700, padding: "4px 10px" }}>{job.score}/100</div>
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={S.pill("#f5f5f5", "#555")}>{job.salary}</span>
                <span style={S.pill("#f5f5f5", "#555")}>{job.posted}</span>
                {(job.matchedKeywords || []).slice(0, 4).map(k => <span key={k} style={S.pill("#E1F5EE", "#085041")}>{k}</span>)}
                {(job.missingKeywords || []).slice(0, 2).map(k => <span key={k} style={S.pill("#FCEBEB", "#791F1F")}>missing: {k}</span>)}
              </div>
              <div style={{ height: 4, background: "#f0ede8", borderRadius: 2, marginBottom: 10 }}>
                <div style={{ height: "100%", width: `${job.score}%`, background: job.score >= 80 ? "#1D9E75" : job.score >= 65 ? "#BA7517" : "#E24B4A", borderRadius: 2 }} />
              </div>
              <div style={{ fontSize: 12, color: "#777", marginBottom: 10, lineHeight: 1.5 }}>{(job.description || "").slice(0, 120)}...</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button onClick={() => openModal(job, "resume")} style={S.btn}>Resume notes</button>
                <button onClick={() => openModal(job, "cover")} style={S.btn}>Cover letter</button>
                <button onClick={() => openModal(job, "interview")} style={S.btn}>Interview prep</button>
                <button onClick={() => addToTracker(job)} style={S.btn}>+ Track</button>
                <a href={job.url} target="_blank" rel="noreferrer" style={{ ...S.btnPrimary, textDecoration: "none", display: "inline-block" }}>Apply →</a>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "chat" && (
        <div>
          <div style={{ background: "#f9f8f6", borderRadius: 12, padding: "1rem", marginBottom: 10, minHeight: 340, maxHeight: 400, overflowY: "auto" }}>
            {chatMessages.map((m, i) => (
              <div key={i} style={{ marginBottom: 10, display: "flex", flexDirection: m.role === "user" ? "row-reverse" : "row", gap: 8 }}>
                <div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: m.role === "user" ? "#1F4E79" : "#fff", color: m.role === "user" ? "#fff" : "#1a1a1a", fontSize: 13, lineHeight: 1.6, border: m.role === "assistant" ? "1px solid #e5e0d8" : "none", whiteSpace: "pre-wrap" }}>
                  {m.content}
                </div>
              </div>
            ))}
            {chatLoading && <div style={{ fontSize: 13, color: "#999", padding: "8px 14px" }}>Thinking...</div>}
            <div ref={chatEndRef} />
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} placeholder="Ask anything..." style={{ ...S.input, flex: 1 }} />
            <button onClick={sendChat} disabled={chatLoading || !chatInput.trim()} style={{ ...S.btnPrimary, padding: "8px 16px" }}>Send</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {["Find jobs posted today", "What keywords am I missing?", "How do I answer why Canada?", "Score my fit for data analyst", "Write a LinkedIn summary for me"].map(q => (
              <button key={q} onClick={() => setChatInput(q)} style={{ fontSize: 11, padding: "4px 10px", border: "1px solid #ddd", borderRadius: 20, background: "none", cursor: "pointer", color: "#666" }}>{q}</button>
            ))}
          </div>
        </div>
      )}

      {tab === "tracker" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 0.8fr 1fr", gap: 8, padding: "6px 0", borderBottom: "1px solid #e5e0d8", marginBottom: 4 }}>
            {["Role / Company", "Location", "Salary", "Status"].map(h => <div key={h} style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</div>)}
          </div>
          {tracker.map(t => (
            <div key={t.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 0.8fr 1fr", gap: 8, padding: "11px 0", borderBottom: "1px solid #f0ede8", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{t.title}</div>
                <div style={{ fontSize: 12, color: "#888" }}>{t.company}</div>
                {t.deadline !== "Open" && <div style={{ fontSize: 11, color: "#A32D2D", marginTop: 2 }}>Deadline: {t.deadline}</div>}
              </div>
              <div style={{ fontSize: 12, color: "#666" }}>{t.location}</div>
              <div style={{ fontSize: 12, color: "#666" }}>{t.salary}</div>
              <select value={t.status} onChange={e => updateStatus(t.id, e.target.value)} style={{ fontSize: 12, padding: "4px 6px", borderRadius: 8, border: "1px solid #ddd", background: statusBg(t.status), color: statusColor(t.status), fontWeight: 500 }}>
                {["Draft", "Applied", "Interview", "Rejected", "Offer"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          ))}
          <div style={{ marginTop: 14, padding: 12, background: "#f9f8f6", borderRadius: 10, fontSize: 12, color: "#777" }}>
            <div style={{ fontWeight: 600, color: "#444", marginBottom: 4 }}>Weekly summary</div>
            <div>Applied: {tracker.filter(t => t.status === "Applied").length} · Draft: {tracker.filter(t => t.status === "Draft").length} · Interviews: {tracker.filter(t => t.status === "Interview").length} · Offers: {tracker.filter(t => t.status === "Offer").length}</div>
          </div>
        </div>
      )}

      {tab === "settings" && (
        <div>
          <div style={S.card}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Anthropic API Key</div>
            <div style={{ fontSize: 12, color: "#777", marginBottom: 10 }}>Get your free key at console.anthropic.com. It's stored only in your browser.</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-ant-..." style={{ ...S.input, flex: 1 }} />
              <button onClick={saveApiKey} style={{ ...S.btnPrimary, padding: "8px 16px", whiteSpace: "nowrap" }}>{apiKeySaved ? "Saved!" : "Save key"}</button>
            </div>
            {apiKeySaved && <div style={{ fontSize: 12, color: "#27500A", marginTop: 6 }}>API key saved. AI features are active!</div>}
          </div>
          <div style={S.card}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Profile summary</div>
            <div style={{ fontSize: 12, color: "#666", lineHeight: 1.7 }}>
              <div><strong>Name:</strong> Zaynab Othman Taha</div>
              <div><strong>Target roles:</strong> Data Analyst, AI Analyst, Automation Analyst, IT Systems Analyst</div>
              <div><strong>Locations:</strong> Any city in Canada, Remote-friendly global</div>
              <div><strong>Salary min:</strong> $55,000 CAD</div>
              <div><strong>Key skills:</strong> Python, SQL, Azure, ETL, automation, Active Directory, ServiceNow, LLM</div>
              <div><strong>Work auth:</strong> Student permit (University of Ottawa)</div>
            </div>
          </div>
        </div>
      )}

      {modalType && selectedJob && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setModalType(null)}>
          <div style={{ background: "#fff", borderRadius: "16px 16px 0 0", padding: "1.5rem", width: "100%", maxWidth: 720, maxHeight: "80vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>
                {modalType === "cover" ? "Cover letter" : modalType === "resume" ? "Resume notes" : "Interview prep"} — {selectedJob.company}
              </div>
              <button onClick={() => setModalType(null)} style={{ border: "none", background: "none", fontSize: 22, cursor: "pointer", color: "#888", lineHeight: 1 }}>x</button>
            </div>
            {modalLoading
              ? <div style={{ textAlign: "center", padding: "2rem", color: "#888", fontSize: 13 }}>Generating with AI...</div>
              : <>
                  <div style={{ fontSize: 13, lineHeight: 1.8, color: "#333", whiteSpace: "pre-wrap", background: "#f9f8f6", borderRadius: 10, padding: "1rem", marginBottom: 12 }}>{modalContent}</div>
                  <button onClick={() => navigator.clipboard?.writeText(modalContent)} style={S.btn}>Copy to clipboard</button>
                </>
            }
          </div>
        </div>
      )}
    </div>
  );
}
