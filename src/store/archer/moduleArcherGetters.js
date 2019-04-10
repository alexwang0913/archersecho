export default {
  sidebarItems(state) {
    // console.log(state.archers);
    const items = [
      {
        url: "/",
        name: "Home",

        icon: "HomeIcon"
      },
      {
        url: "team-management",
        name: "Team Management",
        icon: "UsersIcon"
      },
      {
        url: "helpdesk-ticket",
        name: "HelpDesk Ticket",
        icon: "Share2Icon"
      },
      {
        url: "add-wizard",
        name: "Add Wizard",
        icon: "PackageIcon"
      },
      {
        url: "/archer-management",
        name: "Archer Management",
        slug: "archer-management",
        icon: "CloudIcon"
      },
      {
        header: "Archers"
      }
    ];
    for (const archer of state.archers) {
      items.push({
        url: null,
        name: archer.name,
        icon: "AwardIcon",
        id: archer._id,
        submenu: [
          {
            url: "/device-management/" + archer._id,
            name: "Devices"
          },
          {
            url: "/instance-management/" + archer._id,
            name: "Instances"
          },
          {
            url: "/configuration-information/" + archer._id,
            name: "Configuration Information"
          },
          {
            url: "/error-logs/" + archer._id,
            name: "Error Logs"
          },
          {
            url: "/statistics",
            name: "Statistics"
          },
          {
            url: "/support-ticket",
            name: "Support Ticket"
          },
          {
            url: "/configuration-report",
            name: "Configuration Report"
          }
        ]
      });
    }
    return items;
  }
};
