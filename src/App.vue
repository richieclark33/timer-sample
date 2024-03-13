<template>
  <div class="h-screen w-screen flex justify-center pt-24">
    <div>
    <div>Total time</div>
    <div class="flex items-baseline text-2xl">
      <div class="min-w-[110px]">{{hour}}:{{min}}:{{sec}}</div>
      <div class="ml-4">
        <button v-if="!isRunning" @click="start"><font-awesome-icon icon="fa-solid fa-play"/></button>
        <button v-else @click="stop"><font-awesome-icon icon="fa-solid fa-stop"/></button>
        <button class="ml-3" @click="reset"><font-awesome-icon icon="fa-solid fa-rotate-left"/></button>
        <button class="ml-3" @click="showManual = true">add entry</button>
      </div>
    </div>
    <div v-if="showManual" class="my-4 flex items-baseline">
      <input class="w-[60px] px-2 border border-gray-400" type="number" v-model="manualHour" placeholder="HH"/> : <input type="number" class="w-[60px] px-2 border border-gray-400" v-model="manualMinute" placeholder="MM"/>
      <div class="ml-4">
        <button @click="addManualTime" class="border-purple-700 bg-purple-600 border text-white px-8 py-1 rounded-md">Add</button>
        <button class="ml-4" @click="hideManualTime">cancel</button>
      </div>
    </div>
    <div v-if="allEntries.length">
      <button class="text-sm flex items-center" @click="showDetails = !showDetails">{{showDetails ? "hide" : "show" }} details <font-awesome-icon class="transform transition ml-2" :class="{'rotate-180': !showDetails}" icon="fa-solid fa-chevron-up"/></button>
    </div>
    <div class="mt-8" v-if="showDetails">
      <div v-if="allEntries.length">Entries</div>
      <div class="grid grid-cols-2" v-for="item in allEntries" :key="item.id">
        <div class="flex">
          <template v-if="item.startTimeMs !== 0">
            <div>{{ displayTime(item.startTimeMs) }}</div>
            <div>-</div>
            <div>{{ displayTime(item.endTimeMs) }}</div>
          </template>
          <div v-else>
            Manual Entry
          </div>
        </div>
        <div class="ml-4">{{ msToTime(item.totalMs, true) }}</div>
      </div>
    </div>
 
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useTimer from "@/composables/useTimer";
import { isNumber, isNil, isNaN, eq } from "lodash-es";

const { hour, min, sec, isRunning, allEntries, addEntry, start, stop, reset, msToTime } = useTimer();
const showDetails = ref(false);
const showManual = ref(false);
const manualHour = ref(null);
const manualMinute = ref(null);
const displayTime = (ms:number) => {
  return new Date(ms).toLocaleTimeString();
}

const parseNumber = (value: any, defaultValue = NaN) => { return isNumber(value) || (!isNil(value) && !isNaN(value) && !eq(value, '')) ? Number(value) : defaultValue; }
const resetManualTime = () => {
  manualHour.value = null;
  manualMinute.value = null;
}
const addManualTime = () => {
  showManual.value = false;
  
  addEntry(parseNumber(manualHour.value, 0), parseNumber(manualMinute.value, 0));
  resetManualTime();
}

const hideManualTime = () => {
  showManual.value = false;
  resetManualTime();
}

</script>