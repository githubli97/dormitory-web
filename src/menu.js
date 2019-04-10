var menus = [
  {
    action: "home",
    title: "首页",
    path:"/index",
    items: [{ action: "equalizer", title: "统计", path: "/dashboard" }]
  },
  {
    action: "domain",
    title: "产籍管理",
    path:"/asset",
    items: [
      { action: "location_city", title: "公寓管理", path: "/apartment" },
      { action: "equalizer", title: "宿舍管理", path: "/room" },
      { action: "equalizer", title: "统计", path: "/asset_statistics" }
    ]
  },
  {
    action: "check",
    title: "检查管理",
    path:"/check",
    items: [
      { action: "equalizer", title: "卫生管理", path: "/sanitation" },
      { action: "equalizer", title: "住宿管理", path: "/sleep" },
      { action: "equalizer", title: "检查统计", path: "/check_statistics" }
    ]
  },
  {
    action: "settings",
    title: "权限管理",
    path:"/authority",
    items: [
      { action: "equalizer", title: "权限管理", path: "/list" },
      { action: "equalizer", title: "角色管理", path: "/role" },
      { action: "equalizer", title: "人员管理", path: "/member" }
    ]
  },
  {
    action: "more_horiz",
    title: "更多",
    path:"/other",
    items: [
      { action: "equalizer", title: "饮水预定", path: "/water" },
      { action: "equalizer", title: "公告管理", path: "/notice" }
    ]
  }
]

export default menus;
