<template>
  <div class="mt-4">
    <vx-card title="Join Team">
      <vs-table :data="joinTeamList" class="mt-4">
        <template slot="thead">
          <vs-th>Team Name</vs-th>
          <vs-th>Owner</vs-th>
          <vs-th>Status</vs-th>
          <vs-th></vs-th>
        </template>

        <template slot-scope="{data}">
          <vs-tr :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>{{tr.name}}</vs-td>
            <vs-td>
              <vs-chip>
                <vs-avatar></vs-avatar>
                {{tr.owner.userId}}
              </vs-chip>
            </vs-td>
            <vs-td>
              <vs-chip>{{tr.status === 0 ? 'Pending' : tr.status === 1? 'Accepted' : 'Rejected' }}</vs-chip>
            </vs-td>
            <vs-td>
              <div v-if="tr.status === 0">
                <vs-button color="success" class="mr-2" @click="acceptTeam(tr)">Accept</vs-button>
                <vs-button color="warning" @click="rejectTeam(tr)">Reject</vs-button>
              </div>
              <div v-if="tr.status === 1">
                <vs-button class="mr-2" @click="leaveTeam(tr)">Leave this team</vs-button>
              </div>
              <div v-if="tr.status === 2">
                <vs-button color="success" @click="acceptTeam(tr)">Accept</vs-button>
              </div>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </vx-card>
  </div>
</template>

<script>
import teamApi from "../../api/team";
import { getFromStorage } from "../../utils";
export default {
  data() {
    return {
      joinTeamList: [],
      userId: getFromStorage("user").id
    };
  },
  mounted() {
    this.getJoinTeamList();
  },
  methods: {
    async getJoinTeamList() {
      this.joinTeamList = await teamApi.getJoinTeam(this.userId);
      console.log(this.joinTeamList);
    },
    async acceptTeam(item) {
      const data = {
        status: 1,
        memberId: item.myId,
        teamId: item.id
      };
      await teamApi.updateMemberStatus(data);
      this.getJoinTeamList();
    },
    async rejectTeam(item) {
      const data = {
        status: 2,
        memberId: item.myId,
        teamId: item.id
      };
      await teamApi.updateMemberStatus(data);
      this.getJoinTeamList();
    },
    async leaveTeam(item) {
      if (confirm("Are you sure leave this team?")) {
        const data = {
          teamId: item.id,
          memberId: item.myId
        };
        await teamApi.removeMember(data);
        this.getJoinTeamList();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>