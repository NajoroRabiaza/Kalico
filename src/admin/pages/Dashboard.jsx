function Dashboard() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Arrive bientôt...</h1>
        <p style={styles.subtitle}>Veuillez attendre, Cet fonctionnalité sera introduit plus tard</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "linear-gradient(135deg, #f9f9f9, #e0e0e0)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "white",
    padding: "3rem",
    borderRadius: "1rem",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    maxWidth: "500px",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
    color: "#333",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#666",
  },
};

export default Dashboard;