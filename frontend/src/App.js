import './styles/App.css';

// components
import HeroSection from './components/HeroSection';
import InputForm from './components/InputForm';
import ScrollHearts from './components/ScrollHearts';

function App() {
  return (
    <div className="App">
      <HeroSection />
  
      <InputForm />
      
      <ScrollHearts />

    </div>
  );
}

export default App;
