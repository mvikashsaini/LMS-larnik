
          {/* below area  */}
          <div className="bg-red-600 h-32 rounded-xl w-[98%] flex flex-col items-start justify-center p-5 text-white">
            <span className="text-2xl font-bold">Admin Control Center 🛡️</span>
            <span>Monitor and manage the entire platform</span>
          </div>

        {/* card area  */}
        <div className="flex  w-full px-5 gap-2">
          {card.map((card, index) => (
        <DashboardCard key={index} title={card.title} icon={card.icon} data={card.data} colour={card.colour}/>
          ))}
        </div>

          {/* logic for nav buttons  */}
           {nav_links === "home" ? ("") : ("")}

          <div className="w-full flex bg-orange-500 flex-col justify-center items-center">

              <div className=" w-full  flex gap-5 p-5 bg-red-400">
                    
                    {/* aletr system */}
                    <div className=" shadow-2xl h-[480px] w-full rounded-2xl flex flex-col p-5 gap-2">
                      <div className="flex items-center justify-start gap-2">
                        <AlertTriangle />
                        <span className="font-bold"> System Alerts</span>
                      </div>
                      <div className="flex flex-col w-full h-full  rounded-xl items-center p-2 gap-2 overflow-y-auto">
                        {alerts.map((alert, index) => (
                        <AlertCard key={index} title={alert.title} btn_name={alert.btn_name} subtitle={alert.subtitle} data={alert.data}/>
                        ))}
                      </div>           
                    </div>

                    <div className=" shadow-2xl h-[480px] w-full rounded-2xl flex flex-col p-5 gap-2">
                      <div className="flex items-center justify-start gap-2">
                        <AlertTriangle />
                        <span className="font-bold"> System Alerts</span>
                      </div>
                      <div className="flex flex-col w-full h-full  rounded-xl items-center p-2 gap-2 overflow-y-auto">
                        {alerts.map((alert, index) => (
                        <AlertCard key={index} title={alert.title} btn_name={alert.btn_name} subtitle={alert.subtitle} data={alert.data}/>
                        ))}
                      </div>           
                    </div>     
            </div>
           <div className="bg-green-300 w-full p-5 flex justify-center items-center">
            <div className="w-full bg-gray-400 rounded-2xl shadow-2xl flex flex-col gap-5 p-5">
              <div className="flex">
                <span className="font-bold">Platform Management</span>
              </div>
              <div className="flex gap-3">
                {platforms.map((platform, index) => (
                        <PlatformCard key={index} tittle={platform.title} icon={platform.icon}/>
                        ))}
              </div>

            
            </div>
           </div>
              <div className="flex flex-row gap-5 w-[98%]  bg-gray-500 p-5">
                {studentCards.map((studentCard, index) => (
                        <UserManagementCardDesign key={index} title={studentCard.title} subTitle={studentCard.subTitle} icon={studentCard.icon} value={studentCard.value} />
                        ))}
              </div>
              <div className="flex flex-col gap-5 w-[98%]  bg-white p-5 rounded-2xl shadow-2xl">
                <div className="bg-gray-200 flex justify-between items-center text-start p-2 font-bold">
                  <input type="checkbox" />
                  <span className="w-1/4">Name</span>
                  <span className="w-1/6">Phone</span>
                  <span className="w-1/12">Status</span>
                  <span className="w-1/12">Courses</span>
                  <span className="w-1/12">Progress</span>
                  <span className="w-1/12">Last Login</span>
                  <span className="w-1/12">Actions</span>
                </div>
                {userLists.map((userList, index) => (
                        <UserManagementListDesign key={index} name={userList.name} mail={userList.mail} phone={userList.phone} courses={userList.courses} progress_val={userList.progress_val} last_login={userList.last_login} status_title={userList.status_title} status_colour={userList.status_colour}/>
                        ))}
              </div>
          </div>


const alerts = [
    {
      title: "High Server Load",
      subtitle : "Server CPU is at 85%",
      data: "5 minutes",
      btn_name:"Warning",
      bgcolour: "yellow",
      ntmcolour: "yellow",

    },
    {
      title: "New Feature Deployed",
      subtitle : "Course analytics v2.0 is now live",
      data: "2 hours ago",
      btn_name:"info",
      bgcolour: "yellow",
      ntmcolour: "yellow",

    },
    {
      title: "Payment Gateway Issue",
      subtitle : "Some transactions are failing",
      data: "30 minutes ago",
      btn_name:"error",
      bgcolour: "yellow",
      ntmcolour: "yellow",

    },
    {
      title: "High Server Load",
      subtitle : "Server CPU is at 85%",
      data: "5 minutes",
      btn_name:"Warning",
      bgcolour: "yellow",
      ntmcolour: "yellow",

    },
    {
      title: "New Feature Deployed",
      subtitle : "Course analytics v2.0 is now live",
      data: "2 hours ago",
      btn_name:"info",
      bgcolour: "yellow",
      ntmcolour: "yellow",

    },
    {
      title: "Payment Gateway Issue",
      subtitle : "Some transactions are failing",
      data: "30 minutes ago",
      btn_name:"error",
      bgcolour: "yellow",
      ntmcolour: "yellow",

    },
  ]

    const card = [
    {
      title: "45,892",
      subtitle: "Total Users",
      data: "12",
      icon: Users,
      colour : "red",
    },
    {
      title: "3,247",
      subtitle: "Total Courses",
      data: "8",
      icon: BookOpen,
      colour : "green",
    },
    {
      title: "$12.5M",
      subtitle: "Platrom Revenue",
      data: "15",
      icon: DollarSign,
      colour : "orange",
    },
    {
      title: "8,945",
      subtitle: "Active Sessions",
      data: "5",
      icon: Globe,
      colour : "blue",
    },
  ]

  const platforms = [
    {
      title : "User Management",
      icon : Users,
    },
    {
      title : "Review Courses",
      icon : BookOpen,
    },
    {
      title : "View Analytics",
      icon : ChartNoAxesCombined,
    },
    {
      title : "System Setings",
      icon : Settings,
    },
  ]

  const studentCards = [
    {
      title : "Total Students",
      icon : Users,
      subTitle : "+12% from last month",
      value : "2,380",
    },
    {
      title : "Active",
      icon : UserCheck,
      subTitle : "90.5% active rate",
      value : "2,156",
    },
    {
      title : "Pending",
      icon : UserX,
      subTitle : "Awaiting approval",
      value : "124",
    },
    {
      title : "This Month",
      icon : Plus,
      subTitle : "New registrations",
      value : "156",
    },
  ]





<div className="flex  h-screen w-full  flex-col gap-1 items-center bg-black/10">
          
          {/* navbar  */}
          <div className="bg-white w-full h-16 flex items-center justify-between px-7">
            <div>
              <SearchBar/>
            </div>
            <div className="flex gap-7 items-center">
              <Sun className=" hover:bg-green-600 w-12 h-12 rounded-xl p-3" size={32}/>
              <Bell className=" hover:bg-green-600 w-12 h-12 rounded-xl p-3" size={32}/>
              <div className="flex gap-1 hover:bg-green-600 px-2 py-1 rounded-xl">
                <User />
                <span>Super Admin</span>
                <ChevronDown />
              </div>
            </div>
          </div>
          {/* navbar  */}

          {/* dynamic area  */}
          <div className="w-full h-screen overflow-y-auto bg-slate-400">
            
          </div>
          {/* dynamic area  */}
        </div>










{activeItem === "Dashboard" && (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome to your dashboard! Add widgets and stats here.</p>
    </div>
  )}

  {activeItem === "Students" && (
    <div>
      <h1 className="text-2xl font-bold mb-4">Students</h1>
      <p>Manage student profiles, enrollment, and performance.</p>
    </div>
  )}

  {activeItem === "Teachers" && (
    <div>
      <h1 className="text-2xl font-bold mb-4">Teachers</h1>
      <p>Manage teacher accounts, assignments, and schedules.</p>
    </div>
  )}

  {activeItem === "University Staff" && (
    <div>
      <h1 className="text-2xl font-bold mb-4">University Staff</h1>
      <p>Manage administrative and operational staff details.</p>
    </div>
  )}

  {activeItem === "Referral Partners" && (
    <div>
      <h1 className="text-2xl font-bold mb-4">Referral Partners</h1>
      <p>Track and manage referral partner data.</p>
    </div>
  )}

  {activeItem === "Sub-Admins" && (
    <div>
      <h1 className="text-2xl font-bold mb-4">Sub-Admins</h1>
      <p>Manage sub-admin access and permissions.</p>
    </div>
  )}

  {activeItem === "Course Management" && (
    <div>
      <h1 className="text-2xl font-bold mb-4">Course Management</h1>
      <p>Create, edit, and manage all courses.</p>
    </div>
  )}

  {activeItem === "Course Monitoring" && (
    <div>
      <h1 className="text-2xl font-bold mb-4">Course Monitoring</h1>
      <p>Monitor course progress and completion rates.</p>
    </div>
  )}

  {activeItem === "Content Monitoring" && (
    <div>
      <h1 className="text-2xl font-bold mb-4">Content Monitoring</h1>
      <p>Review and approve course content.</p>
    </div>
  )}

  {activeItem === "Notifications" && (
    <div>
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <p>Manage system and user notifications.</p>
    </div>
  )}

  {activeItem === "Finance & Settlement" && (
    <div>
      <h1 className="text-2xl font-bold mb-4">Finance & Settlement</h1>
      <p>View and process financial transactions and settlements.</p>
    </div>
  )}

  {activeItem === "Special 1" && (
    <div>
      <h1 className="text-2xl font-bold mb-4">Special 1</h1>
      <p>Custom specialized feature 1 page.</p>
    </div>
  )}

  {activeItem === "Special 2" && (
    <div>
      <h1 className="text-2xl font-bold mb-4">Special 2</h1>
      <p>Custom specialized feature 2 page.</p>
    </div>
  )}


  <div className=" w-full  flex gap-5 p-5">
                      
                      {/* aletr system */}
                      <div className=" shadow-2xl h-[480px] w-full rounded-2xl flex flex-col p-5 gap-2">
                        <div className="flex items-center justify-start gap-2">
                          <AlertTriangle />
                          <span className="font-bold"> System Alerts</span>
                        </div>
                        <div className="flex flex-col w-full h-full  rounded-xl items-center p-2 gap-2 overflow-y-auto">
                          {alerts.map((alert, index) => (
                          <AlertCard key={index} title={alert.title} btn_name={alert.btn_name} subtitle={alert.subtitle} data={alert.data}/>
                          ))}
                        </div>           
                      </div>
        
                      <div className=" shadow-2xl h-[480px] w-full rounded-2xl flex flex-col p-5 gap-2">
                        <div className="flex items-center justify-start gap-2">
                          <AlertTriangle />
                          <span className="font-bold"> System Alerts</span>
                        </div>
                        <div className="flex flex-col w-full h-full  rounded-xl items-center p-2 gap-2 overflow-y-auto">
                          {alerts.map((alert, index) => (
                          <AlertCard key={index} title={alert.title} btn_name={alert.btn_name} subtitle={alert.subtitle} data={alert.data}/>
                          
                          ))}
                        </div>           
                      </div>          
                  </div>