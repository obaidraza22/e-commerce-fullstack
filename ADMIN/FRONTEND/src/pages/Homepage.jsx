import Sidebar from "../components/Sidebar";

function Homepage() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="grow">This is Homepage</div>
    </div>
  );
}

export default Homepage;
