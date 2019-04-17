<template>
  <div>
    <vs-card>
      <vs-row>
        <vs-tabs vs-position="left" id="sidebar">
          <vs-tab
            v-for="(tab, index) in tabs"
            :key="index"
            :vs-label="tab.label"
            @click="selectTab = tab.component"
          >
            <keep-alive>
              <component :is="selectTab"></component>
            </keep-alive>
          </vs-tab>
        </vs-tabs>
      </vs-row>
    </vs-card>
  </div>
</template>

<script>
import Reports from "./Reports.vue";
import InstanceSummary from "./InstanceSummary.vue";
import InstallationHistory from "./InstallationHistory.vue";
import FileRepository from "./FileRepository.vue";
import Applications from "./Applications.vue";
import Solutions from "./Solutions.vue";
import ValuesList from "./ValuesList.vue";
import TopFieldHistories from "./TopFieldHistories.vue";
import Datafeeds from "./Datafeeds.vue";
import UsersGroupsRoles from "./UsersGroupsRoles.vue";
import LoginHistory from "./LoginHistory.vue";
import ConcurrentUserPeak from "./ConcurrentUserPeak.vue";
import JobsCompleted from "./JobsCompleted.vue";
import JobQueued from "./JobQueued.vue";
import JobEngines from "./JobEngines.vue";
import InstanceDb from "./InstanceDb.vue";
import TablesByRowCount from "./TablesByRowCount.vue";
import TablesByTableSize from "./TablesByTableSize.vue";
import Datatables from "./DataTables.vue";
import InstallationReport from "./InstallationReport.vue";
import SqlServer from "./SqlServer.vue";
import Windows from "./Windows.vue";
import WindowsService from "./WindowsService.vue";

export default {
  components: {
    Reports,
    InstanceSummary,
    InstallationHistory,
    FileRepository,
    Applications,
    Solutions,
    ValuesList,
    TopFieldHistories,
    Datafeeds,
    UsersGroupsRoles,
    LoginHistory,
    ConcurrentUserPeak,
    JobsCompleted,
    JobQueued,
    JobEngines,
    InstanceDb,
    TablesByRowCount,
    TablesByTableSize,
    Datatables,
    InstallationReport,
    SqlServer,
    Windows,
    WindowsService
  },
  data() {
    return {
      selectTab: "Reports",
      tabs: [
        { label: "Reports", component: "Reports" },
        { label: "Instance Summary", component: "InstanceSummary" },
        { label: "Installation History", component: "InstallationHistory" },
        { label: "File Repository", component: "FileRepository" },
        { label: "Applications", component: "Applications" },
        { label: "Solutions", component: "Solutions" },
        { label: "Values List", component: "ValuesList" },
        { label: "Top 10 Field Histories", component: "TopFieldHistories" },
        { label: "Datafeeds", component: "Datafeeds" },
        { label: "Users, Groups and Roles", component: "UsersGroupsRoles" },
        { label: "Login History", component: "LoginHistory" },
        {
          label: "Top 5 Concurrent User Peaks",
          component: "ConcurrentUserPeak"
        },
        { label: "JobsCompleted", component: "JobsCompleted" },
        { label: "JobQueued", component: "JobQueued" },
        { label: "JobEngines", component: "JobEngines" },
        { label: "Instance DB", component: "InstanceDb" },
        { label: "Tables By RowCount", component: "TablesByRowCount" },
        { label: "Tables By TableSize", component: "TablesByTableSize" },
        { label: "Data Tables", component: "Datatables" },
        { label: "Installation Report", component: "InstallationReport" },
        { label: "Sql Server", component: "SqlServer" },
        { label: "Windows", component: "Windows" },
        { label: "WindowsService", component: "WindowsService" }
      ]
    };
  }
};
</script>

<style src="../../../node_modules/handsontable/dist/handsontable.full.css"></style>
<style lang="scss" scoped>
</style>