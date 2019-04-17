<template>
  <div id="div-notification-detail" class="vs-con-loading__container">
    <vs-checkbox v-model="showFilter">Show Filter</vs-checkbox>

    <div v-if="showFilter">
      <vs-row>
        <vs-col vs-offset="10" vs-type="flex" vs-justify="center" vs-align="center" vs-w="2">
          <vs-button class="mt-4" type="border" @click="getNotificationData">Filter</vs-button>
        </vs-col>
      </vs-row>
      <vs-row class="mt-4">
        <vs-col vs-w="2" vs-type="flex" vs-justify="center" vs-align="center">
          <vs-input class="inputx" placeholder="Days" v-model="filter.days"/>
        </vs-col>
        <vs-col vs-w="2" vs-type="flex" vs-justify="center" vs-align="center">
          <vs-input class="inputx" placeholder="Id" v-model="filter.id"/>
        </vs-col>
        <vs-col vs-w="2" vs-type="flex" vs-justify="center" vs-align="center">
          <vs-input class="inputx" placeholder="Status" v-model="filter.status"/>
        </vs-col>
        <vs-col vs-w="2" vs-type="flex" vs-justify="center" vs-align="center">
          <vs-input class="inputx" placeholder="Type" v-model="filter.type"/>
        </vs-col>
        <vs-col vs-w="2" vs-type="flex" vs-justify="center" vs-align="center">
          <vs-input class="inputx" placeholder="Template" v-model="filter.template"/>
        </vs-col>
        <vs-col vs-w="2" vs-type="flex" vs-justify="center" vs-align="center">
          <vs-input class="inputx" placeholder="Subject" v-model="filter.subject"/>
        </vs-col>
      </vs-row>

      <vs-row class="mt-4">
        <vs-col vs-w="3" vs-type="flex" vs-justify="center" vs-align="center">
          <vs-input class="inputx" placeholder="First Name" v-model="filter.firstName"></vs-input>
        </vs-col>
        <vs-col vs-w="3" vs-type="flex" vs-justify="center" vs-align="center">
          <vs-input class="inputx" placeholder="Last Name" v-model="filter.lastName"></vs-input>
        </vs-col>
        <vs-col vs-w="3" vs-type="flex" vs-justify="center" vs-align="center">
          <vs-input class="inputx" placeholder="Email To" v-model="filter.emailTo"></vs-input>
        </vs-col>
        <vs-col vs-w="3" vs-type="flex" vs-justify="center" vs-align="center">
          <vs-input class="inputx" placeholder="Email From" v-model="filter.emailFrom"></vs-input>
        </vs-col>
      </vs-row>
    </div>

    <vs-row class="mt-4">
      <vs-col vs-w="4" vs-type="flex" vs-justify="center" vs-align="center">
        <span class="mr-2">Count:</span>
        <span class="font-semibold">{{count}}</span>
      </vs-col>
      <vs-col vs-w="4" vs-type="flex" vs-justify="center" vs-align="center">
        <span class="mr-2">Sent:</span>
        <span class="font-semibold">{{sentCount}}</span>
      </vs-col>
      <vs-col vs-w="4" vs-type="flex" vs-justify="center" vs-align="center">
        <span class="mr-2">Failed:</span>
        <span class="font-semibold">{{failedCount}}</span>
      </vs-col>
    </vs-row>

    <vs-table :data="statisticData" class="mt-4">
      <template slot="thead">
        <vs-th>Notification Management</vs-th>
        <vs-th>Administration</vs-th>
        <vs-th>Awareness</vs-th>
        <vs-th>Data Driven Event</vs-th>
        <vs-th>Data Feed</vs-th>
        <vs-th>Discussion Forum</vs-th>
        <vs-th>Mail Merge</vs-th>
        <vs-th>Workflow</vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
          <vs-td>{{tr.notificationManagement}}</vs-td>
          <vs-td>{{tr.administration}}</vs-td>
          <vs-td>{{tr.awareness}}</vs-td>
          <vs-td>{{tr.dataDrivenEvent}}</vs-td>
          <vs-td>{{tr.dataFeed}}</vs-td>
          <vs-td>{{tr.discussionForum}}</vs-td>
          <vs-td>{{tr.mailMerge}}</vs-td>
          <vs-td>{{tr.workflow}}</vs-td>
        </vs-tr>
      </template>
    </vs-table>

    <vs-table :data="detailData" class="mt-4">
      <template slot="thead">
        <vs-th>Id</vs-th>
        <vs-th>Timestamp</vs-th>
        <vs-th>Status</vs-th>
        <vs-th>Type</vs-th>
        <vs-th>Template</vs-th>
        <vs-th>Subject</vs-th>
        <vs-th>Recipient</vs-th>
        <vs-th>Email To</vs-th>
        <vs-th>Email From</vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
          <vs-td>{{tr.Id}}</vs-td>
          <vs-td>{{tr.CreateDate}}</vs-td>
          <vs-td>{{tr.Status}}</vs-td>
          <vs-td>{{tr.Type}}</vs-td>
          <vs-td>{{tr.Template}}</vs-td>
          <vs-td>{{tr.Subject}}</vs-td>
          <vs-td>{{tr.RecipientFirstName + tr.RecipientLastName}}</vs-td>
          <vs-td>{{tr.RecipientEmail}}</vs-td>
          <vs-td>{{tr.FromAddress}}</vs-td>
        </vs-tr>
      </template>
    </vs-table>
  </div>
</template>

<script>
import io from "socket.io-client";
import { SERVER_URL } from "../../utils/constant";
import { getFromStorage } from "../../utils";

export default {
  data() {
    return {
      showFilter: false,
      filter: {
        days: 1,
        id: "",
        status: "",
        type: "",
        template: "",
        subject: "",
        firstName: "",
        lastName: "",
        emailTo: "",
        emailFrom: ""
      },
      statisticData: [
        {
          notificationManagement: 0,
          administration: 0,
          awareness: 0,
          dataDrivenEvent: 0,
          dataFeed: 0,
          discussionForum: 0,
          mailMerge: 0,
          workflow: 0
        }
      ],
      detailData: [],
      socket: io(SERVER_URL),
      database: this.$route.params.database,
      count: 0,
      sentCount: 0,
      failedCount: 0,
      arriveResponse: false,
      timer: null
    };
  },
  computed: {
    user() {
      return getFromStorage("user");
    }
  },
  mounted() {
    this.getNotificationData();
    this.responseSocket();
    this.checkResponse();
  },
  methods: {
    getNotificationData() {
      this.$vs.loading({
        container: "#div-notification-detail",
        scale: 0.6
      });
      const data = {
        userId: this.user.id,
        archerId: getFromStorage("archerId"),
        instance: this.database,
        filter: this.filter
      };
      this.socket.emit("REQ_INSTANCE_NOTIFICATION_DETAIL", data);
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.user.id);
      });
      this.socket.on("RES_INSTANCE_NOTIFICATION_DETAIL", data => {
        console.log("response from RES_INSTANCE_NOTIFICATION_DETAIL");
        console.log(data);

        this.detailData = data;
        for (const detail of data) {
          if (detail.Type === "Notification Management") {
            this.statisticData[0]["notificationManagement"] += 1;
          } else if (detail.Type === "Administration") {
            this.statisticData[0]["administration"] += 1;
          } else if (detail.Type === "Awareness") {
            this.statisticData[0]["awareness"] += 1;
          } else if (detail.Type === "Data Driven Event") {
            this.statisticData[0]["dataDrivenEvent"] += 1;
          } else if (detail.Type === "DataFeed Job Status Notification") {
            this.statisticData[0]["dataFeed"] += 1;
          } else if (detail.Type === "Discussion Forum") {
            this.statisticData[0]["discussionForum"] += 1;
          } else if (detail.Type === "Mail Merge Job") {
            this.statisticData[0]["mailMerge"] += 1;
          } else if (detail.Type === "Workflow") {
            this.statisticData[0]["workflow"] += 1;
          }

          if (detail.Status === "Sent") {
            this.sentCount++;
          } else {
            this.failedCount++;
          }
        }

        this.count = data.length;

        this.$vs.loading.close("#div-notification-detail > .con-vs-loading");
        this.arriveResponse = true;
      });
    },
    checkResponse() {
      const vm = this;
      setTimeout(() => {
        if (!vm.arriveResponse) {
          vm.$vs.loading.close("#div-notification-detail > .con-vs-loading");
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