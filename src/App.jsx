const projects = [
  {
    title: 'Realtime Analytics Dashboard',
    description:
      'Streaming metrics pipeline with a React front end, websocket updates, and sub-second chart rendering.',
    stack: ['React', 'Node.js', 'WebSockets'],
  },
  {
    title: 'Design System Toolkit',
    description:
      'Accessible component library with tokenised theming, documented usage, and automated visual tests.',
    stack: ['TypeScript', 'Vite', 'Playwright'],
  },
  {
    title: 'Logistics Route Planner',
    description:
      'Optimisation service that plans multi-stop delivery routes and exposes them through a mapping UI.',
    stack: ['Python', 'FastAPI', 'PostgreSQL'],
  },
]

const skills = [
  'React & TypeScript',
  'Node.js APIs',
  'Design systems',
  'Docker & CI/CD',
  'PostgreSQL',
  'Testing & automation',
]

export default function App() {
  return (
    <main
      style={{
        maxWidth: 960,
        margin: '0 auto',
        padding: '64px 24px 96px',
        display: 'flex',
        flexDirection: 'column',
        gap: 56,
      }}
    >
      <header style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <span style={{ color: 'var(--accent)', fontWeight: 600, letterSpacing: 1.5, fontSize: 13 }}>
          PORTFOLIO
        </span>
        <h1 style={{ margin: 0, fontSize: 44, lineHeight: 1.1 }}>Mohamed Jaaidane</h1>
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: 18, maxWidth: 620 }}>
          Full-stack engineer building dependable web products — from API design and data modelling
          through to polished, accessible interfaces.
        </p>
        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
          <a
            href="#projects"
            style={{
              background: 'var(--accent)',
              color: '#0f172a',
              padding: '12px 20px',
              borderRadius: 8,
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            View projects
          </a>
          <a
            href="mailto:hello@example.com"
            style={{
              border: '1px solid var(--border)',
              color: 'var(--text)',
              padding: '12px 20px',
              borderRadius: 8,
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Get in touch
          </a>
        </div>
      </header>

      <section id="projects" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <h2 style={{ margin: 0, fontSize: 24 }}>Selected work</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20,
          }}
        >
          {projects.map((project) => (
            <article
              key={project.title}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <h3 style={{ margin: 0, fontSize: 18 }}>{project.title}</h3>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: 15, lineHeight: 1.6 }}>
                {project.description}
              </p>
              <ul
                style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                {project.stack.map((item) => (
                  <li
                    key={item}
                    style={{
                      fontSize: 12,
                      color: 'var(--muted)',
                      border: '1px solid var(--border)',
                      borderRadius: 999,
                      padding: '4px 10px',
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <h2 style={{ margin: 0, fontSize: 24 }}>Skills</h2>
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 12,
          }}
        >
          {skills.map((skill) => (
            <li
              key={skill}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '12px 16px',
                fontSize: 15,
              }}
            >
              {skill}
            </li>
          ))}
        </ul>
      </section>

      <footer style={{ color: 'var(--muted)', fontSize: 14, borderTop: '1px solid var(--border)', paddingTop: 24 }}>
        Built with React and Vite.
      </footer>
    </main>
  )
}
