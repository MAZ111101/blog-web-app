import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './components/home/home';
import Register from './components/register/register';
import Login from './components/login/login';
import Dashboard from './components/dashboard/dashboard';
import CreateBlog from './components/create-blog/createblog';
import MyBlogs from './components/my-blogs/myblogs';
import RecentBlogs from './components/recent-blogs/recentblogs';
import SearchBlogs from './components/search-blogs/searchblogs';
import BlogDetail from './components/create-blog/blogdetail';

function App() {
  return (
    <Router>
      <div className= 'min-h-screen bg-gray-50 text-gray-800'>
        <Routes>
          <Route path= "/" element = {<Home />}/>
          <Route path= "/register" element = {<Register />}/>
          <Route path= "/login" element = {<Login />}/>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/create-blog" element={<CreateBlog />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/myblogs" element={<MyBlogs />} />
          <Route path="/recentblogs" element={<RecentBlogs />} />
          <Route path="/searchblogs" element={<SearchBlogs />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
