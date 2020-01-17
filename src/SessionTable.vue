<template>
  <div
    class="ccip-app ccip-session-table"
    :style="{
      'grid-template-columns': gridColString,
      'grid-template-rows': gridRowString
    }"
  ></div>
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

  private sessions: ISession[] = this.sessionData.sessions;
  private rooms: IRoom['id'][] = [];
  private timeline: string[] = [];
  private gridColString: string = '';
  private gridRowString: string = '';

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

    this.timeline = _.orderBy(
      _.uniq(
        _.map(
          _.concat(sessionStartTimeCollection, sessionEndTimeCollection),
          this.timeParser
        )
      ),
      this.timelineParser,
      'desc'
    );
  }

  private measureTableGrid() {
    this.gridColString = `[TIME] 60px [${_.join(
      this.rooms,
      '] 1fr ['
    )}] 1fr [END]`;

    this.gridRowString = `[HEAD] auto [T${_.join(
      this.timeline,
      '] auto [T'
    )}] auto [TAIL]`;
  }

  private timeParser(datetime: Date | string): string {
    return new Date(datetime)
      .toLocaleTimeString('en-US', {
        timeZone: 'Asia/Taipei',
        hour12: false
      })
      .replace(/:/g, '');
  }

  private timelineParser(datetime: Date | string): number {
    return parseInt(this.timeParser(datetime));
  }
}
</script>

<style lang="scss" scoped>
@import './scss/main.scss';
</style>
