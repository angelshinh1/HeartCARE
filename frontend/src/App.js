import './styles/App.css';

// components
import HeroSection from './components/HeroSection';
import InputForm from './components/InputForm';
import ScrollHearts from './components/ScrollHearts';

function App() {
  return (
    <div className="App">
      <div className="hero">
        <HeroSection />
      </div>
      <div className="form-container">
        <InputForm />
      </div>
      
      <ScrollHearts />

    </div>
  );
}

export default App;
