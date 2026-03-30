import { assets, dashboard_data } from "assets/assets";
import BlogTableItem from "components/admin/BlogTableItem";
import { useAppContext } from "context/AppContext";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { axios } = useAppContext();

  const [dashboardData, setDashboardData] = useState({
    blogs: 0,
    comments: 0,
    drafts: 0,
    recentBlogs: [],
  });

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get("/api/admin/dashboard");
      data.success
        ? setDashboardData(data.dashboardData)
        : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="flex-1 p-4 md:p-10 ">
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-4 p-4  min-w-58 rounded-shadow cursor-pointer hover:scale-105 transition-all">
          <img src={assets.dashboard_icon_1} alt="" className="bg-background"/>
          <div>
            <p className="text-xl font-semibold text-white">
              {dashboardData.blogs}
            </p>
            <p className="text-white font-light">Articles</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 min-w-58 rounded-shadow curssor-pointer hover:scale-105 transition-all">
          <img src={assets.dashboard_icon_2} alt="" />
          <div>
            <p className="text-xl font-semibold text-white">
              {dashboardData.comments}
            </p>
            <p className="text-white font-light">Commentaires</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 min-w-58 rounded-shadow curssor-pointer hover:scale-105 transition-all">
          <img src={assets.dashboard_icon_3} alt="" />
          <div>
            <p className="text-xl font-semibold text-white">
              {dashboardData.drafts}
            </p>
            <p className="text-white font-light">Brouillons</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-3 m-4 mt-6 text-white">
          <img src={assets.dashboard_icon_4} alt="" />
          <p>Derniers articles</p>
        </div>

        <div className="relative max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide">
          <table className="w-full text-sm text-white">
            <thead className="text-xs text-white text-left uppercase">
              <tr>
                <th scope="col" className="px-2 py-4 xl:px-6">
                  #
                </th>
                <th scope="col" className="px-2 py-4">
                  Titre de l'article
                </th>
                <th scope="col" className="px-2 py-4 max-sm:hidden">
                  Date
                </th>
                <th scope="col" className="px-2 py-4 max-sm:hidden">
                  Statut
                </th>
                <th scope="col" className="px-2 py-4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentBlogs.map((blog, index) => {
                return (
                  <BlogTableItem
                    key={blog._id}
                    blog={blog}
                    fetchBlogs={fetchDashboard}
                    index={index + 1}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
