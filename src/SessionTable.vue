<template>
  <div class="ccip ccip-session-table"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import _ from 'lodash';

import { IRoom, ISessionData, ISession } from './types/session';

@Component
export default class CCIPSessionTable extends Vue {
  @Prop({
    default: false,
    required: false
  })
  private isPopup!: boolean;

  @Prop({
    required: true
  })
  private sessionData!: ISessionData;

  private sessions!: ISession[];
  private rooms!: IRoom['id'][];
  private timeline!: string[];
  private gridColString!: string;
  private gridRowString!: string;

  public created() {
    this.preProcessSessionData();
  }

  private preProcessSessionData() {
    this.processRoomData();
    this.processTimelineData();
    this.measureTableGrid();
  }

  private processRoomData() {
    this.rooms = _.map(this.sessionData.rooms, 'id');
  }

  private processTimelineData() {
    const sessionStartTimeCollection: Date[] = _.map(
      this.sessionData.sessions,
      'start'
    );
    const sessionEndTimeCollection: Date[] = _.map(
      this.sessionData.sessions,
      'end'
    );

    this.timeline = _.map(
      _.sortedUniq(
        _.concat(sessionStartTimeCollection, sessionEndTimeCollection)
      ),
      this.timeParser
    );
  }

  private measureTableGrid() {
    this.gridColString = `[TIME] 60px ${_.join(this.rooms, ' 1fr ')} 1fr [END]`;

    this.gridRowString = `[HEAD] auto ${_.join(
      this.timeline,
      ' auto '
    )} auto [END]`;
  }

  private timeParser(datetime: Date | string): string {
    return new Date(datetime).toLocaleTimeString('en-US', {
      timeZone: 'Asia/Taipei',
      hour12: false
    });
  }
}
</script>

<style lang="scss" scoped>
@import './scss/main.scss';
</style>
