import './App.css';
import { Routes,Route } from 'react-router';
import Homepage from './Pages/Homepage';
import Chatpage from './Pages/Chatpage';

function App() {
  return (
    <div className='App'>
    <Routes>
      <Route exact path='/' Component={Homepage}/>
      <Route path='/chats' Component={Chatpage}/>
    </Routes>
    </div>
  );
}

export default App;
