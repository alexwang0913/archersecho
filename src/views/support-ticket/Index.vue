<template>
  <div id="div-support-ticket" class="vs-con-loading__container">
    <vx-card>
      <vs-select class="selectExample" v-model="instance" label="Select instances">
        <vs-select-item
          :key="index"
          :value="item.database"
          :text="item.name"
          v-for="(item,index) in instances"
        />
      </vs-select>

      <vs-button class="mt-4" @click="generateTicket">Generate</vs-button>

      <vs-textarea
        v-if="showTicketMsg"
        class="mt-4"
        rows="15"
        label="Email template to RSA"
        v-model="ticketMessage"
      />

      <vs-table max-items="10" pagination :data="ticketList" class="mt-4">
        <template slot="thead">
          <vs-th>Temp username</vs-th>
          <vs-th>Temp userpassword</vs-th>
          <vs-th>Login status</vs-th>
          <vs-th>Active status</vs-th>
          <vs-th>Action</vs-th>
        </template>

        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>{{tr.userName}}</vs-td>
            <vs-td>{{tr.password}}</vs-td>
            <vs-td>
              <vs-chip
                :color="tr.isLogin ? 'success' : 'warning'"
              >{{tr.isLogin ? "Logged in" : "Never logged in"}}</vs-chip>
            </vs-td>
            <vs-td>
              <vs-switch v-model="tr.isActive" @click="updateTicketActiveStatus(tr)"/>
            </vs-td>
            <vs-td>
              <feather-icon
                icon="MailIcon"
                class="cursor-pointer"
                svgClasses="w-5 h-5 mr-4"
                @click="viewEmail(tr._id)"
              ></feather-icon>
              <feather-icon
                icon="TrashIcon"
                class="cursor-pointer"
                svgClasses="w-5 h-5 mr-4"
                @click="confirmDialog(tr._id)"
              ></feather-icon>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </vx-card>
  </div>
</template>

<script>
import io from "socket.io-client";
import { SERVER_URL } from "../../utils/constant";
import { getFromStorage } from "../../utils";

import archerApi from "../../api/archer";
import ticketApi from "../../api/supportTicket";
export default {
  data() {
    return {
      socket: io(SERVER_URL),
      user: getFromStorage("user"),
      archerId: this.$route.params.id,

      instances: [],
      instance: null,
      ticketMessage: "",
      ticketList: [],
      showTicketMsg: false,

      resCount: 0,
      ticketInfo: {},
      ticketIdToDelete: null
    };
  },
  mounted() {
    this.responseSocket();
    this.getInstances();
    this.getSupportTickets();
  },
  methods: {
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.user.id);
      });
      this.socket.on("RES_SUPPORT_TICKET", response => {
        console.log("response from SupportTicket");
        console.log(response);
        this.ticketInfo.id = response.id;
        this.ticketInfo.userName = response.tempUserName;
        this.ticketInfo.password = response.tempPassword;
        if (++this.resCount === 3) {
          this.generateMail();
        }
      });
      this.socket.on("RES_SUPPORT_TICKET_PRODUCTION", response => {
        console.log("response from SupportTicketProduction");
        console.log(response);
        this.ticketInfo.production = response;
        if (++this.resCount === 3) {
          this.generateMail();
        }
      });
      this.socket.on("RES_SUPPORT_TICKET_VERSION", response => {
        console.log("response from SupportTicketVersion");
        console.log(response);
        this.ticketInfo.version = response;
        if (++this.resCount === 3) {
          this.generateMail();
        }
      });
      this.socket.on("RES_GET_SUPPORT_TICKET_MAIL", mail => {
        this.ticketMessage = mail;
        this.$vs.loading.close("#div-support-ticket > .con-vs-loading");
        this.showTicketMsg = true;
      });
    },
    async getInstances() {
      this.$vs.loading({
        container: "#div-support-ticket",
        scale: 0.6,
        type: "radius"
      });
      this.instances = await archerApi.getInstances(this.archerId);
      this.$vs.loading.close("#div-support-ticket > .con-vs-loading");
    },
    generateTicket() {
      this.$vs.loading({
        container: "#div-support-ticket",
        scale: 0.6,
        type: "radius"
      });
      const data = {
        archerId: this.archerId,
        instance: this.instance,
        userId: this.user.id
      };
      this.socket.emit("REQ_SUPPORT_TICKET", data);
      this.socket.emit("REQ_SUPPORT_TICKET_PRODUCTION", data);
      this.socket.emit("REQ_SUPPORT_TICKET_VERSION", data);
    },
    generateMail() {
      const link = window.location.origin + "/tempLogin";

      this.ticketMessage = `RSA,

The following instance needs support
License Key: 
Production/Non-Production: ${this.ticketInfo.production}
Version of Archer: ${this.ticketInfo.version}

The following URL will provide insight into the current Archer environment that is setup including Hardware Devices, Error Logs, and Services

Link: ${link}
Temporary Username: ${this.ticketInfo.userName}
Temporary Password: ${this.ticketInfo.password}
`;
      this.showTicketMsg = true;
      this.$vs.loading.close("#div-support-ticket > .con-vs-loading");

      const saveTicketData = {
        ticketId: this.ticketInfo.id,
        mail: this.ticketMessage
      };
      this.socket.emit("REQ_SAVE_SUPPORT_TICKET_MAIL", saveTicketData);
      this.resCount = 0;
      this.getSupportTickets();
    },
    async getSupportTickets() {
      this.ticketList = await archerApi.getSupportTickets(this.archerId);
      console.log(this.ticketList);
    },
    async updateTicketActiveStatus(ticket) {
      await ticketApi.update(ticket._id, {
        isActive: !ticket.isActive
      });

      this.getSupportTickets();
    },
    async viewEmail(ticketId) {
      console.log(ticketId);
      this.$vs.loading({
        container: "#div-support-ticket",
        scale: 0.6,
        type: "radius"
      });
      this.showTicketMsg = false;

      this.socket.emit("REQ_GET_SUPPORT_TICKET_MAIL", ticketId);
    },
    confirmDialog(ticketId) {
      this.ticketIdToDelete = ticketId;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm`,
        text: "Are you sure delete this ticket?",
        accept: this.deleteTicket
      });
    },
    async deleteTicket() {
      await ticketApi.deleteTicket(this.ticketIdToDelete);
      this.getSupportTickets();
      this.$vs.notify({
        color: "success",
        title: "Success",
        text: "Sucess in delete ticket"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>