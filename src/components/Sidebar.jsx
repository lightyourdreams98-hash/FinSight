import { NavLink } from "react-router-dom";

function Sidebar() {

  const linkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-lg mb-2 ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-200"
    }`;

  return (

    <aside className="w-64 bg-white shadow-md p-4">

      <h2 className="text-2xl font-bold mb-8">
        Expense Tracker
      </h2>


      <nav>

        <NavLink
          to="/dashboard"
          className={linkClass}
        >
          Dashboard
        </NavLink>


        <NavLink
          to="/expenses"
          className={linkClass}
        >
          Expenses
        </NavLink>


        <NavLink
          to="/analytics"
          className={linkClass}
        >
          Analytics
        </NavLink>


        <NavLink
          to="/budget"
          className={linkClass}
        >
          Budget
        </NavLink>


<NavLink to="/ai-insights">
  AI Assistant
</NavLink>

      </nav>

    </aside>

  );
}

export default Sidebar;