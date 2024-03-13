import {computed, ref, watch} from 'vue'
import { useNow } from '@vueuse/core'
import { cloneDeep, sumBy, uniqueId } from "lodash-es";

export default () => {
  const hour = ref("00");
  const min = ref("00");
  const sec = ref("00");
  const isRunning = ref(false);

  const resetCurrent = () => {
    return {
      id: uniqueId(),
      startTimeMs: 0,
      endTimeMs: 0,
      totalMs: 0
    };
  }

  const currentTimer = ref(resetCurrent());
  const allEntries = ref([] as any);
  const { now, pause: pauseNow, resume: resumeNow } = useNow({controls: true, interval: 1000});
  pauseNow();
  
  const start = () => {
    currentTimer.value.startTimeMs = new Date().getTime();
    isRunning.value = true;
    resumeNow();
  }

  const stop = () => {
    currentTimer.value.endTimeMs = new Date().getTime();
    currentTimer.value.totalMs = currentTimer.value.endTimeMs - currentTimer.value.startTimeMs;
    allEntries.value.push(cloneDeep(currentTimer.value));
    currentTimer.value = resetCurrent();
    isRunning.value = false;
    pauseNow();
  }

  const totalMsOfAllEntries = computed(() => {
    return sumBy(allEntries.value, "totalMs")
  })

  const reset = () => {
    allEntries.value = [];
    hour.value = "00";
    min.value = "00";
    sec.value = "00";
  }

  const msToTime = (ms: number, returnFormatted: boolean = false) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

    if(returnFormatted) {
      return `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
    }

    hour.value = `${hours < 10 ? "0" : ""}${hours}`;
    min.value = `${minutes < 10 ? "0" : ""}${minutes}`;
    sec.value = `${seconds < 10 ? "0" : ""}${seconds}`;
  }

  const addEntry = (hour:number, minute: number) => {
    const ms = hour * 3600000 + minute *  60000;
    allEntries.value.push({
      id: uniqueId(),
      startTimeMs: 0,
      endTimeMs: 0,
      totalMs: ms
    });
    msToTime(totalMsOfAllEntries.value);
  }

  watch(now, (current:Date) => {
    if(!isRunning.value) return;
    var ms = (current.getTime() - currentTimer.value.startTimeMs) + totalMsOfAllEntries.value;
    msToTime(ms);
  });



  return {
    hour,
    min,
    sec,
    isRunning,
    allEntries,
    addEntry,
    start,
    stop,
    reset,
    msToTime
  }
}