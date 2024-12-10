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
        <div className="retro-footer">
          <h3 className="welcome-text">Some sites to try:</h3> 
          <h4 className="site-list">
            aol.com (October 1999)<br/>
            ebay.com (April 1999)<br/>            
            yahoo.com (December 1998)<br />
            cnet.com (November 1999, url rewrite issue currently)<br/>
            gamespot.com (January 1999)<br/>
            Microsoft.com (January 1999)<br/>
            davematthewsband.com (May 2000)<br/>
          </h4>
        </div>
      </div>
    </div>    
  );
}

export default App;