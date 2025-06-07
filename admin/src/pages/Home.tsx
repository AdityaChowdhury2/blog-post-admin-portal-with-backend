import { Helmet } from "react-helmet-async";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Home | Blog App</title>
      </Helmet>
      <div className="flex text-center justify-center items-center text-slate-600 font-bold text-3xl mt-20">
        Welcome to MISCOM General Trading LLC
      </div>
    </div>
  );
};

export default Home;
