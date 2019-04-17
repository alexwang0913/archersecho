<template>
  <div id="div-jobengine-detail" class="vs-con-loading__container">
    <vs-collapse type="border">
      <vs-collapse-item>
        <div slot="header">Running Jobs Details - {{runningJobsDetailData.length}}</div>
        <vs-table :data="runningJobsDetailData">
          <template slot="thead">
            <vs-th>Job Type</vs-th>
            <vs-th>Server</vs-th>
            <vs-th>Process</vs-th>
            <vs-th>Queued</vs-th>
            <vs-th>Started</vs-th>
            <vs-th>Elapsed</vs-th>
            <vs-th>Job Id</vs-th>
            <vs-th>Root Job Id</vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>{{tr['Job Type']}}</vs-td>
              <vs-td>{{tr['Server']}}</vs-td>
              <vs-td>{{tr['Process']}}</vs-td>
              <vs-td>{{tr['Queued']}}</vs-td>
              <vs-td>{{tr['Started']}}</vs-td>
              <vs-td>{{tr['Elapsed']}}</vs-td>
              <vs-td>{{tr['Job Id']}}</vs-td>
              <vs-td>{{tr['Root Job Id']}}</vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </vs-collapse-item>

      <vs-collapse-item>
        <div slot="header">Running Jobs Summary - {{runningJobsSummaryData.length}}</div>
        <vs-table :data="runningJobsSummaryData">
          <template slot="thead">
            <vs-th>Total</vs-th>
            <vs-th>Job Type</vs-th>
            <vs-th>Version</vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>{{tr['Total']}}</vs-td>
              <vs-td>{{tr['Job Type']}}</vs-td>
              <vs-td>{{tr['version']}}</vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </vs-collapse-item>

      <vs-collapse-item>
        <div slot="header">Available Jobs Summary - {{availableJobsSummaryData.length}}</div>
        <vs-table :data="availableJobsSummaryData">
          <template slot="thead">
            <vs-th>Total</vs-th>
            <vs-th>Job Type</vs-th>
            <vs-th>Version</vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>{{tr['Total']}}</vs-td>
              <vs-td>{{tr['Job Type']}}</vs-td>
              <vs-td>{{tr['version']}}</vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </vs-collapse-item>

      <vs-collapse-item>
        <div slot="header">All Jobs Summary - {{allJobsSummaryData.length}}</div>
        <vs-table :data="allJobsSummaryData">
          <template slot="thead">
            <vs-th>Total</vs-th>
            <vs-th>Job Type</vs-th>
            <vs-th>Version</vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>{{tr['Total']}}</vs-td>
              <vs-td>{{tr['Job Type']}}</vs-td>
              <vs-td>{{tr['version']}}</vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </vs-collapse-item>

      <vs-collapse-item>
        <div slot="header">Jobs Completed - Last 15days</div>
        <vue-apex-charts
          type="heatmap"
          height="350"
          :options="jobsCompletedHeatMap.chartOptions"
          :series="jobsCompletedHeatMap.series"
        ></vue-apex-charts>
      </vs-collapse-item>

      <vs-collapse-item>
        <div slot="header">Jobs Failed - Last 15days</div>
        <vue-apex-charts
          type="heatmap"
          height="350"
          :options="jobsFailedHeatMap.chartOptions"
          :series="jobsFailedHeatMap.series"
        ></vue-apex-charts>
      </vs-collapse-item>
    </vs-collapse>
  </div>
</template>

<script>
import io from "socket.io-client";
import { SERVER_URL } from "../../utils/constant";
import { getFromStorage } from "../../utils";
import VueApexCharts from "vue-apexcharts";

export default {
  components: { VueApexCharts },
  data() {
    return {
      socket: io(SERVER_URL),
      database: this.$route.params.database,

      runningJobsDetailData: [],
      runningJobsSummaryData: [],
      availableJobsSummaryData: [],
      allJobsSummaryData: [],
      jobsCompletedHeatMap: {
        series: [],
        chartOptions: {
          colors: ["#28C76F"],
          dataLabels: {
            enabled: false
          }
        }
      },
      jobsFailedHeatMap: {
        series: [],
        chartOptions: {
          colors: ["#EA5455"],
          dataLabels: {
            enabled: false
          }
        }
      },

      resCount: 0,
      arriveResponse: false,
      timer: null
    };
  },
  mounted() {
    this.getData();
    this.responseSocket();
    this.checkResponse();
  },
  computed: {
    user() {
      return getFromStorage("user");
    }
  },
  methods: {
    getData() {
      this.$vs.loading({
        container: "#div-jobengine-detail",
        scale: 0.6
      });

      const data = {
        userId: this.user.id,
        archerId: getFromStorage("archerId"),
        instance: this.database
      };
      this.socket.emit("REQ_RUNNING_JOB_DETAIL", data);
      this.socket.emit("REQ_RUNNING_JOBS_SUMMARY", data);
      this.socket.emit("REQ_AVAILABLE_JOB_SUMMARY", data);
      this.socket.emit("REQ_ALL_JOB_SUMMARY", data);
      this.socket.emit("REQ_JOB_COMPLETED", data);
      this.socket.emit("REQ_JOB_FAILED", data);
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.user.id);
      });
      this.socket.on("RES_RUNNING_JOB_DETAIL", response => {
        // console.log("response from RunningJobDetail");
        // console.log(response);
        this.runningJobsDetailData = response;

        if (++this.resCount === 6) {
          this.$vs.loading.close("#div-jobengine-detail > .con-vs-loading");
        }
        this.arriveResponse = true;
      });
      this.socket.on("RES_RUNNING_JOB_SUMMARY", response => {
        // console.log("response from RunningJobSummary");
        // console.log(response);
        this.runningJobsSummaryData = response;

        if (++this.resCount === 6) {
          this.$vs.loading.close("#div-jobengine-detail > .con-vs-loading");
        }
        this.arriveResponse = true;
      });
      this.socket.on("RES_AVAILABLE_JOB_SUMMARY", response => {
        // console.log("response from AvailableJobSummary");
        // console.log(response);
        this.availableJobsSummaryData = [];
        for (const data of response) {
          const strJobType = data["JobType"].split(",")[0];
          const strVersion = data["JobType"].split(",")[2];
          this.availableJobsSummaryData.push({
            Total: data["Total"],
            "Job Type": strJobType.substring(strJobType.lastIndexOf(".") + 1),
            version: strVersion.split("=")[1]
          });
        }

        if (++this.resCount === 6) {
          this.$vs.loading.close("#div-jobengine-detail > .con-vs-loading");
        }
        this.arriveResponse = true;
      });
      this.socket.on("RES_ALL_JOB_SUMMARY", response => {
        // console.log("response from RES_ALL_JOB_SUMMARY");
        // console.log(response);
        this.allJobsSummaryData = [];
        for (const data of response) {
          const strJobType = data["JobType"].split(",")[0];
          const strVersion = data["JobType"].split(",")[2];
          // console.log(strVersion)
          this.allJobsSummaryData.push({
            Total: data["Total"],
            "Job Type": strJobType.substring(strJobType.lastIndexOf(".") + 1),
            version: strVersion.split("=")[1]
          });
        }

        if (++this.resCount === 6) {
          this.$vs.loading.close("#div-jobengine-detail > .con-vs-loading");
        }
        this.arriveResponse = true;
      });
      this.socket.on("RES_JOB_COMPLETED", response => {
        // console.log("response from JobsComplted");
        // console.log(response);
        this.jobsCompletedHeatMap.series = [];
        for (const data of response) {
          this.jobsCompletedHeatMap.series.push({
            name: data.Week,
            data: [
              { x: "Sun", y: data.Sun },
              { x: "Mon", y: data.Mon },
              { x: "Tue", y: data.Tue },
              { x: "Wed", y: data.Wed },
              { x: "Thu", y: data.Thu },
              { x: "Fri", y: data.Fri },
              { x: "Sat", y: data.Sat },
              { x: "Weekly", y: data.Weekly }
            ]
          });
        }

        if (++this.resCount === 6) {
          this.$vs.loading.close("#div-jobengine-detail > .con-vs-loading");
        }
        this.arriveResponse = true;
      });
      this.socket.on("RES_JOB_FAILED", response => {
        // console.log("response from JobsFailed");
        // console.log(response);
        this.jobsFailedHeatMap.series = [];
        for (const data of response) {
          this.jobsFailedHeatMap.series.push({
            name: data.Week,
            data: [
              { x: "Sun", y: data.Sun },
              { x: "Mon", y: data.Mon },
              { x: "Tue", y: data.Tue },
              { x: "Wed", y: data.Wed },
              { x: "Thu", y: data.Thu },
              { x: "Fri", y: data.Fri },
              { x: "Sat", y: data.Sat },
              { x: "Weekly", y: data.Weekly }
            ]
          });
        }

        if (++this.resCount === 6) {
          this.$vs.loading.close("#div-jobengine-detail > .con-vs-loading");
        }
        this.arriveResponse = true;
      });
    },
    checkResponse() {
      const vm = this;
      setTimeout(() => {
        if (!vm.arriveResponse) {
          vm.$vs.loading.close("#div-jobengine-detail > .con-vs-loading");
          vm.$vs.notify({
            color: "warning",
            title: "Warning",
            text: "No response from server."
          });
        }
      }, 1000 * 10);
    }
  },
  beforeDestroy() {
    this.socket.disconnect();
  }
};
</script>

<style lang="scss" scoped>
</style>