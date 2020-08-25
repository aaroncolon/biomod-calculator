import React from "react";
import BioModForm from './components/BioModForm'

class App extends React.Component {
  render() {
    return (
      <>
        <div className="site">
          <header className="site-header">
            <h1>BioMOD Calculator</h1>
            <h2>Monthly Surcharge Calculation</h2>
          </header>
          <div className="site-content">
            <div className="biomod-form">
              <BioModForm />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default App;
