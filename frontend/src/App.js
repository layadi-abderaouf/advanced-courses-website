import {Routes,Route,BrowserRouter} from 'react-router-dom'


//pages
import HomePage from './pages/HomePage';
import CoursePage from './pages/CoursePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import BecomeTeacher from './pages/auth/BecomeTeacher';
import DCoursesPage from './pages/dashboard/DCoursesPage';
import DNewCoursesPage from './pages/dashboard/DNewCoursePage';
import DcourseDetailsPages from './pages/dashboard/DcourseDetailsPages';
import CourseDetails from './pages/CourseDetails';
import CartPage from './pages/CartPage';
import VideoPge from './pages/VideoPge';
import QuizPage from './pages/QuizPage';
import ProfilePage from './pages/ProfilePage';
import TeacherProfilePgae from './pages/TeacherProfilePgae';
import CertificationPage from './pages/CertificationPage';
import DHomePage from './pages/dashboard/DHomePage';
import DPaymentPage from './pages/dashboard/DPaymentPage';
import ChatPage from './pages/ChatPage';






function App() {
  return (
    <div className="App">
      <BrowserRouter>
         <Routes>
           <Route path='/' element={<HomePage/>}></Route>
           <Route path='/courses' element={<CoursePage/>}></Route>
           <Route path='/course/:id' element={<CourseDetails/>}></Route>
           <Route path='/course/:id/video/:video_id' element={<VideoPge/>}></Route>
           <Route path='/course/:id/quiz/:quiz_id' element={<QuizPage/>}></Route>
           <Route path='/cart' element={<CartPage/>}></Route>
           <Route path='/login' element={<LoginPage/>}></Route>
           <Route path='/register' element={<RegisterPage/>}></Route>
           <Route path='/become-teacher' element={<BecomeTeacher/>}></Route>
           <Route path='/teacher/:id' element={<TeacherProfilePgae/>}></Route>
           <Route path='/profile' element={<ProfilePage/>}></Route>
           <Route path='/chat' element={<ChatPage/>}></Route>
           <Route path='/certification/:id' element={<CertificationPage/>}></Route>

           <Route path='/dashboard/courses' element={<DCoursesPage/>}></Route>
           <Route path='/dashboard/payments' element={<DPaymentPage/>}></Route>
           <Route path='/dashboard/' element={<DHomePage/>}></Route>
           <Route path='/dashboard/course/:id' element={<DcourseDetailsPages/>}></Route>
           <Route path='/dashboard/newcourses' element={<DNewCoursesPage/>}></Route>
         </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
