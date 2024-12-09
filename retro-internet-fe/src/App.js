import logo from './logo.svg';
import './App.css';
import Form from './Form';

function App() {
  return (
    <div className="retro-container">
      <header className="retro-header">
        <h1>Retro Web</h1>
      </header>

      <div className="retro-content">
        <Form className="FormRoot" />      
        <div>
          <h1 className="welcome-text">
            Welcome to 1999
          </h1>
        </div>
      </div>
    </div>    
  );
}

export default App;