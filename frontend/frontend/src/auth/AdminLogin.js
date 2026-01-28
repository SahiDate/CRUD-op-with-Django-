import Login from "./Login";

function AdminLogin({ onLogin }) {
  return (
    <Login
      title="Admin Login"
      role="admin"   // 🔥 role yahin se ja raha hai
      onLogin={onLogin} showRegisterLink={false}
      switchLink={{
        to: "/user/login",
        text: "Login as User?"
      }}
    />
  );
}

export default AdminLogin;
