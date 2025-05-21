import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to MealMaster</h1>
      <p style={styles.subheading}>Plan your meals. Track your nutrition. Eat smarter.</p>

      <div style={styles.buttons}>
        <Link to="/recipes" style={styles.linkButton}>
          Browse Recipes
        </Link>
        <Link to="/meal-plan" style={styles.linkButton}>
          View Meal Plan
        </Link>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    textAlign: 'center',
    padding: '4rem',
    fontFamily: 'sans-serif',
  },
  heading: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  subheading: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
  },
  linkButton: {
    padding: '1rem 2rem',
    backgroundColor: '#4CAF50',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '0.5rem',
    fontWeight: 'bold',
  },
};
