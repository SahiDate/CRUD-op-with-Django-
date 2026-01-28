import Login from "./Login";

function UserLogin({ onLogin }) {
  return (
    <Login
      title="User Login"
      role="user"   // 👈 Tells backend & frontend this is USER login
      onLogin={onLogin} showRegisterLink={true}
      switchLink={{
        to: "/user/register",
        text: "New user? Register here"
      }}
      adminLink={{
        to: "/admin/login",
        text: "Login as Admin"
      }}
    />
  );
}

export default UserLogin;
