// frontend/src/components/Navbar.js
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/Login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Sistema
        </Link>
        <div>
          <Link className="btn btn-light me-2" to="/User">
            Usuário
          </Link>
          <Link className="btn btn-light me-2" to="/Products">
            Produtos
          </Link>
          <Link className="btn btn-light me-2" to="/GoodsMovement">
            Movimentação
          </Link>
          <Link className="btn btn-light me-2" to="/ReportStock">
            Relatório Estoque
          </Link>
          <button className="btn btn-danger" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
