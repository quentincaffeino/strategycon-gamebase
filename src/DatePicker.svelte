<script>
  import { createEventDispatcher, getContext, setContext } from "svelte";
  import { CalendarStyle } from "@beyonk/svelte-datepicker";
  import DateView from "@beyonk/svelte-datepicker/src/components/view/date-view/DateView.svelte";
  import { dayjs } from "@beyonk/svelte-datepicker/src/components/lib/date-utils";
  import {
    contextKey,
    setup,
  } from "@beyonk/svelte-datepicker/src/components/lib/context";
  import { createViewContext } from "@beyonk/svelte-datepicker/src/components/lib/view-context";

  const dispatch = createEventDispatcher();

  export let range = true;
  export let placeholder = "Choose Date";
  export let format = "DD / MM / YYYY";
  export let start = dayjs(0);
  export let end = dayjs().add(50, "year");
  export let trigger = null;
  export let selectableCallback = null;
  export let styling = new CalendarStyle();
  export let selected;
  export let closeOnFocusLoss = true;
  export let time = false;
  export let morning = 7;
  export let night = 19;
  export let minuteStep = 5;
  export let continueText = "Continue";

  const startContextKey = {};
  const endContextKey = {};

  const config = {
    start: dayjs(start),
    end: dayjs(end),
    isRangePicker: range,
    isTimePicker: time,
    closeOnFocusLoss,
    format,
    morning,
    night,
    selectableCallback,
    minuteStep: parseInt(minuteStep),
  };

  setContext(contextKey, setup(selected, config));
  const {
    selectedStartDate,
    selectedEndDate,
    isOpen,
    isClosing,
    highlighted,
    formatter,
    isDateChosen,
    isSelectingFirstDate,
  } = getContext(contextKey);

  setContext(startContextKey, createViewContext(true, getContext(contextKey)));
  setContext(endContextKey, createViewContext(false, getContext(contextKey)));

  function setRangeValue() {
    selected = [$selectedStartDate, $selectedEndDate];
    dispatch("range-selected", {
      from: $selectedStartDate.toDate(),
      to: $selectedEndDate.toDate(),
    });
  }

  function setDateValue() {
    selected = $selectedStartDate.toDate();
    dispatch("date-selected", {
      date: $selectedStartDate.toDate(),
    });
  }

  function swapDatesIfRequired() {
    if (!config.isRangePicker) {
      return;
    }
    const from = $selectedStartDate;
    const to = $selectedEndDate;
    if (to.isBefore(from)) {
      selectedStartDate.set(to);
      selectedEndDate.set(from);
    }
  }

  function addDate(e) {
    const { date } = e.detail;
    if ($isSelectingFirstDate) {
      selectedStartDate.set(date);
    } else {
      selectedEndDate.set(date);
    }
    swapDatesIfRequired();
    config.isRangePicker && isSelectingFirstDate.update((v) => !v);
  }

  $: {
    if ($isDateChosen) {
      config.isRangePicker ? setRangeValue() : setDateValue();
      dispatch("change");
    }
  }
</script>

<div class="">
  <DateView viewContextKey={startContextKey} on:chosen={addDate} />
  <DateView viewContextKey={endContextKey} on:chosen={addDate} />
  {JSON.stringify(selected)}
</div>

<style>
  div {
    width: 100%;
    background-color: white;
    border: 1px solid black;
  }
</style>
