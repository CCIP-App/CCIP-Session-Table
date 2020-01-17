<template>
  <div
    class="ccip-app ccip-session-table"
    :style="{
      'grid-template-columns': gridColString,
      'grid-template-rows': gridRowString
    }"
  >
    <div
      v-for="time in timeline"
      :key="`time-${time}`"
      :style="{
        'grid-column-start': 'TIME',
        'grid-row-start': `T${time}`
      }"
      class="ccip-app ccip-session-block timeblock"
    >
      <p>{{ `${time.slice(0, 2)}:${time.slice(2, 4)}` }}</p>
    </div>
    <div
      v-for="session in sessions"
      :key="`session-${session.id}`"
      :style="{
        'grid-column-start': processSessionRoom(session).start,
        'grid-column-end': processSessionRoom(session).end,
        'grid-row-start': `T${timeParser(session.start)}`,
        'grid-row-end': `T${timeParser(session.end)}`
      }"
      class="ccip-app ccip-session-block session-block"
    >
      <p class="ccip-app ccip-session-tags">
        <span
          v-for="tag in session.tags"
          :key="`tag-${tag}`"
          class="ccip-app ccip-session-tag"
        >
          {{ getTag(tag).zh.name }}
        </span>
      </p>
      <h2 class="ccip-app ccip-session-title">{{ session.zh.title }}</h2>
      <p class="ccip-app ccip-session-speakers">
        <span
          v-for="speaker in session.speakers"
          :key="`speaker-${speaker}`"
          class="ccip-app ccip-session-speaker"
        >
          {{ getSpeaker(speaker).zh.name }}
        </span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import _ from 'lodash';

import { IRoom, ISessionData, ISession, ITag, ISpeaker } from './types/session';

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

  @Prop({
    required: false
  })
  private rooms!: IRoom['id'][];

  private sessions: ISession[] = this.sessionData.sessions;
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
    if (
      !this.rooms ||
      typeof this.rooms === 'undefined' ||
      this.rooms.length === 0
    ) {
      this.rooms = _.map(this.sessionData.rooms, 'id');
    }
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
      )
    );
  }

  private processSessionRoom(
    session: ISession
  ): { start: IRoom['id']; end?: IRoom['id'] } {
    if (session.broadcast && typeof session.broadcast !== 'undefined') {
      return {
        start: (_.first(this.rooms) ===
        _.first(_.map(this.sessionData.rooms, 'id'))
          ? _.first(session.broadcast)
          : _.includes(session.broadcast, _.first(this.rooms))
          ? _.first(this.rooms)
          : _.first(session.broadcast)) as string,
        end:
          _.last(session.broadcast) === _.last(this.rooms)
            ? 'END'
            : this.rooms[_.indexOf(this.rooms, _.last(session.broadcast)) + 1]
      };
    } else {
      return {
        start: session.room
      };
    }
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

  private getSpeaker(id: ISpeaker['id']): ISpeaker {
    return _.find(this.sessionData.speakers, ['id', id]) as ISpeaker;
  }

  private getTag(id: ITag['id']): ITag {
    return _.find(this.sessionData.tags, ['id', id]) as ITag;
  }
}
</script>

<style lang="scss" scoped>
@import './scss/main.scss';
</style>
