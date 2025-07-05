import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import ToastContainer from './components/ui/ToastContainer';

function App() {
  return (
    <Router>
      <div className="App">
        <AppRoutes />
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
