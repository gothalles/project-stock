// frontend/src/pages/Home.js
import Navbar from "../components/Navbar";

function Home() {
  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h2>Bem-vindo ao Sistema</h2>
        <p>Gerencie seu estoque de forma fácil.</p>
      </div>
    </div>
  );
}

export default Home;
