import http from 'http';
import handler from './api/claude.js';

function getMockData(reqBody) {
  const systemPrompt = reqBody.system || '';
  const messages = reqBody.messages || [];
  const userText = messages[0]?.content || '';
  
  let mockText = '';

  if (systemPrompt.includes('ATS resume analyzer')) {
    mockText = JSON.stringify({
      detectedRole: "Senior Software Engineer",
      atsScore: 84,
      atsCompatibility: {
        score: 88,
        hasPhoto: false,
        photoNote: "No photo detected (excellent for ATS compatibility).",
        formattingIssues: ["Some bullet points lack action verbs or metrics."],
        atsUnfriendlyElements: [],
        goodPractices: ["Clean single-column layout", "Clear section headers", "Consistent contact details"]
      },
      sectionScores: {
        contact: { score: 100, feedback: "Contact section is complete and clearly visible.", missing: [] },
        summary: { score: 85, feedback: "Professional summary is good, but could include more metrics.", missing: [] },
        experience: { score: 80, feedback: "Experience is strong, but many bullet points are descriptive rather than impact-driven.", hasExperience: true },
        education: { score: 95, feedback: "Education details are clear and formatted chronologically.", missing: [] },
        skills: { score: 85, feedback: "Good skills list, well-grouped.", missing: [] },
        projects: { score: 90, feedback: "Projects are impressive and demonstrate core capabilities.", missing: [] },
        certifications: { score: 100, feedback: "Relevant certifications included.", missing: [] }
      },
      companyFitAnalysis: {
        fitScore: 82,
        strengths: ["Strong technical match in JavaScript/TypeScript", "Good experience with React"],
        gaps: ["Lacks explicit mention of Cloud Deployment (AWS/GCP)"],
        recommendation: "Highlight system architecture and deployment experience in your resume bullet points."
      },
      jobDescriptionMatch: {
        matchScore: 78,
        matchedKeywords: ["React", "Node.js", "TypeScript", "REST APIs", "Git"],
        missingKeywords: ["Docker", "Kubernetes", "AWS", "GraphQL"],
        relevantSkillsFound: ["Frontend development", "Backend engineering", "State management"],
        irrelevantContent: []
      },
      bulletImprovements: [
        {
          before: "Responsible for building the user interface of the main web app.",
          after: "Led the development of a responsive React/TypeScript application, improving page load speed by 35% and user retention by 15%.",
          reason: "Highlights technologies used, business impact, and leadership."
        },
        {
          before: "Maintained the Node.js backend APIs.",
          after: "Optimized Node.js API query times by 40% through redis caching and database indexing.",
          reason: "Quantifies achievements and lists specific technical actions taken."
        }
      ],
      problems: [
        "Lacks metrics in 3 out of 5 experience bullets.",
        "Missing critical Cloud keywords listed in the job description."
      ],
      strengths: [
        "Highly readable single-column structure",
        "Strong focus on modern web stacks (React, TypeScript)"
      ],
      quickWins: [
        "Add Docker and AWS to your skills section",
        "Quantify resume bullet points with numbers and percentages"
      ],
      overallFeedback: "This resume shows a highly competent software developer. The layout is clean and ATS-friendly. To boost your score to the 90s, focus on adding quantitative results to your experience bullets and tailoring for the missing Cloud keywords."
    });
  } else if (systemPrompt.includes('resume writer')) {
    mockText = `JOHN DOE
john.doe@email.com | (123) 456-7890 | linkedin.com/in/johndoe | github.com/johndoe

PROFESSIONAL SUMMARY
Senior Software Engineer with 6+ years of experience specializing in building highly scalable React & Node.js web applications. Proven track record of improving application performance by up to 40% and leading development teams in fast-paced environments. Expert in TypeScript, React, Node.js, and modern Cloud architectures.

CORE SKILLS
- Languages: JavaScript, TypeScript, Python, SQL, HTML5, CSS3
- Frameworks & Libraries: React.js, Next.js, Node.js, Express.js, Redux, TailwindCSS
- Cloud & DevOps: AWS (S3, EC2, Lambda), Docker, Git, CI/CD pipelines
- Databases: PostgreSQL, MongoDB, Redis

PROFESSIONAL EXPERIENCE
Senior Software Engineer | TechCorp Inc. | 2022 - Present
- Led the migration of a legacy frontend application to React and TypeScript, boosting page load speeds by 35% and improving SEO rankings.
- Architected and optimized Node.js API endpoints, reducing average database query times by 40% using Redis caching and PostgreSQL indexing.
- Mentored 4 junior developers and established code review guidelines, increasing overall sprint velocity by 15%.
- Implemented automated Jest testing suites, raising codebase test coverage from 45% to 88%.

Software Engineer | DevSolutions | 2020 - 2022
- Developed 15+ reusable frontend components using React and TailwindCSS, reducing UI development time for future features by 25%.
- Designed and integrated RESTful APIs with Node.js and Express, supporting a client-facing portal with over 50,000 monthly active users.
- Collaborated with product designers to implement pixel-perfect, responsive UI designs, decreasing mobile bounce rates by 12%.

EDUCATION
Bachelor of Science in Computer Science | State University | 2016 - 2020`;
  } else if (systemPrompt.includes('developer profile evaluator')) {
    mockText = JSON.stringify({
      overallScore: 85,
      profileCompleteness: 90,
      activityScore: 80,
      codeQualityScore: 85,
      portfolioStrength: 88,
      summary: "This GitHub profile shows a highly active frontend and fullstack developer. There is a strong focus on personal projects using React, TypeScript, and Node.js. Repositories are well-documented with clear README files and structured codebases.",
      topLanguages: [
        { name: "TypeScript", percentage: 55, level: "Advanced" },
        { name: "JavaScript", percentage: 30, level: "Advanced" },
        { name: "HTML/CSS", percentage: 15, level: "Intermediate" }
      ],
      repoAnalysis: [
        {
          name: "resume-ats-analyzer",
          complexityScore: 8,
          impressiveness: 9,
          feedback: "Excellent project showcasing full-stack integration, PDF processing, and integration with LLM APIs. Highly relevant for modern software engineering roles.",
          tags: ["React", "Node.js", "AI"]
        },
        {
          name: "react-ui-library",
          complexityScore: 7,
          impressiveness: 8,
          feedback: "Great display of reusable component architecture and design system implementation using Tailwind CSS.",
          tags: ["TypeScript", "React", "CSS"]
        }
      ],
      commitPatterns: {
        assessment: "consistent",
        note: "Daily commits showing active coding, clean commit messages, and structured branch management."
      },
      strengths: [
        "Strong portfolio of complete, functional projects",
        "Consistent usage of TypeScript and modern React patterns",
        "Well-documented repositories with clear installation guides"
      ],
      weaknesses: [
        "Fewer contributions to open-source projects",
        "Limited evidence of testing setups (e.g. Jest, Cypress) in public repos"
      ],
      missingForRole: [
        "Unit test configurations",
        "Dockerfiles or CI/CD pipelines (GitHub Actions)"
      ],
      standoutProjects: [
        "resume-ats-analyzer"
      ],
      recommendations: [
        "Add automated tests to your top repositories",
        "Incorporate a simple GitHub Actions workflow to run linting/testing automatically on push"
      ],
      hirabilityVerdict: "Strong Candidate - Highly recommended for Full-Stack or Frontend Developer positions.",
      redFlags: []
    });
  } else {
    mockText = "This is a fallback mock response from the local development server because the Anthropic API call did not succeed.";
  }

  return {
    id: "mock_msg_01",
    type: "message",
    role: "assistant",
    model: reqBody.model || "claude-mock",
    content: [
      {
        type: "text",
        text: mockText
      }
    ],
    usage: {
      input_tokens: 100,
      output_tokens: 200
    }
  };
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/api/claude' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const parsedBody = body ? JSON.parse(body) : {};
        console.log(`[API Request] POST /api/claude - model: ${parsedBody.model}`);
        
        // Mock Vercel response helper with fallback interceptor
        const vercelRes = {
          statusCode: 200,
          status(code) {
            this.statusCode = code;
            return this;
          },
          json(data) {
            if (this.statusCode !== 200) {
              console.warn(`[API Warning] Anthropic API failed with status ${this.statusCode}. Details:`, JSON.stringify(data));
              console.log('[API Fallback] Generating mock analysis data so you can test the application UI flow...');
              
              const mockResponse = getMockData(parsedBody);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(mockResponse));
              return;
            }
            
            console.log(`[API Response] Success - Status: ${this.statusCode}`);
            res.writeHead(this.statusCode, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
          }
        };

        // Mock Vercel request helper
        const vercelReq = {
          body: parsedBody
        };

        await handler(vercelReq, vercelRes);
      } catch (err) {
        console.error('[API Error] Local server crashed handling request:', err);
        // Fallback on total crash too
        try {
          const parsedBody = body ? JSON.parse(body) : {};
          const mockResponse = getMockData(parsedBody);
          console.log('[API Fallback] Falling back to mock data after local API crash.');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(mockResponse));
        } catch (fallbackErr) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: { message: err.message } }));
        }
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`> Local API Server running on http://localhost:${PORT}`);
});
