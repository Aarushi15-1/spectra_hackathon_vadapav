import { useState } from "react";
import "./App.css";

const councils = [
  "Maharashtra Medical Council",
  "Delhi Medical Council",
  "Karnataka Medical Council",
  "Gujarat Medical Council",
  "Other State Medical Council",
];

const mockRegistry = {
  "MMC-DEMO-1001": {
    name: "Dr Aditi Sharma",
    council: "Maharashtra Medical Council",
    qualification: "MBBS",
    status: "ACTIVE",
  },
  "MMC-DEMO-1002": {
    name: "Dr Riya Patil",
    council: "Maharashtra Medical Council",
    qualification: "MBBS",
    status: "SUSPENDED",
  },
};

function App() {
  const [screen, setScreen] = useState("welcome");
  const [message, setMessage] = useState("");
  const [verification, setVerification] = useState(null);

  const [doctor, setDoctor] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    preferredLanguage: "English",
    city: "",
    state: "",
    registrationNumber: "",
    council: "Maharashtra Medical Council",
    registrationYear: "",
    registrationType: "Permanent",
    hprId: "",
  });

  function updateField(event) {
    const { name, value } = event.target;

    setDoctor((currentDoctor) => ({
      ...currentDoctor,
      [name]: value,
    }));
  }

  function handleSignup(event) {
    event.preventDefault();
    setMessage("");

    if (
      !doctor.fullName ||
      !doctor.email ||
      !doctor.mobile ||
      !doctor.password
    ) {
      setMessage("Please complete all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(doctor.email)) {
      setMessage("Enter a valid email address.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(doctor.mobile)) {
      setMessage("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (doctor.password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    if (doctor.password !== doctor.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    localStorage.setItem(
      "healthBridgeDoctor",
      JSON.stringify({
        ...doctor,
        password: undefined,
        confirmPassword: undefined,
      })
    );

    setScreen("general");
  }

  function handleLogin(event) {
    event.preventDefault();
    setMessage("");

    if (!doctor.email || !doctor.password) {
      setMessage("Enter your email and password.");
      return;
    }

    setScreen("dashboard");
  }

  function saveGeneralDetails(event) {
    event.preventDefault();

    if (!doctor.fullName || !doctor.city || !doctor.state) {
      setMessage("Please complete all required details.");
      return;
    }

    setMessage("");
    setScreen("registration");
  }

  function verifyRegistration(event) {
    event.preventDefault();
    setMessage("");

    const record = mockRegistry[
      doctor.registrationNumber.trim().toUpperCase()
    ];

    if (!record) {
      setVerification({
        type: "warning",
        title: "Registration not found",
        description:
          "The entered registration number could not be found. Manual review is required.",
      });
      return;
    }

    const enteredName = doctor.fullName.trim().toLowerCase();
    const registryName = record.name.trim().toLowerCase();

    if (
      enteredName !== registryName ||
      doctor.council !== record.council
    ) {
      setVerification({
        type: "warning",
        title: "Information mismatch",
        description:
          "The entered name or council does not match the registry record.",
      });
      return;
    }

    if (record.status === "SUSPENDED") {
      setVerification({
        type: "danger",
        title: "Clinical access restricted",
        description:
          "An official licence restriction was found. Patient-record access cannot be enabled.",
      });
      return;
    }

    setVerification({
      type: "success",
      title: "Registration verified",
      description:
        "The medical registration is active in the simulated registry.",
      qualification: record.qualification,
      referenceId: `VER-${Date.now()}`,
    });
  }

  function continueToDashboard() {
    localStorage.setItem(
      "healthBridgeVerification",
      JSON.stringify(verification)
    );

    setScreen("dashboard");
  }

  function logout() {
    setScreen("welcome");
    setMessage("");
  }

  if (screen === "welcome") {
    return (
      <div className="auth-page">
        <section className="brand-panel">
          <div className="logo">H+</div>
          <p className="eyebrow">HEALTH BRIDGE</p>

          <h1>Verified care begins with verified professionals.</h1>

          <p className="brand-description">
            A secure platform connecting verified doctors with consent-based
            patient health information.
          </p>

          <div className="feature-list">
            <p>✓ Verified medical registration</p>
            <p>✓ Purpose-based patient access</p>
            <p>✓ Secure clinical collaboration</p>
          </div>
        </section>

        <section className="form-panel">
          <div className="form-card">
            <p className="eyebrow">DOCTOR PORTAL</p>
            <h2>Welcome to Health Bridge</h2>
            <p className="muted">
              Create a professional account or continue with an existing one.
            </p>

            <button
              className="primary-button"
              onClick={() => setScreen("signup")}
            >
              Create doctor account
            </button>

            <button
              className="secondary-button"
              onClick={() => setScreen("login")}
            >
              Sign in
            </button>

            <p className="security-note">
              Doctor accounts receive clinical access only after professional
              verification.
            </p>
          </div>
        </section>
      </div>
    );
  }

  if (screen === "signup") {
    return (
      <PageShell title="Create doctor account" step="Step 1 of 3">
        <form onSubmit={handleSignup}>
          <div className="form-grid">
            <Input
              label="Full legal name"
              name="fullName"
              value={doctor.fullName}
              onChange={updateField}
              placeholder="Dr Aditi Sharma"
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={doctor.email}
              onChange={updateField}
              placeholder="doctor@example.com"
              required
            />

            <Input
              label="Mobile number"
              name="mobile"
              value={doctor.mobile}
              onChange={updateField}
              placeholder="9876543210"
              required
            />

            <Select
              label="Preferred language"
              name="preferredLanguage"
              value={doctor.preferredLanguage}
              onChange={updateField}
              options={["English", "Hindi", "Marathi"]}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={doctor.password}
              onChange={updateField}
              placeholder="Minimum 8 characters"
              required
            />

            <Input
              label="Confirm password"
              name="confirmPassword"
              type="password"
              value={doctor.confirmPassword}
              onChange={updateField}
              required
            />
          </div>

          {message && <p className="error-message">{message}</p>}

          <div className="actions">
            <button
              type="button"
              className="text-button"
              onClick={() => setScreen("welcome")}
            >
              Back
            </button>

            <button className="primary-button compact">
              Create account
            </button>
          </div>
        </form>
      </PageShell>
    );
  }

  if (screen === "login") {
    return (
      <PageShell title="Doctor sign in" step="Secure access">
        <form onSubmit={handleLogin}>
          <Input
            label="Email"
            name="email"
            type="email"
            value={doctor.email}
            onChange={updateField}
            placeholder="doctor@example.com"
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={doctor.password}
            onChange={updateField}
            required
          />

          {message && <p className="error-message">{message}</p>}

          <button className="primary-button">Sign in</button>

          <button
            type="button"
            className="text-button full"
            onClick={() => setScreen("welcome")}
          >
            Return to welcome page
          </button>
        </form>
      </PageShell>
    );
  }

  if (screen === "general") {
    return (
      <PageShell title="Professional profile" step="Step 2 of 3">
        <form onSubmit={saveGeneralDetails}>
          <div className="form-grid">
            <Input
              label="Full legal name"
              name="fullName"
              value={doctor.fullName}
              onChange={updateField}
              required
            />

            <Input
              label="City"
              name="city"
              value={doctor.city}
              onChange={updateField}
              placeholder="Pune"
              required
            />

            <Input
              label="State"
              name="state"
              value={doctor.state}
              onChange={updateField}
              placeholder="Maharashtra"
              required
            />

            <Select
              label="Consultation mode"
              name="consultationMode"
              value={doctor.consultationMode || "Both"}
              onChange={updateField}
              options={["In-person", "Teleconsultation", "Both"]}
            />
          </div>

          {message && <p className="error-message">{message}</p>}

          <div className="actions">
            <button
              type="button"
              className="text-button"
              onClick={() => setScreen("signup")}
            >
              Back
            </button>

            <button className="primary-button compact">
              Save and continue
            </button>
          </div>
        </form>
      </PageShell>
    );
  }

  if (screen === "registration") {
    return (
      <PageShell title="Medical registration" step="Step 3 of 3">
        <div className="demo-banner">
          Prototype verification: use <b>MMC-DEMO-1001</b> with
          <b> Dr Aditi Sharma</b> for an active result.
        </div>

        <form onSubmit={verifyRegistration}>
          <div className="form-grid">
            <Input
              label="Medical registration number"
              name="registrationNumber"
              value={doctor.registrationNumber}
              onChange={updateField}
              placeholder="MMC-DEMO-1001"
              required
            />

            <Select
              label="Registered council"
              name="council"
              value={doctor.council}
              onChange={updateField}
              options={councils}
            />

            <Input
              label="Registration year"
              name="registrationYear"
              type="number"
              value={doctor.registrationYear}
              onChange={updateField}
              placeholder="2020"
              required
            />

            <Select
              label="Registration type"
              name="registrationType"
              value={doctor.registrationType}
              onChange={updateField}
              options={["Permanent", "Temporary"]}
            />

            <Input
              label="HPR ID"
              name="hprId"
              value={doctor.hprId}
              onChange={updateField}
              placeholder="Optional"
            />
          </div>

          <button className="primary-button">
            Verify medical registration
          </button>
        </form>

        {verification && (
          <div className={`verification-box ${verification.type}`}>
            <h3>{verification.title}</h3>
            <p>{verification.description}</p>

            {verification.qualification && (
              <p>
                <b>Matched qualification:</b>{" "}
                {verification.qualification}
              </p>
            )}

            {verification.referenceId && (
              <p>
                <b>Reference:</b> {verification.referenceId}
              </p>
            )}

            <button
              className="secondary-button"
              onClick={continueToDashboard}
            >
              Continue to dashboard
            </button>
          </div>
        )}
      </PageShell>
    );
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="logo small">H+</div>
          <strong>Health Bridge</strong>
        </div>

        <nav>
          <button className="nav-active">Overview</button>
          <button>Verification centre</button>
          <button>Patient access</button>
          <button>Qualifications</button>
          <button>Experience</button>
          <button>Access history</button>
        </nav>

        <button className="logout-button" onClick={logout}>
          Sign out
        </button>
      </aside>

      <main className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">DOCTOR DASHBOARD</p>
            <h1>Welcome, {doctor.fullName || "Doctor"}</h1>
            <p className="muted">
              Review your verification and professional access.
            </p>
          </div>

          <span className="status-badge">
            {verification?.type === "success"
              ? "✓ Verified"
              : "Review required"}
          </span>
        </div>

        <div className="dashboard-grid">
          <DashboardCard
            title="Medical registration"
            value={
              verification?.type === "success"
                ? "Active and verified"
                : "Manual review required"
            }
            detail={doctor.registrationNumber || "Not provided"}
          />

          <DashboardCard
            title="Qualification"
            value="Not added"
            detail="Add education and specialisation"
          />

          <DashboardCard
            title="Hospital affiliation"
            value="Pending"
            detail="No verified affiliation"
          />
        </div>

        <section className="access-panel">
          <div>
            <p className="eyebrow">CLINICAL ACCESS</p>
            <h2>Patient QR access</h2>
            <p className="muted">
              Access requires an active medical licence and patient consent.
            </p>
          </div>

          <button
            className="primary-button compact"
            disabled={verification?.type !== "success"}
          >
            Scan patient QR
          </button>
        </section>

        <section className="next-steps">
          <h2>Complete your profile</h2>

          <div className="task">
            <span>1</span>
            <div>
              <b>Add educational qualifications</b>
              <p>Upload degree and specialisation information.</p>
            </div>
          </div>

          <div className="task">
            <span>2</span>
            <div>
              <b>Add professional experience</b>
              <p>Provide previous and current hospital experience.</p>
            </div>
          </div>

          <div className="task">
            <span>3</span>
            <div>
              <b>Verify hospital affiliation</b>
              <p>Connect your professional hospital or clinic.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function PageShell({ title, step, children }) {
  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="sidebar-brand">
          <div className="logo small">H+</div>
          <strong>Health Bridge</strong>
        </div>

        <span>{step}</span>
      </header>

      <main className="content-card">
        <p className="eyebrow">DOCTOR ONBOARDING</p>
        <h1>{title}</h1>
        <p className="muted">
          Your information remains restricted during professional verification.
        </p>
        {children}
      </main>
    </div>
  );
}

function Input({ label, required, ...inputProps }) {
  return (
    <label className="field">
      <span>
        {label} {required && <b>*</b>}
      </span>
      <input {...inputProps} required={required} />
    </label>
  );
}

function Select({ label, options, ...selectProps }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select {...selectProps}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function DashboardCard({ title, value, detail }) {
  return (
    <article className="dashboard-card">
      <p>{title}</p>
      <h3>{value}</h3>
      <span>{detail}</span>
    </article>
  );
}

export default App;