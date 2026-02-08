import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";

function Home() {

  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <main className="home-container">
        {/* HERO */}
        <section className="hero">
          <h1>AI-Based Online Exam Proctoring System</h1>
          <p>
            Conduct secure, fair, and scalable online examinations using
            real-time AI monitoring and intelligent behavior analysis.
          </p>
          <button className="primary-btn"  onClick={() => navigate("/signup")}>Get Started</button>
        </section>

        {/* FEATURES */}
        <section className="features">
          <h2>Key Features</h2>
          <p>
            Intelligent monitoring designed to maintain academic integrity
            throughout online examinations.
          </p>

          <div className="feature-grid">
            <Feature
              title="Face Detection"
              desc="Continuously verifies candidate presence throughout the examination."
            />
            <Feature
              title="Eye & Head Movement Tracking"
              desc="Identifies suspicious gaze direction and abnormal head movements."
            />
            <Feature
              title="Tab & Window Monitoring"
              desc="Detects tab switching and unauthorized screen activity."
            />
            <Feature
              title="Automated Violation Reports"
              desc="Generates detailed post-exam integrity and violation summaries."
            />
          </div>
        </section>

        {/* CTA */}
        <section className="cta">
          <div className="cta-box">
            <h2>Trusted for Secure Online Exams</h2>
            <p>Designed for universities, colleges, and institutions.</p>
            <button className="secondary-btn">Request Demo</button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="feature-card">
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

export default Home;
